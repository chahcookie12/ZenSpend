import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { storage } from '../utils/storage'
import { formatCurrency } from '../utils/currency'

const Insights = () => {
  const [reflections, setReflections] = useState([])
  const [checkIns, setCheckIns] = useState([])
  const [expenses, setExpenses] = useState([])
  const [fixedExpenses, setFixedExpenses] = useState([])
  const [monthlyBudget, setMonthlyBudget] = useState(0)
  const [selectedMonth, setSelectedMonth] = useState(new Date())

  useEffect(() => {
    setReflections(storage.getReflections())
    setCheckIns(storage.getCheckIns())
    setExpenses(storage.getExpenses())
    setFixedExpenses(storage.getFixedExpenses())
    setMonthlyBudget(storage.getMonthlyBudget())
  }, [])

  // Get last 7 days of spending
  const getWeeklySpending = () => {
    const days = []
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
      
      days.push({
        date,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        amount: total,
      })
    }
    
    return days
  }

  // Get weeks within the selected month
  const getMonthlySpending = (month) => {
    const weeks = []
    const year = month.getFullYear()
    const monthIndex = month.getMonth()
    
    // Get first and last day of the month
    const firstDay = new Date(year, monthIndex, 1)
    const lastDay = new Date(year, monthIndex + 1, 0)
    
    // Calculate number of weeks in this month
    const firstDayOfWeek = firstDay.getDay() // 0 = Sunday
    const daysInMonth = lastDay.getDate()
    const totalDays = daysInMonth + firstDayOfWeek
    const numberOfWeeks = Math.ceil(totalDays / 7)
    
    // Group expenses by week
    for (let weekNum = 0; weekNum < numberOfWeeks; weekNum++) {
      // Calculate week start (Sunday)
      const weekStart = new Date(year, monthIndex, 1 - firstDayOfWeek + (weekNum * 7))
      weekStart.setHours(0, 0, 0, 0)
      
      // Calculate week end (Saturday)
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekEnd.getDate() + 6)
      weekEnd.setHours(23, 59, 59, 999)
      
      // Filter expenses within this week AND within the month
      const weekExpenses = expenses.filter(e => {
        const expenseDate = new Date(e.date)
        return expenseDate >= weekStart && 
               expenseDate <= weekEnd &&
               expenseDate.getMonth() === monthIndex &&
               expenseDate.getFullYear() === year
      })
      
      const total = weekExpenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0)
      
      weeks.push({
        label: `Week ${weekNum + 1}`,
        amount: total,
      })
    }
    
    return weeks
  }

  const weeklyData = getWeeklySpending()
  const monthlyData = getMonthlySpending(selectedMonth)
  const maxDaily = Math.max(...weeklyData.map(d => d.amount), 1)
  const maxMonthly = Math.max(...monthlyData.map(w => w.amount), 1)

  // Calculate wellbeing indicator
  const getWellbeingState = () => {
    if (monthlyBudget === 0) return null
    
    const totalFixed = fixedExpenses.reduce((sum, e) => sum + (e.amount || 0), 0)
    const thisMonth = expenses.filter(e => {
      const date = new Date(e.date)
      const now = new Date()
      return date.getMonth() === now.getMonth() && 
             date.getFullYear() === now.getFullYear()
    })
    const monthlyVariable = thisMonth.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0)
    const totalSpent = totalFixed + monthlyVariable
    const percentUsed = (totalSpent / monthlyBudget) * 100
    
    // Check for spending spikes
    const lastWeek = weeklyData.slice(-7)
    const weekAvg = lastWeek.reduce((sum, d) => sum + d.amount, 0) / 7
    const lastTwoDays = lastWeek.slice(-2).reduce((sum, d) => sum + d.amount, 0) / 2
    const hasSpike = lastTwoDays > weekAvg * 2
    
    if (percentUsed > 90 || hasSpike) {
      return {
        state: 'Heavy',
        message: 'Money feels light this week.',
        subtext: 'Would you like to pause and reflect?',
      }
    } else if (percentUsed > 70) {
      return {
        state: 'A bit tense',
        message: 'Things are getting a bit tight.',
        subtext: 'That\'s okay. You\'re noticing.',
      }
    } else {
      return {
        state: 'Calm',
        message: 'Money feels light right now.',
        subtext: 'There\'s space to breathe.',
      }
    }
  }

  // Check for unusual spending
  const getUnusualSpendingAwareness = () => {
    if (expenses.length < 14) return null // Need some history
    
    const thisWeek = weeklyData.slice(-7).reduce((sum, d) => sum + d.amount, 0)
    const previousWeeks = monthlyWeeks.slice(0, 3).map(w => w.amount)
    const avgPreviousWeek = previousWeeks.reduce((sum, w) => sum + w, 0) / previousWeeks.length
    
    if (thisWeek > avgPreviousWeek * 1.5 && thisWeek > 50) {
      return {
        message: "You've spent a bit more than usual this week.",
        subtext: "No judgment. Just noticing the pattern.",
      }
    }
    
    return null
  }

  const wellbeing = getWellbeingState()
  const unusualSpending = getUnusualSpendingAwareness()

  const getRecentMood = () => {
    if (checkIns.length === 0) return null
    const recent = checkIns.slice(-7)
    const moodCounts = {}
    
    recent.forEach(checkIn => {
      moodCounts[checkIn.mood] = (moodCounts[checkIn.mood] || 0) + 1
    })
    
    const mostCommon = Object.entries(moodCounts)
      .sort((a, b) => b[1] - a[1])[0]
    
    return mostCommon ? mostCommon[0] : null
  }

  const getPauseInsight = () => {
    const recentReflections = reflections.slice(-10)
    const decisions = {
      bought: recentReflections.filter(r => r.decision === 'bought').length,
      skipped: recentReflections.filter(r => r.decision === 'skipped').length,
    }
    
    if (decisions.skipped > decisions.bought) {
      return {
        text: "You've been giving yourself space to pause.",
        subtext: "That takes courage.",
      }
    } else if (decisions.bought > 0) {
      return {
        text: "You've been making mindful choices.",
        subtext: "Each decision is yours to make.",
      }
    }
    
    return {
      text: "Take your time with decisions.",
      subtext: "There's no rush.",
    }
  }

  return (
    <div className="h-full overflow-y-auto pb-6">
      <div className="max-w-md mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-3xl text-sage-700 font-light">
            Insights
          </h1>
          <p className="text-sage-500 text-base">
            Gentle observations from your journey
          </p>
        </motion.div>

        {/* Wellbeing Indicator */}
        {wellbeing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-sage-50 rounded-3xl p-8 space-y-3"
          >
            <h3 className="text-xs text-sage-600 font-medium uppercase tracking-wide">
              How things feel
            </h3>
            <p className="text-2xl text-sage-700 font-light leading-relaxed">
              {wellbeing.message}
            </p>
            <p className="text-sage-600 text-sm italic">
              {wellbeing.subtext}
            </p>
          </motion.div>
        )}

        {/* Unusual Spending Awareness */}
        {unusualSpending && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-cream-100 rounded-3xl p-8 space-y-3"
          >
            <h3 className="text-xs text-sage-600 font-medium uppercase tracking-wide">
              A gentle notice
            </h3>
            <p className="text-xl text-sage-700 font-light leading-relaxed">
              {unusualSpending.message}
            </p>
            <p className="text-sage-600 text-sm italic">
              {unusualSpending.subtext}
            </p>
          </motion.div>
        )}

        {/* Weekly Spending Trend */}
        {expenses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-cream-100 rounded-3xl p-8 space-y-6"
          >
            <div>
              <h3 className="text-xs text-sage-600 font-medium uppercase tracking-wide">
                This week's rhythm
              </h3>
              <p className="text-sage-500 text-sm mt-1">
                Daily spending pattern
              </p>
            </div>
            
            <div className="space-y-3">
              {weeklyData.map((day, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-sage-600">
                    <span>{day.day}</span>
                    <span className="font-light">
                      {day.amount > 0 ? formatCurrency(day.amount) : '—'}
                    </span>
                  </div>
                  <div className="h-2 bg-sage-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sage-400 rounded-full transition-all duration-500"
                      style={{ width: `${(day.amount / maxDaily) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Monthly Spending Rhythm */}
        {expenses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-cream-100 rounded-3xl p-8 space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs text-sage-600 font-medium uppercase tracking-wide">
                  This month's rhythm
                </h3>
                <p className="text-sage-500 text-sm mt-1">
                  Weekly spending pattern
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const newMonth = new Date(selectedMonth)
                    newMonth.setMonth(newMonth.getMonth() - 1)
                    setSelectedMonth(newMonth)
                  }}
                  className="text-sage-500 hover:text-sage-700 transition-colors"
                  aria-label="Previous month"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-sage-600 text-sm font-light min-w-[80px] text-center">
                  {selectedMonth.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </span>
                <button
                  onClick={() => {
                    const newMonth = new Date(selectedMonth)
                    newMonth.setMonth(newMonth.getMonth() + 1)
                    setSelectedMonth(newMonth)
                  }}
                  className="text-sage-500 hover:text-sage-700 transition-colors"
                  aria-label="Next month"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              {monthlyData.map((week, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-sage-600">
                    <span>{week.label}</span>
                    <span className="font-light">
                      {week.amount > 0 ? formatCurrency(week.amount) : '—'}
                    </span>
                  </div>
                  <div className="h-2 bg-sage-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-sage-400 rounded-full transition-all duration-500"
                      style={{ width: `${(week.amount / maxMonthly) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Pause Practice Insight */}
        {reflections.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-olive-light/30 rounded-3xl p-8 space-y-3"
          >
            <h3 className="text-xs text-sage-600 font-medium uppercase tracking-wide">
              Your pause practice
            </h3>
            <p className="text-xl text-sage-700 font-light leading-relaxed">
              {getPauseInsight().text}
            </p>
            <p className="text-sage-600 text-sm italic">
              {getPauseInsight().subtext}
            </p>
          </motion.div>
        )}

        {/* Mood Insight */}
        {checkIns.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="bg-sage-100 rounded-3xl p-8 space-y-3"
          >
            <h3 className="text-xs text-sage-600 font-medium uppercase tracking-wide">
              How you've been feeling
            </h3>
            <p className="text-xl text-sage-700 font-light leading-relaxed">
              {getRecentMood() 
                ? `Mostly ${getRecentMood().toLowerCase()} lately.`
                : 'Start checking in to see patterns.'}
            </p>
          </motion.div>
        )}

        {/* Recent Reflections */}
        {reflections.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h2 className="text-lg text-sage-700 font-light">
              Recent reflections
            </h2>
            <div className="space-y-2">
              {reflections.slice(-5).reverse().map((reflection) => (
                <div
                  key={reflection.id}
                  className="bg-cream-100 rounded-2xl p-5 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-sage-700 text-sm font-light">
                      {reflection.item}
                    </p>
                    <span className="text-xl">
                      {reflection.decision === 'bought' ? '✓' : '○'}
                    </span>
                  </div>
                  <p className="text-sage-500 text-xs">
                    {new Date(reflection.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {reflections.length === 0 && checkIns.length === 0 && expenses.length === 0 && (
          <div className="text-center py-16 space-y-4">
            <span className="text-6xl">◯</span>
            <div className="space-y-2">
              <p className="text-sage-500 text-lg">
                Your insights will appear here
              </p>
              <p className="text-sage-400 text-sm">
                Start by adding expenses or checking in
              </p>
            </div>
          </div>
        )}

        {/* Gentle Reminder */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center pt-8 space-y-2"
        >
          <p className="text-sage-500 text-sm italic">
            "Progress isn't linear."
          </p>
          <p className="text-sage-400 text-xs">
            These patterns are just observations,<br />not judgments.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default Insights
