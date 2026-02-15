"use client";

export default function AboutPage() {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-[#f6f7f8] dark:bg-[#101c22]">
            <main className="flex-1">
                {/* Hero Section */}
                <section className="mx-auto max-w-[1200px] px-6 py-12 text-center md:px-20 lg:py-20">
                    <div className="inline-block rounded-full bg-[#13a4ec]/10 px-4 py-1 text-sm font-bold text-[#13a4ec] mb-6">
                        GIA NHẬP ĐỘI NGŨ ĐẢO NGỌC
                    </div>
                    <h1 className="mx-auto mb-6 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl lg:text-6xl text-[#111618] dark:text-white">
                        Tại sao chọn làm việc cùng chúng tôi?
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-400">
                        Môi trường chuyên nghiệp tại Phú Quốc dành cho thế hệ trẻ năng động, mong muốn kiến tạo sự nghiệp trong ngành du lịch hàng đầu.
                    </p>
                </section>

                {/* Benefits Grid Section */}
                <section className="bg-white dark:bg-[#15252d] py-16 md:py-24">
                    <div className="mx-auto max-w-[1200px] px-6 md:px-20">
                        <div className="grid gap-8 md:grid-cols-3">
                            {/* Benefit 1 */}
                            <div className="group flex flex-col items-center rounded-2xl border border-gray-100 dark:border-gray-700 bg-[#f6f7f8] dark:bg-[#101c22] p-8 text-center transition-all hover:border-[#13a4ec]/50 hover:shadow-xl hover:shadow-[#13a4ec]/5">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#13a4ec]/10 text-[#13a4ec] transition-transform group-hover:scale-110">
                                    <span className="material-symbols-outlined text-4xl">group</span>
                                </div>
                                <h3 className="mb-3 text-xl font-bold text-[#111618] dark:text-white">Môi trường thân thiện</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    Đội ngũ trẻ trung, hòa đồng, gắn kết như gia đình. Văn hóa làm việc cởi mở và hỗ trợ lẫn nhau.
                                </p>
                            </div>

                            {/* Benefit 2 */}
                            <div className="group flex flex-col items-center rounded-2xl border border-gray-100 dark:border-gray-700 bg-[#f6f7f8] dark:bg-[#101c22] p-8 text-center transition-all hover:border-[#13a4ec]/50 hover:shadow-xl hover:shadow-[#13a4ec]/5">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#13a4ec]/10 text-[#13a4ec] transition-transform group-hover:scale-110">
                                    <span className="material-symbols-outlined text-4xl">payments</span>
                                </div>
                                <h3 className="mb-3 text-xl font-bold text-[#111618] dark:text-white">Thu nhập ổn định</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    Mức lương cạnh tranh, thưởng KPIs và đầy đủ các chế độ bảo hiểm, phúc lợi theo quy định.
                                </p>
                            </div>

                            {/* Benefit 3 */}
                            <div className="group flex flex-col items-center rounded-2xl border border-gray-100 dark:border-gray-700 bg-[#f6f7f8] dark:bg-[#101c22] p-8 text-center transition-all hover:border-[#13a4ec]/50 hover:shadow-xl hover:shadow-[#13a4ec]/5">
                                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#13a4ec]/10 text-[#13a4ec] transition-transform group-hover:scale-110">
                                    <span className="material-symbols-outlined text-4xl">school</span>
                                </div>
                                <h3 className="mb-3 text-xl font-bold text-[#111618] dark:text-white">Đào tạo chuyên nghiệp</h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    Lộ trình đào tạo bài bản từ cơ bản đến nâng cao. Cơ hội thăng tiến rõ ràng cho nhân sự tâm huyết.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Quick Apply Section */}
                <section className="py-16 md:py-28 relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 -z-10 opacity-5 dark:opacity-10">
                        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <pattern id="waves" patternUnits="userSpaceOnUse" width="100" height="100">
                                    <path d="M0 50 Q 25 25, 50 50 T 100 50" fill="none" stroke="currentColor" strokeWidth="2" />
                                </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill="url(#waves)" />
                        </svg>
                    </div>

                    <div className="mx-auto max-w-[1000px] px-6">
                        <div className="relative overflow-hidden rounded-3xl bg-[#13a4ec] px-8 py-12 text-center text-white shadow-2xl shadow-[#13a4ec]/30 md:px-16 md:py-20">
                            {/* Decorative circles */}
                            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
                            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-black/5" />

                            <div className="relative z-10">
                                <h2 className="mb-4 text-3xl font-extrabold tracking-tight md:text-5xl">Ứng tuyển nhanh – không cần CV</h2>
                                <p className="mx-auto mb-10 max-w-xl text-lg text-white/90">
                                    Đừng để thủ tục làm rào cản. Bạn chỉ cần để lại thông tin hoặc liên hệ trực tiếp, chúng tôi sẽ gọi lại ngay!
                                </p>
                                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row md:gap-6">
                                    <button className="flex w-full min-w-[240px] items-center justify-center gap-3 rounded-xl bg-white px-8 py-4 text-lg font-bold text-[#13a4ec] shadow-lg transition-transform hover:scale-105 active:scale-95 sm:w-auto">
                                        <span className="material-symbols-outlined">chat</span>
                                        Liên hệ qua Zalo
                                    </button>
                                    <button className="flex w-full min-w-[240px] items-center justify-center gap-3 rounded-xl bg-[#101c22]/20 px-8 py-4 text-lg font-bold text-white border border-white/30 backdrop-blur-sm transition-transform hover:scale-105 active:scale-95 sm:w-auto">
                                        <span className="material-symbols-outlined">call</span>
                                        Gọi ngay: 090x xxx xxx
                                    </button>
                                </div>
                                <p className="mt-8 text-sm font-medium text-white/70 italic">
                                    * Thời gian phản hồi dự kiến: Trong vòng 24h làm việc
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
