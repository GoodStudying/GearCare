import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, ScanLine, Sparkles, CarFront } from 'lucide-react'
import VehicleCard from '../components/VehicleCard'
import { vehicleService } from '../services/vehicleService'

export default function Dashboard() {
    const [user, setUser] = useState({ email: 'owner@gearcare.local' })
    const [loading, setLoading] = useState(false)
    const [vehicles, setVehicles] = useState([])
    const [loadingVehicles, setLoadingVehicles] = useState(true)

    useEffect(() => {
        let mounted = true
        async function loadVehicles() {
            setLoadingVehicles(true)
            try {
                const data = await vehicleService.getVehicles()
                if (mounted) {
                    setVehicles(data || [])
                }
            } catch (err) {
                console.error("Failed to load vehicles from DB:", err)
            } finally {
                if (mounted) {
                    setLoadingVehicles(false)
                }
            }
        }
        loadVehicles()

        return () => {
            mounted = false
        }
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-fade-in pb-12 max-w-5xl mx-auto">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2 mt-4">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-bold tracking-widest uppercase mb-3 border border-brand-100">
                        <Sparkles size={12} className="text-brand-500" />
                        My Garage
                    </div>
                    <h2 className="text-3xl font-bold font-display tracking-tight text-slate-800">
                        欢迎回来, {user?.email.split('@')[0]}
                    </h2>
                </div>
            </div>

            {/* Quick Actions (Mobile Optimized Grid) */}
            <div className="grid grid-cols-2 gap-4">
                <Link to="/add-vehicle" className="glass-card flex items-center justify-center p-5 group hover:border-brand-300 hover:shadow-brand-500/10 cursor-pointer active:scale-95 transition-all">
                    <div className="bg-brand-50 p-3 rounded-2xl text-brand-600 mr-3 group-hover:bg-brand-500 group-hover:text-white transition-all shadow-sm">
                        <Plus size={22} strokeWidth={2.5} />
                    </div>
                    <span className="font-bold text-slate-700 tracking-tight text-[15px]">添加爱车</span>
                </Link>
                <button className="glass-card flex items-center justify-center p-5 group hover:border-brand-300 hover:shadow-brand-500/10 cursor-pointer active:scale-95 transition-all">
                    <div className="bg-slate-50 p-3 rounded-2xl text-slate-600 mr-3 group-hover:bg-slate-800 group-hover:text-white transition-all shadow-sm border border-slate-100 group-hover:border-slate-800">
                        <ScanLine size={22} strokeWidth={2.5} />
                    </div>
                    <span className="font-bold text-slate-700 tracking-tight text-[15px]">扫维保单</span>
                </button>
            </div>

            {/* Vehicle List */}
            <div className="pt-4">
                <div className="flex justify-between items-end mb-6 px-1">
                    <h3 className="text-xl font-bold font-display text-slate-800 flex items-center gap-2">
                        车辆列表
                        <span className="text-xs font-bold bg-slate-100 text-slate-500 py-1 px-2.5 rounded-lg border border-slate-200">{vehicles.length}</span>
                    </h3>
                </div>

                {loadingVehicles ? (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((skeleton) => (
                            <div key={skeleton} className="glass-card h-48 animate-pulse bg-slate-50"></div>
                        ))}
                    </div>
                ) : vehicles.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2rem] p-12 text-center flex flex-col items-center justify-center">
                        <div className="w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mb-5 border border-brand-100 shadow-inner">
                            <CarFront className="text-brand-400" size={36} strokeWidth={1.5} />
                        </div>
                        <h4 className="text-xl font-bold font-display text-slate-800 mb-2">你的车库空空如也</h4>
                        <p className="text-slate-500 text-sm mb-8 max-w-xs leading-relaxed">添加你的第一辆爱车，开始智能追踪保养记录与耗材花费。</p>
                        <Link to="/add-vehicle" className="btn-primary">
                            立即添加车辆
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-slide-up">
                        {vehicles.map((vehicle) => (
                            <VehicleCard key={vehicle.id} vehicle={vehicle} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
