"use client"

import { useState } from 'react'
import { Button, Input } from 'antd'
import { PlusOutlined, DeleteOutlined, DragOutlined } from '@ant-design/icons'

const { TextArea } = Input

interface DescriptionData {
    intro: string
    points: string[]
}

interface Props {
    value?: DescriptionData
    onChange?: (value: DescriptionData) => void
}

export default function DescriptionEditor({ value, onChange }: Props) {
    const data = value || { intro: '', points: [''] }

    const handleIntroChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange?.({ ...data, intro: e.target.value })
    }

    const handlePointChange = (index: number, text: string) => {
        const newPoints = [...data.points]
        newPoints[index] = text
        onChange?.({ ...data, points: newPoints })
    }

    const addPoint = () => {
        onChange?.({ ...data, points: [...data.points, ''] })
    }

    const removePoint = (index: number) => {
        const newPoints = data.points.filter((_, i) => i !== index)
        onChange?.({ ...data, points: newPoints })
    }

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-2">Đoạn mở đầu</label>
                <TextArea
                    value={data.intro}
                    onChange={handleIntroChange}
                    rows={3}
                    placeholder="Nhập đoạn văn mở đầu giới thiệu về công việc..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Các điểm chính</label>
                <div className="space-y-2">
                    {data.points.map((point, index) => (
                        <div key={index} className="flex gap-2">
                            <div className="flex items-center text-gray-400 cursor-move">
                                <DragOutlined />
                            </div>
                            <Input
                                value={point}
                                onChange={(e) => handlePointChange(index, e.target.value)}
                                placeholder={`Điểm thứ ${index + 1}...`}
                                className="flex-1"
                            />
                            {data.points.length > 1 && (
                                <Button
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => removePoint(index)}
                                />
                            )}
                        </div>
                    ))}
                </div>
                <Button
                    type="dashed"
                    onClick={addPoint}
                    icon={<PlusOutlined />}
                    className="w-full mt-2"
                >
                    Thêm điểm
                </Button>
            </div>

            {/* Preview */}
            <div className="border-t pt-4 mt-4">
                <label className="block text-sm font-medium mb-2 text-gray-500">Preview</label>
                <div className="p-4 border rounded-lg bg-gray-50">
                    {data.intro && <p className="mb-3 text-gray-700">{data.intro}</p>}
                    {data.points.filter(p => p.trim()).length > 0 && (
                        <ul className="space-y-2">
                            {data.points.filter(p => p.trim()).map((point, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-blue-500 text-sm mt-0.5">
                                        check_circle
                                    </span>
                                    <span className="text-gray-700">{point}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}
