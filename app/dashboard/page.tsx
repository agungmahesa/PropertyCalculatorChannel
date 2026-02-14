import TopNav from '@/components/TopNav';
import Link from 'next/link';
import {
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    CurrencyDollarIcon,
    UserGroupIcon,
    BuildingStorefrontIcon,
    ClockIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { prisma } from '@/lib/prisma';
import RevenueChart from '@/components/dashboard/RevenueChart';

// KPI Card Component
const KPICard = ({ title, value, change, trend, icon: Icon }: any) => (
    <Card className="hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg text-indigo-600 dark:text-indigo-400">
                <Icon className="h-5 w-5" />
            </div>
            <div className={`flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${trend === 'up' ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400' : 'text-rose-700 bg-rose-50 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                {trend === 'up' ? <ArrowTrendingUpIcon className="h-3 w-3 mr-1" /> : <ArrowTrendingDownIcon className="h-3 w-3 mr-1" />}
                {change}
            </div>
        </div>
        <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-50">{value}</h3>
        </div>
    </Card>
);

export default async function DashboardPage() {
    // Fetch data from database
    const [scenarios, channelCount, propertyCount, revenueResult] = await Promise.all([
        prisma.scenario.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: { channel: true, property: true }
        }),
        prisma.channel.count(),
        prisma.property.count(),
        prisma.scenario.aggregate({
            _sum: { netProfit: true }
        })
    ]);

    const totalProfit = revenueResult._sum.netProfit || 0;
    const formattedProfit = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 1,
        notation: 'compact'
    }).format(totalProfit);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <TopNav />
            {/* Main Content Area */}
            <main className="container-custom py-8 space-y-8">

                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Overview</h1>
                        <p className="text-slate-500 dark:text-slate-400">Welcome back, here's what's happening today.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="secondary" size="sm">Export Report</Button>
                        <Button size="sm">
                            <ClockIcon className="h-4 w-4 mr-2" />
                            Real-time
                        </Button>
                    </div>
                </div>

                {/* Section 1: KPI Summary Cards */}
                <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <KPICard title="Total Profit" value={formattedProfit} change="+12.5%" trend="up" icon={CurrencyDollarIcon} />
                    <KPICard title="Avg. Margin" value="74.2%" change="+2.1%" trend="up" icon={UserGroupIcon} />
                    <KPICard title="Active Channels" value={`${channelCount} Channels`} change="Stable" trend="up" icon={BuildingStorefrontIcon} />
                    <KPICard title="Properties" value={`${propertyCount} Active`} change="Check" trend="up" icon={ClockIcon} />
                </section>

                {/* Section 2: Primary Analytics & Secondary Insights */}
                <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Primary Chart (8 Cols) */}
                    <Card className="lg:col-span-8 flex flex-col h-full overflow-hidden">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div className="space-y-1">
                                <CardTitle>Revenue Performance</CardTitle>
                                <CardDescription>Estimated weekly layout based on calculations.</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" className="text-xs">Weekly</Button>
                                <Button variant="secondary" size="sm" className="text-xs">Monthly</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="flex-1 p-4">
                            <RevenueChart />
                        </CardContent>
                    </Card>

                    {/* Secondary Insights (4 Cols) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Quick Action Card */}
                        <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 rounded-xl p-6 text-white shadow-lg shadow-indigo-500/20 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 -mr-4 -mt-4 h-24 w-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
                            <h3 className="font-bold text-lg mb-2 relative z-10">New Booking?</h3>
                            <p className="text-indigo-100 text-sm mb-6 opacity-90 relative z-10">Calculate net profit instantly for a new reservation request.</p>
                            <Link href="/dashboard/calculator" className="w-full relative z-10">
                                <Button className="w-full bg-white text-indigo-600 hover:bg-slate-100 border-none shadow-md font-semibold">
                                    Open Calculator
                                </Button>
                            </Link>
                        </div>

                        {/* Recent Alerts */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Channel Alerts</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                                    <span className="relative flex h-2 w-2 mt-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                    </span>
                                    <div>
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Commission Alert</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">Review your Traveloka settings.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="relative flex h-2 w-2 mt-2">
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    <div>
                                        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">System Ready</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">All channels are synced and active.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* Section 3: Data Table */}
                <Card className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Calculations</CardTitle>
                        <Link href="/dashboard/calculator">
                            <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700">
                                View All <ChevronRightIcon className="h-4 w-4 ml-1" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 font-medium">
                                <tr>
                                    <th className="px-6 py-3">Scenario/Property</th>
                                    <th className="px-6 py-3">Channel</th>
                                    <th className="px-6 py-3">Selling Price</th>
                                    <th className="px-6 py-3">Net Profit</th>
                                    <th className="px-6 py-3">Margin</th>
                                    <th className="px-6 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {scenarios.length > 0 ? scenarios.map((scenario) => (
                                    <tr key={scenario.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-slate-200">
                                            {scenario.name}
                                            <div className="text-xs font-normal text-slate-500">{(scenario as any).property?.name || 'Hotel'}</div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400">{(scenario as any).channel?.name || 'Direct'}</td>
                                        <td className="px-6 py-4 text-slate-900 dark:text-slate-200">
                                            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(scenario.sellingPrice)}
                                        </td>
                                        <td className="px-6 py-4 text-emerald-600 font-medium">
                                            +{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(scenario.netProfit)}
                                        </td>
                                        <td className="px-6 py-4"><Badge variant="success">{scenario.profitMargin}%</Badge></td>
                                        <td className="px-6 py-4 text-right">
                                            <Button variant="ghost" size="sm" className="h-8 text-slate-400 hover:text-indigo-600">Details</Button>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                                            No calculations yet. Start by using the calculator!
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </main>
        </div>
    );
}
