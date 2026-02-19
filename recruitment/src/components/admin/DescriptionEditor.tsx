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

const { TextArea } = Input

interface DescriptionData {
    intro: string
    points: string[]
}

interface Props {
    value?: DescriptionData
    onChange?: (value: DescriptionData) => void
}

function SortableItem({ id, value, index, onChange, onRemove }: {
    id: string,
    value: string,
    index: number,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
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
                value={value}
                onChange={onChange}
                placeholder={`Điểm thứ ${index + 1}...`}
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

export default function DescriptionEditor({ value, onChange }: Props) {
    const data = value || { intro: '', points: [''] }

    // Generate stable IDs for items
    const [itemIds, setItemIds] = useState<string[]>([])

    // Sync IDs with points length on mount or when points length changes significantly
    // Note: This is a loose sync. In a real app with shared editing, this needs more robust ID tracking.
    useEffect(() => {
        setItemIds(ids => {
            if (ids.length === data.points.length) return ids

            // If we have more points than IDs, add new IDs
            if (data.points.length > ids.length) {
                const newIds = [...ids]
                for (let i = ids.length; i < data.points.length; i++) {
                    newIds.push(`point-${Date.now()}-${Math.random()}`)
                }
                return newIds
            }

            // If we have fewer items (deletion from parent?), truncate
            // Ideally we'd know WHICH was deleted, but without upstream IDs we just cut from end or keep sync
            return ids.slice(0, data.points.length)
        })
    }, [data.points.length])

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

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
        const newIds = itemIds.filter((_, i) => i !== index)
        setItemIds(newIds) // Optimistically update IDs to avoid flicker
        onChange?.({ ...data, points: newPoints })
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = itemIds.indexOf(active.id as string)
            const newIndex = itemIds.indexOf(over.id as string)

            const newPoints = arrayMove(data.points, oldIndex, newIndex)
            const newIds = arrayMove(itemIds, oldIndex, newIndex)

            setItemIds(newIds)
            onChange?.({ ...data, points: newPoints })
        }
    }

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-2">Giới thiệu</label>
                <TextArea
                    value={data.intro}
                    onChange={handleIntroChange}
                    rows={3}
                    placeholder="Nhập đoạn văn mở đầu giới thiệu về công việc..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Mô tả công việc</label>
                <DndContext
                    id="description-dnd-context"
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={itemIds}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-0">
                            {data.points.map((point, index) => (
                                <SortableItem
                                    key={itemIds[index] || index} // Fallback to index if ID not ready (shouldn't happen)
                                    id={itemIds[index] || `temp-${index}`}
                                    value={point}
                                    index={index}
                                    onChange={(e) => handlePointChange(index, e.target.value)}
                                    // Only show delete if > 1 item, or if flexible. Previous code showed it always if length > 1
                                    onRemove={() => removePoint(index)}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>

                <Button
                    type="dashed"
                    onClick={addPoint}
                    icon={<PlusOutlined />}
                    className="w-full mt-2"
                >
                    Thêm
                </Button>
            </div>
        </div>
    )
}
