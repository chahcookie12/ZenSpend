import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { FinanceProvider } from './context/FinanceContext'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './components/ProtectedRoute'

// Component to handle root redirect
const RootRedirect = () => {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="h-screen bg-cream flex items-center justify-center">
        <div className="text-sage-500 text-lg font-light">
          One moment...
        </div>
      </div>
    )
  }
  
  return <Navigate to={isAuthenticated ? '/dashboard' : '/signin'} replace />
}

// Component to handle auth page redirects (if already authenticated)
const AuthPageWrapper = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="h-screen bg-cream flex items-center justify-center">
        <div className="text-sage-500 text-lg font-light">
          One moment...
        </div>
      </div>
    )
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  
  return children
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<RootRedirect />} />
          
          <Route 
            path="/signin" 
            element={
              <AuthPageWrapper>
                <SignIn />
              </AuthPageWrapper>
            } 
          />
          
          <Route 
            path="/signup" 
            element={
              <AuthPageWrapper>
                <SignUp />
              </AuthPageWrapper>
            } 
          />
          
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <FinanceProvider>
                  <Dashboard />
                </FinanceProvider>
              </ProtectedRoute>
            } 
          />
          
          {/* Catch all - redirect to root which will handle auth logic */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

