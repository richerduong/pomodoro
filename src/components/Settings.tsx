'use client';

import React from 'react';
import { X } from 'lucide-react';
import { TimerSettings } from '@/lib/types';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: TimerSettings;
  onSettingsChange: (settings: TimerSettings) => void;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose, settings, onSettingsChange }) => {
  if (!isOpen) return null;

  const handleInputChange = (field: string, value: number | boolean) => {
    onSettingsChange({
      ...settings,
      [field]: value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-black">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Time Settings */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-black mb-4">Time (minutes)</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <label className="block text-sm font-medium text-black mb-2">Pomodoro</label>
              <input
                type="number"
                value={settings.pomodoroTime}
                onChange={(e) => handleInputChange('pomodoroTime', parseInt(e.target.value) || 25)}
                className="w-full p-2 border border-gray-300 rounded text-center text-black"
                min="1"
                max="60"
              />
            </div>
            <div className="text-center">
              <label className="block text-sm font-medium text-black mb-2">Short Break</label>
              <input
                type="number"
                value={settings.shortBreakTime}
                onChange={(e) => handleInputChange('shortBreakTime', parseInt(e.target.value) || 5)}
                className="w-full p-2 border border-gray-300 rounded text-center text-black"
                min="1"
                max="30"
              />
            </div>
            <div className="text-center">
              <label className="block text-sm font-medium text-black mb-2">Long Break</label>
              <input
                type="number"
                value={settings.longBreakTime}
                onChange={(e) => handleInputChange('longBreakTime', parseInt(e.target.value) || 15)}
                className="w-full p-2 border border-gray-300 rounded text-center text-black"
                min="1"
                max="60"
              />
            </div>
          </div>
        </div>

        {/* Auto Start Settings */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <label className="text-black font-medium">Auto start breaks</label>
            <button
              onClick={() => handleInputChange('autoStartBreaks', !settings.autoStartBreaks)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.autoStartBreaks ? 'bg-pink-400' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.autoStartBreaks ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <label className="text-black font-medium">Auto start pomodoros</label>
            <button
              onClick={() => handleInputChange('autoStartPomodoros', !settings.autoStartPomodoros)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.autoStartPomodoros ? 'bg-pink-400' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.autoStartPomodoros ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Long Break Interval */}
        <div className="flex items-center justify-between">
          <label className="text-black font-medium">Long break interval</label>
          <input
            type="number"
            value={settings.longBreakInterval}
            onChange={(e) => handleInputChange('longBreakInterval', parseInt(e.target.value) || 4)}
            className="w-16 p-2 border border-gray-300 rounded text-center text-black"
            min="2"
            max="10"
          />
        </div>
      </div>
    </div>
  );
};

export default Settings; 