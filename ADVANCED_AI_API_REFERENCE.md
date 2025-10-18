# 📚 Advanced AI Systems - Complete API Reference

## 🧠 Focus Pattern Learner

**File**: `lib/focusPatternLearner.ts`

### Methods

#### `recordSession(duration, focusDropTime, frequency, successRate)`
Records a completed session for pattern analysis.

```typescript
focusPatternLearner.recordSession(45, 22, 40, 0.85);
```

**Parameters**:
- `duration` (number): Session duration in minutes
- `focusDropTime` (number): When focus dipped (minutes into session)
- `frequency` (number): Brain wave frequency used (Hz)
- `successRate` (number): Focus level achieved (0-1)

---

#### `predictFocusDip()`
Predicts when focus will dip based on patterns.

```typescript
const prediction = focusPatternLearner.predictFocusDip();
// {
//   predictedTime: 22,
//   confidence: 0.8,
//   suggestedFrequency: 10,
//   suggestedAction: 'frequency_change',
//   reason: 'Based on your afternoon patterns...'
// }
```

**Returns**: `FocusDipPrediction | null`

---

#### `getPreSessionRecommendations()`
Gets personalized recommendations before starting a session.

```typescript
const rec = focusPatternLearner.getPreSessionRecommendations();
// {
//   suggestedFrequency: 40,
//   expectedDuration: 45,
//   tip: 'Morning is your peak focus time. Great choice!'
// }
```

**Returns**: `{ suggestedFrequency, expectedDuration, tip }`

---

#### `getConcentrationRhythm()`
Gets your personal concentration rhythm.

```typescript
const rhythm = focusPatternLearner.getConcentrationRhythm();
// {
//   patterns: [...],
//   peakHours: ['morning'],
//   lowEnergyHours: ['afternoon'],
//   personalizedFrequency: 40,
//   learningConfidence: 0.85
// }
```

**Returns**: `ConcentrationRhythm`

---

#### `getLearningProgress()`
Gets learning progress and statistics.

```typescript
const progress = focusPatternLearner.getLearningProgress();
// {
//   sessionsAnalyzed: 15,
//   patternsLearned: 8,
//   learningConfidence: 75,
//   personalizedFrequency: 40,
//   peakHours: ['morning'],
//   lowEnergyHours: ['afternoon']
// }
```

**Returns**: Learning progress object

---

## 🎮 Gamification Engine

**File**: `lib/gamificationEngine.ts`

### Methods

#### `completeSession(duration, focusLevel, mode, frequency)`
Awards XP and checks for badge unlocks.

```typescript
const result = gamificationEngine.completeSession(45, 0.85, 'focus', 40);
// {
//   xpEarned: 550,
//   levelUp: true,
//   newBadges: [{ id: 'zen_master', name: 'Zen Master', ... }],
//   streakContinued: true
// }
```

**Parameters**:
- `duration` (number): Session duration in minutes
- `focusLevel` (number): Focus level achieved (0-1)
- `mode` (string): Session mode ('focus', 'calm', 'energize')
- `frequency` (number): Brain wave frequency used (Hz)

**Returns**: `{ xpEarned, levelUp, newBadges, streakContinued }`

---

#### `getLevelProgress()`
Gets current level and XP progress.

```typescript
const level = gamificationEngine.getLevelProgress();
// {
//   currentLevel: 3,
//   currentXP: 450,
//   xpToNextLevel: 550,
//   progress: 0.45
// }
```

**Returns**: Level progress object

---

#### `getStreakInfo()`
Gets streak information and motivational message.

```typescript
const streak = gamificationEngine.getStreakInfo();
// {
//   currentStreak: 7,
//   longestStreak: 15,
//   streakMessage: '7 days in a row — your neural rhythm is evolving!'
// }
```

**Returns**: Streak info object

---

#### `getStats()`
Gets all user statistics.

```typescript
const stats = gamificationEngine.getStats();
// {
//   totalXP: 2450,
//   level: 3,
//   currentStreak: 7,
//   longestStreak: 15,
//   totalSessions: 20,
//   totalFocusTime: 900,
//   averageFocusLevel: 0.78,
//   badges: [...],
//   achievements: [...]
// }
```

**Returns**: `UserStats`

---

## 📈 AI Insights Engine

**File**: `lib/aiInsightsEngine.ts`

### Methods

#### `recordSession(duration, focusLevel, mode, frequency)`
Records session for analysis.

```typescript
aiInsightsEngine.recordSession(45, 0.85, 'focus', 40);
```

---

#### `generateSessionNarrative(duration, focusLevel, focusDropTime, mode)`
Generates personalized session narrative.

```typescript
const narrative = aiInsightsEngine.generateSessionNarrative(45, 0.85, 22, 'focus');
// {
//   title: '🔥 Peak Flow Session',
//   narrative: 'You began with strong focus...',
//   mentalStateJourney: 'You began with strong focus...',
//   keyInsights: [
//     'Exceptional focus stability',
//     'Gamma waves supporting peak cognitive processing'
//   ],
//   recommendations: [
//     'Try extending next session by 5-10 minutes',
//     'You\'re in flow — maintain momentum'
//   ]
// }
```

**Returns**: `SessionNarrative`

---

#### `getProgressMetrics()`
Gets weekly and monthly progress metrics.

```typescript
const metrics = aiInsightsEngine.getProgressMetrics();
// {
//   weeklyAvgFocus: 0.78,
//   weeklyTrend: 'improving',
//   monthlyAvgFocus: 0.75,
//   monthlyTrend: 'stable',
//   timeInEachMode: { focus: 180, calm: 120, energize: 60 },
//   focusDurationTrend: [0.7, 0.75, 0.8, 0.82, 0.85, 0.83, 0.85]
// }
```

**Returns**: `ProgressMetrics`

---

#### `createGoal(name, targetFocusLevel, targetDuration)`
Creates a focus goal.

```typescript
const goal = aiInsightsEngine.createGoal(
  'Maintain 80% focus for 25 min',
  0.8,
  25
);
// {
//   id: 'goal_1729270800000',
//   name: 'Maintain 80% focus for 25 min',
//   targetFocusLevel: 0.8,
//   targetDuration: 25,
//   createdAt: 1729270800000,
//   completedSessions: 0,
//   currentStreak: 0,
//   bestStreak: 0
// }
```

**Returns**: `FocusGoal`

---

#### `getGoals()`
Gets all focus goals.

```typescript
const goals = aiInsightsEngine.getGoals();
// [
//   {
//     id: 'goal_123',
//     name: 'Maintain 80% focus for 25 min',
//     completedSessions: 3,
//     currentStreak: 2,
//     bestStreak: 5
//   }
// ]
```

**Returns**: `FocusGoal[]`

---

## 🔊 Audio Fusion Engine

**File**: `lib/audioFusionEngine.ts`

### Methods

#### `createAdaptiveFusion(focusLevel, frequency)`
Creates adaptive audio fusion based on focus level.

```typescript
const fusion = audioFusionEngine.createAdaptiveFusion(0.85, 40);
// {
//   layers: [
//     { type: 'binaural', frequency: 40, volume: 0.6, intensity: 0.85 },
//     { type: 'ambient', frequency: 20, volume: 0.255, intensity: 0.85 },
//     { type: 'instrumental', frequency: 80, volume: 0.17, intensity: 0.85 },
//     { type: 'nature', frequency: 10, volume: 0.1275, intensity: 0.85 }
//   ],
//   complexity: 0.85,
//   environmentAdapted: false
// }
```

**Returns**: `AudioFusion`

---

#### `adaptToEnvironment()`
Detects environment noise and adapts audio.

```typescript
const env = await audioFusionEngine.adaptToEnvironment();
// {
//   noiseLevel: 0.3,
//   ambientFrequency: 220,
//   recommendedComplexity: 0.85
// }
```

**Returns**: `EnvironmentMetrics`

---

#### `setFrequencyPreference(mode, frequency)`
Sets user's preferred frequency for a mode.

```typescript
audioFusionEngine.setFrequencyPreference('focus', 40);
```

---

#### `getFrequencyPreference(mode)`
Gets user's preferred frequency for a mode.

```typescript
const freq = audioFusionEngine.getFrequencyPreference('focus');
// 40
```

**Returns**: `number`

---

#### `savePlaylist(name, fusion)`
Saves current audio state as a playlist.

```typescript
audioFusionEngine.savePlaylist('Flow Morning', fusion);
```

---

#### `loadPlaylist(name)`
Loads a saved playlist.

```typescript
const saved = audioFusionEngine.loadPlaylist('Flow Morning');
// { layers: [...], complexity: 0.85, ... }
```

**Returns**: `AudioFusion | null`

---

#### `getSavedPlaylists()`
Gets all saved playlists.

```typescript
const playlists = audioFusionEngine.getSavedPlaylists();
// [
//   { name: 'Flow Morning', fusion: {...} },
//   { name: 'Calm Evening', fusion: {...} }
// ]
```

**Returns**: `Array<{ name, fusion }>`

---

## 🔄 Complete Integration Example

```typescript
import { focusPatternLearner } from '@/lib/focusPatternLearner';
import { gamificationEngine } from '@/lib/gamificationEngine';
import { aiInsightsEngine } from '@/lib/aiInsightsEngine';
import { audioFusionEngine } from '@/lib/audioFusionEngine';

// Session starts
const rec = focusPatternLearner.getPreSessionRecommendations();
console.log('Suggested frequency:', rec.suggestedFrequency);

// During session
const fusion = audioFusionEngine.createAdaptiveFusion(focusLevel, frequency);
await audioFusionEngine.adaptToEnvironment();

// Session ends
focusPatternLearner.recordSession(duration, focusDropTime, frequency, focusLevel);
const gamification = gamificationEngine.completeSession(duration, focusLevel, mode, frequency);
const narrative = aiInsightsEngine.generateSessionNarrative(duration, focusLevel, focusDropTime, mode);

// Display results
console.log('XP Earned:', gamification.xpEarned);
console.log('Level Up:', gamification.levelUp);
console.log('Narrative:', narrative.title);
console.log('Streak:', gamificationEngine.getStreakInfo().currentStreak);
```

---

**Status**: ✅ Complete API Reference

**All Methods**: 20+

**All Systems**: 4

**Ready to Integrate**: Yes

