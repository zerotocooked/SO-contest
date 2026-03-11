#!/bin/bash
# ApplicationStop hook — dừng PM2 app trước khi CodeDeploy copy files mới
# Không fail nếu app chưa chạy (lần deploy đầu tiên)
set -e

echo "=== [stop_application] START ==="

APP_NAME="so-contest-shop"

if pm2 describe "$APP_NAME" &>/dev/null; then
  echo "Stopping $APP_NAME via PM2..."
  pm2 stop "$APP_NAME" || true
  pm2 delete "$APP_NAME" || true
else
  echo "$APP_NAME not running, nothing to stop."
fi

echo "=== [stop_application] DONE ==="
