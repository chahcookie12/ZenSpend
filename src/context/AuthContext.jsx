import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication status on mount
    const authStatus = localStorage.getItem('isAuthenticated')
    const userData = localStorage.getItem('user')
    
    if (authStatus === 'true' && userData) {
      setIsAuthenticated(true)
      setUser(JSON.parse(userData))
    }
    
    setLoading(false)
  }, [])

  const signUp = (email, password) => {
    const userData = {
      email,
      password,
      createdAt: new Date().toISOString()
    }
    
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('isAuthenticated', 'true')
    
    setUser(userData)
    setIsAuthenticated(true)
    
    return { success: true }
  }

  const signIn = (email, password) => {
    const storedUser = localStorage.getItem('user')
    
    if (!storedUser) {
      return { 
        success: false, 
        message: "That didn't work. Take a breath and try again." 
      }
    }

    const userData = JSON.parse(storedUser)
    
    if (userData.email === email && userData.password === password) {
      localStorage.setItem('isAuthenticated', 'true')
      setUser(userData)
      setIsAuthenticated(true)
      return { success: true }
    }
    
    return { 
      success: false, 
      message: "That didn't work. Take a breath and try again." 
    }
  }

  const signOut = () => {
    localStorage.setItem('isAuthenticated', 'false')
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        user, 
        loading,
        signUp, 
        signIn, 
        signOut 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

