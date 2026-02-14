'use client';

import { DeductionComponent } from '@/lib/types';
import { Bars3Icon, TrashIcon } from '@heroicons/react/24/outline';

interface DeductionItemProps {
    deduction: DeductionComponent;
    onToggle: (id: string) => void;
    onTypeChange: (id: string, type: 'percentage' | 'fixed') => void;
    onValueChange: (id: string, value: number) => void;
    onDelete?: (id: string) => void;
    dragHandleProps?: any;
}

export default function DeductionItem({
    deduction,
    onToggle,
    onTypeChange,
    onValueChange,
    onDelete,
    dragHandleProps,
}: DeductionItemProps) {
    return (
        <div className={`
      card transition-all
      ${!deduction.isEnabled ? 'opacity-50' : ''}
    `}>
            {/* Mobile Layout */}
            <div className="flex flex-col gap-3 sm:hidden">
                {/* Top Row: Drag, Toggle, Name, Delete */}
                <div className="flex items-center gap-3">
                    <div {...dragHandleProps} className="drag-handle cursor-grab active:cursor-grabbing touch-none">
                        <Bars3Icon className="h-6 w-6" />
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={deduction.isEnabled}
                            onChange={() => onToggle(deduction.id)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                    </label>

                    <div className="flex-1">
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                            {deduction.name}
                        </p>
                    </div>

                    {onDelete && (
                        <button
                            onClick={() => onDelete(deduction.id)}
                            className="p-2 text-slate-400 hover:text-red-600 transition-colors touch-manipulation"
                            title="Delete deduction"
                        >
                            <TrashIcon className="h-5 w-5" />
                        </button>
                    )}
                </div>

                {/* Bottom Row: Type and Value */}
                <div className="flex gap-3 pl-9">
                    <select
                        value={deduction.type}
                        onChange={(e) => onTypeChange(deduction.id, e.target.value as 'percentage' | 'fixed')}
                        disabled={!deduction.isEnabled}
                        className="input flex-1 py-2.5 text-base"
                    >
                        <option value="percentage">Percentage</option>
                        <option value="fixed">Fixed</option>
                    </select>

                    <div className="relative flex-1">
                        <input
                            type="number"
                            value={deduction.value}
                            onChange={(e) => onValueChange(deduction.id, parseFloat(e.target.value) || 0)}
                            disabled={!deduction.isEnabled}
                            step={deduction.type === 'percentage' ? '0.1' : '1000'}
                            min="0"
                            max={deduction.type === 'percentage' ? '100' : undefined}
                            className="input w-full py-2.5 text-right pr-12 font-mono text-base font-semibold text-slate-900 dark:text-slate-100"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400 text-sm font-bold pointer-events-none">
                            {deduction.type === 'percentage' ? '%' : 'Rp'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center gap-4">
                <div {...dragHandleProps} className="drag-handle cursor-grab active:cursor-grabbing">
                    <Bars3Icon className="h-5 w-5" />
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                    <input
                        type="checkbox"
                        checked={deduction.isEnabled}
                        onChange={() => onToggle(deduction.id)}
                        className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-blue-600"></div>
                </label>

                <div className="flex-1">
                    <p className="font-medium text-slate-900 dark:text-slate-100">
                        {deduction.name}
                    </p>
                </div>

                <select
                    value={deduction.type}
                    onChange={(e) => onTypeChange(deduction.id, e.target.value as 'percentage' | 'fixed')}
                    disabled={!deduction.isEnabled}
                    className="input w-32 py-2"
                >
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed</option>
                </select>

                <div className="relative w-44">
                    <input
                        type="number"
                        value={deduction.value}
                        onChange={(e) => onValueChange(deduction.id, parseFloat(e.target.value) || 0)}
                        disabled={!deduction.isEnabled}
                        step={deduction.type === 'percentage' ? '0.1' : '1000'}
                        min="0"
                        max={deduction.type === 'percentage' ? '100' : undefined}
                        className="input py-2.5 text-right pr-12 font-mono text-base font-semibold text-slate-900 dark:text-slate-100"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 dark:text-slate-400 text-sm font-bold pointer-events-none">
                        {deduction.type === 'percentage' ? '%' : 'Rp'}
                    </span>
                </div>

                {onDelete && (
                    <button
                        onClick={() => onDelete(deduction.id)}
                        className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                        title="Delete deduction"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                )}
            </div>
        </div>
    );
}
