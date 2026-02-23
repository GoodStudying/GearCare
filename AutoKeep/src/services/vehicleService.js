export const vehicleService = {
    async getVehicles() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    {
                        id: '1',
                        name: '我的代步宝马',
                        make: 'BMW',
                        model: '330i M Sport',
                        year: 2021,
                        license_plate: '粤B·12345',
                        current_mileage: 45600,
                        daily_avg_km: 38
                    },
                    {
                        id: '2',
                        name: '周末越野',
                        make: 'Jeep',
                        model: 'Wrangler Rubicon',
                        year: 2019,
                        license_plate: '粤B·88888',
                        current_mileage: 120500,
                        daily_avg_km: 15
                    }
                ]);
            }, 500);
        });
    },

    async getVehicleById(id) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(id === '2' ? {
                    id: '2',
                    name: '周末越野',
                    make: 'Jeep',
                    model: 'Wrangler Rubicon',
                    year: 2019,
                    license_plate: '粤B·88888',
                    current_mileage: 120500,
                    daily_avg_km: 15
                } : {
                    id: '1',
                    name: '我的代步宝马',
                    make: 'BMW',
                    model: '330i M Sport',
                    year: 2021,
                    license_plate: '粤B·12345',
                    current_mileage: 45600,
                    daily_avg_km: 38
                });
            }, 500);
        });
    },

    async addVehicle(vehicleData) {
        return { id: 'new-id', ...vehicleData };
    },

    async updateVehicle(id, updates) {
        return { id, ...updates };
    },

    async deleteVehicle(id) {
        return true;
    }
};
