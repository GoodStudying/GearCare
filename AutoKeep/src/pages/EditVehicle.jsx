import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { vehicleService } from '../services/vehicleService'
import { Trash2 } from 'lucide-react'

export default function EditVehicle() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        make: '',
        model: '',
        year: '',
        license_plate: '',
        current_mileage: '',
        daily_avg_km: ''
    })

    useEffect(() => {
        loadVehicle()
    }, [id])

    async function loadVehicle() {
        try {
            const data = await vehicleService.getVehicleById(id)
            setFormData({
                name: data.name,
                make: data.make,
                model: data.model,
                year: data.year || '',
                license_plate: data.license_plate || '',
                current_mileage: data.current_mileage,
                daily_avg_km: data.daily_avg_km || 30
            })
        } catch (error) {
            console.error('Failed to load vehicle:', error)
            alert('加载车辆信息失败')
            navigate(`/vehicle/${id}`)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            await vehicleService.updateVehicle(id, {
                ...formData,
                year: formData.year ? parseInt(formData.year) : null,
                current_mileage: parseInt(formData.current_mileage),
                daily_avg_km: parseInt(formData.daily_avg_km)
            })
            navigate(`/vehicle/${id}`)
        } catch (error) {
            console.error('Failed to update vehicle:', error)
            alert('更新车辆失败，请重试')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!window.confirm('确定要删除这辆车吗？此操作不可恢复，所有相关的维保记录都会被删除！')) {
            return
        }

        try {
            await vehicleService.deleteVehicle(id)
            navigate('/')
        } catch (error) {
            console.error('Failed to delete vehicle:', error)
            alert('删除车辆失败，请重试')
        }
    }

    if (loading) return <div className="p-8 text-center text-gray-400">加载中...</div>

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">车辆设置</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">

                {/* 昵称 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">车辆昵称 *</label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 品牌 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">品牌 *</label>
                        <input
                            type="text"
                            name="make"
                            required
                            value={formData.make}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                    </div>

                    {/* 型号 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">型号 *</label>
                        <input
                            type="text"
                            name="model"
                            required
                            value={formData.model}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* 年份 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">年份</label>
                        <input
                            type="number"
                            name="year"
                            value={formData.year}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                    </div>

                    {/* 车牌 */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">车牌号</label>
                        <input
                            type="text"
                            name="license_plate"
                            value={formData.license_plate}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 当前里程 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">当前里程 (km)</label>
                        <input
                            type="number"
                            name="current_mileage"
                            required
                            value={formData.current_mileage}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                    </div>

                    {/* 日均里程 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">日均行驶 (km)</label>
                        <input
                            type="number"
                            name="daily_avg_km"
                            required
                            value={formData.daily_avg_km}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                    </div>
                </div>

                <div className="pt-4 flex gap-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
                    >
                        取消
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition font-medium shadow-md disabled:opacity-50"
                    >
                        {saving ? '保存中...' : '保存更改'}
                    </button>
                </div>

                <div className="border-t border-gray-100 pt-6 mt-6">
                    <h3 className="text-red-600 font-medium mb-2">危险区域</h3>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="flex items-center text-red-500 hover:text-red-700 transition text-sm"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        删除此车辆
                    </button>
                </div>

            </form>
        </div>
    )
}
