import { motion } from 'framer-motion'

const BottomNav = ({ currentPage, onNavigate }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: '◯' },
    { id: 'money', label: 'Money', icon: '◐' },
    { id: 'pause', label: 'Pause', icon: '◉' },
    { id: 'insights', label: 'Insights', icon: '◑' },
    { id: 'chat', label: 'Chat', icon: '◔' },
  ]

  return (
    <nav className="bg-cream-100/90 backdrop-blur-sm border-t border-sage-100 px-2 py-3 safe-area-bottom">
      <div className="max-w-md mx-auto flex justify-around items-center">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className="flex flex-col items-center gap-1 px-4 py-2 relative transition-all"
          >
            <span 
              className={`text-2xl transition-all duration-300 ${
                currentPage === item.id 
                  ? 'text-sage-600 scale-110' 
                  : 'text-sage-300'
              }`}
            >
              {item.icon}
            </span>
            <span 
              className={`text-xs transition-all duration-300 ${
                currentPage === item.id 
                  ? 'text-sage-700 font-medium' 
                  : 'text-sage-400'
              }`}
            >
              {item.label}
            </span>
            {currentPage === item.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-sage-500 rounded-full"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </nav>
  )
}

export default BottomNav

