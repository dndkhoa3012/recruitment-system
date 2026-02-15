import React, { useState } from "react";
import { Upload as UploadIcon, X, Plus, Trash2 } from "lucide-react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
    DragOverlay,
    defaultDropAnimationSideEffects,
    DropAnimation,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Popconfirm } from "antd";

interface ImageUploadGridProps {
    value?: string[]; // Array of image URLs
    onChange?: (urls: string[]) => void;
}

// Separate component for the Image display (reused in Sortable and Overlay)
const ImageCard = ({
    url,
    onRemove,
    onReplace,
    isOverlay = false
}: {
    url: string;
    onRemove?: () => void;
    onReplace?: () => void;
    isOverlay?: boolean;
}) => {
    return (
        <div className={`relative group aspect-square rounded-lg overflow-hidden border-2 
            ${isOverlay ? 'border-blue-500 shadow-xl scale-105 z-50 cursor-grabbing' : 'border-slate-200 bg-slate-50 cursor-grab hover:border-blue-300'}`}>
            <img
                src={url}
                alt="Gallery item"
                className="w-full h-full object-cover"
                draggable={false} // Prevent native drag
            />

            {/* Action Buttons - Only show if not overlay */}
            {!isOverlay && (
                <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onReplace?.(); }}
                        // Stop propagation so we don't trigger drag
                        onPointerDown={(e) => e.stopPropagation()}
                        className="bg-white/90 text-blue-600 rounded-full p-1.5 hover:bg-blue-500 hover:text-white shadow-sm transition-colors"
                        title="Thay thế ảnh"
                    >
                        <UploadIcon className="w-3.5 h-3.5" />
                    </button>
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); onRemove?.(); }}
                        onPointerDown={(e) => e.stopPropagation()}
                        className="bg-white/90 text-red-500 rounded-full p-1.5 hover:bg-red-500 hover:text-white shadow-sm transition-colors"
                        title="Xóa ảnh"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            )}
        </div>
    );
};

// Sortable Wrapper
function SortableImageItem({
    id,
    url,
    onRemove,
    onReplace
}: {
    id: string;
    url: string;
    onRemove: () => void;
    onReplace: () => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="touch-none" // Recommended for dnd-kit
        >
            <ImageCard url={url} onRemove={onRemove} onReplace={onReplace} />
        </div>
    );
}

export function ImageUploadGrid({ value = [], onChange }: ImageUploadGridProps) {
    const fileInputRef = React.useRef<HTMLInputElement>(null);
    const replaceInputRef = React.useRef<HTMLInputElement>(null);
    const [replacingIndex, setReplacingIndex] = React.useState<number | null>(null);
    const [activeId, setActiveId] = useState<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // Requires 5px movement to start drag, preventing accidental drags on clicks
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = value.findIndex((url) => url === active.id);
            const newIndex = value.findIndex((url) => url === over.id);
            const newArray = arrayMove(value, oldIndex, newIndex);
            onChange?.(newArray);
        }
        setActiveId(null);
    };

    const handleRemoveImage = (indexToRemove: number) => {
        onChange?.(value.filter((_, index) => index !== indexToRemove));
    };

    const handleClearAll = () => {
        onChange?.([]);
    };

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0.5',
                },
            },
        }),
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        // Optimistically create upload placeholders if needed, but for now we wait for upload
        const uploadPromises = Array.from(files).map(async (file) => {
            const formData = new FormData();
            formData.append('file', file);
            try {
                const response = await fetch('/api/upload', { method: 'POST', body: formData });
                return response.ok ? (await response.json()).url : null;
            } catch { return null; }
        });

        const validUrls = (await Promise.all(uploadPromises)).filter((u): u is string => u !== null);
        if (validUrls.length > 0) onChange?.([...value, ...validUrls]);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleClickReplace = (index: number) => {
        setReplacingIndex(index);
        replaceInputRef.current?.click();
    };

    const handleReplaceFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || !files.length || replacingIndex === null) return;
        const formData = new FormData();
        formData.append('file', files[0]);
        try {
            const response = await fetch('/api/upload', { method: 'POST', body: formData });
            if (response.ok) {
                const data = await response.json();
                const newImages = [...value];
                newImages[replacingIndex] = data.url;
                onChange?.(newImages);
            }
        } catch { }
        setReplacingIndex(null);
        if (replaceInputRef.current) replaceInputRef.current.value = "";
    };

    const handleClickUpload = () => fileInputRef.current?.click();

    return (
        <div className="space-y-4">
            {/* Header with Actions */}
            {value.length > 0 && (
                <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                    <span className="text-sm font-medium text-slate-700">Hình ảnh ({value.length})</span>
                    <Popconfirm
                        title="Xóa tất cả ảnh?"
                        description="Hành động này không thể hoàn tác"
                        onConfirm={handleClearAll}
                        okText="Xóa hết"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Button
                            danger
                            type="text"
                            size="small"
                            icon={<Trash2 size={14} />}
                            className="text-red-500 hover:bg-red-50"
                        >
                            Xóa tất cả
                        </Button>
                    </Popconfirm>
                </div>
            )}

            <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} style={{ display: 'none' }} />
            <input ref={replaceInputRef} type="file" accept="image/*" onChange={handleReplaceFileChange} style={{ display: 'none' }} />

            {value.length > 0 ? (
                <>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext items={value} strategy={rectSortingStrategy}>
                            <div className={`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 ${value.length > 15 ? 'max-h-[400px] overflow-y-auto pr-2 custom-scrollbar' : ''}`}>
                                {value.map((url, index) => (
                                    <SortableImageItem
                                        key={`${url}-${index}`} // Use index in key if allow duplicates, but url should be unique enough.
                                        id={url}
                                        url={url}
                                        onRemove={() => handleRemoveImage(index)}
                                        onReplace={() => handleClickReplace(index)}
                                    />
                                ))}
                                {/* Add Button inside grid */}
                                <button
                                    type="button"
                                    onClick={handleClickUpload}
                                    className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
                                >
                                    <Plus className="w-6 h-6 mb-1" />
                                    <span className="text-xs">Thêm</span>
                                </button>
                            </div>
                        </SortableContext>

                        <DragOverlay dropAnimation={dropAnimation}>
                            {activeId ? (
                                <ImageCard
                                    url={activeId}
                                    isOverlay
                                />
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                </>
            ) : (
                <button
                    type="button"
                    onClick={handleClickUpload}
                    className="w-full border-2 border-dashed border-gray-300 rounded-lg p-12 text-center text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all cursor-pointer"
                >
                    <UploadIcon className="w-10 h-10 mx-auto mb-3" />
                    <p className="font-medium">Chưa có hình ảnh</p>
                    <p className="text-sm mt-1">Nhấp vào để tải ảnh lên</p>
                </button>
            )}
        </div>
    );
}
