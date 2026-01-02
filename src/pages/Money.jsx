import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { storage } from '../utils/storage'
import { formatCurrency } from '../utils/currency'

const Money = () => {
  // Budget and Fixed Expenses State
  const [monthlyBudget, setMonthlyBudget] = useState('')
  const [fixedExpenses, setFixedExpenses] = useState([])
  const [editingFixedId, setEditingFixedId] = useState(null)
  const [editFixedName, setEditFixedName] = useState('')
  const [editFixedAmount, setEditFixedAmount] = useState('')
  const [customName, setCustomName] = useState('')
  const [customAmount, setCustomAmount] = useState('')

  // Regular Expenses State
  const [expenses, setExpenses] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [newExpense, setNewExpense] = useState({ description: '', amount: '' })

  const commonExpenses = [
    { name: 'Rent', icon: '🏠' },
    { name: 'Electricity', icon: '⚡' },
    { name: 'Water', icon: '💧' },
    { name: 'Internet', icon: '📡' },
    { name: 'Transportation', icon: '🚗' },
  ]

  useEffect(() => {
    // Load budget and fixed expenses
    const savedBudget = storage.getMonthlyBudget()
    const savedFixedExpenses = storage.getFixedExpenses()
    
    if (savedBudget > 0) {
      setMonthlyBudget(savedBudget.toString())
    }
    setFixedExpenses(savedFixedExpenses)

    // Load regular expenses
    loadExpenses()
  }, [])

  const loadExpenses = () => {
    const allExpenses = storage.getExpenses()
    allExpenses.sort((a, b) => new Date(b.date) - new Date(a.date))
    setExpenses(allExpenses)
  }

  // Budget Functions
  const handleBudgetSave = () => {
    const amount = parseFloat(monthlyBudget)
    if (amount > 0) {
      storage.saveMonthlyBudget(amount)
    }
  }

  // Fixed Expenses Functions
  const addFixedExpense = (name) => {
    const exists = fixedExpenses.find(e => e.name === name)
    if (exists) return

    const newExpense = storage.saveFixedExpense({ name, amount: 0 })
    setFixedExpenses([...fixedExpenses, newExpense])
  }

  const addCustomFixedExpense = () => {
    if (!customName.trim() || !customAmount) return

    const amount = parseFloat(customAmount)
    if (amount <= 0) return

    const newExpense = storage.saveFixedExpense({
      name: customName.trim(),
      amount,
    })
    setFixedExpenses([...fixedExpenses, newExpense])
    setCustomName('')
    setCustomAmount('')
  }

  const startEditingFixed = (expense) => {
    setEditingFixedId(expense.id)
    setEditFixedName(expense.name)
    setEditFixedAmount(expense.amount.toString())
  }

  const saveFixedEdit = () => {
    const amount = parseFloat(editFixedAmount)
    if (amount >= 0 && editFixedName.trim()) {
      storage.updateFixedExpense(editingFixedId, {
        name: editFixedName.trim(),
        amount,
      })
      setFixedExpenses(
        fixedExpenses.map((e) =>
          e.id === editingFixedId
            ? { ...e, name: editFixedName.trim(), amount }
            : e
        )
      )
    }
    setEditingFixedId(null)
  }

  const deleteFixedExpense = (id) => {
    storage.deleteFixedExpense(id)
    setFixedExpenses(fixedExpenses.filter((e) => e.id !== id))
  }

  // Regular Expenses Functions
  const handleAddExpense = () => {
    if (!newExpense.description.trim() || !newExpense.amount) return

    storage.saveExpense({
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
    })

    setNewExpense({ description: '', amount: '' })
    setShowAddForm(false)
    loadExpenses()
  }

  const handleDeleteExpense = (id) => {
    storage.deleteExpense(id)
    loadExpenses()
  }

  const groupExpensesByDate = () => {
    const groups = {}
    
    expenses.forEach(expense => {
      const date = new Date(expense.date)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      
      let label
      if (date.toDateString() === today.toDateString()) {
        label = 'Today'
      } else if (date.toDateString() === yesterday.toDateString()) {
        label = 'Yesterday'
      } else {
        label = date.toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric' 
        })
      }
      
      if (!groups[label]) groups[label] = []
      groups[label].push(expense)
    })
    
    return groups
  }

  const groupedExpenses = groupExpensesByDate()

  // Calculations
  const totalFixed = fixedExpenses.reduce((sum, e) => sum + (e.amount || 0), 0)
  const budget = parseFloat(monthlyBudget) || 0
  
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

  const currentMonthExpenses = getCurrentMonthExpenses().reduce(
    (sum, exp) => sum + (parseFloat(exp.amount) || 0), 
    0
  )
  
  const totalSpent = totalFixed + currentMonthExpenses
  const remaining = budget - totalSpent

  return (
    <div className="h-full overflow-y-auto pb-6">
      <div className="max-w-md mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-3xl text-sage-700 font-light">Money</h1>
          <p className="text-sage-500 text-base">
            Your budget, fixed costs, and spending
          </p>
        </motion.div>

        {/* Monthly Budget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-cream-100 rounded-3xl p-6 space-y-4"
        >
          <h2 className="text-xl text-sage-700 font-light">Monthly flow</h2>
          <div className="space-y-2">
            <label className="block text-sage-600 text-sm ml-1">
              What would you like to spend this month? (MAD)
            </label>
            <input
              type="number"
              value={monthlyBudget}
              onChange={(e) => setMonthlyBudget(e.target.value)}
              onBlur={handleBudgetSave}
              placeholder="0"
              className="w-full px-5 py-4 bg-white text-sage-700 rounded-2xl text-base
                       focus:outline-none focus:ring-2 focus:ring-sage-300 transition-all"
            />
          </div>
        </motion.div>

        {/* Fixed Expenses Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <div>
            <h2 className="text-xl text-sage-700 font-light">Fixed expenses</h2>
            <p className="text-sage-500 text-sm mt-1">
              What stays the same each month
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {commonExpenses.map((expense) => {
              const isAdded = fixedExpenses.some((e) => e.name === expense.name)
              return (
                <button
                  key={expense.name}
                  onClick={() => addFixedExpense(expense.name)}
                  disabled={isAdded}
                  className={`px-4 py-3 rounded-2xl text-sm transition-all ${
                    isAdded
                      ? 'bg-sage-100 text-sage-400 cursor-not-allowed'
                      : 'bg-cream-100 text-sage-600 hover:bg-sage-100 hover:text-sage-700'
                  }`}
                >
                  <span className="mr-2">{expense.icon}</span>
                  {expense.name}
                </button>
              )
            })}
          </div>

          {/* Fixed Expenses List */}
          {fixedExpenses.length > 0 && (
            <div className="space-y-2 mt-4">
              {fixedExpenses.map((expense) => (
                <div
                  key={expense.id}
                  className="bg-cream-100 rounded-2xl p-4"
                >
                  {editingFixedId === expense.id ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editFixedName}
                        onChange={(e) => setEditFixedName(e.target.value)}
                        className="w-full px-4 py-2 bg-white text-sage-700 rounded-xl text-sm
                                 focus:outline-none focus:ring-2 focus:ring-sage-300"
                      />
                      <div className="flex gap-2">
                        <div className="flex-1">
                          <input
                            type="number"
                            value={editFixedAmount}
                            onChange={(e) => setEditFixedAmount(e.target.value)}
                            placeholder="Amount (MAD)"
                            className="w-full px-3 py-2 bg-white text-sage-700 rounded-xl text-sm
                                     focus:outline-none focus:ring-2 focus:ring-sage-300"
                          />
                        </div>
                        <button
                          onClick={saveFixedEdit}
                          className="px-4 py-2 bg-sage-400 text-white rounded-xl text-sm
                                   hover:bg-sage-500 transition-colors"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sage-700 font-light">{expense.name}</p>
                        <p className="text-sage-600 text-sm mt-1">
                          {formatCurrency(expense.amount, true)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditingFixed(expense)}
                          className="px-3 py-1.5 text-sage-600 hover:text-sage-700 text-sm
                                   hover:bg-sage-50 rounded-lg transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteFixedExpense(expense.id)}
                          className="px-3 py-1.5 text-sage-500 hover:text-sage-600 text-sm
                                   hover:bg-sage-50 rounded-lg transition-all"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add Custom Fixed Expense */}
          <div className="bg-cream-100 rounded-2xl p-4 space-y-3">
            <p className="text-sage-600 text-sm">Add your own</p>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Name (e.g., Phone bill)"
              className="w-full px-4 py-3 bg-white text-sage-700 rounded-xl text-sm
                       focus:outline-none focus:ring-2 focus:ring-sage-300 transition-all"
            />
            <div className="flex gap-2">
              <div className="flex-1">
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Amount (MAD)"
                  className="w-full px-3 py-3 bg-white text-sage-700 rounded-xl text-sm
                           focus:outline-none focus:ring-2 focus:ring-sage-300 transition-all"
                />
              </div>
              <button
                onClick={addCustomFixedExpense}
                className="px-5 py-3 bg-sage-400 hover:bg-sage-500 text-white rounded-xl text-sm
                         transition-colors active:scale-[0.98] transform"
              >
                Add
              </button>
            </div>
          </div>
        </motion.div>

        {/* Variable Expenses Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl text-sage-700 font-light">This month's expenses</h2>
              <p className="text-sage-500 text-sm mt-1">
                {expenses.length} {expenses.length === 1 ? 'item' : 'items'}
              </p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="w-12 h-12 bg-sage-400 hover:bg-sage-500 text-white rounded-full text-xl flex items-center justify-center transition-colors"
            >
              +
            </button>
          </div>

          {/* Add Expense Form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-cream-100 rounded-2xl p-5 space-y-3 overflow-hidden"
              >
                <input
                  type="text"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  placeholder="What did you buy?"
                  className="w-full bg-white text-sage-700 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-sage-300"
                  autoFocus
                />
                <input
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  placeholder="Amount (MAD)"
                  className="w-full px-4 bg-white text-sage-700 rounded-xl py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sage-300"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddExpense}
                    disabled={!newExpense.description.trim() || !newExpense.amount}
                    className="flex-1 bg-sage-400 hover:bg-sage-500 text-white rounded-xl py-3 text-sm disabled:opacity-30 transition-colors"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false)
                      setNewExpense({ description: '', amount: '' })
                    }}
                    className="flex-1 bg-white hover:bg-cream-200 text-sage-700 rounded-xl py-3 text-sm transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Expenses List */}
          {expenses.length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedExpenses).map(([date, items]) => (
                <div key={date} className="space-y-2">
                  <h3 className="text-xs text-sage-500 font-medium uppercase tracking-wide ml-1">
                    {date}
                  </h3>
                  <div className="space-y-2">
                    {items.map((expense) => (
                      <motion.div
                        key={expense.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="bg-cream-100 rounded-2xl p-4 flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <p className="text-sage-700 text-sm">
                            {expense.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-sage-700 font-light">
                            {formatCurrency(expense.amount, true)}
                          </p>
                          <button
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="text-sage-400 hover:text-sage-600 text-xl w-6 h-6 flex items-center justify-center"
                          >
                            ×
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-cream-100 rounded-2xl">
              <p className="text-sage-400 text-sm">
                No expenses this month yet
              </p>
            </div>
          )}
        </motion.div>

        {/* Summary */}
        {budget > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-sage-50 rounded-3xl p-6 space-y-4"
          >
            <h3 className="text-lg text-sage-700 font-light">This month</h3>
            <div className="space-y-2 text-sage-600 text-sm">
              <div className="flex justify-between">
                <span>Monthly flow</span>
                <span className="font-light">{formatCurrency(budget, true)}</span>
              </div>
              <div className="flex justify-between">
                <span>Fixed expenses</span>
                <span className="font-light">{formatCurrency(totalFixed, true)}</span>
              </div>
              <div className="flex justify-between">
                <span>Variable expenses</span>
                <span className="font-light">{formatCurrency(currentMonthExpenses, true)}</span>
              </div>
              <div className="h-px bg-sage-200 my-3" />
              <div className="flex justify-between text-sage-700 text-base">
                <span>Space to move</span>
                <span className="font-light">{formatCurrency(remaining, true)}</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Money

