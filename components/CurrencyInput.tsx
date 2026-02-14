import React from 'react';
import { Input } from './ui/Input';

interface CurrencyInputProps {
    value: number;
    onChange: (value: number) => void;
    className?: string;
    placeholder?: string;
    label?: string; // Optional, for backward compatibility or if needed
}

export default function CurrencyInput({ value, onChange, className = '', placeholder, label }: CurrencyInputProps) {
    // Simple controlled input for IDR
    const format = (val: number) => new Intl.NumberFormat('id-ID', { maximumFractionDigits: 0 }).format(val);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Remove non-digit characters
        const rawValue = e.target.value.replace(/\D/g, '');
        const numValue = parseInt(rawValue, 10);
        onChange(isNaN(numValue) ? 0 : numValue);
    };

    return (
        <div className="relative">
            {label && (
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-medium">Rp</span>
                <Input
                    type="text"
                    value={value ? format(value) : ''}
                    onChange={handleChange}
                    className={`pl-9 ${className}`}
                    placeholder={placeholder || '0'}
                />
            </div>
        </div>
    );
}
