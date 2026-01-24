import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { vehicleService } from '../services/vehicleService'
import { maintenanceService } from '../services/maintenanceService'
import { ArrowLeft, Settings, PenTool, History, AlertCircle, Plus } from 'lucide-react'
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
            alert('加载车辆数据失败')
            navigate('/')
        } finally {
            setLoading(false)
        }
    }

    const handleRecordLog = (item) => {
        navigate(`/vehicle/${id}/add-log?itemId=${item.id}&itemName=${encodeURIComponent(item.name)}`)
    }

    if (loading) return <div className="p-8 text-center text-gray-400">加载中...</div>
    if (!vehicle) return null

    return (
        <div className="space-y-6">
            {/* Header / Navigation */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center text-gray-600 hover:text-gray-900 transition"
                >
                    <ArrowLeft className="w-5 h-5 mr-1" />
                    返回车库
                </button>
                <div className="relative group">
                    <Link to={`/vehicle/${id}/edit`} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition inline-block">
                        <Settings className="w-5 h-5" />
                    </Link>
                </div>
            </div>

            {/* Main Content Grid - Responsive Layout */}
            {/* Mobile: Stacked (col-1), Desktop: Split (col-3) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Left Column: Vehicle Overview */}
                <div className="md:col-span-1 space-y-6">
                    {/* Hero Card */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold">{vehicle.name}</h1>
                                <p className="text-blue-100 text-sm mt-1">{vehicle.make} {vehicle.model} ({vehicle.year})</p>
                            </div>
                            <div className="bg-white/10 px-3 py-1 rounded-lg text-xs backdrop-blur-sm border border-white/20">
                                {vehicle.license_plate}
                            </div>
                        </div>

                        <div className="mt-8">
                            <p className="text-blue-100 text-xs uppercase tracking-wider mb-1">当前里程</p>
                            <div className="text-3xl font-mono font-bold tracking-tight">
                                {vehicle.current_mileage.toLocaleString()} <span className="text-sm font-normal text-blue-200">km</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                        <h3 className="text-sm font-medium text-gray-500 mb-4">车辆状态</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-gray-50 rounded-lg text-center">
                                <span className="block text-xs text-gray-400">保养规则</span>
                                <span className="block font-medium text-gray-700 mt-1">{items.length} 项</span>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg text-center">
                                <span className="block text-xs text-gray-400">日均行驶</span>
                                <span className="block font-medium text-gray-700 mt-1">{vehicle.daily_avg_km} km</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Maintenance & Logs */}
                <div className="md:col-span-2 space-y-6">

                    {/* Maintenance Alert Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center">
                                <AlertCircle className="w-5 h-5 mr-2 text-orange-500" />
                                待办事项
                            </h2>
                            {items.length > 0 && (
                                <Link to={`/vehicle/${id}/rules`} className="text-sm text-blue-600 hover:underline">全部规则</Link>
                            )}
                        </div>

                        {items.length === 0 ? (
                            <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                <p className="text-gray-400 text-sm mb-2">暂无待办事项</p>
                                <Link to={`/vehicle/${id}/add-rule`} className="text-sm text-blue-600 font-medium hover:underline">
                                    + 配置保养规则
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {items.map(item => (
                                    <MaintenanceItem
                                        key={item.id}
                                        item={item}
                                        vehicle={vehicle}
                                        onRecordLog={handleRecordLog}
                                    />
                                ))}
                                <div className="pt-2 text-center">
                                    <Link to={`/vehicle/${id}/add-rule`} className="flex items-center justify-center text-sm text-gray-500 hover:text-blue-600 transition">
                                        <Plus className="w-4 h-4 mr-1" /> 添加新规则
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Recent Logs Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-800 flex items-center">
                                <History className="w-5 h-5 mr-2 text-gray-500" />
                                最近记录
                            </h2>
                            <Link
                                to={`/vehicle/${id}/add-log`}
                                className="flex items-center text-sm bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition"
                            >
                                <PenTool className="w-3 h-3 mr-1" />
                                记一笔
                            </Link>
                        </div>

                        {logs.length === 0 ? (
                            <div className="text-center py-10 bg-gray-50 rounded-lg">
                                <p className="text-gray-400 text-sm">暂无维保记录</p>
                            </div>
                        ) : (
                            <div className="space-y-0">
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
