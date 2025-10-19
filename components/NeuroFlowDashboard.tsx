'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, RotateCcw, Download, Brain, Headphones, Zap, Heart, Camera } from 'lucide-react';
import { audioEngine, FocusyncAudioEngine, type AudioConfig } from '@/lib/audioEngine';
import { activityDetector, type ActivityMetrics } from '@/lib/activityDetector';
import { SessionStorageManager } from '@/lib/sessionStorage';
import { aiFeedbackGenerator } from '@/lib/aiFeedback';
import { FocusWaveChart } from '@/components/FocusWaveChart';
import { PlaylistSelector } from '@/components/PlaylistSelector';
import { BrainWaveVisualizer } from '@/components/BrainWaveVisualizer';
import { playlistLibrary, type Playlist } from '@/lib/playlistLibrary';
import { cameraMotionDetector, type MotionData } from '@/lib/cameraMotionDetector';

interface ChartDataPoint {
  time: string;
  focus: number;
  calm: number;
}

// Map user-friendly modes to brain wave frequencies
const modeToFrequency = (mode: 'focus' | 'calm' | 'energize'): 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma' => {
  const map: Record<'focus' | 'calm' | 'energize', 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma'> = {
    focus: 'gamma',      // Focus mode uses Gamma waves (40 Hz)
    calm: 'alpha',       // Calm mode uses Alpha waves (10 Hz)
    energize: 'beta',    // Energize mode uses Beta waves (20 Hz)
  };
  return map[mode];
};

export default function FocusyncDashboard() {
  const [mode, setMode] = useState<'focus' | 'calm' | 'energize'>('focus');
  const [isPlaying, setIsPlaying] = useState(false);
  const [metrics, setMetrics] = useState<ActivityMetrics>({
    typingSpeed: 0,
    focusLevel: 0.5,
    isActive: false,
    lastActivityTime: 0,
    sessionDuration: 0,
  });
  const [volume, setVolume] = useState(0.6);
  const [sessionSummary, setSessionSummary] = useState<any>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [frequency, setFrequency] = useState(40);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [showPlaylistSelector, setShowPlaylistSelector] = useState(false);

  // Initialize chart data
  useEffect(() => {
    const initialData: ChartDataPoint[] = [];
    for (let i = 0; i < 12; i++) {
      const time = `${String(i).padStart(2, '0')}:00`;
      initialData.push({
        time,
        focus: 50 + Math.random() * 30,
        calm: 40 + Math.random() * 25,
      });
    }
    setChartData(initialData);
  }, []);

  // Subscribe to activity metrics and update chart
  useEffect(() => {
    activityDetector.onMetricsChange((newMetrics) => {
      setMetrics(newMetrics);

      // Update chart data with new metrics
      if (isPlaying) {
        setChartData((prevData) => {
          const newPoint: ChartDataPoint = {
            time: new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
            }),
            focus: Math.max(20, Math.min(100, newMetrics.focusLevel * 100)),
            calm: Math.max(15, Math.min(95, (1 - newMetrics.focusLevel) * 100)),
          };
          return [...prevData.slice(-11), newPoint];
        });
      }

      // Adapt audio based on focus level
      if (isPlaying) {
        audioEngine.adaptToFocusLevel(newMetrics.focusLevel);
      }
    });
  }, [isPlaying]);

  // Initialize camera motion detection
  useEffect(() => {
    const initCamera = async () => {
      try {
        const success = await cameraMotionDetector.initialize();
        if (success) {
          setCameraActive(true);

          // Listen for motion data
          cameraMotionDetector.onMotionDetected((motionData: MotionData) => {
            // Update frequency based on motion
            const newFrequency = 10 + motionData.movementIntensity * 0.3; // 10-40 Hz
            setFrequency(newFrequency);

            // Update focus level based on motion
            setMetrics(prev => ({
              ...prev,
              focusLevel: Math.min(1, prev.focusLevel + motionData.motionLevel * 0.05),
            }));
          });
        } else {
          setCameraActive(false);
        }
      } catch (error) {
        console.error('Camera initialization error:', error);
        setCameraActive(false);
      }
    };

    initCamera();

    return () => {
      if (cameraMotionDetector.isActive()) {
        cameraMotionDetector.stop();
      }
    };
  }, []);

  // Handle playlist selection
  const handlePlaylistSelect = (playlist: Playlist) => {
    setCurrentPlaylist(playlist);
    setShowPlaylistSelector(false);

    // Apply playlist audio layers
    const config: AudioConfig = {
      baseFrequency: playlist.layers[0]?.frequency || 200,
      beatFrequency: playlist.layers[1]?.frequency || 40,
      volume: volume,
      mode: mode,
    };

    if (isPlaying) {
      audioEngine.stop();
      audioEngine.play(config);
    }
  };

  const handlePlayPause = async () => {
    if (isPlaying) {
      try {
        audioEngine.stop();
      } catch (error) {
        console.error('Error stopping audio:', error);
      }
      setIsPlaying(false);

      // End session and generate summary
      const sessionData = activityDetector.endSession();
      const frequencyMode = modeToFrequency(mode);
      const aiSummary = await aiFeedbackGenerator.generateFeedback(sessionData, frequencyMode);
      const stored = SessionStorageManager.saveSession(sessionData, mode, JSON.stringify(aiSummary));

      setSessionSummary(aiSummary);
      setShowSummary(true);
    } else {
      try {
        const config = FocusyncAudioEngine.getConfigForMode(mode);
        if (!config) {
          console.error('No config found for mode:', mode);
          return;
        }
        config.volume = volume;
        await audioEngine.play(config);
        setIsPlaying(true);
        activityDetector.reset();
      } catch (error) {
        console.error('Error starting audio:', error);
      }
    }
  };

  const handleReset = () => {
    try {
      audioEngine.stop();
    } catch (error) {
      console.error('Error stopping audio during reset:', error);
    }
    activityDetector.reset();
    setIsPlaying(false);
    setMetrics({
      typingSpeed: 0,
      focusLevel: 0.5,
      isActive: false,
      lastActivityTime: 0,
      sessionDuration: 0,
    });
    setShowSummary(false);
  };

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m ${seconds % 60}s`;
  };

  const modeConfig = {
    focus: { icon: Brain, color: 'from-teal-500 to-emerald-500', label: 'Flow Mode' },
    calm: { icon: Heart, color: 'from-emerald-500 to-sky-500', label: 'Calm Mode' },
    energize: { icon: Zap, color: 'from-sky-500 to-teal-500', label: 'Energize Mode' },
  };

  const CurrentIcon = modeConfig[mode].icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-teal-950 to-slate-950 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Headphones className="w-8 h-8 text-teal-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent">
              FOCUSYNC
            </h1>
          </div>
          <p className="text-slate-400">Adaptive soundscapes for focus, calm, and energy</p>
        </motion.div>

        {/* Main Controls */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 20 }} transition={{ delay: 0.1 }}>
          <Card className="p-8 bg-slate-900/50 backdrop-blur-sm border-teal-500/20 mb-8">
            {/* Mode Selection */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 text-teal-100">Select Mode</h2>
              <div className="grid grid-cols-3 gap-4">
                {(['focus', 'calm', 'energize'] as const).map((m) => {
                  const config = modeConfig[m];
                  const Icon = config.icon;
                  return (
                    <motion.button
                      key={m}
                      onClick={() => !isPlaying && setMode(m)}
                      disabled={isPlaying}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        mode === m
                          ? `border-${config.color.split(' ')[0]} bg-gradient-to-br ${config.color} bg-opacity-20`
                          : 'border-teal-500/20 bg-slate-800/50 hover:border-teal-500/40'
                      } ${isPlaying && mode !== m ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <Icon className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-sm font-medium">{config.label}</p>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Volume Control */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4 text-teal-100">Volume</h2>
              <div className="flex items-center gap-4">
                <Slider
                  value={[volume]}
                  onValueChange={(val) => setVolume(val[0])}
                  min={0}
                  max={1}
                  step={0.1}
                  disabled={isPlaying}
                  className="flex-1"
                />
                <span className="text-sm text-slate-400 w-12">{Math.round(volume * 100)}%</span>
              </div>
            </div>

            {/* Playlist Selector Button */}
            <div className="mb-8">
              <Button
                onClick={() => setShowPlaylistSelector(!showPlaylistSelector)}
                variant="outline"
                className="w-full border-teal-500/30 hover:bg-teal-900/40 py-3"
              >
                <Headphones className="w-4 h-4 mr-2" />
                {currentPlaylist ? `Now: ${currentPlaylist.name}` : 'Select Soundscape'}
              </Button>
            </div>

            {/* Play/Pause Controls */}
            <div className="flex gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                <Button
                  onClick={handlePlayPause}
                  className={`w-full py-6 text-lg font-semibold ${
                    isPlaying
                      ? 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'
                      : 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600'
                  }`}
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-5 h-5 mr-2 inline" />
                      Stop Session
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5 mr-2 inline" />
                      Start Session
                    </>
                  )}
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="border-teal-500/30 hover:bg-teal-900/40 py-6 px-6"
                >
                  <RotateCcw className="w-5 h-5" />
                </Button>
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* Playlist Selector Modal */}
        {showPlaylistSelector && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8"
          >
            <Card className="p-6 bg-slate-900/50 backdrop-blur-sm border-teal-500/20">
              <PlaylistSelector
                onPlaylistSelect={handlePlaylistSelect}
                currentPlaylistId={currentPlaylist?.id}
              />
            </Card>
          </motion.div>
        )}

        {/* Tabs for Charts and Visualizations */}
        {isPlaying && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
            <Tabs defaultValue="focus-wave" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-900/50 border border-teal-500/20">
                <TabsTrigger value="focus-wave">Focus Wave</TabsTrigger>
                <TabsTrigger value="brain-waves">Brain Waves</TabsTrigger>
              </TabsList>

              <TabsContent value="focus-wave" className="mt-4">
                <FocusWaveChart
                  data={chartData}
                  isLive={isPlaying}
                  cameraActive={cameraActive}
                  frequency={frequency}
                />
              </TabsContent>

              <TabsContent value="brain-waves" className="mt-4">
                <BrainWaveVisualizer
                  frequency={frequency}
                  focusLevel={metrics.focusLevel}
                  typingSpeed={metrics.typingSpeed}
                  isPlaying={isPlaying}
                />
              </TabsContent>
            </Tabs>
          </motion.div>
        )}

        {/* Real-time Metrics */}
        {isPlaying && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Focus Level', value: `${Math.round(metrics.focusLevel * 100)}%`, icon: '🧠' },
              { label: 'Typing Speed', value: `${metrics.typingSpeed} KPM`, icon: '⌨️' },
              { label: 'Session Time', value: formatTime(metrics.sessionDuration), icon: '⏱️' },
              { label: 'Status', value: metrics.isActive ? 'Active' : 'Idle', icon: '🔴' },
            ].map((metric, i) => (
              <Card key={i} className="p-4 bg-slate-900/50 border-teal-500/20">
                <p className="text-slate-400 text-sm mb-1">{metric.label}</p>
                <p className="text-2xl font-bold text-teal-300">{metric.value}</p>
              </Card>
            ))}
          </motion.div>
        )}

        {/* Session Summary */}
        {showSummary && sessionSummary && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-8 bg-gradient-to-br from-teal-900/30 to-emerald-900/30 border-teal-500/30 mb-8">
              <h2 className="text-2xl font-bold mb-6 text-teal-300">Session Summary</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-teal-100 mb-2">Summary</h3>
                  <p className="text-slate-300">{sessionSummary.summary}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-teal-100 mb-2">💡 Tip</h3>
                  <p className="text-slate-300">{sessionSummary.tip}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-teal-100 mb-2">🌟 Encouragement</h3>
                  <p className="text-slate-300">{sessionSummary.encouragement}</p>
                </div>

                {sessionSummary.nextSteps && sessionSummary.nextSteps.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-teal-100 mb-2">Next Steps</h3>
                    <ul className="list-disc list-inside space-y-1 text-slate-300">
                      {sessionSummary.nextSteps.map((step: string, i: number) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <Button className="bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600">
                <Download className="w-4 h-4 mr-2" />
                Export Session
              </Button>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}

