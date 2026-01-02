import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

// Helper functions for managing users
const getUsers = () => {
  try {
    const users = localStorage.getItem('zenspend_users')
    return users ? JSON.parse(users) : {}
  } catch {
    return {}
  }
}

const saveUsers = (users) => {
  localStorage.setItem('zenspend_users', JSON.stringify(users))
}

const getCurrentUser = () => {
  return localStorage.getItem('zenspend_currentUser')
}

const setCurrentUser = (email) => {
  if (email) {
    localStorage.setItem('zenspend_currentUser', email)
  } else {
    localStorage.removeItem('zenspend_currentUser')
  }
}

// Initialize user data structure
const initializeUserData = (email) => {
  try {
    const allData = localStorage.getItem('zenSpendData')
    const zenSpendData = allData ? JSON.parse(allData) : {}
    
    if (!zenSpendData[email]) {
      zenSpendData[email] = {
        expenses: [],
        chatHistory: [],
        checkIns: [],
        reflections: [],
        settings: {},
        monthlyBudget: 0,
        fixedExpenses: []
      }
      localStorage.setItem('zenSpendData', JSON.stringify(zenSpendData))
    }
  } catch {
    // Initialize fresh if there's an error
    const zenSpendData = {
      [email]: {
        expenses: [],
        chatHistory: [],
        checkIns: [],
        reflections: [],
        settings: {},
        monthlyBudget: 0,
        fixedExpenses: []
      }
    }
    localStorage.setItem('zenSpendData', JSON.stringify(zenSpendData))
  }
}

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication status on mount
    const currentUserEmail = getCurrentUser()
    
    if (currentUserEmail) {
      const users = getUsers()
      const userData = users[currentUserEmail]
      
      if (userData) {
        setUser({ email: currentUserEmail, ...userData })
        setIsAuthenticated(true)
      } else {
        // Clean up invalid session
        setCurrentUser(null)
      }
    }
    
    setLoading(false)
  }, [])

  const signUp = (email, password) => {
    const users = getUsers()
    
    // Check if user already exists
    if (users[email]) {
      return {
        success: false,
        message: "This email is already in use. Try signing in instead."
      }
    }
    
    // Create new user
    const userData = {
      password,
      createdAt: new Date().toISOString()
    }
    
    users[email] = userData
    saveUsers(users)
    
    // Initialize empty data for this user
    initializeUserData(email)
    
    // Set as current user
    setCurrentUser(email)
    setUser({ email, ...userData })
    setIsAuthenticated(true)
    
    return { success: true }
  }

  const signIn = (email, password) => {
    const users = getUsers()
    const userData = users[email]
    
    if (!userData) {
      return { 
        success: false, 
        message: "That didn't work. Take a breath and try again." 
      }
    }
    
    if (userData.password === password) {
      setCurrentUser(email)
      setUser({ email, ...userData })
      setIsAuthenticated(true)
      return { success: true }
    }
    
    return { 
      success: false, 
      message: "That didn't work. Take a breath and try again." 
    }
  }

  const signOut = () => {
    setCurrentUser(null)
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

