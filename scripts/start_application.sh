#!/bin/bash
# ApplicationStart hook — cấu hình Nginx và start PM2
# CodeDeploy chạy script này trong non-interactive shell (không load ~/.bashrc)
# → phải load NVM và PATH thủ công
set -e

echo "=== [start_application] START ==="

APP_DIR="/var/www/so-contest"
APP_NAME="so-contest-shop"
NGINX_CONF="/etc/nginx/conf.d/so-contest.conf"
NVM_DIR="/usr/local/nvm"

# ---- Load NVM nếu node chưa có trong PATH ----
if ! command -v node &>/dev/null; then
  if [ -s "$NVM_DIR/nvm.sh" ]; then
    export NVM_DIR="$NVM_DIR"
    # shellcheck source=/dev/null
    source "$NVM_DIR/nvm.sh"
  fi
fi

# Đảm bảo symlinks /usr/local/bin tồn tại (fallback)
export PATH="/usr/local/bin:$PATH"

echo "Node version: $(node -v)"
echo "NPM  version: $(npm -v)"
echo "PM2  version: $(pm2 -v)"

# ---- Copy Nginx config ----
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

if [ -f "$REPO_ROOT/nginx/so-contest.conf" ]; then
  cp "$REPO_ROOT/nginx/so-contest.conf" "$NGINX_CONF"
  echo "Nginx config installed to $NGINX_CONF"
else
  echo "WARNING: nginx/so-contest.conf not found!"
fi

# ---- Test cú pháp Nginx và start/reload ----
nginx -t
if systemctl is-active --quiet nginx; then
  systemctl reload nginx
else
  systemctl start nginx
fi

# ---- Start ứng dụng với PM2 ----
cd "$APP_DIR"

# Next.js standalone: chạy trực tiếp node server.js
# PORT và HOSTNAME bắt buộc phải set cho standalone output
PORT=3000 HOSTNAME=127.0.0.1 pm2 start server.js \
  --name "$APP_NAME" \
  --env production \
  --update-env

# Lưu process list để pm2 tự restore sau reboot
pm2 save

# Cấu hình PM2 auto-start qua systemd (AL2 dùng systemd)
# Phải chạy command mà `pm2 startup` in ra
pm2 startup systemd -u ec2-user --hp /home/ec2-user | \
  grep -E "^sudo" | bash || true

echo "=== [start_application] DONE ==="

