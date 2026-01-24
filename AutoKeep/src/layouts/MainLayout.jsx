import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function MainLayout({ children }) {
    const navigate = useNavigate()

    const handleLogout = async () => {
        await supabase.auth.signOut()
        // 登出后重定向到登录页，Auth listener 会处理 session 变化，但这里显式跳转更流畅
        navigate('/login')
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Top Navigation Bar - Sticky */}
            <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-14">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                AutoKeep
                            </span>
                        </div>
                        <div>
                            <button
                                onClick={handleLogout}
                                className="text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors"
                                title="Sign Out"
                            >
                                退出
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 min-h-[calc(100vh-160px)]">
                {children}
            </main>

            {/* Simple Footer */}
            <footer className="bg-white border-t border-gray-200 mt-auto">
                <div className="max-w-5xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <p className="text-center text-sm text-gray-400">
                        &copy; {new Date().getFullYear()} AutoKeep. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    )
}
