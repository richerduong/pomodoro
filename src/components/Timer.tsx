'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TimerMode } from '@/lib/theme';
import { TimerSettings } from '@/lib/types';
import { Settings as SettingsIcon, SkipForward } from 'lucide-react';
import Settings from './Settings';

interface TimerProps {
  onModeChange: (mode: TimerMode) => void;
}

const Timer: React.FC<TimerProps> = ({ onModeChange }) => {
  const [mode, setMode] = useState<TimerMode>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const [settings, setSettings] = useState({
    pomodoroTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    longBreakInterval: 4,
  });

  const timerDurations = useMemo(() => ({
    pomodoro: settings.pomodoroTime * 60,
    shortBreak: settings.shortBreakTime * 60,
    longBreak: settings.longBreakTime * 60,
  }), [settings]);

  const modeLabels = {
    pomodoro: 'Pomodoro',
    shortBreak: 'Short Break',
    longBreak: 'Long Break',
  };

  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(timerDurations[mode]);
    }
  }, [settings, mode, isRunning, timerDurations]);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            setIsRunning(false);
            handleTimerComplete();
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

  const handleTimerComplete = () => {
    if (mode === 'pomodoro') {
      const newCount = completedPomodoros + 1;
      setCompletedPomodoros(newCount);
      
      if (settings.autoStartBreaks) {
        const shouldTakeLongBreak = newCount % settings.longBreakInterval === 0;
        const nextMode = shouldTakeLongBreak ? 'longBreak' : 'shortBreak';
        handleModeChange(nextMode);
        if (settings.autoStartPomodoros) {
          setIsRunning(true);
        }
      }
    } else {
      if (settings.autoStartPomodoros) {
        handleModeChange('pomodoro');
        setIsRunning(true);
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleSkip = () => {
    setIsRunning(false);
    if (mode === 'pomodoro') {
      const newCount = completedPomodoros + 1;
      setCompletedPomodoros(newCount);
      const shouldTakeLongBreak = newCount % settings.longBreakInterval === 0;
      const nextMode = shouldTakeLongBreak ? 'longBreak' : 'shortBreak';
      handleModeChange(nextMode);
    } else {
      handleModeChange('pomodoro');
    }
  };

  const handleModeChange = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(timerDurations[newMode]);
    onModeChange(newMode);
  };

  const handleSettingsChange = (newSettings: TimerSettings) => {
    setSettings(newSettings);
  };

  return (
    <div className="w-full max-w-md text-center">
      
      {/* Title */}
      <h1 className="text-4xl font-bold text-black mb-8">Sanriodo</h1>
      
      {/* Mode Selection Buttons */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => handleModeChange('pomodoro')}
          className={`px-6 h-12 rounded-lg font-semibold text-sm transition-all duration-200 bg-white text-black flex items-center justify-center ${
            mode === 'pomodoro' ? 'shadow-lg' : 'hover:shadow-md'
          }`}
        >
          Pomodoro
        </button>
        
        <button
          onClick={() => handleModeChange('shortBreak')}
          className={`px-6 h-12 rounded-lg font-semibold text-sm transition-all duration-200 bg-white text-black flex items-center justify-center ${
            mode === 'shortBreak' ? 'shadow-lg' : 'hover:shadow-md'
          }`}
        >
          Short Break
        </button>
        
        <button
          onClick={() => handleModeChange('longBreak')}
          className={`px-6 h-12 rounded-lg font-semibold text-sm transition-all duration-200 bg-white text-black flex items-center justify-center ${
            mode === 'longBreak' ? 'shadow-lg' : 'hover:shadow-md'
          }`}
        >
          Long Break
        </button>
      </div>
      
      {/* Timer Box - Only timer display */}
      <div className="bg-black rounded-lg shadow-2xl p-8 border border-gray-800 mt-6 mb-6">
        <div className="text-center">
          {/* Current Mode Label */}
          <div className="text-pink-200 text-lg font-semibold mb-4">
            {modeLabels[mode]}
          </div>
          
          {/* Timer Display */}
          <div className="text-6xl md:text-8xl font-mono font-bold text-white tracking-wider">
            {formatTime(timeLeft)}
          </div>

          {/* Status - Inside black box with white text */}
          <div className="mt-6 text-gray-300 text-sm">
            {timeLeft === 0 ? (
              <span className="text-pink-300 font-semibold">Time&apos;s up! ✨</span>
            ) : isRunning ? (
              <span className="text-green-300">Timer running...</span>
            ) : (
              <span>Timer paused</span>
            )}
          </div>
        </div>
      </div>

      {/* Controls - Outside black box */}
      <div className="flex items-center justify-center gap-4 mb-4">
        {/* Settings Button */}
        <button
          onClick={() => setShowSettings(true)}
          className="w-12 h-12 rounded-lg bg-white text-black hover:shadow-md transition-all duration-200 flex items-center justify-center"
        >
          <SettingsIcon size={20} />
        </button>

        {/* Start/Pause Button */}
        <button
          onClick={handleStartPause}
          className="px-8 h-12 rounded-lg font-semibold text-lg bg-white text-black hover:shadow-md transition-all duration-200 flex items-center justify-center"
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>

        {/* Skip Button */}
        <button
          onClick={handleSkip}
          className="w-12 h-12 rounded-lg bg-white text-black hover:shadow-md transition-all duration-200 flex items-center justify-center"
        >
          <SkipForward size={20} />
        </button>
      </div>

      {/* Pomodoro Counter */}
      <div className="text-black text-sm">
        Completed Pomodoros: {completedPomodoros}
      </div>

      {/* Settings Modal */}
      <Settings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />
    </div>
  );
};

export default Timer;
