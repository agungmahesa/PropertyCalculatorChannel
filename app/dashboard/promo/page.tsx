'use client';

import { useState } from 'react';
import CurrencyInput from '@/components/CurrencyInput';
import TopNav from '@/components/TopNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DeductionItem } from '@/lib/types';
import { calculatePromoImpact, formatIDR, formatPercentage } from '@/lib/calculator';
import { ArrowTrendingDownIcon, ArrowTrendingUpIcon, LightBulbIcon } from '@heroicons/react/24/solid';

const DEFAULT_DEDUCTIONS: DeductionItem[] = [
    { id: '1', name: 'OTA Commission', type: 'percentage', value: 18, isEnabled: true },
    { id: '2', name: 'Payment Fee', type: 'percentage', value: 2.5, isEnabled: true },
    { id: '3', name: 'Tax', type: 'percentage', value: 10, isEnabled: true },
];

export default function PromoPage() {
    const [normalPrice, setNormalPrice] = useState(1000000);
    const [operationalCost, setOperationalCost] = useState(300000);
    const [discountPercentage, setDiscountPercentage] = useState(15);

    const result = calculatePromoImpact(normalPrice, operationalCost, discountPercentage, DEFAULT_DEDUCTIONS);

    return (
        <div className="min-h-screen bg-slate-50">
            <TopNav />
            <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Promo Simulator
                        </h1>
                        <p className="mt-1 text-slate-500">
                            Analyze the impact of discounts on your net profit and required volume
                        </p>
                    </div>
                </div>

                {/* Main Inputs Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Simulation Parameters</CardTitle>
                        <CardDescription>Configure your base price, costs, and proposed discount</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <CurrencyInput
                                label="Normal Price (Gross)"
                                value={normalPrice}
                                onChange={setNormalPrice}
                            />
                            <CurrencyInput
                                label="Operational Cost (CPP)"
                                value={operationalCost}
                                onChange={setOperationalCost}
                            />
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">
                                    Planned Discount (%)
                                </label>
                                <div className="relative">
                                    <Input
                                        type="number"
                                        value={discountPercentage}
                                        onChange={(e) => setDiscountPercentage(parseFloat(e.target.value) || 0)}
                                        className="pr-8 font-bold"
                                        min="0"
                                        max="100"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">%</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Outcome Summary Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Side: Comparison and Analysis */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="bg-white border-slate-200">
                                <CardHeader className="pb-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Normal Pricing</span>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-slate-900 mb-2">{formatIDR(normalPrice)}</div>
                                    <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                                        Profit: {formatIDR(result.normalProfit)}
                                        <span className="px-1.5 py-0.5 bg-emerald-100 rounded text-xs font-bold">
                                            {formatPercentage((result.normalProfit / normalPrice) * 100, 1)}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-indigo-50 border-indigo-200">
                                <CardHeader className="pb-2">
                                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Discounted Pricing</span>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-3xl font-bold text-indigo-700 mb-2">{formatIDR(result.discountedPrice)}</div>
                                    <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium">
                                        Profit: {formatIDR(result.discountedProfit)}
                                        <span className="px-1.5 py-0.5 bg-indigo-100 rounded text-xs font-bold">
                                            {formatPercentage((result.discountedProfit / result.discountedPrice) * 100, 1)}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Impact Analysis Breakdown */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Profit Impact Breakdown</CardTitle>
                                <CardDescription>Direct financial consequences of the discount</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-0 p-0">
                                <div className="divide-y divide-slate-100">
                                    <div className="flex items-center justify-between p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-rose-100 rounded-xl text-rose-600">
                                                <ArrowTrendingDownIcon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900">Profit Drop / Room</div>
                                                <p className="text-sm text-slate-500">Total revenue loss per booking</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-black text-rose-600">{formatIDR(result.profitDrop)}</div>
                                            <div className="text-sm font-bold text-rose-500">-{formatPercentage(result.profitDropPercentage, 1)}</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
                                                <ArrowTrendingDownIcon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900">Margin Reduction</div>
                                                <p className="text-sm text-slate-500">Percentage points decrease</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-black text-amber-600">{formatPercentage(result.marginDifference, 1)}</div>
                                            <div className="text-sm font-bold text-amber-500">pts lower</div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600">
                                                <ArrowTrendingUpIcon className="h-6 w-6" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900">Required Volume Increase</div>
                                                <p className="text-sm text-slate-500">To maintain current total profit</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-black text-indigo-600">+{result.additionalRoomsNeeded} Rooms</div>
                                            <div className="text-sm font-bold text-indigo-500">compensation volume</div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Side: Strategy and Tips */}
                    <div className="space-y-6">
                        <Card className="bg-indigo-600 text-white border-0 shadow-xl overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <LightBulbIcon className="h-24 w-24" />
                            </div>
                            <CardHeader>
                                <CardTitle className="text-white">Compensation Strategy</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-indigo-100 leading-relaxed">
                                    To maintain the same total profit with this <strong>{discountPercentage}% discount</strong>, you need to sell:
                                </p>
                                <div className="p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                                    <div className="text-4xl font-black mb-1">+{result.additionalRoomsNeeded}</div>
                                    <div className="text-sm font-medium uppercase tracking-wider text-indigo-200">Additional Room{result.additionalRoomsNeeded !== 1 ? 's' : ''}</div>
                                </div>
                                <p className="text-xs text-indigo-200 italic pt-2">
                                    Calculation: {formatIDR(result.profitDrop)} lost profit ÷ {formatIDR(result.discountedProfit)} unit profit.
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-bold text-slate-900">📌 Decision Guide</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-[10px] font-bold">1</span>
                                        </div>
                                        <p className="text-sm text-slate-600">Can you realistically achieve a <strong>{result.additionalRoomsNeeded} room</strong> increase in bookings?</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-[10px] font-bold">2</span>
                                        </div>
                                        <p className="text-sm text-slate-600">Consider if the discount will attract <strong>new segments</strong> or just dilute existing ones.</p>
                                    </div>
                                    <div className="flex gap-3">
                                        <div className="h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-[10px] font-bold">3</span>
                                        </div>
                                        <p className="text-sm text-slate-600">Check if your <strong>marginal costs</strong> (like extra laundry) change at higher volumes.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
