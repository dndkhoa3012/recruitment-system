"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function JobDetailPage() {
    const params = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const response = await fetch(`/api/jobs/${params.id}`);
                const data = await response.json();

                // Parse JSON fields with fallback for legacy string data
                let description, requirements, benefits;

                try {
                    description = typeof data.description === 'string' && data.description.startsWith('{')
                        ? JSON.parse(data.description)
                        : { intro: data.description || '', points: [] };
                } catch {
                    description = { intro: data.description || '', points: [] };
                }

                try {
                    requirements = typeof data.requirements === 'string' && data.requirements.startsWith('[')
                        ? JSON.parse(data.requirements)
                        : [];
                } catch {
                    requirements = [];
                }

                try {
                    benefits = typeof data.benefits === 'string' && data.benefits.startsWith('[')
                        ? JSON.parse(data.benefits)
                        : [];
                } catch {
                    benefits = [];
                }

                // Filter out empty/whitespace-only items
                if (description.points) {
                    description.points = description.points.filter(p => p && p.trim());
                }
                if (description.intro) {
                    description.intro = description.intro.trim() || '';
                }
                requirements = requirements.filter(r => {
                    if (typeof r === 'string') return r.trim();
                    return r && r.text && r.text.trim();
                });
                benefits = benefits.filter(b => {
                    if (typeof b === 'string') return b.trim();
                    return b && b.text && b.text.trim();
                });

                setJob({ ...data, description, requirements, benefits });
                setLoading(false);
            } catch (error) {
                console.error('Error fetching job:', error);
                setLoading(false);
            }
        };

        if (params.id) {
            fetchJob();
        }
    }, [params.id]);

    if (loading) {
        return (
            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="text-center text-gray-600">Đang tải...</div>
            </main>
        );
    }

    if (!job) {
        return (
            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="text-center text-gray-600">Không tìm thấy công việc</div>
            </main>
        );
    }

    return (
        <>
            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 py-8 pb-28">
                {/* Job Header Section */}
                <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm mb-6 border border-gray-100 dark:border-gray-800">
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="size-24 bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100 dark:border-gray-700">
                            <div
                                className="w-full h-full bg-cover bg-center"
                                style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAVgt1Q5AugIQe9tcDpOl9IvmV8ufml9jOyY9L2OitO_zKgATdbWM24-bzJwD9tT30yVzFBVZYUv7CYcTvElNemVETHAqYuKeEEfXBzdmrorBdm0W1v1JCaLizf-V6GxjiYgg-_zAGEnieVai6YRoTMnrjhCXbU7WnmL-EFkcXLeO1bhLpLPs5QwattncMOdrAxdupETALmd8OGi1Pxnph-3K6ctYG_JxPfvZTJdYzhJz0PdOG4FupttOnCSYcIJp9y9slHgzxKCA')" }}
                            />
                        </div>
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span className="px-2 py-1 bg-[#13a4ec]/10 text-[#13a4ec] text-xs font-bold rounded uppercase tracking-wider">
                                    {{
                                        'full-time': 'Toàn thời gian',
                                        'part-time': 'Bán thời gian',
                                        'contract': 'Hợp đồng',
                                        'internship': 'Thực tập'
                                    }[job.type] || job.type}
                                </span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">{job.title}</h2>
                            <p className="text-gray-600 dark:text-gray-400 font-medium mb-4">{job.department || job.category?.name}</p>
                            <div className="flex flex-wrap gap-4 mt-4">
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700">
                                    <span className="material-symbols-outlined text-[#13a4ec] text-[20px]">location_on</span>
                                    <span>{job.location}</span>
                                </div>
                                {job.salary && (
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700">
                                        <span className="material-symbols-outlined text-[#13a4ec] text-[20px]">payments</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">{job.salary}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700">
                                    <span className="material-symbols-outlined text-[#13a4ec] text-[20px]">group</span>
                                    <span>Số lượng: <span className="font-semibold text-gray-900 dark:text-white">{job.quantity || 1}</span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Job Details Content */}
                <div className="space-y-6">
                    {/* Description */}
                    {job.description && (job.description.intro || job.description.points?.length > 0) && (
                        <section className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#13a4ec]" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
                                Mô tả công việc
                            </h3>
                            <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
                                {job.description.intro && <p>{job.description.intro}</p>}
                                {job.description.points && job.description.points.length > 0 && (
                                    <ul className="space-y-3">
                                        {job.description.points.map((point, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <span className="material-symbols-outlined text-[#13a4ec] text-lg mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </section>
                    )}

                    {/* Requirements */}
                    {job.requirements && job.requirements.length > 0 && (
                        <section className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#13a4ec]" style={{ fontVariationSettings: "'FILL' 1" }}>assignment_turned_in</span>
                                Yêu cầu công việc
                            </h3>
                            <div className="space-y-3">
                                <div className="p-4 bg-[#f6f7f8] dark:bg-gray-800 rounded-lg border-l-4 border-[#13a4ec]">
                                    <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                                        {job.requirements.map((req, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <span className="material-symbols-outlined text-[#13a4ec] text-lg mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                                <span>{req}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Benefits */}
                    {job.benefits && job.benefits.length > 0 && (
                        <section className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#13a4ec]" style={{ fontVariationSettings: "'FILL' 1" }}>redeem</span>
                                Quyền lợi
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {job.benefits.map((benefit, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
                                        <span className="material-symbols-outlined text-[#13a4ec]" style={{ fontVariationSettings: "'FILL' 1" }}>
                                            {benefit.icon}
                                        </span>
                                        <span className="text-gray-700 dark:text-gray-300">{benefit.text}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </main>

            {/* Sticky Footer Actions */}
            <footer className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#101c22] border-t border-gray-200 dark:border-gray-800 p-4 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                <div className="max-w-4xl mx-auto">
                    <Link href={`/apply?jobId=${job.id}&jobTitle=${encodeURIComponent(job.title)}`}>
                        <button className="w-full flex items-center justify-center gap-2 bg-[#13a4ec] hover:bg-[#13a4ec]/90 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-[#13a4ec]/20 transition-transform active:scale-[0.98]">
                            Ứng tuyển ngay
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </Link>
                </div>
            </footer>
        </>
    );
}
