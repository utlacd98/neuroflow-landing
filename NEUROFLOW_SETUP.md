# NeuroFlow - AI-Powered Adaptive Focus Companion

## 🧠 Project Overview

NeuroFlow is an adaptive focus and relaxation companion that uses typing rhythm detection and AI-generated soundscapes to enhance concentration and calm. The app dynamically adjusts binaural beats and ambient sounds based on your activity patterns in real-time.

### Core Features

- **🎵 Adaptive Audio Engine**: Real-time binaural beats using Web Audio API
- **🔍 Activity Detection**: Tracks typing rhythm and focus patterns
- **🤖 AI Feedback**: OpenAI-powered personalized session summaries
- **📊 Session Analytics**: Track focus scores, typing speed, and patterns
- **💾 Local Storage**: Persistent session history with export options
- **📱 Responsive UI**: Works on desktop and mobile devices

## 🧬 Neuroscience Behind NeuroFlow

### Brain Wave Frequencies

**Focus Mode (Flow State)**
- Gamma waves (40 Hz): Enhanced attention and concentration
- Binaural beats at 40 Hz proven to increase attentional focus
- Base frequency: 200 Hz with 40 Hz beat difference

**Calm Mode (Relaxation)**
- Alpha waves (7-12 Hz): Relaxation and light meditation
- Theta waves (4-8 Hz): Deep relaxation and emotional processing
- Base frequency: 200 Hz with 10 Hz beat difference

**Energize Mode (Motivation)**
- Beta-Gamma transition (30-40 Hz): Alertness and memory
- Binaural beats at 25 Hz for energy boost
- Base frequency: 200 Hz with 25 Hz beat difference

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/pnpm
- OpenAI API key (optional, for AI feedback)

### Installation

1. **Clone and navigate to project**
   ```bash
   cd neuroflow-landing
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your OpenAI API key
   ```

4. **Run development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open in browser**
   - Landing page: http://localhost:3000
   - Dashboard: http://localhost:3000/dashboard
   - History: http://localhost:3000/history

## 📁 Project Structure

```
neuroflow-landing/
├── app/
│   ├── page.tsx              # Landing page
│   ├── dashboard/
│   │   └── page.tsx          # Main dashboard
│   ├── history/
│   │   └── page.tsx          # Session history
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── NeuroFlowDashboard.tsx # Main dashboard component
│   ├── SessionHistory.tsx     # History component
│   └── ui/                    # Shadcn UI components
├── lib/
│   ├── audioEngine.ts        # Web Audio API engine
│   ├── activityDetector.ts   # Activity tracking
│   ├── sessionStorage.ts     # LocalStorage management
│   └── aiFeedback.ts         # OpenAI integration
├── public/                    # Static assets
└── package.json              # Dependencies
```

## 🎯 Core Components

### Audio Engine (`lib/audioEngine.ts`)
- Generates binaural beats using Web Audio API
- Supports three modes: focus, calm, energize
- Real-time audio adaptation based on focus level
- Smooth frequency transitions

### Activity Detector (`lib/activityDetector.ts`)
- Tracks keyboard and mouse activity
- Calculates focus level (0-1 scale)
- Measures typing speed (KPM)
- Detects idle periods (5-second threshold)

### Session Storage (`lib/sessionStorage.ts`)
- Saves sessions to browser LocalStorage
- Calculates focus scores and statistics
- Export to JSON and CSV formats
- Maintains up to 100 sessions

### AI Feedback (`lib/aiFeedback.ts`)
- Integrates with OpenAI GPT-4o-mini
- Generates personalized summaries (max 120 tokens)
- Provides tips and encouragement
- Fallback to default feedback if API unavailable

## 🎮 How to Use

### Starting a Session

1. Navigate to `/dashboard`
2. Select a mode: Focus, Calm, or Energize
3. Adjust volume (0-100%)
4. Click "Start Session"
5. Begin typing or working
6. Audio adapts in real-time to your activity

### Viewing History

1. Navigate to `/history`
2. View statistics and session list
3. Filter by mode (Focus, Calm, Energize)
4. Export data as JSON or CSV
5. Delete individual sessions

### Session Metrics

- **Focus Level**: Real-time focus score (0-100%)
- **Typing Speed**: Keystrokes per minute
- **Session Time**: Total duration
- **Status**: Active or Idle

## 🔧 Configuration

### Audio Modes

Edit `lib/audioEngine.ts` to customize frequencies:

```typescript
static getConfigForMode(mode: 'focus' | 'calm' | 'energize'): AudioConfig {
  const configs = {
    focus: {
      baseFrequency: 200,
      beatFrequency: 40,  // Adjust for different effect
      volume: 0.6,
      mode: 'focus',
    },
    // ... other modes
  };
}
```

### Activity Detection

Edit `lib/activityDetector.ts` to adjust thresholds:

```typescript
private idleThreshold = 5000; // 5 seconds before idle
```

### Storage Limits

Edit `lib/sessionStorage.ts`:

```typescript
const MAX_SESSIONS = 100; // Maximum stored sessions
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically on push

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 📊 Future Enhancements

- [ ] Backend API for cloud sync
- [ ] Supabase integration for user accounts
- [ ] Advanced analytics dashboard
- [ ] Custom soundscape creation
- [ ] Social features (share sessions)
- [ ] Mobile app (React Native)
- [ ] Wearable integration (heart rate, EEG)
- [ ] Machine learning for personalization

## 🤝 Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License - feel free to use for personal or commercial projects

## 🆘 Troubleshooting

### Audio not playing?
- Check browser permissions for audio
- Ensure you've clicked to initialize AudioContext
- Check browser console for errors

### Focus level not updating?
- Ensure you're typing in the browser window
- Check that activity detection is enabled
- Verify keyboard events are being captured

### AI feedback not generating?
- Verify OpenAI API key is set in `.env.local`
- Check API key has sufficient credits
- Review OpenAI API status page

## 📞 Support

For issues or questions:
- Check the troubleshooting section
- Review browser console for errors
- Open an issue on GitHub

---

**Built with ❤️ for focus and productivity**

