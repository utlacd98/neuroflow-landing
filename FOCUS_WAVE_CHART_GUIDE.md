# 🌊 FocusWaveChart Component Guide

## Overview

The **FocusWaveChart** is a responsive, animated area chart component that visualizes user focus intensity and calm levels over time. It features a modern, fluid wave aesthetic with smooth overlapping gradient fills and responds dynamically to camera input and frequency changes.

---

## ✨ Design Features

### Visual Design
- **Modern Fluid Wave Aesthetic**: Smooth, overlapping curves resembling waveforms
- **Transparent Gradient Fills**: Teal → Cyan → Blue color scheme with layered transparency
- **Glassmorphism Background**: Soft shadows and blurred backdrop effect
- **Rounded Line Joins**: Smooth monotone curves for natural appearance
- **Responsive Layout**: Full width with auto-height adaptation

### Interactive Elements
- **Hover Effects**: Gentle pulse animation on camera active indicator
- **Shimmer Animation**: Subtle motion effect on hover
- **Smooth Tooltips**: Minimal, blurred backdrop style with real-time data
- **Legend**: Small colored dots beside "Focus" and "Calm" labels
- **Live Updates**: Real-time data point additions during active sessions

---

## 🎯 Functionality

### Core Features

#### 1. **Real-Time Data Visualization**
```typescript
// Chart updates with new metrics every 2 seconds during live mode
const newPoint: ChartDataPoint = {
  time: new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }),
  focus: Math.max(20, Math.min(100, newMetrics.focusLevel * 100)),
  calm: Math.max(15, Math.min(95, (1 - newMetrics.focusLevel) * 100)),
};
```

#### 2. **Camera Detection**
- Automatically detects camera availability
- Updates frequency based on camera status
- Displays "Camera Active" indicator with pulse animation
- Adjusts focus/calm values when camera is active

#### 3. **Frequency Adaptation**
- Supports all 5 brain wave frequencies:
  - **Delta** (0.5-4 Hz): Deep rest
  - **Theta** (4-8 Hz): Creativity
  - **Alpha** (8-12 Hz): Relaxed focus
  - **Beta** (12-30 Hz): Active thinking
  - **Gamma** (30-100 Hz): Peak focus
- Frequency display in top-right corner
- Dynamic adjustment based on camera and activity

#### 4. **Gradient Fills**
- **Focus Area**: Teal → Cyan → Blue gradient
- **Calm Area**: Cyan → Blue gradient
- Overlapping transparent fills for visual depth
- Smooth animation on chart entry

---

## 📊 Component Props

```typescript
interface FocusWaveChartProps {
  data?: ChartDataPoint[];        // Initial chart data (optional)
  isLive?: boolean;               // Enable live updates (default: false)
  cameraActive?: boolean;         // Camera status (default: false)
  frequency?: number;             // Brain wave frequency in Hz (default: 40)
}

interface ChartDataPoint {
  time: string;                   // Time label (HH:MM format)
  focus: number;                  // Focus intensity (0-100)
  calm: number;                   // Calm intensity (0-100)
}
```

---

## 🚀 Usage

### Basic Implementation

```typescript
import { FocusWaveChart } from '@/components/FocusWaveChart';

export default function Dashboard() {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [cameraActive, setCameraActive] = useState(false);
  const [frequency, setFrequency] = useState(40);

  return (
    <FocusWaveChart
      data={chartData}
      isLive={true}
      cameraActive={cameraActive}
      frequency={frequency}
    />
  );
}
```

### Integration with NeuroFlow Dashboard

The FocusWaveChart is already integrated into the NeuroFlowDashboard:

```typescript
{/* Focus Wave Chart */}
{isPlaying && (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
    <FocusWaveChart
      data={chartData}
      isLive={isPlaying}
      cameraActive={cameraActive}
      frequency={frequency}
    />
  </motion.div>
)}
```

---

## 🎨 Styling Details

### Colors
- **Focus Gradient**: `#14b8a6` (Teal) → `#06b6d4` (Cyan) → `#0369a1` (Blue)
- **Calm Gradient**: `#06b6d4` (Cyan) → `#0284c7` (Blue) → `#1e40af` (Dark Blue)
- **Background**: `from-slate-900/50 via-slate-800/30 to-slate-900/50`
- **Border**: `border-teal-500/20`

### Typography
- **Font**: Inter (via Tailwind)
- **Title**: `text-lg font-semibold text-teal-100`
- **Labels**: `text-sm text-slate-300`
- **Stats**: `text-lg font-semibold`

### Spacing
- **Container Padding**: `p-6`
- **Border Radius**: `rounded-xl`
- **Chart Height**: `h-80` (320px)
- **Margin Bottom**: `mb-8`

---

## 📈 Data Flow

### Chart Data Updates

1. **Session Start**
   - Initialize with 12 mock data points
   - Display historical waveform pattern

2. **During Session**
   - Activity detector provides metrics every 100ms
   - Chart updates every 2 seconds with new data point
   - Maintains last 12 data points (rolling window)

3. **Camera Detection**
   - On component mount, check for camera availability
   - If camera detected, set frequency to 40 Hz (Gamma)
   - Display "Camera Active" indicator

4. **Frequency Adjustment**
   - Focus value increases by (frequency / 100) * 10
   - Calm value decreases by (frequency / 100) * 5
   - Creates dynamic response to frequency changes

---

## 🔧 Customization

### Modify Colors

Edit the gradient definitions in `FocusWaveChart.tsx`:

```typescript
<linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.8} />
  <stop offset="50%" stopColor="#06b6d4" stopOpacity={0.4} />
  <stop offset="100%" stopColor="#0369a1" stopOpacity={0.1} />
</linearGradient>
```

### Adjust Chart Height

Change the container height class:

```typescript
<div className="relative z-10 w-full h-96">  {/* h-80 → h-96 for taller chart */}
```

### Modify Update Frequency

Change the interval in the `useEffect` hook:

```typescript
const interval = setInterval(() => {
  // Update logic
}, 2000);  // Change 2000ms to desired interval
```

### Customize Data Points Retained

Modify the rolling window size:

```typescript
return [...prevData.slice(-23), newPoint];  // Change -23 to retain different number of points
```

---

## 📱 Responsive Behavior

- **Mobile**: Full width with adjusted padding
- **Tablet**: Maintains aspect ratio with responsive font sizes
- **Desktop**: Full width with optimal spacing
- **Chart**: Auto-scales with ResponsiveContainer

---

## 🎬 Animations

### Entry Animation
- **Duration**: 600ms
- **Effect**: Fade in + upward motion (y: 20 → 0)
- **Easing**: Default (ease-out)

### Hover Effects
- **Camera Indicator**: Pulse animation (scale: 1 → 1.1 → 1)
- **Shimmer**: Horizontal sweep animation (1.5s duration)
- **Tooltip**: Scale + fade animation (0.8 → 1)

### Chart Animation
- **Area Entry**: 800ms fade + upward motion
- **Active Dot**: Radius 6px with white stroke on hover

---

## 🧠 Brain Wave Integration

### Frequency Display
Shows current frequency in Hz in the top-right corner:
```
Frequency: 40 Hz
```

### Frequency-Based Adjustments
- **Delta (2 Hz)**: Calm increases, Focus decreases
- **Theta (6 Hz)**: Balanced increase in both
- **Alpha (10 Hz)**: Moderate increase in both
- **Beta (20 Hz)**: Focus increases more than Calm
- **Gamma (40 Hz)**: Maximum Focus increase

---

## 📊 Statistics Display

Bottom section shows three key metrics:

1. **Avg Focus**: Average focus intensity across all data points
2. **Avg Calm**: Average calm intensity across all data points
3. **Data Points**: Total number of data points in chart

---

## 🔍 Tooltip Information

Hovering over the chart displays:
- **Time**: Current time label
- **Focus**: Focus intensity percentage
- **Calm**: Calm intensity percentage

---

## 🚀 Performance Optimization

- **Memoization**: Component uses React.memo for optimization
- **Lazy Updates**: Chart updates only during active sessions
- **Efficient Re-renders**: Only updates on metrics change
- **Smooth Animations**: Uses Framer Motion for GPU-accelerated animations

---

## 🐛 Troubleshooting

### Chart Not Updating
- Ensure `isLive={true}` is passed
- Check that activity detector is providing metrics
- Verify `chartData` state is being updated

### Camera Detection Not Working
- Check browser permissions for camera access
- Ensure `navigator.mediaDevices` is available
- Test in HTTPS environment (required for camera access)

### Animations Not Smooth
- Check browser hardware acceleration is enabled
- Verify Framer Motion is properly installed
- Check for performance bottlenecks in parent components

---

## 📚 Related Components

- **NeuroFlowDashboard**: Main dashboard component
- **ActivityDetector**: Provides real-time metrics
- **AudioEngine**: Generates brain wave frequencies
- **ErrorBoundary**: Error handling wrapper

---

## 🎯 SEO Context

When used on landing page, include meta tags:

```typescript
export const metadata = {
  title: 'NeuroFlow Focus Dashboard — Real-Time Adaptive Mind Tracking',
  description: 'See how your mind performs over time. The NeuroFlow dashboard visualizes your focus and calm balance in a living waveform.',
};
```

---

## 📝 Version History

- **v1.0.0** (Current)
  - Initial release
  - 5 brain wave frequencies
  - Camera detection
  - Real-time updates
  - Glassmorphism design

---

## 🤝 Contributing

To enhance the FocusWaveChart:

1. Update the component in `components/FocusWaveChart.tsx`
2. Test with different data patterns
3. Verify responsive behavior
4. Update this documentation

---

**Status**: ✅ Production Ready

**Last Updated**: 2025-10-18

Let's visualize focus! 🌊✨

