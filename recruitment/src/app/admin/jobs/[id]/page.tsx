"use client"

import { useEffect, useState } from "react"
import { Form, Input, Select, DatePicker, Button, App, Spin, Alert, InputNumber } from "antd"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeftOutlined } from "@ant-design/icons"
import Link from "next/link"
import dayjs from "dayjs"
import DescriptionEditor from "@/components/admin/DescriptionEditor"
import RequirementsEditor from "@/components/admin/RequirementsEditor"
import BenefitsEditor from "@/components/admin/BenefitsEditor"

export default function EditJobPage() {
    const { message } = App.useApp()
    const router = useRouter()
    const params = useParams()
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(true)
    const [categories, setCategories] = useState([])
    const [loadingCategories, setLoadingCategories] = useState(true)
    const [initialValues, setInitialValues] = useState<any>(null)

    useEffect(() => {
        fetchCategories()
        fetchJob()
    }, [params.id])

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories')
            if (response.ok) {
                const data = await response.json()
                setCategories(data)
            }
        } catch (error) {
            console.error('Error fetching categories:', error)
        } finally {
            setLoadingCategories(false)
        }
    }

    const fetchJob = async () => {
        try {
            const response = await fetch(`/api/jobs/${params.id}`)
            const job = await response.json()

            // Parse JSON fields or fallback to legacy string data
            let description = job.description
            let requirements = job.requirements
            let benefits = job.benefits

            try {
                description = typeof job.description === 'string' && job.description.startsWith('{')
                    ? JSON.parse(job.description)
                    : { intro: job.description || '', points: [] }
            } catch {
                description = { intro: job.description || '', points: [] }
            }

            try {
                requirements = typeof job.requirements === 'string' && job.requirements.startsWith('[')
                    ? JSON.parse(job.requirements)
                    : (job.requirements || '').split('\n').filter(r => r.trim())
            } catch {
                requirements = (job.requirements || '').split('\n').filter(r => r.trim())
            }

            try {
                benefits = typeof job.benefits === 'string' && job.benefits.startsWith('[')
                    ? JSON.parse(job.benefits)
                    : []
            } catch {
                benefits = []
            }

            setInitialValues({
                ...job,
                description,
                requirements,
                benefits,
                deadline: job.deadline ? dayjs(job.deadline) : null
            })
            setLoading(false)
        } catch (error) {
            message.error('Không thể tải thông tin việc làm')
            console.error('Error fetching job:', error)
        }
    }

    const onFinish = async (values) => {
        try {
            const response = await fetch(`/api/jobs/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...values,
                    // Convert structured data to JSON strings
                    description: JSON.stringify(values.description),
                    requirements: JSON.stringify(values.requirements),
                    benefits: JSON.stringify(values.benefits),
                    deadline: values.deadline ? values.deadline.toISOString() : null
                })
            })

            if (response.ok) {
                message.success('Cập nhật việc làm thành công')
                router.push('/admin/jobs')
            } else {
                message.error('Không thể cập nhật việc làm')
            }
        } catch (error) {
            message.error('Có lỗi xảy ra')
            console.error('Error updating job:', error)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Spin size="large" />
            </div>
        )
    }

    return (
        <div className="p-3 md:p-6">
            <div className="mb-6">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => router.back()}
                >
                    Quay lại
                </Button>
            </div>

            <div className="bg-white p-4 md:p-6 rounded-lg max-w-4xl">
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    initialValues={initialValues}
                >
                    <Form.Item
                        label="Tiêu đề"
                        name="title"
                        rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                    >
                        <Input placeholder="VD: Nhân viên kinh doanh" />
                    </Form.Item>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            label="Danh mục"
                            name="categoryId"
                            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
                        >
                            <Select
                                placeholder="Chọn danh mục"
                                loading={loadingCategories}
                                allowClear
                            >
                                {categories.map((cat: any) => (
                                    <Select.Option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Địa điểm"
                            name="location"
                            rules={[{ required: true, message: 'Vui lòng nhập địa điểm' }]}
                        >
                            <Input placeholder="VD: Hồ Chí Minh" />
                        </Form.Item>
                    </div>

                    {categories.length === 0 && !loadingCategories && (
                        <Alert
                            message="Chưa có danh mục nào"
                            description={
                                <span>
                                    Bạn cần tạo danh mục trước. <Link href="/admin/categories/create" className="text-blue-600 hover:underline">Tạo danh mục ngay</Link>
                                </span>
                            }
                            type="info"
                            showIcon
                            className="mb-4"
                        />
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            label="Loại"
                            name="type"
                        >
                            <Select>
                                <Select.Option value="full-time">Toàn thời gian</Select.Option>
                                <Select.Option value="part-time">Bán thời gian</Select.Option>
                                <Select.Option value="contract">Hợp đồng</Select.Option>
                                <Select.Option value="internship">Thực tập</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Mức lương"
                            name="salary"
                        >
                            <Input placeholder="VD: 20-30 triệu VNĐ" />
                        </Form.Item>

                        <Form.Item
                            label="Số lượng tuyển"
                            name="quantity"
                            rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
                        >
                            <InputNumber min={1} style={{ width: '100%' }} placeholder="VD: 5" />
                        </Form.Item>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Form.Item
                            label="Trạng thái"
                            name="status"
                        >
                            <Select>
                                <Select.Option value="active">Đang tuyển</Select.Option>
                                <Select.Option value="inactive">Tạm dừng</Select.Option>
                                <Select.Option value="closed">Đã đóng</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label="Hạn nộp hồ sơ"
                            name="deadline"
                        >
                            <DatePicker
                                style={{ width: '100%' }}
                                format="DD/MM/YYYY"
                                placeholder="Chọn ngày hết hạn"
                            />
                        </Form.Item>
                    </div>

                    <Form.Item
                        label="Mô tả công việc"
                        name="description"
                    >
                        <DescriptionEditor />
                    </Form.Item>

                    <Form.Item
                        label="Yêu cầu"
                        name="requirements"
                    >
                        <RequirementsEditor />
                    </Form.Item>

                    <Form.Item
                        label="Quyền lợi"
                        name="benefits"
                    >
                        <BenefitsEditor />
                    </Form.Item>

                    <Form.Item className="mb-0">
                        <div className="flex gap-2 justify-end">
                            <Button onClick={() => router.back()}>
                                Hủy
                            </Button>
                            <Button type="primary" htmlType="submit">
                                Cập nhật
                            </Button>
                        </div>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
