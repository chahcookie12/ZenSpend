# 🚀 Quick Setup - Start Here!

## ⚠️ IMPORTANT: Create Environment File

Before the chat will work, you need to create the `.env.local` file:

### Windows (PowerShell)

```powershell
# Navigate to project root
cd C:\Users\user\Downloads\ZenSpend2

# Create .env.local file
@"
VITE_DEEPSEEK_API_KEY=sk-36155af91f38470eb27a51a6cfeff654
"@ | Out-File -FilePath .env.local -Encoding utf8
```

### Windows (Command Prompt)

```cmd
cd C:\Users\user\Downloads\ZenSpend2
echo VITE_DEEPSEEK_API_KEY=sk-36155af91f38470eb27a51a6cfeff654 > .env.local
```

### Manual Creation

1. Open project root: `C:\Users\user\Downloads\ZenSpend2`
2. Create new file: `.env.local`
3. Add this line:
   ```
   VITE_DEEPSEEK_API_KEY=sk-36155af91f38470eb27a51a6cfeff654
   ```
4. Save the file

## 🎯 Then Restart

```bash
# Stop current server (Ctrl+C in terminal)
# Start fresh
npm run dev
```

## ✅ How to Verify It Works

1. Open http://localhost:5173 (or 5174)
2. Navigate to **Chat** tab (bottom navigation)
3. You should see the chat ready immediately
4. Type a message and press Enter
5. AI should respond within 2-3 seconds

## 🎨 User Experience

**What users see:**
- Open app → Chat is ready
- No setup screens
- No API key inputs
- Just works™

**What's happening behind the scenes:**
- `.env.local` stores the key
- App reads it automatically
- Key never exposed to user

## 📁 File Location

```
C:\Users\user\Downloads\ZenSpend2\
├── .env.local  ← CREATE THIS FILE
├── src/
├── package.json
└── ...
```

## 🔍 Troubleshooting

**Chat not responding?**
1. Check `.env.local` exists in project ROOT (not in src/)
2. Verify file content is exactly: `VITE_DEEPSEEK_API_KEY=sk-36155af91f38470eb27a51a6cfeff654`
3. Restart dev server
4. Clear browser cache
5. Check browser console (F12) for errors

**File creation issues?**
- Make sure file is named `.env.local` (with the dot)
- No file extension (.txt, .env.local.txt won't work)
- Use UTF-8 encoding
- No spaces around the `=`

## 💡 What This Enables

Once `.env.local` is created:

✅ **Immediate chat** - no user setup
✅ **Decision awareness** - detects "I bought" vs "I didn't buy"
✅ **Link handling** - detects shopping URLs, offers calm alternatives
✅ **Context-aware** - remembers last 10 messages
✅ **Stress-reducing** - frames everything around reducing pressure

## 🎉 You're All Set!

After creating `.env.local` and restarting:
- Chat companion works immediately
- No more setup needed
- Users never see the API key
- Perfect hackathon demo experience

---

**Need help?** Check `ENV_SETUP.md` for detailed information.

