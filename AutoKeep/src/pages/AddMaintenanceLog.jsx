import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { maintenanceService } from '../services/maintenanceService'
import { MAINTENANCE_PRESETS } from '../data/maintenancePresets'
import { ArrowLeft, Edit3, PenTool, CheckCircle2, Wrench, Settings, DollarSign } from 'lucide-react'

export default function AddMaintenanceLog() {
    const { id } = useParams()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    // 从 URL 参数获取预填信息
    const prefillItemId = searchParams.get('itemId')
    const prefillItemName = searchParams.get('itemName')
    const isPrefilled = Boolean(prefillItemName)

    const [isCustom, setIsCustom] = useState(!isPrefilled)

    const [formData, setFormData] = useState({
        item_name: prefillItemName || '',
        log_type: 'maintenance', // maintenance or repair
        mileage: '',
        cost: '',
        notes: '',
        done_at: new Date().toISOString().split('T')[0], // 今天
        // repair extra fields
        parts_brand: '',
        parts_cost: '',
        labor_cost: ''
    })

    useEffect(() => {
        if (!isPrefilled) {
            const first = MAINTENANCE_PRESETS[0]
            if (first) {
                setFormData(prev => ({ ...prev, item_name: first.name }))
                setIsCustom(false)
            }
        }
    }, [isPrefilled])

    const handleSelectChange = (e) => {
        const val = e.target.value
        if (val === 'custom') {
            setIsCustom(true)
            setFormData(prev => ({ ...prev, item_name: '' }))
        } else {
            setIsCustom(false)
            setFormData(prev => ({ ...prev, item_name: val }))
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
            let finalCost = formData.cost ? parseFloat(formData.cost) : 0;
            let finalNotes = formData.notes;

            // 处理维修特有的字段，使用 JSON 序列化存入 notes
            if (formData.log_type === 'repair') {
                const partsCost = formData.parts_cost ? parseFloat(formData.parts_cost) : 0;
                const laborCost = formData.labor_cost ? parseFloat(formData.labor_cost) : 0;
                finalCost = partsCost + laborCost;

                const extendData = {
                    parts_brand: formData.parts_brand || '',
                    parts_cost: partsCost,
                    labor_cost: laborCost,
                    notes: formData.notes || ''
                };
                finalNotes = JSON.stringify(extendData);
            }
            await maintenanceService.addLog({
                vehicle_id: id,
                item_name: formData.item_name,
                log_type: formData.log_type,
                mileage: parseInt(formData.mileage),
                cost: finalCost,
                notes: finalNotes,
                done_at: formData.done_at
            }, prefillItemId)

            navigate(`/vehicle/${id}`)
        } catch (error) {
            console.error('Failed to add log:', error)
            alert('添加记录失败，请重试')
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
                    <Edit3 size={12} className="text-brand-500" strokeWidth={3} />
                    New Log
                </div>
                <h1 className="text-3xl font-bold font-display text-slate-800 tracking-tight flex items-center gap-2">
                    记一笔新的维保
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 space-y-6">

                {/* 类型选择 */}
                <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-700 ml-1">记录类型</label>
                    <div className="flex gap-4">
                        <label className={`flex-1 py-3 text-center rounded-2xl border-2 cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2 font-bold ${formData.log_type === 'maintenance' ? 'bg-emerald-50 border-emerald-400 text-emerald-700 shadow-sm shadow-emerald-500/10' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'}`}>
                            <input
                                type="radio"
                                name="log_type"
                                value="maintenance"
                                checked={formData.log_type === 'maintenance'}
                                onChange={handleChange}
                                className="hidden"
                            />
                            {formData.log_type === 'maintenance' && <CheckCircle2 size={16} strokeWidth={2.5} />}
                            常规保养
                        </label>
                        <label className={`flex-1 py-3 text-center rounded-2xl border-2 cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-2 font-bold ${formData.log_type === 'repair' ? 'bg-amber-50 border-amber-400 text-amber-700 shadow-sm shadow-amber-500/10' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'}`}>
                            <input
                                type="radio"
                                name="log_type"
                                value="repair"
                                checked={formData.log_type === 'repair'}
                                onChange={handleChange}
                                className="hidden"
                            />
                            {formData.log_type === 'repair' && <CheckCircle2 size={16} strokeWidth={2.5} />}
                            更换修复
                        </label>
                    </div>
                </div>

                {/* 项目名称 */}
                <div className="space-y-1.5 pt-2">
                    <label className="block text-sm font-bold text-slate-700 ml-1">项目名称 <span className="text-rose-500">*</span></label>
                    {isPrefilled ? (
                        <div className="relative">
                            <input
                                type="text"
                                value={formData.item_name}
                                disabled
                                className="input-soft opacity-60 cursor-not-allowed bg-slate-100 font-bold"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-500 bg-brand-50 text-[10px] font-bold px-2 py-0.5 rounded-full border border-brand-100 flex items-center gap-1 tracking-widest uppercase">
                                <CheckCircle2 size={10} strokeWidth={3} />
                                Linked
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <select
                                value={isCustom ? 'custom' : formData.item_name}
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
                                    name="item_name"
                                    required
                                    placeholder="输入自定义项目名称"
                                    value={formData.item_name}
                                    onChange={handleChange}
                                    className="input-soft"
                                />
                            )}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 gap-6 pb-2">
                    {/* 里程 */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-700 ml-1">里程 <span className="text-xs text-slate-400 font-medium">(km)</span> <span className="text-rose-500">*</span></label>
                        <input
                            type="number"
                            name="mileage"
                            required
                            placeholder="表显里程"
                            value={formData.mileage}
                            onChange={handleChange}
                            className="input-soft"
                        />
                    </div>

                    {/* 日期 */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-700 ml-1">日期 <span className="text-rose-500">*</span></label>
                        <input
                            type="date"
                            name="done_at"
                            required
                            value={formData.done_at}
                            onChange={handleChange}
                            className="input-soft"
                        />
                    </div>
                </div>

                {formData.log_type === 'maintenance' ? (
                    <>
                        {/* 费用 (保养) */}
                        <div className="space-y-1.5 pb-2 animate-fade-in">
                            <label className="block text-sm font-bold text-slate-700 ml-1">费用 <span className="text-xs text-slate-400 font-medium">(元)</span></label>
                            <input
                                type="number"
                                name="cost"
                                placeholder="选填"
                                value={formData.cost}
                                onChange={handleChange}
                                className="input-soft"
                            />
                        </div>

                        {/* 备注 (保养) */}
                        <div className="space-y-1.5 pb-2 animate-fade-in">
                            <label className="block text-sm font-bold text-slate-700 ml-1">备注信息</label>
                            <textarea
                                name="notes"
                                rows="3"
                                placeholder="选填（例如：使用全合成机油，4S店保养）"
                                value={formData.notes}
                                onChange={handleChange}
                                className="input-soft resize-none"
                            ></textarea>
                        </div>
                    </>
                ) : (
                    <div className="space-y-6 pt-2 border-t border-slate-100 animate-fade-in">
                        <div className="flex items-center gap-2 mb-2">
                            <Wrench size={16} className="text-amber-500" />
                            <h3 className="font-bold text-slate-700">维修详情明细</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            {/* 配件品牌 */}
                            <div className="space-y-1.5 col-span-2">
                                <label className="block text-sm font-bold text-slate-700 ml-1">配件品牌</label>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                        <Settings size={16} strokeWidth={2.5} />
                                    </div>
                                    <input
                                        type="text"
                                        name="parts_brand"
                                        placeholder="如：博世 BOSCH、原厂配"
                                        value={formData.parts_brand}
                                        onChange={handleChange}
                                        className="input-soft pl-10"
                                    />
                                </div>
                            </div>

                            {/* 配件费 */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-bold text-slate-700 ml-1">配件费 <span className="text-xs text-slate-400 font-medium">(元)</span></label>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                        <DollarSign size={16} strokeWidth={2.5} />
                                    </div>
                                    <input
                                        type="number"
                                        name="parts_cost"
                                        placeholder="输入金额"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={formData.parts_cost}
                                        onChange={handleChange}
                                        className="input-soft pl-10 bg-amber-50/30 focus:bg-white focus:border-amber-300"
                                    />
                                </div>
                            </div>

                            {/* 工时费 */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-bold text-slate-700 ml-1">工时费 <span className="text-xs text-slate-400 font-medium">(元)</span></label>
                                <div className="relative">
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                        <DollarSign size={16} strokeWidth={2.5} />
                                    </div>
                                    <input
                                        type="number"
                                        name="labor_cost"
                                        placeholder="输入金额"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={formData.labor_cost}
                                        onChange={handleChange}
                                        className="input-soft pl-10 bg-amber-50/30 focus:bg-white focus:border-amber-300"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 维修总计预览 */}
                        <div className="bg-amber-50 rounded-2xl p-4 flex items-center justify-between border border-amber-100/50">
                            <span className="text-sm font-bold text-amber-800">维修总计 (自动计算)</span>
                            <span className="text-xl font-display font-bold text-amber-600">
                                ¥ {((parseFloat(formData.parts_cost) || 0) + (parseFloat(formData.labor_cost) || 0)).toFixed(2)}
                            </span>
                        </div>

                        {/* 备注 (维修) */}
                        <div className="space-y-1.5 pb-2">
                            <label className="block text-sm font-bold text-slate-700 ml-1">维修详情与备注</label>
                            <textarea
                                name="notes"
                                rows="3"
                                placeholder="选填（例如：更换右前轮减震器，四轮定位）"
                                value={formData.notes}
                                onChange={handleChange}
                                className="input-soft resize-none"
                            ></textarea>
                        </div>
                    </div>
                )}

                <div className="pt-4 grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-6 py-3.5 text-slate-600 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all font-bold tracking-wide active:scale-95"
                    >
                        取消
                    </button>
                    <button
                        type="submit"
                        disabled={loading || !formData.item_name}
                        className="btn-primary disabled:opacity-50 disabled:shadow-none w-full flex items-center justify-center gap-2"
                    >
                        {loading ? '保存中...' : <><PenTool size={18} strokeWidth={2.5} /> 确认记录</>}
                    </button>
                </div>

            </form>
        </div>
    )
}
