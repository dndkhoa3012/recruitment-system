"use client"

import { Button, Input, Select } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'

interface BenefitItem {
    icon: string
    text: string
}

interface Props {
    value?: BenefitItem[]
    onChange?: (value: BenefitItem[]) => void
}

// Common Material Icons for benefits
const iconOptions = [
    { value: 'home_work', label: '🏢 Nhà ở' },
    { value: 'restaurant', label: '🍽️ Ăn uống' },
    { value: 'volunteer_activism', label: '💰 Thưởng/Lương' },
    { value: 'health_and_safety', label: '🏥 Bảo hiểm' },
    { value: 'school', label: '📚 Đào tạo' },
    { value: 'card_travel', label: '✈️ Du lịch' },
    { value: 'work_history', label: '⏰ Giờ làm linh hoạt' },
    { value: 'local_parking', label: '🅿️ Chỗ đậu xe' },
    { value: 'sports_esports', label: '🎮 Giải trí' },
    { value: 'favorite', label: '❤️ Phúc lợi khác' },
]

export default function BenefitsEditor({ value, onChange }: Props) {
    const benefits = value || [{ icon: 'home_work', text: '' }]

    const handleChange = (index: number, field: 'icon' | 'text', val: string) => {
        const newBenefits = [...benefits]
        newBenefits[index] = { ...newBenefits[index], [field]: val }
        onChange?.(newBenefits)
    }

    const addBenefit = () => {
        onChange?.([...benefits, { icon: 'favorite', text: '' }])
    }

    const removeBenefit = (index: number) => {
        const newBenefits = benefits.filter((_, i) => i !== index)
        onChange?.(newBenefits)
    }

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-2">Danh sách quyền lợi</label>
                <div className="space-y-3">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="flex gap-2">
                            <Select
                                value={benefit.icon}
                                onChange={(val) => handleChange(index, 'icon', val)}
                                style={{ width: 180 }}
                                options={iconOptions}
                            />
                            <Input
                                value={benefit.text}
                                onChange={(e) => handleChange(index, 'text', e.target.value)}
                                placeholder="Mô tả quyền lợi..."
                                className="flex-1"
                            />
                            {benefits.length > 1 && (
                                <Button
                                    type="text"
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => removeBenefit(index)}
                                />
                            )}
                        </div>
                    ))}
                </div>
                <Button
                    type="dashed"
                    onClick={addBenefit}
                    icon={<PlusOutlined />}
                    className="w-full mt-2"
                >
                    Thêm quyền lợi
                </Button>
            </div>

            {/* Preview */}
            <div className="border-t pt-4 mt-4">
                <label className="block text-sm font-medium mb-2 text-gray-500">Preview</label>
                <div className="p-4 border rounded-lg bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {benefits.filter(b => b.text.trim()).map((benefit, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white">
                                <span className="material-symbols-outlined text-blue-500">
                                    {benefit.icon}
                                </span>
                                <span className="text-gray-700">{benefit.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
