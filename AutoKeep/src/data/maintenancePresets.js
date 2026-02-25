export const MAINTENANCE_PRESETS = [
    { name: '机油', interval_km: 6000, interval_months: 6 },
    { name: '防冻液', interval_km: null, interval_months: 24 },
    { name: '制动液', interval_km: 40000, interval_months: 24 },
    { name: '方向机油', interval_km: 40000, interval_months: null },
    { name: '变速箱油 (自动)', interval_km: 50000, interval_months: null },
    { name: '变速箱油 (手动)', interval_km: 40000, interval_months: null },
    { name: '分动箱油', interval_km: 50000, interval_months: null },
    { name: '差速器油', interval_km: 50000, interval_months: null },
    { name: '机油滤清器', interval_km: 60000, interval_months: 6 }, // 与机油同步
    { name: '空气滤清器', interval_km: 20000, interval_months: 6 },
    { name: '空调滤清器', interval_km: 20000, interval_months: 6 },
    { name: '汽油滤清器 (内置)', interval_km: 50000, interval_months: null },
    { name: '汽油滤清器 (外置)', interval_km: 20000, interval_months: null },
    { name: '火花塞', interval_km: 50000, interval_months: null },
    { name: '传动皮带、涨紧器、惰轮', interval_km: 50000, interval_months: null },
    { name: '刹车片', interval_km: 40000, interval_months: null },
    { name: '刹车盘', interval_km: 100000, interval_months: null },
    { name: '油电路保养', interval_km: 20000, interval_months: 6 },
    { name: '清洗进气积碳', interval_km: 20000, interval_months: 12 },
    { name: '清洗节气门', interval_km: 20000, interval_months: 6 },
    { name: '保养及清洗三元催化器', interval_km: 20000, interval_months: 12 },
    { name: '刹车保养及四轮保养', interval_km: 6000, interval_months: 6 },
    { name: '四轮定位', interval_km: null, interval_months: null }, // 视情况
    { name: '空调系统清洗及养护', interval_km: null, interval_months: 12 }
];

export const DEFAULT_PRESET_NAMES = [
    '机油',
    '机油滤清器',
    '空气滤清器',
    '空调滤清器',
    '制动液'
];
