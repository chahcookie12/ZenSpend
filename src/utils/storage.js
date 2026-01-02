// LocalStorage utilities for ZenSpend - User-scoped storage

// Get current authenticated user
const getCurrentUser = () => {
  return localStorage.getItem('zenspend_currentUser')
}

// Get all user data
const getUserData = () => {
  try {
    const data = localStorage.getItem('zenSpendData')
    return data ? JSON.parse(data) : {}
  } catch {
    return {}
  }
}

// Save all user data
const saveUserData = (data) => {
  localStorage.setItem('zenSpendData', JSON.stringify(data))
}

// Get current user's data object
const getCurrentUserData = () => {
  const currentUser = getCurrentUser()
  if (!currentUser) return null
  
  const allData = getUserData()
  if (!allData[currentUser]) {
    // Initialize if doesn't exist
    allData[currentUser] = {
      expenses: [],
      chatHistory: [],
      checkIns: [],
      reflections: [],
      settings: {},
      monthlyBudget: 0,
      fixedExpenses: []
    }
    saveUserData(allData)
  }
  
  return allData[currentUser]
}

// Update current user's data
const updateCurrentUserData = (updates) => {
  const currentUser = getCurrentUser()
  if (!currentUser) return
  
  const allData = getUserData()
  allData[currentUser] = {
    ...allData[currentUser],
    ...updates
  }
  saveUserData(allData)
}

export const storage = {
  // Expenses
  getExpenses: () => {
    const userData = getCurrentUserData()
    return userData ? userData.expenses : []
  },
  
  saveExpense: (expense) => {
    const userData = getCurrentUserData()
    if (!userData) return null
    
    const newExpense = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...expense,
    }
    userData.expenses.push(newExpense)
    updateCurrentUserData({ expenses: userData.expenses })
    return newExpense
  },

  deleteExpense: (id) => {
    const userData = getCurrentUserData()
    if (!userData) return
    
    userData.expenses = userData.expenses.filter(e => e.id !== id)
    updateCurrentUserData({ expenses: userData.expenses })
  },

  // Check-ins (emotional state)
  getCheckIns: () => {
    const userData = getCurrentUserData()
    return userData ? userData.checkIns : []
  },

  saveCheckIn: (checkIn) => {
    const userData = getCurrentUserData()
    if (!userData) return null
    
    const newCheckIn = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...checkIn,
    }
    userData.checkIns.push(newCheckIn)
    updateCurrentUserData({ checkIns: userData.checkIns })
    return newCheckIn
  },

  // Reflections (pause before buying)
  getReflections: () => {
    const userData = getCurrentUserData()
    return userData ? userData.reflections : []
  },

  saveReflection: (reflection) => {
    const userData = getCurrentUserData()
    if (!userData) return null
    
    const newReflection = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...reflection,
    }
    userData.reflections.push(newReflection)
    updateCurrentUserData({ reflections: userData.reflections })
    return newReflection
  },

  // Chat history
  getChatHistory: () => {
    const userData = getCurrentUserData()
    return userData ? userData.chatHistory : []
  },

  saveChatMessage: (message) => {
    const userData = getCurrentUserData()
    if (!userData) return
    
    userData.chatHistory.push({
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...message,
    })
    updateCurrentUserData({ chatHistory: userData.chatHistory })
  },

  clearChatHistory: () => {
    const userData = getCurrentUserData()
    if (!userData) return
    
    userData.chatHistory = []
    updateCurrentUserData({ chatHistory: [] })
  },

  // Settings
  getSettings: () => {
    const userData = getCurrentUserData()
    return userData ? userData.settings : {}
  },

  saveSetting: (key, value) => {
    const userData = getCurrentUserData()
    if (!userData) return
    
    userData.settings[key] = value
    updateCurrentUserData({ settings: userData.settings })
  },

  // Monthly Budget
  getMonthlyBudget: () => {
    const userData = getCurrentUserData()
    return userData ? (userData.monthlyBudget || 0) : 0
  },

  saveMonthlyBudget: (amount) => {
    const userData = getCurrentUserData()
    if (!userData) return
    
    updateCurrentUserData({ monthlyBudget: parseFloat(amount) || 0 })
  },

  // Fixed Expenses
  getFixedExpenses: () => {
    const userData = getCurrentUserData()
    return userData ? userData.fixedExpenses : []
  },

  saveFixedExpense: (expense) => {
    const userData = getCurrentUserData()
    if (!userData) return null
    
    const newExpense = {
      id: Date.now().toString(),
      ...expense,
    }
    userData.fixedExpenses.push(newExpense)
    updateCurrentUserData({ fixedExpenses: userData.fixedExpenses })
    return newExpense
  },

  updateFixedExpense: (id, updates) => {
    const userData = getCurrentUserData()
    if (!userData) return
    
    const index = userData.fixedExpenses.findIndex(e => e.id === id)
    if (index !== -1) {
      userData.fixedExpenses[index] = { ...userData.fixedExpenses[index], ...updates }
      updateCurrentUserData({ fixedExpenses: userData.fixedExpenses })
    }
  },

  deleteFixedExpense: (id) => {
    const userData = getCurrentUserData()
    if (!userData) return
    
    userData.fixedExpenses = userData.fixedExpenses.filter(e => e.id !== id)
    updateCurrentUserData({ fixedExpenses: userData.fixedExpenses })
  },
}
