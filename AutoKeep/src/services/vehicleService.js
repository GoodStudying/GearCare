import { supabase } from '../lib/supabase';

/**
 * @typedef {Object} Vehicle
 * @property {string} id
 * @property {string} name - 昵称
 * @property {string} make - 品牌
 * @property {string} model - 型号
 * @property {number} year
 * @property {string} license_plate - 车牌
 * @property {number} current_mileage - 当前里程
 * @property {number} daily_avg_km - 日均里程
 */

export const vehicleService = {
    /**
     * 获取当前用户的所有车辆
     * @returns {Promise<Vehicle[]>}
     */
    async getVehicles() {
        const { data, error } = await supabase
            .from('vehicles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching vehicles:', error);
            throw error;
        }

        return data;
    },

    /**
     * 获取单个车辆详情
     * @param {string} id
     * @returns {Promise<Vehicle>}
     */
    async getVehicleById(id) {
        const { data, error } = await supabase
            .from('vehicles')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching vehicle details:', error);
            throw error;
        }

        return data;
    },

    /**
     * 添加新车辆
     * @param {Omit<Vehicle, 'id' | 'created_at'>} vehicleData
     */
    async addVehicle(vehicleData) {
        // 获取当前用户
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('User not authenticated');
        }

        const { data, error } = await supabase
            .from('vehicles')
            .insert([{
                ...vehicleData,
                user_id: user.id
            }])
            .select();

        if (error) {
            console.error('Error adding vehicle:', error);
            throw error;
        }

        return data[0];
    },

    /**
     * 更新车辆信息
     * @param {string} id
     * @param {Object} updates
     */
    async updateVehicle(id, updates) {
        const { data, error } = await supabase
            .from('vehicles')
            .update(updates)
            .eq('id', id)
            .select();

        if (error) {
            console.error('Error updating vehicle:', error);
            throw error;
        }

        return data[0];
    },

    /**
     * 删除车辆
     * @param {string} id 
     */
    async deleteVehicle(id) {
        const { error } = await supabase
            .from('vehicles')
            .delete()
            .eq('id', id);

        if (error) {
            throw error;
        }
    }
};
