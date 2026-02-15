import { Plus_Jakarta_Sans, Noto_Sans } from "next/font/google";
import "./globals.css";
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, App } from 'antd';


const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const noto = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto", // Defined in globals.css @theme
  display: "swap",
});

export const metadata = {
  title: "Phu Quoc Travel Recruitment",
  description: "Tuyển dụng nhân sự du lịch tại Phú Quốc - Cơ hội nghề nghiệp tại đảo Ngọc",
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi" className={`${jakarta.variable} ${noto.variable}`} suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased bg-white text-slate-900 font-display" suppressHydrationWarning={true}>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#4ade80',
                borderRadius: 8,
              },
            }}
          >
            <App>
              {children}
            </App>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
