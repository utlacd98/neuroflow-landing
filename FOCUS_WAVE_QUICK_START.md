# 🌊 FocusWaveChart - Quick Start Guide

## 🚀 Get Started in 30 Seconds

### 1. View the Chart
Open your browser and navigate to:
```
http://localhost:3000/dashboard
```

### 2. Start a Session
1. Click **"Start Session"** button
2. Watch the FocusWaveChart appear with smooth animation
3. See real-time data updates every 2 seconds

### 3. Observe Features
- ✅ Beautiful waveform visualization
- ✅ Focus (teal) and Calm (cyan) curves
- ✅ Camera indicator (if camera available)
- ✅ Frequency display (Hz)
- ✅ Statistics at bottom
- ✅ Hover tooltips

---

## 📊 What You're Seeing

### The Chart Shows
- **Focus Intensity**: Teal-to-blue gradient area
- **Calm Intensity**: Cyan-to-blue gradient area
- **Time**: X-axis with time labels
- **Intensity**: Y-axis with 0-100% scale

### Real-Time Updates
- Chart updates every 2 seconds
- Shows last 12 data points
- Smooth animation on new data
- Responsive to your activity

### Statistics
- **Avg Focus**: Average focus level
- **Avg Calm**: Average calm level
- **Data Points**: Total points collected

---

## 🎯 Key Features

### 1. Real-Time Visualization ✅
```
Session Active → Chart Updates → Waveform Animates
```

### 2. Camera Detection ✅
```
Camera Available → "Camera Active" Badge → Frequency Adjusts
```

### 3. Frequency Display ✅
```
Shows current brain wave frequency in Hz
Updates based on camera and activity
```

### 4. Interactive Tooltips ✅
```
Hover over chart → See time + focus/calm values
```

### 5. Responsive Design ✅
```
Mobile → Tablet → Desktop
All screen sizes supported
```

---

## 🎨 Design Highlights

### Colors
- **Focus**: Teal (#14b8a6) → Cyan (#06b6d4) → Blue (#0369a1)
- **Calm**: Cyan (#06b6d4) → Blue (#0284c7) → Dark Blue (#1e40af)
- **Background**: Dark slate with gradient

### Animations
- **Entry**: Smooth fade + upward motion
- **Hover**: Shimmer effect
- **Camera**: Pulse animation
- **Updates**: Smooth area animation

### Layout
- **Responsive**: Full width on all devices
- **Height**: 320px (auto-adjusts)
- **Spacing**: Optimal padding and margins
- **Rounded**: Smooth corners (rounded-xl)

---

## 💡 How It Works

### Data Flow
```
Activity Detector
    ↓
Metrics Updated
    ↓
Chart Data Updated
    ↓
Waveform Animated
    ↓
Statistics Calculated
```

### Camera Detection
```
Browser Check
    ↓
Camera Available?
    ↓
Yes → Set Frequency to 40 Hz (Gamma)
    ↓
Display "Camera Active" Badge
```

### Frequency Adjustment
```
Frequency Changes
    ↓
Focus Value Increases
    ↓
Calm Value Adjusts
    ↓
Chart Updates
```

---

## 🧪 Testing the Component

### Test 1: Basic Display
1. Start session
2. Chart should appear
3. ✅ Pass: Chart visible with data

### Test 2: Real-Time Updates
1. Start session
2. Wait 2 seconds
3. ✅ Pass: New data point appears

### Test 3: Camera Detection
1. Start session
2. Check for "Camera Active" badge
3. ✅ Pass: Badge shows if camera available

### Test 4: Tooltips
1. Start session
2. Hover over chart
3. ✅ Pass: Tooltip appears with data

### Test 5: Responsive
1. Resize browser window
2. Chart should adapt
3. ✅ Pass: Chart responsive on all sizes

---

## 🔧 Customization Quick Tips

### Change Chart Height
```typescript
// In FocusWaveChart.tsx
<div className="relative z-10 w-full h-96">  {/* h-80 → h-96 */}
```

### Change Update Speed
```typescript
// In FocusWaveChart.tsx
}, 2000);  // Change 2000 to desired milliseconds
```

### Change Colors
```typescript
// In FocusWaveChart.tsx
<stop offset="0%" stopColor="#14b8a6" stopOpacity={0.8} />
// Change #14b8a6 to desired color
```

### Change Data Points Retained
```typescript
// In FocusWaveChart.tsx
return [...prevData.slice(-23), newPoint];  // Change -23
```

---

## 📱 Responsive Behavior

### Mobile (< 768px)
- Full width with padding
- Adjusted font sizes
- Touch-friendly tooltips

### Tablet (768px - 1024px)
- Optimal spacing
- Readable labels
- Smooth interactions

### Desktop (> 1024px)
- Maximum width
- Optimal spacing
- Full feature set

---

## 🎬 Animation Details

### Entry Animation
- **Duration**: 600ms
- **Effect**: Fade in + slide up
- **Easing**: Smooth ease-out

### Hover Shimmer
- **Duration**: 1.5s
- **Effect**: Horizontal sweep
- **Repeat**: Continuous on hover

### Camera Pulse
- **Duration**: 2s
- **Effect**: Scale 1 → 1.1 → 1
- **Repeat**: Infinite

### Chart Area
- **Duration**: 800ms
- **Effect**: Fade + upward motion
- **Easing**: Smooth

---

## 🧠 Brain Wave Frequencies

### Supported Frequencies
- **Delta** (2 Hz): Deep rest
- **Theta** (6 Hz): Creativity
- **Alpha** (10 Hz): Relaxed focus
- **Beta** (20 Hz): Active thinking
- **Gamma** (40 Hz): Peak focus

### Frequency Display
Shows in top-right corner:
```
Frequency: 40 Hz
```

---

## 📊 Statistics Explained

### Avg Focus
- Average focus intensity across all data points
- Range: 0-100%
- Higher = More focused

### Avg Calm
- Average calm intensity across all data points
- Range: 0-100%
- Higher = More calm

### Data Points
- Total number of data points collected
- Increases every 2 seconds
- Maximum 12 points displayed

---

## 🚀 Performance Tips

### For Smooth Performance
1. Close unnecessary browser tabs
2. Ensure hardware acceleration enabled
3. Use modern browser (Chrome, Firefox, Safari, Edge)
4. Check internet connection
5. Verify no console errors

### Optimization
- Component uses GPU-accelerated animations
- Efficient re-renders on metrics change
- Minimal memory footprint
- Smooth 60fps animations

---

## 🐛 Troubleshooting

### Chart Not Showing
- ✅ Start a session first
- ✅ Check browser console for errors
- ✅ Verify FocusWaveChart component is imported

### Data Not Updating
- ✅ Ensure session is active
- ✅ Check activity detector is running
- ✅ Verify metrics are being provided

### Camera Badge Not Showing
- ✅ Check browser camera permissions
- ✅ Ensure HTTPS (required for camera)
- ✅ Try different browser

### Animations Not Smooth
- ✅ Enable hardware acceleration
- ✅ Close other applications
- ✅ Check browser performance

---

## 📚 Documentation

### Full Guides
- `FOCUS_WAVE_CHART_GUIDE.md` - Detailed documentation
- `FOCUS_WAVE_CHART_IMPLEMENTATION.md` - Implementation details
- `FOCUS_WAVE_CHART_COMPLETE.md` - Complete overview

### Code Files
- `components/FocusWaveChart.tsx` - Component code
- `components/NeuroFlowDashboard.tsx` - Dashboard integration

---

## 🎯 Next Steps

### Try These
1. ✅ Start a session and watch the chart
2. ✅ Hover over the chart to see tooltips
3. ✅ Check camera indicator
4. ✅ Observe frequency display
5. ✅ View statistics at bottom
6. ✅ Resize browser to test responsiveness

### Explore More
1. Check session history
2. Export session data
3. View AI feedback
4. Try different modes
5. Experiment with volume

---

## 🎉 You're All Set!

The FocusWaveChart is live and ready to visualize your focus journey!

### What You Have
✅ Beautiful real-time waveform visualization
✅ Camera detection with visual feedback
✅ Frequency adaptation
✅ Smooth animations
✅ Responsive design
✅ Interactive tooltips
✅ Statistics display

### Start Visualizing
1. Open http://localhost:3000/dashboard
2. Click "Start Session"
3. Watch your focus waveform come to life!

---

## 📞 Need Help?

1. Check the troubleshooting section above
2. Review the full documentation files
3. Check browser console for errors
4. Verify all dependencies are installed
5. Ensure dev server is running

---

**Status**: ✅ Ready to Use

**Last Updated**: 2025-10-18

Let's visualize focus! 🌊✨

