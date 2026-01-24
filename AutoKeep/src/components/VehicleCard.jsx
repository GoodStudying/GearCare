import React from 'react';
import { Link } from 'react-router-dom';

export default function VehicleCard({ vehicle }) {
    // 计算车辆显示的标题 (优先用昵称，没有则用品牌+型号)
    const displayTitle = vehicle.name || `${vehicle.make} ${vehicle.model}`;
    const subTitle = vehicle.name ? `${vehicle.make} ${vehicle.model}` : vehicle.license_plate;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 transition-all active:scale-95">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">{displayTitle}</h3>
                    <p className="text-xs text-gray-500">{subTitle}</p>
                </div>
                <div className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-md font-medium">
                    {vehicle.current_mileage.toLocaleString()} km
                </div>
            </div>

            <div className="flex items-center justify-between mt-4 border-t border-gray-50 pt-3">
                <div className="text-xs text-gray-400">
                    {vehicle.license_plate || '无车牌'}
                </div>
                <Link
                    to={`/vehicle/${vehicle.id}`}
                    className="text-sm text-blue-600 font-medium hover:text-blue-700"
                >
                    管理 &gt;
                </Link>
            </div>
        </div>
    );
}
