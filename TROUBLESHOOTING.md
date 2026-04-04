# FinMate - Quick Troubleshooting Guide

## Site Not Loading?

### Check 1: Is the dev server running?
```bash
cd /Users/shrey/Downloads/FinClear/finmate
npm run dev
```

**Expected output:**
```
▲ Next.js 15.5.4
- Local:        http://localhost:3000
✓ Ready in 1573ms
```

### Check 2: Which port is being used?
If you see:
```
⚠ Port 3000 is in use, using available port 3003 instead.
```

**Solution:** Open your browser to the port shown (e.g., http://localhost:3003)

### Check 3: Kill process on port 3000 (if needed)
```bash
# Find process
lsof -ti:3000

# Kill it
kill -9 $(lsof -ti:3000)

# Restart dev server
npm run dev
```

---

## Gemini API Key Missing?

### Symptom:
Chat returns: "AI service temporarily unavailable"

### Solution:
1. Create `.env.local` in the project root:
```bash
cd /Users/shrey/Downloads/FinClear/finmate
touch .env.local
```

2. Add your Gemini API key:
```
GEMINI_API_KEY=your_actual_key_here
```

3. Restart dev server (Ctrl+C, then `npm run dev`)

### Get Gemini API Key:
https://makersuite.google.com/app/apikey

---

## Build Errors?

### Run type check:
```bash
npm run build
```

### Common fixes:
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Clear Next.js cache
rm -rf .next

# Rebuild
npm run build
```

---

## Chat Not Working?

### Check browser console:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for errors

### Test chat API directly:
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"prompt": "What is a deductible?"}'
```

**Expected response:**
```json
{
  "message": "A deductible is...",
  "provider": "gemini",
  "sources": ["Understanding Deductibles"]
}
```

---

## localStorage Issues?

### Clear browser data:
1. Open DevTools (F12)
2. Application tab → Storage → Local Storage
3. Right-click → Clear

### Or in console:
```javascript
localStorage.clear()
location.reload()
```

---

## Quick Status Check

```bash
cd /Users/shrey/Downloads/FinClear/finmate

# Check if dependencies installed
ls node_modules | wc -l
# Should show ~1000+ packages

# Check if .env.local exists
ls -la .env.local
# Should exist with GEMINI_API_KEY

# Check if dev server running
lsof -i:3000
# Shows process if running

# Test build
npm run build
# Should complete without errors
```

---

## Everything Broken? Start Fresh

```bash
cd /Users/shrey/Downloads/FinClear/finmate

# Kill all node processes
pkill -9 node

# Clean everything
rm -rf node_modules .next package-lock.json

# Reinstall
npm install

# Rebuild
npm run build

# Start fresh
npm run dev
```

---

## Common Port Numbers

- **3000** - Default Next.js dev server
- **3003** - Alternate if 3000 is busy
- **3001, 3002** - Other common alternates

**Always check the terminal output for the actual port being used!**

---

## Still Having Issues?

### Check these files exist:
```bash
ls -la src/app/layout.tsx
ls -la src/app/page.tsx
ls -la src/lib/rag/knowledge-base.ts
ls -la src/app/api/chat/route.ts
```

All should exist.

### Check git status:
```bash
git status
git log --oneline -5
```

Should show recent commits for Phases 1-3.

---

## Success Checklist

✅ Dev server starts without errors
✅ Browser loads http://localhost:3000 (or 3003)
✅ Landing page shows State Farm branding
✅ "Get Started" button works
✅ Survey loads with Trust Passport
✅ Chat icon appears (bottom right)
✅ Chat responds to questions

---

## For Teammates

### Pull latest changes:
```bash
cd /Users/shrey/Downloads/FinClear/finmate
git pull origin main
npm install  # In case new dependencies added
npm run dev
```

### Create your own branch:
```bash
git checkout -b phase4-emergency-calc
# Make changes
git add .
git commit -m "Your changes"
git push origin phase4-emergency-calc
```

---

## Performance Issues?

### Dev mode is slower - that's normal!
Production build is much faster:
```bash
npm run build
npm start  # Production mode
```

### But for development, use:
```bash
npm run dev
```

It has hot-reload which is convenient.

---

## Browser Compatibility

**Recommended:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

**Not supported:**
- IE11 (too old)
- Very old browsers

---

## Need Help?

1. Check `HOW_IT_WORKS.md` for architecture overview
2. Check this file for troubleshooting
3. Check browser console for errors
4. Check terminal for server errors
5. Ask the AI chat for code explanations!

---

**Last updated:** Phase 3 complete
**Next:** Phase 4 (Emergency Calculator integration)
