# NeuroFlow Quick Start Guide

## 🎯 What is NeuroFlow?

NeuroFlow is an AI-powered focus companion that plays adaptive soundscapes to enhance your concentration and calm. It detects your typing rhythm and adjusts the audio in real-time to match your mental state.

## ⚡ 5-Minute Setup

### Step 1: Install
```bash
npm install --legacy-peer-deps
```

### Step 2: Configure (Optional)
```bash
cp .env.example .env.local
# Add your OpenAI API key for AI feedback
# Get one at: https://platform.openai.com/api-keys
```

### Step 3: Run
```bash
npm run dev
```

### Step 4: Open
Visit http://localhost:3000/dashboard

## 🎵 Using NeuroFlow

### Starting a Session

1. **Choose Your Mode**
   - 🧠 **Focus Mode**: Deep concentration with 40 Hz binaural beats
   - 💚 **Calm Mode**: Relaxation with 10 Hz alpha waves
   - ⚡ **Energize Mode**: Motivation with 25 Hz beta waves

2. **Adjust Volume** (0-100%)

3. **Click "Start Session"**

4. **Start Working** - Type, code, write, or work on your task

### What Happens

- 🎧 Binaural beats play through your headphones
- 📊 Real-time metrics show your focus level
- 🔄 Audio adapts to your typing rhythm
- 📈 Focus score increases with consistent activity

### Ending a Session

1. Click **"Stop Session"**
2. View your **Session Summary**
3. Read AI-generated feedback and tips
4. Export your data if desired

## 📊 Viewing Your History

1. Go to http://localhost:3000/history
2. See all your past sessions
3. View statistics and trends
4. Export data as JSON or CSV
5. Delete sessions you don't need

## 🧠 Understanding the Metrics

| Metric | Meaning | Good Range |
|--------|---------|------------|
| **Focus Level** | How focused you are (0-100%) | 70-100% |
| **Typing Speed** | Keystrokes per minute | 40-80 KPM |
| **Session Time** | How long you've been working | 25-90 min |
| **Focus Score** | Overall session quality (0-100) | 60-100 |

## 💡 Tips for Best Results

1. **Use Headphones**: Binaural beats work best with stereo headphones
2. **Consistent Typing**: Keep typing to maintain focus level
3. **Take Breaks**: Use Calm Mode between intense sessions
4. **Regular Sessions**: Build focus habits with daily use
5. **Experiment**: Try different modes to find what works for you

## 🎯 Recommended Workflows

### Deep Work Session (90 minutes)
1. Start Focus Mode
2. Work for 25 minutes
3. Take 5-minute break (use Calm Mode)
4. Repeat 3-4 times
5. Take 15-minute break

### Creative Brainstorm (45 minutes)
1. Start Energize Mode
2. Brainstorm and write ideas
3. Let audio boost your creativity
4. Review and organize ideas

### Stress Relief (20 minutes)
1. Start Calm Mode
2. Relax and breathe
3. Let the soundscape calm your mind
4. Return to work refreshed

## 🔧 Troubleshooting

### No Sound?
- Check volume is above 0%
- Ensure headphones are connected
- Check browser volume isn't muted
- Try refreshing the page

### Focus Level Not Updating?
- Make sure you're typing in the browser window
- Check that keyboard events are being captured
- Try clicking in the page first

### AI Feedback Not Working?
- Verify OpenAI API key is in `.env.local`
- Check API key has sufficient credits
- Try without API key (default feedback will show)

## 📱 Mobile Usage

NeuroFlow works on mobile devices! However:
- Audio works best with headphones
- Typing detection works with on-screen keyboards
- Smaller screen may require scrolling

## 🚀 Next Steps

1. **Customize**: Edit audio frequencies in `lib/audioEngine.ts`
2. **Deploy**: Push to Vercel or your hosting platform
3. **Share**: Tell friends about your focus companion
4. **Feedback**: Report issues or suggest features

## 📚 Learn More

- **Setup Guide**: See `NEUROFLOW_SETUP.md`
- **Implementation**: See `IMPLEMENTATION_GUIDE.md`
- **Neuroscience**: Research brain waves and binaural beats

## 🎉 You're Ready!

Start your first focus session now:
```bash
npm run dev
# Visit http://localhost:3000/dashboard
```

---

**Happy focusing! 🧠✨**

