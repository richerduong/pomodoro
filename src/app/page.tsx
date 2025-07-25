'use client';

import Timer from '@/components/Timer';
import { useState } from 'react';
import { TimerMode, getBackgroundStyle } from '@/lib/theme';

export default function Home() {
  const [currentMode, setCurrentMode] = useState<TimerMode>('pomodoro');

  const handleModeChange = (mode: TimerMode) => {
    setCurrentMode(mode);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-500 ${getBackgroundStyle(currentMode)}`}>
      <Timer onModeChange={handleModeChange} />
    </div>
  );
}
