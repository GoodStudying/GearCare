import { useState, useRef } from 'react';
import { ShieldAlert, ShieldCheck, Calendar, DollarSign, UploadCloud, Tag, PenTool, ExternalLink, X, Building2 } from 'lucide-react';
import { maintenanceService } from '../services/maintenanceService';

/**
 * 添加保险表单组件 (嵌入式)
 */
export default function AddInsuranceForm({ vehicleId, onAdded, onCancel }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        insurance_type: 'compulsory', // 默认交强险
        company: '',
        purchase_date: new Date().toISOString().split('T')[0],
        cost: '',
        coverage: '',
        image_url: '',
        notes: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await maintenanceService.addInsuranceRecord({
                vehicle_id: vehicleId,
                ...formData
            });
            onAdded();
        } catch (error) {
            console.error('Failed to add insurance:', error);
            alert('添加保险记录失败');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mt-4 animate-slide-up space-y-4">
            <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-slate-700 flex items-center">
                    <ShieldCheck size={18} className="text-brand-500 mr-2" />
                    新增保险记录
                </h4>
                <button type="button" onClick={onCancel} className="text-slate-400 hover:text-slate-600 bg-white p-1 rounded-full shadow-sm">
                    <X size={16} />
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* 险种类型 */}
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-slate-700 ml-1">险种分类</label>
                    <select
                        name="insurance_type"
                        value={formData.insurance_type}
                        onChange={handleChange}
                        className="input-soft font-medium text-slate-700"
                    >
                        <option value="compulsory">✅ 交强险 (+车船税)</option>
                        <option value="commercial">🚀 商业险</option>
                    </select>
                </div>

                {/* 购买日期 */}
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-slate-700 ml-1">购买/生效日期 <span className="text-rose-500">*</span></label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Calendar size={16} /></div>
                        <input
                            type="date"
                            name="purchase_date"
                            required
                            value={formData.purchase_date}
                            onChange={handleChange}
                            className="input-soft pl-9"
                        />
                    </div>
                </div>

                {/* 承保公司 */}
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-slate-700 ml-1">承保公司</label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Building2 size={16} /></div>
                        <input
                            type="text"
                            name="company"
                            placeholder="如：人保、平安、太平洋"
                            value={formData.company}
                            onChange={handleChange}
                            className="input-soft pl-9"
                        />
                    </div>
                </div>

                {/* 价格 */}
                <div className="space-y-1.5 col-span-2 sm:col-span-1">
                    <label className="block text-sm font-bold text-slate-700 ml-1">保费金额 (元) <span className="text-rose-500">*</span></label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-brand-500"><DollarSign size={16} /></div>
                        <input
                            type="number"
                            name="cost"
                            required
                            min="0"
                            step="0.01"
                            placeholder="支付的保费金额"
                            value={formData.cost}
                            onChange={handleChange}
                            className="input-soft pl-9 font-bold"
                        />
                    </div>
                </div>

                {/* 商业保险专项明细 */}
                {formData.insurance_type === 'commercial' && (
                    <div className="space-y-1.5 col-span-2">
                        <label className="block text-sm font-bold text-slate-700 ml-1">投保明细额度</label>
                        <div className="relative">
                            <div className="absolute left-3 top-3 text-slate-400"><Tag size={16} /></div>
                            <input
                                type="text"
                                name="coverage"
                                placeholder="如：三者300万 / 车损 / 座位险"
                                value={formData.coverage}
                                onChange={handleChange}
                                className="input-soft pl-9"
                            />
                        </div>
                    </div>
                )}

                {/* 图床链接 */}
                <div className="space-y-1.5 col-span-2">
                    <label className="block text-sm font-bold text-slate-700 ml-1">保单截图验证 (图床直链 URL)</label>
                    <div className="relative">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><UploadCloud size={16} /></div>
                        <input
                            type="url"
                            name="image_url"
                            placeholder="https://example.com/images/policy.jpg"
                            value={formData.image_url}
                            onChange={handleChange}
                            className="input-soft pl-9 text-brand-600 bg-slate-100 placeholder:text-slate-400"
                        />
                    </div>
                </div>

                <div className="col-span-2 pt-2 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary py-2.5 px-6 text-sm flex items-center gap-1.5"
                    >
                        {loading ? '保存中...' : <><PenTool size={16} /> 确认保存</>}
                    </button>
                </div>
            </div>
        </form>
    );
}

/**
 * 历史保险保单列表组件
 */
export function InsuranceList({ records, onDelete }) {
    if (!records || records.length === 0) {
        return (
            <div className="text-center py-6 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 mt-2">
                <ShieldAlert className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-500 font-medium">还没有任何保险记录</p>
            </div>
        );
    }

    return (
        <div className="space-y-3 mt-4">
            {records.map(record => {
                const isCommercial = record.ext?.insurance_type === 'commercial';
                return (
                    <div key={record.id} className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                        {/* 装饰条 */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${isCommercial ? 'bg-brand-500' : 'bg-sky-500'}`}></div>

                        <div className="flex justify-between items-start pl-2">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h5 className="font-bold text-slate-800 flex items-center">
                                        {isCommercial ? '🚀 商业保险' : '✅ 交强险(+车船税)'}
                                    </h5>
                                    {record.ext?.company && (
                                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded flex items-center gap-1 font-bold">
                                            <Building2 size={10} /> {record.ext.company}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center text-xs text-slate-500 gap-3 font-medium">
                                    <span className="flex items-center gap-1"><Calendar size={12} /> {record.date ? new Date(record.date).toLocaleDateString() : '未知日期'}</span>
                                    {record.ext?.coverage && <span className="flex items-center gap-1 truncate max-w-[150px]"><Tag size={12} /> {record.ext.coverage}</span>}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-lg font-display font-bold text-slate-800">¥{record.cost}</div>
                            </div>
                        </div>

                        {/* 保单图片快捷查看 */}
                        {record.ext?.image_url && (
                            <div className="mt-3 pl-2 pt-3 border-t border-slate-50 flex justify-between items-center">
                                <a
                                    href={record.ext.image_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-brand-600 font-bold flex items-center gap-1 hover:text-brand-500 bg-brand-50 px-2 py-1 rounded inline-flex"
                                >
                                    <ExternalLink size={12} /> 查看电子保单原件
                                </a>
                            </div>
                        )}

                        {/* 删除按钮 (Hover显示) */}
                        <button
                            onClick={() => {
                                if (window.confirm('确认要删除这条保单记录吗？')) {
                                    onDelete(record.id);
                                }
                            }}
                            className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 text-rose-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-all"
                            title="删除保单"
                        >
                            <X size={16} strokeWidth={2.5} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
}

