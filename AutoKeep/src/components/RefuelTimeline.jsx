import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Droplet, Hash, Calendar, Tag, DollarSign, TrendingUp, Fuel, Plus } from 'lucide-react';
import { maintenanceService } from '../services/maintenanceService';

/**
 * 加油时间轴面板组件
 * 独立展示一辆车的所有加油记录，包含详细时间轴和费用汇总
 *
 * @param {string} vehicleId - 车辆 ID
 * @param {object} fuelStats - 来自 getFuelStats 的油耗统计数据（可选）
 */
export default function RefuelTimeline({ vehicleId, fuelStats }) {
    const [refuelLogs, setRefuelLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function load() {
            try {
                const data = await maintenanceService.getRefuelLogs(vehicleId);
                setRefuelLogs(data || []);
            } catch (e) {
                console.error('Failed to load refuel logs:', e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [vehicleId]);

    // 解析每条记录的扩展数据
    const parsedLogs = useMemo(() => {
        return refuelLogs.map(log => {
            let ext = {};
            try {
                if (log.notes && log.notes.startsWith('{')) {
                    ext = JSON.parse(log.notes);
                }
            } catch (e) { /* 忽略解析失败的旧数据 */ }
            return { ...log, ext };
        });
    }, [refuelLogs]);

    // 汇总数据计算
    const summary = useMemo(() => {
        if (parsedLogs.length === 0) return null;
        let totalCost = 0;
        let totalVolume = 0;
        let totalDiscount = 0;
        let count = 0;

        parsedLogs.forEach(log => {
            totalCost += log.cost || 0;
            totalVolume += log.ext.volume || 0;
            totalDiscount += log.ext.discount || 0;
            count++;
        });

        return {
            count,
            totalCost: totalCost.toFixed(2),
            totalVolume: totalVolume.toFixed(1),
            totalDiscount: totalDiscount.toFixed(2),
            avgPerFill: count > 0 ? (totalCost / count).toFixed(2) : '0'
        };
    }, [parsedLogs]);

    if (loading) {
        return (
            <div className="glass-card p-6 animate-pulse bg-sky-50/30 h-40"></div>
        );
    }

    return (
        <div className="glass-card p-6 md:p-8 relative overflow-hidden">
            {/* 顶部装饰线 */}
            <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-400 to-transparent opacity-20"></div>

            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold font-display text-slate-800 flex items-center">
                    <div className="p-2 bg-sky-50 text-sky-600 rounded-xl mr-3 border border-sky-100">
                        <Droplet className="w-5 h-5" strokeWidth={2.5} />
                    </div>
                    加油账本
                </h2>
                <Link
                    to={`/vehicle/${vehicleId}/add-refuel`}
                    className="flex items-center text-[13px] font-bold bg-sky-50 text-sky-700 border border-sky-100 px-3.5 py-2 rounded-xl hover:bg-sky-500 hover:text-white transition-colors shadow-sm active:scale-95"
                >
                    <Plus className="w-4 h-4 mr-1.5" strokeWidth={3} />
                    加油
                </Link>
            </div>

            {/* 汇总统计卡片 */}
            {summary && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    <div className="bg-sky-50 rounded-xl p-3.5 border border-sky-100 text-center">
                        <div className="text-sky-600/50 text-[10px] font-bold uppercase tracking-widest mb-1">累计花费</div>
                        <div className="text-lg font-display font-bold text-sky-700">¥{summary.totalCost}</div>
                    </div>
                    <div className="bg-sky-50 rounded-xl p-3.5 border border-sky-100 text-center">
                        <div className="text-sky-600/50 text-[10px] font-bold uppercase tracking-widest mb-1">总加油量</div>
                        <div className="text-lg font-display font-bold text-sky-700">{summary.totalVolume}<span className="text-xs ml-0.5">L</span></div>
                    </div>
                    <div className="bg-sky-50 rounded-xl p-3.5 border border-sky-100 text-center">
                        <div className="text-sky-600/50 text-[10px] font-bold uppercase tracking-widest mb-1">平均每次</div>
                        <div className="text-lg font-display font-bold text-sky-700">¥{summary.avgPerFill}</div>
                    </div>
                    <div className="bg-emerald-50 rounded-xl p-3.5 border border-emerald-100 text-center">
                        <div className="text-emerald-600/50 text-[10px] font-bold uppercase tracking-widest mb-1">累计优惠</div>
                        <div className="text-lg font-display font-bold text-emerald-600">¥{summary.totalDiscount}</div>
                    </div>
                </div>
            )}

            {/* 油耗指标（如果有的话） */}
            {fuelStats && (
                <div className="flex gap-4 items-center bg-gradient-to-r from-sky-50 to-brand-50 rounded-xl p-4 border border-sky-100/50 mb-6">
                    <div className="flex-1 flex flex-col items-center">
                        <span className="text-sky-600/50 text-[10px] font-bold uppercase tracking-widest mb-0.5">百公里油耗</span>
                        <span className="text-xl font-display font-bold text-sky-700">{fuelStats.lPer100km}<span className="text-xs ml-0.5 text-sky-500">L/100km</span></span>
                    </div>
                    <div className="w-px h-10 bg-sky-200/50"></div>
                    <div className="flex-1 flex flex-col items-center">
                        <span className="text-sky-600/50 text-[10px] font-bold uppercase tracking-widest mb-0.5">单公里油费</span>
                        <span className="text-xl font-display font-bold text-sky-700">¥{fuelStats.costPerKm}<span className="text-xs ml-0.5 text-sky-500">/km</span></span>
                    </div>
                </div>
            )}

            {/* 时间轴列表 */}
            {parsedLogs.length === 0 ? (
                <div className="text-center py-10 border-2 border-dashed border-sky-200 rounded-2xl bg-sky-50/50">
                    <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-sky-100">
                        <Droplet className="w-7 h-7 text-sky-300" strokeWidth={1.5} />
                    </div>
                    <p className="text-slate-500 font-medium mb-4">还没有加油记录</p>
                    <Link
                        to={`/vehicle/${vehicleId}/add-refuel`}
                        className="btn-primary inline-flex gap-2 text-sm"
                    >
                        <Plus size={16} strokeWidth={2.5} /> 记录第一次加油
                    </Link>
                </div>
            ) : (
                <div className="relative">
                    {/* 背景时间线 */}
                    <div className="absolute left-[19px] top-4 bottom-4 w-px bg-sky-200/60 pointer-events-none"></div>

                    <div className="space-y-3">
                        {parsedLogs.map((log, idx) => (
                            <div key={log.id} className="relative flex gap-4 pl-1 group">
                                {/* 时间线节点 */}
                                <div className="relative z-10 flex-shrink-0 mt-3">
                                    <div className={`w-[10px] h-[10px] rounded-full border-2 ${log.ext.is_full
                                        ? 'bg-sky-500 border-sky-400 shadow-sm shadow-sky-400/30'
                                        : 'bg-white border-sky-300'
                                        }`}></div>
                                </div>

                                {/* 内容卡片 */}
                                <div className="flex-1 bg-white border border-slate-100 rounded-xl p-4 mb-1 hover:shadow-md hover:border-sky-100 transition-all duration-200">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-base font-bold font-display text-slate-800">
                                                ¥{log.cost}
                                            </span>
                                            {log.ext.discount > 0 && (
                                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100 flex items-center gap-0.5">
                                                    <Tag size={9} /> 省{log.ext.discount}
                                                </span>
                                            )}
                                            {log.ext.is_full && (
                                                <span className="text-[10px] font-bold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded-md border border-sky-100">
                                                    满
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center text-[11px] font-bold text-slate-400 gap-1">
                                            <Calendar size={11} />
                                            {log.date && !isNaN(new Date(log.date).getTime())
                                                ? new Date(log.date).toLocaleDateString()
                                                : '未知'}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-bold text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <Droplet size={11} className="text-sky-400" />
                                            {log.ext.volume || 0} L
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Hash size={11} className="text-slate-400" />
                                            ¥{log.ext.unit_price || 0}/L
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <TrendingUp size={11} className="text-slate-400" />
                                            {log.mileage?.toLocaleString() || 0} km
                                        </span>
                                    </div>

                                    {log.ext.notes && (
                                        <p className="text-xs text-slate-400 mt-2 truncate">{log.ext.notes}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
