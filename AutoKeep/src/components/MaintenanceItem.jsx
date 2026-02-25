import { PenTool, CheckCircle, AlertTriangle, AlertOctagon, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
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
            bg: 'bg-white',
            border: 'border-slate-100',
            iconBg: 'bg-emerald-50',
            iconBorder: 'border-emerald-100',
            iconText: 'text-emerald-500',
            barBg: 'bg-emerald-400',
            text: 'text-emerald-600',
            buttonHover: 'hover:text-emerald-600 hover:border-emerald-200 hover:bg-emerald-50'
        },
        warning: {
            bg: 'bg-white',
            border: 'border-amber-200 shadow-amber-500/5',
            iconBg: 'bg-amber-50',
            iconBorder: 'border-amber-200',
            iconText: 'text-amber-500',
            barBg: 'bg-amber-400',
            text: 'text-amber-600',
            buttonHover: 'hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50'
        },
        overdue: {
            bg: 'bg-rose-50/30',
            border: 'border-rose-200 shadow-rose-500/10',
            iconBg: 'bg-rose-100',
            iconBorder: 'border-rose-200',
            iconText: 'text-rose-600',
            barBg: 'bg-rose-500',
            text: 'text-rose-700',
            buttonHover: 'hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50'
        }
    }[status];

    // 计算进度条比例 
    const getProgress = () => {
        if (status === 'overdue') return 100;
        if (!item.interval_km || mileage.remaining === null) return 0;
        const ratio = (item.interval_km - mileage.remaining) / item.interval_km;
        return Math.min(Math.max(ratio * 100, 5), 100);
    };

    return (
        <div className={`group relative flex flex-col p-5 rounded-[1.25rem] border ${styles.bg} ${styles.border} transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5`}>
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-[14px] ${styles.iconBg} ${styles.iconText} ${styles.iconBorder} border shadow-sm transition-transform duration-300 group-hover:scale-105`}>
                        <StatusIcon className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h4 className={`font-bold font-display tracking-tight text-[15px] ${status === 'normal' ? 'text-slate-800' : styles.text}`}>{item.item_name}</h4>
                        <div className="text-[11px] font-bold tracking-wider uppercase text-slate-400 mt-1 flex items-center gap-1.5">
                            CYCLE
                            <span className="text-slate-500 capitalize ml-1">
                                {item.interval_km ? `${item.interval_km.toLocaleString()}km` : ''}
                                {item.interval_km && item.interval_months ? ' / ' : ''}
                                {item.interval_months ? `${item.interval_months} mo` : ''}
                                {!item.interval_km && !item.interval_months && '未设置'}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Link
                        to={`/vehicle/${vehicle.id}/edit-rule/${item.id}`}
                        state={{ item }}
                        className={`flex items-center justify-center p-2 rounded-xl bg-white shadow-sm border border-slate-100 text-slate-400 transition-all active:scale-90 ${styles.buttonHover}`}
                        title="设置/修改周期"
                    >
                        <Settings className="w-4 h-4" />
                    </Link>
                    <button
                        onClick={() => onRecordLog(item)}
                        className={`flex items-center justify-center p-2 rounded-xl bg-white shadow-sm border border-slate-100 text-slate-400 transition-all active:scale-90 ${styles.buttonHover}`}
                        title="记录此项保养"
                    >
                        <PenTool className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="mt-auto space-y-2">
                <div className="flex justify-between items-end border-b border-slate-100 pb-2.5 mb-2.5">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">上次保养</span>
                        <div className="text-xs font-medium text-slate-700">
                            {item.last_done_mileage?.toLocaleString() || 0} <span className="text-[10px] text-slate-400">km</span>
                            {item.last_done_date && <span className="text-slate-400 mx-1.5">|</span>}
                            {item.last_done_date && <span className="text-slate-500">{new Date(item.last_done_date).toLocaleDateString()}</span>}
                        </div>
                    </div>
                </div>

                <div className="flex justify-between text-xs font-bold uppercase tracking-wider items-center mb-1.5">
                    <span className="text-slate-400">
                        {status === 'overdue' ? '已过期' : '健康剩余'}
                    </span>
                    <span className={`text-[13px] font-display ${styles.text}`}>
                        {mileage.remaining !== null ? `${mileage.remaining.toLocaleString()} km ` : ''}
                        {date.remaining !== null && mileage.remaining !== null ? `或 ` : ''}
                        {date.remaining !== null ? `${date.remaining} 天` : ''}
                    </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                        className={`h-full rounded-full ${styles.barBg} transition-all duration-1000 ease-out`}
                        style={{ width: `${getProgress()}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
