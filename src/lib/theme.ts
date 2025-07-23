export type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

export const getBackgroundStyle = (mode: TimerMode): string => {
  const backgroundStyles = {
    pomodoro: 'bg-[#fdb2d4]', // Custom bright pastel pink between pink-200 and pink-300
    shortBreak: 'bg-[#a5f0f0]', // Custom soft cyan between cyan-100 and cyan-200
    longBreak: 'bg-purple-200', // Soft pastel lavender/purple
  };
  
  return backgroundStyles[mode];
}; 