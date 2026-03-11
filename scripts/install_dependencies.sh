#!/bin/bash
# BeforeInstall hook — cài Node.js 20 (qua NVM), PM2, Nginx trên Amazon Linux 2
# Idempotent: chạy lại nhiều lần vẫn an toàn
# NOTE: NodeSource KHÔNG hỗ trợ AL2 cho Node.js >= 20 (glibc 2.26 < 2.28 yêu cầu)
#       Dùng NVM thay thế — cài vào /usr/local/nvm để tất cả users dùng được
set -e

echo "=== [install_dependencies] START ==="

NVM_DIR="/usr/local/nvm"
NODE_VERSION="20"

# ---- NVM ----
if [ ! -s "$NVM_DIR/nvm.sh" ]; then
  echo "Installing NVM..."
  mkdir -p "$NVM_DIR"
  # Lấy version NVM mới nhất từ GitHub
  NVM_LATEST=$(curl -s https://api.github.com/repos/nvm-sh/nvm/releases/latest | grep '"tag_name"' | cut -d'"' -f4)
  curl -o- "https://raw.githubusercontent.com/nvm-sh/nvm/${NVM_LATEST}/install.sh" | NVM_DIR="$NVM_DIR" bash
else
  echo "NVM already installed at $NVM_DIR, skipping."
fi

# Load NVM
export NVM_DIR="$NVM_DIR"
# shellcheck source=/dev/null
source "$NVM_DIR/nvm.sh"

# ---- Node.js 20 ----
if ! node --version 2>/dev/null | grep -q "^v${NODE_VERSION}"; then
  echo "Installing Node.js ${NODE_VERSION}..."
  nvm install "${NODE_VERSION}"
  nvm alias default "${NODE_VERSION}"
  nvm use default
else
  echo "Node.js $(node -v) already installed, skipping."
fi

# Tạo symlink để node/npm/pm2 dùng được toàn cục (không cần source nvm)
NODE_BIN_DIR="$(nvm which default | xargs dirname)"
ln -sf "$NODE_BIN_DIR/node"   /usr/local/bin/node   || true
ln -sf "$NODE_BIN_DIR/npm"    /usr/local/bin/npm    || true
ln -sf "$NODE_BIN_DIR/npx"    /usr/local/bin/npx    || true

# ---- PM2 ----
if ! command -v pm2 &>/dev/null; then
  echo "Installing PM2..."
  npm install -g pm2
  # Symlink pm2 cũng vào /usr/local/bin
  ln -sf "$NODE_BIN_DIR/pm2"  /usr/local/bin/pm2    || true
else
  echo "PM2 $(pm2 -v) already installed, skipping."
fi

# ---- Nginx ----
# AL2023 uses dnf and includes nginx in the default repo (no amazon-linux-extras)
# AL2  uses yum and requires amazon-linux-extras to enable nginx1
if ! command -v nginx &>/dev/null; then
  if command -v dnf &>/dev/null; then
    echo "Installing Nginx via dnf (Amazon Linux 2023)..."
    dnf install -y nginx
  else
    echo "Installing Nginx via amazon-linux-extras (Amazon Linux 2)..."
    amazon-linux-extras enable nginx1
    yum install -y nginx
  fi
else
  echo "Nginx $(nginx -v 2>&1 | head -1) already installed, skipping."
fi

# ---- Tạo thư mục deploy ----
mkdir -p /var/www/so-contest
chown ec2-user:ec2-user /var/www/so-contest

# ---- Enable Nginx khởi động cùng hệ thống ----
systemctl enable nginx

echo "=== [install_dependencies] DONE ==="
