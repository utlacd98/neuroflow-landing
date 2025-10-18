/**
 * AI Feedback Generator
 * Uses OpenAI API to generate personalized focus summaries
 */

import type { SessionData } from './activityDetector';
import { NEUROSCIENCE_SYSTEM_PROMPT, getPromptForMode } from './prompts';
import { errorHandler } from './errorHandler';

export interface AIFeedbackRequest {
  focusScore: number;
  sessionDuration: number;
  averageTypingSpeed: number;
  mode: 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma';
  totalActivities: number;
}

export interface AIFeedbackResponse {
  summary: string;
  tip: string;
  encouragement: string;
  nextSteps: string[];
}

export class AIFeedbackGenerator {
  private apiKey: string;
  private model = 'gpt-4o-mini'; // Using mini for cost efficiency

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY || '';
  }

  /**
   * Generate AI feedback for a session
   */
  async generateFeedback(sessionData: SessionData, mode: 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma'): Promise<AIFeedbackResponse> {
    if (!this.apiKey) {
      return this.getDefaultFeedback(sessionData, mode);
    }

    try {
      const prompt = this.buildPrompt(sessionData, mode);
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            {
              role: 'system',
              content: NEUROSCIENCE_SYSTEM_PROMPT,
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 120,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const errorMsg = `OpenAI API error: ${response.status} ${response.statusText}`;
        errorHandler.handleAPIError(
          { message: errorMsg, status: response.status },
          { mode, sessionDuration: sessionData.totalTypingTime }
        );
        return this.getDefaultFeedback(sessionData, mode);
      }

      const data = await response.json();
      const content = data.choices[0]?.message?.content;

      if (!content) {
        throw new Error('No content in API response');
      }

      return this.parseAIResponse(content, sessionData, mode);
    } catch (error) {
      errorHandler.handleAPIError(
        error,
        { mode, sessionDuration: sessionData.totalTypingTime }
      );
      return this.getDefaultFeedback(sessionData, mode);
    }
  }

  private buildPrompt(sessionData: SessionData, mode: string): string {
    // Use specialized neuroscience-focused prompts based on mode
    return getPromptForMode(sessionData, mode as 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma');
  }

  private parseAIResponse(content: string, sessionData: SessionData, mode: string): AIFeedbackResponse {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          summary: parsed.summary || '',
          tip: parsed.tip || '',
          encouragement: parsed.encouragement || '',
          nextSteps: Array.isArray(parsed.nextSteps) ? parsed.nextSteps : [],
        };
      }
    } catch (e) {
      console.error('Failed to parse AI response:', e);
    }

    return this.getDefaultFeedback(sessionData, mode);
  }

  private getDefaultFeedback(sessionData: SessionData, mode: string): AIFeedbackResponse {
    const durationMinutes = Math.round(sessionData.totalTypingTime / 60000);
    const focusScore = sessionData.focusScore;

    const feedbackMap: Record<string, AIFeedbackResponse> = {
      delta: {
        summary: `Excellent deep rest session! You spent ${durationMinutes} minutes in delta wave state with a focus score of ${focusScore}/100.`,
        tip: 'Delta waves promote deep sleep and physical recovery. Use this mode before bed for better sleep quality.',
        encouragement: 'Prioritizing rest is crucial for long-term health and productivity!',
        nextSteps: [
          'Use delta mode 30-60 minutes before sleep',
          'Combine with relaxation techniques',
          'Track your sleep quality improvements',
        ],
      },
      theta: {
        summary: `Great creative session! You spent ${durationMinutes} minutes in theta wave state with a focus score of ${focusScore}/100.`,
        tip: 'Theta waves enhance creativity and meditation. Use this mode for brainstorming and creative work.',
        encouragement: 'Your creative potential is unlocking with theta wave stimulation!',
        nextSteps: [
          'Use theta mode for creative projects',
          'Combine with meditation practices',
          'Journal your creative insights',
        ],
      },
      alpha: {
        summary: `Perfect balance achieved! You maintained relaxed focus for ${durationMinutes} minutes with a focus score of ${focusScore}/100.`,
        tip: 'Alpha waves create the ideal state for learning and stress relief. Use this mode for optimal productivity.',
        encouragement: 'You\'ve found the sweet spot between relaxation and focus!',
        nextSteps: [
          'Use alpha mode for learning new skills',
          'Combine with light reading or study',
          'Practice daily for consistent results',
        ],
      },
      beta: {
        summary: `Productive session complete! You maintained active thinking for ${durationMinutes} minutes with a focus score of ${focusScore}/100.`,
        tip: 'Beta waves enhance problem-solving and productivity. Use this mode for analytical work and task completion.',
        encouragement: 'Your productivity is at peak levels with beta wave stimulation!',
        nextSteps: [
          'Use beta mode for complex problem-solving',
          'Combine with physical movement',
          'Track your productivity metrics',
        ],
      },
      gamma: {
        summary: `Exceptional deep focus achieved! You maintained peak concentration for ${durationMinutes} minutes with a focus score of ${focusScore}/100.`,
        tip: 'Gamma waves enable deep focus and cognitive processing. Use this mode for your most challenging tasks.',
        encouragement: 'You\'ve reached peak cognitive performance with gamma wave stimulation!',
        nextSteps: [
          'Use gamma mode for complex learning',
          'Tackle your most challenging projects',
          'Build on this momentum with consistent practice',
        ],
      },
    };

    return feedbackMap[mode] || feedbackMap.gamma;
  }
}

export const aiFeedbackGenerator = new AIFeedbackGenerator();

