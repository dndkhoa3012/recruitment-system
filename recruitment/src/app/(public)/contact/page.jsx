"use client";
import React from "react";

export default function ContactPage() {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Header Section - Minimalist */}
            <section className="w-full pt-10 pb-2 bg-white">
                <div className="px-4 md:px-10 flex flex-1 justify-center">
                    <div className="layout-content-container flex flex-col max-w-[1200px] flex-1 text-center items-center">
                        <h1 className="text-slate-900 text-4xl md:text-6xl font-black leading-tight tracking-[-0.02em] mb-6">
                            Liên Hệ <span className="text-primary">John's Tours</span>
                        </h1>
                        <p className="text-slate-500 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                            Để lại tin nhắn hoặc ghé thăm chúng tôi trực tiếp.
                        </p>
                    </div>
                </div>
            </section>

            {/* Content Section */}
            <section className="w-full py-16">
                <div className="px-4 md:px-10 flex flex-1 justify-center">
                    <div className="layout-content-container flex flex-col max-w-[1200px] flex-1">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Contact Info & Map */}
                            <div className="flex flex-col gap-8">
                                <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm">
                                    <h2 className="text-slate-900 text-2xl font-bold mb-6">Thông tin liên hệ</h2>
                                    <div className="flex flex-col gap-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                                <span className="material-symbols-outlined text-primary text-xl">location_on</span>
                                            </div>
                                            <div>
                                                <span className="block text-slate-900 font-bold mb-1">Địa chỉ</span>
                                                <p className="text-slate-500 text-sm leading-relaxed">
                                                    Dự án Khu Lan Anh, Tổ 1, Khu Phố Cửa Lấp,<br />
                                                    Đặc khu Phú Quốc, Tỉnh An Giang, Việt Nam
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                                <span className="material-symbols-outlined text-primary text-xl">call</span>
                                            </div>
                                            <div>
                                                <span className="block text-slate-900 font-bold mb-1">Điện thoại</span>
                                                <p className="text-slate-500 text-sm leading-relaxed">
                                                    +84 948 xxx xxx
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                                <span className="material-symbols-outlined text-primary text-xl">mail</span>
                                            </div>
                                            <div>
                                                <span className="block text-slate-900 font-bold mb-1">Email</span>
                                                <p className="text-slate-500 text-sm leading-relaxed">
                                                    airxxx@gmail.com
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                                                <span className="material-symbols-outlined text-primary text-xl">schedule</span>
                                            </div>
                                            <div>
                                                <span className="block text-slate-900 font-bold mb-1">Giờ mở cửa</span>
                                                <p className="text-slate-500 text-sm leading-relaxed">
                                                    Sắp ra mắt
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>

                            {/* Contact Form */}
                            <div className="flex flex-col gap-6">
                                <form className="p-8 rounded-2xl bg-white border border-slate-100 shadow-lg shadow-slate-200/50">
                                    <h2 className="text-slate-900 text-2xl font-bold mb-6">Gửi tin nhắn</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-bold text-slate-700">Họ và tên</label>
                                            <input type="text" placeholder="Nguyễn Văn A" className="h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-primary focus:bg-white transition-all text-slate-900 text-sm" />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-bold text-slate-700">Số điện thoại</label>
                                            <input type="tel" placeholder="0912 xxx xxx" className="h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-primary focus:bg-white transition-all text-slate-900 text-sm" />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 mb-6">
                                        <label className="text-sm font-bold text-slate-700">Email</label>
                                        <input type="email" placeholder="email@example.com" className="h-12 px-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-primary focus:bg-white transition-all text-slate-900 text-sm" />
                                    </div>
                                    <div className="flex flex-col gap-2 mb-6">
                                        <label className="text-sm font-bold text-slate-700">Nội dung</label>
                                        <textarea rows={4} placeholder="Bạn cần tư vấn về..." className="p-4 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:border-primary focus:bg-white transition-all text-slate-900 text-sm resize-none"></textarea>
                                    </div>
                                    <button className="w-full h-12 bg-primary hover:bg-primary-hover text-slate-900 font-bold rounded-xl shadow-lg shadow-green-500/20 transition-all transform hover:-translate-y-1">
                                        Gửi tin nhắn
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
