import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Paper } from '@/types/paper';
import { ExamRecord } from '@/types/exam';
import { saveExamProgress, loadExamProgress, calculateExamScore } from '@/lib/exam-service';

interface UseExamOptions {
  paper: Paper | null;
  storageKey: string;
}

export function useExam({ paper, storageKey }: UseExamOptions) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isExamFinished, setIsExamFinished] = useState(false);
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string | string[]>>({});
  const [examRecord, setExamRecord] = useState<ExamRecord | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const allQuestions = useMemo(() => 
    paper?.sections?.flatMap(section => section.questions || []) || [], 
  [paper]);

  const answeredCount = Object.keys(answers).length;
  const progressValue = allQuestions.length > 0 ? (answeredCount / allQuestions.length) * 100 : 0;
  const currentQuestion = allQuestions[currentQuestionIndex];

  // Initialize from storage or paper
  useEffect(() => {
    if (!paper) return;

    const savedProgress = loadExamProgress(storageKey);
    if (savedProgress) {
      setAnswers(savedProgress.answers || {});
      setCurrentQuestionIndex(savedProgress.currentQuestionIndex || 0);
      setTimeLeft(savedProgress.timeLeft || (paper.totalDuration || 60) * 60);
    } else {
      setTimeLeft(paper.totalDuration ? paper.totalDuration * 60 : 3600);
    }
  }, [paper, storageKey]);

  // Timer logic
  useEffect(() => {
    if (!isExamStarted || isExamFinished || !paper || isReviewMode) return;

    if (timeLeft <= 0) {
      const timeout = setTimeout(() => {
        handleFinishExam();
      }, 0);
      return () => clearTimeout(timeout);
    }

    timerRef.current = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, isExamStarted, isExamFinished, paper, isReviewMode]);

  // Auto-save logic
  useEffect(() => {
    if (isExamStarted && !isExamFinished && paper && !isReviewMode) {
      const saveInterval = setInterval(() => {
        saveExamProgress(storageKey, {
          answers,
          currentQuestionIndex,
          timeLeft,
          paperName: paper.name,
        });
      }, 5000);

      return () => clearInterval(saveInterval);
    }
  }, [answers, currentQuestionIndex, timeLeft, isExamStarted, isExamFinished, paper, storageKey, isReviewMode]);

  const handleFinishExam = useCallback(() => {
    const { obtainedPoints, userAnswers, accuracy } = calculateExamScore(allQuestions, answers);

    setIsExamFinished(true);
    setExamRecord(prev => {
      if (!prev) return null;
      return {
        ...prev,
        obtainedPoints,
        accuracy,
        answers: userAnswers,
        endTime: Date.now(),
        status: 'completed',
        timeUsed: (Date.now() - prev.startTime) / 1000,
      };
    });
  }, [allQuestions, answers]);

  const handleStartExam = useCallback(() => {
    setIsExamStarted(true);
    setExamRecord({
      id: `${Date.now()}`,
      paperName: paper?.name || '',
      startTime: Date.now(),
      totalTime: paper?.totalDuration || 60,
      totalPoints: paper?.totalScore || 100,
      obtainedPoints: 0,
      accuracy: 0,
      answers: [],
      status: 'in_progress',
    });
  }, [paper]);

  const handleAnswerChange = useCallback((answer: string | string[]) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: answer,
    }));
  }, [currentQuestionIndex]);

  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < allQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, allQuestions.length]);

  const handlePreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  const handleJumpToQuestion = useCallback((index: number) => {
    setCurrentQuestionIndex(index);
  }, []);

  const toggleReviewMode = useCallback(() => {
    setIsReviewMode(prev => !prev);
    setCurrentQuestionIndex(0);
  }, []);

  const currentQuestionStatus = useMemo(() => 
    examRecord?.answers?.find(a => a.questionIndex === currentQuestionIndex),
  [examRecord, currentQuestionIndex]);

  return {
    state: {
      currentQuestionIndex,
      timeLeft,
      isExamStarted,
      isExamFinished,
      isReviewMode,
      answers,
      examRecord,
      progressValue,
      answeredCount,
      allQuestions,
      currentQuestion,
      currentQuestionStatus
    },
    actions: {
      handleStartExam,
      handleFinishExam,
      handleAnswerChange,
      handleNextQuestion,
      handlePreviousQuestion,
      handleJumpToQuestion,
      toggleReviewMode
    }
  };
}
