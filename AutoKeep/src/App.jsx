import { useState, useEffect } from 'react'
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { supabase } from './lib/supabase'
import Login from './pages/Login'

// 简单的 Dashboard 占位页面
function Dashboard() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    // Auth state change will be detected by ProtectedRoute logic usually, 
    // but here we might need manual redirect or context update.
    // For simplicity, reload or let the listener handle it if we had a context.
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">AutoKeep Dashboard</h1>
        {user ? (
          <div>
            <p className="mb-4">Welcome, {user.email}</p>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white rounded py-2 hover:bg-red-600 transition"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <p>Loading user data...</p>
        )}
      </div>
    </div>
  )
}

// 路由保护组件
function ProtectedRoute({ children }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </HashRouter>
  )
}

export default App
