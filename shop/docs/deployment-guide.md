# Deployment Guide — Linux Server

## Tổng Quan

Dự án **SO-contest Shop** là một ứng dụng **Next.js 16** (React 19) với Tailwind CSS v4, shadcn/ui và Zustand. Ứng dụng kết nối tới API [dummyjson.com](https://dummyjson.com) và không yêu cầu database hay backend riêng.

### Stack
| Thành phần | Phiên bản |
|---|---|
| Next.js | 16.1.6 |
| React | 19.2.3 |
| TypeScript | ^5 |
| Node.js (tối thiểu) | 20 LTS |

---

## Phương án Deploy

| Phương án | Mô tả | Phù hợp khi |
|---|---|---|
| **A. PM2 (Standalone)** | Chạy `next start` qua PM2, Nginx làm reverse proxy | VPS đơn giản, không cần container |
| **B. Docker + Nginx** | Container hoá toàn bộ, Nginx ở phía trước | Nhiều dịch vụ, cần tái sử dụng image |

---

## Yêu Cầu Hệ Thống

- **OS:** Ubuntu 22.04 LTS / Debian 12 hoặc tương đương
- **RAM:** Tối thiểu 1 GB (khuyến nghị 2 GB)
- **CPU:** 1 vCPU trở lên
- **Disk:** Tối thiểu 5 GB trống
- **Port:** 80, 443 (và 3000 nội bộ)

---

## Phương Án A — PM2 + Nginx (Khuyến Nghị cho VPS đơn giản)

### 1. Cài Đặt Môi Trường

```bash
# Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# Cài đặt Node.js 20 (qua NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Kiểm tra phiên bản
node -v   # v20.x.x
npm -v    # 10.x.x

# Cài PM2 toàn cục
sudo npm install -g pm2

# Cài Nginx
sudo apt install -y nginx

# Cài Git (nếu chưa có)
sudo apt install -y git
```

### 2. Clone & Cài Đặt Project

```bash
# Tạo thư mục ứng dụng
sudo mkdir -p /var/www/so-contest
sudo chown $USER:$USER /var/www/so-contest

# Clone repository
git clone <YOUR_REPO_URL> /var/www/so-contest
cd /var/www/so-contest/shop

# Cài đặt dependencies
npm install

# Build production
npm run build
```

> **Lưu ý:** Đảm bảo máy chủ có kết nối internet khi build (Next.js sẽ tải font Geist).

### 3. Cấu Hình Environment Variables

Tạo file `.env.local` trong thư mục `shop/`:

```bash
cat > /var/www/so-contest/shop/.env.local << 'EOF'
# Môi trường
NODE_ENV=production

# URL gốc của ứng dụng (thay bằng domain thực)
NEXT_PUBLIC_BASE_URL=https://your-domain.com
EOF
```

> **Lưu ý:** Hiện tại ứng dụng không yêu cầu env vars bắt buộc, nhưng nên khai báo `NEXT_PUBLIC_BASE_URL` cho production.

### 4. Chạy Ứng Dụng với PM2

```bash
cd /var/www/so-contest/shop

# Khởi động ứng dụng
pm2 start npm --name "so-contest-shop" -- start

# Lưu cấu hình PM2 để tự khởi động sau khi reboot
pm2 save
pm2 startup
# Chạy lệnh mà PM2 in ra (dạng: sudo env PATH=... pm2 startup ...)
```

**Kiểm tra trạng thái:**

```bash
pm2 status
pm2 logs so-contest-shop
```

Ứng dụng mặc định chạy tại `http://localhost:3000`.

### 5. Cấu Hình Nginx Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/so-contest
```

Nội dung file cấu hình:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Redirect HTTP -> HTTPS (bỏ comment sau khi có SSL)
    # return 301 https://$host$request_uri;

    location / {
        proxy_pass         http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Caching cho static assets của Next.js
    location /_next/static/ {
        proxy_pass http://localhost:3000/_next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
# Kích hoạt site
sudo ln -s /etc/nginx/sites-available/so-contest /etc/nginx/sites-enabled/

# Kiểm tra cú pháp
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 6. Cài SSL với Let's Encrypt (HTTPS)

```bash
sudo apt install -y certbot python3-certbot-nginx

# Lấy chứng chỉ (thay your-domain.com)
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Certbot sẽ tự động cập nhật cấu hình Nginx và tạo cron job gia hạn
```

---

## Phương Án B — Docker + Nginx

### 1. Cài Đặt Docker

```bash
sudo apt update
sudo apt install -y ca-certificates curl gnupg

sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Cho phép user hiện tại dùng docker không cần sudo
sudo usermod -aG docker $USER
newgrp docker
```

### 2. Dockerfile

Tạo file `shop/Dockerfile`:

```dockerfile
# Stage 1: Dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Tạo user phi-root
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy build artifacts
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
```

> **Lưu ý:** Dockerfile trên dùng Next.js `standalone` output. Cần bật trong `next.config.ts`:
>
> ```ts
> const nextConfig: NextConfig = {
>   output: "standalone",
>   // ... cấu hình hiện tại
> };
> ```

### 3. Docker Compose

Tạo file `docker-compose.yml` ở thư mục gốc repo:

```yaml
services:
  shop:
    build:
      context: ./shop
      dockerfile: Dockerfile
    container_name: so-contest-shop
    restart: unless-stopped
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_BASE_URL=https://your-domain.com
    ports:
      - "3000:3000"
    networks:
      - webnet

  nginx:
    image: nginx:alpine
    container_name: so-contest-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    depends_on:
      - shop
    networks:
      - webnet

networks:
  webnet:
    driver: bridge
```

Tạo file `nginx/default.conf`:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate     /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;

    location / {
        proxy_pass         http://shop:3000;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';
        proxy_set_header   Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. Build & Chạy

```bash
cd /path/to/repo

# Build và khởi động
docker compose up -d --build

# Kiểm tra logs
docker compose logs -f shop
```

---

## Quy Trình Cập Nhật Code (Deploy lại)

### Phương án A (PM2):

```bash
cd /var/www/so-contest

# Pull code mới
git pull origin main

# Cài dependencies (nếu có thay đổi)
cd shop && npm install

# Build lại
npm run build

# Restart ứng dụng (zero-downtime nếu dùng PM2 cluster)
pm2 restart so-contest-shop
```

### Phương án B (Docker):

```bash
cd /path/to/repo
git pull origin main

# Rebuild và restart container
docker compose up -d --build shop
```

---

## Kiểm Tra Sau Deploy

```bash
# Kiểm tra ứng dụng phản hồi
curl -I http://localhost:3000

# Kiểm tra qua domain
curl -I https://your-domain.com

# Xem logs real-time (PM2)
pm2 logs so-contest-shop --lines 50

# Xem logs real-time (Docker)
docker compose logs -f shop
```

### Các trang cần kiểm tra thủ công:

| Trang | URL | Kiểm tra |
|---|---|---|
| Trang chủ | `/` | Hiển thị sản phẩm từ API |
| Sản phẩm | `/products` | Danh sách + lọc |
| Chi tiết SP | `/products/1` | Hình ảnh, thông tin |
| Tìm kiếm | `/search?q=phone` | Kết quả tìm kiếm |
| Giỏ hàng | `/cart` | Thêm/xoá sản phẩm |
| Đăng nhập | `/login` | Form auth |

---

## Cấu Hình Tường Lửa (UFW)

```bash
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'   # port 80 và 443
# Không mở 3000 ra ngoài — chỉ Nginx truy cập nội bộ
sudo ufw enable
sudo ufw status
```

---

## Xử Lý Sự Cố Thường Gặp

| Vấn đề | Nguyên nhân | Giải pháp |
|---|---|---|
| Build thất bại với lỗi TypeScript | Type errors | Chạy `npm run lint` cục bộ trước khi push |
| App không hiển thị ảnh sản phẩm | `remotePatterns` thiếu domain | Thêm domain vào `next.config.ts` |
| Port 3000 đã được dùng | Tiến trình cũ còn chạy | `pm2 delete all` hoặc `fuser -k 3000/tcp` |
| Nginx 502 Bad Gateway | App chưa khởi động xong | Đợi 10-15 giây rồi thử lại |
| `EACCES permission denied` | Vấn đề quyền thư mục | `sudo chown -R $USER:$USER /var/www/so-contest` |

---

## Bảo Mật Khuyến Nghị

1. **Không commit file `.env.local`** vào Git (đã có trong `.gitignore` mặc định Next.js).
2. **Sử dụng người dùng phi-root** để chạy PM2 / Docker.
3. **Bật tường lửa UFW** và chỉ mở port cần thiết.
4. **Tự động gia hạn SSL** — Certbot tạo cron job tự động; kiểm tra bằng `sudo certbot renew --dry-run`.
5. **Cập nhật hệ thống định kỳ:** `sudo apt update && sudo apt upgrade -y`.

---

*Được tạo: 2026-03-11*
