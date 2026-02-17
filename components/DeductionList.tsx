'use client';

import React from 'react';
import { DeductionItem } from '@/lib/types';
import { Input } from './ui/Input';
import { TrashIcon, Bars2Icon } from '@heroicons/react/24/outline';
import CurrencyInput from './CurrencyInput';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface DeductionListProps {
    deductions: DeductionItem[];
    onChange: (deductions: DeductionItem[]) => void;
}

interface SortableItemProps {
    deduction: DeductionItem;
    onChange: (id: string, field: keyof DeductionItem, value: any) => void;
    onDelete: (id: string) => void;
}

function SortableDeductionItem({ deduction, onChange, onDelete }: SortableItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: deduction.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-200 shadow-sm transition-shadow ${isDragging ? 'shadow-lg border-indigo-500 ring-2 ring-indigo-500/20' : ''}`}
        >
            {/* Drag Handle */}
            <button
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
                <Bars2Icon className="h-4 w-4" />
            </button>

            <input
                type="checkbox"
                checked={deduction.isEnabled}
                onChange={(e) => onChange(deduction.id, 'isEnabled', e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
            />

            <div className="flex-1 min-w-0 grid grid-cols-12 gap-2">
                <div className="col-span-12 sm:col-span-5">
                    <Input
                        value={deduction.name}
                        onChange={(e) => onChange(deduction.id, 'name', e.target.value)}
                        className="h-8 text-sm"
                        placeholder="Name"
                    />
                </div>
                <div className="col-span-5 sm:col-span-3">
                    <select
                        value={deduction.type}
                        onChange={(e) => onChange(deduction.id, 'type', e.target.value)}
                        className="w-full h-8 text-sm rounded-md border-slate-300 bg-white focus:ring-1 focus:ring-indigo-500"
                    >
                        <option value="percentage">%</option>
                        <option value="fixed">Flat</option>
                    </select>
                </div>
                <div className="col-span-7 sm:col-span-4">
                    {deduction.type === 'percentage' ? (
                        <div className="relative">
                            <Input
                                type="number"
                                value={isNaN(deduction.value) ? '' : deduction.value}
                                onChange={(e) => {
                                    const val = parseFloat(e.target.value);
                                    onChange(deduction.id, 'value', isNaN(val) ? 0 : val);
                                }}
                                className="h-8 text-sm pr-6"
                                placeholder="0"
                            />
                            <span className="absolute right-2 top-1.5 text-xs text-slate-500">%</span>
                        </div>
                    ) : (
                        <CurrencyInput
                            value={deduction.value}
                            onChange={(val) => onChange(deduction.id, 'value', val)}
                            className="h-8 text-sm py-1"
                        />
                    )}
                </div>
            </div>

            <button
                onClick={() => onDelete(deduction.id)}
                className="text-slate-400 hover:text-rose-500 transition-colors"
            >
                <TrashIcon className="h-4 w-4" />
            </button>
        </div>
    );
}

export default function DeductionList({ deductions, onChange }: DeductionListProps) {
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

    const handleDeductionChange = (id: string, field: keyof DeductionItem, value: any) => {
        const updated = deductions.map(d =>
            d.id === id ? { ...d, [field]: value } : d
        );
        onChange(updated);
    };

    const handleDelete = (id: string) => {
        onChange(deductions.filter(d => d.id !== id));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = deductions.findIndex((d) => d.id === active.id);
            const newIndex = deductions.findIndex((d) => d.id === over.id);
            onChange(arrayMove(deductions, oldIndex, newIndex));
        }
    };

    return (
        <div className="space-y-3">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={deductions.map(d => d.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-3">
                        {deductions.map((deduction) => (
                            <SortableDeductionItem
                                key={deduction.id}
                                deduction={deduction}
                                onChange={handleDeductionChange}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {deductions.length === 0 && (
                <div className="text-center py-6 text-slate-500 text-sm italic border-2 border-dashed border-slate-200 rounded-xl">
                    No deductions added.
                </div>
            )}
        </div>
    );
}
