import React from 'react';
import { Link } from 'react-router-dom';
import { Car, ChevronRight, Droplets, Wrench } from 'lucide-react';

export default function VehicleCard({ vehicle }) {
    const displayTitle = vehicle.name || `${vehicle.make} ${vehicle.model}`;
    const subTitle = vehicle.name ? `${vehicle.make} ${vehicle.model}` : vehicle.license_plate;

    // 模拟的保养健康度，随机或固定逻辑
    const healthScore = Math.floor(Math.random() * 20) + 80;

    return (
        <div className="glass-card p-5 group flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-brand-500/30 relative overflow-hidden">
            {/* 渐变点缀背景 */}
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-gradient-to-br from-brand-500/10 to-transparent rounded-full blur-2xl group-hover:from-brand-500/20 transition-all"></div>

            <div className="relative z-10 flex justify-between items-start mb-5">
                <div className="flex gap-3 items-center">
                    <div className="p-2.5 bg-brand-50 rounded-xl text-brand-600 group-hover:bg-brand-500 group-hover:text-white transition-colors duration-300 shadow-sm border border-brand-100">
                        <Car size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 tracking-tight leading-tight">{displayTitle}</h3>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">{subTitle}</p>
                    </div>
                </div>
                <div className="bg-slate-50 text-slate-600 text-xs px-2.5 py-1 rounded-lg font-semibold border border-slate-200">
                    {vehicle.license_plate || '无牌'}
                </div>
            </div>

            <div className="relative z-10 space-y-4">
                {/* 状态指示条 */}
                <div>
                    <div className="flex justify-between text-xs mb-1.5 font-medium">
                        <span className="text-slate-500 flex items-center gap-1"><Droplets size={12} /> 健康度</span>
                        <span className={healthScore > 85 ? 'text-emerald-500' : 'text-amber-500'}>{healthScore}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div className={`h-1.5 rounded-full ${healthScore > 85 ? 'bg-emerald-400' : 'bg-amber-400'}`} style={{ width: `${healthScore}%` }}></div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100/60">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">当前里程</span>
                        <span className="text-base font-bold text-slate-700 font-display">
                            {vehicle.current_mileage?.toLocaleString() || '0'} <span className="text-xs text-slate-400 font-medium tracking-normal">km</span>
                        </span>
                    </div>
                    <Link
                        to={`/vehicle/${vehicle.id}`}
                        className="flex items-center justify-center bg-brand-50 text-brand-600 hover:bg-brand-500 hover:text-white p-2 rounded-xl transition-colors duration-300 group/btn"
                    >
                        <ChevronRight size={18} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
