import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'

const SignUp = () => {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    signUp(email, password)
    navigate('/dashboard')
  }

  return (
    <div className="h-screen bg-cream flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-12 space-y-3">
          <h1 className="text-4xl text-sage-700 font-light">
            ZenSpend.
          </h1>
          <p className="text-sage-500 text-base">
            Create a quiet space for yourself. Take your time.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sage-600 text-sm mb-2 ml-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-6 py-4 bg-cream-100 text-sage-700 rounded-3xl text-base
                         focus:outline-none focus:ring-2 focus:ring-sage-300 transition-all"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sage-600 text-sm mb-2 ml-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
                className="w-full px-6 py-4 bg-cream-100 text-sage-700 rounded-3xl text-base
                         focus:outline-none focus:ring-2 focus:ring-sage-300 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-5 bg-sage-400 hover:bg-sage-500 text-white rounded-3xl
                     text-lg font-light transition-colors shadow-sm hover:shadow-md
                     active:scale-[0.98] transform"
          >
            Create account
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sage-500 text-sm">
            Already have an account?{' '}
            <Link 
              to="/signin" 
              className="text-sage-600 hover:text-sage-700 underline underline-offset-2"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default SignUp

