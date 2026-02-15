"use client"

import { Button, Input } from 'antd'
import { PlusOutlined, DeleteOutlined, DragOutlined } from '@ant-design/icons'

interface Props {
    value?: string[]
    onChange?: (value: string[]) => void
}

export default function RequirementsEditor({ value, onChange }: Props) {
    const requirements = value || ['']

    const handleChange = (index: number, text: string) => {
        const newRequirements = [...requirements]
        newRequirements[index] = text
        onChange?.(newRequirements)
    }

    const addRequirement = () => {
        onChange?.([...requirements, ''])
    }

    const removeRequirement = (index: number) => {
        const newRequirements = requirements.filter((_, i) => i !== index)
        onChange?.(newRequirements)
    }

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-2">Danh sách yêu cầu</label>
                <div className="space-y-2">
                    {requirements.map((req, index) => (
                        <div key={index} className="flex gap-2">
                            <div className="flex items-center text-gray-400 cursor-move">
                                <DragOutlined />
                            </div>
                            <Input
                                value={req}
                                onChange={(e) => handleChange(index, e.target.value)}
                                placeholder={`Yêu cầu ${index + 1}...`}
                                className="flex-1"
                            />
                            {requirements.length > 1 && (
                                <Button
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => removeRequirement(index)}
                                />
                            )}
                        </div>
                    ))}
                </div>
                <Button
                    type="dashed"
                    onClick={addRequirement}
                    icon={<PlusOutlined />}
                    className="w-full mt-2"
                >
                    Thêm yêu cầu
                </Button>
            </div>

            {/* Preview */}
            <div className="border-t pt-4 mt-4">
                <label className="block text-sm font-medium mb-2 text-gray-500">Preview</label>
                <div className="p-4 border rounded-lg bg-gray-50">
                    <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                        <ul className="space-y-2">
                            {requirements.filter(r => r.trim()).map((req, index) => (
                                <li key={index} className="flex items-start gap-2">
                                    <span className="material-symbols-outlined text-blue-500 text-sm mt-0.5">
                                        star
                                    </span>
                                    <span className="text-gray-700">{req}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}
