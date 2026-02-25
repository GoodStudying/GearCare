import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { vehicleService } from '../services/vehicleService'
import { maintenanceService } from '../services/maintenanceService'
import { ArrowLeft, Settings2, ShieldCheck, Activity, Plus, Car, Droplet, Wrench } from 'lucide-react'
import MaintenanceItem from '../components/MaintenanceItem'
import CarBrandLogo from '../components/CarBrandLogo'
import LogItem from '../components/LogItem'
import RefuelTimeline from '../components/RefuelTimeline'

export default function VehicleDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [vehicle, setVehicle] = useState(null)
    const [items, setItems] = useState([])
    const [logs, setLogs] = useState([])
    const [fuelStats, setFuelStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadData()
    }, [id])

    async function loadData() {
        try {
            const [vehicleData, itemsData, logsData, statsData] = await Promise.all([
                vehicleService.getVehicleById(id),
                maintenanceService.getItems(id),
                maintenanceService.getLogs(id),
                maintenanceService.getFuelStats(id)
            ])
            setVehicle(vehicleData)
            setItems(itemsData)
            setLogs(logsData)
            setFuelStats(statsData)
        } catch (error) {
            console.error('Failed to load vehicle data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleRecordLog = (item) => {
        navigate(`/vehicle/${id}/add-log?itemId=${item.id}&itemName=${encodeURIComponent(item.item_name)}`)
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
        <div className="space-y-6 animate-fade-in pb-12 max-w-5xl mx-auto">
            {/* Header / Navigation */}
            <div className="flex items-center justify-between mt-2">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-slate-500 hover:text-slate-900 font-bold transition-colors group tracking-tight"
                >
                    <div className="bg-white p-2.5 rounded-[14px] border border-slate-100 shadow-sm mr-3 group-hover:border-slate-300 transition-colors group-active:scale-95">
                        <ArrowLeft size={18} strokeWidth={2.5} />
                    </div>
                </button>
                <div className="flex bg-white items-center px-4 py-2 rounded-[14px] border border-slate-100 shadow-sm">
                    <Car size={16} strokeWidth={2.5} className="text-brand-500 mr-2" />
                    <span className="font-bold text-slate-800 tracking-tight">{vehicle.license_plate || vehicle.name || '车辆详情'}</span>
                </div>
                <Link to={`/vehicle/${id}/edit`} className="bg-white p-2.5 text-slate-400 hover:text-brand-600 rounded-[14px] border border-slate-100 shadow-sm hover:border-brand-200 hover:bg-brand-50 transition-all active:scale-95">
                    <Settings2 size={18} strokeWidth={2.5} />
                </Link>
            </div>

            {/* Layout Splitter */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Left Area: Hero Card & Stats */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Hero Card - Bright and fresh */}
                    <div className="relative overflow-hidden rounded-[2rem] p-8 text-slate-800 bg-white border border-brand-100 shadow-xl shadow-brand-500/10 transition-all">
                        {/* 装饰光圈 */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-100 to-transparent opacity-80 rounded-full blur-3xl pointer-events-none transform translate-x-1/3 -translate-y-1/3"></div>
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-sky-100 to-transparent opacity-80 rounded-full blur-2xl pointer-events-none transform -translate-x-1/2 translate-y-1/2"></div>

                        <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                            <div className="flex items-center gap-4 mb-1">
                                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center overflow-hidden flex-shrink-0">
                                    <CarBrandLogo make={vehicle.make} size={40} />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-display font-bold tracking-tight text-slate-800">{vehicle.name || `${vehicle.make} ${vehicle.model}`}</h1>
                                    <p className="text-slate-500 font-medium text-sm">{vehicle.make} {vehicle.model} <span className="text-slate-400 ml-1 bg-slate-100 px-2 py-0.5 rounded-lg text-xs">{vehicle.year}</span></p>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-brand-50">
                                <p className="text-brand-600 text-[11px] font-bold uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                                    <Activity size={14} strokeWidth={2.5} /> Odometer 当前里程
                                </p>
                                <div className="text-4xl font-display font-bold tracking-tight text-slate-800 flex items-baseline gap-1.5">
                                    {vehicle.current_mileage.toLocaleString()}
                                    <span className="text-base font-bold text-slate-400 tracking-normal inline">km</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="glass-card p-5 border border-slate-100 flex flex-col gap-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-brand-50/50 rounded-2xl p-4 border border-brand-50 flex flex-col items-center justify-center text-center">
                                <span className="text-brand-600/60 text-[10px] font-bold uppercase tracking-widest mb-2">活跃监控项</span>
                                <span className="text-3xl font-display font-bold text-brand-600">{items.length}</span>
                            </div>
                            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col items-center justify-center text-center">
                                <span className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-2">日均行驶</span>
                                <div className="text-3xl font-display font-bold text-slate-700 flex items-baseline gap-1">
                                    {vehicle.daily_avg_km}
                                    <span className="text-sm font-bold text-slate-400 tracking-normal">km</span>
                                </div>
                            </div>
                        </div>

                        {/* 额外：加油统计面板 */}
                        <div className="bg-sky-50 rounded-2xl p-5 border border-sky-100 flex flex-col gap-3">
                            <div className="flex items-center gap-2 mb-1">
                                <div className="p-1.5 bg-sky-100 text-sky-600 rounded-lg">
                                    <Droplet size={14} strokeWidth={2.5} />
                                </div>
                                <span className="text-sm font-bold text-sky-900 tracking-tight">油耗与花费统计</span>
                            </div>
                            <div className="flex gap-4 items-end">
                                <div className="flex-1">
                                    <span className="text-sky-600/60 text-[10px] font-bold uppercase tracking-widest block mb-1">单公里油费</span>
                                    <div className="text-2xl font-display font-bold text-sky-700 flex items-baseline gap-1">
                                        {fuelStats ? `¥ ${fuelStats.costPerKm}` : '--'}
                                        {fuelStats && <span className="text-xs font-bold text-sky-500 tracking-normal">/ km</span>}
                                    </div>
                                </div>
                                <div className="w-px h-8 bg-sky-200/50"></div>
                                <div className="flex-1 text-right">
                                    <span className="text-sky-600/60 text-[10px] font-bold uppercase tracking-widest block mb-1">百公里油耗</span>
                                    <div className="text-2xl font-display font-bold text-sky-700 flex items-baseline gap-1 justify-end">
                                        {fuelStats ? fuelStats.lPer100km : '--'}
                                        {fuelStats && <span className="text-xs font-bold text-sky-500 tracking-normal min-w-4 text-left">L</span>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Area: Alerts & Logs */}
                <div className="lg:col-span-8 flex flex-col gap-6">

                    {/* Alert Panel */}
                    <div className="glass-card p-6 md:p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-400 to-transparent opacity-20"></div>

                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold font-display text-slate-800 flex items-center">
                                <div className="p-2 bg-brand-50 text-brand-600 rounded-xl mr-3 border border-brand-100">
                                    <ShieldCheck className="w-5 h-5" strokeWidth={2.5} />
                                </div>
                                预警雷达
                            </h2>
                        </div>

                        {items.length === 0 ? (
                            <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50">
                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100">
                                    <ShieldCheck className="w-8 h-8 text-slate-300" strokeWidth={2} />
                                </div>
                                <p className="text-slate-500 mb-6 font-medium">还没有为这辆车建立保养监控体系</p>
                                <Link to={`/vehicle/${id}/add-rule`} className="btn-primary inline-flex gap-2">
                                    <Plus size={18} strokeWidth={2.5} /> 添加首个预警规则
                                </Link>
                            </div>
                        ) : (
                            <div className="grid gap-5 sm:grid-cols-2">
                                {items.map(item => (
                                    <MaintenanceItem
                                        key={item.id}
                                        item={item}
                                        vehicle={vehicle}
                                        onRecordLog={handleRecordLog}
                                    />
                                ))}
                                {/* Add new rule block */}
                                <Link to={`/vehicle/${id}/add-rule`} className="border-2 border-dashed border-slate-200 rounded-[1.25rem] flex flex-col items-center justify-center min-h-[140px] text-slate-400 hover:text-brand-600 hover:border-brand-300 hover:bg-brand-50 transition-all font-bold active:scale-95 group">
                                    <div className="p-3 bg-slate-50 rounded-full mb-3 group-hover:bg-white transition-colors group-hover:shadow-sm">
                                        <Plus size={24} strokeWidth={2.5} />
                                    </div>
                                    从预设中添加
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Timeline Panel */}
                    <div className="glass-card p-6 md:p-8 flex-1">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold font-display text-slate-800 flex items-center">
                                进展与流水
                            </h2>
                            <div className="flex gap-2">
                                <Link
                                    to={`/vehicle/${id}/add-refuel`}
                                    className="flex items-center text-[13px] font-bold bg-sky-50 text-sky-700 border border-sky-100 px-3.5 py-2 rounded-xl hover:bg-sky-500 hover:text-white transition-colors shadow-sm active:scale-95"
                                    title="记录加油"
                                >
                                    <Droplet className="w-4 h-4 mr-1.5" strokeWidth={3} />
                                    加油
                                </Link>
                                <Link
                                    to={`/vehicle/${id}/add-log`}
                                    className="flex items-center text-[13px] font-bold bg-brand-50 text-brand-700 border border-brand-100 px-3.5 py-2 rounded-xl hover:bg-brand-600 hover:text-white transition-colors shadow-sm active:scale-95"
                                    title="记录维保"
                                >
                                    <Wrench className="w-4 h-4 mr-1.5" strokeWidth={3} />
                                    维保
                                </Link>
                            </div>
                        </div>

                        {logs.length === 0 ? (
                            <div className="text-center py-12 rounded-[2rem] bg-slate-50 border border-slate-100">
                                <p className="text-slate-400 font-medium">这台车的记录非常完美（空空如也）。</p>
                            </div>
                        ) : (
                            <div className="relative pt-2 pl-4 md:pl-0">
                                {/* bg timeline line for mobile & desktop */}
                                <div className="absolute left-[27px] md:left-[33px] top-6 bottom-6 w-px bg-slate-200 pointer-events-none"></div>
                                <div className="space-y-4 relative z-10">
                                    {logs.map(log => (
                                        <LogItem key={log.id} log={log} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 加油账本面板（独立展示） */}
                    <RefuelTimeline vehicleId={id} fuelStats={fuelStats} />
                </div>

            </div>
        </div>
    )
}
