import { supabase } from '../lib/supabase';

export const maintenanceService = {
    // --- Maintenance Items (Rules) ---

    async getItems(vehicleId) {
        const { data, error } = await supabase
            .from('maintenance_items')
            .select('*')
            .eq('vehicle_id', vehicleId)
            .order('name');

        if (error) throw error;
        return data;
    },

    async addItem(itemData) {
        const { data, error } = await supabase
            .from('maintenance_items')
            .insert([itemData])
            .select();

        if (error) throw error;
        return data[0];
    },

    async deleteItem(id) {
        const { error } = await supabase
            .from('maintenance_items')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // --- Maintenance Logs ---

    async getLogs(vehicleId) {
        const { data, error } = await supabase
            .from('maintenance_logs')
            .select('*')
            .eq('vehicle_id', vehicleId)
            .order('done_at', { ascending: false }); // 最近的在前面

        if (error) throw error;
        return data;
    },

    /**
     * 添加维保记录，并自动更新关联规则的 last_done 信息 (如果是保养类型)
     */
    async addLog(logData, relatedItemId = null) {
        // 1. 添加日志
        const { data: log, error: logError } = await supabase
            .from('maintenance_logs')
            .insert([logData])
            .select()
            .single();

        if (logError) throw logError;

        // 2. 如果关联了规则且是保养类型，更新规则状态
        if (relatedItemId && logData.log_type === 'maintenance') {
            const { error: itemError } = await supabase
                .from('maintenance_items')
                .update({
                    last_done_date: logData.done_at,
                    last_done_mileage: logData.mileage
                })
                .eq('id', relatedItemId);

            if (itemError) {
                console.error("Failed to update maintenance item stats", itemError);
                // 此时日志已添加，但不阻断流程，仅记录错误
            } else {
                console.log("Successfully updated maintenance item", relatedItemId);
            }
        }

        // 3. 更新车辆当前里程 (如果日志里程 > 当前里程)
        // 获取当前车辆信息比较复杂，这里简化：如果日志里程很大，大概率是更新了里程。
        // 建议在前端或单独逻辑处理里程更新，这里暂不自动更新车辆里程以免逻辑过于隐晦。

        return log;
    }
};
