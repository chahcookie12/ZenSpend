# Environment Setup for ZenSpend

## DeepSeek API Key Configuration

The ZenSpend chat companion requires a DeepSeek API key to be configured internally.

### Setup Instructions

1. **Create `.env.local` file** in the project root (if it doesn't exist):

```bash
# In project root directory
touch .env.local
```

2. **Add the API key** to `.env.local`:

```bash
VITE_DEEPSEEK_API_KEY=sk-36155af91f38470eb27a51a6cfeff654
```

3. **Restart the development server**:

```bash
npm run dev
```

### Important Notes

✅ **The API key is internal** - users never see or enter it

✅ **File is gitignored** - `.env.local` is automatically excluded from Git

✅ **Prototype-level security** - acceptable for hackathons and demos

✅ **No user setup required** - chat works immediately upon opening

### File Structure

```
ZenSpend2/
├── .env.local              ← Add API key here
├── .gitignore              ← Already ignores .env.local
├── src/
│   └── pages/
│       └── Chat.jsx        ← Reads key via import.meta.env
└── ...
```

### How It Works

The Chat component accesses the key internally:

```javascript
// In src/pages/Chat.jsx
const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY
```

Vite automatically loads environment variables prefixed with `VITE_` and makes them available via `import.meta.env`.

### User Experience

From the user's perspective:
1. Open app
2. Navigate to Chat
3. Start chatting immediately
4. No setup, no configuration

The API key handling is completely invisible.

### Security Considerations

**For Prototype/Hackathon:**
- ✅ Good enough for demos
- ✅ Fast to set up
- ✅ No user friction

**For Production (future):**
- Use backend proxy to hide API key
- Implement rate limiting
- Add user authentication
- Monitor API usage

### Troubleshooting

**Chat shows error message?**
- Check `.env.local` exists in project root
- Verify key starts with `VITE_DEEPSEEK_API_KEY=`
- Restart dev server (`npm run dev`)
- Check browser console for errors

**Key not working?**
- Verify the DeepSeek API key is valid
- Check you have API credits remaining
- Try regenerating the key at platform.deepseek.com

---

*This is a prototype-level implementation optimized for hackathons and user experience.*

