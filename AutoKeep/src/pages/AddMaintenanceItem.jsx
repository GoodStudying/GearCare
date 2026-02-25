import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { maintenanceService } from '../services/maintenanceService'
import { MAINTENANCE_PRESETS } from '../data/maintenancePresets'
import { ArrowLeft, Settings2 } from 'lucide-react'

export default function AddMaintenanceItem() {
    const { id, itemId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const isEditMode = Boolean(itemId)

    const [loading, setLoading] = useState(false)
    const [isCustom, setIsCustom] = useState(false)

    const [formData, setFormData] = useState({
        name: '',
        interval_km: 5000,
        interval_months: 6
    })

    useEffect(() => {
        if (isEditMode && location.state?.item) {
            const { item_name, interval_km, interval_months } = location.state.item
            setFormData({
                name: item_name || '',
                interval_km: interval_km || '',
                interval_months: interval_months || ''
            })
            // If the name is not in presets, set custom to true
            if (!MAINTENANCE_PRESETS.some(p => p.name === item_name)) {
                setIsCustom(true)
            }
        } else if (!isEditMode) {
            // Default select the first preset
            const first = MAINTENANCE_PRESETS[0]
            if (first) {
                setFormData(prev => ({ ...prev, name: first.name, interval_km: first.interval_km, interval_months: first.interval_months }))
            }
        }
    }, [isEditMode, location.state])

    const handleSelectChange = (e) => {
        const val = e.target.value
        if (val === 'custom') {
            setIsCustom(true)
            setFormData(prev => ({ ...prev, name: '' }))
        } else {
            setIsCustom(false)
            const preset = MAINTENANCE_PRESETS.find(p => p.name === val)
            if (preset) {
                setFormData(prev => ({
                    ...prev,
                    name: preset.name,
                    interval_km: preset.interval_km || '',
                    interval_months: preset.interval_months || ''
                }))
            }
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
        setLoading(true)
        try {
            const payload = {
                name: formData.name,
                interval_km: formData.interval_km ? parseInt(formData.interval_km) : null,
                interval_months: formData.interval_months ? parseInt(formData.interval_months) : null,
            }
            if (isEditMode) {
                await maintenanceService.updateItem(itemId, payload)
            } else {
                await maintenanceService.addItem({ ...payload, vehicle_id: id })
            }
            navigate(`/vehicle/${id}`)
        } catch (error) {
            console.error('Failed to save rule:', error)
            alert('保存规则失败，请重试')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-xl mx-auto animate-fade-in pb-12">
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
                    <Settings2 size={12} className="text-brand-500" strokeWidth={3} />
                    {isEditMode ? 'Edit Rule' : 'New Rule'}
                </div>
                <h1 className="text-3xl font-bold font-display text-slate-800 tracking-tight">
                    {isEditMode ? '修改规则' : '配置规则'}
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 space-y-6">

                {/* 项目名称 */}
                <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-slate-700 ml-1">保养项目 <span className="text-rose-500">*</span></label>
                    {isEditMode ? (
                        // 编辑模式下不允许修改名称，只允许修改周期
                        <input
                            type="text"
                            value={formData.name}
                            disabled
                            className="input-soft opacity-60 cursor-not-allowed bg-slate-100"
                        />
                    ) : (
                        <div className="space-y-3">
                            <select
                                value={isCustom ? 'custom' : formData.name}
                                onChange={handleSelectChange}
                                className="input-soft appearance-none cursor-pointer"
                            >
                                {MAINTENANCE_PRESETS.map(preset => (
                                    <option key={preset.name} value={preset.name}>{preset.name}</option>
                                ))}
                                <option value="custom">-- 自定义项目 --</option>
                            </select>

                            {isCustom && (
                                <input
                                    type="text"
                                    name="name"
                                    required
                                    placeholder="输入自定义保养项目名称"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="input-soft"
                                />
                            )}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-6">
                    {/* 公里间隔 */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-700 ml-1">公里周期 <span className="text-xs text-slate-400 font-medium">(km)</span></label>
                        <input
                            type="number"
                            name="interval_km"
                            placeholder="例如：5000"
                            value={formData.interval_km}
                            onChange={handleChange}
                            className="input-soft"
                        />
                        <p className="text-[11px] font-bold text-slate-400 mt-1.5 ml-1 tracking-wider">每行驶多少公里</p>
                    </div>

                    {/* 时间间隔 */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-700 ml-1">时间周期 <span className="text-xs text-slate-400 font-medium">(月)</span></label>
                        <input
                            type="number"
                            name="interval_months"
                            placeholder="例如：6"
                            value={formData.interval_months}
                            onChange={handleChange}
                            className="input-soft"
                        />
                        <p className="text-[11px] font-bold text-slate-400 mt-1.5 ml-1 tracking-wider">每隔几个月</p>
                    </div>
                </div>

                <div className="pt-6 grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-6 py-3.5 text-slate-600 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all font-bold tracking-wide active:scale-95"
                    >
                        取消
                    </button>
                    <button
                        type="submit"
                        disabled={loading || !formData.name}
                        className="btn-primary disabled:opacity-50 disabled:shadow-none w-full"
                    >
                        {loading ? '保存中...' : '保存规则'}
                    </button>
                </div>

            </form>
        </div>
    )
}
