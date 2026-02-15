'use client';

import { useState, useEffect, useRef } from 'react';
import { Table, Button, App, Popconfirm, Input, Tag, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CategoriesPage() {
    const { message } = App.useApp();
    const router = useRouter();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Search states
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories');
            if (response.ok) {
                const data = await response.json();
                setCategories(data);
            } else {
                message.error('Không thể tải danh sách danh mục');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            message.error('Có lỗi xảy ra khi tải danh mục');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/categories/${id}`, {
                method: 'DELETE',
            });

            const data = await response.json();

            if (response.ok) {
                message.success('Xóa danh mục thành công');
                fetchCategories();
            } else {
                message.error(data.error || 'Không thể xóa danh mục');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            message.error('Có lỗi xảy ra');
        }
    };

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: string) => ({
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
                            close();
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
        onFilter: (value, record) =>
            record[dataIndex]
                ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                : false,
        filterDropdownProps: {
            onOpenChange: (visible) => {
                if (visible) {
                    setTimeout(() => searchInput.current?.select(), 100);
                }
            },
        },
    });

    const columns = [
        {
            title: 'Tên danh mục',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
            render: (text: string, record: any) => (
                <div>
                    <div className="font-semibold">{text}</div>
                    <div className="text-gray-500 text-xs">Slug: {record.slug}</div>
                </div>
            )
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            render: (text: string) => text || <span className="text-gray-400">—</span>
        },
        {
            title: 'Số công việc',
            dataIndex: ['_count', 'jobs'],
            key: 'jobCount',
            width: 120,
            align: 'center' as const,
            render: (count: number) => (
                <Tag color={count > 0 ? 'blue' : 'default'}>{count}</Tag>
            )
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 140,
            render: (date: string) => new Date(date).toLocaleDateString('vi-VN')
        },
        {
            title: 'Hành động',
            key: 'actions',
            width: 120,
            align: 'center' as const,
            render: (_: any, record: any) => (
                <div className="flex gap-2 justify-center">
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => router.push(`/admin/categories/${record.id}`)}
                    />
                    <Popconfirm
                        title="Xóa danh mục"
                        description={
                            record._count.jobs > 0
                                ? `Danh mục này có ${record._count.jobs} công việc. Bạn có chắc muốn xóa?`
                                : 'Bạn có chắc muốn xóa danh mục này?'
                        }
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        disabled={record._count.jobs > 0}
                    >
                        <Button
                            type="text"
                            danger
                            icon={<DeleteOutlined />}
                            disabled={record._count.jobs > 0}
                        />
                    </Popconfirm>
                </div>
            )
        }
    ];

    return (
        <div className="p-3 md:p-6">
            <div className="mb-6 flex justify-end items-center">
                <Link href="/admin/categories/create">
                    <Button type="primary" icon={<PlusOutlined />}>
                        Thêm danh mục
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow">
                <Table
                    columns={columns}
                    dataSource={categories} // Use categories directly
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng ${total} danh mục`
                    }}
                />
            </div>
        </div>
    );
}
