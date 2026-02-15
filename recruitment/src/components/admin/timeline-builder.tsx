"use client";

import React from 'react';
import { Form, Input, Button, Space, Card, Typography, message } from 'antd';
import { MinusCircleOutlined, PlusOutlined, DeleteOutlined, GroupOutlined, ClockCircleOutlined, EnvironmentOutlined, PictureOutlined } from '@ant-design/icons';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const { TextArea } = Input;
const { Text } = Typography;

// --- Sortable Item Component ---
function SortableItem({ id, children, onDelete }: { id: string, children: React.ReactNode, onDelete?: () => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
    const style = { transform: CSS.Transform.toString(transform), transition };

    return (
        <div ref={setNodeRef} style={style} className="mb-4">
            <div className="flex items-start gap-2">
                <div {...attributes} {...listeners} className="cursor-grab text-slate-400 hover:text-slate-600 mt-1.5">
                    <span className="material-symbols-outlined">drag_indicator</span>
                </div>
                <div className="flex-1">{children}</div>
                {onDelete && (
                    <Button
                        danger
                        type="text"
                        icon={<DeleteOutlined />}
                        onClick={onDelete}
                    />
                )}
            </div>
        </div>
    );
}


export default function TimelineBuilder({ formName = "timeline" }: { formName?: string }) {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    return (
        <Form.List name={formName}>
            {(groups, { add: addGroup, remove: removeGroup, move: moveGroup }) => (
                <div className="flex flex-col gap-6">
                    {/* Empty State: Allow creating the first group */}
                    {groups.length === 0 && (
                        <div className="text-center p-8 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                            <p className="text-slate-500 mb-4">Chưa có lịch trình.</p>
                            <Button
                                type="primary"
                                onClick={() => addGroup({
                                    title_timeline_group: 'Lịch trình chi tiết',
                                    point: [{ timeline_hour: '', timeline_point: '' }]
                                })}
                                icon={<PlusOutlined />}
                            >
                                Tạo lịch trình
                            </Button>
                        </div>
                    )}

                    {groups.map(({ key, name, ...restGroup }) => (
                        <Card
                            key={key}
                            className="bg-slate-50 border-slate-200"
                        >
                            {/* Hidden Group Title for Validation */}
                            <Form.Item
                                {...restGroup}
                                name={[name, 'title_timeline_group']}
                                initialValue="Lịch trình chi tiết"
                                hidden
                                rules={[{ required: true, message: 'Nhập tên nhóm' }]}
                            >
                                <Input />
                            </Form.Item>

                            {/* Timeline Points List */}
                            <Form.List name={[name, 'point']}>
                                {(points, { add: addPoint, remove: removePoint, move: movePoint }) => {
                                    const onDragEnd = (event: any) => {
                                        const { active, over } = event;
                                        if (active.id !== over.id) {
                                            const oldIndex = points.findIndex((p) => String(p.key) === active.id);
                                            const newIndex = points.findIndex((p) => String(p.key) === over.id);
                                            movePoint(oldIndex, newIndex);
                                        }
                                    };

                                    return (
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Các điểm lộ trình</div>
                                                {points.length > 1 && (
                                                    <Button
                                                        type="text"
                                                        danger
                                                        onClick={() => removeGroup(name)}
                                                        className="hover:bg-red-50"
                                                    >
                                                        Xoá tất cả
                                                    </Button>
                                                )}
                                            </div>

                                            <DndContext
                                                sensors={sensors}
                                                collisionDetection={closestCenter}
                                                onDragEnd={onDragEnd}
                                            >
                                                <SortableContext
                                                    items={points.map((p) => String(p.key))}
                                                    strategy={verticalListSortingStrategy}
                                                >
                                                    {points.map(({ key: pointKey, name: pointName, ...restPoint }) => (
                                                        <SortableItem
                                                            key={pointKey}
                                                            id={String(pointKey)}
                                                            onDelete={() => {
                                                                if (points.length === 1) {
                                                                    removeGroup(name);
                                                                } else {
                                                                    removePoint(pointName);
                                                                }
                                                            }}
                                                        >
                                                            <div className="flex gap-2 items-center">
                                                                {/* Time - Fixed Width */}
                                                                <div className="w-[140px] flex-shrink-0">
                                                                    <Form.Item
                                                                        {...restPoint}
                                                                        name={[pointName, 'timeline_hour']}
                                                                        rules={[{ required: true, message: 'Nhập giờ' }]}
                                                                    >
                                                                        <Input
                                                                            prefix={<ClockCircleOutlined className="text-slate-400" />}
                                                                            placeholder="Giờ"
                                                                        />
                                                                    </Form.Item>
                                                                </div>

                                                                {/* Content/Point - Fluid Width */}
                                                                <div className="flex-1">
                                                                    <Form.Item
                                                                        {...restPoint}
                                                                        name={[pointName, 'timeline_point']}
                                                                        rules={[{ required: true, message: 'Nhập nội dung' }]}
                                                                    >
                                                                        <Input
                                                                            prefix={<EnvironmentOutlined className="text-slate-400" />}
                                                                            placeholder="Nội dung hoạt động..."
                                                                        />
                                                                    </Form.Item>

                                                                    {/* Hidden Fields */}
                                                                    <Form.Item
                                                                        {...restPoint}
                                                                        name={[pointName, 'timeline_title']}
                                                                        hidden
                                                                    >
                                                                        <Input />
                                                                    </Form.Item>

                                                                    <Form.Item
                                                                        {...restPoint}
                                                                        name={[pointName, 'image']}
                                                                        hidden
                                                                    >
                                                                        <Input />
                                                                    </Form.Item>
                                                                </div>
                                                            </div>
                                                        </SortableItem>
                                                    ))}
                                                </SortableContext>
                                            </DndContext>

                                            <Button type="dashed" onClick={() => addPoint()} block icon={<PlusOutlined />}>
                                                Thêm điểm lộ trình
                                            </Button>
                                        </div>
                                    );
                                }}
                            </Form.List>
                        </Card>
                    ))}
                </div>
            )}
        </Form.List>
    );
}
