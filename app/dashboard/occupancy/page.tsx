'use client';

import { useState } from 'react';
import { calculateOccupancy } from '@/lib/calculator';
import TopNav from '@/components/TopNav';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { ChartBarIcon, ExclamationTriangleIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

export default function OccupancyPage() {
    const [totalRooms, setTotalRooms] = useState(20);
    const [bookedRooms, setBookedRooms] = useState(15);
    const [threshold, setThreshold] = useState(70);

    const result = calculateOccupancy(totalRooms, bookedRooms, threshold);

    return (
        <div className="min-h-screen bg-slate-50">
            <TopNav />
            <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">
                            Occupancy Alert
                        </h1>
                        <p className="mt-1 text-slate-500">
                            Get pricing recommendations based on real-time occupancy rates
                        </p>
                    </div>
                </div>

                {/* Main Configuration Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Configuration</CardTitle>
                        <CardDescription>Adjust your property capacity and target occupancy threshold</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">
                                    Total Rooms
                                </label>
                                <Input
                                    type="number"
                                    value={totalRooms}
                                    onChange={(e) => setTotalRooms(parseInt(e.target.value) || 1)}
                                    className="text-lg font-bold"
                                    min="1"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">
                                    Current Booked Rooms
                                </label>
                                <Input
                                    type="number"
                                    value={bookedRooms}
                                    onChange={(e) => setBookedRooms(Math.min(parseInt(e.target.value) || 0, totalRooms))}
                                    className="text-lg font-bold"
                                    min="0"
                                    max={totalRooms}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-slate-700">
                                    Threshold (%)
                                </label>
                                <div className="relative">
                                    <Input
                                        type="number"
                                        value={threshold}
                                        onChange={(e) => setThreshold(parseInt(e.target.value) || 0)}
                                        className="text-lg font-bold pr-8"
                                        min="0"
                                        max="100"
                                    />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">%</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Status and Recommendation */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Occupancy Rate Display */}
                    <Card className="lg:col-span-2 overflow-hidden border-0 shadow-lg">
                        <div className={`h-2 w-full ${result.status === 'high' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                        <CardContent className="pt-8 pb-10 text-center">
                            <div className="flex justify-center mb-6">
                                <div className={`p-4 rounded-full ${result.status === 'high' ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                                    {result.status === 'high' ? (
                                        <CheckCircleIcon className="h-12 w-12 text-emerald-600" />
                                    ) : (
                                        <ExclamationTriangleIcon className="h-12 w-12 text-amber-600" />
                                    )}
                                </div>
                            </div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-slate-500 mb-2">
                                Current Occupancy Rate
                            </p>
                            <h2 className={`text-7xl font-black mb-6 ${result.status === 'high' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {result.occupancyRate.toFixed(1)}%
                            </h2>
                            <div className="max-w-md mx-auto space-y-4">
                                <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden border border-slate-200">
                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ease-out ${result.status === 'high' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                        style={{ width: `${Math.min(result.occupancyRate, 100)}%` }}
                                    />
                                </div>
                                <div className="flex justify-between items-center text-sm font-medium text-slate-500 px-1">
                                    <span>{bookedRooms} Booked</span>
                                    <span>{totalRooms - bookedRooms} Available</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recommendation Card */}
                    <div className="space-y-6">
                        <Card className="bg-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-500/20">
                            <CardHeader>
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <ChartBarIcon className="h-6 w-6 text-white" />
                                    </div>
                                    <CardTitle className="text-white">Strategy</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-lg font-medium leading-relaxed">
                                    {result.recommendation}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Info List */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base font-bold">📌 Business Logic</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <ul className="space-y-4 text-sm text-slate-600">
                                    <li className="flex gap-3">
                                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></div>
                                        <span>If occupancy is <strong>above {threshold}%</strong>, demand is strong - increase prices by <strong>5-10%</strong>.</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></div>
                                        <span>If occupancy is <strong>below {threshold}%</strong>, maintain pricing or consider <strong>limited promotions</strong>.</span>
                                    </li>
                                    <li className="flex gap-3">
                                        <div className="h-1.5 w-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></div>
                                        <span>Adjust thresholds seasonally to optimize for high vs low periods.</span>
                                    </li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
