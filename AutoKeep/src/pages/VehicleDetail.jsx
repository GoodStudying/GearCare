import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { vehicleService } from '../services/vehicleService'
import { maintenanceService } from '../services/maintenanceService'
import { ArrowLeft, Settings, Settings2, ShieldCheck, Activity, Plus } from 'lucide-react'
import MaintenanceItem from '../components/MaintenanceItem'
import LogItem from '../components/LogItem'

export default function VehicleDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [vehicle, setVehicle] = useState(null)
    const [items, setItems] = useState([])
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [id])

    async function loadData() {
        try {
            const [vehicleData, itemsData, logsData] = await Promise.all([
                vehicleService.getVehicleById(id),
                maintenanceService.getItems(id),
                maintenanceService.getLogs(id)
            ])
            setVehicle(vehicleData)
            setItems(itemsData)
            setLogs(logsData)
        } catch (error) {
            console.error('Failed to load vehicle data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleRecordLog = (item) => {
        navigate(`/vehicle/${id}/add-log?itemId=${item.id}&itemName=${encodeURIComponent(item.name)}`)
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
            </div>
        )
    }

    if (!vehicle) return null

    return (
        <div className="space-y-6 animate-fade-in pb-10">
            {/* Header / Navigation */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-slate-500 hover:text-slate-900 font-medium transition-colors group"
                >
                    <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm mr-3 group-hover:border-slate-300 transition-colors">
                        <ArrowLeft size={18} />
                    </div>
                    返回车库
                </button>
                <Link to={`/vehicle/${id}/edit`} className="bg-white p-2 text-slate-400 hover:text-brand-600 rounded-xl border border-slate-200 shadow-sm hover:border-brand-200 hover:bg-brand-50 transition-all">
                    <Settings2 size={18} />
                </Link>
            </div>

            {/* Layout Splitter */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Area: Hero Card & Stats */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Hero Card with Glass & Gradient */}
                    <div className="relative overflow-hidden rounded-[2rem] p-8 text-white shadow-xl shadow-brand-500/20 bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 border border-slate-700">
                        {/* 装饰光圈 */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-500/40 rounded-full blur-3xl pointer-events-none"></div>
                        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-500/30 rounded-full blur-2xl pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                            <div>
                                <div className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-lg text-xs font-semibold tracking-widest border border-white/10 mb-4">
                                    {vehicle.license_plate}
                                </div>
                                <h1 className="text-3xl font-display font-bold tracking-tight mb-2 drop-shadow-sm">{vehicle.name}</h1>
                                <p className="text-slate-300 font-medium">{vehicle.make} {vehicle.model} <span className="text-slate-400">({vehicle.year})</span></p>
                            </div>

                            <div className="mt-6 pt-6 border-t border-white/10">
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                    <Activity size={14} className="text-brand-400" /> Odometer 当前里程
                                </p>
                                <div className="text-4xl font-display font-bold tracking-tight text-white flex items-baseline gap-1">
                                    {vehicle.current_mileage.toLocaleString()}
                                    <span className="text-base font-medium text-brand-300 tracking-normal hidden sm:inline">公里</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="glass-card p-6 border border-slate-200">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center justify-center text-center">
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">监控项</span>
                                <span className="text-2xl font-display font-bold text-brand-600">{items.length}</span>
                            </div>
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center justify-center text-center">
                                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">日均行驶</span>
                                <span className="text-2xl font-display font-bold text-slate-700">{vehicle.daily_avg_km}<span className="text-sm font-medium text-slate-400 ml-1 text-transform-none">km</span></span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Area: Alerts & Logs */}
                <div className="lg:col-span-8 flex flex-col gap-6">

                    {/* Alert Panel */}
                    <div className="glass-card border-brand-100 shadow-brand-500/5 p-6 md:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold font-display text-slate-800 flex items-center">
                                <ShieldCheck className="w-6 h-6 mr-2 text-brand-500" strokeWidth={2.5} />
                                保养预警雷达
                            </h2>
                        </div>

                        {items.length === 0 ? (
                            <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                                <p className="text-slate-500 mb-4 font-medium">还没有为这辆车建立保养档案。</p>
                                <Link to={`/vehicle/${id}/add-rule`} className="btn-primary inline-flex gap-2">
                                    <Plus size={18} /> 添加首个规则
                                </Link>
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2">
                                {items.map(item => (
                                    <MaintenanceItem
                                        key={item.id}
                                        item={item}
                                        vehicle={vehicle}
                                        onRecordLog={handleRecordLog}
                                    />
                                ))}
                                {/* Add new rule block */}
                                <Link to={`/vehicle/${id}/add-rule`} className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center min-h-[120px] text-slate-400 hover:text-brand-600 hover:border-brand-300 hover:bg-brand-50 transition-all font-medium">
                                    <Plus size={24} className="mb-2" />
                                    新增保养项
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Timeline Panel */}
                    <div className="glass-card border-slate-200 shadow-sm p-6 md:p-8 flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold font-display text-slate-800 flex items-center">
                                维修记录流水
                            </h2>
                            <Link
                                to={`/vehicle/${id}/add-log`}
                                className="flex items-center text-sm font-bold bg-slate-100 text-slate-600 px-4 py-2 rounded-xl hover:bg-slate-200 hover:text-slate-900 transition-colors"
                            >
                                <Plus className="w-4 h-4 mr-1" strokeWidth={3} />
                                记一笔
                            </Link>
                        </div>

                        {logs.length === 0 ? (
                            <div className="text-center py-12 rounded-2xl bg-slate-50 border border-slate-100">
                                <p className="text-slate-400 font-medium">这台车的记录非常完美（空空如也）。</p>
                            </div>
                        ) : (
                            <div className="relative pt-2">
                                {/* bg timeline line */}
                                <div className="absolute left-[33px] top-6 bottom-6 w-px bg-slate-100 hidden sm:block pointer-events-none"></div>
                                {logs.map(log => (
                                    <LogItem key={log.id} log={log} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}
