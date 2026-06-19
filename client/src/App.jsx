import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import useAuthStore from './store/authStore'

// Páginas Públicas
import Landing from './pages/Landing'
import Login from './pages/Login'

// Páginas Protegidas
import Dashboard from './pages/Dashboard'
import Apartments from './pages/Apartments'
import Vehicles from './pages/Vehicles'
import Packages from './pages/Packages'
import Notices from './pages/Notices'
import Finances from './pages/Finances'
import Bookings from './pages/Bookings'
import ServiceRequests from './pages/ServiceRequests'
import Access from './pages/Access'
import Votes from './pages/Votes'

// Layouts e Proteção
import ProtectedRoute from './components/layout/ProtectedRoute'
import Sidebar from './components/layout/Sidebar'
import DashboardHeader from './components/layout/DashboardHeader'
import CreateAccount from './pages/CreateAccount'

// Wrapper para o sistema interno (Dashboard)
function AppLayout({ children }) {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: '#ffffff',
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          background: '#ffffff',
        }}
      >
        <DashboardHeader />

        <main
          style={{
            flex: 1,
            width: '100%',
            padding: '24px',
            background: '#ffffff',
            boxSizing: 'border-box',
            overflowY: 'auto',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

export default function App() {
  const { token, fetchMe } = useAuthStore()

  useEffect(() => {
    if (token) fetchMe()
  }, [token])

  return (
    <BrowserRouter>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#1a1a24',
            color: '#f3f4f6',
            border: '1px solid #2e2e3e',
          }
        }} 
      />
      
      <Routes>
        {/* 1. ROTAS PÚBLICAS: Acessíveis para todos */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<CreateAccount />} />
        
        {/* 2. ROTAS PROTEGIDAS: Apenas para usuários logados */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard"         element={<AppLayout><Dashboard /></AppLayout>} />
          <Route path="/apartments"        element={<AppLayout><Apartments /></AppLayout>} />
          <Route path="/vehicles"          element={<AppLayout><Vehicles /></AppLayout>} />
          <Route path="/packages"          element={<AppLayout><Packages /></AppLayout>} />
          <Route path="/notices"           element={<AppLayout><Notices /></AppLayout>} />
          <Route path="/finances"          element={<AppLayout><Finances /></AppLayout>} />
          <Route path="/bookings"          element={<AppLayout><Bookings /></AppLayout>} />
          <Route path="/service-requests"  element={<AppLayout><ServiceRequests /></AppLayout>} />
          <Route path="/access"            element={<AppLayout><Access /></AppLayout>} />
          <Route path="/votes"             element={<AppLayout><Votes /></AppLayout>} />
        </Route>

        {/* 3. FALLBACK: Qualquer rota inexistente volta para a home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}