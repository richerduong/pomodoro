import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Heart, Star } from 'lucide-react';
import Image from 'next/image';
import helloKittyTimer from '@/assets/hello-kitty-timer.jpg';

interface PomodoroState {
  timeLeft: number;
  isRunning: boolean;
  phase: 'work' | 'shortBreak' | 'longBreak';
  completedPomodoros: number;
  cycleCount: number;
}

const POMODORO_TIMES = {
  work: 25 * 60, // 25 min
  shortBreak: 5 * 60, // 5 min
  longBreak: 15 * 60, // 15 min
};

export default function PomodoroTimer() {
  const [state, setState] = useState<PomodoroState>({
    timeLeft: POMODORO_TIMES.work,
    isRunning: false,
    phase: 'work',
    completedPomodoros: 0,
    cycleCount: 0,
  });

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseInfo = () => {
    switch (state.phase) {
      case 'work':
        return { 
          title: 'Work Time', 
          emoji: '🎯', 
          description: 'Focus on your task!',
          color: 'text-primary'
        };
      case 'shortBreak':
        return { 
          title: 'Short Break', 
          emoji: '☕', 
          description: 'Take a quick break!',
          color: 'text-accent-foreground'
        };
      case 'longBreak':
        return { 
          title: 'Long Break', 
          emoji: '🌸', 
          description: 'Enjoy your long break!',
          color: 'text-accent-foreground'
        };
    }
  };

  const nextPhase = useCallback(() => {
    setState(prev => {
      let newPhase: 'work' | 'shortBreak' | 'longBreak';
      let newCompletedPomodoros = prev.completedPomodoros;
      let newCycleCount = prev.cycleCount;

      if (prev.phase === 'work') {
        newCompletedPomodoros += 1;
        newCycleCount += 1;
        
        // After 4 work sessions, take a long break
        if (newCycleCount % 4 === 0) {
          newPhase = 'longBreak';
        } else {
          newPhase = 'shortBreak';
        }
      } else {
        newPhase = 'work';
      }

      return {
        ...prev,
        phase: newPhase,
        timeLeft: POMODORO_TIMES[newPhase],
        completedPomodoros: newCompletedPomodoros,
        cycleCount: newCycleCount,
        isRunning: false,
      };
    });
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (state.isRunning && state.timeLeft > 0) {
      interval = setInterval(() => {
        setState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1,
        }));
      }, 1000);
    } else if (state.timeLeft === 0) {
      nextPhase();
    }

    return () => clearInterval(interval);
  }, [state.isRunning, state.timeLeft, nextPhase]);

  const toggleTimer = () => {
    setState(prev => ({ ...prev, isRunning: !prev.isRunning }));
  };

  const resetTimer = () => {
    setState(prev => ({
      ...prev,
      timeLeft: POMODORO_TIMES[prev.phase],
      isRunning: false,
    }));
  };

  const resetAll = () => {
    setState({
      timeLeft: POMODORO_TIMES.work,
      isRunning: false,
      phase: 'work',
      completedPomodoros: 0,
      cycleCount: 0,
    });
  };

  const progress = ((POMODORO_TIMES[state.phase] - state.timeLeft) / POMODORO_TIMES[state.phase]) * 100;
  const phaseInfo = getPhaseInfo();

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto space-y-8 animate-fade-in">
        {/* Hello Kitty Header */}
        <div className="text-center space-y-4">
          <div className="w-24 h-24 mx-auto rounded-full overflow-hidden animate-bounce-gentle">
            <Image 
              src={helloKittyTimer} 
              alt="Hello Kitty Timer" 
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Hello Kitty Pomodoro
            </h1>
            <p className="text-muted-foreground">Stay productive with kawaii charm! 🎀</p>
          </div>
        </div>

        {/* Main Timer Card */}
        <div className="timer-display space-y-6">
          {/* Phase Info */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">{phaseInfo.emoji}</span>
              <h2 className={`text-xl font-semibold ${phaseInfo.color}`}>
                {phaseInfo.title}
              </h2>
            </div>
            <p className="text-sm text-muted-foreground">{phaseInfo.description}</p>
          </div>

          {/* Timer Display */}
          <div className="text-center">
            <div className={`text-6xl font-bold ${state.isRunning ? 'animate-pulse-soft' : ''}`}>
              {formatTime(state.timeLeft)}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="progress-kawaii">
              <div 
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-center text-muted-foreground">
              {Math.round(progress)}% complete
            </p>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4">
            <button
              onClick={toggleTimer}
              className="btn-kawaii flex items-center gap-2"
            >
              {state.isRunning ? <Pause size={20} /> : <Play size={20} />}
              {state.isRunning ? 'Pause' : 'Start'}
            </button>
            
            <button
              onClick={resetTimer}
              className="btn-secondary-kawaii flex items-center gap-2"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="timer-display text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              <Heart className="text-primary" size={20} />
              <span className="font-semibold">Completed</span>
            </div>
            <div className="text-2xl font-bold text-primary">
              {state.completedPomodoros}
            </div>
            <p className="text-xs text-muted-foreground">pomodoros</p>
          </div>
          
          <div className="timer-display text-center">
            <div className="flex items-center justify-center gap-1 mb-2">
              <Star className="text-accent-foreground" size={20} />
              <span className="font-semibold">Cycle</span>
            </div>
            <div className="text-2xl font-bold text-accent-foreground">
              {Math.floor(state.cycleCount / 4) + 1}
            </div>
            <p className="text-xs text-muted-foreground">of 4</p>
          </div>
        </div>

        {/* Reset All Button */}
        {state.completedPomodoros > 0 && (
          <div className="text-center">
            <button
              onClick={resetAll}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Reset all progress
            </button>
          </div>
        )}
      </div>
    </div>
  );
}