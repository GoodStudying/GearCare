import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { maintenanceService } from '../services/maintenanceService'
import { ArrowLeft, Droplet, DollarSign, PenTool, Hash, Tag } from 'lucide-react'

export default function AddRefuelLog() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        log_type: 'refuel',
        mileage: '',
        cost: '',          // 实付金额（主输入，不被覆盖）
        volume: '',        // 加油量（升）
        unit_price: '',    // 挂牌油价（元/升）
        discount: '',      // 优惠金额（元）
        is_full: true,     // 默认加满
        notes: '',
        done_at: new Date().toISOString().split('T')[0]
    })

    /**
     * 核心联动逻辑：
     * - 金额(cost) 为"锚点"字段，用户填写后不再被自动覆盖
     * - 修改油量(volume) → 自动计算油价 = cost / volume
     * - 修改油价(unit_price) → 自动计算油量 = cost / unit_price
     * - 金额本身改变时，如果已有油量则重算油价
     */
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target

        let newFormData = {
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        }

        const costVal = name === 'cost' ? (parseFloat(value) || 0) : (parseFloat(formData.cost) || 0);
        const volVal = name === 'volume' ? (parseFloat(value) || 0) : (parseFloat(formData.volume) || 0);
        const priceVal = name === 'unit_price' ? (parseFloat(value) || 0) : (parseFloat(formData.unit_price) || 0);

        if (name === 'volume' && costVal > 0 && volVal > 0) {
            // 改了油量 → 用金额反推油价
            newFormData.unit_price = (costVal / volVal).toFixed(2)
        } else if (name === 'unit_price' && costVal > 0 && priceVal > 0) {
            // 改了油价 → 用金额反推油量
            newFormData.volume = (costVal / priceVal).toFixed(2)
        } else if (name === 'cost' && volVal > 0 && costVal > 0) {
            // 改了金额 → 用油量反推油价
            newFormData.unit_price = (costVal / volVal).toFixed(2)
        }

        setFormData(newFormData)
    }

    // 计算实际支付（扣除优惠）
    const actualPay = () => {
        const cost = parseFloat(formData.cost) || 0;
        const discount = parseFloat(formData.discount) || 0;
        return Math.max(cost - discount, 0);
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const costParsed = parseFloat(formData.cost) || 0;
            const discountParsed = parseFloat(formData.discount) || 0;
            const volumeParsed = parseFloat(formData.volume) || 0;
            const priceParsed = parseFloat(formData.unit_price) || 0;
            const finalPay = Math.max(costParsed - discountParsed, 0);

            // 序列化扩展字段存入 notes
            const extendData = {
                unit_price: priceParsed,
                volume: volumeParsed,
                is_full: formData.is_full,
                discount: discountParsed,
                original_cost: costParsed,
                notes: formData.notes || ''
            };
            const finalNotes = JSON.stringify(extendData);

            await maintenanceService.addLog({
                vehicle_id: id,
                item_name: "加油",
                log_type: 'refuel',
                mileage: parseInt(formData.mileage),
                cost: finalPay, // 实际支付金额
                notes: finalNotes,
                done_at: formData.done_at
            })

            navigate(`/vehicle/${id}`)
        } catch (error) {
            console.error('Failed to add refuel log:', error)
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
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-sky-700 rounded-full text-xs font-bold tracking-widest uppercase mb-3 border border-sky-100">
                    <Droplet size={12} className="text-sky-500 fill-sky-500/20" strokeWidth={3} />
                    New Refuel
                </div>
                <h1 className="text-3xl font-bold font-display text-slate-800 tracking-tight flex items-center gap-2">
                    记一次加油
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 space-y-6">

                <div className="grid grid-cols-2 gap-6 pb-4 border-b border-slate-100">
                    {/* 里程 */}
                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
                        <label className="block text-sm font-bold text-slate-700 ml-1">当前里程 <span className="text-xs text-slate-400 font-medium">(km)</span> <span className="text-rose-500">*</span></label>
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
                    <div className="space-y-1.5 col-span-2 sm:col-span-1">
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

                {/* 加油金额 - 核心锚点字段，占据整行 */}
                <div className="space-y-1.5">
                    <label className="block text-sm font-bold text-slate-700 ml-1">加油金额 <span className="text-xs text-slate-400 font-medium">(挂牌价总额，元)</span> <span className="text-rose-500">*</span></label>
                    <div className="relative">
                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-500">
                            <DollarSign size={18} strokeWidth={2.5} />
                        </div>
                        <input
                            type="number"
                            name="cost"
                            required
                            min="0"
                            step="0.01"
                            placeholder="加油站屏幕显示的总金额"
                            value={formData.cost}
                            onChange={handleChange}
                            className="input-soft pl-11 text-lg font-bold bg-sky-50/40 focus:bg-white focus:border-sky-300 h-14"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    {/* 加油量 */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-700 ml-1">加油量 <span className="text-xs text-slate-400 font-medium">(升 L)</span> <span className="text-rose-500">*</span></label>
                        <div className="relative">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sky-400">
                                <Droplet size={16} strokeWidth={2.5} />
                            </div>
                            <input
                                type="number"
                                name="volume"
                                required
                                min="0"
                                step="0.01"
                                placeholder="多少升油"
                                value={formData.volume}
                                onChange={handleChange}
                                className="input-soft pl-10"
                            />
                        </div>
                        <p className="text-[11px] text-slate-400 ml-1">改动后自动推算油价</p>
                    </div>

                    {/* 油价 */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-700 ml-1">挂牌油价 <span className="text-xs text-slate-400 font-medium">(元/升)</span></label>
                        <div className="relative">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                <Hash size={16} strokeWidth={2.5} />
                            </div>
                            <input
                                type="number"
                                name="unit_price"
                                min="0"
                                step="0.01"
                                placeholder="自动推算"
                                value={formData.unit_price}
                                onChange={handleChange}
                                className="input-soft pl-10"
                            />
                        </div>
                        <p className="text-[11px] text-slate-400 ml-1">改动后自动推算油量</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    {/* 优惠金额 */}
                    <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-700 ml-1">优惠金额 <span className="text-xs text-slate-400 font-medium">(元)</span></label>
                        <div className="relative">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-emerald-500">
                                <Tag size={16} strokeWidth={2.5} />
                            </div>
                            <input
                                type="number"
                                name="discount"
                                min="0"
                                step="0.01"
                                placeholder="没有优惠则留空"
                                value={formData.discount}
                                onChange={handleChange}
                                className="input-soft pl-10 bg-emerald-50/30 focus:bg-white focus:border-emerald-300"
                            />
                        </div>
                    </div>

                    {/* 是否加满 */}
                    <div className="space-y-1.5 flex flex-col justify-end pb-2">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative w-12 h-6 bg-slate-200 rounded-full transition-colors">
                                <input
                                    type="checkbox"
                                    name="is_full"
                                    checked={formData.is_full}
                                    onChange={handleChange}
                                    className="sr-only peer"
                                />
                                <div className="w-full h-full rounded-full transition-colors peer-checked:bg-brand-500"></div>
                                <div className="absolute top-[2px] left-[2px] bg-white border border-slate-300 rounded-full h-5 w-5 transition-all peer-checked:translate-x-6 peer-checked:border-white group-hover:scale-95"></div>
                            </div>
                            <span className="text-sm font-bold text-slate-700">
                                已加满
                            </span>
                        </label>
                        <p className="text-[11px] text-slate-400 ml-1">用于精准计算油耗</p>
                    </div>
                </div>

                {/* 实付预览面板 */}
                <div className="bg-sky-50 rounded-2xl p-4 flex items-center justify-between border border-sky-100/50">
                    <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-sky-700/60 uppercase tracking-widest">实际支付</span>
                        {parseFloat(formData.discount) > 0 && (
                            <span className="text-xs text-slate-400 line-through mt-0.5">¥ {parseFloat(formData.cost || 0).toFixed(2)}</span>
                        )}
                    </div>
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-display font-bold text-sky-700">
                            ¥ {actualPay().toFixed(2)}
                        </span>
                        {parseFloat(formData.discount) > 0 && (
                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100">省 ¥{parseFloat(formData.discount).toFixed(2)}</span>
                        )}
                    </div>
                </div>

                {/* 备注 */}
                <div className="space-y-1.5 pb-2">
                    <label className="block text-sm font-bold text-slate-700 ml-1">备注信息</label>
                    <textarea
                        name="notes"
                        rows="2"
                        placeholder="选填（例如：中石化95号）"
                        value={formData.notes}
                        onChange={handleChange}
                        className="input-soft resize-none"
                    ></textarea>
                </div>

                <div className="pt-2 grid grid-cols-2 gap-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="px-6 py-3.5 text-slate-600 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-all font-bold tracking-wide active:scale-95"
                    >
                        取消
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary disabled:opacity-50 disabled:shadow-none w-full flex items-center justify-center gap-2"
                    >
                        {loading ? '保存中...' : <><PenTool size={18} strokeWidth={2.5} /> 确认记录</>}
                    </button>
                </div>

            </form>
        </div>
    )
}
