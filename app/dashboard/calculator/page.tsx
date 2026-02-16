'use client';

import { useState, useMemo, useEffect } from 'react';
import TopNav from '@/components/TopNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import CurrencyInput from '@/components/CurrencyInput';
import BreakdownPanel from '@/components/BreakdownPanel';
import DeductionList from '@/components/DeductionList';
import ProfitCard from '@/components/ProfitCard';
import { CalculatorResult, DeductionItem } from '@/lib/types';
import { calculateChannelProfit } from '@/lib/calculator';
import { PlusIcon, ArrowPathIcon, TrashIcon, BookmarkIcon } from '@heroicons/react/24/outline';

const DEFAULT_TEMPLATES: Record<string, DeductionItem[]> = {
    'Agoda': [
        { id: '1', name: 'Agoda Commission', type: 'percentage', value: 18, isEnabled: true },
        { id: '2', name: 'Tax & Service', type: 'percentage', value: 21, isEnabled: true },
        { id: '3', name: 'Marketing Fee', type: 'fixed', value: 0, isEnabled: false },
    ],
    'Booking.com': [
        { id: '1', name: 'Booking.com Commission', type: 'percentage', value: 15, isEnabled: true },
        { id: '2', name: 'Tax & Service', type: 'percentage', value: 21, isEnabled: true },
        { id: '3', name: 'Payment Gateway', type: 'percentage', value: 3, isEnabled: true },
    ],
    'Traveloka': [
        { id: '1', name: 'Traveloka Commission', type: 'percentage', value: 17, isEnabled: true },
        { id: '2', name: 'Tax & Service', type: 'percentage', value: 21, isEnabled: true },
    ]
};

export default function CalculatorPage() {
    const [sellingPrice, setSellingPrice] = useState<number>(1500000);
    const [operationalCost, setOperationalCost] = useState<number>(375000);
    const [deductions, setDeductions] = useState<DeductionItem[]>(DEFAULT_TEMPLATES['Agoda']);
    const [customTemplates, setCustomTemplates] = useState<Record<string, DeductionItem[]>>({});
    const [newChannelName, setNewChannelName] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    // Load custom channels from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('profitstay_custom_channels');
        if (saved) {
            try {
                setCustomTemplates(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse custom channels', e);
            }
        }
    }, []);

    // Save custom channels to localStorage when they change
    const saveToLocalStorage = (updated: Record<string, DeductionItem[]>) => {
        setCustomTemplates(updated);
        localStorage.setItem('profitstay_custom_channels', JSON.stringify(updated));
    };

    const result = useMemo(() => {
        return calculateChannelProfit(sellingPrice, deductions, operationalCost);
    }, [sellingPrice, deductions, operationalCost]);

    const handleDeductionChange = (updatedDeductions: DeductionItem[]) => {
        setDeductions(updatedDeductions);
    };

    const applyTemplate = (templateDeductions: DeductionItem[]) => {
        setDeductions(JSON.parse(JSON.stringify(templateDeductions)));
    };

    const handleReset = () => {
        setSellingPrice(1500000);
        setOperationalCost(375000);
        applyTemplate(DEFAULT_TEMPLATES['Agoda']);
    };

    const handleAddDeduction = () => {
        const newDeduction: DeductionItem = {
            id: Date.now().toString(),
            name: 'New Item',
            type: 'percentage',
            value: 0,
            isEnabled: true,
        };
        setDeductions([...deductions, newDeduction]);
    };

    const handleSaveAsChannel = () => {
        if (!newChannelName.trim()) return;

        const updated = {
            ...customTemplates,
            [newChannelName.trim()]: [...deductions]
        };
        saveToLocalStorage(updated);
        setNewChannelName('');
        setIsSaving(false);
    };

    const handleDeleteChannel = (name: string, e: React.MouseEvent) => {
        e.stopPropagation();
        const updated = { ...customTemplates };
        delete updated[name];
        saveToLocalStorage(updated);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <TopNav />
            <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Channel Profit Calculator</h1>
                        <p className="text-slate-500">Analyze net profit from OTA bookings.</p>
                    </div>
                    <div className="flex flex-wrap gap-2 bg-white p-1 rounded-lg border border-slate-200">
                        {Object.entries(DEFAULT_TEMPLATES).map(([name, template]) => (
                            <Button
                                key={name}
                                variant="ghost"
                                size="sm"
                                onClick={() => applyTemplate(template)}
                                className="px-3"
                            >
                                {name}
                            </Button>
                        ))}

                        {Object.entries(customTemplates).map(([name, template]) => (
                            <div key={name} className="flex items-center gap-0.5 group">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => applyTemplate(template)}
                                    className="px-3 bg-indigo-50 text-indigo-700 border-0"
                                >
                                    {name}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => handleDeleteChannel(name, e)}
                                    className="px-1.5 h-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <TrashIcon className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        ))}

                        <div className="w-px bg-slate-200 mx-1"></div>
                        <Button variant="ghost" size="sm" onClick={handleReset} className="text-slate-500">
                            <ArrowPathIcon className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Left Column - Inputs */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>Enter the room rate and operational costs.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Selling Price (Gross)</label>
                                    <CurrencyInput
                                        value={sellingPrice}
                                        onChange={setSellingPrice}
                                        className="input"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Operational Cost (CPP)</label>
                                    <CurrencyInput
                                        value={operationalCost}
                                        onChange={setOperationalCost}
                                        className="input"
                                    />
                                    <p className="text-xs text-muted-foreground mt-1 text-slate-500">Estimated cost per occupied room (cleaning, amenities, etc.)</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Deductions</CardTitle>
                                    <CardDescription>Commissions, taxes, and fees.</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    {!isSaving ? (
                                        <Button size="sm" variant="ghost" onClick={() => setIsSaving(true)} className="text-indigo-600">
                                            <BookmarkIcon className="h-4 w-4 mr-1" /> Save as Channel
                                        </Button>
                                    ) : (
                                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
                                            <Input
                                                size={1}
                                                className="h-8 w-40"
                                                placeholder="Channel name..."
                                                value={newChannelName}
                                                onChange={(e) => setNewChannelName(e.target.value)}
                                                autoFocus
                                                onKeyDown={(e) => e.key === 'Enter' && handleSaveAsChannel()}
                                            />
                                            <Button size="sm" onClick={handleSaveAsChannel}>Save</Button>
                                            <Button size="sm" variant="ghost" onClick={() => { setIsSaving(false); setNewChannelName(''); }}>Cancel</Button>
                                        </div>
                                    )}
                                    <Button size="sm" variant="secondary" onClick={handleAddDeduction}>
                                        <PlusIcon className="h-4 w-4 mr-1" /> Add Item
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <DeductionList
                                    deductions={deductions}
                                    onChange={handleDeductionChange}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Results */}
                    <div className="flex flex-col gap-6">
                        {/* Summary Cards */}
                        <div className="grid grid-cols-2 gap-4 relative z-10">
                            <ProfitCard
                                title="Net Revenue"
                                amount={result.netRevenue}
                            />
                            <ProfitCard
                                title="Net Profit"
                                amount={result.netProfit}
                                percentage={result.profitMargin}
                                status={result.profitStatus}
                            />
                        </div>

                        {/* Breakdown */}
                        <div className="relative z-0">
                            <BreakdownPanel result={result} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

