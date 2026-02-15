import React from 'react';
import Link from 'next/link';
import { FacebookFilled, InstagramOutlined } from '@ant-design/icons';

export default function Footer() {
    return (
        <footer className="border-t border-slate-100 bg-slate-50 pt-20 pb-6">
            <div className="layout-container flex flex-col items-center">
                <div className="px-4 md:px-10 w-full max-w-[1200px] grid grid-cols-1 md:grid-cols-4 gap-12 mb-10">
                    <div className="col-span-1 md:col-span-1 flex flex-col gap-6">
                        <div className="flex items-center gap-2 text-slate-900">
                            <img src="/johns-tours-logo.png" alt="John's Tours Recruitment" className="h-16 w-auto object-contain" />
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed">Tuyển dụng nhân sự du lịch tại Phú Quốc, nơi phát triển sự nghiệp cùng John's Tours.</p>
                    </div>

                    <div className="col-span-1">
                        <h4 className="text-slate-900 font-bold mb-6 text-base">Khám phá</h4>
                        <ul className="flex flex-col gap-3 text-slate-500 text-sm">
                            <li><Link className="hover:text-primary transition-colors hover-underline" href="/about">Về chúng tôi</Link></li>
                            <li><Link className="hover:text-primary transition-colors hover-underline" href="/menu">Thực đơn &amp; Đồ uống</Link></li>
                            <li><Link className="hover:text-primary transition-colors hover-underline" href="/events">Sự kiện đặc biệt</Link></li>
                            <li><Link className="hover:text-primary transition-colors hover-underline" href="/collection">Thư viện ảnh</Link></li>
                        </ul>
                    </div>
                    <div className="col-span-1">
                        <h4 className="text-slate-900 font-bold mb-6 text-base">Liên hệ</h4>
                        <ul className="flex flex-col gap-4 text-slate-500 text-sm">
                            <li className="flex items-start gap-3">
                                <span className="material-symbols-outlined text-primary text-lg mt-0.5">location_on</span>
                                <span>Dự án Khu Lan Anh, Tổ 1, Khu Phố Cửa Lấp, Đặc khu Phú Quốc, Tỉnh An Giang, Việt Nam</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary text-lg">call</span>
                                <span>+84 948 xxx xxx</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-primary text-lg">schedule</span>
                                <span>Giờ mở cửa: Sắp ra mắt</span>
                            </li>
                        </ul>
                    </div>
                    <div className="col-span-1 h-48 rounded-2xl overflow-hidden bg-slate-200 relative group shadow-inner">
                        <div className="absolute inset-0 bg-center bg-cover opacity-80 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0 duration-500" data-alt="Map location of Phu Quoc island" data-location="Phu Quoc, Vietnam" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCdlOg8-YqAjBQcD48z3mBqDORJkwG4mQbBSq1Z1y9NxaE8Wk_e8g0L48V2gM7leklSwnVbQEpYFn5-Zbe2ZbO3RfDSXKaF5A1Y_acPM99EZKNNgORJNcjP7kte1PIBETiJMVZlW2oK1SmE-uV3YHWsElDhOROmfV5Aaj7YLAWVhEm3Q8rdJ-RvcblGZhzCx_96Di3QISfBMVkjeoG_DpJXgC8sQw3TkzuXG9WoGovGYfABnyznr7uUnKwuyEgOJvavL9R482Fw9UY")' }}>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center animate-ping absolute"></div>
                            <span className="material-symbols-outlined text-primary text-4xl drop-shadow-md relative z-10">pin_drop</span>
                        </div>
                    </div>
                </div>
                <div className="w-full max-w-[1200px] px-4 md:px-10 border-t border-slate-100 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-slate-400 text-xs font-medium">© {new Date().getFullYear()} John's Tours. All rights reserved.</p>
                    <div className="flex gap-8 text-slate-400 text-xs font-medium">
                        <a className="hover:text-slate-900 transition-colors hover-underline" href="#">Điều khoản</a>
                        <a className="hover:text-slate-900 transition-colors hover-underline" href="#">Chính sách bảo mật</a>
                    </div>
                </div>
            </div>
        </footer >
    );
}
