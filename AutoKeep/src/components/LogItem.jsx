import { Wrench, FileText } from 'lucide-react';

export default function LogItem({ log }) {
    const isMaintenance = log.log_type === 'maintenance';

    return (
        <div className="flex items-start space-x-3 p-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition rounded-lg">
            <div className={`p-2 rounded-full ${isMaintenance ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                {isMaintenance ? <Wrench className="w-4 h-4" /> : <Wrench className="w-4 h-4" />}
            </div>

            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <h5 className="font-medium text-gray-800 text-sm">{log.item_name}</h5>
                    <span className="text-xs text-gray-400">{new Date(log.done_at).toLocaleDateString()}</span>
                </div>

                <div className="text-xs text-gray-500 mt-1 flex justify-between">
                    <span>{log.mileage.toLocaleString()} km</span>
                    {log.cost && <span className="font-medium">￥{log.cost}</span>}
                </div>

                {log.notes && (
                    <p className="text-xs text-gray-400 mt-1 bg-gray-50 p-1.5 rounded">
                        {log.notes}
                    </p>
                )}
            </div>
        </div>
    );
}
