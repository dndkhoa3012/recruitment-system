# John's Tours Recruitment Mobile App

Ứng dụng React Native (Expo) cho hệ thống tuyển dụng John's Tours.

## Yêu cầu
1. **Backend**: Web app (`recruitment`) phải đang chạy ở cổng 3000.
2. **Environment**:
    - Cần cài đặt `node`, `npm`.
    - Cần cài đặt Android Studio (cho Emulator) hoặc Xcode (cho iOS Simulator trên Mac).
    - Hoặc cài ứng dụng **Expo Go** trên điện thoại thật.

## Hướng dẫn chạy

### 1. Khởi động Backend (Web)
Mở terminal tại thư mục `recruitment`:
```bash
npm run dev
```
Đảm bảo backend chạy tại `http://localhost:3000`.

### 2. Khởi động Mobile App
Mở terminal mới tại thư mục `recruitment-mobile`:
```bash
npm install
npx expo start
```

### 3. Chọn môi trường chạy
Sau khi chạy lệnh trên, bạn sẽ thấy menu:
- Nhấn **`a`**: Chạy trên Android Emulator.
- Nhấn **`i`**: Chạy trên iOS Simulator.
- Quét mã QR bằng ứng dụng Camera (iOS) hoặc Expo Go (Android) để chạy trên điện thoại thật.

## Lưu ý quan trọng
- Nếu chạy trên **Android Emulator**, API URL mặc định là `http://10.0.2.2:3000/api` (đã cấu hình sẵn).
- Nếu chạy trên **iOS Simulator**, API URL là `http://localhost:3000/api`.
- Nếu chạy trên **Điện thoại thật**:
    1. Tìm địa chỉ IP LAN của máy tính (ví dụ: `192.168.1.5`).
    2. Sửa file `constants/Config.ts`:
       ```typescript
       export const API_URL = 'http://192.168.1.5:3000/api';
       ```
    3. Đảm bảo điện thoại và máy tính cùng mạng Wifi.
