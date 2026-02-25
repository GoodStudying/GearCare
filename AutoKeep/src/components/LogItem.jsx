import { Wrench, Banknote, Calendar, Settings, Activity, Droplet, Hash } from 'lucide-react';

export default function LogItem({ log }) {
    const isMaintenance = log.log_type === 'maintenance';
    const isRefuel = log.log_type === 'refuel';
    const isRepair = log.log_type === 'repair';

    // 尝试解析 notes 中的 JSON 数据
    let parsedNotes = null;
    let rawNotesText = log.notes;
    try {
        if (log.notes && log.notes.startsWith('{')) {
            parsedNotes = JSON.parse(log.notes);
            rawNotesText = parsedNotes.notes || '';
        }
    } catch (e) {
        // 如果解析失败，说明是普通字符串
        console.warn('Failed to parse notes JSON:', e);
    }

    return (
        <div className="group flex gap-4 p-5 mb-4 bg-white border border-slate-100 rounded-[1.25rem] shadow-sm hover:shadow-lg hover:shadow-brand-500/5 hover:border-brand-100 transition-all duration-300">
            {/* 时间线连接点与图标 */}
            <div className="flex flex-col items-center">
                <div className={`p-3 rounded-2xl shadow-sm border ${isMaintenance
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white'
                    : isRefuel
                        ? 'bg-sky-50 border-sky-100 text-sky-600 group-hover:bg-sky-500 group-hover:text-white'
                        : 'bg-amber-50 border-amber-100 text-amber-600 group-hover:bg-amber-500 group-hover:text-white'
                    } transition-colors duration-300`}>
                    {isRefuel ? <Droplet size={20} className={isRefuel ? "fill-sky-500/20" : ""} strokeWidth={2.5} /> : <Wrench size={20} strokeWidth={2.5} />}
                </div>
            </div>

            {/* 内容区 */}
            <div className="flex-1 pb-1">
                <div className="flex justify-between items-start mb-2">
                    <h5 className="font-bold font-display text-slate-800 text-[17px] tracking-tight">{log.title}</h5>
                    <div className="flex items-center text-[11px] font-bold tracking-wider uppercase text-slate-400 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                        <Calendar size={12} className="mr-1" strokeWidth={2.5} />
                        {log.date && !isNaN(new Date(log.date).getTime())
                            ? new Date(log.date).toLocaleDateString()
                            : '未知日期'}
                    </div>
                </div>

                <div className="flex flex-wrap gap-3 text-[13px] font-bold text-slate-500 mt-2">
                    <span className="bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl flex items-center">
                        里程 <span className="text-slate-700 ml-1.5 font-display text-sm">{log.mileage?.toLocaleString() || 0} km</span>
                    </span>
                    {log.cost > 0 && (
                        <span className="bg-rose-50 text-rose-600 border border-rose-100 px-3 py-1.5 rounded-xl flex items-center">
                            <Banknote size={14} className="mr-1.5" strokeWidth={2.5} /> ￥{log.cost}
                        </span>
                    )}
                </div>

                {parsedNotes && isRepair && (
                    <div className="mt-4 bg-amber-50/50 border border-amber-100/50 rounded-xl p-3 flex flex-col gap-2">
                        {parsedNotes.parts_brand && (
                            <div className="flex items-center text-xs font-bold text-amber-700">
                                <Settings size={14} className="mr-2 text-amber-500" />
                                配件品牌：<span className="text-amber-900 ml-1 bg-white px-2 py-0.5 rounded-md border border-amber-100 shadow-sm">{parsedNotes.parts_brand}</span>
                            </div>
                        )}
                        <div className="flex gap-4 px-1 pt-1">
                            <div className="flex items-center text-[11px] font-bold text-slate-500 gap-1.5 uppercase tracking-widest">
                                <Banknote size={12} />
                                配件费: <span className="text-amber-700 font-display text-xs">￥{parsedNotes.parts_cost || 0}</span>
                            </div>
                            <div className="flex items-center text-[11px] font-bold text-slate-500 gap-1.5 uppercase tracking-widest">
                                <Activity size={12} />
                                工时费: <span className="text-amber-700 font-display text-xs">￥{parsedNotes.labor_cost || 0}</span>
                            </div>
                        </div>
                    </div>
                )}

                {parsedNotes && isRefuel && (
                    <div className="mt-4 bg-sky-50/50 border border-sky-100/50 rounded-xl p-3 flex flex-col gap-2">
                        <div className="flex flex-wrap gap-3 px-1">
                            <div className="flex items-center text-[11px] font-bold text-slate-500 gap-1.5 uppercase tracking-widest">
                                <Droplet size={12} className="text-sky-500" />
                                加油量: <span className="text-sky-700 font-display text-xs">{parsedNotes.volume || 0} L</span>
                            </div>
                            <div className="flex items-center text-[11px] font-bold text-slate-500 gap-1.5 uppercase tracking-widest">
                                <Hash size={12} className="text-sky-500" />
                                挂牌价: <span className="text-sky-700 font-display text-xs">￥{parsedNotes.unit_price || 0} / L</span>
                            </div>
                            {parsedNotes.is_full && (
                                <div className="flex items-center text-[10px] font-bold text-sky-600 gap-1 bg-sky-100 px-2 py-0.5 rounded-md border border-sky-200">
                                    加满标定
                                </div>
                            )}
                            {parsedNotes.discount > 0 && (
                                <div className="flex items-center text-[10px] font-bold text-emerald-600 gap-1 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                                    优惠 ￥{parsedNotes.discount}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {rawNotesText && (
                    <p className="text-sm text-slate-500 mt-3 leading-relaxed bg-slate-50/50 border border-slate-100 p-4 rounded-xl font-medium">
                        {rawNotesText}
                    </p>
                )}
            </div>
        </div>
    );
}
