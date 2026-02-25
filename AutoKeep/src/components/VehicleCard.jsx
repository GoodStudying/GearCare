import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Droplets } from 'lucide-react';
import CarBrandLogo from './CarBrandLogo';

export default function VehicleCard({ vehicle }) {
    const displayTitle = vehicle.name || `${vehicle.make} ${vehicle.model}`;
    const subTitle = vehicle.name ? `${vehicle.make} ${vehicle.model}` : vehicle.license_plate;

    // 模拟的保养健康度
    const healthScore = Math.floor(Math.random() * 20) + 80;

    return (
        <div className="glass-card p-6 group flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/10 hover:-translate-y-1 hover:border-brand-200 relative overflow-hidden bg-white">
            {/* Soft background glow */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-100 rounded-full blur-[40px] opacity-50 group-hover:opacity-100 group-hover:bg-brand-200 transition-all duration-500"></div>

            <div className="relative z-10 flex justify-between items-start mb-6">
                <div className="flex gap-4 items-center">
                    <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-100 group-hover:bg-brand-50 group-hover:border-brand-100 transition-all duration-300 shadow-sm overflow-hidden">
                        <CarBrandLogo make={vehicle.make} size={28} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold font-display text-slate-800 tracking-tight leading-tight">{displayTitle}</h3>
                        <p className="text-[13px] font-medium text-slate-500 mt-1">{subTitle}</p>
                    </div>
                </div>
            </div>

            <div className="relative z-10 space-y-5">
                {/* 状态指示条 */}
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <div className="flex justify-between text-[11px] mb-2 font-bold uppercase tracking-wider">
                        <span className="text-slate-400 flex items-center gap-1.5"><Droplets size={12} strokeWidth={3} className="text-brand-400" /> 健康指征</span>
                        <span className={healthScore > 85 ? 'text-brand-600' : 'text-amber-600'}>{healthScore}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div className={`h-1.5 rounded-full ${healthScore > 85 ? 'bg-brand-500' : 'bg-amber-500'}`} style={{ width: `${healthScore}%` }}></div>
                    </div>
                </div>

                <div className="flex items-end justify-between pt-2">
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">当前总里程</span>
                        <span className="text-xl font-bold font-display text-slate-800">
                            {vehicle.current_mileage?.toLocaleString() || '0'} <span className="text-xs text-slate-400 font-medium tracking-normal ml-0.5">km</span>
                        </span>
                    </div>
                    <Link
                        to={`/vehicle/${vehicle.id}`}
                        className="flex items-center justify-center bg-slate-50 text-slate-500 hover:bg-brand-600 hover:text-white hover:shadow-md p-2.5 rounded-xl transition-all duration-300 group/btn active:scale-95 border border-slate-100 hover:border-brand-500"
                    >
                        <ChevronRight size={18} strokeWidth={2.5} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
