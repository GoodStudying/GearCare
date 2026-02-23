import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { UserCircle, LogOut, Disc } from 'lucide-react'

export default function MainLayout({ children }) {
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        navigate('/login')
    }

    // 针对详细页等特定路由提供左滑返回图标（如果有做的话）

    return (
        <div className="min-h-screen bg-surface-50 pb-24 font-sans text-slate-900 selection:bg-brand-200">
            {/* 顶部晶态响应导航栏 */}
            <header className="sticky top-0 z-50 w-full bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-sm supports-[backdrop-filter]:bg-white/60">
                <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* 左侧 Logo */}
                        <div
                            className="flex-shrink-0 flex items-center gap-2 cursor-pointer group"
                            onClick={() => navigate('/')}
                        >
                            <div className="bg-gradient-to-tr from-brand-600 to-brand-400 p-1.5 rounded-lg shadow-sm shadow-brand-500/20 group-hover:scale-105 transition-transform">
                                <Disc className="text-white" size={20} />
                            </div>
                            <span className="text-xl font-bold font-display tracking-tight bg-gradient-to-r from-brand-600 to-slate-800 bg-clip-text text-transparent">
                                AutoKeep
                            </span>
                        </div>

                        {/* 右侧个人控制 */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600 font-medium transition-colors bg-white/50 border border-slate-200 px-3 py-1.5 rounded-full hover:bg-brand-50 hover:border-brand-200"
                                title="退出账号"
                            >
                                <LogOut size={16} />
                                <span className="hidden sm:inline">退出</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* 核心承载区 (增加了更优雅的内边距) */}
            <main className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-160px)]">
                {children}
            </main>

            {/* 环境页脚 */}
            <footer className="mt-auto">
                <div className="max-w-5xl mx-auto px-5 py-8 sm:px-6 lg:px-8 flex flex-col items-center">
                    <div className="h-px w-24 bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-6"></div>
                    <p className="text-center text-xs text-slate-400 font-medium">
                        &copy; {new Date().getFullYear()} AutoKeep. Code with ❤️ by Antigravity.
                    </p>
                </div>
            </footer>
        </div>
    )
}
