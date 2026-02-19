# Hướng Dẫn Cập Nhật Website (Phương Pháp Tối Ưu - Docker Hub)

Đây là cách **an toàn nhất và nhanh nhất** để cập nhật website Recuitment.
Chúng ta sẽ Build code ở máy tính cá nhân (mạnh mẽ) rồi đẩy lên mạng, VPS chỉ việc tải về chạy (nhẹ nhàng).

---

## 1. Chuẩn Bị Lần Đầu (Chỉ làm 1 lần duy nhất)

1.  **Đăng ký tài khoản Docker Hub**: [https://hub.docker.com/](https://hub.docker.com/) (Username ví dụ: `khoa3012`).
2.  **Đăng nhập trên máy tính cá nhân**:
    Mở Terminal và chạy:
    ```bash
    docker login
    ```
    *(Nhập username và password vừa tạo)*.

3.  **Đăng nhập trên VPS**:
    SSH vào VPS và cũng chạy lệnh tương tự:
    ```bash
    ssh root@103.159.50.249
    docker login
    ```

---

## 2. Quy Trình Cập Nhật (Làm mỗi khi sửa code)

Mỗi khi anh sửa code xong và muốn đẩy lên web mới:

### Bước 1: Build & Đẩy Code (Tại máy cá nhân)
Chạy lệnh này tại thư mục code trên máy tính của anh:

```bash
# 1. Build bản nén
docker build -t dndkhoa3012/recruitment-app:latest . --platform linux/amd64

# 2. Đẩy lên mạng
docker push dndkhoa3012/recruitment-app:latest
```
*(Lưu ý: `--platform linux/amd64` là bắt buộc để code chạy được trên VPS Linux).*

### Bước 2: Tải & Chạy (Tại VPS)
SSH vào VPS và chạy lệnh này:

```bash
ssh root@103.159.50.249

# Vào thư mục web
cd /var/www/recruitment-system/recruitment

# Tải bản mới về & Chạy lại
docker compose pull
docker compose up -d
```
**(Thế là xong! Web sẽ tự động cập nhật trong tích tắc).**

---

## 3. Cứu Hộ Khi VPS Bị Tắt (Lỗi 502)

Nếu lỡ tay làm sập VPS hoặc hết RAM khiến các web khác (`app.phuquoctrip.com`, `hr`, `fnb`...) bị tắt (lỗi 502), hãy làm theo các bước sau để bật lại:

### Cách 1: Hồi sinh tự động (Dùng PM2)
```bash
pm2 resurrect
```
*(Lệnh này sẽ bật lại tất cả các web chạy bằng Node.js như HR, Bar, VPS Proxy...)*.

### Cách 2: Bật thủ công (Nếu cách 1 không được)
Chạy lần lượt các lệnh sau:

```bash
# 1. Bật Proxy tổng (Quan trọng nhất)
cd /var/www/vps && pm2 start package.json --name vps

# 2. Bật Web chính
cd /var/www/app.phuquoctrip.com && pm2 start package.json --name app.phuquoctrip.com

# 3. Bật FNB & HR
cd /var/www/fnb && pm2 start package.json --name fnb
cd /var/www/hr && pm2 start package.json --name hr

# 4. Bật Backend Bar
cd /var/www/jt-bar-backend && pm2 start dist/src/main.js --name jt-bar-backend
```

---
**Lưu ý:**
-   Web Tuyển Dụng (`Recruitment`) chạy bằng **Docker**.
-   Các web cũ (`HR`, `FNB`, `Bar`...) chạy bằng **PM2**.
-   Hai hệ thống này chạy song song, không ảnh hưởng nhau nếu làm đúng quy trình trên.