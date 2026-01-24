/**
 * 计算保养项目的状态
 * @param {Object} item 保养规则对象
 * @param {number} currentMileage 当前车辆里程
 * @param {number} currentDailyAvg 当前车辆日均里程 (默认30)
 * @returns {Object} 状态对象
 */
export function calculateMaintenanceStatus(item, currentMileage, currentDailyAvg = 30) {
    const lastDoneMileage = item.last_done_mileage || 0;
    const lastDoneDate = item.last_done_date ? new Date(item.last_done_date) : null;

    // 1. 基于里程的计算
    let mileageDue = null;
    let mileageRemaining = null;
    let mileageStatus = 'normal'; // normal, warning, overdue

    if (item.interval_km) {
        mileageDue = lastDoneMileage + item.interval_km;
        mileageRemaining = mileageDue - currentMileage;

        if (mileageRemaining < 0) {
            mileageStatus = 'overdue';
        } else if (mileageRemaining < 500) { // 剩下500km提醒
            mileageStatus = 'warning';
        }
    }

    // 2. 基于时间的计算
    let dateDue = null;
    let daysRemaining = null;
    let dateStatus = 'normal';

    if (item.interval_months && lastDoneDate) {
        dateDue = new Date(lastDoneDate);
        dateDue.setMonth(dateDue.getMonth() + item.interval_months);

        const now = new Date();
        const diffTime = dateDue - now;
        daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (daysRemaining < 0) {
            dateStatus = 'overdue';
        } else if (daysRemaining < 30) { // 剩下30天提醒
            dateStatus = 'warning';
        }
    }

    // 综合判定 (取最紧急的)
    let finalStatus = 'normal';
    // 只要有一个是 overdue，就是 overdue
    if (mileageStatus === 'overdue' || dateStatus === 'overdue') {
        finalStatus = 'overdue';
    }
    // 否则，如果有一个是 warning，就是 warning
    else if (mileageStatus === 'warning' || dateStatus === 'warning') {
        finalStatus = 'warning';
    }

    return {
        status: finalStatus,
        mileage: {
            due: mileageDue,
            remaining: mileageRemaining,
            status: mileageStatus
        },
        date: {
            due: dateDue,
            remaining: daysRemaining,
            status: dateStatus
        },
        // 估算剩余天数 (如果有里程限制，按日均里程估算)
        estimatedDaysByMileage: (mileageRemaining !== null && currentDailyAvg > 0)
            ? Math.ceil(mileageRemaining / currentDailyAvg)
            : null
    };
}
