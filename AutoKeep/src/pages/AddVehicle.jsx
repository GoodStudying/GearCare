import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { vehicleService } from '../services/vehicleService'
import { maintenanceService } from '../services/maintenanceService'
import { CAR_BRANDS } from '../data/carModels'
import { MAINTENANCE_PRESETS, DEFAULT_PRESET_NAMES } from '../data/maintenancePresets'

export default function AddVehicle() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [addPresets, setAddPresets] = useState(true) // Default to true

    const [formData, setFormData] = useState({
        name: '',
        make: '',
        model: '',
        year: new Date().getFullYear(),
        license_plate: '',
        current_mileage: 0
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // Get available models based on selected make
    const availableModels = useMemo(() => {
        const brand = CAR_BRANDS.find(b => b.name === formData.make || b.name.includes(formData.make));
        return brand ? brand.models : [];
    }, [formData.make]);

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        try {
            // 1. Create Vehicle
            const newVehicle = await vehicleService.addVehicle({
                ...formData,
                year: parseInt(formData.year),
                current_mileage: parseInt(formData.current_mileage)
            })

            // 2. Add Default Presets if selected
            if (addPresets && newVehicle && newVehicle.id) {
                const presetsToAdd = MAINTENANCE_PRESETS.filter(p => DEFAULT_PRESET_NAMES.includes(p.name));

                // Add sequentially to ensure order or reduce race conditions
                for (const preset of presetsToAdd) {
                    await maintenanceService.addItem({
                        vehicle_id: newVehicle.id,
                        name: preset.name,
                        interval_km: preset.interval_km,
                        interval_months: preset.interval_months
                    }).catch(console.error); // Ignore individual failures
                }
            }

            navigate('/')
        } catch (error) {
            console.error('Failed to add vehicle:', error)
            alert(`添加车辆失败: ${error.message || '请重试'}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">添加车辆</h1>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">

                {/* 昵称 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">车辆昵称 *</label>
                    <input
                        type="text"
                        name="name"
                        required
                        placeholder="例如：上班代步车"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 品牌 (Datalist for Searchable) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">品牌 *</label>
                        <input
                            type="text"
                            name="make"
                            required
                            list="car-brands"
                            placeholder="输入或选择品牌"
                            value={formData.make}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                        <datalist id="car-brands">
                            {CAR_BRANDS.map(brand => (
                                <option key={brand.name} value={brand.name} />
                            ))}
                        </datalist>
                    </div>

                    {/* 型号 (Datalist dependent on Brand) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">型号 *</label>
                        <input
                            type="text"
                            name="model"
                            required
                            list="car-models"
                            placeholder="输入或选择型号"
                            value={formData.model}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                        <datalist id="car-models">
                            {availableModels.map(model => (
                                <option key={model} value={model} />
                            ))}
                        </datalist>
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
                            placeholder="苏A 88888"
                            value={formData.license_plate}
                            onChange={handleChange}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        />
                    </div>
                </div>

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

                {/* 自动导入规则选项 */}
                <div className="bg-blue-50 p-4 rounded-lg flex items-start">
                    <div className="flex items-center h-5">
                        <input
                            id="presets"
                            type="checkbox"
                            checked={addPresets}
                            onChange={(e) => setAddPresets(e.target.checked)}
                            className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="presets" className="font-medium text-blue-900">自动添加常用保养规则</label>
                        <p className="text-blue-700">将会自动为您创建机油、滤芯、刹车油等5项最常用的保养提醒。</p>
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
                        {loading ? '保存中...' : '保存车辆'}
                    </button>
                </div>

            </form>
        </div>
    )
}
