import { useState } from 'react';
import { Car } from 'lucide-react';
import { getCarLogo } from '../data/carModels';

/**
 * 车标展示组件
 * 根据传入的品牌名称 (make) 自动匹配并展示对应品牌的车标图片。
 * 如果没有找到匹配的车标，fallback 显示通用的 Car 图标。
 * 
 * @param {string} make - 品牌名称 (如 "大众 Volkswagen")
 * @param {number} size - 图标尺寸 (默认 32)
 * @param {string} className - 外层容器的自定义 className
 */
export default function CarBrandLogo({ make, size = 32, className = '' }) {
    const [imgError, setImgError] = useState(false);
    const logoUrl = getCarLogo(make);

    // 如果没有 logo URL 或图片加载失败，使用通用图标作为回退
    if (!logoUrl || imgError) {
        return (
            <div className={`flex items-center justify-center ${className}`}>
                <Car size={size * 0.7} strokeWidth={1.5} className="text-slate-400" />
            </div>
        );
    }

    return (
        <div className={`flex items-center justify-center ${className}`}>
            <img
                src={logoUrl}
                alt={`${make} logo`}
                width={size}
                height={size}
                className="object-contain"
                onError={() => setImgError(true)}
                loading="lazy"
            />
        </div>
    );
}
