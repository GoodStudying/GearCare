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
            // exclude refuel logs from normal maintenance timeline if needed, 
            // or we just fetch all to show everything in timeline?
            // "如果日志包含 refuel ，则可以根据产品需求在主日志中过滤或者展示"
            .in('log_type', ['maintenance', 'repair'])
            .order('date', { ascending: false })

        if (error) {
            console.error('Error fetching logs:', error)
            return []
        }
        return data || []
    },

    async getRefuelLogs(vehicleId) {
        const { data, error } = await supabase
            .from('autokeep_maintenance_logs')
            .select('*')
            .eq('vehicle_id', vehicleId)
            .eq('log_type', 'refuel')
            .order('mileage', { ascending: false }) // 强制按里程倒序分析

        if (error) {
            console.error('Error fetching refuel logs:', error)
            return []
        }
        return data || []
    },

    async getFuelStats(vehicleId) {
        const logs = await this.getRefuelLogs(vehicleId);
        if (!logs || logs.length < 2) return null;

        // 解析并计算有效的加油区间
        // 核心算法：两头必须都是 "加满 (is_full: true)" 才能算一段准确的油耗区间
        let totalCost = 0;
        let totalVolume = 0;
        let totalDistance = 0;

        // 按里程升序排列，以便前向计算
        const ascLogs = [...logs].sort((a, b) => a.mileage - b.mileage);

        let lastFullLog = null;
        let accumulatedVolume = 0;
        let accumulatedCost = 0;

        for (let i = 0; i < ascLogs.length; i++) {
            const currentLog = ascLogs[i];

            // 解析记录的附加值
            let extendData = {};
            try {
                if (currentLog.notes && currentLog.notes.startsWith('{')) {
                    extendData = JSON.parse(currentLog.notes);
                }
            } catch (e) {
                console.warn('Parse error', e);
            }

            const volume = extendData.volume || 0;
            const cost = currentLog.cost || 0;
            const isFull = extendData.is_full === true;

            if (!lastFullLog) {
                if (isFull) {
                    lastFullLog = currentLog; // 找到了一个起始的加满点
                    accumulatedVolume = 0;
                    accumulatedCost = 0;
                }
            } else {
                // 如果之前有起始加满点，将本次加入累计
                accumulatedVolume += volume;
                accumulatedCost += cost;

                if (isFull) {
                    // 遇到下一个加满点，区间闭合，可以计算这一段真正的油耗
                    const distance = currentLog.mileage - lastFullLog.mileage;
                    if (distance > 0) {
                        totalDistance += distance;
                        totalVolume += accumulatedVolume;
                        totalCost += accumulatedCost;
                    }

                    // 当前点成为新的起始点
                    lastFullLog = currentLog;
                    accumulatedVolume = 0;
                    accumulatedCost = 0;
                }
            }
        }

        if (totalDistance <= 0 || totalVolume <= 0) return null;

        const lPer100km = (totalVolume / totalDistance) * 100;
        const costPerKm = totalCost / totalDistance;

        return {
            totalDistance,
            totalVolume,
            totalCost,
            lPer100km: parseFloat(lPer100km.toFixed(2)),
            costPerKm: parseFloat(costPerKm.toFixed(2))
        };
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

        // 尝试自动更新车辆的总里程，形成闭环
        try {
            const { data: vehicleData } = await supabase
                .from('autokeep_vehicles')
                .select('current_mileage')
                .eq('id', logData.vehicle_id)
                .single()

            if (vehicleData && logData.mileage > vehicleData.current_mileage) {
                await supabase
                    .from('autokeep_vehicles')
                    .update({ current_mileage: logData.mileage })
                    .eq('id', logData.vehicle_id)
            }
        } catch (updateError) {
            console.error('Failed to update vehicle mileage:', updateError)
        }

        return data
    },

    async updateItem(itemId, updates) {
        // updates 可能包含 name(如果是普通名称), interval_km, interval_months
        // 因为我们在 autokeep_maintenance_logs 的 notes 里存 interval_km/months，
        // 我们需要重新构建 notes
        let notesText = updates.notes || 'Auto-generated preset configuration';
        if (updates.interval_km || updates.interval_months) {
            notesText += ` | Interval: ${updates.interval_km || '?'} km / ${updates.interval_months || '?'} months`;
        }

        const payload = {
            title: updates.name,
            notes: notesText
        };

        const { data, error } = await supabase
            .from('autokeep_maintenance_logs')
            .update(payload)
            .eq('id', itemId)
            .select()
            .single()

        if (error) {
            console.error('Error updating maintenance item:', error)
            throw error
        }
        return data
    },

    // ============ 车辆扩展信息 (VIN / 颜色 / 轮胎规格等) ============

    /**
     * 获取车辆的扩展元信息
     * 存储方式: log_type='vehicle_meta', title='vehicle_meta', notes=JSON
     */
    async getVehicleMeta(vehicleId) {
        const { data, error } = await supabase
            .from('autokeep_maintenance_logs')
            .select('*')
            .eq('vehicle_id', vehicleId)
            .eq('log_type', 'vehicle_meta')
            .eq('title', 'vehicle_meta')
            .single()

        if (error) {
            // 不存在是正常的，返回默认空对象
            return { vin: '', color: '', tire_spec: '' }
        }

        try {
            return JSON.parse(data.notes || '{}')
        } catch (e) {
            return { vin: '', color: '', tire_spec: '' }
        }
    },

    /**
     * 保存或更新车辆的扩展元信息
     */
    async saveVehicleMeta(vehicleId, metaData) {
        // 先检查是否已存在
        const { data: existing } = await supabase
            .from('autokeep_maintenance_logs')
            .select('id')
            .eq('vehicle_id', vehicleId)
            .eq('log_type', 'vehicle_meta')
            .eq('title', 'vehicle_meta')
            .single()

        const payload = {
            vehicle_id: vehicleId,
            log_type: 'vehicle_meta',
            title: 'vehicle_meta',
            date: new Date().toISOString().split('T')[0],
            mileage: 0,
            cost: 0,
            notes: JSON.stringify(metaData)
        }

        if (existing) {
            // 更新已有记录
            const { data, error } = await supabase
                .from('autokeep_maintenance_logs')
                .update({ notes: JSON.stringify(metaData) })
                .eq('id', existing.id)
                .select()
                .single()

            if (error) throw error
            return data
        } else {
            // 新建记录
            const { data, error } = await supabase
                .from('autokeep_maintenance_logs')
                .insert([payload])
                .select()
                .single()

            if (error) throw error
            return data
        }
    },

    // ============ 保险记录管理 ============

    /**
     * 获取车辆的所有保险记录
     * 存储方式: log_type='insurance', title=险种名称, cost=保费, notes=JSON(详情)
     */
    async getInsuranceRecords(vehicleId) {
        const { data, error } = await supabase
            .from('autokeep_maintenance_logs')
            .select('*')
            .eq('vehicle_id', vehicleId)
            .eq('log_type', 'insurance')
            .order('date', { ascending: false })

        if (error) {
            console.error('Error fetching insurance records:', error)
            return []
        }

        return (data || []).map(row => {
            let ext = {}
            try {
                ext = JSON.parse(row.notes || '{}')
            } catch (e) { /* 忽略 */ }
            return { ...row, ext }
        })
    },

    /**
     * 新增保险记录
     * @param {object} record - { vehicle_id, insurance_type, purchase_date, cost, coverage, company, image_url, notes }
     */
    async addInsuranceRecord(record) {
        const extendData = {
            insurance_type: record.insurance_type || '',  // 'compulsory' | 'commercial'
            coverage: record.coverage || '',              // 险种明细
            company: record.company || '',                // 保险公司
            image_url: record.image_url || '',            // 保单图片链接
            notes: record.notes || ''
        }

        const payload = {
            vehicle_id: record.vehicle_id,
            log_type: 'insurance',
            title: record.insurance_type === 'compulsory' ? '交强险' : '商业保险',
            date: record.purchase_date,
            mileage: 0,
            cost: parseFloat(record.cost) || 0,
            notes: JSON.stringify(extendData)
        }

        const { data, error } = await supabase
            .from('autokeep_maintenance_logs')
            .insert([payload])
            .select()
            .single()

        if (error) {
            console.error('Error adding insurance record:', error)
            throw error
        }
        return data
    },

    /**
     * 删除保险记录
     */
    async deleteInsuranceRecord(recordId) {
        const { error } = await supabase
            .from('autokeep_maintenance_logs')
            .delete()
            .eq('id', recordId)

        if (error) {
            console.error('Error deleting insurance record:', error)
            throw error
        }
        return true
    }
}
