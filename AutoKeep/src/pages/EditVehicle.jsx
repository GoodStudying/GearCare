import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { vehicleService } from '../services/vehicleService'
import { maintenanceService } from '../services/maintenanceService'
import { Trash2, ArrowLeft, Settings2, ShieldCheck, Plus } from 'lucide-react'
import AddInsuranceForm, { InsuranceList } from '../components/InsuranceManager'

export default function EditVehicle() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    // 基础信息
    const [formData, setFormData] = useState({
        name: '',
        make: '',
        model: '',
        year: '',
        license_plate: '',
        current_mileage: '',
        daily_avg_km: ''
    })

    // 扩展元信息
    const [metaData, setMetaData] = useState({
        vin: '',
        color: '',
        tire_spec: ''
    })

    // 保险记录
    const [insurances, setInsurances] = useState([])
    const [showAddInsurance, setShowAddInsurance] = useState(false)

    useEffect(() => {
        loadAllData()
    }, [id])

    async function loadAllData() {
        setLoading(true)
        try {
            const [vehicleData, extMeta, insRecords] = await Promise.all([
                vehicleService.getVehicleById(id),
                maintenanceService.getVehicleMeta(id),
                maintenanceService.getInsuranceRecords(id)
            ])

            setFormData({
                name: vehicleData.name || '',
                make: vehicleData.make || '',
                model: vehicleData.model || '',
                year: vehicleData.year || '',
                license_plate: vehicleData.license_plate || '',
                current_mileage: vehicleData.current_mileage || 0,
                daily_avg_km: vehicleData.daily_avg_km || 30
            })

            setMetaData({
                vin: extMeta?.vin || '',
                color: extMeta?.color || '',
                tire_spec: extMeta?.tire_spec || ''
            })

            setInsurances(insRecords || [])
        } catch (error) {
            console.error('Failed to load vehicle full data:', error)
            alert('加载车辆信息失败')
            navigate(`/vehicle/${id}`)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleMetaChange = (e) => {
        const { name, value } = e.target
        const finalValue = name === 'vin' ? value.toUpperCase() : value;
        setMetaData(prev => ({ ...prev, [name]: finalValue }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            await Promise.all([
                vehicleService.updateVehicle(id, {
                    ...formData,
                    year: formData.year ? parseInt(formData.year) : null,
                    current_mileage: parseInt(formData.current_mileage),
                    daily_avg_km: parseInt(formData.daily_avg_km)
                }),
                maintenanceService.saveVehicleMeta(id, metaData)
            ])
            navigate(`/vehicle/${id}`)
        } catch (error) {
            console.error('Failed to update vehicle:', error)
            alert('更新车辆信息失败，请重试')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async () => {
        if (!window.confirm('确定要删除这辆车吗？此操作不可恢复，所有相关的维保记录都会被彻底删除！')) {
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

    const handleInsuranceAdded = () => {
        setShowAddInsurance(false)
        maintenanceService.getInsuranceRecords(id).then(setInsurances)
    }

    const handleInsuranceDeleted = async (recordId) => {
        try {
            await maintenanceService.deleteInsuranceRecord(recordId)
            setInsurances(prev => prev.filter(ins => ins.id !== recordId))
        } catch (error) {
            alert('删除保单失败')
        }
    }

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500"></div>
        </div>
    )

    return (
        <div className="max-w-2xl mx-auto animate-fade-in pb-20">
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
                    Settings
                </div>
                <h1 className="text-3xl font-bold font-display text-slate-800 tracking-tight">车辆设置</h1>
            </div>

            <form id="vehicle-form" onSubmit={handleSubmit} className="space-y-6">
                {/* 基本信息区块 */}
                <div className="glass-card p-6 md:p-8 space-y-6">
                    <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">基本档案</h3>
                    <div className="space-y-1.5">
                        <label className="block text-sm font-bold text-slate-700 ml-1">车辆昵称 <span className="text-rose-500">*</span></label>
                        <input type="text" name="name" required value={formData.name} onChange={handleChange} className="input-soft" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-slate-700 ml-1">品牌 <span className="text-rose-500">*</span></label>
                            <input type="text" name="make" required value={formData.make} onChange={handleChange} className="input-soft" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-slate-700 ml-1">型号 <span className="text-rose-500">*</span></label>
                            <input type="text" name="model" required value={formData.model} onChange={handleChange} className="input-soft" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-slate-700 ml-1">年份 <span className="text-xs text-slate-400 font-medium">(可选)</span></label>
                            <input type="number" name="year" value={formData.year} onChange={handleChange} className="input-soft" />
                        </div>
                        <div className="md:col-span-2 space-y-1.5">
                            <label className="block text-sm font-bold text-slate-700 ml-1">车牌号 <span className="text-xs text-slate-400 font-medium">(可选)</span></label>
                            <input type="text" name="license_plate" value={formData.license_plate} onChange={handleChange} className="input-soft uppercase" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-slate-700 ml-1">当前里程 <span className="text-xs text-slate-400 font-medium">(km)</span> <span className="text-rose-500">*</span></label>
                            <input type="number" name="current_mileage" required value={formData.current_mileage} onChange={handleChange} className="input-soft" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-bold text-slate-700 ml-1">日均行驶 <span className="text-xs text-slate-400 font-medium">(km/天)</span> <span className="text-rose-500">*</span></label>
                            <input type="number" name="daily_avg_km" required value={formData.daily_avg_km} onChange={handleChange} className="input-soft" />
                            <p className="text-[11px] font-bold text-slate-400 mt-1.5 ml-1 tracking-wider">用于推测下次保养</p>
                        </div>
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
            </form>

            {/* 表单外的独立保存悬浮按钮（绑定到表单ID） */}
            <div className="glass-card p-4 mt-6 sticky top-4 z-50 flex items-center justify-between shadow-lg shadow-brand-500/10 border-brand-200">
                <span className="text-[13px] font-bold text-slate-500 px-3 hidden sm:block">修改上方档案后请保存</span>
                <div className="flex gap-4 w-full sm:w-auto">
                    <button type="button" onClick={() => navigate(-1)} className="px-6 py-2.5 text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all font-bold active:scale-95 flex-1 sm:flex-none">取消</button>
                    <button type="submit" form="vehicle-form" disabled={saving} className="btn-primary py-2.5 px-8 flex-1 sm:flex-none">
                        {saving ? '保存中...' : '保存以上修改'}
                    </button>
                </div>
            </div>

            {/* 保险管理独立区块 (与上面的表单和保存按钮逻辑完全隔离) */}
            <div className="border-t border-slate-200 pt-8 mt-12 mb-4">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-[22px] font-bold font-display text-slate-800 flex items-center">
                        <div className="p-1.5 bg-brand-50 text-brand-600 rounded-lg mr-2 border border-brand-100">
                            <ShieldCheck className="w-5 h-5" strokeWidth={2.5} />
                        </div>
                        保险管理
                    </h3>
                    {!showAddInsurance && (
                        <button
                            onClick={() => setShowAddInsurance(true)}
                            className="flex items-center text-brand-600 bg-brand-50 hover:bg-brand-500 hover:text-white border border-brand-100 text-[13px] font-bold px-4 py-2 rounded-xl transition-all shadow-sm active:scale-95"
                        >
                            <Plus size={16} className="mr-1" strokeWidth={2.5} /> 添加保单
                        </button>
                    )}
                </div>

                {showAddInsurance && (
                    <AddInsuranceForm vehicleId={id} onAdded={handleInsuranceAdded} onCancel={() => setShowAddInsurance(false)} />
                )}

                <div className="mt-4">
                    <InsuranceList records={insurances} onDelete={handleInsuranceDeleted} />
                </div>
            </div>

            {/* 危险区 */}
            <div className="mt-12 pt-8 border-t border-rose-100">
                <div className="bg-rose-50 border border-rose-200/50 rounded-[1.5rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                    <div>
                        <p className="font-bold text-rose-800 text-lg mb-1 flex items-center"><Trash2 size={18} className="mr-1.5" /> 危险区域</p>
                        <p className="text-[13px] font-medium text-rose-700/80 max-w-md leading-relaxed">删除后不可恢复，包含这辆车的所有档案、扩展配置、账本流水与保单记录都会被永久清空。</p>
                    </div>
                    <button
                        type="button"
                        onClick={handleDelete}
                        className="flex items-center justify-center text-rose-600 bg-white border border-rose-200 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all text-sm font-bold px-6 py-3 rounded-xl shadow-sm active:scale-95 shrink-0 w-full md:w-auto"
                    >
                        彻底删除此车辆
                    </button>
                </div>
            </div>

        </div>
    )
}
