'use client';

import React, { useEffect, useState, Suspense, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Paper } from '@/types/paper';
import { loadExamPaper, loadExamPaperFromUrl } from '@/lib/exam-service';
import ExamHeader from '@/components/ExamHeader';
import QuestionViewer from '@/components/QuestionViewer';
import { useExam } from '@/hooks/useExam';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  LayoutGrid, 
  CheckCircle2, 
  History, 
  Home,
  Loader2,
  AlertTriangle
} from 'lucide-react';

function ExamPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const url = searchParams.get('url');
  const subject = searchParams.get('subject') as string;
  const difficulty = searchParams.get('difficulty');

  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const storageKey = useMemo(() => {
    if (url) return `url_${btoa(url).substring(0, 16)}`;
    return `${subject}_${difficulty}`;
  }, [url, subject, difficulty]);

  const { state, actions } = useExam({
    paper,
    storageKey,
  });

  const {
    currentQuestionIndex,
    timeLeft,
    isExamStarted,
    isExamFinished,
    isReviewMode,
    answers,
    examRecord,
    answeredCount,
    allQuestions,
    currentQuestion,
    currentQuestionStatus
  } = state;

  const {
    handleStartExam,
    handleFinishExam,
    handleAnswerChange,
    handleNextQuestion,
    handlePreviousQuestion,
    handleJumpToQuestion,
    toggleReviewMode
  } = actions;

  useEffect(() => {
    async function fetchPaper() {
      let data: Paper | null = null;
      setError(null);
      
      try {
        if (url) {
          data = await loadExamPaperFromUrl(decodeURIComponent(url));
        } else if (subject) {
          // Note: loadExamPaper originally expected difficulty as DifficultyLevel
          // Since we removed it from the core type, we might need to adjust this call
          // but for now we keep the parameter if difficulty is present in URL
          data = await loadExamPaper(subject, difficulty as any);
        }

        if (data) {
          setPaper(data);
        }
      } catch (err: any) {
        setError(err.message || '试卷加载过程中发生未知错误');
      } finally {
        setLoading(false);
      }
    }

    fetchPaper();
  }, [url, subject, difficulty]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse">正在加载试卷...</p>
      </div>
    );
  }

  if (!paper || error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md w-full mx-4 shadow-xl border-destructive/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <AlertTriangle className="h-12 w-12 text-destructive" />
            </div>
            <CardTitle className="text-destructive text-2xl">加载失败</CardTitle>
            <CardDescription>
              {error || '无法获取试卷数据，请检查网络连接或联系管理员。'}
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button variant="outline" onClick={() => router.push('/')} className="gap-2">
              <Home className="h-4 w-4" /> 返回首页
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (!isExamStarted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-xl w-full shadow-2xl border-border overflow-hidden">
          <div className="h-2 bg-primary w-full" />
          <CardHeader className="space-y-1 pb-8">
            <CardTitle className="text-3xl font-extrabold tracking-tight">{paper.name}</CardTitle>
            <CardDescription className="text-lg">考前确认：请核对考试信息，准备就绪后开始。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/50 rounded-2xl border border-border">
                <p className="text-sm text-muted-foreground font-medium mb-1">题目总数</p>
                <p className="text-2xl font-bold">{paper.totalQuestions} <span className="text-sm font-normal text-muted-foreground/60">题</span></p>
              </div>
              <div className="p-4 bg-muted/50 rounded-2xl border border-border">
                <p className="text-sm text-muted-foreground font-medium mb-1">考试总分</p>
                <p className="text-2xl font-bold">{paper.totalScore} <span className="text-sm font-normal text-muted-foreground/60">分</span></p>
              </div>
              <div className="p-4 bg-muted/50 rounded-2xl border border-border">
                <p className="text-sm text-muted-foreground font-medium mb-1">答题时长</p>
                <p className="text-2xl font-bold">{paper.totalDuration} <span className="text-sm font-normal text-muted-foreground/60">分钟</span></p>
              </div>
              <div className="p-4 bg-muted/50 rounded-2xl border border-border flex items-center justify-center">
                <Badge variant="secondary" className="px-4 py-1 text-sm font-bold uppercase tracking-wider">
                  {difficulty || '普通'}
                </Badge>
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-2 pb-10 flex flex-col gap-4">
            <Button 
              onClick={handleStartExam} 
              size="lg" 
              className="w-full h-14 text-xl font-bold shadow-lg transition-all hover:scale-[1.02]"
            >
              立刻开始答题
            </Button>
            <Button variant="ghost" onClick={() => router.push('/')} className="w-full text-muted-foreground font-medium">
              返回重选
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (isExamFinished && !isReviewMode) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Card className="max-w-2xl w-full shadow-2xl border-border overflow-hidden animate-in zoom-in duration-500">
          <div className="h-3 bg-gradient-to-r from-primary to-primary/60" />
          <CardHeader className="text-center pb-8 pt-10">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <CheckCircle2 className="h-12 w-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-4xl font-extrabold tracking-tight mb-2">考试已结束</CardTitle>
            <CardDescription className="text-lg">恭喜你完成了本次测试，以下是你的成绩报告。</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 px-10">
            <div className="text-center py-6 bg-muted/30 rounded-3xl border-2 border-border">
              <p className="text-muted-foreground font-medium mb-1 flex items-center justify-center gap-2">
                <History className="w-4 h-4" /> 实际用时
              </p>
              <p className="text-5xl font-black text-foreground tabular-nums">
                {Math.floor((examRecord?.timeUsed || 0) / 60)}<span className="text-xl font-bold mx-1">分</span>{Math.floor((examRecord?.timeUsed || 0) % 60)}<span className="text-xl font-bold mx-1">秒</span>
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 bg-background rounded-2xl border-2 border-border text-center shadow-sm">
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-2">满分</p>
                <p className="text-3xl font-black">{examRecord?.totalPoints}</p>
              </div>
              <div className="p-5 bg-background rounded-2xl border-2 border-primary/20 text-center shadow-sm">
                <p className="text-primary/60 text-xs font-bold uppercase tracking-wider mb-2">实得分</p>
                <p className="text-3xl font-black text-primary">{examRecord?.obtainedPoints}</p>
              </div>
              <div className="p-5 bg-background rounded-2xl border-2 border-border text-center shadow-sm">
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider mb-2">正确率</p>
                <p className="text-3xl font-black">{Math.round(examRecord?.accuracy || 0)}%</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-4 px-10 pt-6 pb-12">
            <Button 
              onClick={toggleReviewMode}
              variant="outline"
              className="flex-1 h-14 text-lg font-bold border-2 border-primary text-primary hover:bg-primary/5 transition-all rounded-xl"
            >
              查看解析与错题
            </Button>
            <Button asChild size="lg" className="flex-1 h-14 text-lg font-bold transition-all rounded-xl shadow-lg">
              <Link href="/">
                <Home className="mr-2 h-5 w-5" /> 返回首页
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ExamHeader 
        paperName={paper.name || 'Exam'} 
        timeLeft={isReviewMode ? 0 : timeLeft} 
        totalTime={paper.totalDuration || 60}
        isReviewMode={isReviewMode}
      />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            {currentQuestion && (
              <QuestionViewer
                question={currentQuestion}
                answer={answers[currentQuestionIndex]}
                onAnswerChange={handleAnswerChange}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={allQuestions.length}
                showAnalysis={isReviewMode}
                isCorrect={currentQuestionStatus?.isCorrect}
              />
            )}

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-border">
              <Button
                variant="outline"
                size="lg"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="w-full sm:w-auto h-12 px-8 font-bold border-2 rounded-xl transition-all"
              >
                <ChevronLeft className="mr-2 h-5 w-5" /> 上一题
              </Button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {isReviewMode && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={toggleReviewMode}
                    className="flex-1 sm:flex-none h-12 font-bold border-2 border-primary text-primary hover:bg-primary/5 rounded-xl"
                  >
                    返回成绩单
                  </Button>
                )}

                {currentQuestionIndex === allQuestions.length - 1 ? (
                  !isReviewMode && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          size="lg"
                          className="flex-1 sm:flex-none h-12 px-10 font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg rounded-xl"
                        >
                          提交答卷 <Send className="ml-2 h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-2xl font-black">确认提交吗？</AlertDialogTitle>
                          <AlertDialogDescription className="text-base pt-2">
                            提交后将无法修改答案，系统将根据您的回答进行自动评分。您目前已完成 <span className="font-bold text-primary">{answeredCount}/{allQuestions.length}</span> 道题目。
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="pt-4">
                          <AlertDialogCancel className="font-bold h-11 px-6 border-2 rounded-xl">继续答题</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={handleFinishExam}
                            className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold h-11 px-8 rounded-xl shadow-lg"
                          >
                            确认交卷
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )
                ) : (
                  <Button
                    size="lg"
                    onClick={handleNextQuestion}
                    className="flex-1 sm:flex-none h-12 px-10 font-bold shadow-lg transition-all rounded-xl"
                  >
                    下一题 <ChevronRight className="ml-2 h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <Card className="sticky top-24 shadow-xl border-border overflow-hidden">
              <CardHeader className="bg-muted/30 border-b py-5">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <LayoutGrid className="w-5 h-5 text-primary" /> 题目导航
                  </CardTitle>
                  <Badge variant={isReviewMode ? "secondary" : "outline"} className="font-black px-2 py-0.5 rounded-md tabular-nums">
                    {isReviewMode ? 'REVIEW' : `${answeredCount} / ${allQuestions.length}`}
                  </Badge>
                </div>
              </CardHeader>

              <ScrollArea className="h-[calc(100vh-280px)] px-5 py-4">
                <div className="space-y-8">
                  {paper.sections?.map((section, sIndex) => {
                    let questionOffset = 0;
                    for (let i = 0; i < sIndex; i++) {
                      questionOffset += paper.sections?.[i]?.questions?.length || 0;
                    }

                    return (
                      <div key={sIndex} className="space-y-4">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-4 bg-primary/60 rounded-full" />
                          <h4 className="text-xs font-black text-muted-foreground uppercase tracking-widest">
                            {section.title || `第 ${sIndex + 1} 部分`}
                          </h4>
                        </div>
                        <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 gap-2">
                          {section.questions?.map((_, qIndex) => {
                            const globalIndex = questionOffset + qIndex;
                            const isAnswered = !!answers[globalIndex];
                            const isActive = globalIndex === currentQuestionIndex;
                            const status = examRecord?.answers?.find(a => a.questionIndex === globalIndex);

                            let variant: "default" | "outline" | "secondary" | "destructive" = "outline";
                            let customStyle = "";
                            
                            if (isReviewMode) {
                              if (isActive) {
                                variant = "default";
                                customStyle = "ring-4 ring-primary/20 border-none scale-110 z-10 font-black";
                              } else if (status?.isCorrect) {
                                customStyle = "bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20";
                              } else {
                                customStyle = "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20";
                              }
                            } else {
                              if (isActive) {
                                variant = "default";
                                customStyle = "ring-4 ring-primary/20 border-none scale-110 z-10 font-black";
                              } else if (isAnswered) {
                                customStyle = "bg-primary/10 text-primary border-primary/20 font-black";
                              }
                            }

                            return (
                              <Button
                                key={globalIndex}
                                variant={variant}
                                onClick={() => handleJumpToQuestion(globalIndex)}
                                className={`aspect-square h-auto p-0 text-sm font-bold transition-all rounded-xl ${customStyle}`}
                              >
                                {globalIndex + 1}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
              
              <div className="p-5 bg-muted/30 border-t flex items-center justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500" /> 正确</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-destructive" /> 错误</div>
                <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-primary" /> 当前</div>
              </div>
            </Card>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default function ExamPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse">正在进入考场...</p>
      </div>
    }>
      <ExamPageContent />
    </Suspense>
  );
}
