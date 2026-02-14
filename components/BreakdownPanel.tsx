import { CalculatorResult } from '@/lib/types';

interface BreakdownPanelProps {
    result: CalculatorResult;
}

export default function BreakdownPanel({ result }: BreakdownPanelProps) {
    if (!result || !result.breakdown) {
        return null;
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <h3 className="font-semibold text-slate-900 dark:text-white">Deduction Breakdown</h3>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {result.breakdown.length === 0 ? (
                    <div className="px-6 py-8 text-center text-slate-500 text-sm">
                        No deductions applied.
                    </div>
                ) : (
                    result.breakdown.map((item) => (
                        <div key={item.item.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-rose-500"></div>
                                <div>
                                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                                        {item.item.name}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-0.5">
                                        {item.item.type === 'percentage'
                                            ? `${item.item.value}% of selling price`
                                            : 'Fixed amount'}
                                    </div>
                                </div>
                            </div>
                            <div className="text-sm font-semibold text-slate-900 dark:text-white">
                                -{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.amount)}
                            </div>
                        </div>
                    ))
                )}

                {/* Total Row */}
                <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between border-t-2 border-slate-100 dark:border-slate-800">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Total Deductions</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400">
                        -{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(result.totalDeductions)}
                    </span>
                </div>
            </div>
        </div>
    );
}
