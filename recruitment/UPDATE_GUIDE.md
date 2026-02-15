# Hướng Dẫn Cập Nhật Website (Future Updates)

Sau này khi anh sửa code hoặc thêm tính năng mới, anh chỉ cần làm **3 bước đơn giản** này để cập nhật lên Server:

## 1. Tại máy cá nhân (Local)
Sau khi sửa code xong, hãy đẩy code lên GitHub:
```bash
git add .
git commit -m "Mô tả những gì đã sửa"
git push origin main
```

## 2. Tại Server (VPS)
Đăng nhập vào Server:
```bash
ssh root@103.159.50.249
cd recruitment
```

## 3. Cập Nhật & Khởi Động Lại
Chạy **duy nhất** 2 lệnh này để lấy code mới và chạy lại (Web sẽ tự động Build lại):
``cd /var/www/recruitment``
```bash
# 1. Lấy code mới nhất từ GitHub
git pull origin main

# 2. Build lại và khởi động (Chỉ tốn vài phút)
docker compose up -d --build
```
*(Lệnh này sẽ tự động chạy `npm install` và `prisma migrate` nếu cần)*

### Nếu gặp lỗi "npm error code ECONNRESET"
Đây là lỗi mạng khi tải dependencies. Dockerfile đã được cấu hình để tự động retry, nhưng nếu vẫn lỗi:

**Giải pháp 1:** Chạy lại lệnh build (thường sẽ thành công lần 2-3)
```bash
docker compose up -d --build
```

**Giải pháp 2:** Xóa cache Docker và build lại từ đầu
```bash
docker system prune -a
docker compose up -d --build
```

---
**Lưu ý:**
- Anh **KHÔNG** cần chỉnh sửa Nginx nữa (trừ khi đổi tên miền).
- Anh **KHÔNG** cần chỉnh sửa Database (Docker sẽ tự chạy migration nếu có).
- Web sẽ bị gián đoạn khoảng 30s - 1 phút trong lúc khởi động lại.

# 1. tắt next dev
kill $(lsof -t -i:3000)
# 2. chạy next dev
npm run dev 
# 3. chạy prisma studio
npx prisma studio
# 4. chạy prisma migrate
npx prisma migrate dev --name init
# 5. chạy prisma generate
npx prisma generate

# 6. chạy prisma db push
npx prisma db push

# 7. Tắt server
docker compose down

# 8. Chạy lại server
docker compose up -d --build

ssh -t root@103.159.50.249 "cd /var/www/recruitment && docker compose exec db mysql -u recruitment -pRecruitPass2024 recruitment_db -e \"INSERT INTO User (id, username, password, role, createdAt, updatedAt) VALUES (UUID(), 'admin', 'admin123', 'admin', NOW(), NOW());\" && echo '✅ Created Admin User'"

# 9. Tắt server
docker compose down

# 10. Chạy lại server
docker compose up -d --build

ssh root@103.159.50.249 "cd /var/www/recruitment && docker compose down --remove-orphans && docker compose up -d && echo '✅ All services restarted'"