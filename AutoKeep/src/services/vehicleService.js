import { supabase } from '../lib/supabase'

export const vehicleService = {
    async getVehicles() {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return []

        const { data, error } = await supabase
            .from('autokeep_vehicles')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('获取车辆列表失败:', error)
            throw error
        }
        return data || []
    },

    async getVehicleById(id) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return null

        const { data, error } = await supabase
            .from('autokeep_vehicles')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single()

        if (error) {
            console.error('获取车辆详情失败:', error)
            throw error
        }
        return data
    },

    async addVehicle(vehicleData) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('User not logged in')

        const { data, error } = await supabase
            .from('autokeep_vehicles')
            .insert([{ ...vehicleData, user_id: user.id }])
            .select()
            .single()

        if (error) {
            console.error('添加车辆失败:', error)
            throw error
        }
        return data
    },

    async updateVehicle(id, updates) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('User not logged in')

        const { data, error } = await supabase
            .from('autokeep_vehicles')
            .update(updates)
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single()

        if (error) {
            console.error('更新车辆失败:', error)
            throw error
        }
        return data
    },

    async deleteVehicle(id) {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error('User not logged in')

        const { error } = await supabase
            .from('autokeep_vehicles')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id)

        if (error) {
            console.error('删除车辆失败:', error)
            throw error
        }
        return true
    }
}
