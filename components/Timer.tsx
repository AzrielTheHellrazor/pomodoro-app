"use client";

import { useState, useEffect, useRef } from "react";

// Timer component handles the Pomodoro countdown logic
// Default: 25 minutes work session, 5 minutes short break
const WORK_DURATION = 25 * 60; // 25 minutes in seconds
const SHORT_BREAK_DURATION = 5 * 60; // 5 minutes in seconds

type TimerMode = "work" | "break";

export default function Timer() {
  // Timer state management
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<TimerMode>("work");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load timer state from localStorage on mount
  useEffect(() => {
    const savedTime = localStorage.getItem("pomodoro-timeLeft");
    const savedMode = localStorage.getItem("pomodoro-mode");
    const savedIsRunning = localStorage.getItem("pomodoro-isRunning");

    if (savedTime) {
      setTimeLeft(parseInt(savedTime, 10));
    }
    if (savedMode === "work" || savedMode === "break") {
      setMode(savedMode);
    }
    if (savedIsRunning === "true") {
      setIsRunning(true);
    }
  }, []);

  // Save timer state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("pomodoro-timeLeft", timeLeft.toString());
    localStorage.setItem("pomodoro-mode", mode);
    localStorage.setItem("pomodoro-isRunning", isRunning.toString());
  }, [timeLeft, mode, isRunning]);

  // Countdown logic: decrements timer every second when running
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Timer completed - switch mode
            const newMode = mode === "work" ? "break" : "work";
            setMode(newMode);
            setIsRunning(false);
            return newMode === "work" ? WORK_DURATION : SHORT_BREAK_DURATION;
          }
          return prev - 1;
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
  }, [isRunning, timeLeft, mode]);

  // Format seconds to MM:SS display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Start/Pause button handler
  const handleToggle = () => {
    setIsRunning(!isRunning);
  };

  // Reset button handler - resets to current mode's default duration
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(mode === "work" ? WORK_DURATION : SHORT_BREAK_DURATION);
  };

  // Switch between work and break modes
  const handleModeSwitch = (newMode: TimerMode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === "work" ? WORK_DURATION : SHORT_BREAK_DURATION);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-6">
      {/* Mode selector buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => handleModeSwitch("work")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === "work"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          Work
        </button>
        <button
          onClick={() => handleModeSwitch("break")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            mode === "break"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
          }`}
        >
          Break
        </button>
      </div>

      {/* Timer display */}
      <div className="text-center">
        <div className="text-6xl md:text-7xl font-bold mb-2 font-mono">
          {formatTime(timeLeft)}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {mode === "work" ? "Focus time" : "Take a break"}
        </p>
      </div>

      {/* Control buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleToggle}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            isRunning
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {isRunning ? "Pause" : "Start"}
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-3 rounded-lg font-semibold bg-gray-500 hover:bg-gray-600 text-white transition-colors"
        >
          Reset
        </button>
      </div>
    </div>
  );
}


