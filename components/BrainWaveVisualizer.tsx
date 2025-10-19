'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { brainWaveAnalyzer, type BrainWaveData } from '@/lib/brainWaveAnalyzer';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface BrainWaveVisualizerProps {
  frequency: number;
  focusLevel: number;
  typingSpeed: number;
  isPlaying: boolean;
}

export function BrainWaveVisualizer({
  frequency,
  focusLevel,
  typingSpeed,
  isPlaying,
}: BrainWaveVisualizerProps) {
  const [currentWave, setCurrentWave] = useState<BrainWaveData>(
    brainWaveAnalyzer.getBrainWaveByType('alpha')
  );
  const [waveformData, setWaveformData] = useState<any[]>([]);
  const [spectrumData, setSpectrumData] = useState<any[]>([]);
  const [intensity, setIntensity] = useState(0);

  useEffect(() => {
    if (!isPlaying) return;

    // Analyze brain wave
    const wave = brainWaveAnalyzer.analyzeBrainWave(frequency);
    setCurrentWave(wave);

    // Calculate intensity
    const newIntensity = brainWaveAnalyzer.calculateIntensity(focusLevel, typingSpeed);
    setIntensity(newIntensity);

    // Generate waveform data (sample every 100 points for performance)
    const fullWaveform = brainWaveAnalyzer.generateWaveform(frequency, 500);
    const sampledWaveform = fullWaveform
      .filter((_, i) => i % 100 === 0)
      .map((point, i) => ({
        time: i,
        amplitude: point.amplitude,
      }));
    setWaveformData(sampledWaveform);

    // Get spectrum data
    const spectrum = brainWaveAnalyzer.getSpectrum(frequency, newIntensity);
    const sampledSpectrum = spectrum
      .filter((_, i) => i % 5 === 0)
      .map((point) => ({
        frequency: point.frequency,
        magnitude: Math.round(point.magnitude * 100),
      }));
    setSpectrumData(sampledSpectrum);
  }, [frequency, focusLevel, typingSpeed, isPlaying]);

  if (!isPlaying) {
    return (
      <Card className="p-6 bg-slate-900/50 border-slate-700">
        <div className="text-center text-slate-400">
          <p>Start a session to see brain wave visualization</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Brain Wave Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {/* Brain Wave Status */}
        <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
              style={{ backgroundColor: currentWave.color + '20', borderColor: currentWave.color }}
            >
              🧠
            </div>
            <div>
              <p className="text-slate-400 text-sm">Current Brain Wave</p>
              <h3 className="text-2xl font-bold text-white">{currentWave.label}</h3>
              <p className="text-sm text-slate-400">{currentWave.description}</p>
              <p className="text-xs text-slate-500 mt-1">{frequency.toFixed(1)} Hz</p>
            </div>
          </div>
        </Card>

        {/* Intensity Meter */}
        <Card className="p-6 bg-gradient-to-br from-slate-900/50 to-slate-800/50 border-slate-700">
          <p className="text-slate-400 text-sm mb-3">Signal Intensity</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-white font-semibold">{Math.round(intensity * 100)}%</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-teal-500 to-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${intensity * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Waveform Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="p-6 bg-slate-900/50 border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Real-time Waveform</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={waveformData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="amplitude"
                stroke={currentWave.color}
                dot={false}
                isAnimationActive={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Frequency Spectrum */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6 bg-slate-900/50 border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Frequency Spectrum</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={spectrumData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="frequency" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="magnitude" fill={currentWave.color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </motion.div>

      {/* Brain Wave Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6 bg-slate-900/50 border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Brain Wave Types</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {brainWaveAnalyzer.getAllBrainWaves().map((wave) => (
              <div
                key={wave.type}
                className={`p-3 rounded-lg border-2 transition-all ${
                  currentWave.type === wave.type
                    ? 'border-teal-500 bg-teal-950/30'
                    : 'border-slate-700 bg-slate-800/30'
                }`}
              >
                <p className="font-semibold text-white text-sm">{wave.label}</p>
                <p className="text-xs text-slate-400">{wave.frequency} Hz</p>
                <p className="text-xs text-slate-500 mt-1">{wave.description}</p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

