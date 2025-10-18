/**
 * Neuroscience-Focused Prompts for NeuroFlow AI Feedback
 * Specialized prompts for each brain wave mode with personalized insights
 */

export const NEUROSCIENCE_SYSTEM_PROMPT = `You are an expert neuroscience-based productivity coach specializing in focus optimization and brain wave enhancement.

Your expertise includes:
- Brain wave frequencies (Alpha, Beta, Gamma, Theta waves)
- Binaural beats and their effects on cognition
- Focus and concentration enhancement techniques
- Stress reduction and relaxation methods
- Productivity patterns and optimization
- Circadian rhythms and optimal work times
- Neuroplasticity and habit formation

You provide personalized, evidence-based feedback based on:
- Focus scores (0-100)
- Session duration and patterns
- Typing speed and activity levels
- Mode used (Focus/Calm/Energize)
- Brain wave frequency exposure

Keep responses concise (max 120 tokens), actionable, and encouraging.
Format responses as JSON with keys: summary, tip, encouragement, nextSteps (array of 2-3 items).`;

export const DELTA_MODE_PROMPT_TEMPLATE = (sessionData: any) => `
You are analyzing a Delta Mode (0.5-4 Hz) session.

Session Data:
- Duration: ${Math.round(sessionData.totalTypingTime / 60000)} minutes
- Focus Score: ${sessionData.focusScore}/100
- Activity Level: ${sessionData.activities.length > 30 ? 'Active' : 'Relaxed'}
- Session Type: Deep Rest/Recovery

Delta waves (0.5-4 Hz) enhance:
- Deep sleep and subconscious processing
- Physical recovery and healing
- Restorative rest
- Stress relief and relaxation

Provide feedback that:
1. Acknowledges their rest and recovery
2. Explains how delta waves promote deep relaxation
3. Gives one specific recovery technique
4. Suggests optimal times for delta sessions
5. Encourages regular rest practices

Format as JSON: {summary, tip, encouragement, nextSteps}
`;

export const THETA_MODE_PROMPT_TEMPLATE = (sessionData: any) => `
You are analyzing a Theta Mode (4-8 Hz) session.

Session Data:
- Duration: ${Math.round(sessionData.totalTypingTime / 60000)} minutes
- Focus Score: ${sessionData.focusScore}/100
- Activity Level: ${sessionData.activities.length > 50 ? 'High' : sessionData.activities.length > 20 ? 'Medium' : 'Low'}
- Session Type: Meditation/Flow State

Theta waves (4-8 Hz) enhance:
- Creativity and imagination
- Meditation and mindfulness
- Early sleep and dream states
- Intuitive thinking
- Flow state experiences

Provide feedback that:
1. Acknowledges their creative state
2. Explains how theta waves enhance creativity
3. Gives one specific meditation or flow technique
4. Suggests ways to harness creative insights
5. Encourages regular theta practice

Format as JSON: {summary, tip, encouragement, nextSteps}
`;

export const ALPHA_MODE_PROMPT_TEMPLATE = (sessionData: any) => `
You are analyzing an Alpha Mode (8-12 Hz) session.

Session Data:
- Duration: ${Math.round(sessionData.totalTypingTime / 60000)} minutes
- Focus Score: ${sessionData.focusScore}/100
- Activity Level: ${sessionData.activities.length > 40 ? 'Active' : 'Moderate'}
- Session Type: Relaxed Focus

Alpha waves (8-12 Hz) enhance:
- Relaxed alertness and calm focus
- Creative thinking and problem-solving
- Stress relief and anxiety reduction
- Mindful awareness
- Optimal learning state

Provide feedback that:
1. Acknowledges their balanced state
2. Explains how alpha waves enable relaxed focus
3. Gives one specific technique for maintaining alpha
4. Suggests optimal tasks for alpha state
5. Encourages consistent alpha practice

Format as JSON: {summary, tip, encouragement, nextSteps}
`;

export const BETA_MODE_PROMPT_TEMPLATE = (sessionData: any) => `
You are analyzing a Beta Mode (12-30 Hz) session.

Session Data:
- Duration: ${Math.round(sessionData.totalTypingTime / 60000)} minutes
- Focus Score: ${sessionData.focusScore}/100
- Activity Level: ${sessionData.activities.length > 60 ? 'Very High' : 'High'}
- Session Type: Active Thinking

Beta waves (12-30 Hz) enhance:
- Active thinking and problem-solving
- Logical analysis and reasoning
- Productivity and task completion
- Memory formation
- Cognitive flexibility

Provide feedback that:
1. Acknowledges their active thinking state
2. Explains how beta waves enhance productivity
3. Gives one specific technique for sustained focus
4. Suggests optimal tasks for beta state
5. Encourages balanced work-rest cycles

Format as JSON: {summary, tip, encouragement, nextSteps}
`;

export const FOCUS_MODE_PROMPT_TEMPLATE = (sessionData: any) => `
You are analyzing a Focus Mode (40 Hz Gamma waves) session.

Session Data:
- Duration: ${Math.round(sessionData.totalTypingTime / 60000)} minutes
- Focus Score: ${sessionData.focusScore}/100
- Average Typing Speed: ${Math.round(sessionData.averageTypingSpeed)} keystrokes/min
- Total Activities: ${sessionData.activities.length}
- Activity Intensity: ${sessionData.activities.length > 50 ? 'High' : sessionData.activities.length > 20 ? 'Medium' : 'Low'}

Gamma waves (40 Hz) enhance:
- Deep focus and concentration
- Problem-solving abilities
- Attention to detail
- Cognitive processing speed

Provide feedback that:
1. Acknowledges their focus achievement
2. Explains how gamma waves helped their session
3. Gives one specific tip to deepen focus
4. Suggests next steps for maintaining momentum
5. Encourages continued practice

Format as JSON: {summary, tip, encouragement, nextSteps}
`;

export const CALM_MODE_PROMPT_TEMPLATE = (sessionData: any) => `
You are analyzing a Calm Mode (10 Hz Alpha waves) session.

Session Data:
- Duration: ${Math.round(sessionData.totalTypingTime / 60000)} minutes
- Focus Score: ${sessionData.focusScore}/100
- Activity Level: ${sessionData.activities.length > 30 ? 'Active' : 'Relaxed'}
- Session Type: Relaxation/Meditation

Alpha waves (10 Hz) enhance:
- Relaxation and stress reduction
- Creative thinking
- Light meditation state
- Emotional regulation
- Mindfulness

Provide feedback that:
1. Acknowledges their relaxation achievement
2. Explains how alpha waves promoted calm
3. Gives one specific relaxation technique
4. Suggests ways to integrate calm sessions into routine
5. Encourages mindfulness practice

Format as JSON: {summary, tip, encouragement, nextSteps}
`;

export const ENERGIZE_MODE_PROMPT_TEMPLATE = (sessionData: any) => `
You are analyzing an Energize Mode (25 Hz Beta-Gamma waves) session.

Session Data:
- Duration: ${Math.round(sessionData.totalTypingTime / 60000)} minutes
- Focus Score: ${sessionData.focusScore}/100
- Activity Level: ${sessionData.activities.length > 50 ? 'Very High' : 'High'}
- Energy Boost: Significant

Beta-Gamma waves (25 Hz) enhance:
- Mental alertness and energy
- Memory formation
- Creative problem-solving
- Motivation and drive
- Cognitive flexibility

Provide feedback that:
1. Acknowledges their energy and motivation
2. Explains how beta-gamma waves boosted performance
3. Gives one specific tip to maintain energy
4. Suggests optimal times for energize sessions
5. Encourages sustained momentum

Format as JSON: {summary, tip, encouragement, nextSteps}
`;

export const GENERAL_FEEDBACK_PROMPT = (sessionData: any, mode: string) => `
You are analyzing a ${mode} mode session.

Session Data:
- Duration: ${Math.round(sessionData.totalTypingTime / 60000)} minutes
- Focus Score: ${sessionData.focusScore}/100
- Activities: ${sessionData.activities.length}

Provide personalized feedback that:
1. Summarizes the session
2. Gives one actionable tip
3. Encourages continued use
4. Suggests next steps

Format as JSON: {summary, tip, encouragement, nextSteps}
`;

/**
 * Get the appropriate prompt template for the given brain wave mode
 */
export function getPromptForMode(sessionData: any, mode: 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma'): string {
  switch (mode) {
    case 'delta':
      return DELTA_MODE_PROMPT_TEMPLATE(sessionData);
    case 'theta':
      return THETA_MODE_PROMPT_TEMPLATE(sessionData);
    case 'alpha':
      return ALPHA_MODE_PROMPT_TEMPLATE(sessionData);
    case 'beta':
      return BETA_MODE_PROMPT_TEMPLATE(sessionData);
    case 'gamma':
      return GAMMA_MODE_PROMPT_TEMPLATE(sessionData);
    default:
      return GENERAL_FEEDBACK_PROMPT(sessionData, mode);
  }
}

/**
 * Neuroscience tips based on focus level
 */
export const NEUROSCIENCE_TIPS = {
  lowFocus: [
    'Take a 5-minute break to reset your focus',
    'Try the Pomodoro technique: 25 min focus + 5 min break',
    'Increase ambient sound or use binaural beats',
    'Ensure proper hydration and nutrition',
  ],
  mediumFocus: [
    'You\'re in a good flow state - maintain momentum',
    'Consider a 90-minute deep work session',
    'Use the Energize mode to boost motivation',
    'Track your peak focus times for future sessions',
  ],
  highFocus: [
    'Excellent focus! You\'re in deep flow',
    'Protect this time - minimize distractions',
    'Consider extending your session if possible',
    'Document what worked for future reference',
  ],
};

/**
 * Brain wave frequency information - All 5 types
 */
export const BRAIN_WAVE_INFO = {
  delta: {
    frequency: '2 Hz',
    range: '0.5-4 Hz',
    mentalState: 'Deep sleep, subconscious',
    benefits: ['Deep rest', 'Physical recovery', 'Healing', 'Stress relief'],
    duration: '30-60 minutes optimal',
    bestFor: 'Sleep, recovery, deep relaxation',
    useCase: 'Calm/Rest mode for relaxation & recovery',
  },
  theta: {
    frequency: '6 Hz',
    range: '4-8 Hz',
    mentalState: 'Creativity, meditation, early sleep',
    benefits: ['Creativity', 'Meditation', 'Flow states', 'Intuition'],
    duration: '20-45 minutes optimal',
    bestFor: 'Creative work, meditation, flow states',
    useCase: 'Meditation & flow states',
  },
  alpha: {
    frequency: '10 Hz',
    range: '8-12 Hz',
    mentalState: 'Relaxed alertness, creativity',
    benefits: ['Relaxation', 'Creativity', 'Calm focus', 'Emotional regulation'],
    duration: '15-45 minutes optimal',
    bestFor: 'Stress relief, creative thinking, learning',
    useCase: 'Ideal for focus & stress relief',
  },
  beta: {
    frequency: '20 Hz',
    range: '12-30 Hz',
    mentalState: 'Active thinking, problem solving',
    benefits: ['Alertness', 'Memory', 'Productivity', 'Cognitive flexibility'],
    duration: '20-45 minutes optimal',
    bestFor: 'Active work, problem-solving, productivity',
    useCase: 'Energize & productivity mode',
  },
  gamma: {
    frequency: '40 Hz',
    range: '30-100 Hz',
    mentalState: 'Peak focus, cognitive processing',
    benefits: ['Deep focus', 'Problem-solving', 'Attention', 'Cognitive processing'],
    duration: '20-60 minutes optimal',
    bestFor: 'Complex tasks, learning, analysis',
    useCase: 'Deep-focus or "flow" mode',
  },
};

/**
 * Productivity insights based on session patterns
 */
export function getProductivityInsight(sessionData: any): string {
  const focusScore = sessionData.focusScore || 0;
  const duration = sessionData.totalTypingTime / 60000; // minutes
  const activityCount = sessionData.activities.length;

  if (focusScore > 80 && duration > 30) {
    return 'You achieved excellent focus! Your brain is in optimal gamma wave state for deep work.';
  } else if (focusScore > 60 && duration > 20) {
    return 'Good focus session! You maintained consistent attention throughout.';
  } else if (focusScore > 40) {
    return 'Moderate focus. Consider using the Energize mode to boost your concentration.';
  } else {
    return 'Light session. Try the Focus mode with binaural beats for deeper concentration.';
  }
}

/**
 * Recommendation based on mode and performance
 */
export function getNextSessionRecommendation(sessionData: any, mode: string): string {
  const focusScore = sessionData.focusScore || 0;

  if (mode === 'focus' && focusScore > 70) {
    return 'Continue with Focus mode - you\'re in an excellent state for deep work!';
  } else if (mode === 'calm' && focusScore < 50) {
    return 'Try the Energize mode next to boost your energy levels.';
  } else if (mode === 'energize' && focusScore > 75) {
    return 'Maintain this momentum! Consider a longer Energize session.';
  } else {
    return 'Mix up your modes - try a different frequency for variety and optimal brain stimulation.';
  }
}

