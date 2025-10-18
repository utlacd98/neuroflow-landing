'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface ChartDataPoint {
  time: string;
  focus: number;
  calm: number;
}

interface FocusWaveChartProps {
  data?: ChartDataPoint[];
  isLive?: boolean;
  cameraActive?: boolean;
  frequency?: number;
}

/**
 * FocusWaveChart Component
 * Visualizes focus and calm intensity over time with smooth overlapping gradient fills
 * Responds to camera input and frequency changes
 */
export function FocusWaveChart({
  data: initialData,
  isLive = false,
  cameraActive = false,
  frequency = 40,
}: FocusWaveChartProps) {
  const [data, setData] = useState<ChartDataPoint[]>(initialData || generateMockData());
  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null);

  // Generate mock data for demo
  function generateMockData(): ChartDataPoint[] {
    const points: ChartDataPoint[] = [];
    for (let i = 0; i < 24; i++) {
      const time = `${String(i).padStart(2, '0')}:00`;
      // Create wave-like patterns
      const focusBase = 50 + 30 * Math.sin((i / 24) * Math.PI * 2);
      const calmBase = 40 + 25 * Math.cos((i / 24) * Math.PI * 2);

      points.push({
        time,
        focus: Math.max(20, Math.min(100, focusBase + Math.random() * 10)),
        calm: Math.max(15, Math.min(95, calmBase + Math.random() * 10)),
      });
    }
    return points;
  }

  // Update data when live mode is active
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      setData((prevData) => {
        const newPoint: ChartDataPoint = {
          time: new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          focus: Math.max(20, Math.min(100, 50 + Math.random() * 50)),
          calm: Math.max(15, Math.min(95, 40 + Math.random() * 50)),
        };

        // Keep last 24 points
        return [...prevData.slice(-23), newPoint];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isLive]);

  // Adjust frequency based on camera activity
  useEffect(() => {
    if (cameraActive && data.length > 0) {
      setData((prevData) =>
        prevData.map((point) => ({
          ...point,
          focus: Math.min(100, point.focus + (frequency / 100) * 10),
          calm: Math.max(0, point.calm - (frequency / 100) * 5),
        }))
      );
    }
  }, [cameraActive, frequency]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900/95 backdrop-blur-md border border-teal-500/30 rounded-lg p-3 shadow-lg"
        >
          <p className="text-slate-300 text-sm font-medium">{payload[0].payload.time}</p>
          <p className="text-teal-300 text-sm">
            Focus: <span className="font-semibold">{Math.round(payload[0].value)}%</span>
          </p>
          <p className="text-cyan-300 text-sm">
            Calm: <span className="font-semibold">{Math.round(payload[1].value)}%</span>
          </p>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full h-full"
    >
      <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-slate-900/50 via-slate-800/30 to-slate-900/50 backdrop-blur-sm border border-teal-500/20 p-6 shadow-2xl">
        {/* Glassmorphism background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-cyan-500/5 pointer-events-none" />

        {/* Header */}
        <div className="relative z-10 mb-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-teal-100">Focus Intensity Waveform</h3>
            <div className="flex items-center gap-3">
              {cameraActive && (
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/50 rounded-full"
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-xs text-red-300 font-medium">Camera Active</span>
                </motion.div>
              )}
              <div className="text-xs text-slate-400">
                Frequency: <span className="text-teal-300 font-semibold">{frequency} Hz</span>
              </div>
            </div>
          </div>
          <p className="text-sm text-slate-400">Real-time adaptive audio driven by your activity</p>
        </div>

        {/* Legend */}
        <div className="relative z-10 flex gap-6 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400" />
            <span className="text-sm text-slate-300">Focus</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400" />
            <span className="text-sm text-slate-300">Calm</span>
          </div>
        </div>

        {/* Chart Container */}
        <div className="relative z-10 w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              onMouseMove={(state: any) => {
                if (state.isTooltipActive) {
                  setHoveredPoint(state.activeTooltipIndex);
                }
              }}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              <defs>
                {/* Focus gradient - Teal to Cyan */}
                <linearGradient id="focusGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.8} />
                  <stop offset="50%" stopColor="#06b6d4" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#0369a1" stopOpacity={0.1} />
                </linearGradient>

                {/* Calm gradient - Cyan to Blue */}
                <linearGradient id="calmGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.7} />
                  <stop offset="50%" stopColor="#0284c7" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#1e40af" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />

              <XAxis
                dataKey="time"
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
                tick={{ fill: '#cbd5e1' }}
              />

              <YAxis
                stroke="#94a3b8"
                style={{ fontSize: '12px' }}
                tick={{ fill: '#cbd5e1' }}
                domain={[0, 100]}
                label={{ value: 'Intensity (%)', angle: -90, position: 'insideLeft' }}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* Focus Area - Teal/Cyan */}
              <Area
                type="monotone"
                dataKey="focus"
                stroke="#14b8a6"
                strokeWidth={2}
                fill="url(#focusGradient)"
                isAnimationActive={true}
                animationDuration={800}
                dot={false}
                activeDot={{
                  r: 6,
                  fill: '#14b8a6',
                  stroke: '#ffffff',
                  strokeWidth: 2,
                }}
              />

              {/* Calm Area - Cyan/Blue */}
              <Area
                type="monotone"
                dataKey="calm"
                stroke="#06b6d4"
                strokeWidth={2}
                fill="url(#calmGradient)"
                isAnimationActive={true}
                animationDuration={800}
                dot={false}
                activeDot={{
                  r: 6,
                  fill: '#06b6d4',
                  stroke: '#ffffff',
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Hover effect shimmer */}
        {hoveredPoint !== null && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none rounded-xl"
            animate={{ x: ['0%', '100%'] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}

        {/* Bottom stats */}
        <div className="relative z-10 mt-6 grid grid-cols-3 gap-4 pt-4 border-t border-teal-500/10">
          <div className="text-center">
            <p className="text-xs text-slate-400 mb-1">Avg Focus</p>
            <p className="text-lg font-semibold text-teal-300">
              {Math.round(data.reduce((sum, d) => sum + d.focus, 0) / data.length)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400 mb-1">Avg Calm</p>
            <p className="text-lg font-semibold text-cyan-300">
              {Math.round(data.reduce((sum, d) => sum + d.calm, 0) / data.length)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-slate-400 mb-1">Data Points</p>
            <p className="text-lg font-semibold text-blue-300">{data.length}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

