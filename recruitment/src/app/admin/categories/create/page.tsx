'use client';

import { useState } from 'react';
import { Form, Input, Button, App } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const { TextArea } = Input;

export default function CreateCategoryPage() {
    const { message } = App.useApp();
    const router = useRouter();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);

    // Auto-generate slug from name
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        const slug = name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();

        form.setFieldValue('slug', slug);
    };

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const response = await fetch('/api/categories', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (response.ok) {
                message.success('Tạo danh mục thành công');
                router.push('/admin/categories');
            } else {
                message.error(data.error || 'Không thể tạo danh mục');
            }
        } catch (error) {
            console.error('Error creating category:', error);
            message.error('Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <div className="mb-6">
                <Link href="/admin/categories">
                    <Button type="text" icon={<ArrowLeftOutlined />}>
                        Quay lại
                    </Button>
                </Link>
            </div>

            <div className="max-w-2xl bg-white rounded-lg shadow p-6">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Tên danh mục"
                        name="name"
                        rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
                    >
                        <Input
                            placeholder="Ví dụ: Nhà hàng, Khách sạn, Hướng dẫn viên..."
                            size="large"
                            onChange={handleNameChange}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Slug"
                        name="slug"
                        rules={[
                            { required: true, message: 'Vui lòng nhập slug' },
                            {
                                pattern: /^[a-z0-9-]+$/,
                                message: 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang'
                            }
                        ]}
                        extra="Slug được tạo tự động từ tên. Chỉ chỉnh sửa nếu cần thiết."
                    >
                        <Input placeholder="nha-hang" size="large" />
                    </Form.Item>

                    <Form.Item
                        label="Mô tả"
                        name="description"
                    >
                        <TextArea
                            rows={4}
                            placeholder="Mô tả ngắn về danh mục này..."
                        />
                    </Form.Item>

                    <Form.Item className="mb-0">
                        <div className="flex gap-3">
                            <Button type="primary" htmlType="submit" loading={loading} size="large">
                                Tạo danh mục
                            </Button>
                            <Link href="/admin/categories">
                                <Button size="large">Hủy</Button>
                            </Link>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}
