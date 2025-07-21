'use client';

import React, { useState, useEffect, useRef } from 'react';

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

interface TimerProps {
  onModeChange: (mode: TimerMode) => void;
}

const Timer: React.FC<TimerProps> = ({ onModeChange }) => {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(25 * 60); // Start with Pomodoro time
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const timerDurations = {
    pomodoro: 25 * 60, // 25 minutes
    shortBreak: 5 * 60, // 5 minutes
    longBreak: 15 * 60, // 15 minutes
  };

  const modeLabels = {
    pomodoro: 'Pomodoro',
    shortBreak: 'Short Break',
    longBreak: 'Long Break',
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(timerDurations[mode]);
  };

  const handleModeChange = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(timerDurations[newMode]);
    onModeChange(newMode);
  };

  return (
    <div className="w-full max-w-md">
      {/* Timer Box */}
      
      {/* Mode Selection Buttons */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => handleModeChange('pomodoro')}
          className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
            mode === 'pomodoro'
              ? 'bg-white text-black shadow-lg'
              : 'bg-white/80 text-black hover:bg-white'
          }`}
        >
          Pomodoro
        </button>
        
        <button
          onClick={() => handleModeChange('shortBreak')}
          className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
            mode === 'shortBreak'
              ? 'bg-white text-black shadow-lg'
              : 'bg-white/80 text-black hover:bg-white'
          }`}
        >
          Short Break
        </button>
        
        <button
          onClick={() => handleModeChange('longBreak')}
          className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
            mode === 'longBreak'
              ? 'bg-white text-black shadow-lg'
              : 'bg-white/80 text-black hover:bg-white'
          }`}
        >
          Long Break
        </button>
      </div>
      
      <div className="bg-black rounded-lg shadow-2xl p-8 border border-gray-800 mt-6">
        <div className="text-center">
          {/* Current Mode Label */}
          <div className="text-pink-200 text-lg font-semibold mb-4">
            {modeLabels[mode]}
          </div>
          
          {/* Timer Display */}
          <div className="text-6xl md:text-8xl font-mono font-bold text-white mb-8 tracking-wider">
            {formatTime(timeLeft)}
          </div>
          
          {/* Controls */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleStartPause}
              className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 ${
                isRunning
                  ? 'bg-red-400 hover:bg-red-500 text-white'
                  : 'bg-green-400 hover:bg-green-500 text-white'
              }`}
            >
              {isRunning ? 'Pause' : 'Start'}
            </button>
            
            <button
              onClick={handleReset}
              className="px-8 py-3 rounded-lg font-semibold text-lg bg-gray-500 hover:bg-gray-600 text-white transition-all duration-200"
            >
              Reset
            </button>
          </div>

          {/* Status */}
          <div className="mt-6 text-gray-300 text-sm">
            {timeLeft === 0 ? (
              <span className="text-pink-300 font-semibold">Time&apos;s up! ✨</span>
            ) : isRunning ? (
              <span className="text-green-300">Timer running... 💖</span>
            ) : (
              <span>Timer paused</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;
