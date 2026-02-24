import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, QrCode, Sparkles, Car } from 'lucide-react'
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
        <div className="space-y-8 animate-fade-in pb-10">
            {/* 顶层打招呼 */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mt-2">
                <div>
                    <p className="text-slate-500 font-medium mb-1">欢迎来到你的数字车库,</p>
                    <h2 className="text-3xl font-bold font-display tracking-tight text-slate-800">
                        {user?.email.split('@')[0]}
                        <Sparkles className="inline-block ml-2 text-brand-500 mb-1" size={24} />
                    </h2>
                </div>
            </div>

            {/* 快捷操作区 */}
            <div className="grid grid-cols-2 gap-4">
                <Link to="/add-vehicle" className="glass-card flex items-center justify-center p-5 group hover:bg-brand-50 transition-all border-brand-100 hover:border-brand-300 hover:shadow-lg shadow-brand-500/5">
                    <div className="bg-brand-100 p-2 rounded-full text-brand-600 mr-3 group-hover:scale-110 transition-transform">
                        <Plus size={20} strokeWidth={2.5} />
                    </div>
                    <span className="font-semibold text-brand-700 tracking-tight text-sm">增加新车</span>
                </Link>
                <button className="glass-card flex items-center justify-center p-5 group hover:bg-slate-50 transition-all border-slate-200 hover:shadow-lg">
                    <div className="bg-slate-100 p-2 rounded-full text-slate-600 mr-3 group-hover:scale-110 transition-transform">
                        <QrCode size={20} strokeWidth={2.5} />
                    </div>
                    <span className="font-semibold text-slate-700 tracking-tight text-sm">扫描记录单</span>
                </button>
            </div>

            {/* 车辆列表区 */}
            <div className="pt-2">
                <div className="flex justify-between items-end mb-4 px-1">
                    <h3 className="text-xl font-bold font-display text-slate-800">我的车库
                        <span className="ml-2 text-sm font-medium bg-slate-100 text-slate-500 py-0.5 px-2 rounded-full align-middle">{vehicles.length}</span>
                    </h3>
                </div>

                {loadingVehicles ? (
                    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((skeleton) => (
                            <div key={skeleton} className="glass-card h-48 animate-pulse bg-slate-200/50"></div>
                        ))}
                    </div>
                ) : vehicles.length === 0 ? (
                    <div className="glass-card p-12 text-center flex flex-col items-center justify-center border-dashed border-2 border-slate-200">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <Car className="text-slate-300" size={32} />
                        </div>
                        <h4 className="text-lg font-bold text-slate-700 mb-2">你的车库空空如也</h4>
                        <p className="text-slate-500 text-sm mb-6 max-w-xs">添加你的第一辆爱车，开始智能追踪保养记录与花费。</p>
                        <Link to="/add-vehicle" className="btn-primary">
                            立即添加
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 animate-slide-up">
                        {vehicles.map((vehicle) => (
                            <VehicleCard key={vehicle.id} vehicle={vehicle} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
