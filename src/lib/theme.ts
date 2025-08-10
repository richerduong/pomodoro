export type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

export const getBackgroundStyle = (mode: TimerMode): string => {
  const backgroundStyles = {
    pomodoro: 'bg-[#fdbcd7]',
    shortBreak: 'bg-[#a5f0f0]',
    longBreak: 'bg-purple-200',
  };
  
  return backgroundStyles[mode];
}; 