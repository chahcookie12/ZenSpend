import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    // Show a minimal loading state while checking auth
    return (
      <div className="h-screen bg-cream flex items-center justify-center">
        <div className="text-sage-500 text-lg font-light">
          One moment...
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />
  }

  return children
}

export default ProtectedRoute

