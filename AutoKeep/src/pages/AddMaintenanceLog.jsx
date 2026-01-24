import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { maintenanceService } from '../services/maintenanceService'

export default function AddMaintenanceLog() {
    const { id } = useParams()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    // 从 URL 参数获取预填信息 (如果从"记录保养"按钮跳过来)
    const prefillItemId = searchParams.get('itemId')
    const prefillItemName = searchParams.get('itemName')

    const [formData, setFormData] = useState({
        item_name: prefillItemName || '',
        log_type: 'maintenance', // maintenance or repair
        mileage: '',
        cost: '',
        notes: '',
        done_at: new Date().toISOString().split('T')[0] // 今天
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
            await maintenanceService.addLog({
                vehicle_id: id,
                item_name: formData.item_name,
                log_type: formData.log_type,
                mileage: parseInt(formData.mileage),
                cost: formData.cost ? parseFloat(formData.cost) : 0,
                notes: formData.notes,
                done_at: formData.done_at
            }, prefillItemId) // 传入 ID 以便 Service 更新规则状态

            navigate(`/vehicle/${id}`)
        } catch (error) {
            console.error('Failed to add log:', error)
            alert('添加记录失败，请重试')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">记录维保</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">

                {/* 类型选择 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">类型</label>
                    <div className="flex gap-4">
                        <label className={`flex-1 py-2 text-center rounded-lg border cursor-pointer transition ${formData.log_type === 'maintenance' ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium' : 'bg-white border-gray-200 text-gray-600'}`}>
                            <input
                                type="radio"
                                name="log_type"
                                value="maintenance"
                                checked={formData.log_type === 'maintenance'}
                                onChange={handleChange}
                                className="hidden"
                            />
                            常规保养
                        </label>
                        <label className={`flex-1 py-2 text-center rounded-lg border cursor-pointer transition ${formData.log_type === 'repair' ? 'bg-orange-50 border-orange-200 text-orange-700 font-medium' : 'bg-white border-gray-200 text-gray-600'}`}>
                            <input
                                type="radio"
                                name="log_type"
                                value="repair"
                                checked={formData.log_type === 'repair'}
                                onChange={handleChange}
                                className="hidden"
                            />
                            维修/更换
                        </label>
                    </div>
                </div>

                {/* 项目名称 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">项目名称 *</label>
                    <input
                        type="text"
                        name="item_name"
                        required
                        placeholder="例如：更换机油、补胎"
                        value={formData.item_name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                </div>

                <div className="grid grid-cols-2 gap-6">
                    {/* 里程 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">里程 (km) *</label>
                        <input
                            type="number"
                            name="mileage"
                            required
                            placeholder="里程表读数"
                            value={formData.mileage}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                    </div>

                    {/* 日期 */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">日期 *</label>
                        <input
                            type="date"
                            name="done_at"
                            required
                            value={formData.done_at}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                    </div>
                </div>

                {/* 费用 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">费用 (元)</label>
                    <input
                        type="number"
                        name="cost"
                        placeholder="0.00"
                        value={formData.cost}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                </div>

                {/* 备注 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">备注</label>
                    <textarea
                        name="notes"
                        rows="3"
                        placeholder="例如：使用全合成机油，4S店保养"
                        value={formData.notes}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    ></textarea>
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
                        {loading ? '保存中...' : '保存记录'}
                    </button>
                </div>

            </form>
        </div>
    )
}
