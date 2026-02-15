"use client";

export default function HomePage() {
    return (
        <>
            {/* Hero Section */}
            <section className="relative w-full overflow-hidden flex items-center justify-center">
                <div className="px-6 lg:px-40 py-10 lg:py-20 max-w-[1440px] mx-auto w-full">
                    <div className="flex flex-col gap-10 lg:flex-row lg:items-center">
                        {/* Content Side */}
                        <div className="flex flex-col gap-8 flex-1 max-w-[600px]">
                            <div className="flex flex-col gap-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#13a4ec]/10 text-[#13a4ec] w-fit">
                                    <span className="material-symbols-outlined text-sm">campaign</span>
                                    <span className="text-xs font-bold tracking-wider uppercase">Đang tuyển dụng</span>
                                </div>
                                <h1 className="text-[#111618] dark:text-white text-4xl font-extrabold leading-[1.15] tracking-tight lg:text-6xl">
                                    Tuyển dụng nhân sự du lịch tại <span className="text-[#13a4ec]">Phú Quốc</span>
                                </h1>
                                <p className="text-[#617c89] dark:text-gray-400 text-lg lg:text-xl font-medium leading-relaxed">
                                    Gia nhập đội ngũ năng động và phát triển sự nghiệp tại đảo Ngọc. Chúng tôi tìm kiếm những cộng sự đam mê và nhiệt huyết.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-4">
                                <a href="/jobs">
                                    <button className="flex min-w-[160px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-[#13a4ec] text-white text-lg font-bold shadow-lg shadow-[#13a4ec]/30 hover:scale-105 transition-transform">
                                        <span className="truncate">Ứng tuyển ngay</span>
                                    </button>
                                </a>
                            </div>
                            <div className="flex items-center gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <div className="flex -space-x-3">
                                    <div className="size-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                        <img className="w-full h-full object-cover" alt="Employee 1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0d1CCXnsVwWDIoXU3S-kyRXrFlP0egobY8CnzN-mhc8qjyEZAOccm-mxMV1kPrloylOo2ojUxUbrOx1jr0KkuGSqRSij5ii6bIa_mttwOrYkVibvnHcXZMotne8tbJPXq7xHcVZlQKt1ZbpPfR2-QUY1HSkEn4xSoHZ2hPxT8PYDodP1U8hB4d3pYe5W1SvBMddrWWJJoiFNQS6oMqk6TI4NHo8fY6iPE3ITD80O0m_Des4mhoOqhU8XyAopRpLYOLlTub5B_UA" />
                                    </div>
                                    <div className="size-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                        <img className="w-full h-full object-cover" alt="Employee 2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB1ek_PrsPvL5G0x0oAeDTO7u3LKREnnrqlukGjSgZpwwS2bJCjtjCu4u1fQlXa06LrJNMCwVtQaUWZwa9FFRktBIXIk5wHGUGn5SuO7vU2GCD4xX0p6wP1mhqodTmOEHmiFVREyrv7gUemV1bWzgwNJ3kByx5xA0lpuDSx7myi0zKaQqJ-0DEBvo_z-1_8t0t3mbjuHuDIByfJqZRczpeAjYvrZT4mhug-2mJiPKA2gXVXPqsez7bD6YlWJMxSFjZ37oDfaups0Q" />
                                    </div>
                                    <div className="size-10 rounded-full border-2 border-white bg-gray-200 overflow-hidden flex items-center justify-center bg-[#13a4ec] text-white text-xs font-bold">
                                        +50
                                    </div>
                                </div>
                                <p className="text-sm text-[#617c89] dark:text-gray-400 font-medium">
                                    Hơn <span className="text-[#111618] dark:text-white font-bold">50+ nhân viên</span> vừa gia nhập trong tháng này
                                </p>
                            </div>
                        </div>
                        {/* Image Side */}
                        <div className="flex-1 relative">
                            <div className="relative w-full aspect-[4/3] lg:aspect-square rounded-3xl overflow-hidden shadow-2xl">
                                <img className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700" alt="Phú Quốc beach" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0spym9vxGhVO9AmJbF8dUf3GYaUNw1-H48ya3Vttm4khFbBe9gQ6ujZQjCBpyEUQ9F9_FG3e8OiW992uMX-ZjkTNQQmcfDR3IVOGMLrO3h5rvjsJqxmGr7PsTF0oEWWbtrqhk0mUw0Meb-Z23v32nakK2DWdbdwyrO9NQOX5p_WaekJn8SQVRr0--r777aOBwoWooCICE3VzEuhfISdMxztE0MDvxRqhQ_7HugWsYUiUJCHsiO70sSdjX5Xelf8pC9MuWqpseNg" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                            </div>
                            {/* Floating Cards */}
                            <div className="hidden lg:flex absolute -bottom-6 -left-6 bg-white dark:bg-[#101c22] p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 items-center gap-4 max-w-[240px]">
                                <div className="size-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined">payments</span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Lương thưởng</p>
                                    <p className="text-sm font-bold dark:text-white">Cạnh tranh & hấp dẫn</p>
                                </div>
                            </div>
                            <div className="hidden lg:flex absolute -top-6 -right-6 bg-white dark:bg-[#101c22] p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 items-center gap-4 max-w-[240px]">
                                <div className="size-12 rounded-xl bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                                    <span className="material-symbols-outlined">rocket_launch</span>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Cơ hội</p>
                                    <p className="text-sm font-bold dark:text-white">Thăng tiến nhanh chóng</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 lg:mt-24">
                        <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-white/5 p-8 hover:shadow-lg transition-shadow">
                            <div className="size-12 rounded-xl bg-[#13a4ec]/10 text-[#13a4ec] flex items-center justify-center">
                                <span className="material-symbols-outlined text-3xl">groups</span>
                            </div>
                            <h3 className="text-xl font-bold dark:text-white">Môi trường năng động</h3>
                            <p className="text-[#617c89] dark:text-gray-400 leading-relaxed">Làm việc cùng đội ngũ trẻ trung, sáng tạo và luôn hỗ trợ lẫn nhau trong mọi dự án.</p>
                        </div>
                        <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-white/5 p-8 hover:shadow-lg transition-shadow">
                            <div className="size-12 rounded-xl bg-[#13a4ec]/10 text-[#13a4ec] flex items-center justify-center">
                                <span className="material-symbols-outlined text-3xl">auto_awesome</span>
                            </div>
                            <h3 className="text-xl font-bold dark:text-white">Phúc lợi hấp dẫn</h3>
                            <p className="text-[#617c89] dark:text-gray-400 leading-relaxed">Chế độ bảo hiểm đầy đủ, thưởng hiệu quả công việc và các chuyến du lịch nghỉ dưỡng hàng năm.</p>
                        </div>
                        <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-white/5 p-8 hover:shadow-lg transition-shadow">
                            <div className="size-12 rounded-xl bg-[#13a4ec]/10 text-[#13a4ec] flex items-center justify-center">
                                <span className="material-symbols-outlined text-3xl">trending_up</span>
                            </div>
                            <h3 className="text-xl font-bold dark:text-white">Lộ trình rõ ràng</h3>
                            <p className="text-[#617c89] dark:text-gray-400 leading-relaxed">Chương trình đào tạo chuyên sâu giúp bạn nâng cao kỹ năng và tiến xa hơn trong sự nghiệp.</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
