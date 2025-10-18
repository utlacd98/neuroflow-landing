'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Trash2, BarChart3 } from 'lucide-react';
import { SessionStorageManager, type StoredSession } from '@/lib/sessionStorage';

export default function SessionHistory() {
  const [sessions, setSessions] = useState<StoredSession[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'focus' | 'calm' | 'energize'>('all');

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = () => {
    const allSessions = SessionStorageManager.getAllSessions();
    setSessions(allSessions);
    setStats(SessionStorageManager.getStatistics());
  };

  const filteredSessions = filter === 'all' ? sessions : sessions.filter((s) => s.mode === filter);

  const handleDelete = (id: string) => {
    SessionStorageManager.deleteSession(id);
    loadSessions();
  };

  const handleExportJSON = () => {
    const data = SessionStorageManager.exportSessions();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neuroflow-sessions-${Date.now()}.json`;
    a.click();
  };

  const handleExportCSV = () => {
    const data = SessionStorageManager.exportSessionsAsCSV();
    const blob = new Blob([data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neuroflow-sessions-${Date.now()}.csv`;
    a.click();
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    return `${minutes}m`;
  };

  const getModeColor = (mode: string) => {
    const colors: Record<string, string> = {
      focus: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
      calm: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      energize: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    };
    return colors[mode] || colors.focus;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-teal-950 to-slate-950 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-300 to-emerald-300 bg-clip-text text-transparent mb-2">
            Session History
          </h1>
          <p className="text-slate-400">Track your focus patterns and progress over time</p>
        </motion.div>

        {/* Statistics */}
        {stats && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-8">
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { label: 'Total Sessions', value: stats.totalSessions },
                { label: 'Avg Focus Score', value: `${stats.averageFocusScore}/100` },
                { label: 'Total Focus Time', value: `${Math.round(stats.totalFocusTime / 60000)}m` },
                { label: 'Avg Session', value: `${Math.round(stats.averageSessionDuration / 60000)}m` },
              ].map((stat, i) => (
                <Card key={i} className="p-4 bg-slate-900/50 border-teal-500/20">
                  <p className="text-slate-400 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-teal-300">{stat.value}</p>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* Export Options */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-8">
          <Card className="p-4 bg-slate-900/50 border-teal-500/20 flex gap-2">
            <Button
              onClick={handleExportJSON}
              variant="outline"
              className="border-teal-500/30 hover:bg-teal-900/40"
            >
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
            <Button
              onClick={handleExportCSV}
              variant="outline"
              className="border-teal-500/30 hover:bg-teal-900/40"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </Card>
        </motion.div>

        {/* Sessions List */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <Card className="bg-slate-900/50 border-teal-500/20 overflow-hidden">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full justify-start border-b border-teal-500/20 bg-transparent rounded-none">
                {['all', 'focus', 'calm', 'energize'].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    onClick={() => setFilter(tab as any)}
                    className="capitalize"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value={filter} className="p-6">
                {filteredSessions.length === 0 ? (
                  <div className="text-center py-12">
                    <BarChart3 className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">No sessions yet. Start your first session to see data here!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredSessions.map((session) => (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 bg-slate-800/50 rounded-lg border border-teal-500/10 hover:border-teal-500/30 transition-all"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getModeColor(session.mode)}`}>
                                {session.mode.charAt(0).toUpperCase() + session.mode.slice(1)}
                              </span>
                              <span className="text-sm text-slate-400">{formatDate(session.savedAt)}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <p className="text-slate-500">Focus Score</p>
                                <p className="text-lg font-semibold text-teal-300">{session.focusScore}/100</p>
                              </div>
                              <div>
                                <p className="text-slate-500">Duration</p>
                                <p className="text-lg font-semibold text-teal-300">{formatDuration(session.totalTypingTime)}</p>
                              </div>
                              <div>
                                <p className="text-slate-500">Avg Speed</p>
                                <p className="text-lg font-semibold text-teal-300">{Math.round(session.averageTypingSpeed)} KPM</p>
                              </div>
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDelete(session.id)}
                            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5 text-red-400" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

