# HƯỚNG DẪN VẬN HÀNH & CẬP NHẬT WEB TUYỂN DỤNG

Tài liệu này dùng để lưu trữ các lệnh quan trọng khi vận hành website Tuyển Dụng (Recruitment).

---

## 1. CẬP NHẬT TỰ ĐỘNG (Khuyên dùng) - "Một Chạm"

Thích hợp cho mọi trường hợp. Chỉ cần chạy lệnh này ở máy tính của anh:

```bash
./deploy.sh "Ghi chú cập nhật"
```
*   Tự động lưu code lên Git.
*   Tự động Build & Push lên VPS.
*   VPS tự phát hiện và cập nhật sau 5 phút.

---

## 2. CẬP NHẬT THỦ CÔNG TRÊN VPS (Tiết kiệm băng thông)

Thích hợp khi mạng yếu hoặc chỉ sửa chỉnh sửa nhỏ. VPS sẽ tự tải code về và tự build.

**Bước 1: SSH vào VPS**
```bash
ssh root@103.159.50.249
```
**Bước 2: Chạy lệnh cập nhật:**
```bash
cd /var/www/recruitment-system/recruitment && git pull origin main && docker compose pull && docker compose up -d
```

---

## 3. LỆNH CỨU HỘ KHẨN CẤP (Khi cần reset hoàn toàn)

Dùng khi web bị lỗi nặng hoặc muốn đảm bảo mọi thứ sạch sẽ nhất.

```bash
ssh root@103.159.50.249 "cd /var/www/recruitment-system/recruitment && docker compose down && docker compose pull && docker compose up -d"
```

---

## 4. CÁCH XEM TIẾN ĐỘ & LOGS

**Xem tiến độ Update (Watchtower):**
```bash
ssh root@103.159.50.249 "docker logs -f recruitment_watchtower"
```

**Xem logs (lỗi/trạng thái) của Web Tuyển Dụng:**
```bash
ssh root@103.159.50.249 "docker logs -f recruitment_app"
```

---

## 5. THÔNG TIN DATABASE (Để kết nối Navicat)

*   **Tab SSH:**
    *   **Host:** `103.159.50.249`
    *   **Port:** `22` (Quan trọng)
    *   **User:** `root`
    *   **Password:** (Mật khẩu VPS)

*   **Tab General:**
    *   **Host:** `localhost`
    *   **Port:** `3307`
    *   **User:** `recruitment`
    *   **Password:** `RecruitPass2024`

---

## *Ghi chú kỹ thuật (Cho Dev)*
-   **Đường dẫn project trên VPS:** `/var/www/recruitment-system/recruitment`
-   **Database:** MySQL 8.0 (Volume: `mysql_data`).