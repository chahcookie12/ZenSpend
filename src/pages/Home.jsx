import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { storage } from '../utils/storage'
import { useAuth } from '../context/AuthContext'

const Home = ({ onStartBreathing }) => {
  const navigate = useNavigate()
  const { signOut } = useAuth()

  const handleLogout = () => {
    signOut()
    navigate('/signin')
  }
  const [mood, setMood] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [monthlyBudgetAmount, setMonthlyBudgetAmount] = useState(0)

  useEffect(() => {
    setExpenses(storage.getExpenses())
    const budget = storage.getMonthlyBudget()
    setMonthlyBudgetAmount(budget)
  }, [])

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

  // Get fixed expenses and add to total
  const [fixedExpenses, setFixedExpenses] = useState([])
  
  useEffect(() => {
    const fixed = storage.getFixedExpenses()
    setFixedExpenses(fixed)
  }, [])

  const totalFixedExpenses = fixedExpenses.reduce((sum, e) => sum + (e.amount || 0), 0)
  const currentMonthVariableExpenses = getCurrentMonthExpenses().reduce(
    (sum, exp) => sum + (parseFloat(exp.amount) || 0), 
    0
  )
  const totalSpent = totalFixedExpenses + currentMonthVariableExpenses

  const remaining = monthlyBudgetAmount - totalSpent
  const percentUsed = monthlyBudgetAmount > 0 ? (totalSpent / monthlyBudgetAmount) * 100 : 0

  const getReflectiveMessage = () => {
    if (monthlyBudgetAmount === 0) {
      return "Set up your monthly flow to see your progress"
    }
    if (percentUsed < 25) {
      return "Most of your budget is still untouched"
    }
    if (percentUsed < 50) {
      return `You've used ${Math.round(percentUsed)}% of what you planned for this month`
    }
    if (percentUsed < 75) {
      return "This month is halfway through financially"
    }
    if (percentUsed < 100) {
      return `You've used ${Math.round(percentUsed)}% of your monthly flow`
    }
    return "You've reached your planned amount for this month"
  }

  const reflectiveMessage = getReflectiveMessage()

  const handleMoodSelect = (selectedMood) => {
    setMood(selectedMood)
    storage.saveCheckIn({ mood: selectedMood })
  }

  const moods = [
    { emoji: '😌', label: 'Calm' },
    { emoji: '😊', label: 'Good' },
    { emoji: '😐', label: 'Neutral' },
    { emoji: '😟', label: 'Worried' },
    { emoji: '😓', label: 'Stressed' },
  ]

  return (
    <div className="h-full overflow-y-auto pb-6">
      <div className="max-w-md mx-auto px-6 py-8 space-y-10">
        {/* Welcome */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl text-sage-700 font-light">
                ZenSpend
              </h1>
              <p className="text-sage-500 text-base mt-2">
                How are you feeling today?
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="text-sage-400 hover:text-sage-600 text-sm transition-colors mt-1"
            >
              Sign out
            </button>
          </div>
        </motion.div>

        {/* Mood Check-in */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-cream-100 rounded-3xl p-6 space-y-4"
        >
          <div className="flex justify-around">
            {moods.map((m) => (
              <button
                key={m.label}
                onClick={() => handleMoodSelect(m.label)}
                className={`flex flex-col items-center gap-2 transition-all ${
                  mood === m.label 
                    ? 'scale-110' 
                    : 'opacity-60 hover:opacity-100'
                }`}
              >
                <span className="text-4xl">{m.emoji}</span>
                <span className="text-xs text-sage-600">{m.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Breathing Exercise */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={onStartBreathing}
          className="w-full bg-sage-100 hover:bg-sage-200 rounded-3xl p-8 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div className="text-left">
              <h3 className="text-xl text-sage-700 font-light mb-2">
                Take a moment
              </h3>
              <p className="text-sage-500 text-sm">
                45-second breathing exercise
              </p>
            </div>
            <span className="text-4xl">◉</span>
          </div>
        </motion.button>

        {/* Spending Reflection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-cream-100 rounded-3xl p-8 space-y-6"
        >
          <div>
            <h3 className="text-xl text-sage-700 font-light mb-3">
              This month's flow
            </h3>
            <p className="text-sage-600 text-base leading-relaxed">
              {reflectiveMessage}
            </p>
          </div>

          {monthlyBudgetAmount > 0 && (
            <>
              <div className="space-y-3">
                <div className="h-2 bg-sage-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(percentUsed, 100)}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-sage-400 rounded-full"
                  />
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-sage-600">
                    ${totalSpent.toFixed(0)} used
                  </span>
                  <span className="text-sage-500">
                    ${monthlyBudgetAmount.toFixed(0)} planned
                  </span>
                </div>
              </div>

              {remaining > 0 && (
                <div className="pt-4 border-t border-sage-100">
                  <p className="text-sage-600 text-base">
                    Still available
                  </p>
                  <p className="text-3xl text-sage-700 font-light mt-1">
                    ${remaining.toFixed(0)}
                  </p>
                </div>
              )}
            </>
          )}
        </motion.div>

        {/* Quick Reflection Prompt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center space-y-2 py-4"
        >
          <p className="text-sage-500 text-sm italic">
            "You're allowed to pause."
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Home

