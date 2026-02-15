"use client"

import { useState, useEffect, useRef } from "react"
import { Table, Button, Input, Select, Tag, Space, Popconfirm, App } from "antd"
import { EyeOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons"
import Link from "next/link"
import { useRouter } from "next/navigation"
import dayjs from "dayjs"



export default function CandidatesPage() {
    const { message } = App.useApp()
    const router = useRouter()
    const [candidates, setCandidates] = useState([])
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        status: 'all',
        jobId: 'all'
    })

    const fetchCandidates = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            if (filters.status !== 'all') params.append('status', filters.status)
            if (filters.jobId !== 'all') params.append('jobId', filters.jobId)


            const response = await fetch(`/api/candidates?${params.toString()}`)
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to fetch candidates')
            }
            const data = await response.json()
            setCandidates(Array.isArray(data) ? data : [])
        } catch (error) {
            message.error(error.message || 'Không thể tải danh sách ứng viên')
            console.error('Error fetching candidates:', error)
            setCandidates([])
        } finally {
            setLoading(false)
        }
    }

    const fetchJobs = async () => {
        try {
            const response = await fetch('/api/jobs')
            if (!response.ok) {
                throw new Error('Failed to fetch jobs')
            }
            const data = await response.json()
            setJobs(Array.isArray(data) ? data : [])
        } catch (error) {
            console.error('Error fetching jobs:', error)
            setJobs([])
        }
    }

    useEffect(() => {
        fetchJobs()
    }, [])

    useEffect(() => {
        fetchCandidates()
    }, [filters])

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/candidates/${id}`, {
                method: 'DELETE'
            })
            if (response.ok) {
                message.success('Đã xóa ứng viên thành công')
                fetchCandidates()
            } else {
                message.error('Không thể xóa ứng viên')
            }
        } catch (error) {
            message.error('Có lỗi xảy ra')
            console.error('Error deleting candidate:', error)
        }
    }

    const handleStatusChange = async (candidateId, newStatus) => {
        try {
            const response = await fetch(`/api/candidates/${candidateId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })
            if (response.ok) {
                message.success('Đã cập nhật trạng thái')
                fetchCandidates()
            } else {
                message.error('Không thể cập nhật trạng thái')
            }
        } catch (error) {
            message.error('Có lỗi xảy ra')
            console.error('Error updating status:', error)
        }
    }

    const [searchText, setSearchText] = useState('')
    const [searchedColumn, setSearchedColumn] = useState('')
    const searchInput = useRef(null)

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm()
        setSearchText(selectedKeys[0])
        setSearchedColumn(dataIndex)
    }

    const handleReset = (clearFilters) => {
        clearFilters()
        setSearchText('')
    }

    const getColumnSearchProps = (dataIndex: string, nestedPath: string[] | null = null) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }: any) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Tìm kiếm`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Tìm
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Xóa
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close()
                        }}
                    >
                        Đóng
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />
        ),
        onFilter: (value, record) => {
            if (nestedPath) {
                // Handle nested path searching (e.g. ['job', 'title'])
                const text = nestedPath.reduce((obj, key) => obj && obj[key], record)
                return text ? text.toString().toLowerCase().includes(value.toLowerCase()) : false
            }
            return record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : false
        },
        filterDropdownProps: {
            onOpenChange: (visible) => {
                if (visible) {
                    setTimeout(() => searchInput.current?.select(), 100)
                }
            },
        },
    })

    const columns = [
        {
            title: 'Họ tên',
            dataIndex: 'fullName',
            key: 'fullName',
            width: 200,
            fixed: 'left' as const,
            ...getColumnSearchProps('fullName'),
            render: (text, record) => (
                <Link href={`/admin/candidates/${record.id}`} className="text-blue-600 hover:underline">
                    {text}
                </Link>
            )
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: 220,
            ...getColumnSearchProps('email'),
        },
        {
            title: 'Số điện thoại',
            dataIndex: 'phone',
            key: 'phone',
            width: 130,
            ...getColumnSearchProps('phone'),
        },
        {
            title: 'Vị trí ứng tuyển',
            dataIndex: ['job', 'title'],
            key: 'jobTitle',
            width: 250,
            ...getColumnSearchProps('jobTitle', ['job', 'title']),
        },
        {
            title: 'Phòng ban',
            dataIndex: ['job', 'category', 'name'],
            key: 'department',
            width: 150,
            render: (text, record: any) => record.job?.category?.name || record.job?.department || '-'
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 150,
            filters: [
                { text: 'Chờ xử lý', value: 'pending' },
                { text: 'Đang xem xét', value: 'reviewing' },
                { text: 'Đã phỏng vấn', value: 'interviewed' },
                { text: 'Đã chấp nhận', value: 'accepted' },
                { text: 'Từ chối', value: 'rejected' },
            ],
            onFilter: (value: any, record: any) => record.status === value,
            render: (status, record) => {
                const statusConfig = {
                    pending: { color: 'default', text: 'Chờ xử lý' },
                    reviewing: { color: 'blue', text: 'Đang xem xét' },
                    interviewed: { color: 'orange', text: 'Đã phỏng vấn' },
                    accepted: { color: 'green', text: 'Đã chấp nhận' },
                    rejected: { color: 'red', text: 'Từ chối' }
                }
                const config = statusConfig[status] || { color: 'default', text: status }
                return (
                    <Select
                        value={status}
                        style={{ width: '100%' }}
                        onChange={(value) => handleStatusChange(record.id, value)}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Select.Option value="pending">Chờ xử lý</Select.Option>
                        <Select.Option value="reviewing">Đang xem xét</Select.Option>
                        <Select.Option value="interviewed">Đã phỏng vấn</Select.Option>
                        <Select.Option value="accepted">Đã chấp nhận</Select.Option>
                        <Select.Option value="rejected">Từ chối</Select.Option>
                    </Select>
                )
            }
        },
        {
            title: 'Ngày nộp',
            dataIndex: 'appliedAt',
            key: 'appliedAt',
            width: 120,
            render: (date) => dayjs(date).format('DD/MM/YYYY')
        },
        {
            title: 'Hành động',
            key: 'actions',
            width: 100,
            fixed: 'right' as const,
            render: (_, record) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EyeOutlined />}
                        onClick={() => router.push(`/admin/candidates/${record.id}`)}
                        title="Xem chi tiết"
                    />
                    <Popconfirm
                        title="Xóa ứng viên"
                        description="Bạn có chắc muốn xóa ứng viên này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                    >
                        <Button type="text" danger icon={<DeleteOutlined />} title="Xóa" />
                    </Popconfirm>
                </Space>
            )
        }
    ]

    return (
        <div className="flex flex-col gap-4 p-3 md:p-6">
            <div className="bg-white rounded-lg">
                <Table
                    columns={columns}
                    dataSource={candidates}
                    rowKey="id"
                    loading={loading}
                    scroll={{ x: 1400 }}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} ứng viên`
                    }}
                />
            </div>
        </div>
    )
}
