"use client"

import { useEffect, useState } from "react"
import { Card, Descriptions, Tag, Button, Spin, App } from "antd"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeftOutlined } from "@ant-design/icons"
import dayjs from "dayjs"

export default function CandidateDetailPage() {
    const { message } = App.useApp()
    const router = useRouter()
    const params = useParams()
    const [candidate, setCandidate] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCandidate = async () => {
            try {
                const response = await fetch(`/api/candidates/${params.id}`)
                const data = await response.json()
                setCandidate(data)
                setLoading(false)
            } catch (error) {
                message.error('Không thể tải thông tin ứng viên')
                console.error('Error fetching candidate:', error)
            }
        }

        fetchCandidate()
    }, [params.id])

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Spin size="large" />
            </div>
        )
    }

    if (!candidate) {
        return <div className="p-6">Không tìm thấy ứng viên</div>
    }

    const statusConfig = {
        pending: { color: 'default', text: 'Chờ xử lý' },
        reviewing: { color: 'blue', text: 'Đang xem xét' },
        interviewed: { color: 'orange', text: 'Đã phỏng vấn' },
        accepted: { color: 'green', text: 'Đã chấp nhận' },
        rejected: { color: 'red', text: 'Từ chối' }
    }

    const config = statusConfig[candidate.status] || { color: 'default', text: candidate.status }

    return (
        <div className="p-3 md:p-6">
            <div className="mb-6">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => router.back()}
                    className="mb-4"
                >
                    Quay lại
                </Button>
            </div>

            <div className="max-w-4xl space-y-4">
                <Card title="Thông tin cá nhân" className="shadow-sm">
                    <Descriptions column={{ xs: 1, sm: 2 }} bordered>
                        <Descriptions.Item label="Họ tên" span={2}>
                            <span className="font-semibold">{candidate.fullName}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            {candidate.email}
                        </Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại">
                            {candidate.phone}
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày nộp hồ sơ">
                            {dayjs(candidate.appliedAt).format('DD/MM/YYYY HH:mm')}
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            <Tag color={config.color}>{config.text}</Tag>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                <Card title="Thông tin công việc" className="shadow-sm">
                    <Descriptions column={2} bordered>
                        <Descriptions.Item label="Vị trí ứng tuyển" span={2}>
                            <span className="font-semibold">{candidate.job.title}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Phòng ban">
                            {candidate.job.category?.name || candidate.job.department || '-'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Địa điểm">
                            {candidate.job.location}
                        </Descriptions.Item>
                        <Descriptions.Item label="Loại công việc">
                            {candidate.job.type === 'full-time' ? 'Toàn thời gian' :
                                candidate.job.type === 'part-time' ? 'Bán thời gian' :
                                    candidate.job.type === 'contract' ? 'Hợp đồng' :
                                        candidate.job.type === 'internship' ? 'Thực tập' : candidate.job.type}
                        </Descriptions.Item>
                        <Descriptions.Item label="Mức lương">
                            {candidate.job.salary || '-'}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                {candidate.coverLetter && (
                    <Card title="Thư xin việc" className="shadow-sm">
                        <div className="whitespace-pre-wrap bg-gray-50 p-4 rounded">
                            {candidate.coverLetter}
                        </div>
                    </Card>
                )}

                {candidate.resume && (
                    <Card title="Hồ sơ / CV" className="shadow-sm">
                        {candidate.resume.startsWith('blob:') ? (
                            <div className="bg-orange-50 p-4 rounded text-orange-600 border border-orange-200">
                                <p className="font-medium">⚠️ File lỗi (Do phiên bản cũ)</p>
                                <p className="text-sm mt-1">CV này được tải lên trước khi hệ thống lưu trữ file được cập nhật. Vui lòng yêu cầu ứng viên gửi lại qua email.</p>
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-4 rounded flex items-center justify-between">
                                <span className="text-gray-600 truncate mr-4 font-medium">
                                    {candidate.resume.split('/').pop().split('-').slice(1).join('-') || 'CV Document'}
                                </span>
                                <Button
                                    type="primary"
                                    href={candidate.resume}
                                    target="_blank"
                                    download
                                >
                                    Tải CV về
                                </Button>
                            </div>
                        )}
                    </Card>
                )}
            </div>
        </div>
    )
}
