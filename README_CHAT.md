# 💬 Chat Companion - Quick Reference

## ✅ Status: READY TO USE

The chat companion works immediately - no setup required!

---

## 🚀 How to Use

1. **Open app:** http://localhost:5173
2. **Navigate to Chat** (◔ icon in bottom nav)
3. **Start typing** - AI responds in 2-3 seconds

That's it! No API keys, no configuration, no setup screens.

---

## ✨ What It Does

### 1. **Listens and Reflects**

**You:** "I'm stressed about money"

**AI:** "What does that stress feel like in your body right now?"

### 2. **Detects Purchase Decisions**

**You:** "I bought new headphones"

**AI:** "How does that feel now?"

---

**You:** "I decided not to buy them"

**AI:** "What helped you decide?"

### 3. **Handles Shopping Links**

**You:** [paste Amazon/shopping URL]

**AI:** "Do you want help finding a calmer option?"

**You:** "Yes"

**AI:** "If cost is adding pressure, these places often have gentler prices: [2-3 alternatives]"

### 4. **Stays Calm**

- One question at a time
- 1-2 sentences max
- No judgment
- No advice
- Just reflection

---

## 🎯 What It Doesn't Do

❌ Give financial advice
❌ Tell you what to buy
❌ Judge your spending
❌ Optimize your budget
❌ Act like a shopping assistant

---

## 🔧 Technical Details

**API Key:** Stored in `.env.local` (internal)

**Model:** DeepSeek Chat

**Context:** Last 10 messages

**Response time:** 2-3 seconds

**Cost per message:** ~$0.001

---

## 🎨 Design

**Empty state:**
- "How are you feeling about money today?"
- "I'm here to help you reflect, not judge."

**Chat bubbles:**
- User: Right, sage green background
- AI: Left, cream background
- Large, comfortable text
- Rounded corners

**Input:**
- Auto-focused
- Placeholder: "Share what's on your mind..."
- Enter to send

---

## 🐛 Troubleshooting

**Chat not responding?**

1. Check `.env.local` exists in project root
2. Verify it contains: `VITE_DEEPSEEK_API_KEY=sk-36155af91f38470eb27a51a6cfeff654`
3. Restart dev server: `npm run dev`
4. Check browser console (F12) for errors

**Still not working?**

- Clear browser cache
- Try incognito/private window
- Check internet connection (API requires network)
- Verify API key is valid at platform.deepseek.com

---

## 📖 More Information

- **Full feature guide:** `CHAT_FEATURES.md`
- **Setup instructions:** `ENV_SETUP.md`
- **AI behavior:** `AI_COMPANION_GUIDE.md`
- **Implementation details:** `IMPLEMENTATION_COMPLETE.md`

---

## 💡 Pro Tips

1. **Be honest** - The AI responds better to genuine feelings
2. **Take your time** - No rush to respond
3. **Ask for breathing** - Say "I need to breathe" for exercise suggestion
4. **Share links** - Paste shopping URLs for alternative suggestions
5. **Mention decisions** - Say "I bought" or "I didn't buy" for context-aware responses

---

## 🎉 That's It!

The chat companion is ready to use. Just open the app and start talking.

**Remember:** It's here to help you reflect, not judge. There's no wrong way to use it.

*"I open the app, and the companion is already there."* ✓

