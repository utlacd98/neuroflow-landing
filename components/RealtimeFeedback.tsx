'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { AlertCircle, TrendingUp, Zap, Brain, Volume2 } from 'lucide-react';

interface FeedbackMessage {
  id: string;
  type: 'surge' | 'drop' | 'stabilize' | 'tempo' | 'reward' | 'warning';
  message: string;
  icon: React.ReactNode;
  color: string;
  duration: number; // ms
}

interface FrequencyInfo {
  frequency: number;
  brainWave: string;
  mentalState: string;
  color: string;
}

interface RealtimeFeedbackProps {
  frequency: number;
  focusLevel: number;
  isPlaying: boolean;
  messages?: FeedbackMessage[];
}

const frequencyMap: Record<string, FrequencyInfo> = {
  delta: {
    frequency: 2,
    brainWave: 'Delta',
    mentalState: 'Deep Sleep',
    color: 'from-purple-600 to-purple-400',
  },
  theta: {
    frequency: 6,
    brainWave: 'Theta',
    mentalState: 'Creativity',
    color: 'from-blue-600 to-blue-400',
  },
  alpha: {
    frequency: 10,
    brainWave: 'Alpha',
    mentalState: 'Relaxed Focus',
    color: 'from-green-600 to-green-400',
  },
  beta: {
    frequency: 20,
    brainWave: 'Beta',
    mentalState: 'Active Thinking',
    color: 'from-yellow-600 to-yellow-400',
  },
  gamma: {
    frequency: 40,
    brainWave: 'Gamma',
    mentalState: 'Peak Focus',
    color: 'from-red-600 to-red-400',
  },
};

export function RealtimeFeedback({ frequency, focusLevel, isPlaying, messages = [] }: RealtimeFeedbackProps) {
  const [displayMessages, setDisplayMessages] = useState<FeedbackMessage[]>([]);
  const [frequencyInfo, setFrequencyInfo] = useState<FrequencyInfo>(frequencyMap.gamma);

  // Update frequency info based on current frequency
  useEffect(() => {
    let mode = 'gamma';
    if (frequency <= 4) mode = 'delta';
    else if (frequency <= 8) mode = 'theta';
    else if (frequency <= 12) mode = 'alpha';
    else if (frequency <= 30) mode = 'beta';

    setFrequencyInfo(frequencyMap[mode]);
  }, [frequency]);

  // Handle message display with auto-removal
  useEffect(() => {
    if (messages.length > 0) {
      const newMessage = messages[messages.length - 1];
      setDisplayMessages((prev) => [...prev, newMessage]);

      const timer = setTimeout(() => {
        setDisplayMessages((prev) => prev.filter((m) => m.id !== newMessage.id));
      }, newMessage.duration);

      return () => clearTimeout(timer);
    }
  }, [messages]);

  const getMessageColor = (type: string) => {
    switch (type) {
      case 'surge':
        return 'bg-green-500/20 border-green-500/50 text-green-300';
      case 'drop':
        return 'bg-orange-500/20 border-orange-500/50 text-orange-300';
      case 'stabilize':
        return 'bg-blue-500/20 border-blue-500/50 text-blue-300';
      case 'tempo':
        return 'bg-purple-500/20 border-purple-500/50 text-purple-300';
      case 'reward':
        return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300';
      case 'warning':
        return 'bg-red-500/20 border-red-500/50 text-red-300';
      default:
        return 'bg-slate-500/20 border-slate-500/50 text-slate-300';
    }
  };

  return (
    <div className="space-y-4">
      {/* Frequency-Mood Mapping */}
      {isPlaying && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="relative"
        >
          <Card className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 border-slate-700/50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${frequencyInfo.color}`}>
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-300">Current Frequency</p>
                  <p className="text-lg font-bold text-white">
                    {frequency.toFixed(0)} Hz ({frequencyInfo.brainWave})
                  </p>
                  <p className="text-xs text-slate-400">{frequencyInfo.mentalState}</p>
                </div>
              </div>

              {/* Focus Level Indicator */}
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${focusLevel * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-cyan-400">{Math.round(focusLevel * 100)}%</span>
                </div>
                <p className="text-xs text-slate-400">Focus Level</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Real-time Feedback Messages */}
      <AnimatePresence>
        {displayMessages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className={`border rounded-lg p-3 flex items-center gap-3 ${getMessageColor(msg.type)}`}
          >
            <div className="flex-shrink-0">{msg.icon}</div>
            <p className="text-sm font-medium flex-1">{msg.message}</p>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Frequency Band Legend */}
      {isPlaying && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 gap-2 text-xs"
        >
          {Object.entries(frequencyMap).map(([key, info]) => (
            <div
              key={key}
              className={`p-2 rounded border ${
                frequencyInfo.brainWave === info.brainWave
                  ? `bg-gradient-to-r ${info.color} border-opacity-100`
                  : 'bg-slate-800/50 border-slate-700/50'
              }`}
            >
              <p className={frequencyInfo.brainWave === info.brainWave ? 'text-white font-semibold' : 'text-slate-400'}>
                {info.brainWave}
              </p>
              <p className={frequencyInfo.brainWave === info.brainWave ? 'text-white/80' : 'text-slate-500'}>
                {info.frequency} Hz
              </p>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

