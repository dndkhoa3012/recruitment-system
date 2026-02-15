'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { App } from 'antd';

export const dynamic = 'force-dynamic';

function ApplyContent() {
    const router = useRouter();
    const { message } = App.useApp();
    const searchParams = useSearchParams();
    const jobId = searchParams.get('jobId');

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: '',
        birthYear: '',
        phone: '',
        email: '',
        jobId: jobId || '',
        coverLetter: '',
        resume: null
    });

    const [jobs, setJobs] = useState([]);
    const [loadingJobs, setLoadingJobs] = useState(true);

    // Fetch jobs on mount
    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const response = await fetch('/api/jobs');
            if (response.ok) {
                const data = await response.json();
                // API returns array directly when no params
                setJobs(Array.isArray(data) ? data : (data.jobs || []));
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoadingJobs(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Check file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                message.error('Kích thước file không được vượt quá 5MB');
                return;
            }
            setFormData(prev => ({
                ...prev,
                resume: file
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.fullName || !formData.phone || !formData.email || !formData.jobId) {
            message.error('Vui lòng điền đầy đủ thông tin bắt buộc');
            return;
        }

        if (!formData.resume) {
            message.error('Vui lòng tải lên CV của bạn');
            return;
        }

        setLoading(true);

        try {
            // Upload resume
            const formDataUpload = new FormData();
            formDataUpload.append('file', formData.resume);

            const uploadResponse = await fetch('/api/upload', {
                method: 'POST',
                body: formDataUpload
            });

            if (!uploadResponse.ok) {
                throw new Error('Failed to upload resume');
            }

            const uploadResult = await uploadResponse.json();
            const resumeUrl = uploadResult.url;

            const response = await fetch('/api/candidates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    fullName: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    jobId: formData.jobId,
                    resume: resumeUrl,
                    coverLetter: formData.coverLetter,
                }),
            });

            if (response.ok) {
                message.success('Gửi hồ sơ thành công! Chúng tôi sẽ liên hệ bạn sớm.');
                // Reset form
                setFormData({
                    fullName: '',
                    birthYear: '',
                    phone: '',
                    email: '',
                    jobId: '',
                    coverLetter: '',
                    resume: null
                });
                // Redirect to jobs page after 2 seconds
                setTimeout(() => {
                    router.push('/jobs');
                }, 2000);
            } else {
                message.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
            }
        } catch (error) {
            console.error('Error submitting application:', error);
            message.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Background Decoration */}
            <div className="fixed bottom-0 left-0 w-full h-1/3 -z-10 opacity-40 pointer-events-none">
                <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 320">
                    <path d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" fill="#13ecda" fillOpacity="0.1"></path>
                </svg>
            </div>

            <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col md:max-h-[90vh] border border-gray-100">
                {/* Header */}
                <div className="px-8 pt-6 pb-3 flex justify-between items-start flex-shrink-0">
                    <div>
                        <span className="inline-block px-3 py-1 bg-teal-100 text-teal-600 text-[10px] font-bold rounded-full uppercase tracking-widest mb-3">
                            Thông tin ứng tuyển
                        </span>
                        <h1 className="text-2xl font-bold text-gray-900 leading-tight">Ứng tuyển với CV</h1>
                        <p className="mt-2 text-gray-500 text-sm">Vui lòng hoàn thiện các thông tin dưới đây</p>
                    </div>
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto px-8">
                    <form onSubmit={handleSubmit} className="space-y-4 pb-6">
                        {/* CV Upload */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Tải CV lên <span className="text-red-500">*</span>
                            </label>
                            <div className="relative group">
                                <input
                                    accept=".pdf,.doc,.docx"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    type="file"
                                    onChange={handleFileChange}
                                />
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 bg-gray-50 group-hover:border-teal-400 group-hover:bg-teal-50 transition-all">
                                    <div className="size-10 rounded-full bg-white shadow-sm flex items-center justify-center text-teal-500">
                                        <span className="material-symbols-outlined text-2xl">cloud_upload</span>
                                    </div>
                                    <p className="text-sm font-medium text-gray-700">
                                        {formData.resume ? formData.resume.name : 'Kéo thả hoặc nhấn để chọn tệp'}
                                    </p>
                                    <p className="text-xs text-gray-400">Định dạng PDF, DOC, DOCX (tối đa 5MB)</p>
                                </div>
                            </div>
                        </div>

                        {/* Job Position */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Chọn vị trí ứng tuyển <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none">work</span>
                                <select
                                    name="jobId"
                                    value={formData.jobId}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none appearance-none"
                                    style={{
                                        backgroundImage: 'url("data:image/svg+xml,%3csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3e%3cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'M6 8l4 4 4-4\'/%3e%3c/svg%3e")',
                                        backgroundPosition: 'right 0.5rem center',
                                        backgroundRepeat: 'no-repeat',
                                        backgroundSize: '1.5em 1.5em'
                                    }}
                                >
                                    <option value="">Chọn vị trí bạn muốn ứng tuyển</option>
                                    {jobs.map(job => (
                                        <option key={job.id} value={job.id}>{job.title}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Name and Birth Year */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">
                                    Họ và tên <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none">person</span>
                                    <input
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                                        placeholder="Nhập họ và tên"
                                        type="text"
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-700">Năm sinh</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none">calendar_today</span>
                                    <input
                                        name="birthYear"
                                        value={formData.birthYear}
                                        onChange={handleInputChange}
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                                        placeholder="VD: 1995"
                                        type="text"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Số điện thoại <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none">call</span>
                                <input
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                                    placeholder="Nhập số điện thoại liên lạc"
                                    type="tel"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl pointer-events-none">email</span>
                                <input
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none"
                                    placeholder="your.email@example.com"
                                    type="email"
                                />
                            </div>
                        </div>

                        {/* Cover Letter */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-700">Lời nhắn (không bắt buộc)</label>
                            <textarea
                                name="coverLetter"
                                value={formData.coverLetter}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all outline-none resize-none"
                                placeholder="Chia sẻ thêm về kinh nghiệm của bạn..."
                                rows="2"
                            ></textarea>
                        </div>
                    </form>
                </div>

                {/* Submit Button */}
                <div className="px-8 py-4 border-t border-gray-100 bg-white/50 backdrop-blur-sm flex-shrink-0">
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="w-full bg-teal-500 hover:bg-teal-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                        type="submit"
                    >
                        <span>{loading ? 'Đang gửi...' : 'Gửi hồ sơ ngay'}</span>
                        {!loading && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">send</span>}
                    </button>
                    <p className="mt-3 text-center text-[10px] text-gray-400">
                        Bằng việc nhấn "Gửi hồ sơ", bạn đồng ý với Điều khoản và Chính sách của chúng tôi.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function ApplyPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <ApplyContent />
        </Suspense>
    );
}
