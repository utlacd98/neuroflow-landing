'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Zap, Check, X } from 'lucide-react';
import { useState } from 'react';

interface UpgradePromptProps {
  sessionsRemaining: number;
  maxSessions: number;
  onClose?: () => void;
  onUpgrade?: () => void;
}

export function UpgradePrompt({
  sessionsRemaining,
  maxSessions,
  onClose,
  onUpgrade,
}: UpgradePromptProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    onClose?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed bottom-4 right-4 z-50 max-w-sm"
    >
      <Card className="bg-gradient-to-br from-slate-800 to-slate-900 border-teal-500/50 p-6 shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-teal-500/20 rounded-lg">
              <Zap className="w-5 h-5 text-teal-400" />
            </div>
            <h3 className="font-bold text-white">Upgrade to Pro</h3>
          </div>
          <button
            onClick={handleDismiss}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-slate-300 text-sm mb-4">
          You have <span className="font-bold text-teal-400">{sessionsRemaining}</span> sessions remaining today.
          Upgrade to Pro for unlimited sessions!
        </p>

        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Unlimited daily sessions</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Advanced AI insights</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>Export your data</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleDismiss}
            variant="outline"
            className="flex-1 text-sm"
          >
            Later
          </Button>
          <Button
            onClick={onUpgrade}
            className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white text-sm"
          >
            Upgrade Now
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

