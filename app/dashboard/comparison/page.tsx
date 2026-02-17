'use client';

import { useState } from 'react';
import CurrencyInput from '@/components/CurrencyInput';
import ProfitCard from '@/components/ProfitCard';
import TopNav from '@/components/TopNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DeductionItem } from '@/lib/types';
import { calculateChannelProfit, formatIDR, formatPercentage } from '@/lib/calculator';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Simplified templates for comparison
const CHANNELS: Record<string, DeductionItem[]> = {
    direct: [
        { id: '1', name: 'Payment Fee', type: 'percentage', value: 2.5, isEnabled: true },
        { id: '2', name: 'Tax', type: 'percentage', value: 10, isEnabled: true },
    ],
    agoda: [
        { id: '1', name: 'OTA Commission', type: 'percentage', value: 18, isEnabled: true },
        { id: '2', name: 'Payment Fee', type: 'percentage', value: 2.5, isEnabled: true },
        { id: '3', name: 'Tax', type: 'percentage', value: 10, isEnabled: true },
    ],
    booking: [
        { id: '1', name: 'OTA Commission', type: 'percentage', value: 15, isEnabled: true },
        { id: '2', name: 'Payment Fee', type: 'percentage', value: 2.5, isEnabled: true },
        { id: '3', name: 'Tax', type: 'percentage', value: 10, isEnabled: true },
    ],
    traveloka: [
        { id: '1', name: 'OTA Commission', type: 'percentage', value: 20, isEnabled: true },
        { id: '2', name: 'Payment Fee', type: 'percentage', value: 2.5, isEnabled: true },
        { id: '3', name: 'Tax', type: 'percentage', value: 10, isEnabled: true },
    ],
    tiket: [
        { id: '1', name: 'OTA Commission', type: 'percentage', value: 17, isEnabled: true },
        { id: '2', name: 'Payment Fee', type: 'percentage', value: 2.5, isEnabled: true },
        { id: '3', name: 'Tax', type: 'percentage', value: 10, isEnabled: true },
    ],
};

export default function ComparisonPage() {
    const [sellingPrice, setSellingPrice] = useState(1000000);
    const [operationalCost, setOperationalCost] = useState(300000);
    const [channel1, setChannel1] = useState('direct');
    const [channel2, setChannel2] = useState('agoda');
    const [totalRooms, setTotalRooms] = useState(20);
    const [occupancy, setOccupancy] = useState(70);

    const result1 = calculateChannelProfit(sellingPrice, CHANNELS[channel1], operationalCost);
    const result2 = calculateChannelProfit(sellingPrice, CHANNELS[channel2], operationalCost);

    const totalDeductions1 = sellingPrice - result1.netRevenue;
    const totalDeductions2 = sellingPrice - result2.netRevenue;

    const profitDifference = result1.netProfit - result2.netProfit;
    const marginDifference = result1.profitMargin - result2.profitMargin;

    const monthlyImpact = profitDifference * (totalRooms * (occupancy / 100)) * 30;

    const chartData = [
        {
            name: channel1.charAt(0).toUpperCase() + channel1.slice(1),
            'Net Profit': result1.netProfit,
            'Deductions': totalDeductions1,
        },
        {
            name: channel2.charAt(0).toUpperCase() + channel2.slice(1),
            'Net Profit': result2.netProfit,
            'Deductions': totalDeductions2,
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <TopNav />
            <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Channel Comparison
                        </h1>
                        <p className="mt-1 text-slate-500">
                            Compare profit margins between different booking channels
                        </p>
                    </div>
                </div>

                {/* Main Inputs Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Base Configuration</CardTitle>
                        <CardDescription>Set your property's base pricing and capacity benchmarks</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <CurrencyInput
                                label="Selling Price"
                                value={sellingPrice}
                                onChange={setSellingPrice}
                            />
                            <CurrencyInput
                                label="Operational Cost"
                                value={operationalCost}
                                onChange={setOperationalCost}
                            />
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">
                                    Total Rooms
                                </label>
                                <Input
                                    type="number"
                                    value={totalRooms}
                                    onChange={(e) => setTotalRooms(parseInt(e.target.value) || 0)}
                                    min="1"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">
                                    Occupancy (%)
                                </label>
                                <Input
                                    type="number"
                                    value={occupancy}
                                    onChange={(e) => setOccupancy(parseInt(e.target.value) || 0)}
                                    min="0"
                                    max="100"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Channel Comparison Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Selectors and Results */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Channel 1 Column */}
                            <div className="space-y-4">
                                <select
                                    value={channel1}
                                    onChange={(e) => setChannel1(e.target.value)}
                                    className="w-full h-10 rounded-md border-slate-300 bg-white font-semibold px-3"
                                >
                                    {Object.keys(CHANNELS).map((ch) => (
                                        <option key={ch} value={ch}>
                                            {ch === 'direct' ? 'Direct Booking' :
                                                ch === 'agoda' ? 'Agoda' :
                                                    ch === 'booking' ? 'Booking.com' :
                                                        ch === 'traveloka' ? 'Traveloka' : 'Tiket'}
                                        </option>
                                    ))}
                                </select>

                                <div className="space-y-3">
                                    <ProfitCard
                                        title="Selling Price"
                                        amount={sellingPrice}
                                    />
                                    <ProfitCard
                                        title="Net Profit"
                                        amount={result1.netProfit}
                                        percentage={result1.profitMargin}
                                        status={result1.profitStatus}
                                    />
                                </div>
                            </div>

                            {/* Channel 2 Column */}
                            <div className="space-y-4">
                                <select
                                    value={channel2}
                                    onChange={(e) => setChannel2(e.target.value)}
                                    className="w-full h-10 rounded-md border-slate-300 bg-white font-semibold px-3"
                                >
                                    {Object.keys(CHANNELS).map((ch) => (
                                        <option key={ch} value={ch}>
                                            {ch === 'direct' ? 'Direct Booking' :
                                                ch === 'agoda' ? 'Agoda' :
                                                    ch === 'booking' ? 'Booking.com' :
                                                        ch === 'traveloka' ? 'Traveloka' : 'Tiket'}
                                        </option>
                                    ))}
                                </select>

                                <div className="space-y-3">
                                    <ProfitCard
                                        title="Selling Price"
                                        amount={sellingPrice}
                                    />
                                    <ProfitCard
                                        title="Net Profit"
                                        amount={result2.netProfit}
                                        percentage={result2.profitMargin}
                                        status={result2.profitStatus}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Chart Card */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Profit Analysis</CardTitle>
                                <CardDescription>Visual breakdown of profit vs deductions</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] w-full mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={chartData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                            <XAxis
                                                dataKey="name"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#64748b', fontSize: 12 }}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fill: '#64748b', fontSize: 12 }}
                                                tickFormatter={(value) => `Rp${value / 1000}k`}
                                            />
                                            <Tooltip
                                                cursor={{ fill: '#f1f5f9' }}
                                                content={({ active, payload }) => {
                                                    if (active && payload && payload.length) {
                                                        return (
                                                            <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-lg">
                                                                <p className="font-bold text-slate-900 mb-2 text-sm">{payload[0].payload.name}</p>
                                                                {payload.map((entry, index) => (
                                                                    <div key={index} className="flex items-center gap-2 text-xs">
                                                                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
                                                                        <span className="text-slate-500">{entry.name}:</span>
                                                                        <span className="font-semibold text-slate-900">{formatIDR(entry.value as number)}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                            <Legend verticalAlign="top" height={36} />
                                            <Bar dataKey="Net Profit" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                                            <Bar dataKey="Deductions" fill="#f43f5e" radius={[4, 4, 0, 0]} barSize={40} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Monthly Impact Summary */}
                    <div className="lg:col-span-1">
                        <Card className="h-full bg-white border-slate-200">
                            <CardHeader>
                                <CardTitle className="text-slate-900">Monthly Projection</CardTitle>
                                <CardDescription className="text-slate-500 text-sm">Estimated impact based on {totalRooms} rooms at {occupancy}%</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                    <div className="text-slate-500 text-xs mb-1 uppercase tracking-wider font-semibold">Profit Difference / Room</div>
                                    <div className={`text-2xl font-bold ${profitDifference >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {profitDifference >= 0 ? '+' : ''}{formatIDR(profitDifference)}
                                    </div>
                                    <div className={`text-xs mt-1 font-medium ${marginDifference >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                        {marginDifference >= 0 ? '+' : ''}{formatPercentage(marginDifference, 2)} margin
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4">
                                    <div className="flex justify-between items-center text-slate-600">
                                        <span className="text-sm text-slate-500">Active Period</span>
                                        <span className="font-semibold text-sm">30 Days</span>
                                    </div>
                                    <div className="flex justify-between items-center text-slate-600">
                                        <span className="text-sm text-slate-500">Avg Occupancy</span>
                                        <span className="font-semibold text-sm">{occupancy}%</span>
                                    </div>

                                    <div className="pt-6 border-t border-slate-100">
                                        <div className="text-slate-500 text-xs mb-2 uppercase tracking-wider font-bold">Total Monthly Impact</div>
                                        <div className={`text-3xl font-black ${monthlyImpact >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                            {monthlyImpact >= 0 ? '+' : ''}{formatIDR(monthlyImpact)}
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-8">
                                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white border-0 shadow-lg shadow-indigo-500/20">
                                        Export Comparison
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
