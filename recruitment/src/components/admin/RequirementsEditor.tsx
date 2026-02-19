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

interface Props {
    value?: string[]
    onChange?: (value: string[]) => void
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
                placeholder={`Yêu cầu ${index + 1}...`}
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

export default function RequirementsEditor({ value, onChange }: Props) {
    const requirements = value || ['']

    // Generate stable IDs for items
    const [itemIds, setItemIds] = useState<string[]>([])

    useEffect(() => {
        setItemIds(ids => {
            if (ids.length === requirements.length) return ids

            if (requirements.length > ids.length) {
                const newIds = [...ids]
                for (let i = ids.length; i < requirements.length; i++) {
                    newIds.push(`req-${Date.now()}-${Math.random()}`)
                }
                return newIds
            }

            return ids.slice(0, requirements.length)
        })
    }, [requirements.length])

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

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
        const newIds = itemIds.filter((_, i) => i !== index)
        setItemIds(newIds)
        onChange?.(newRequirements)
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (over && active.id !== over.id) {
            const oldIndex = itemIds.indexOf(active.id as string)
            const newIndex = itemIds.indexOf(over.id as string)

            const newRequirements = arrayMove(requirements, oldIndex, newIndex)
            const newIds = arrayMove(itemIds, oldIndex, newIndex)

            setItemIds(newIds)
            onChange?.(newRequirements)
        }
    }

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium mb-2">Yêu cầu</label>
                <DndContext
                    id="requirements-dnd-context"
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={itemIds}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-0">
                            {requirements.map((req, index) => (
                                <SortableItem
                                    key={itemIds[index] || index}
                                    id={itemIds[index] || `temp-${index}`}
                                    value={req}
                                    index={index}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    // Only show delete if > 1 item, or if flexible
                                    onRemove={() => removeRequirement(index)}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>

                <Button
                    type="dashed"
                    onClick={addRequirement}
                    icon={<PlusOutlined />}
                    className="w-full mt-2"
                >
                    Thêm
                </Button>
            </div>
        </div>
    )
}
