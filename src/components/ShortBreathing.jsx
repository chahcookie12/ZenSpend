import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const ShortBreathing = ({ onComplete }) => {
  const [phase, setPhase] = useState('inhale')
  const [countdown, setCountdown] = useState(10)

  // Countdown timer - auto-advance when complete
  useEffect(() => {
    if (countdown <= 0) {
      onComplete()
      return
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown, onComplete])

  // Phase animation (inhale/exhale)
  useEffect(() => {
    const phaseTimer = setInterval(() => {
      setPhase((current) => (current === 'inhale' ? 'exhale' : 'inhale'))
    }, 3000)

    return () => clearInterval(phaseTimer)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="h-full bg-gradient-to-br from-sage-50 to-cream flex flex-col items-center justify-center p-8"
    >
      <div className="flex-1 flex flex-col items-center justify-center space-y-12">
        <motion.div
          key={phase}
          initial={{ opacity: 0.7 }}
          animate={{ opacity: 1 }}
          className="text-2xl text-sage-600 font-light"
        >
          {phase === 'inhale' ? 'Inhale' : 'Exhale'}
        </motion.div>

        <div className="relative w-40 h-40 flex items-center justify-center">
          <motion.div
            animate={{
              scale: phase === 'inhale' ? 1.4 : 0.7,
            }}
            transition={{
              duration: 3,
              ease: 'easeInOut',
            }}
            className="absolute w-32 h-32 rounded-full bg-sage-300/30"
          />
          <motion.div
            animate={{
              scale: phase === 'inhale' ? 1.2 : 0.85,
            }}
            transition={{
              duration: 3,
              ease: 'easeInOut',
              delay: 0.1,
            }}
            className="absolute w-24 h-24 rounded-full bg-sage-400/40"
          />
          <motion.div
            animate={{
              scale: phase === 'inhale' ? 1 : 1,
            }}
            transition={{
              duration: 3,
              ease: 'easeInOut',
              delay: 0.2,
            }}
            className="absolute w-16 h-16 rounded-full bg-sage-500/50"
          />
        </div>

        <div className="text-sage-400 text-sm">
          {countdown}s
        </div>
      </div>

      <div className="text-center space-y-2 pb-8">
        <p className="text-sage-500 text-sm max-w-xs">
          Take your time.
        </p>
      </div>
    </motion.div>
  )
}

export default ShortBreathing

