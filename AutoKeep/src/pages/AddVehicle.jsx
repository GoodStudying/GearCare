import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { vehicleService } from '../services/vehicleService'
import { maintenanceService } from '../services/maintenanceService'
import { PlusCircle, ArrowLeft, Car } from 'lucide-react'
import { MAINTENANCE_PRESETS, DEFAULT_PRESET_NAMES } from '../data/maintenancePresets'
import { CAR_BRANDS } from '../data/carModels'
import CarBrandLogo from '../components/CarBrandLogo'

export default function AddVehicle() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [addPresets, setAddPresets] = useState(true)

    const [formData, setFormData] = useState({
        name: '',
        make: '',
        model: '',
        year: '',
        license_plate: '',
        current_mileage: '',
        daily_avg_km: '30' // 给一个默认值
    })

    const [metaData, setMetaData] = useState({
        vin: '',
        color: '',
        tire_spec: ''
    })

    // Compute available models based on selected make
    const availableModels = useMemo(() => {
        if (!formData.make) return [];
        const brand = CAR_BRANDS.find(b => b.name === formData.make);
        return brand ? brand.models : [];
    }, [formData.make]);

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // If make changes, don't automatically clear model, let user decide or keep custom input
    }

    const handleMetaChange = (e) => {
        const { name, value } = e.target
        const finalValue = name === 'vin' ? value.toUpperCase() : value;
        setMetaData(prev => ({ ...prev, [name]: finalValue }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // 提交基础车辆信息
            const newVehicle = await vehicleService.addVehicle({
                ...formData,
                year: formData.year ? parseInt(formData.year) : null,
                current_mileage: parseInt(formData.current_mileage),
                daily_avg_km: parseInt(formData.daily_avg_km)
            })

            // 提交车辆扩展信息
            if (newVehicle && newVehicle.id) {
                await maintenanceService.saveVehicleMeta(newVehicle.id, metaData).catch(console.error);
            }

            // 添加默认保养预设
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
        <div className="max-w-2xl mx-auto animate-fade-in pb-12">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center text-slate-500 hover:text-slate-900 font-bold transition-colors group tracking-tight mb-6"
            >
                <div className="bg-white p-2.5 rounded-[14px] border border-slate-100 shadow-sm mr-3 group-hover:border-slate-300 transition-colors group-active:scale-95">
                    <ArrowLeft size={18} strokeWidth={2.5} />
                </div>
                返回
            </button>

            <div className="mb-8">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 text-brand-700 rounded-full text-xs font-bold tracking-widest uppercase mb-3 border border-brand-100">
                    <Car size={12} className="text-brand-500 fill-brand-500/20" strokeWidth={3} />
                    New Vehicle
                </div>
                <h1 className="text-3xl font-bold font-display text-slate-800 tracking-tight">添加新车辆</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* 基础信息 */}
                <div className="glass-card p-6 md:p-8 space-y-6">
                    <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">基本档案</h3>
                    {/* 昵称 */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-700 ml-1">车辆昵称 <span className="text-rose-500">*</span></label>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder="例如：家里的大白"
                            value={formData.name}
                            onChange={handleChange}
                            className="input-soft"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 品牌 */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-slate-700 ml-1">品牌 <span className="text-rose-500">*</span></label>
                            <div className="relative">
                                {formData.make && (
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden">
                                        <CarBrandLogo make={formData.make} size={22} />
                                    </div>
                                )}
                                <input
                                    type="text"
                                    name="make"
                                    required
                                    list="car-brands"
                                    placeholder="输入或选择品牌"
                                    value={formData.make}
                                    onChange={handleChange}
                                    className={`input-soft ${formData.make ? 'pl-12' : ''}`}
                                />
                            </div>
                            <datalist id="car-brands">
                                {CAR_BRANDS.map(brand => (
                                    <option key={brand.name} value={brand.name} />
                                ))}
                            </datalist>
                        </div>

                        {/* 型号 */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-slate-700 ml-1">型号 <span className="text-rose-500">*</span></label>
                            <input
                                type="text"
                                name="model"
                                required
                                list="car-models"
                                placeholder="输入或选择型号"
                                value={formData.model}
                                onChange={handleChange}
                                className="input-soft"
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
                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-slate-700 ml-1">年份 <span className="text-xs text-slate-400 font-normal ml-1">(选填)</span></label>
                            <input
                                type="number"
                                name="year"
                                placeholder="如 2023"
                                value={formData.year}
                                onChange={handleChange}
                                className="input-soft"
                            />
                        </div>

                        {/* 车牌 */}
                        <div className="md:col-span-2 space-y-1.5">
                            <label className="block text-sm font-bold text-slate-700 ml-1">车牌号 <span className="text-xs text-slate-400 font-normal ml-1">(选填)</span></label>
                            <input
                                type="text"
                                name="license_plate"
                                placeholder="如 粤A·88888"
                                value={formData.license_plate}
                                onChange={handleChange}
                                className="input-soft uppercase"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 当前里程 */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-slate-700 ml-1">当前里程 <span className="text-xs text-slate-400 font-medium">(km)</span> <span className="text-rose-500">*</span></label>
                            <input
                                type="number"
                                name="current_mileage"
                                required
                                placeholder="表显公里数"
                                value={formData.current_mileage}
                                onChange={handleChange}
                                className="input-soft"
                            />
                        </div>

                        {/* 日均里程 */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-slate-700 ml-1">日均行驶估计 <span className="text-xs text-slate-400 font-medium">(km/天)</span> <span className="text-rose-500">*</span></label>
                            <input
                                type="number"
                                name="daily_avg_km"
                                required
                                placeholder="默认30"
                                value={formData.daily_avg_km}
                                onChange={handleChange}
                                className="input-soft"
                            />
                            <p className="text-[11px] font-bold text-slate-400 mt-1.5 ml-1 tracking-wider">APP通过此数据推算下次保养时间</p>
                        </div>
                    </div>

                    {/* 快捷添加预设 */}
                    <div className="pt-2">
                        <label className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-[1.25rem] cursor-pointer group hover:bg-white hover:border-slate-200 transition-colors">
                            <div className="relative w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all group-hover:after:scale-95">
                                <input
                                    type="checkbox"
                                    checked={addPresets}
                                    onChange={(e) => setAddPresets(e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-full h-full rounded-full transition-colors peer-checked:bg-brand-500"></div>
                            </div>
                            <div>
                                <span className="text-sm font-bold text-slate-800 block mb-0.5">自动创建常用保养项目库</span>
                                <span className="text-xs font-medium text-slate-500">机油、机滤、空滤等默认周期</span>
                            </div>
                        </label>
                    </div>
                </div>

                {/* 扩展详情区块 */}
                <div className="glass-card p-6 md:p-8 space-y-6">
                    <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">扩展档案 <span className="text-xs text-slate-400 font-medium ml-2 font-normal">(选填)</span></h3>
                    <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-700 ml-1">车辆识别代号 (VIN/车架号)</label>
                        <input type="text" name="vin" placeholder="17位代码，见行驶证" value={metaData.vin} onChange={handleMetaChange} maxLength={17} className="input-soft font-mono uppercase tracking-widest text-[15px]" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-slate-700 ml-1">车身颜色</label>
                            <input type="text" name="color" placeholder="如：珍珠白" value={metaData.color} onChange={handleMetaChange} className="input-soft" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-slate-700 ml-1">轮胎规格</label>
                            <input type="text" name="tire_spec" placeholder="如：225/55 R18" value={metaData.tire_spec} onChange={handleMetaChange} className="input-soft" />
                        </div>
                    </div>
                </div>

                <div className="pt-6 grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-6 py-4 text-slate-600 bg-slate-100 rounded-[1.25rem] hover:bg-slate-200 transition-all font-bold tracking-wide active:scale-95"
                    >
                        取消
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary py-4 rounded-[1.25rem] disabled:opacity-50 disabled:shadow-none w-full flex items-center justify-center gap-2"
                    >
                        {loading ? '创建中...' : <><PlusCircle size={18} strokeWidth={2.5} /> 完成添加</>}
                    </button>
                </div>

            </form>
        </div>
    )
}
