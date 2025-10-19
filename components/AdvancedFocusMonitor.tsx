'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Eye, Heart, Zap, Brain } from 'lucide-react';
import { type FocusMetrics } from '@/lib/advancedFocusDetector';

interface AdvancedFocusMonitorProps {
  metrics: FocusMetrics | null;
  isActive: boolean;
}

export function AdvancedFocusMonitor({ metrics, isActive }: AdvancedFocusMonitorProps) {
  const [focusHistory, setFocusHistory] = useState<number[]>([]);

  useEffect(() => {
    if (!metrics) return;

    setFocusHistory((prev) => {
      const updated = [...prev, metrics.focusScore];
      return updated.slice(-20); // Keep last 20 readings
    });
  }, [metrics]);

  if (!isActive || !metrics) {
    return (
      <Card className="p-6 bg-slate-900/50 border-slate-700">
        <div className="text-center text-slate-400">
          <p>Enable camera to see advanced focus metrics</p>
        </div>
      </Card>
    );
  }

  const getFocusColor = (score: number) => {
    if (score < 25) return 'from-blue-500 to-cyan-500';
    if (score < 50) return 'from-cyan-500 to-teal-500';
    if (score < 75) return 'from-teal-500 to-emerald-500';
    return 'from-emerald-500 to-green-500';
  };

  const getFocusLabel = (score: number) => {
    if (score < 25) return 'Relaxed';
    if (score < 50) return 'Light Focus';
    if (score < 75) return 'Deep Focus';
    return 'Intense Focus';
  };

  const getBrainwaveLabel = (score: number) => {
    if (score < 25) return 'Alpha (8-12 Hz)';
    if (score < 50) return 'Beta (13-20 Hz)';
    if (score < 75) return 'High Beta (20-30 Hz)';
    return 'Gamma (30-40 Hz)';
  };

  const avgFocus = focusHistory.length > 0 ? Math.round(focusHistory.reduce((a, b) => a + b) / focusHistory.length) : 0;

  return (
    <div className="space-y-4">
      {/* Main Focus Score */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
      >
        <Card className={`p-8 bg-gradient-to-br ${getFocusColor(metrics.focusScore)} bg-opacity-10 border-2 border-${getFocusColor(metrics.focusScore).split(' ')[0]}`}>
          <div className="text-center">
            <p className="text-slate-400 text-sm mb-2">Focus Score</p>
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 100 }}
              className="text-6xl font-bold bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent mb-2"
            >
              {metrics.focusScore}
            </motion.div>
            <p className="text-lg font-semibold text-teal-300">{getFocusLabel(metrics.focusScore)}</p>
            <p className="text-xs text-slate-400 mt-2">{getBrainwaveLabel(metrics.focusScore)}</p>
          </div>

          {/* Progress bar */}
          <div className="mt-6 w-full bg-slate-700 rounded-full h-2 overflow-hidden">
            <motion.div
              className={`h-full bg-gradient-to-r ${getFocusColor(metrics.focusScore)}`}
              initial={{ width: 0 }}
              animate={{ width: `${metrics.focusScore}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </Card>
      </motion.div>

      {/* Detailed Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Eye Openness */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-4 bg-slate-900/50 border-slate-700 hover:border-teal-500/50 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <p className="text-xs text-slate-400">Eye Openness</p>
            </div>
            <p className="text-2xl font-bold text-cyan-300">{Math.round(metrics.eyeOpenness * 100)}%</p>
            <p className="text-xs text-slate-500 mt-1">
              {metrics.eyeOpenness > 0.7 ? '👀 Alert' : metrics.eyeOpenness > 0.4 ? '😐 Normal' : '😴 Tired'}
            </p>
          </Card>
        </motion.div>

        {/* Gaze Direction */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-4 bg-slate-900/50 border-slate-700 hover:border-teal-500/50 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-purple-400" />
              <p className="text-xs text-slate-400">Gaze</p>
            </div>
            <p className="text-2xl font-bold text-purple-300 capitalize">{metrics.gazeDirection}</p>
            <p className="text-xs text-slate-500 mt-1">
              {metrics.gazeDirection === 'center' ? '✓ Focused' : '↗ Distracted'}
            </p>
          </Card>
        </motion.div>

        {/* Blink Rate */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-4 bg-slate-900/50 border-slate-700 hover:border-teal-500/50 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-4 h-4 text-red-400" />
              <p className="text-xs text-slate-400">Blink Rate</p>
            </div>
            <p className="text-2xl font-bold text-red-300">{Math.round(metrics.blinkRate)}</p>
            <p className="text-xs text-slate-500 mt-1">blinks/min</p>
          </Card>
        </motion.div>

        {/* Facial Tension */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-4 bg-slate-900/50 border-slate-700 hover:border-teal-500/50 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <p className="text-xs text-slate-400">Tension</p>
            </div>
            <p className="text-2xl font-bold text-yellow-300">{Math.round(metrics.facialTension * 100)}%</p>
            <p className="text-xs text-slate-500 mt-1">
              {metrics.facialTension > 0.6 ? '😤 High' : metrics.facialTension > 0.3 ? '😐 Normal' : '😌 Relaxed'}
            </p>
          </Card>
        </motion.div>
      </div>

      {/* Focus Trend */}
      <Card className="p-4 bg-slate-900/50 border-slate-700">
        <p className="text-sm text-slate-400 mb-3">Focus Trend (Last 20 readings)</p>
        <div className="flex items-end gap-1 h-16">
          {focusHistory.map((score, i) => (
            <motion.div
              key={i}
              className="flex-1 bg-gradient-to-t from-teal-500 to-emerald-500 rounded-t opacity-70 hover:opacity-100 transition-opacity"
              initial={{ height: 0 }}
              animate={{ height: `${(score / 100) * 100}%` }}
              transition={{ duration: 0.3 }}
              title={`${score}%`}
            />
          ))}
        </div>
        <div className="flex justify-between text-xs text-slate-500 mt-2">
          <span>Min: {focusHistory.length > 0 ? Math.min(...focusHistory) : 0}%</span>
          <span>Avg: {avgFocus}%</span>
          <span>Max: {focusHistory.length > 0 ? Math.max(...focusHistory) : 0}%</span>
        </div>
      </Card>
    </div>
  );
}

