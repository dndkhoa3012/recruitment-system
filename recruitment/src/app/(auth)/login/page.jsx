"use client";
import { useState } from 'react';
import { GravityStars } from '@/components/public/GravityStars';
import { Input, Button, Form, App } from 'antd';
import { LockOutlined, UserOutlined, ArrowRightOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLoginPage() {
    const router = useRouter();
    const { message } = App.useApp();
    const [loading, setLoading] = useState(false);

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Đăng nhập thất bại');
            }

            message.success('Đăng nhập thành công!');

            // Store user info
            localStorage.setItem('currentUser', JSON.stringify(data.user));

            // Redirect to admin
            router.push('/admin');

        } catch (error) {
            message.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 z-0">
                <GravityStars />
            </div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-[480px] px-6">
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-10 shadow-2xl border border-slate-100/50">

                    {/* Header */}
                    <div className="flex flex-col items-center mb-10 text-center">
                        <img src="/johns-tours-logo.png" alt="John's Tours" className="h-24 object-contain" />
                    </div>

                    {/* Form */}
                    <Form
                        name="login"
                        initialValues={{ remember: true }}
                        onFinish={onFinish}
                        layout="vertical"
                        size="large"
                    >
                        <Form.Item
                            label={<span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tên đăng nhập</span>}
                            name="username"
                            rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
                        >
                            <Input
                                prefix={<UserOutlined className="text-slate-400" />}
                                placeholder="Tên đăng nhập"
                                className="rounded-xl bg-slate-50 border-slate-200 hover:border-green-500 focus:border-green-500"
                            />
                        </Form.Item>

                        <Form.Item
                            label={<span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Mật khẩu</span>}
                            name="password"
                            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="text-slate-400" />}
                                placeholder="••••••••"
                                className="rounded-xl bg-slate-50 border-slate-200 hover:border-green-500 focus:border-green-500"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                                className="w-full h-12 rounded-xl bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/30 font-bold text-base flex items-center justify-center gap-2"
                            >
                                Đăng nhập <ArrowRightOutlined />
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
}
