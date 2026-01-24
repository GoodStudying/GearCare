import { useState } from 'react';
import { PenTool, CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react';
import { calculateMaintenanceStatus } from '../utils/maintenance';

export default function MaintenanceItem({ item, vehicle, onRecordLog, onDelete }) {
    const statusObj = calculateMaintenanceStatus(item, vehicle.current_mileage, vehicle.daily_avg_km);
    const { status, mileage, date } = statusObj;

    const StatusIcon = {
        normal: CheckCircle,
        warning: AlertTriangle,
        overdue: AlertOctagon
    }[status];

    const statusColor = {
        normal: 'text-green-500',
        warning: 'text-orange-500',
        overdue: 'text-red-500'
    }[status];

    const bgColor = {
        normal: 'bg-green-50',
        warning: 'bg-orange-50',
        overdue: 'bg-red-50'
    }[status];

    // Tooltip text generation
    const getStatusText = () => {
        if (status === 'overdue') return '已过期，请尽快保养！';
        if (status === 'warning') return '即将到期，请留意。';
        return '状态良好';
    };

    return (
        <div className={`flex items-center justify-between p-4 rounded-xl border ${bgColor} border-opacity-50 mb-3`}>
            <div className="flex items-start space-x-3">
                <StatusIcon className={`w-5 h-5 mt-0.5 ${statusColor}`} />
                <div>
                    <h4 className="font-semibold text-gray-800">{item.name}</h4>
                    <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                        <p>
                            周期: {item.interval_km ? `${item.interval_km}km` : ''}
                            {item.interval_km && item.interval_months ? ' / ' : ''}
                            {item.interval_months ? `${item.interval_months}个月` : ''}
                        </p>
                        <p>剩余:
                            {mileage.remaining !== null ? ` ${mileage.remaining} km ` : ''}
                            {date.remaining !== null ? ` / ${date.remaining} 天` : ''}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex items-center space-x-2">
                <button
                    onClick={() => onRecordLog(item)}
                    className="p-2 text-blue-600 bg-white rounded-lg shadow-sm border border-gray-100 hover:bg-blue-50 active:scale-95 transition"
                    title="记录保养"
                >
                    <PenTool className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
