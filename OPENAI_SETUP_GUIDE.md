# OpenAI API Setup Guide for NeuroFlow

## 🚀 Quick Setup (5 minutes)

### Step 1: Get Your OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign in with your OpenAI account (create one if needed)
3. Click "Create new secret key"
4. Copy the key (you won't see it again!)
5. Keep it safe - never share it

### Step 2: Create `.env.local` File

In your project root (`Downloads/neuroflow-landing`), create a file named `.env.local`:

```bash
NEXT_PUBLIC_OPENAI_API_KEY=sk-your-actual-key-here
OPENAI_API_MODEL=gpt-4o-mini
OPENAI_MAX_TOKENS=150
```

**Replace `sk-your-actual-key-here` with your actual API key**

### Step 3: Restart Dev Server

```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm run dev
```

### Step 4: Test It Works

1. Open http://localhost:3001/dashboard
2. Start a focus session
3. Type for 1-2 minutes
4. Stop the session
5. Check if AI feedback appears

---

## 📋 Detailed Setup Instructions

### Getting Your API Key

**Option 1: New User**
1. Go to https://platform.openai.com/signup
2. Create account with email
3. Verify email
4. Go to https://platform.openai.com/api-keys
5. Click "Create new secret key"
6. Copy the key

**Option 2: Existing User**
1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key

### Setting Up Environment Variables

**Windows (PowerShell)**:
```powershell
# Create .env.local file
@"
NEXT_PUBLIC_OPENAI_API_KEY=sk-your-key-here
OPENAI_API_MODEL=gpt-4o-mini
OPENAI_MAX_TOKENS=150
"@ | Out-File -Encoding UTF8 .env.local
```

**Mac/Linux (Terminal)**:
```bash
# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_OPENAI_API_KEY=sk-your-key-here
OPENAI_API_MODEL=gpt-4o-mini
OPENAI_MAX_TOKENS=150
EOF
```

**Manual Method**:
1. Open your project folder
2. Create new file named `.env.local`
3. Add the three lines above
4. Replace `sk-your-key-here` with your actual key
5. Save the file

### Verify Setup

Check that `.env.local` exists in your project root:
```
Downloads/neuroflow-landing/
├── .env.local          ← Should be here
├── app/
├── components/
├── lib/
├── package.json
└── ...
```

---

## 🧪 Testing the Integration

### Manual Test

1. **Start dev server**:
   ```bash
   npm run dev
   ```

2. **Open dashboard**:
   - Go to http://localhost:3001/dashboard

3. **Start a session**:
   - Select "Focus Mode"
   - Click "Start Session"

4. **Generate activity**:
   - Type in the page for 1-2 minutes
   - Move mouse around
   - Generate some activity

5. **Stop session**:
   - Click "Stop Session"

6. **Check feedback**:
   - Look for AI-generated feedback
   - Should be neuroscience-focused
   - Should mention brain waves, focus score, etc.

### Check Console for Errors

1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for any errors
4. Common errors:
   - "API key not found" → Check .env.local
   - "401 Unauthorized" → Check API key is correct
   - "Rate limit exceeded" → Wait a few minutes

---

## 💰 Pricing & Costs

### OpenAI API Pricing

**GPT-4o-mini** (what NeuroFlow uses):
- Input: $0.15 per 1M tokens
- Output: $0.60 per 1M tokens

### Cost Estimation

**Per session feedback**:
- Average input: ~200 tokens
- Average output: ~100 tokens
- Cost per session: ~$0.00009 (less than 1 cent!)

**Monthly estimate** (100 sessions):
- ~$0.009 per month (less than 1 cent!)

**Very affordable!** 💰

### Free Trial

OpenAI provides:
- $5 free credits for new accounts
- Valid for 3 months
- Enough for thousands of sessions!

---

## 🔐 Security Best Practices

### ✅ DO:
- Keep API key in `.env.local`
- Never commit `.env.local` to git
- Rotate keys regularly
- Use environment variables

### ❌ DON'T:
- Share your API key
- Commit `.env.local` to git
- Hardcode API key in code
- Use in public repositories

### Verify `.env.local` is Ignored

Check `.gitignore`:
```bash
# Should contain:
.env.local
.env.*.local
```

---

## 🐛 Troubleshooting

### Problem: "API key not found"

**Solution**:
1. Check `.env.local` exists
2. Check file is in project root
3. Check API key is correct
4. Restart dev server
5. Check browser console

### Problem: "401 Unauthorized"

**Solution**:
1. Verify API key is correct
2. Check key hasn't expired
3. Try creating a new key
4. Check key has API access enabled

### Problem: "Rate limit exceeded"

**Solution**:
1. Wait a few minutes
2. Check your usage at https://platform.openai.com/account/usage
3. Consider upgrading account
4. Implement rate limiting

### Problem: "No feedback generated"

**Solution**:
1. Check browser console for errors
2. Verify API key is set
3. Check session has data (type for 1-2 min)
4. Try again with longer session

### Problem: "Feedback is generic"

**Solution**:
1. Check neuroscience prompts are loaded
2. Verify `lib/prompts.ts` exists
3. Check `aiFeedback.ts` imports prompts
4. Restart dev server

---

## 📊 Monitoring Usage

### Check Your Usage

1. Go to https://platform.openai.com/account/usage
2. See tokens used
3. See costs
4. Set usage limits if desired

### Set Usage Limits

1. Go to https://platform.openai.com/account/billing/limits
2. Set "Hard limit" (stops API when reached)
3. Set "Soft limit" (warning email)

---

## 🚀 Next Steps

1. ✅ Get API key
2. ✅ Create `.env.local`
3. ✅ Restart dev server
4. ✅ Test integration
5. ✅ Verify feedback quality
6. ✅ Deploy to production

---

## 📞 Support

### OpenAI Support
- Docs: https://platform.openai.com/docs
- Help: https://help.openai.com
- Status: https://status.openai.com

### NeuroFlow Support
- Check console for errors (F12)
- Review PRODUCTION_IMPLEMENTATION_PLAN.md
- Check TESTING_GUIDE.md

---

## ✨ What Happens Next

Once API is set up:

1. **Real AI Feedback**: Personalized, neuroscience-focused
2. **Better Insights**: Brain wave analysis
3. **Actionable Tips**: Specific recommendations
4. **User Satisfaction**: Much better experience

---

**Status**: Ready to setup! 🚀

Get your API key and let's make NeuroFlow amazing! 🧠✨

