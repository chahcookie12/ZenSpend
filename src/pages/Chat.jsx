import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { storage } from '../utils/storage'

const Chat = () => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    // Load chat history
    const history = storage.getChatHistory() || []
    setMessages(history)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Detect if message contains URL
  const detectURL = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    return urlRegex.test(text)
  }

  // Detect purchase intent
  const detectPurchaseIntent = (text) => {
    const buyKeywords = /\b(bought|buy|purchase|ordered|got|getting)\b/i
    const notBuyKeywords = /\b(didn't|did not|won't|will not|decided not|skipped|passed)\b/i

    if (notBuyKeywords.test(text)) return 'skipped'
    if (buyKeywords.test(text)) return 'bought'
    return null
  }

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = {
      role: 'user',
      content: input.trim(),
    }

    // Immediately add user's message to UI and local storage
    setMessages((prev) => {
      const next = [...prev, userMessage]
      storage.saveChatMessage(userMessage)
      return next
    })

    const userInput = input.trim()
    setInput('')
    setIsTyping(true)

    try {
      // Get API key from environment (you likely want to inject this via a build env or server proxy)
      const apiKey = 'sk-36155af91f38470eb27a51a6cfeff654'

      console.log('API Key loaded:', apiKey ? 'Yes' : 'No')

      if (!apiKey) {
        throw new Error('API key not configured')
      }

      // Detect special cases
      const hasURL = detectURL(userInput)
      const purchaseIntent = detectPurchaseIntent(userInput)

      // Build enhanced system prompt based on context (do NOT change this per request)
      let systemPrompt = `
You are a calm, grounded reflection companion inside a financial wellness app.

Your role:
- Help the user make clearer, calmer decisions around spending
- Reduce stress and mental load
- Be practical, human, and emotionally aware

Rules:
- Be brief and direct
- No moral judgment
- No lectures
- No financial advice language
- Focus on awareness and relief, not optimization
- Speak like a calm, smart friend

You may use multiple short sentences if helpful.
Avoid filler. Avoid therapy clichés.
`

      // Add context for URL detection
      if (hasURL) {
        systemPrompt += `
      
      The user shared a shopping link.
      
      Action:
      - Assume they are considering a purchase
      - Do NOT ask if they want help
      - Immediately suggest 2-3 alternative options that are:
        - Lower cost
        - Good quality
        - Less financially stressful
      
      Frame suggestions as easing pressure, not saving money.
      
      Tone examples:
      - "This looks nice. If price is adding pressure, these options tend to be calmer choices."
      - "Here are a few alternatives people often choose when they want something similar with less stress."
      
      Do not push buying. Do not rank aggressively. Keep it grounded.
      `
      }

      // Add context for purchase decisions
      if (purchaseIntent === 'bought') {
        systemPrompt += `
      
      The user decided to buy.
      
      Respond by:
      - Acknowledging the decision without praise or regret
      - Asking one grounded question about how it feels now
      
      Example tone:
      - "Got it. How does it feel now that the decision is made?"
      `
      } else if (purchaseIntent === 'skipped') {
        systemPrompt += `
      
      The user decided not to buy.
      
      Respond by:
      - Acknowledging the pause
      - Asking what helped them step back
      
      Example tone:
      - "You paused. What helped you make that call?"
      `
      }

      // Build context array including the latest user message so the assistant has memory
      // Use the current state messages plus the new userMessage (state update above may be async),
      // so construct context explicitly to ensure latest entries are included.
      const currentHistory = storage.getChatHistory() || messages || []
      // If storage returned empty but messages state has content, use messages as fallback
      const baseHistory = currentHistory.length ? currentHistory : messages
      // Combine and ensure we include the freshly created userMessage (in case storage lag)
      const combined = [...baseHistory, userMessage]

      // Keep last N messages for context (including both user and assistant)
      const contextMessages = combined.slice(-12).map((m) => ({
        role: m.role,
        content: m.content,
      }))

      // Call DeepSeek API
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            ...contextMessages,
          ],
          temperature: 0.7,
          max_tokens: 250,
        }),
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('API Error:', errorData)
        throw new Error(`API returned ${response.status}: ${errorData.error?.message || 'Unknown error'}`)
      }

      const data = await response.json()

      console.log('API Response:', data)

      if (data.choices && data.choices[0] && data.choices[0].message) {
        const aiMessage = {
          role: 'assistant',
          content: data.choices[0].message.content,
        }

        setMessages((prev) => {
          const next = [...prev, aiMessage]
          storage.saveChatMessage(aiMessage)
          return next
        })

        // Optionally handle purchase decision actions here (e.g., flagging, auto-add)
        if (purchaseIntent === 'bought') {
          // Future hook: auto-populate expense entry or show "Add to expenses?" CTA
        }
      } else {
        throw new Error('Invalid response from API')
      }
    } catch (error) {
      console.error('Chat error:', error)
      console.error('Error details:', error.message)
      const errorMessage = {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Take a moment to breathe.",
      }
      setMessages((prev) => {
        const next = [...prev, errorMessage]
        storage.saveChatMessage(errorMessage)
        return next
      })
    } finally {
      setIsTyping(false)
    }
  }

  const clearChat = () => {
    setMessages([])
    storage.clearChatHistory()
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-6 border-b border-sage-100 flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-sage-700 font-light">
            Reflection companion
          </h1>
          <p className="text-sage-500 text-sm mt-1">
            Here to listen, not advise
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={clearChat}
            className="text-sage-400 hover:text-sage-600 text-sm"
          >
            Clear
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.length === 0 && (
          <div className="h-full flex items-center justify-center">
            <div className="text-center space-y-4 max-w-sm">
              <span className="text-5xl">◔</span>
              <div className="space-y-2">
                <p className="text-sage-600 text-lg">
                  How are you feeling about money today?
                </p>
                <p className="text-sage-500 text-sm">
                  I'm here to help you reflect, not judge.
                </p>
              </div>
            </div>
          </div>
        )}

        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-3xl px-6 py-4 ${
                  message.role === 'user'
                    ? 'bg-sage-500 text-white'
                    : 'bg-cream-100 text-sage-700'
                }`}
              >
                <p className="text-base leading-relaxed">
                  {message.content}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-cream-100 rounded-3xl px-6 py-4">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-sage-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-6 border-t border-sage-100">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Share what's on your mind..."
            className="flex-1 bg-cream-100 text-sage-700 rounded-3xl py-4 px-6 focus:outline-none focus:ring-2 focus:ring-sage-300"
            disabled={isTyping}
            autoFocus
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isTyping}
            className="bg-sage-500 hover:bg-sage-600 text-white rounded-full w-14 h-14 flex items-center justify-center disabled:opacity-30 transition-colors"
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat