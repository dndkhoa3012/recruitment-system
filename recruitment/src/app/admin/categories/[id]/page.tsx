'use client';

import { useState, useEffect } from 'react';
import { Form, Input, Button, App, Spin } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

const { TextArea } = Input;

export default function EditCategoryPage() {
    const { message } = App.useApp();
    const router = useRouter();
    const params = useParams();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [initialValues, setInitialValues] = useState<any>(null);

    useEffect(() => {
        fetchCategory();
    }, [params.id]);

    const fetchCategory = async () => {
        try {
            const response = await fetch(`/api/categories/${params.id}`);
            if (response.ok) {
                const category = await response.json();
                setInitialValues({
                    name: category.name,
                    slug: category.slug,
                    description: category.description
                });
            } else {
                message.error('Không tìm thấy danh mục');
                router.push('/admin/categories');
            }
        } catch (error) {
            console.error('Error fetching category:', error);
            message.error('Có lỗi xảy ra');
        } finally {
            setFetching(false);
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        const slug = name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
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
            const response = await fetch(`/api/categories/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (response.ok) {
                message.success('Cập nhật danh mục thành công');
                router.push('/admin/categories');
            } else {
                message.error(data.error || 'Không thể cập nhật danh mục');
            }
        } catch (error) {
            console.error('Error updating category:', error);
            message.error('Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="p-6 flex justify-center items-center h-64">
                <Spin size="large" />
            </div>
        );
    }

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
                    initialValues={initialValues}
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
                                Cập nhật
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
