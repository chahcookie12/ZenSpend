import { createContext, useContext, useState, useEffect } from 'react'
import { storage } from '../utils/storage'

const FinanceContext = createContext(null)

export const FinanceProvider = ({ children }) => {
  const [expenses, setExpenses] = useState([])
  const [fixedExpenses, setFixedExpenses] = useState([])
  const [monthlyBudget, setMonthlyBudget] = useState(0)
  const [checkIns, setCheckIns] = useState([])
  const [reflections, setReflections] = useState([])

  // Load all data on mount
  useEffect(() => {
    loadAllData()
  }, [])

  const loadAllData = () => {
    setExpenses(storage.getExpenses())
    setFixedExpenses(storage.getFixedExpenses())
    setMonthlyBudget(storage.getMonthlyBudget())
    setCheckIns(storage.getCheckIns())
    setReflections(storage.getReflections())
  }

  // Refresh function for when data changes
  const refreshData = () => {
    loadAllData()
  }

  // Calculate current month spending
  const getCurrentMonthExpenses = () => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date)
      return expenseDate.getMonth() === currentMonth && 
             expenseDate.getFullYear() === currentYear
    })
  }

  // Calculate totals
  const totalFixedExpenses = fixedExpenses.reduce((sum, e) => sum + (e.amount || 0), 0)
  const currentMonthVariableExpenses = getCurrentMonthExpenses().reduce(
    (sum, exp) => sum + (parseFloat(exp.amount) || 0), 
    0
  )
  const totalSpent = totalFixedExpenses + currentMonthVariableExpenses
  const remainingBudget = monthlyBudget - totalSpent
  const percentUsed = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0

  // Get last 7 days of spending for recent pattern
  const getRecentSpendingLevel = () => {
    const last7Days = []
    const today = new Date()
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      const dayExpenses = expenses.filter(e => {
        const expenseDate = new Date(e.date)
        expenseDate.setHours(0, 0, 0, 0)
        return expenseDate.getTime() === date.getTime()
      })
      
      const total = dayExpenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0)
      last7Days.push(total)
    }
    
    const weekTotal = last7Days.reduce((sum, d) => sum + d, 0)
    const dailyAvg = weekTotal / 7
    
    // Categorize spending level
    if (dailyAvg < 20) return 'light'
    if (dailyAvg < 50) return 'moderate'
    return 'heavy'
  }

  const value = {
    // Raw data
    expenses,
    fixedExpenses,
    monthlyBudget,
    checkIns,
    reflections,
    
    // Calculated values
    totalFixedExpenses,
    currentMonthVariableExpenses,
    totalSpent,
    remainingBudget,
    percentUsed,
    
    // Methods
    refreshData,
    getCurrentMonthExpenses,
    getRecentSpendingLevel,
  }

  return (
    <FinanceContext.Provider value={value}>
      {children}
    </FinanceContext.Provider>
  )
}

export const useFinance = () => {
  const context = useContext(FinanceContext)
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider')
  }
  return context
}

