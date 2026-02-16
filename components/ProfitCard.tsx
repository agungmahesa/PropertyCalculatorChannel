import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface ProfitCardProps {
    title: string;
    amount: number;
    percentage?: number;
    status?: 'healthy' | 'moderate' | 'low';
}

export default function ProfitCard({ title, amount, percentage, status }: ProfitCardProps) {
    return (
        <Card className="flex flex-col justify-between h-full bg-white border-slate-200">
            <CardHeader className="pb-2">
                <CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-slate-900">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount)}
                </div>
                {percentage !== undefined && (
                    <div className="mt-2 flex items-center gap-2">
                        <Badge variant={status === 'healthy' ? 'success' : status === 'low' ? 'danger' : 'warning'}>
                            {percentage.toFixed(1)}% Margin
                        </Badge>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
