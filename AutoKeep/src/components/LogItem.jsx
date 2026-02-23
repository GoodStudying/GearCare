import { Wrench, Banknote, Calendar } from 'lucide-react';

export default function LogItem({ log }) {
    const isMaintenance = log.log_type === 'maintenance';

    return (
        <div className="group flex gap-4 p-4 mb-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-brand-100 transition-all">
            {/* 时间线连接点与图标 */}
            <div className="flex flex-col items-center">
                <div className={`p-2.5 rounded-xl shadow-sm border ${isMaintenance
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white'
                        : 'bg-brand-50 border-brand-100 text-brand-600 group-hover:bg-brand-500 group-hover:text-white'
                    } transition-colors duration-300`}>
                    <Wrench size={18} strokeWidth={2.5} />
                </div>
                <div className="w-px h-full bg-slate-100 mt-2 group-last:hidden"></div>
            </div>

            {/* 内容区 */}
            <div className="flex-1 pb-1">
                <div className="flex justify-between items-start mb-1">
                    <h5 className="font-bold text-slate-800 text-base tracking-tight">{log.title}</h5>
                    <div className="flex items-center text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                        <Calendar size={12} className="mr-1" />
                        {new Date(log.done_at).toLocaleDateString()}
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 text-xs font-semibold text-slate-500 mt-2">
                    <span className="bg-slate-100 px-2 py-1.5 rounded-lg flex items-center">
                        里程: <span className="text-slate-700 ml-1 font-display">{log.mileage?.toLocaleString() || 0} km</span>
                    </span>
                    {log.cost && (
                        <span className="bg-rose-50 text-rose-600 px-2 py-1.5 rounded-lg flex items-center">
                            <Banknote size={14} className="mr-1" /> ￥{log.cost}
                        </span>
                    )}
                </div>

                {log.notes && (
                    <p className="text-sm text-slate-500 mt-3 leading-relaxed bg-slate-50 border border-slate-100 p-3 rounded-xl">
                        {log.notes}
                    </p>
                )}
            </div>
        </div>
    );
}
