#!/bin/bash
# ApplicationStart hook — cấu hình Nginx và start PM2
# CodeDeploy chạy script này trong non-interactive shell (không load ~/.bashrc)
# → phải load NVM và PATH thủ công
set -e

echo "=== [start_application] START ==="

APP_DIR="/var/www/so-contest"
APP_NAME="so-contest-shop"
NGINX_CONF="/etc/nginx/conf.d/so-contest.conf"
NGINX_LOG_FORMAT_CONF="/etc/nginx/conf.d/so-contest-log-format.conf"
NVM_DIR="/usr/local/nvm"

# ---- Ensure /usr/local/bin (symlinks của node/npm/pm2) có trong PATH ----
export PATH="/usr/local/bin:$PATH"

# ---- Load NVM nếu node chưa có trong PATH ----
if ! command -v node &>/dev/null; then
  if [ -s "$NVM_DIR/nvm.sh" ]; then
    export NVM_DIR="$NVM_DIR"
    # shellcheck source=/dev/null
    source "$NVM_DIR/nvm.sh"
  fi
fi

echo "Node version: $(node -v)"
echo "NPM  version: $(npm -v)"
echo "PM2  version: $(pm2 -v)"

# ---- Copy Nginx configs ----
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(dirname "$SCRIPT_DIR")"

if [ -f "$REPO_ROOT/nginx/so-contest.conf" ]; then
  cp "$REPO_ROOT/nginx/so-contest.conf" "$NGINX_CONF"
  echo "Nginx config installed to $NGINX_CONF"
else
  echo "WARNING: nginx/so-contest.conf not found!"
fi

# Copy log_format definition (phải load trước so-contest.conf vì conf.d được include theo alphabet)
if [ -f "$REPO_ROOT/nginx/log_format.conf" ]; then
  cp "$REPO_ROOT/nginx/log_format.conf" "$NGINX_LOG_FORMAT_CONF"
  echo "Nginx log_format config installed to $NGINX_LOG_FORMAT_CONF"
else
  echo "WARNING: nginx/log_format.conf not found!"
fi

# ---- Test cú pháp Nginx và start/reload ----
nginx -t
if systemctl is-active --quiet nginx; then
  systemctl reload nginx
else
  systemctl start nginx
fi

# ---- Tạo thư mục log cho PM2 ----
mkdir -p /var/log/pm2
chown -R root:root /var/log/pm2

# ---- Start ứng dụng với PM2 ----
cd "$APP_DIR"

# Next.js standalone: chạy trực tiếp node server.js
# --interpreter node: đảm bảo dùng node binary trong PATH (không phụ thuộc shebang)
# PORT và HOSTNAME bắt buộc phải set cho standalone output
PORT=3000 HOSTNAME=127.0.0.1 pm2 start server.js \
  --name "$APP_NAME" \
  --interpreter node \
  --env production \
  --update-env \
  --output /var/log/pm2/so-contest-shop-out.log \
  --error  /var/log/pm2/so-contest-shop-error.log \
  --log-date-format "YYYY-MM-DD HH:mm:ss Z" \
  --merge-logs

# Lưu process list để pm2 tự restore sau reboot
pm2 save

# Cấu hình PM2 auto-start qua systemd
# CodeDeploy chạy as root → service name là pm2-root (không phải pm2-ec2-user)
NODE_PATH="$(which node | xargs dirname)"
env PATH="$NODE_PATH:/usr/local/bin:$PATH" pm2 startup systemd 2>&1 || true

# Enable và start pm2-root service
systemctl daemon-reload 2>/dev/null || true
systemctl enable pm2-root 2>/dev/null || true
systemctl start pm2-root 2>/dev/null || true

# ---- Áp dụng CloudWatch Agent config (inline — không phụ thuộc file deploy) ----
CW_CONFIG_DEST="/opt/aws/amazon-cloudwatch-agent/etc/amazon-cloudwatch-agent.d/file_amazon-cloudwatch-agent.json"
CW_CTL="/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl"

if [ -f "$CW_CTL" ]; then
  echo "Writing CloudWatch Agent config..."
  mkdir -p "$(dirname "$CW_CONFIG_DEST")"
  cat > "$CW_CONFIG_DEST" << 'CWEOF'
{
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [
          {
            "file_path": "/var/log/nginx/so-contest-access.log",
            "log_group_name": "aiops",
            "log_stream_name": "{instance_id}/nginx-access",
            "timestamp_format": "%d/%b/%Y:%H:%M:%S %z",
            "timezone": "UTC",
            "auto_removal": true
          },
          {
            "file_path": "/var/log/nginx/so-contest-error.log",
            "log_group_name": "aiops",
            "log_stream_name": "{instance_id}/nginx-error",
            "timezone": "UTC",
            "auto_removal": true
          },
          {
            "file_path": "/var/log/pm2/so-contest-shop-out.log",
            "log_group_name": "aiops",
            "log_stream_name": "{instance_id}/app-stdout",
            "timezone": "UTC",
            "auto_removal": true
          },
          {
            "file_path": "/var/log/pm2/so-contest-shop-error.log",
            "log_group_name": "aiops",
            "log_stream_name": "{instance_id}/app-stderr",
            "timezone": "UTC",
            "auto_removal": true
          }
        ]
      }
    }
  }
}
CWEOF
  "$CW_CTL" -a fetch-config -m ec2 -s -c "file:$CW_CONFIG_DEST"
  echo "CloudWatch Agent restarted with new config."
else
  echo "WARNING: CloudWatch Agent not found — skipping CW config apply."
fi

echo "=== [start_application] DONE ==="

