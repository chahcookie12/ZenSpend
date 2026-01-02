import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

const BreathingExercise = ({ onComplete }) => {
  // Breathing rhythm (medically correct)
  const INHALE_DURATION = 4000 // 4 seconds
  const HOLD_DURATION = 3000    // 3 seconds
  const EXHALE_DURATION = 5000  // 5 seconds
  const CYCLE_DURATION = INHALE_DURATION + HOLD_DURATION + EXHALE_DURATION // 12 seconds
  const TOTAL_DURATION = 45000  // 45 seconds

  const [phase, setPhase] = useState('inhale')
  const [countdown, setCountdown] = useState(45)
  const [phaseProgress, setPhaseProgress] = useState(0)
  const startTimeRef = useRef(Date.now())
  const animationFrameRef = useRef(null)

  useEffect(() => {
    const startTime = Date.now()
    startTimeRef.current = startTime

    const updateState = () => {
      const elapsed = Date.now() - startTime
      
      // Check if exercise is complete
      if (elapsed >= TOTAL_DURATION) {
        setCountdown(0)
        setPhaseProgress(1)
        setTimeout(onComplete, 500)
        return
      }

      // Update countdown (ceiling to show 1 when < 1 second left)
      const remainingSeconds = Math.ceil((TOTAL_DURATION - elapsed) / 1000)
      setCountdown(remainingSeconds)

      // Calculate current phase based on position in cycle
      const positionInCycle = elapsed % CYCLE_DURATION
      
      let currentPhase = 'inhale'
      let progress = 0

      if (positionInCycle < INHALE_DURATION) {
        currentPhase = 'inhale'
        progress = positionInCycle / INHALE_DURATION
      } else if (positionInCycle < INHALE_DURATION + HOLD_DURATION) {
        currentPhase = 'hold'
        progress = (positionInCycle - INHALE_DURATION) / HOLD_DURATION
      } else {
        currentPhase = 'exhale'
        progress = (positionInCycle - INHALE_DURATION - HOLD_DURATION) / EXHALE_DURATION
      }

      setPhase(currentPhase)
      setPhaseProgress(progress)

      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(updateState)
    }

    // Start the animation loop
    animationFrameRef.current = requestAnimationFrame(updateState)

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [onComplete, TOTAL_DURATION, CYCLE_DURATION, INHALE_DURATION, HOLD_DURATION, EXHALE_DURATION])

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

  // Animation configuration per phase
  const getAnimationConfig = () => {
    switch (phase) {
      case 'inhale':
        return {
          scale: 1.5,
          duration: INHALE_DURATION / 1000, // 4 seconds
          ease: 'easeInOut'
        }
      case 'hold':
        return {
          scale: 1.5, // Stay at max size
          duration: 0, // No animation - instant
          ease: 'linear'
        }
      case 'exhale':
        return {
          scale: 0.7,
          duration: EXHALE_DURATION / 1000, // 5 seconds
          ease: 'easeInOut'
        }
      default:
        return {
          scale: 1,
          duration: 0,
          ease: 'linear'
        }
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
          {/* Outer circle */}
          <motion.div
            key={`${phase}-outer`}
            animate={{
              scale: getAnimationConfig().scale,
            }}
            transition={{
              duration: getAnimationConfig().duration,
              ease: getAnimationConfig().ease,
            }}
            className="absolute w-32 h-32 rounded-full bg-sage-300/40 backdrop-blur-sm"
          />
          
          {/* Middle circle */}
          <motion.div
            key={`${phase}-middle`}
            animate={{
              scale: phase === 'inhale' ? 1.3 : phase === 'hold' ? 1.3 : 0.9,
            }}
            transition={{
              duration: getAnimationConfig().duration,
              ease: getAnimationConfig().ease,
            }}
            className="absolute w-24 h-24 rounded-full bg-sage-400/50"
          />
          
          {/* Inner circle */}
          <motion.div
            key={`${phase}-inner`}
            animate={{
              scale: phase === 'inhale' ? 1.1 : phase === 'hold' ? 1.1 : 1,
            }}
            transition={{
              duration: getAnimationConfig().duration,
              ease: getAnimationConfig().ease,
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

