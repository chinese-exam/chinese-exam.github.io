'use client';

import React from 'react';
import { Timer, FileText, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

interface ExamHeaderProps {
  paperName: string;
  timeLeft: number;
  totalTime: number;
  isReviewMode?: boolean;
}

export default function ExamHeader({ paperName, timeLeft, totalTime, isReviewMode = false }: ExamHeaderProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = timeLeft < 300; // 5 minutes

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-slate-950/95">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 overflow-hidden">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link href="/">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <Separator orientation="vertical" className="h-6 hidden sm:block" />
          <div className="flex items-center gap-2 overflow-hidden">
            <FileText className="h-5 w-5 text-indigo-600 shrink-0" />
            <h1 className="font-bold text-slate-900 dark:text-white truncate max-w-[200px] sm:max-w-md">
              {paperName}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {!isReviewMode ? (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors ${
              isLowTime ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-600'
            }`}>
              <Timer className="h-4 w-4" />
              <span className="font-mono font-bold text-sm sm:text-base">
                {formatTime(timeLeft)}
              </span>
            </div>
          ) : (
            <Badge variant="secondary" className="px-3 py-1 font-bold">
              回顾模式
            </Badge>
          )}
          <Badge variant="outline" className="hidden sm:flex px-3 py-1 bg-white">
            {totalTime} 分钟
          </Badge>
        </div>
      </div>
    </header>
  );
}
