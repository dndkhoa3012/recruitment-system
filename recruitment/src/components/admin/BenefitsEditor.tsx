import { useState, useEffect } from 'react'
import { Button, Input } from 'antd'
import { PlusOutlined, DeleteOutlined, DragOutlined } from '@ant-design/icons'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface BenefitItem {
    icon: string
    text: string
}

interface Props {
    value?: BenefitItem[]
    onChange?: (value: BenefitItem[]) => void
}

function SortableItem({ id, value, index, onChange, onRemove }: {
    id: string,
    value: BenefitItem,
    index: number,
    onChange: (field: 'icon' | 'text', val: string) => void,
    onRemove: () => void
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1
    }

    return (
        <div ref={setNodeRef} style={style} className="flex gap-2 items-center mb-2">
            <div
                {...attributes}
                {...listeners}
                className="flex items-center text-gray-400 cursor-move hover:text-gray-600 px-1"
            >
                <DragOutlined />
            </div>
            <Input
                value={value.text}
                onChange={(e) => onChange('text', e.target.value)}
                placeholder="Mô tả quyền lợi..."
                className="flex-1"
            />
            <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={onRemove}
            />
        </div>
    )
}


export default function BenefitsEditor({ value, onChange }: Props) {
    const benefits = value || [{ icon: 'home_work', text: '' }]

    // Generate stable IDs for items
    const [itemIds, setItemIds] = useState<string[]>([])

    // Sync IDs with benefits length
    useEffect(() => {
        setItemIds(ids => {
            if (ids.length === benefits.length) return ids
            if (benefits.length > ids.length) {
                const newIds = [...ids]
                for (let i = ids.length; i < benefits.length; i++) {
                    newIds.push(`benefit-${Date.now()}-${Math.random()}`)
                }
                return newIds
            }
            return ids.slice(0, benefits.length)
        })
    }, [benefits.length])

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

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
        const newIds = itemIds.filter((_, i) => i !== index)
        setItemIds(newIds) // Optimistically update IDs
        onChange?.(newBenefits)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = itemIds.indexOf(active.id as string)
            const newIndex = itemIds.indexOf(over.id as string)

            const newBenefits = arrayMove(benefits, oldIndex, newIndex)
            const newIds = arrayMove(itemIds, oldIndex, newIndex)

            setItemIds(newIds)
            onChange?.(newBenefits)
        }
    }

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-2">Quyền lợi</label>
                <DndContext
                    id="benefits-dnd-context"
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={itemIds}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-0">
                            {benefits.map((benefit, index) => (
                                <SortableItem
                                    key={itemIds[index] || index}
                                    id={itemIds[index] || `temp-${index}`}
                                    value={benefit}
                                    index={index}
                                    onChange={(field, val) => handleChange(index, field, val)}
                                    onRemove={() => removeBenefit(index)}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>

                <Button
                    type="dashed"
                    onClick={addBenefit}
                    icon={<PlusOutlined />}
                    className="w-full mt-2"
                >
                    Thêm
                </Button>
            </div>
        </div>
    )
}
