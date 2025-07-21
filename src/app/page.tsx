'use client';

import Timer from '@/components/Timer';
import { useState } from 'react';

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

export default function Home() {
  const [currentMode, setCurrentMode] = useState<TimerMode>('pomodoro');

  const backgroundStyles = {
    pomodoro: 'bg-gradient-to-br from-pink-200 to-rose-300', // Soft pink for Hello Kitty
    shortBreak: 'bg-gradient-to-br from-teal-200 to-cyan-300', // Soft blue-green
    longBreak: 'bg-gradient-to-br from-blue-200 to-indigo-300', // Soft blue
  };

  const handleModeChange = (mode: TimerMode) => {
    setCurrentMode(mode);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-all duration-500 ${backgroundStyles[currentMode]}`}>
      <Timer onModeChange={handleModeChange} />
    </div>
  );
}
