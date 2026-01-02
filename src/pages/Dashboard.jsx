import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BottomNav from '../components/BottomNav'
import Home from './Home'
import Money from './Money'
import Pause from './Pause'
import Insights from './Insights'
import Chat from './Chat'
import BreathingExercise from '../components/BreathingExercise'

const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState('home')
  const [direction, setDirection] = useState(0)
  const [showBreathing, setShowBreathing] = useState(false)

  const pages = ['home', 'money', 'pause', 'insights', 'chat']

  const navigateTo = (page) => {
    const currentIndex = pages.indexOf(currentPage)
    const newIndex = pages.indexOf(page)
    setDirection(newIndex > currentIndex ? 1 : -1)
    setCurrentPage(page)
  }

  const pageVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  }

  const pageTransition = {
    type: 'spring',
    stiffness: 300,
    damping: 30,
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onStartBreathing={() => setShowBreathing(true)} />
      case 'money':
        return <Money />
      case 'pause':
        return <Pause />
      case 'insights':
        return <Insights />
      case 'chat':
        return <Chat />
      default:
        return <Home />
    }
  }

  return (
    <div className="h-screen flex flex-col bg-cream overflow-hidden">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        {showBreathing ? (
          <BreathingExercise 
            key="breathing" 
            onComplete={() => setShowBreathing(false)} 
          />
        ) : (
          <motion.div
            key={currentPage}
            custom={direction}
            variants={pageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={pageTransition}
            className="flex-1 overflow-hidden"
          >
            {renderPage()}
          </motion.div>
        )}
      </AnimatePresence>

      {!showBreathing && (
        <BottomNav currentPage={currentPage} onNavigate={navigateTo} />
      )}
    </div>
  )
}

export default Dashboard

