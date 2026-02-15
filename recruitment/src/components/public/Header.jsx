"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from 'antd';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const isActive = (path) => pathname === path ? "text-primary" : "text-slate-600 hover:text-primary";

    return (
        <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/90 border-b border-slate-100 shadow-sm">
            <div className="layout-container flex h-full grow flex-col">
                <div className="px-4 md:px-10 flex flex-1 justify-center py-4">
                    <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
                        <div className="flex items-center justify-between whitespace-nowrap">
                            <Link href="/" className="flex items-center gap-3 cursor-pointer group hover:opacity-90 transition-opacity animate-logo-entrance">
                                <img src="/johns-tours-logo.png" alt="John's Tours Recruitment" className="h-12 w-auto object-contain" />
                            </Link>

                            <div className="hidden md:flex flex-1 justify-end gap-8 items-center">
                                <div className="flex items-center gap-6 lg:gap-10">
                                    <Link className={`${isActive('/')} transition-colors text-sm font-semibold leading-normal hover-underline`} href="/">Trang chủ</Link>
                                    <Link className={`${isActive('/menu')} transition-colors text-sm font-semibold leading-normal hover-underline`} href="/menu">Thực đơn</Link>
                                    <Link className={`${isActive('/events')} transition-colors text-sm font-semibold leading-normal hover-underline`} href="/events">Sự kiện</Link>
                                    <Link className={`${isActive('/collection')} transition-colors text-sm font-semibold leading-normal hover-underline`} href="/collection">Thư viện</Link>
                                    <Link className={`${isActive('/contact')} transition-colors text-sm font-semibold leading-normal hover-underline`} href="/contact">Liên hệ</Link>
                                </div>
                                <Link href="/booking">
                                    <Button
                                        type="primary"
                                        shape="round"
                                        size="large"
                                        className="bg-primary hover:!bg-primary-hover border-none shadow-md shadow-green-500/20 font-bold text-slate-900"
                                    >
                                        Đặt bàn
                                    </Button>
                                </Link>
                            </div>

                            <div className="md:hidden text-slate-900 cursor-pointer" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                <span className="material-symbols-outlined text-3xl">menu</span>
                            </div>
                        </div>

                        {/* Mobile Menu */}
                        {isMenuOpen && (
                            <div className="md:hidden mt-4 pb-4 flex flex-col gap-4 border-t border-slate-100 pt-4 animate-in slide-in-from-top-2">
                                <Link className="text-slate-600 hover:text-primary font-semibold" href="/" onClick={() => setIsMenuOpen(false)}>Trang chủ</Link>
                                <Link className="text-slate-600 hover:text-primary font-semibold" href="/menu" onClick={() => setIsMenuOpen(false)}>Thực đơn</Link>
                                <Link className="text-slate-600 hover:text-primary font-semibold" href="/events" onClick={() => setIsMenuOpen(false)}>Sự kiện</Link>
                                <Link className="text-slate-600 hover:text-primary font-semibold" href="/collection" onClick={() => setIsMenuOpen(false)}>Thư viện</Link>
                                <Link className="text-slate-600 hover:text-primary font-semibold" href="/contact" onClick={() => setIsMenuOpen(false)}>Liên hệ</Link>
                                <div className="flex justify-center mt-2">
                                    <Link href="/booking" onClick={() => setIsMenuOpen(false)}>
                                        <Button type="primary" shape="round" size="large" className="w-full bg-primary text-slate-900 font-bold shadow-md">
                                            Đặt bàn
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
