// LocalStorage utilities for ZenSpend

const STORAGE_KEYS = {
  EXPENSES: 'zenspend_expenses',
  CHECK_INS: 'zenspend_checkins',
  REFLECTIONS: 'zenspend_reflections',
  CHAT_HISTORY: 'zenspend_chat_history',
  SETTINGS: 'zenspend_settings',
}

export const storage = {
  // Expenses
  getExpenses: () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.EXPENSES) || '[]')
    } catch {
      return []
    }
  },
  
  saveExpense: (expense) => {
    const expenses = storage.getExpenses()
    const newExpense = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...expense,
    }
    expenses.push(newExpense)
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses))
    return newExpense
  },

  deleteExpense: (id) => {
    const expenses = storage.getExpenses().filter(e => e.id !== id)
    localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses))
  },

  // Check-ins (emotional state)
  getCheckIns: () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CHECK_INS) || '[]')
    } catch {
      return []
    }
  },

  saveCheckIn: (checkIn) => {
    const checkIns = storage.getCheckIns()
    const newCheckIn = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...checkIn,
    }
    checkIns.push(newCheckIn)
    localStorage.setItem(STORAGE_KEYS.CHECK_INS, JSON.stringify(checkIns))
    return newCheckIn
  },

  // Reflections (pause before buying)
  getReflections: () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.REFLECTIONS) || '[]')
    } catch {
      return []
    }
  },

  saveReflection: (reflection) => {
    const reflections = storage.getReflections()
    const newReflection = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...reflection,
    }
    reflections.push(newReflection)
    localStorage.setItem(STORAGE_KEYS.REFLECTIONS, JSON.stringify(reflections))
    return newReflection
  },

  // Chat history
  getChatHistory: () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CHAT_HISTORY) || '[]')
    } catch {
      return []
    }
  },

  saveChatMessage: (message) => {
    const history = storage.getChatHistory()
    history.push({
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...message,
    })
    localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify(history))
  },

  clearChatHistory: () => {
    localStorage.setItem(STORAGE_KEYS.CHAT_HISTORY, JSON.stringify([]))
  },

  // Settings
  getSettings: () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SETTINGS) || '{}')
    } catch {
      return {}
    }
  },

  saveSetting: (key, value) => {
    const settings = storage.getSettings()
    settings[key] = value
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
  },
}

