# 🚀 Getting Started with NeuroFlow

Welcome to NeuroFlow! This guide will get you up and running in minutes.

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies
```bash
cd neuroflow-landing
npm install --legacy-peer-deps
```

### Step 2: Start Development Server
```bash
npm run dev
```

### Step 3: Open in Browser
- **Landing Page**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard
- **History**: http://localhost:3000/history

### Step 4: Start Your First Session
1. Go to http://localhost:3000/dashboard
2. Select a mode (Focus, Calm, or Energize)
3. Click "Start Session"
4. Start typing or working
5. Watch your focus level update in real-time!

---

## 🎯 Understanding the Modes

### 🧠 Focus Mode (40 Hz Gamma Waves)
**Best for**: Deep work, coding, writing, problem-solving
- Enhances attention and concentration
- Ideal for 25-90 minute sessions
- Binaural beats at 40 Hz

**How to use**:
1. Select Focus Mode
2. Start a session
3. Work on your task
4. Audio adapts to your typing rhythm

### 💚 Calm Mode (10 Hz Alpha Waves)
**Best for**: Relaxation, stress relief, meditation
- Promotes relaxation and light meditation
- Ideal for 10-20 minute breaks
- Binaural beats at 10 Hz

**How to use**:
1. Select Calm Mode
2. Start a session
3. Relax and breathe
4. Let the soundscape calm your mind

### ⚡ Energize Mode (25 Hz Beta-Gamma Waves)
**Best for**: Motivation, creativity, memory enhancement
- Boosts alertness and energy
- Ideal for creative tasks
- Binaural beats at 25 Hz

**How to use**:
1. Select Energize Mode
2. Start a session
3. Brainstorm or work on creative tasks
4. Feel the energy boost!

---

## 📊 Reading Your Metrics

### Focus Level (0-100%)
- **What it means**: How focused you are based on typing activity
- **How it works**: Increases with typing, decreases during idle
- **Good range**: 70-100%
- **Tip**: Keep typing to maintain high focus level

### Typing Speed (KPM)
- **What it means**: Keystrokes per minute
- **How it works**: Calculated from keyboard activity
- **Good range**: 40-80 KPM
- **Tip**: Consistent typing = consistent focus

### Session Time
- **What it means**: How long you've been working
- **How it works**: Counts from session start
- **Good range**: 25-90 minutes
- **Tip**: Take breaks every 25-50 minutes

### Focus Score (0-100)
- **What it means**: Overall session quality
- **How it works**: Based on activity consistency
- **Good range**: 60-100
- **Tip**: Higher scores = better focus habits

---

## 💡 Pro Tips

### For Maximum Focus
1. **Use headphones** - Binaural beats work best with stereo headphones
2. **Minimize distractions** - Close unnecessary tabs and apps
3. **Stay hydrated** - Drink water during sessions
4. **Take breaks** - Use Calm Mode between intense sessions
5. **Be consistent** - Daily sessions build focus habits

### For Best Results
1. **Experiment with modes** - Find what works for you
2. **Track patterns** - Check your history to see trends
3. **Adjust volume** - Find your comfortable level
4. **Use regularly** - Build focus habits over time
5. **Export data** - Track your progress over weeks/months

### Recommended Workflows

#### Deep Work (90 minutes)
```
1. Focus Mode - 25 minutes
2. Calm Mode - 5 minute break
3. Focus Mode - 25 minutes
4. Calm Mode - 5 minute break
5. Focus Mode - 25 minutes
6. Calm Mode - 15 minute break
```

#### Creative Session (45 minutes)
```
1. Energize Mode - 45 minutes
2. Brainstorm and create
3. Let audio boost creativity
```

#### Stress Relief (20 minutes)
```
1. Calm Mode - 20 minutes
2. Relax and breathe
3. Return refreshed
```

---

## 🔧 Customization

### Change Volume
- Use the volume slider (0-100%)
- Adjust before starting session
- Can't change during playback

### Change Audio Frequencies
Edit `lib/audioEngine.ts`:
```typescript
focus: {
  baseFrequency: 200,    // Change base frequency
  beatFrequency: 40,     // Change beat frequency
  volume: 0.6,           // Change default volume
}
```

### Adjust Idle Threshold
Edit `lib/activityDetector.ts`:
```typescript
private idleThreshold = 5000; // Change to 3000 for 3 seconds
```

---

## 📱 Mobile Usage

NeuroFlow works great on mobile!

### Desktop
- Full features available
- Larger screen for metrics
- Better for extended sessions

### Mobile
- All features available
- Responsive design
- Touch-friendly controls
- Great for quick sessions

### Tips for Mobile
1. Use headphones for best audio
2. Keep screen on during session
3. Minimize other apps
4. Use in portrait or landscape

---

## 🎓 Understanding the Science

### What are Binaural Beats?
Binaural beats are created by playing slightly different frequencies in each ear. Your brain perceives the difference as a beat, which can influence brain wave activity.

### How Does It Work?
1. **Left ear**: 200 Hz
2. **Right ear**: 240 Hz (for 40 Hz beat)
3. **Brain perceives**: 40 Hz binaural beat
4. **Effect**: Enhanced focus and concentration

### Why These Frequencies?
- **40 Hz (Gamma)**: Associated with attention and problem-solving
- **10 Hz (Alpha)**: Associated with relaxation and creativity
- **25 Hz (Beta-Gamma)**: Associated with alertness and memory

### Research
- Studies show binaural beats can increase focus
- Alpha waves promote relaxation
- Theta waves enhance emotional processing
- Effects vary by individual

---

## 🐛 Troubleshooting

### No Sound?
**Problem**: I don't hear any audio
**Solutions**:
- Check volume slider is above 0%
- Ensure headphones are connected
- Check browser volume isn't muted
- Try refreshing the page
- Check browser console for errors

### Focus Level Not Updating?
**Problem**: Focus level stays at 50%
**Solutions**:
- Make sure you're typing in the browser window
- Check that keyboard events are being captured
- Try clicking in the page first
- Check browser console for errors

### Session Not Saving?
**Problem**: Session doesn't appear in history
**Solutions**:
- Check browser LocalStorage is enabled
- Try clearing browser cache
- Check browser console for errors
- Verify session duration > 10 seconds

### AI Feedback Not Working?
**Problem**: No feedback after session
**Solutions**:
- Verify OpenAI API key in `.env.local`
- Check API key has sufficient credits
- Try without API key (default feedback will show)
- Check browser console for errors

---

## 📚 Learn More

### Documentation
- **README.md** - Project overview
- **QUICK_START.md** - Quick setup guide
- **NEUROFLOW_SETUP.md** - Detailed setup
- **IMPLEMENTATION_GUIDE.md** - Technical details
- **API_REFERENCE.md** - API documentation

### External Resources
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Binaural Beats Research](https://pubmed.ncbi.nlm.nih.gov/)
- [Brain Waves](https://www.healthline.com/health/brain-waves)

---

## 🎉 You're Ready!

You now have everything you need to use NeuroFlow effectively!

### Next Steps
1. ✅ Start your first session
2. ✅ Try all three modes
3. ✅ Check your session history
4. ✅ Export your data
5. ✅ Build focus habits

### Questions?
- Check the troubleshooting section
- Review the documentation
- Check browser console for errors

---

**Happy focusing! 🧠✨**

*NeuroFlow - Where neuroscience meets productivity*

