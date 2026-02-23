export const maintenanceService = {
    async getItems(vehicleId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: 'm1',
                        vehicle_id: vehicleId,
                        name: '全合成机油更换',
                        type: 'maintenance',
                        interval_km: 10000,
                        interval_months: 12,
                        last_done_date: '2025-08-15',
                        last_done_mileage: 38000
                    },
                    {
                        id: 'm2',
                        vehicle_id: vehicleId,
                        name: '刹车片检查',
                        type: 'maintenance',
                        interval_km: 40000,
                        interval_months: 24,
                        last_done_date: '2024-01-10',
                        last_done_mileage: 20000
                    }
                ]);
            }, 600);
        });
    },

    async getLogs(vehicleId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: 'l1',
                        vehicle_id: vehicleId,
                        log_type: 'maintenance',
                        title: '4万公里大保养',
                        done_at: '2025-08-15',
                        mileage: 38000,
                        cost: 1560.50,
                        notes: '更换了原厂全合成机油，顺便检查了轮胎磨损。'
                    },
                    {
                        id: 'l2',
                        vehicle_id: vehicleId,
                        log_type: 'repair',
                        title: '更换雨刮器',
                        done_at: '2025-06-02',
                        mileage: 36500,
                        cost: 120,
                        notes: '博世无骨雨刮，主副驾驶一对。'
                    }
                ]);
            }, 700);
        });
    }
};
