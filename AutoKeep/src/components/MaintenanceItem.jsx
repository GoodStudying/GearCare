import { PenTool, CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react';
import { calculateMaintenanceStatus } from '../utils/maintenance';

export default function MaintenanceItem({ item, vehicle, onRecordLog }) {
    const statusObj = calculateMaintenanceStatus(item, vehicle.current_mileage, vehicle.daily_avg_km);
    const { status, mileage, date } = statusObj;

    const StatusIcon = {
        normal: CheckCircle,
        warning: AlertTriangle,
        overdue: AlertOctagon
    }[status];

    const styles = {
        normal: {
            bg: 'bg-emerald-50/50',
            border: 'border-emerald-100',
            iconBg: 'bg-emerald-100',
            iconText: 'text-emerald-600',
            barBg: 'bg-emerald-400',
            text: 'text-emerald-700'
        },
        warning: {
            bg: 'bg-amber-50/80',
            border: 'border-amber-200',
            iconBg: 'bg-amber-200',
            iconText: 'text-amber-700',
            barBg: 'bg-amber-500',
            text: 'text-amber-800'
        },
        overdue: {
            bg: 'bg-rose-50/80',
            border: 'border-rose-200',
            iconBg: 'bg-rose-200',
            iconText: 'text-rose-700',
            barBg: 'bg-rose-500',
            text: 'text-rose-800'
        }
    }[status];

    // 计算进度条比例 (简化的视觉呈现)
    const getProgress = () => {
        if (status === 'overdue') return 100;
        if (!item.interval_km || mileage.remaining === null) return 0;
        const ratio = (item.interval_km - mileage.remaining) / item.interval_km;
        return Math.min(Math.max(ratio * 100, 5), 100);
    };

    return (
        <div className={`group relative flex flex-col p-4 rounded-2xl border ${styles.bg} ${styles.border} transition-all duration-300 hover:shadow-md hover:-translate-y-0.5`}>
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${styles.iconBg} ${styles.iconText} shadow-sm`}>
                        <StatusIcon className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h4 className={`font-bold tracking-tight ${styles.text}`}>{item.item_name}</h4>
                        <div className="text-xs font-medium text-slate-500 mt-0.5">
                            周期: {item.interval_km ? `${item.interval_km.toLocaleString()}km` : ''}
                            {item.interval_km && item.interval_months ? ' / ' : ''}
                            {item.interval_months ? `${item.interval_months}个月` : ''}
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => onRecordLog(item)}
                    className="flex items-center justify-center p-2 rounded-lg bg-white shadow-sm border border-slate-200 text-slate-400 hover:text-brand-600 hover:border-brand-200 hover:bg-brand-50 transition-all active:scale-95"
                    title="记录此项保养"
                >
                    <PenTool className="w-4 h-4" />
                </button>
            </div>

            <div className="mt-1 space-y-1.5">
                <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-500">
                        {status === 'overdue' ? '已过期' : '健康剩余'}
                    </span>
                    <span className={styles.text}>
                        {mileage.remaining !== null ? `${mileage.remaining.toLocaleString()} km ` : ''}
                        {date.remaining !== null && mileage.remaining !== null ? `或 ` : ''}
                        {date.remaining !== null ? `${date.remaining} 天` : ''}
                    </span>
                </div>
                <div className="w-full bg-slate-200/50 rounded-full h-1.5 overflow-hidden">
                    <div
                        className={`h-1.5 rounded-full ${styles.barBg} transition-all duration-1000 ease-out`}
                        style={{ width: `${getProgress()}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
