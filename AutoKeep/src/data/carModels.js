/**
 * 汽车品牌数据，包含品牌名称、车型列表及车标图片URL
 * 车标资源来自 car-logos 公共 CDN (img.icons8.com)
 * 若品牌 logo 找不到，组件会自动 fallback 到通用图标
 */
export const CAR_BRANDS = [
    {
        name: "大众 Volkswagen",
        logo: "https://img.icons8.com/color/96/volkswagen.png",
        models: ["朗逸", "速腾", "帕萨特", "迈腾", "高尔夫", "途观L", "探岳", "ID.4", "ID.3"]
    },
    {
        name: "丰田 Toyota",
        logo: "https://img.icons8.com/color/96/toyota.png",
        models: ["卡罗拉", "雷凌", "凯美瑞", "亚洲龙", "RAV4荣放", "威兰达", "汉兰达", "赛那"]
    },
    {
        name: "本田 Honda",
        logo: "https://img.icons8.com/color/96/honda.png",
        models: ["思域", "雅阁", "CR-V", "皓影", "飞度", "XR-V", "缤智", "奥德赛"]
    },
    {
        name: "比亚迪 BYD",
        logo: "https://img.icons8.com/color/96/byd-auto.png",
        models: ["秦PLUS", "汉", "唐", "宋PLUS", "元PLUS", "海豚", "海豹", "驱逐舰05"]
    },
    {
        name: "宝马 BMW",
        logo: "https://img.icons8.com/color/96/bmw.png",
        models: ["3系", "5系", "X1", "X3", "X5", "i3", "iX3"]
    },
    {
        name: "奔驰 Mercedes-Benz",
        logo: "https://img.icons8.com/color/96/mercedes-benz.png",
        models: ["C级", "E级", "GLC", "GLA", "GLB", "A级"]
    },
    {
        name: "奥迪 Audi",
        logo: "https://img.icons8.com/color/96/audi.png",
        models: ["A4L", "A6L", "A3", "Q3", "Q5L"]
    },
    {
        name: "特斯拉 Tesla",
        logo: "https://img.icons8.com/color/96/tesla-logo.png",
        models: ["Model 3", "Model Y"]
    },
    {
        name: "吉利 Geely",
        logo: "https://img.icons8.com/color/96/geely.png",
        models: ["帝豪", "星越L", "博越", "缤越", "星瑞"]
    },
    {
        name: "长安 Changan",
        logo: "https://img.icons8.com/color/96/changan.png",
        models: ["CS75 PLUS", "CS55 PLUS", "逸动PLUS", "UNI-V"]
    },
    {
        name: "日产 Nissan",
        logo: "https://img.icons8.com/color/96/nissan.png",
        models: ["轩逸", "天籁", "逍客", "奇骏"]
    },
    {
        name: "长城 Great Wall",
        logo: "https://img.icons8.com/color/96/great-wall-motors.png",
        models: ["哈弗H6", "哈弗大狗", "坦克300", "坦克500"]
    },
    {
        name: "五菱 Wuling",
        logo: "https://img.icons8.com/color/96/wuling-motors.png",
        models: ["宏光MINI EV", "星辰", "佳辰"]
    },
    {
        name: "理想 Li Auto",
        logo: "https://img.icons8.com/fluency/96/li-auto.png",
        models: ["L7", "L8", "L9", "MEGA"]
    },
    {
        name: "蔚来 NIO",
        logo: "https://img.icons8.com/fluency/96/nio.png",
        models: ["ES6", "ET5", "ET7", "EC6"]
    },
    {
        name: "小鹏 XPeng",
        logo: "https://img.icons8.com/fluency/96/xpeng.png",
        models: ["P7", "G6", "G9", "P5"]
    },
    {
        name: "红旗 Hongqi",
        logo: "https://img.icons8.com/color/96/hongqi.png",
        models: ["H5", "H9", "HS5", "E-QM5"]
    },
    {
        name: "沃尔沃 Volvo",
        logo: "https://img.icons8.com/color/96/volvo.png",
        models: ["S60", "S90", "XC40", "XC60", "XC90"]
    },
    {
        name: "马自达 Mazda",
        logo: "https://img.icons8.com/color/96/mazda.png",
        models: ["昂克赛拉", "阿特兹", "CX-5", "CX-30"]
    },
    {
        name: "福特 Ford",
        logo: "https://img.icons8.com/color/96/ford.png",
        models: ["福克斯", "锐际", "探险者", "蒙迪欧"]
    },
    {
        name: "雪佛兰 Chevrolet",
        logo: "https://img.icons8.com/color/96/chevrolet.png",
        models: ["迈锐宝XL", "科鲁泽", "探界者", "畅巡"]
    },
    {
        name: "现代 Hyundai",
        logo: "https://img.icons8.com/color/96/hyundai.png",
        models: ["伊兰特", "途胜L", "索纳塔", "库斯途"]
    },
    {
        name: "起亚 Kia",
        logo: "https://img.icons8.com/color/96/kia.png",
        models: ["K3", "K5", "狮铂拓界", "赛图斯"]
    },
    {
        name: "保时捷 Porsche",
        logo: "https://img.icons8.com/color/96/porsche.png",
        models: ["Macan", "Cayenne", "Panamera", "Taycan", "911"]
    },
    {
        name: "路虎 Land Rover",
        logo: "https://img.icons8.com/color/96/land-rover.png",
        models: ["揽胜", "发现", "卫士", "极光"]
    },
    {
        name: "雷克萨斯 Lexus",
        logo: "https://img.icons8.com/color/96/lexus.png",
        models: ["ES", "RX", "NX", "IS", "UX"]
    },
    {
        name: "别克 Buick",
        logo: "https://img.icons8.com/color/96/buick.png",
        models: ["英朗", "威朗", "君威", "昂科威", "GL8"]
    },
    {
        name: "凯迪拉克 Cadillac",
        logo: "https://img.icons8.com/color/96/cadillac.png",
        models: ["CT4", "CT5", "XT4", "XT5"]
    },
    {
        name: "斯巴鲁 Subaru",
        logo: "https://img.icons8.com/color/96/subaru.png",
        models: ["森林人", "傲虎", "XV", "力狮"]
    },
    {
        name: "领克 Lynk & Co",
        logo: "https://img.icons8.com/fluency/96/lynk-and-co.png",
        models: ["01", "03", "05", "09"]
    }
];

/**
 * 根据品牌名 (make) 获取对应的车标 logo URL
 * 支持模糊匹配 (中文名 或 英文名 的部分匹配)
 * @param {string} make - 品牌名或者用户输入的品牌关键字
 * @returns {string|null} logo URL，如果找不到返回 null
 */
export function getCarLogo(make) {
    if (!make) return null;
    const lower = make.toLowerCase();
    const brand = CAR_BRANDS.find(b => {
        const brandLower = b.name.toLowerCase();
        // 精准匹配完整名称，或部分匹配中文/英文
        return brandLower === lower
            || brandLower.includes(lower)
            || lower.includes(brandLower.split(' ')[0]); // 匹配品牌的中文名部分
    });
    return brand?.logo || null;
}
