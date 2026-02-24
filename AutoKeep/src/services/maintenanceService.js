import { supabase } from '../lib/supabase'

export const maintenanceService = {
    async getItems(vehicleId) {
        const { data, error } = await supabase
            .from('autokeep_maintenance_logs')
            .select('*')
            .eq('vehicle_id', vehicleId)
            .eq('log_type', 'maintenance')
            .order('date', { ascending: false })

        if (error) {
            console.error('Error fetching maintenance items:', error)
            return []
        }

        // Temporarily group logs by title (item_name) to construct "items" with latest stats
        const itemMap = new Map();

        (data || []).forEach(row => {
            const title = row.title;
            if (!itemMap.has(title)) {
                itemMap.set(title, {
                    id: row.id,
                    item_name: title,
                    last_done_date: row.date,
                    last_done_mileage: row.mileage,
                    interval_km: null,
                    interval_months: null,
                    notes: row.notes
                });
            }

            // Extract interval config from whichever row has it (usually the first created one)
            const currentItem = itemMap.get(title);
            if (row.notes && row.notes.includes('Interval:') && !currentItem.interval_km && !currentItem.interval_months) {
                const match = row.notes.match(/Interval:\s*([\d\?]+)\s*km\s*\/\s*([\d\?]+)\s*months/);
                if (match) {
                    currentItem.interval_km = match[1] === '?' ? null : parseInt(match[1], 10);
                    currentItem.interval_months = match[2] === '?' ? null : parseInt(match[2], 10);
                }
            }
        });

        return Array.from(itemMap.values());
    },

    async getLogs(vehicleId) {
        const { data, error } = await supabase
            .from('autokeep_maintenance_logs')
            .select('*')
            .eq('vehicle_id', vehicleId)
            // if you want both repair and maintenance, don't filter log_type
            .order('date', { ascending: false })

        if (error) {
            console.error('Error fetching logs:', error)
            return []
        }
        return data || []
    },

    async addItem(itemData) {
        // Prepare the payload for the maintenance_logs table
        const payload = {
            ...itemData,
            log_type: 'maintenance',
            title: itemData.name || 'New Maintenance Rule',
            date: new Date().toISOString().split('T')[0],
            mileage: itemData.last_done_mileage || 0,
            cost: itemData.cost || 0,
            notes: itemData.notes || 'Auto-generated preset configuration'
        };
        // Remove virtual fields if they don't exist in autokeep_maintenance_logs table 
        // e.g., interval_km and interval_months are NOT in the SQL above.
        // I'll put them in notes for now to avoid breaking SQL schema.
        if (itemData.interval_km || itemData.interval_months) {
            payload.notes += ` | Interval: ${itemData.interval_km || '?'} km / ${itemData.interval_months || '?'} months`;
            delete payload.interval_km;
            delete payload.interval_months;
            delete payload.last_done_date;
            delete payload.last_done_mileage;
            delete payload.name;
        }

        const { data, error } = await supabase
            .from('autokeep_maintenance_logs')
            .insert([payload])
            .select()
            .single()

        if (error) {
            console.error('Error adding maintenance item:', error)
            throw error
        }
        return data
    },

    async addLog(logData, prefillItemId) {
        // Prepare the payload for the maintenance_logs table
        const payload = {
            vehicle_id: logData.vehicle_id,
            log_type: logData.log_type,
            title: logData.item_name,
            date: logData.done_at,
            mileage: logData.mileage,
            cost: logData.cost,
            notes: logData.notes
        };

        const { data, error } = await supabase
            .from('autokeep_maintenance_logs')
            .insert([payload])
            .select()
            .single()

        if (error) {
            console.error('Error adding log:', error)
            throw error
        }

        return data
    }
}
