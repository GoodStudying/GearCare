import { HashRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard'
import AddVehicle from './pages/AddVehicle'
import VehicleDetail from './pages/VehicleDetail'
import AddMaintenanceItem from './pages/AddMaintenanceItem'
import AddMaintenanceLog from './pages/AddMaintenanceLog'
import EditVehicle from './pages/EditVehicle'
import Login from './pages/Login'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/add-vehicle" element={<AddVehicle />} />
                  <Route path="/vehicle/:id" element={<VehicleDetail />} />
                  <Route path="/vehicle/:id/add-rule" element={<AddMaintenanceItem />} />
                  <Route path="/vehicle/:id/add-log" element={<AddMaintenanceLog />} />
                  <Route path="/vehicle/:id/edit" element={<EditVehicle />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </HashRouter>
  )
}

export default App
