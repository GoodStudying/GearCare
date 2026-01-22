import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isLogin, setIsLogin] = useState(true)
    const [message, setMessage] = useState('')
    const [lang, setLang] = useState('zh') // Default to Chinese
    const navigate = useNavigate()

    // Language Dictionary
    const t = {
        zh: {
            titleLogin: '登录到 AutoKeep',
            titleSignup: '创建新账号',
            emailLabel: '电子邮箱',
            passwordLabel: '密码',
            submitLogin: '登录',
            submitSignup: '注册',
            processing: '处理中...',
            switchLogin: '已有账号？立即登录',
            switchSignup: '还没有账号？立即注册',
            successMsg: '注册成功！请检查您的邮箱进行验证。',
            toggleLang: 'English'
        },
        en: {
            titleLogin: 'Sign in to AutoKeep',
            titleSignup: 'Create new account',
            emailLabel: 'Email address',
            passwordLabel: 'Password',
            submitLogin: 'Sign in',
            submitSignup: 'Sign up',
            processing: 'Processing...',
            switchLogin: 'Already have an account? Sign in',
            switchSignup: "Don't have an account? Sign up",
            successMsg: 'Registration successful! Check your email for verification.',
            toggleLang: '中文'
        }
    }

    const text = t[lang]

    const handleAuth = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) throw error
                navigate('/')
            } else {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                })
                if (error) throw error
                // Even with errors, let's confirm if it was truly a network error or just "check email" confusion
                // Usually signUp returns user=null if email confirmation is required but 'error' is null.
                // If error is not null, it's a real error.
                setMessage(text.successMsg)
            }
        } catch (error) {
            setMessage(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col justify-center px-6 py-12 lg:px-8 bg-gray-100 relative">
            {/* Language Switcher */}
            <div className="absolute top-4 right-4">
                <button
                    onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 bg-white px-3 py-1 rounded shadow-sm border border-gray-200"
                >
                    {text.toggleLang}
                </button>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    {isLogin ? text.titleLogin : text.titleSignup}
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form className="space-y-6" onSubmit={handleAuth}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            {text.emailLabel}
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                            {text.passwordLabel}
                        </label>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete={isLogin ? "current-password" : "new-password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 px-3"
                            />
                        </div>
                    </div>

                    {message && (
                        <div className={`text-sm text-center ${message.includes('success') ? 'text-green-600' : 'text-red-500'}`}>
                            {message}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                        >
                            {loading ? text.processing : (isLogin ? text.submitLogin : text.submitSignup)}
                        </button>
                    </div>
                </form>

                <p className="mt-10 text-center text-sm text-gray-500">
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                    >
                        {isLogin ? text.switchSignup : text.switchLogin}
                    </button>
                </p>
            </div>
        </div>
    )
}
