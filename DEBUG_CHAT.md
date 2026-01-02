# 🐛 Debug Chat Issues

## How to Check Browser Console

1. **Open the app:** http://localhost:5175
2. **Open Developer Tools:**
   - Press `F12` or
   - Press `Ctrl+Shift+I` or
   - Right-click → "Inspect"
3. **Click "Console" tab**
4. **Navigate to Chat** and send a message
5. **Look for these logs:**

### What to Look For

#### ✅ Good (Working):
```
API Key loaded: Yes
Response status: 200
API Response: { choices: [...] }
```

#### ❌ Problem Signs:

**API Key not loading:**
```
API Key loaded: No
Error: API key not configured
```
**Fix:** Restart dev server

**API Error:**
```
Response status: 401
API Error: { error: { message: "Invalid API key" } }
```
**Fix:** Check API key in `.env.local`

**Network Error:**
```
TypeError: Failed to fetch
```
**Fix:** Check internet connection

---

## Quick Fixes

### Fix 1: Restart Dev Server

Stop and restart to load `.env.local`:

```bash
# Press Ctrl+C in terminal
npm run dev
```

### Fix 2: Verify .env.local

Check file exists and has correct content:

```bash
type .env.local
```

Should show:
```
VITE_DEEPSEEK_API_KEY=sk-36155af91f38470eb27a51a6cfeff654
```

### Fix 3: Clear Browser Cache

1. Press `Ctrl+Shift+Delete`
2. Select "Cached images and files"
3. Click "Clear data"
4. Refresh page (`Ctrl+R`)

### Fix 4: Try Incognito/Private Window

Open http://localhost:5175 in incognito mode to rule out cache issues.

---

## Common Issues

### Issue 1: "API Key loaded: No"

**Cause:** Server hasn't picked up `.env.local`

**Solution:**
1. Stop server (`Ctrl+C`)
2. Verify `.env.local` exists in project root
3. Start server: `npm run dev`
4. Hard refresh browser: `Ctrl+Shift+R`

### Issue 2: Status 401 (Unauthorized)

**Cause:** Invalid API key

**Solution:**
1. Check `.env.local` has correct key
2. Key should start with `sk-`
3. No extra spaces or quotes
4. Restart server after changes

### Issue 3: Status 429 (Rate Limit)

**Cause:** Too many requests

**Solution:**
1. Wait a minute
2. Try again
3. Check DeepSeek platform for quota

### Issue 4: Network/CORS Error

**Cause:** Internet connection or CORS policy

**Solution:**
1. Check internet connection
2. Try different network
3. Check firewall settings

---

## Manual Test

Try this in browser console:

```javascript
// Check if env variable is loaded
console.log('Env key:', import.meta.env.VITE_DEEPSEEK_API_KEY)
```

Should show the API key (starting with `sk-`).

If it shows `undefined`, the `.env.local` file isn't being loaded.

---

## Contact Info

If still not working, share:
1. Browser console screenshot
2. Terminal output
3. `.env.local` file content (hide last part of key)

