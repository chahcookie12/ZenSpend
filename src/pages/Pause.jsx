import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { storage } from '../utils/storage'

const Pause = () => {
  const [step, setStep] = useState(0)
  const [responses, setResponses] = useState({})
  const [decision, setDecision] = useState(null)
  const [itemName, setItemName] = useState('')

  const steps = [
    {
      id: 'item',
      question: "What are you thinking about?",
      type: 'text',
      placeholder: 'Type the item or experience...',
    },
    {
      id: 'need',
      question: "Is this a need or a want?",
      type: 'choice',
      options: ['Need', 'Want', 'Not sure'],
    },
    {
      id: 'feeling',
      question: "How does this feel right now?",
      type: 'choice',
      options: ['Exciting', 'Necessary', 'Uncertain', 'Impulsive', 'Peaceful'],
    },
    {
      id: 'emotion',
      question: "What emotion is present?",
      type: 'choice',
      options: ['Joy', 'Stress', 'Fear', 'Hope', 'Pressure', 'Calm'],
    },
    {
      id: 'wait',
      question: "Could this wait a day?",
      type: 'choice',
      options: ['Yes', 'No', 'Maybe'],
    },
  ]

  const handleResponse = (value) => {
    const currentStep = steps[step]
    setResponses({ ...responses, [currentStep.id]: value })
    
    if (currentStep.id === 'item') {
      setItemName(value)
    }

    if (step < steps.length - 1) {
      setTimeout(() => setStep(step + 1), 300)
    } else {
      setTimeout(() => setStep(step + 1), 300)
    }
  }

  const handleDecision = (choice) => {
    setDecision(choice)
    
    // Save reflection
    storage.saveReflection({
      item: itemName,
      responses,
      decision: choice,
    })

    // Add to expenses if purchased
    if (choice === 'bought') {
      // Will prompt for amount on Expenses page
    }

    // Reset after delay
    setTimeout(() => {
      setStep(0)
      setResponses({})
      setDecision(null)
      setItemName('')
    }, 3000)
  }

  const handleReset = () => {
    setStep(0)
    setResponses({})
    setDecision(null)
    setItemName('')
  }

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
              {decision === 'bought' ? 'Noted' : 'Well done'}
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

  if (step === steps.length) {
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

  const currentStep = steps[step]

  return (
    <div className="h-full flex flex-col">
      {/* Progress */}
      <div className="px-6 pt-6">
        <div className="flex gap-1 max-w-md mx-auto">
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                idx <= step ? 'bg-sage-400' : 'bg-sage-100'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-md space-y-12"
          >
            <h2 className="text-3xl text-sage-700 font-light text-center">
              {currentStep.question}
            </h2>

            {currentStep.type === 'text' && (
              <div className="space-y-4">
                <input
                  type="text"
                  value={responses[currentStep.id] || ''}
                  onChange={(e) => setResponses({ ...responses, [currentStep.id]: e.target.value })}
                  placeholder={currentStep.placeholder}
                  className="w-full bg-cream-100 text-sage-700 text-lg rounded-3xl py-6 px-8 focus:outline-none focus:ring-2 focus:ring-sage-300 transition-all"
                  autoFocus
                />
                <button
                  onClick={() => handleResponse(responses[currentStep.id] || '')}
                  disabled={!responses[currentStep.id]?.trim()}
                  className="w-full bg-sage-500 hover:bg-sage-600 text-white rounded-3xl py-6 text-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Continue
                </button>
              </div>
            )}

            {currentStep.type === 'choice' && (
              <div className="space-y-3">
                {currentStep.options.map((option) => (
                  <motion.button
                    key={option}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleResponse(option)}
                    className="w-full bg-cream-100 hover:bg-sage-100 text-sage-700 rounded-3xl py-6 px-8 text-lg transition-colors"
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            )}
          </motion.div>
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

