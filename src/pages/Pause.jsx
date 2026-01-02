import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { storage } from '../utils/storage'
import ShortBreathing from '../components/ShortBreathing'

const Pause = () => {
  // State management
  const [step, setStep] = useState(0) // Single source of truth
  const [itemName, setItemName] = useState('')
  const [itemPrice, setItemPrice] = useState('')
  const [responses, setResponses] = useState({})
  const [decision, setDecision] = useState(null)

  // Define steps explicitly
  const STEPS = {
    PRICE_INPUT: 0,
    REFLECTION_1: 1,
    REFLECTION_2: 2,
    BREATHING: 3,
    DECISION: 4,
  }

  const reflectionQuestions = [
    {
      id: 'need',
      question: "Is this a need or a want?",
      options: ['Need', 'Want', 'Not sure'],
    },
    {
      id: 'emotion',
      question: "What emotion is present?",
      options: ['Joy', 'Stress', 'Fear', 'Hope', 'Pressure', 'Calm'],
    },
  ]

  // Handlers
  const handlePriceSubmit = () => {
    if (!itemPrice.trim()) return
    setStep(STEPS.REFLECTION_1) // Move to first reflection
  }

  const handleReflectionResponse = (questionId, value) => {
    setResponses({ ...responses, [questionId]: value })
    
    // Determine next step
    if (step === STEPS.REFLECTION_1) {
      setTimeout(() => setStep(STEPS.REFLECTION_2), 300)
    } else if (step === STEPS.REFLECTION_2) {
      setTimeout(() => setStep(STEPS.BREATHING), 300)
    }
  }

  const handleBreathingComplete = () => {
    setStep(STEPS.DECISION) // Move to final decision
  }

  const handleDecision = (choice) => {
    setDecision(choice)
    
    // Save reflection
    storage.saveReflection({
      item: itemName || 'Purchase',
      price: parseFloat(itemPrice) || 0,
      responses,
      decision: choice,
    })

    // Add to expenses if purchased
    if (choice === 'bought') {
      storage.saveExpense({
        description: itemName || 'Reflected purchase',
        amount: parseFloat(itemPrice) || 0,
        fromReflection: true,
      })
    }

    // Auto-reset after showing confirmation
    setTimeout(() => {
      setStep(STEPS.PRICE_INPUT)
      setItemName('')
      setItemPrice('')
      setResponses({})
      setDecision(null)
    }, 3000)
  }

  const handleReset = () => {
    setStep(STEPS.PRICE_INPUT)
    setItemName('')
    setItemPrice('')
    setResponses({})
    setDecision(null)
  }

  // RENDER: Confirmation screen (after decision)
  if (decision) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full flex items-center justify-center p-8"
      >
        <div className="text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <span className="text-6xl">
              {decision === 'bought' ? '✓' : '○'}
            </span>
          </motion.div>
          <div className="space-y-2">
            <p className="text-2xl text-sage-700 font-light">
              {decision === 'bought' 
                ? 'Thanks for checking in with yourself.' 
                : 'That pause mattered.'}
            </p>
            <p className="text-sage-500 text-base">
              {decision === 'bought' 
                ? 'You made a choice.' 
                : 'You gave yourself space.'}
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  // RENDER: Breathing exercise
  if (step === STEPS.BREATHING) {
    return <ShortBreathing onComplete={handleBreathingComplete} />
  }

  // RENDER: Final decision
  if (step === STEPS.DECISION) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full flex flex-col items-center justify-between p-8 py-16"
      >
        <div className="flex-1 flex flex-col items-center justify-center space-y-12">
          <div className="text-center space-y-4 max-w-sm">
            <h2 className="text-3xl text-sage-700 font-light">
              What feels right?
            </h2>
            <p className="text-sage-500 text-base">
              There's no wrong answer.
            </p>
          </div>

          <div className="space-y-4 w-full max-w-xs">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDecision('bought')}
              className="w-full bg-sage-500 hover:bg-sage-600 text-white rounded-3xl py-6 px-8 text-lg transition-colors"
            >
              I decided to buy
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleDecision('skipped')}
              className="w-full bg-cream-100 hover:bg-cream-200 text-sage-700 rounded-3xl py-6 px-8 text-lg transition-colors"
            >
              I decided not to buy
            </motion.button>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="text-sage-400 text-sm"
        >
          Start over
        </button>
      </motion.div>
    )
  }

  // RENDER: Price input or Reflection questions
  const totalSteps = 1 + reflectionQuestions.length // Price + reflections
  const progressSteps = Math.min(step + 1, totalSteps)

  return (
    <div className="h-full flex flex-col">
      {/* Progress bar */}
      <div className="px-6 pt-6">
        <div className="flex gap-1 max-w-md mx-auto">
          {[...Array(totalSteps)].map((_, idx) => (
            <div
              key={idx}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                idx < progressSteps ? 'bg-sage-400' : 'bg-sage-100'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <AnimatePresence mode="wait">
          {step === STEPS.PRICE_INPUT && (
            <motion.div
              key="price"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-md space-y-12"
            >
              <h2 className="text-3xl text-sage-700 font-light text-center">
                What do you want to buy?
              </h2>

              <div className="space-y-6">
                <input
                  type="text"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Item name (optional)"
                  className="w-full bg-cream-100 text-sage-700 text-lg rounded-3xl py-6 px-8 focus:outline-none focus:ring-2 focus:ring-sage-300 transition-all"
                  autoFocus
                />
                <div className="space-y-2">
                  <label className="block text-sage-600 text-sm ml-4">
                    Price (MAD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={itemPrice}
                    onChange={(e) => setItemPrice(e.target.value)}
                    placeholder="0"
                    className="w-full px-8 bg-cream-100 text-sage-700 text-2xl rounded-3xl py-6 focus:outline-none focus:ring-2 focus:ring-sage-300 transition-all"
                  />
                </div>
                <button
                  onClick={handlePriceSubmit}
                  disabled={!itemPrice.trim()}
                  className="w-full bg-sage-500 hover:bg-sage-600 text-white rounded-3xl py-6 text-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {(step === STEPS.REFLECTION_1 || step === STEPS.REFLECTION_2) && (
            <motion.div
              key={`reflection-${step}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full max-w-md space-y-12"
            >
              {(() => {
                const questionIndex = step - STEPS.REFLECTION_1
                const question = reflectionQuestions[questionIndex]
                
                return (
                  <>
                    <h2 className="text-3xl text-sage-700 font-light text-center">
                      {question.question}
                    </h2>

                    <div className="space-y-3">
                      {question.options.map((option) => (
                        <motion.button
                          key={option}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleReflectionResponse(question.id, option)}
                          className="w-full bg-cream-100 hover:bg-sage-100 text-sage-700 rounded-3xl py-6 px-8 text-lg transition-colors"
                        >
                          {option}
                        </motion.button>
                      ))}
                    </div>
                  </>
                )
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="pb-8 text-center">
        <button
          onClick={handleReset}
          className="text-sage-400 text-sm"
        >
          Start over
        </button>
      </div>
    </div>
  )
}

export default Pause
