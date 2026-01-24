import { useState, useEffect } from 'react'
import { vehicleService } from '../services/vehicleService'
import { Check, X } from 'lucide-react'

export default function DailyMileageModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [vehicle, setVehicle] = useState(null)
    const [mileage, setMileage] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        checkDailyPrompt()
    }, [])

    async function checkDailyPrompt() {
        // 1. Check local storage for today's date
        const today = new Date().toISOString().split('T')[0]
        const lastCheck = localStorage.getItem('last_mileage_check_date')
        
        if (lastCheck === today) {
            return; // Already checked today
        }

        // 2. Fetch the primary vehicle (simplification: assume user has at least one vehicle)
        // In a real multi-vehicle app, we might check which one is used most or loop them.
        try {
            const vehicles = await vehicleService.getVehicles()
            if (vehicles.length > 0) {
                const target = vehicles[0] // Prompt for the first vehicle for now
                setVehicle(target)
                setMileage(target.current_mileage) // Prefill
                setIsOpen(true)
            }
        } catch (error) {
            console.error("Failed to check daily prompt", error)
        }
    }

    const handleClose = (skip = false) => {
        setIsOpen(false)
        if (skip) {
            // If skipped, we still mark today as checked so we don't annoy user until tomorrow
            const today = new Date().toISOString().split('T')[0]
            localStorage.setItem('last_mileage_check_date', today)
        }
    }

    const handleSave = async () => {
        if (!vehicle || !mileage) return
        
        // Validation
        if (parseInt(mileage) < vehicle.current_mileage) {
            if (!confirm(`新里程 (${mileage}) 小于当前里程 (${vehicle.current_mileage})，确定要更新吗？`)) {
                return;
            }
        }

        setLoading(true)
        try {
            await vehicleService.updateVehicle(vehicle.id, {
                current_mileage: parseInt(mileage)
            })
            
            // Success
            const today = new Date().toISOString().split('T')[0]
            localStorage.setItem('last_mileage_check_date', today)
            setIsOpen(false)
            
            // Optionally reload page to show new stats, or just close
            window.location.reload()
            
        } catch (error) {
            console.error("Failed to update daily mileage", error)
            alert("更新失败，请稍后重试")
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen || !vehicle) return null

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
                <div className="bg-blue-600 p-4 text-white">
                    <h3 className="font-bold text-lg">早上好！☀️</h3>
                    <p className="text-blue-100 text-sm">更新一下爱车的公里数吧，这能让保养提醒更准确。</p>
                </div>
                
                <div className="p-6 space-y-4">
                    <div>
                        <div className="flex justify-between items-baseline mb-2">
                            <span className="font-medium text-gray-900">{vehicle.name}</span>
                            <span className="text-sm text-gray-500">上次: {vehicle.current_mileage} km</span>
                        </div>
                        <input
                            type="number"
                            value={mileage}
                            onChange={(e) => setMileage(e.target.value)}
                            className="w-full text-2xl font-mono font-bold text-center border-b-2 border-blue-100 focus:border-blue-600 focus:outline-none py-2 text-gray-800 placeholder-gray-300"
                            placeholder="输入当前里程"
                            autoFocus
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button 
                            onClick={() => handleClose(true)}
                            className="flex-1 py-3 text-gray-500 font-medium hover:bg-gray-50 rounded-xl transition"
                        >
                            没开车
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={loading}
                            className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 active:scale-95 transition flex items-center justify-center gap-2"
                        >
                            {loading ? '更新中...' : <><Check className="w-5 h-5" /> 确认更新</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
