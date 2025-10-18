# NeuroFlow API Reference

## Audio Engine API

### `NeuroFlowAudioEngine`

#### Methods

##### `play(config: AudioConfig): Promise<void>`
Starts playing adaptive soundscape with specified configuration.

```typescript
const config = {
  baseFrequency: 200,
  beatFrequency: 40,
  volume: 0.6,
  mode: 'focus'
};
await audioEngine.play(config);
```

##### `stop(): void`
Stops all audio playback immediately.

```typescript
audioEngine.stop();
```

##### `adaptToFocusLevel(focusLevel: number): void`
Adapts audio based on focus level (0-1 scale).

```typescript
audioEngine.adaptToFocusLevel(0.8); // 80% focus
```

##### `static getConfigForMode(mode: string): AudioConfig`
Returns predefined configuration for a mode.

```typescript
const config = NeuroFlowAudioEngine.getConfigForMode('focus');
```

##### `isAudioPlaying(): boolean`
Returns current playback status.

```typescript
if (audioEngine.isAudioPlaying()) {
  console.log('Audio is playing');
}
```

## Activity Detector API

### `ActivityDetector`

#### Methods

##### `getMetrics(): ActivityMetrics`
Returns current activity metrics.

```typescript
const metrics = activityDetector.getMetrics();
console.log(metrics.focusLevel);    // 0-1
console.log(metrics.typingSpeed);   // KPM
console.log(metrics.sessionDuration); // ms
```

##### `onMetricsChange(callback: Function): void`
Subscribe to metrics changes.

```typescript
activityDetector.onMetricsChange((metrics) => {
  console.log('Focus level:', metrics.focusLevel);
});
```

##### `endSession(): SessionData`
Ends session and returns final metrics.

```typescript
const sessionData = activityDetector.endSession();
console.log(sessionData.focusScore); // 0-100
```

##### `getSessionData(): SessionData`
Returns current session data without ending.

```typescript
const data = activityDetector.getSessionData();
```

##### `reset(): void`
Resets detector for new session.

```typescript
activityDetector.reset();
```

## Session Storage API

### `SessionStorageManager`

#### Static Methods

##### `saveSession(session: SessionData, mode: string, aiSummary?: string): StoredSession`
Saves session to LocalStorage.

```typescript
const stored = SessionStorageManager.saveSession(
  sessionData,
  'focus',
  JSON.stringify(aiSummary)
);
```

##### `getAllSessions(): StoredSession[]`
Retrieves all stored sessions.

```typescript
const sessions = SessionStorageManager.getAllSessions();
```

##### `getSession(id: string): StoredSession | null`
Retrieves specific session by ID.

```typescript
const session = SessionStorageManager.getSession('session_123');
```

##### `getRecentSessions(days: number): StoredSession[]`
Retrieves sessions from last N days.

```typescript
const recent = SessionStorageManager.getRecentSessions(7);
```

##### `getStatistics(): Statistics`
Returns aggregated statistics.

```typescript
const stats = SessionStorageManager.getStatistics();
console.log(stats.averageFocusScore);
console.log(stats.totalFocusTime);
```

##### `deleteSession(id: string): boolean`
Deletes a session.

```typescript
SessionStorageManager.deleteSession('session_123');
```

##### `clearAllSessions(): boolean`
Clears all sessions.

```typescript
SessionStorageManager.clearAllSessions();
```

##### `exportSessions(): string`
Exports all sessions as JSON.

```typescript
const json = SessionStorageManager.exportSessions();
```

##### `exportSessionsAsCSV(): string`
Exports all sessions as CSV.

```typescript
const csv = SessionStorageManager.exportSessionsAsCSV();
```

## AI Feedback API

### `AIFeedbackGenerator`

#### Constructor

```typescript
const generator = new AIFeedbackGenerator(apiKey);
```

#### Methods

##### `generateFeedback(sessionData: SessionData, mode: string): Promise<AIFeedbackResponse>`
Generates AI feedback for a session.

```typescript
const feedback = await aiFeedbackGenerator.generateFeedback(
  sessionData,
  'focus'
);
console.log(feedback.summary);
console.log(feedback.tip);
console.log(feedback.encouragement);
console.log(feedback.nextSteps);
```

## Type Definitions

### AudioConfig
```typescript
interface AudioConfig {
  baseFrequency: number;  // Hz
  beatFrequency: number;  // Hz
  volume: number;         // 0-1
  mode: 'focus' | 'calm' | 'energize';
}
```

### ActivityMetrics
```typescript
interface ActivityMetrics {
  typingSpeed: number;        // KPM
  focusLevel: number;         // 0-1
  isActive: boolean;
  lastActivityTime: number;   // timestamp
  sessionDuration: number;    // ms
}
```

### SessionData
```typescript
interface SessionData {
  startTime: number;
  endTime?: number;
  activities: ActivityEvent[];
  focusScore: number;         // 0-100
  totalTypingTime: number;    // ms
  averageTypingSpeed: number; // KPM
}
```

### StoredSession
```typescript
interface StoredSession extends SessionData {
  id: string;
  mode: 'focus' | 'calm' | 'energize';
  aiSummary?: string;
  savedAt: number;
}
```

### AIFeedbackResponse
```typescript
interface AIFeedbackResponse {
  summary: string;
  tip: string;
  encouragement: string;
  nextSteps: string[];
}
```

## Usage Examples

### Complete Session Flow

```typescript
import { audioEngine } from '@/lib/audioEngine';
import { activityDetector } from '@/lib/activityDetector';
import { SessionStorageManager } from '@/lib/sessionStorage';
import { aiFeedbackGenerator } from '@/lib/aiFeedback';

// 1. Start session
const config = audioEngine.getConfigForMode('focus');
await audioEngine.play(config);

// 2. Subscribe to metrics
activityDetector.onMetricsChange((metrics) => {
  console.log('Focus:', metrics.focusLevel);
  audioEngine.adaptToFocusLevel(metrics.focusLevel);
});

// 3. End session
audioEngine.stop();
const sessionData = activityDetector.endSession();

// 4. Generate feedback
const feedback = await aiFeedbackGenerator.generateFeedback(
  sessionData,
  'focus'
);

// 5. Save session
const stored = SessionStorageManager.saveSession(
  sessionData,
  'focus',
  JSON.stringify(feedback)
);

// 6. View history
const allSessions = SessionStorageManager.getAllSessions();
const stats = SessionStorageManager.getStatistics();
```

## Error Handling

```typescript
try {
  await audioEngine.play(config);
} catch (error) {
  console.error('Audio playback failed:', error);
}

try {
  const feedback = await aiFeedbackGenerator.generateFeedback(
    sessionData,
    'focus'
  );
} catch (error) {
  console.error('AI feedback generation failed:', error);
  // Falls back to default feedback
}
```

## Performance Considerations

- Audio engine uses minimal CPU (~2-5%)
- Activity detection runs efficiently with event listeners
- LocalStorage operations are synchronous (fast)
- AI API calls are async and non-blocking

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support (iOS 14.5+)
- Mobile browsers: ✅ Full support

---

For more information, see `IMPLEMENTATION_GUIDE.md`

