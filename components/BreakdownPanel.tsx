import { CalculatorResult } from '@/lib/types';

interface BreakdownPanelProps {
    result: CalculatorResult;
}

export default function BreakdownPanel({ result }: BreakdownPanelProps) {
    if (!result || !result.breakdown) {
        return null;
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50">
                <h3 className="font-semibold text-slate-900">Deduction Breakdown</h3>
            </div>
            <div className="divide-y divide-slate-100">
                {result.breakdown.length === 0 ? (
                    <div className="px-6 py-8 text-center text-slate-500 text-sm">
                        No deductions applied.
                    </div>
                ) : (
                    result.breakdown.map((item) => (
                        <div key={item.item.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="h-2 w-2 rounded-full bg-rose-500"></div>
                                <div>
                                    <div className="text-sm font-medium text-slate-900">
                                        {item.item.name}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-0.5">
                                        {item.item.type === 'percentage'
                                            ? `${item.item.value}% of selling price`
                                            : 'Fixed amount'}
                                    </div>
                                </div>
                            </div>
                            <div className="text-sm font-semibold text-slate-900">
                                -{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.amount)}
                            </div>
                        </div>
                    ))
                )}

                {/* Total Row */}
                <div className="px-6 py-4 bg-slate-50 flex items-center justify-between border-t-2 border-slate-100">
                    <span className="font-semibold text-slate-700">Total Deductions</span>
                    <span className="font-bold text-rose-600">
                        -{new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(result.totalDeductions)}
                    </span>
                </div>
            </div>
        </div>
    );
}
