import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { vehicleService } from '../services/vehicleService'
import VehicleCard from '../components/VehicleCard'
import { Link } from 'react-router-dom'

export default function Dashboard() {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true) // Loading user
    const [vehicles, setVehicles] = useState([])
    const [loadingVehicles, setLoadingVehicles] = useState(true)

    useEffect(() => {
        async function loadData() {
            // Load User
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            setLoading(false)

            // Load Vehicles
            if (user) {
                try {
                    const data = await vehicleService.getVehicles()
                    setVehicles(data)
                } catch (error) {
                    console.error("Error loading vehicles:", error)
                } finally {
                    setLoadingVehicles(false)
                }
            } else {
                setLoadingVehicles(false)
            }
        }
        loadData()
    }, [])

    if (loading) {
        return <div className="text-gray-500 text-sm">Loading dashboard...</div>
    }

    return (
        <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">概览</h2>
                <p className="text-gray-500 mt-1 text-sm">
                    欢迎回来, <span className="text-gray-900 font-medium">{user?.email}</span>
                </p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
                <Link to="/add-vehicle" className="flex flex-col items-center justify-center p-4 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition shadow-sm border border-blue-100">
                    <span className="font-semibold">+ 添加车辆</span>
                </Link>
                <button className="flex flex-col items-center justify-center p-4 bg-indigo-50 text-indigo-700 rounded-xl hover:bg-indigo-100 transition shadow-sm border border-indigo-100">
                    <span className="font-semibold">扫码记录</span>
                </button>
            </div>

            {/* Vehicle List */}
            <div>
                <h3 className="text-md font-medium text-gray-900 mb-3 ml-1">我的车辆</h3>
                {loadingVehicles ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-400">加载中...</div>
                ) : vehicles.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
                        <p className="text-gray-400 text-sm">暂无车辆数据</p>
                        <Link to="/add-vehicle" className="text-blue-600 font-medium hover:underline mt-2 inline-block">
                            立即添加第一辆车
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {vehicles.map((vehicle) => (
                            <VehicleCard key={vehicle.id} vehicle={vehicle} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
