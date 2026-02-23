// 这个文件集中管理所有与 Supabase 的数据交互
// 等待新的 Supabase 凭据注入 .env 后，所有的 API 请求都通过这个文件进行调用，避免和 UI 耦合在一起。

import { supabase } from '../supabaseClient'; // 假设你的客户端初始化在这里，如果是别的路径请相应修改

export const vehicleService = {
    // 获取用户的所有车辆
    async fetchVehicles(userId) {
        if (!userId) return [];
        const { data, error } = await supabase
            .from('vehicles')
            .select('*')
            .eq('user_id', userId);

        if (error) {
            console.error('获取车辆列表失败:', error);
            throw error;
        }
        return data;
    },

    // 添加新车辆
    async addVehicle(vehicleData) {
        const { data, error } = await supabase
            .from('vehicles')
            .insert([vehicleData])
            .select();

        if (error) {
            console.error('添加车辆失败:', error);
            throw error;
        }
        return data[0];
    }
};

export const maintenanceService = {
    // 获取某辆车的所有保养记录
    async fetchLogs(vehicleId) {
        if (!vehicleId) return [];
        const { data, error } = await supabase
            .from('maintenance_logs')
            .select('*')
            .eq('vehicle_id', vehicleId)
            .order('date', { ascending: false });

        if (error) {
            console.error('获取保养记录失败:', error);
            throw error;
        }
        return data;
    }
};
