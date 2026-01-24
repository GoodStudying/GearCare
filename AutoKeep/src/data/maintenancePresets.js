export const MAINTENANCE_PRESETS = [
    { name: '更换机油 (全合成)', interval_km: 10000, interval_months: 12 },
    { name: '更换机油 (半合成/矿物)', interval_km: 5000, interval_months: 6 },
    { name: '更换机油滤芯', interval_km: 10000, interval_months: 12 },
    { name: '更换空气滤芯', interval_km: 20000, interval_months: 24 },
    { name: '更换空调滤芯', interval_km: 20000, interval_months: 12 },
    { name: '更换刹车油', interval_km: 40000, interval_months: 24 },
    { name: '更换防冻液', interval_km: 40000, interval_months: 24 },
    { name: '更换火花塞', interval_km: 40000, interval_months: 48 },
    { name: '轮胎换位/动平衡', interval_km: 10000, interval_months: null },
    { name: '更换变速箱油', interval_km: 60000, interval_months: 48 },
];

export const DEFAULT_PRESET_NAMES = [
    '更换机油 (全合成)',
    '更换机油滤芯',
    '更换空气滤芯',
    '更换空调滤芯',
    '更换刹车油'
];
