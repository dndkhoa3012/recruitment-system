#!/bin/bash

# Script Deploy Nhanh "Thủ Công" - VPS tự build
# Nhanh hơn deploy.sh vì không cần build trên máy Mac hay upload lên Docker Hub
# Mất khoảng 2-3 phút thay vì 15 phút
# Yêu cầu: Đã cài SSH key hoặc phải nhập mật khẩu VPS

VPS_IP="103.159.50.249"
VPS_PATH="/var/www/recruitment-system/recruitment"

echo "🚀 Bắt đầu quy trình Deploy Nhanh..."

# 1. Lưu code lên Git
echo "📂 Đang lưu code lên Git..."
git add .
COMMIT_MSG="Auto deploy: $(date '+%Y-%m-%d %H:%M:%S')"
if [ ! -z "$1" ]; then
  COMMIT_MSG="$1"
fi
git commit -m "$COMMIT_MSG" || echo "⚠️  Không có thay đổi nào để commit."
git push origin main

# 2. SSH vào VPS, kéo code mới về và build trực tiếp trên VPS
echo "🖥️  Đang kết nối VPS và cập nhật..."
ssh root@$VPS_IP "
  set -e
  cd $VPS_PATH
  echo '📥 Kéo code mới về...'
  git pull origin main
  echo '🔨 Build image trực tiếp trên VPS...'
  docker compose up -d --build
  echo '✅ Hoàn tất!'
"

echo ""
echo "✅ DEPLOY NHANH HOÀN TẤT!"
echo "🌐 Website đã được cập nhật!"
