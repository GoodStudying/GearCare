import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { maintenanceService } from '../services/maintenanceService'

export default function AddMaintenanceItem() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        interval_km: 5000,
        interval_months: 6
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await maintenanceService.addItem({
                vehicle_id: id,
                name: formData.name,
                interval_km: formData.interval_km ? parseInt(formData.interval_km) : null,
                interval_months: formData.interval_months ? parseInt(formData.interval_months) : null,
            })
            navigate(`/vehicle/${id}`)
        } catch (error) {
            console.error('Failed to add rule:', error)
            alert('添加规则失败，请重试')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">配置保养规则</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">

                {/* 项目名称 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">保养项目 *</label>
                    <input
                        type="text"
                        name="name"
                        required
                        placeholder="例如：更换机油"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    {/* 公里间隔 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">公里周期 (km)</label>
                        <input
                            type="number"
                            name="interval_km"
                            placeholder="5000"
                            value={formData.interval_km}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                        <p className="text-xs text-gray-400 mt-1">每行驶多少公里保养一次</p>
                    </div>

                    {/* 时间间隔 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">时间周期 (月)</label>
                        <input
                            type="number"
                            name="interval_months"
                            placeholder="6"
                            value={formData.interval_months}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                        <p className="text-xs text-gray-400 mt-1">每隔几个月保养一次</p>
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
                        disabled={loading}
                        className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition font-medium shadow-md disabled:opacity-50"
                    >
                        {loading ? '保存中...' : '保存规则'}
                    </button>
                </div>

            </form>
        </div>
    )
}
