#!/bin/bash
# ValidateService hook — kiểm tra app đang chạy sau deploy
# Fail nếu không respond trong 60s → CodeDeploy rollback
# NOTE: CodeDeploy chạy trong non-interactive shell → phải ensure PATH thủ công
set -e

echo "=== [validate_service] START ==="

# ---- Ensure /usr/local/bin (symlinks của pm2) có trong PATH ----
export PATH="/usr/local/bin:$PATH"

MAX_RETRIES=12
WAIT_SECONDS=5
URL="http://localhost:3000"

for i in $(seq 1 $MAX_RETRIES); do
  echo "Attempt $i/$MAX_RETRIES — checking $URL ..."
  if curl -sf --max-time 5 "$URL" > /dev/null; then
    echo "Application is UP and responding!"
    echo "=== [validate_service] DONE ==="
    exit 0
  fi
  echo "Not ready yet, waiting ${WAIT_SECONDS}s..."
  sleep "$WAIT_SECONDS"
done

echo "ERROR: Application did NOT start within $((MAX_RETRIES * WAIT_SECONDS))s!"
pm2 logs so-contest-shop --lines 50 --nostream || true
exit 1
