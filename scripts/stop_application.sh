#!/bin/bash
# ApplicationStop hook — dừng PM2 app trước khi CodeDeploy copy files mới
# Không fail nếu app chưa chạy (lần deploy đầu tiên)
# NOTE: CodeDeploy chạy trong non-interactive shell → phải ensure PATH thủ công
set -e

echo "=== [stop_application] START ==="

# ---- Ensure /usr/local/bin (symlinks của node/npm/pm2) có trong PATH ----
export PATH="/usr/local/bin:$PATH"

# Fallback: load NVM nếu symlink chưa có
NVM_DIR="/usr/local/nvm"
if ! command -v pm2 &>/dev/null && [ -s "$NVM_DIR/nvm.sh" ]; then
  # shellcheck source=/dev/null
  source "$NVM_DIR/nvm.sh"
fi

APP_NAME="so-contest-shop"

if command -v pm2 &>/dev/null && pm2 describe "$APP_NAME" &>/dev/null; then
  echo "Stopping $APP_NAME via PM2..."
  pm2 stop "$APP_NAME" || true
  pm2 delete "$APP_NAME" || true
else
  echo "$APP_NAME not running (or PM2 not installed), nothing to stop."
fi

echo "=== [stop_application] DONE ==="
