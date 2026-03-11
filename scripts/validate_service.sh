#!/bin/bash
# ValidateService hook — kiểm tra app đang chạy sau deploy
# Fail nếu không respond trong 30s → CodeDeploy rollback
set -e

echo "=== [validate_service] START ==="

MAX_RETRIES=6
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
pm2 logs so-contest-shop --lines 30 --nostream || true
exit 1
