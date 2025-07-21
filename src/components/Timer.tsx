'use client';

import React, { useState, useEffect, useRef } from 'react';

const Timer: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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
    setTimeLeft(25 * 60);
  };

  return (
    <div className="bg-black rounded-lg shadow-2xl p-8 border border-gray-800">
      <div className="text-center">
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
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          
          <button
            onClick={handleReset}
            className="px-8 py-3 rounded-lg font-semibold text-lg bg-gray-600 hover:bg-gray-700 text-white transition-all duration-200"
          >
            Reset
          </button>
        </div>

        {/* Status */}
        <div className="mt-6 text-gray-300 text-sm">
          {timeLeft === 0 ? (
            <span className="text-red-400 font-semibold">Time&apos;s up!</span>
          ) : isRunning ? (
            <span className="text-green-400">Timer running...</span>
          ) : (
            <span>Timer paused</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timer;
