'use client';

import React from 'react';

interface ExamHeaderProps {
  paperName: string;
  timeLeft: number;
  totalTime: number;
}

export default function ExamHeader({ paperName, timeLeft, totalTime }: ExamHeaderProps) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const percentage = (timeLeft / (totalTime * 60)) * 100;

  const getTimeColor = () => {
    if (percentage > 50) return 'text-green-600';
    if (percentage > 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{paperName}</h1>
        </div>

        <div className="flex items-center gap-8">
          {/* Timer */}
          <div className="flex items-center gap-3">
            <span className="text-gray-600">剩余时间</span>
            <div className={`text-3xl font-bold ${getTimeColor()}`}>
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </div>
          </div>

          {/* Time Progress Bar */}
          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${
                percentage > 50 ? 'bg-green-500' : percentage > 25 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </header>
  );
}
