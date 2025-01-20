

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { assets } from '../assets/assets';

const Pomodoro = () => {
  const [timeLeft, setTimeLeft] = useState(1500); 
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const [sessionLength, setSessionLength] = useState(25);
  const [breakLength, setBreakLength] = useState(5);

  const audioRef = useRef(null);
  const timerRef = useRef(null);

  const totalSeconds = isSession ? sessionLength * 60 : breakLength * 60;
  const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  useEffect(() => {
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            playAlarm();
            switchTimer();
            return isSession ? breakLength * 60 : sessionLength * 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, isSession, sessionLength, breakLength]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const playAlarm = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) =>
        console.log('Audio playback failed:', error)
      );
    }
  };

  const switchTimer = () => {
    setIsSession(!isSession);
    setIsRunning(true);
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    setIsSession(true);
    setTimeLeft(sessionLength * 60);
  };

  const handleSessionChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 60) {
      setSessionLength(value);
      if (isSession) {
        setTimeLeft(value * 60);
      }
    }
  };

  const handleBreakChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 30) {
      setBreakLength(value);
      if (!isSession) {
        setTimeLeft(value * 60);
      }
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center"
      style={{
        backgroundImage: `url(${assets.pomodoro})`,
        height: 'calc(100vh - 50px)',
      }}
    >
      <style>
        {`
          @keyframes pulse-scale {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }
        `}
      </style>

      <div
        className={`relative w-1.7/3 p-8 bg-offwhite border border-gray-300 shadow-lg rounded-lg ml-8 ${
          isRunning ? 'animate-pulse-scale' : ''
        }`}
        style={{
          animation: isRunning ? 'pulse-scale 1.5s infinite ease-in-out' : 'none',
        }}
      >
        <h1 className="text-3xl font-bold text-black text-center mb-8">
          {isSession ? 'Work Time' : 'Break Time'}
        </h1>

        <div className="w-64 h-64 mx-auto mb-8">
          <CircularProgressbar
            value={progress}
            text={formatTime(timeLeft)}
            styles={buildStyles({
              textSize: '16px',
              pathColor: isSession ? '#333333' : '#FF6347',
              textColor: '#333333',
              trailColor: '#E0E0E0',
            })}
          />
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={isRunning ? handleStop : handleStart}
            className="flex items-center justify-center gap-2 px-6 py-2 text-white bg-black hover:bg-gray-800 rounded-full shadow-md transition-transform transform hover:scale-110 duration-300"
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 px-6 py-2 text-black bg-white border border-gray-400 hover:bg-gray-100 rounded-full shadow-md transition-transform transform hover:scale-110 duration-300"
          >
            <RefreshCw className="w-5 h-5" />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="session-length"
              className="block text-gray-800 font-medium"
            >
              Session Length (minutes):
            </label>
            <input
              type="number"
              id="session-length"
              value={sessionLength}
              onChange={handleSessionChange}
              min="1"
              max="60"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-black"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="break-length"
              className="block text-gray-800 font-medium"
            >
              Break Length (minutes):
            </label>
            <input
              type="number"
              id="break-length"
              value={breakLength}
              onChange={handleBreakChange}
              min="1"
              max="30"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring focus:ring-black"
            />
          </div>
        </div>
      </div>
      <audio ref={audioRef}>
        <source src="/alarm.mp3" type="audio/mp3" />
      </audio>
    </div>
  );
};

export default Pomodoro;

