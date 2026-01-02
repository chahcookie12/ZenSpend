import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const BreathingExercise = ({ onComplete }) => {
  const [phase, setPhase] = useState('inhale') // inhale, hold, exhale
  const [countdown, setCountdown] = useState(45)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setTimeout(onComplete, 500)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onComplete])

  useEffect(() => {
    const phaseTimer = setInterval(() => {
      setPhase((current) => {
        if (current === 'inhale') return 'hold'
        if (current === 'hold') return 'exhale'
        return 'inhale'
      })
    }, 4000)

    return () => clearInterval(phaseTimer)
  }, [])

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe in'
      case 'hold':
        return 'Hold'
      case 'exhale':
        return 'Breathe out'
      default:
        return 'Breathe'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-sage-100 to-cream-100 flex flex-col items-center justify-center p-8"
    >
      <button
        onClick={onComplete}
        className="absolute top-6 right-6 text-sage-400 hover:text-sage-600 text-sm"
      >
        Skip
      </button>

      <div className="flex-1 flex flex-col items-center justify-center space-y-12">
        <motion.div
          key={phase}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-3xl text-sage-700 font-light"
        >
          {getPhaseText()}
        </motion.div>

        <div className="relative w-48 h-48 flex items-center justify-center">
          <motion.div
            animate={{
              scale: phase === 'inhale' ? 1.5 : phase === 'exhale' ? 0.7 : 1.2,
            }}
            transition={{
              duration: 4,
              ease: 'easeInOut',
            }}
            className="absolute w-32 h-32 rounded-full bg-sage-300/40 backdrop-blur-sm"
          />
          <motion.div
            animate={{
              scale: phase === 'inhale' ? 1.3 : phase === 'exhale' ? 0.9 : 1.1,
            }}
            transition={{
              duration: 4,
              ease: 'easeInOut',
              delay: 0.1,
            }}
            className="absolute w-24 h-24 rounded-full bg-sage-400/50"
          />
          <motion.div
            animate={{
              scale: phase === 'inhale' ? 1.1 : phase === 'exhale' ? 1.1 : 1,
            }}
            transition={{
              duration: 4,
              ease: 'easeInOut',
              delay: 0.2,
            }}
            className="absolute w-16 h-16 rounded-full bg-sage-500"
          />
        </div>

        <div className="text-sage-500 text-sm">
          {countdown}s remaining
        </div>
      </div>

      <div className="text-center space-y-3 pb-8">
        <p className="text-sage-600 text-base max-w-xs">
          Take your time.
        </p>
        <p className="text-sage-500 text-sm max-w-xs">
          There's no rush.
        </p>
      </div>
    </motion.div>
  )
}

export default BreathingExercise

