# NeuroFlow Testing Guide

## 🚀 Server Running on Port 3001

**URL**: http://localhost:3001

---

## 📋 Testing Checklist

### Step 1: Landing Page (http://localhost:3001)

**Visual Elements**:
- [ ] Hero section with "Find Your Flow" headline
- [ ] "Launch App" button (green gradient)
- [ ] "Get Early Access" button
- [ ] Floating particles animation
- [ ] Wave animations in background

**How It Works Section**:
- [ ] 3 cards showing: Detects Focus, Adapts Sound, AI Insights
- [ ] Hover effects on cards
- [ ] Icons visible

**Features Grid Section** (NEW):
- [ ] 6 feature cards visible:
  - 🧠 AI-Powered
  - 🎧 Binaural Beats
  - 📊 Analytics
  - ⚡ Real-Time
  - 💚 Wellness
  - 📈 Progress
- [ ] Hover effects work
- [ ] Icons display correctly

**Benefits Section**:
- [ ] 3 benefit cards (Flow, Calm, Energize)
- [ ] Feature lists visible
- [ ] Gradient backgrounds
- [ ] Hover animations work

**Testimonials Section** (ENHANCED):
- [ ] 3 testimonial cards
- [ ] ⭐⭐⭐⭐⭐ 5-star ratings visible
- [ ] Quotes display correctly
- [ ] Author names and roles shown

**Pricing Section**:
- [ ] Free Tier card
- [ ] Pro Tier card (highlighted)
- [ ] Feature lists visible
- [ ] CTA buttons present

**Footer**:
- [ ] Copyright text
- [ ] Links (Terms, Privacy, Contact)

---

### Step 2: Dashboard (http://localhost:3001/dashboard)

**Header**:
- [ ] "NeuroFlow" title visible
- [ ] Headphones icon
- [ ] Page loads without errors

**Mode Selection**:
- [ ] 3 mode buttons visible:
  - 🧠 Flow Mode
  - 💚 Calm Mode
  - ⚡ Energize Mode
- [ ] Buttons are clickable
- [ ] Selected mode is highlighted

**Volume Control**:
- [ ] Volume slider visible (0-100%)
- [ ] Default value is 60%
- [ ] Slider is draggable
- [ ] Value updates when dragged

**Session Controls**:
- [ ] "Start Session" button visible
- [ ] Button is clickable
- [ ] No errors in console

**Metrics Display**:
- [ ] Focus Level card (0-100%)
- [ ] Typing Speed card (KPM)
- [ ] Session Time card
- [ ] Status indicator

---

### Step 3: Start a Session

**Before Starting**:
1. Select a mode (e.g., Focus Mode)
2. Set volume to 50-70%
3. Put on headphones

**Click "Start Session"**:
- [ ] Button changes to "Stop Session"
- [ ] Audio starts playing (check headphones)
- [ ] Metrics start updating
- [ ] No console errors

**While Session Running**:
- [ ] Type in the page
- [ ] Focus Level should increase
- [ ] Typing Speed should update
- [ ] Session Time increases
- [ ] Audio continues playing

**Audio Quality**:
- [ ] Sound is smooth
- [ ] No crackling or distortion
- [ ] Volume is appropriate
- [ ] Binaural effect noticeable

---

### Step 4: Stop Session

**Click "Stop Session"**:
- [ ] Audio stops
- [ ] Session Summary appears
- [ ] AI Feedback displays:
  - [ ] Summary text
  - [ ] Tip
  - [ ] Encouragement
  - [ ] Next Steps

**Session Data**:
- [ ] Focus Score displayed (0-100)
- [ ] Total Time shown
- [ ] Average Typing Speed shown
- [ ] Session saved to history

---

### Step 5: History Page (http://localhost:3001/history)

**Page Load**:
- [ ] Page loads without errors
- [ ] History title visible
- [ ] Statistics dashboard shows

**Statistics**:
- [ ] Total Sessions count
- [ ] Average Focus Score
- [ ] Total Focus Time
- [ ] Average Session Duration

**Sessions List**:
- [ ] Your session appears in list
- [ ] Session date/time shown
- [ ] Mode displayed (Focus/Calm/Energize)
- [ ] Focus Score shown
- [ ] Duration shown

**Session Details**:
- [ ] Click on session to expand
- [ ] AI Summary displays
- [ ] Metrics visible
- [ ] Delete button present

**Export Functionality**:
- [ ] "Export as JSON" button works
- [ ] "Export as CSV" button works
- [ ] Files download correctly

---

## 🧪 Advanced Testing

### Test Different Modes

**Focus Mode (40 Hz)**:
- [ ] Audio plays at 40 Hz binaural beat
- [ ] Good for concentration
- [ ] Typing increases focus level

**Calm Mode (10 Hz)**:
- [ ] Audio plays at 10 Hz binaural beat
- [ ] Relaxing effect
- [ ] Lower intensity than Focus

**Energize Mode (25 Hz)**:
- [ ] Audio plays at 25 Hz binaural beat
- [ ] Energizing effect
- [ ] Higher intensity

### Test Activity Detection

**Typing**:
- [ ] Focus level increases with typing
- [ ] Typing speed updates
- [ ] Metrics refresh in real-time

**Idle**:
- [ ] Focus level decreases when idle
- [ ] After 5 seconds of no typing
- [ ] Smooth transition

**Mouse Movement**:
- [ ] Mouse clicks register
- [ ] Activity detected
- [ ] Metrics update

### Test Storage

**Session Persistence**:
- [ ] Refresh page
- [ ] History still shows sessions
- [ ] Data persists in LocalStorage

**Multiple Sessions**:
- [ ] Start multiple sessions
- [ ] All appear in history
- [ ] Statistics update correctly

---

## 🐛 Debugging

### Check Browser Console (F12)

**Look for**:
- [ ] No red errors
- [ ] No TypeScript errors
- [ ] Audio context initialized
- [ ] Activity detector running

**Common Issues**:
- "window is not defined" → Fixed ✅
- "getConfigForMode is not a function" → Fixed ✅
- "AudioContext not supported" → Check browser

### Check Network Tab

- [ ] All resources load (200 status)
- [ ] No failed requests
- [ ] API calls successful (if using OpenAI)

### Check Application Tab

**LocalStorage**:
- [ ] Sessions stored
- [ ] Data persists
- [ ] No quota exceeded

---

## ✅ Success Criteria

All of the following should work:

- [x] Landing page loads and displays correctly
- [x] Dashboard loads without errors
- [x] Audio plays in all three modes
- [x] Activity detection works
- [x] Focus level updates with typing
- [x] Session saves to history
- [x] AI feedback generates
- [x] Export functionality works
- [x] Mobile responsive
- [x] No console errors

---

## 📊 Expected Results

### Landing Page
- Beautiful, modern design
- Smooth animations
- All sections visible
- Responsive on mobile

### Dashboard
- Clean interface
- Real-time metrics
- Smooth audio playback
- Responsive controls

### History
- Session list displays
- Statistics accurate
- Export works
- Data persists

---

## 🎉 You're Ready to Test!

Open http://localhost:3001 and start testing!

**Report any issues**:
1. Check console for errors (F12)
2. Check troubleshooting guide
3. Verify all steps completed

---

**Happy testing! 🧠✨**

*NeuroFlow - Where neuroscience meets productivity*

