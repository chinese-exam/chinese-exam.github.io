'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Paper, Subject, DifficultyLevel, ExamRecord } from '@/types/exam';
import { loadExamPaper, saveExamProgress, loadExamProgress } from '@/lib/exam-service';
import ExamHeader from '@/components/ExamHeader';
import QuestionViewer from '@/components/QuestionViewer';
import ProgressBar from '@/components/ProgressBar';

function ExamPageContent() {
  const searchParams = useSearchParams();
  const subject = searchParams.get('subject') as Subject;
  const difficulty = searchParams.get('difficulty') as DifficultyLevel;

  const [paper, setPaper] = useState<Paper | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isExamFinished, setIsExamFinished] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [loading, setLoading] = useState(true);
  const [examRecord, setExamRecord] = useState<ExamRecord | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    async function loadPaper() {
      const data = await loadExamPaper(subject, difficulty);
      if (data) {
        setPaper(data);
        setTimeLeft(data.totalDuration ? data.totalDuration * 60 : 3600);
        const savedProgress = loadExamProgress(`${subject}_${difficulty}`);
        if (savedProgress) {
          setAnswers(savedProgress.answers || {});
          setCurrentQuestionIndex(savedProgress.currentQuestionIndex || 0);
          setTimeLeft(savedProgress.timeLeft || (data.totalDuration || 60) * 60);
        }
      }
      setLoading(false);
    }

    if (subject && difficulty) {
      loadPaper();
    }
  }, [subject, difficulty]);

  useEffect(() => {
    if (!isExamStarted || isExamFinished || !paper) return;

    if (timeLeft <= 0) {
      handleFinishExam();
      return;
    }

    timerRef.current = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, isExamStarted, isExamFinished, paper]);

  useEffect(() => {
    if (isExamStarted && !isExamFinished && paper) {
      const saveInterval = setInterval(() => {
        saveExamProgress(`${subject}_${difficulty}`, {
          answers,
          currentQuestionIndex,
          timeLeft,
          paperName: paper.name,
        });
      }, 5000);

      return () => clearInterval(saveInterval);
    }
  }, [answers, currentQuestionIndex, timeLeft, isExamStarted, isExamFinished, paper, subject, difficulty]);

  const handleStartExam = () => {
    setIsExamStarted(true);
    setExamRecord({
      id: `${Date.now()}`,
      paperName: paper?.name || '',
      subject,
      difficulty,
      startTime: Date.now(),
      totalTime: paper?.totalDuration || 60,
      totalPoints: paper?.totalScore || 100,
      obtainedPoints: 0,
      accuracy: 0,
      answers: [],
      status: 'in_progress',
    });
  };

  const handleAnswerChange = (answer: string | string[]) => {
    setAnswers({
      ...answers,
      [currentQuestionIndex]: answer,
    });
  };

  const handleNextQuestion = () => {
    if (paper && currentQuestionIndex < (paper.sections?.[0]?.questions?.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinishExam = () => {
    setIsExamFinished(true);
    if (examRecord) {
      setExamRecord({
        ...examRecord,
        endTime: Date.now(),
        status: 'completed',
        timeUsed: (Date.now() - examRecord.startTime) / 1000,
      });
    }
  };

  const handleJumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载试卷中...</p>
        </div>
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600 mb-4">无法加载试卷</p>
          <a href="/" className="text-indigo-600 hover:text-indigo-800">
            返回首页
          </a>
        </div>
      </div>
    );
  }

  if (!isExamStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{paper.name}</h2>
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-gray-600">
              <span>总题数：</span>
              <span className="font-semibold">{paper.totalQuestions} 题</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>总分值：</span>
              <span className="font-semibold">{paper.totalScore} 分</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>考试时间：</span>
              <span className="font-semibold">{paper.totalDuration} 分钟</span>
            </div>
          </div>
          <button
            onClick={handleStartExam}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200"
          >
            开始考试
          </button>
        </div>
      </div>
    );
  }

  if (isExamFinished) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-2xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">考试结束</h2>
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-gray-600 mb-2">总用时</p>
              <p className="text-4xl font-bold text-indigo-600">
                {Math.floor((examRecord?.timeUsed || 0) / 60)}分{Math.floor((examRecord?.timeUsed || 0) % 60)}秒
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg">
                <p className="text-gray-600">总分</p>
                <p className="text-2xl font-bold text-blue-600">{examRecord?.totalPoints}</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg">
                <p className="text-gray-600">得分</p>
                <p className="text-2xl font-bold text-green-600">{examRecord?.obtainedPoints}</p>
              </div>
            </div>
            <a href="/" className="block w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg text-center transition-all duration-200">
              返回首页
            </a>
          </div>
        </div>
      </div>
    );
  }

  const allQuestions = paper.sections?.flatMap(section => section.questions) || [];
  const currentQuestion = allQuestions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      <ExamHeader paperName={paper.name || 'Exam'} timeLeft={timeLeft} totalTime={paper.totalDuration || 60} />

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <ProgressBar current={currentQuestionIndex + 1} total={allQuestions.length} />

            {currentQuestion && (
              <QuestionViewer
                question={currentQuestion}
                answer={answers[currentQuestionIndex]}
                onAnswerChange={handleAnswerChange}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={allQuestions.length}
              />
            )}

            <div className="mt-8 flex justify-between gap-4">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-800 font-bold py-2 px-6 rounded-lg transition-all duration-200"
              >
                ← 上一题
              </button>

              {currentQuestionIndex === allQuestions.length - 1 ? (
                <button
                  onClick={handleFinishExam}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-200"
                >
                  提交答卷 ✓
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-200"
                >
                  下一题 →
                </button>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-4 sticky top-4">
              <h3 className="font-bold text-lg mb-4">题目导航</h3>
              <div className="grid grid-cols-4 gap-2 max-h-96 overflow-y-auto">
                {allQuestions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleJumpToQuestion(index)}
                    className={`aspect-square rounded font-bold text-sm transition-all duration-200 ${
                      index === currentQuestionIndex
                        ? 'bg-indigo-600 text-white'
                        : answers[index]
                        ? 'bg-green-100 text-green-800 border-2 border-green-400'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExamPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    }>
      <ExamPageContent />
    </Suspense>
  );
}
