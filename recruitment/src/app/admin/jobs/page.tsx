"use client"

import { useState, useEffect, useRef } from "react"
import { Table, Button, Input, Select, Tag, Space, Popconfirm, App, Switch } from "antd"
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from "@ant-design/icons"
import Link from "next/link"
import { useRouter } from "next/navigation"
import dayjs from "dayjs"

export default function JobsPage() {
    const { message } = App.useApp()
    const router = useRouter()
    const [jobs, setJobs] = useState([])
    const [loading, setLoading] = useState(true)

    // Search states
    const [searchText, setSearchText] = useState('')
    const [searchedColumn, setSearchedColumn] = useState('')
    const searchInput = useRef(null)

    const fetchJobs = async () => {
        try {
            setLoading(true)
            // Fetch all jobs for client-side filtering
            const response = await fetch('/api/jobs')
            if (!response.ok) {
                throw new Error('Failed to fetch jobs')
            }
            const data = await response.json()
            setJobs(Array.isArray(data) ? data : [])
        } catch (error) {
            message.error('Không thể tải danh sách việc làm')
            console.error('Error fetching jobs:', error)
            setJobs([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchJobs()
    }, [])

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`/api/jobs/${id}`, {
                method: 'DELETE'
            })
            if (response.ok) {
                message.success('Đã xóa việc làm thành công')
                fetchJobs()
            } else {
                message.error('Không thể xóa việc làm')
            }
        } catch (error) {
            message.error('Có lỗi xảy ra')
            console.error('Error deleting job:', error)
        }
    }

    const handleToggleStatus = async (job) => {
        try {
            const newStatus = job.status === 'active' ? 'inactive' : 'active'
            const response = await fetch(`/api/jobs/${job.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })
            if (response.ok) {
                message.success(`Đã ${newStatus === 'active' ? 'kích hoạt' : 'tắt'} việc làm`)
                fetchJobs()
            } else {
                message.error('Không thể cập nhật trạng thái')
            }
        } catch (error) {
            message.error('Có lỗi xảy ra')
            console.error('Error toggling status:', error)
        }
    }

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
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            width: 250,
            fixed: 'left' as const,
            ...getColumnSearchProps('title'),
            render: (text, record) => (
                <Link href={`/admin/jobs/${record.id}`} className="text-blue-600 hover:underline">
                    {text}
                </Link>
            )
        },
        {
            title: 'Phòng ban',
            dataIndex: 'category',
            key: 'category',
            width: 150,
            ...getColumnSearchProps('category'), // Use generic props, override onFilter below
            onFilter: (value, record: any) => {
                const categoryName = record.category?.name || '';
                const departmentName = record.department || '';
                const valLower = String(value).toLowerCase();
                return categoryName.toLowerCase().includes(valLower) ||
                    departmentName.toLowerCase().includes(valLower);
            },
            render: (category, record: any) => category?.name || record.department || '-'
        },
        {
            title: 'Địa điểm',
            dataIndex: 'location',
            key: 'location',
            width: 150,
            ...getColumnSearchProps('location'),
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            width: 120,
            filters: [
                { text: 'Toàn thời gian', value: 'full-time' },
                { text: 'Bán thời gian', value: 'part-time' },
                { text: 'Hợp đồng', value: 'contract' },
                { text: 'Thực tập', value: 'internship' },
            ],
            onFilter: (value, record: any) => record.type === value,
            render: (type) => {
                const typeMap = {
                    'full-time': 'Toàn thời gian',
                    'part-time': 'Bán thời gian',
                    'contract': 'Hợp đồng',
                    'internship': 'Thực tập'
                }
                return typeMap[type] || type
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 120,
            filters: [
                { text: 'Đang tuyển', value: 'active' },
                { text: 'Tạm dừng', value: 'inactive' },
                { text: 'Đã đóng', value: 'closed' }
            ],
            onFilter: (value, record: any) => record.status === value,
            render: (status, record) => {
                const statusConfig = {
                    active: { color: 'green', text: 'Đang tuyển' },
                    inactive: { color: 'default', text: 'Tạm dừng' },
                    closed: { color: 'red', text: 'Đã đóng' }
                }
                const config = statusConfig[status] || { color: 'default', text: status }
                return (
                    <Tag
                        color={config.color}
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleToggleStatus(record)}
                    >
                        {config.text}
                    </Tag>
                )
            }
        },
        {
            title: 'Ứng viên',
            dataIndex: ['_count', 'candidates'],
            key: 'candidates',
            width: 100,
            sorter: (a: any, b: any) => (a._count?.candidates || 0) - (b._count?.candidates || 0),
            render: (count) => count || 0
        },
        {
            title: 'Ngày đăng',
            dataIndex: 'publishedAt',
            key: 'publishedAt',
            width: 120,
            sorter: (a: any, b: any) => dayjs(a.publishedAt).unix() - dayjs(b.publishedAt).unix(),
            render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '-'
        },
        {
            title: 'Hạn nộp',
            dataIndex: 'deadline',
            key: 'deadline',
            width: 120,
            sorter: (a: any, b: any) => {
                if (!a.deadline) return -1;
                if (!b.deadline) return 1;
                return dayjs(a.deadline).unix() - dayjs(b.deadline).unix()
            },
            render: (date) => {
                if (!date) return '-'
                const isExpired = dayjs(date).isBefore(dayjs())
                return (
                    <span className={isExpired ? 'text-red-500' : ''}>
                        {dayjs(date).format('DD/MM/YYYY')}
                    </span>
                )
            }
        },
        {
            title: 'Hành động',
            key: 'actions',
            width: 150,
            fixed: 'right' as const,
            render: (_, record) => (
                <Space>
                    <Switch
                        checked={record.status === 'active'}
                        onChange={() => handleToggleStatus(record)}
                        size="small"
                    />
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => router.push(`/admin/jobs/${record.id}`)}
                        title="Sửa"
                    />
                    <Popconfirm
                        title="Xóa việc làm"
                        description="Bạn có chắc muốn xóa việc làm này?"
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
            <div className="flex justify-end items-center bg-white p-4 rounded-lg">
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => router.push('/admin/jobs/create')}
                >
                    Tạo việc làm mới
                </Button>
            </div>

            <div className="bg-white rounded-lg">
                <Table
                    columns={columns}
                    dataSource={jobs}
                    rowKey="id"
                    loading={loading}
                    scroll={{ x: 1300 }}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} việc làm`
                    }}
                />
            </div>
        </div>
    )
}
