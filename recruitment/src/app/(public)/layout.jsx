"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { App } from "antd";

export default function PublicLayout({ children }) {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navLinks = [
        { href: "/", label: "Trang chủ" },
        { href: "/jobs", label: "Việc làm" },
        { href: "/about", label: "Văn hóa" },
    ];

    const isActive = (path) => pathname === path;

    return (
        <App>
            <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
                <div className="flex h-full grow flex-col">
                    {/* Navigation */}
                    <header className="sticky top-0 z-50 border-b border-solid border-[#f0f3f4] dark:border-[#1e2d35] bg-white/95 dark:bg-[#101c22]/95 backdrop-blur-md">
                        <div className="flex items-center justify-between whitespace-nowrap px-4 md:px-10 lg:px-40 py-4">
                            <Link href="/" className="flex items-center gap-3">
                                <div className="relative h-14 w-48">
                                    <Image
                                        src="/johns-tours-logo.png"
                                        alt="John's Tours Logo"
                                        fill
                                        className="object-contain object-left"
                                        priority
                                    />
                                </div>
                            </Link>
                            <div className="flex flex-1 justify-end gap-8 items-center">
                                {/* Desktop Nav */}
                                <nav className="hidden md:flex items-center gap-8">
                                    {navLinks.map(link => (
                                        <Link
                                            key={link.href}
                                            className={`text-sm font-semibold transition-colors ${isActive(link.href) ? 'text-[#13a4ec]' : 'text-[#111618] dark:text-gray-300 hover:text-[#13a4ec]'}`}
                                            href={link.href}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </nav>
                                {/* Mobile Hamburger */}
                                <button
                                    className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    aria-label="Toggle menu"
                                >
                                    <span className="material-symbols-outlined text-2xl text-[#111618] dark:text-white">
                                        {isMenuOpen ? 'close' : 'menu'}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Mobile Menu Drawer */}
                        {isMenuOpen && (
                            <div className="md:hidden border-t border-[#f0f3f4] dark:border-[#1e2d35] bg-white dark:bg-[#101c22] px-4 pb-4">
                                <nav className="flex flex-col gap-1 pt-2">
                                    {navLinks.map(link => (
                                        <Link
                                            key={link.href}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${isActive(link.href) ? 'bg-[#13a4ec]/10 text-[#13a4ec]' : 'text-[#111618] dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                            href={link.href}
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                </nav>
                            </div>
                        )}
                    </header>

                    {/* Main Content */}
                    <main className="flex-1">
                        {children}
                    </main>
                </div>
            </div>
        </App>
    );
}
