'use client';

import React from 'react';
import { Question, SingleChoiceContent, MultipleChoiceContent } from '@/types/paper';
import ContentRenderer from './ContentRenderer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Lightbulb, User, Check, SquareCheck, Square } from 'lucide-react';

interface QuestionViewerProps {
  question: Question;
  answer?: string | string[];
  onAnswerChange?: (answer: string | string[]) => void;
  questionNumber: number;
  totalQuestions: number;
  showAnalysis?: boolean;
  isCorrect?: boolean;
}

export default function QuestionViewer({
  question,
  answer,
  onAnswerChange,
  questionNumber,
  totalQuestions,
  showAnalysis = false,
  isCorrect,
}: QuestionViewerProps) {
  const handleOptionClick = (optionKey: string) => {
    if (showAnalysis) return;
    onAnswerChange?.(optionKey);
  };

  const handleMultipleChoiceToggle = (optionKey: string) => {
    if (showAnalysis) return;
    const currentAnswers = Array.isArray(answer) ? [...answer] : [];
    const index = currentAnswers.indexOf(optionKey);
    if (index > -1) {
      currentAnswers.splice(index, 1);
    } else {
      currentAnswers.push(optionKey);
    }
    // Sort for consistency
    onAnswerChange?.(currentAnswers.sort());
  };

  const handleFillInBlankChange = (value: string) => {
    if (showAnalysis) return;
    onAnswerChange?.(value);
  };

  const handleEssayChange = (value: string) => {
    if (showAnalysis) return;
    onAnswerChange?.(value);
  };

  // Helper to get string representation of answer
  const getAnswerString = (ans: any): string => {
    if (typeof ans === 'string') return ans;
    if (Array.isArray(ans)) return ans.join(', ');
    if (ans && typeof ans === 'object' && ans.type === 'math') return ans.expression;
    return '';
  };

  const correctStr = getAnswerString(question.answer);

  return (
    <Card className={`shadow-sm border-none ring-1 transition-all ${
      showAnalysis 
        ? (isCorrect ? 'ring-green-500/50 bg-green-50/10' : 'ring-red-500/50 bg-red-50/10') 
        : 'ring-slate-200 dark:ring-slate-800'
    }`}>
      <CardHeader className="space-y-4 border-b bg-slate-50/50 dark:bg-slate-900/50 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <Badge variant="secondary" className="rounded-md px-2 py-0.5 font-bold whitespace-nowrap">
              第 {questionNumber} 题
            </Badge>
            <Badge variant="outline" className="bg-white dark:bg-slate-950 font-bold text-muted-foreground whitespace-nowrap uppercase tracking-tighter">
              {question.type?.replace('_', ' ') || 'QUESTION'}
            </Badge>
            <Badge variant="outline" className="bg-white dark:bg-slate-950 font-bold">
              {question.score} 分
            </Badge>
          </div>
          {showAnalysis && (
            <div className="flex items-center gap-1.5 font-bold animate-in fade-in zoom-in duration-300">
              {isCorrect ? (
                <Badge className="bg-green-600 hover:bg-green-600 gap-1 px-3">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 正确
                </Badge>
              ) : (
                <Badge variant="destructive" className="gap-1 px-3">
                  <XCircle className="w-3.5 h-3.5" /> 错误
                </Badge>
              )}
            </div>
          )}
        </div>
        <CardTitle className="text-lg text-slate-900 dark:text-slate-100 font-mono">
          <ContentRenderer content={question.stem} />
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-8 pb-10">
        <div className="space-y-6">
          {/* 1. Single Choice */}
          {question.type === 'single_choice' && question.content && 'options' in question.content && (
            <RadioGroup 
              value={(answer as string) || ""} 
              onValueChange={handleOptionClick} 
              disabled={showAnalysis}
              className="space-y-3"
            >
              {Object.entries((question.content as SingleChoiceContent).options || {}).map(([key, value]) => {
                const isUserAnswer = answer === key;
                const isCorrectAnswer = correctStr === key;
                
                let stateClasses = "border-slate-200 dark:border-slate-800 hover:border-primary/30 hover:bg-slate-50";
                
                if (showAnalysis) {
                  if (isCorrectAnswer) {
                    stateClasses = "border-green-500 bg-green-50/50 ring-1 ring-green-500 dark:bg-green-900/20";
                  } else if (isUserAnswer && !isCorrect) {
                    stateClasses = "border-red-500 bg-red-50/50 ring-1 ring-red-500 dark:bg-red-900/20";
                  } else {
                    stateClasses = "opacity-60 border-slate-200 grayscale-[0.5]";
                  }
                } else if (isUserAnswer) {
                  stateClasses = "border-primary bg-primary/5 ring-1 ring-primary";
                }

                return (
                  <div key={key} className="flex items-center">
                    <RadioGroupItem value={key} id={`q-${questionNumber}-${key}`} className="sr-only" />
                    <Label
                      htmlFor={`q-${questionNumber}-${key}`}
                      className={`flex-1 flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${stateClasses}`}
                    >
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                        isUserAnswer 
                          ? (showAnalysis ? (isCorrect ? 'bg-green-600 border-green-600 text-white' : 'bg-red-600 border-red-600 text-white') : 'bg-primary border-primary text-primary-foreground') 
                          : 'border-slate-300 dark:border-slate-700 text-slate-500'
                      }`}>
                        {key}
                      </div>
                      <div className="flex-1 text-base font-medium">
                        <ContentRenderer content={value} />
                      </div>
                      {showAnalysis && isCorrectAnswer && (
                        <Check className="w-5 h-5 text-green-600 shrink-0" />
                      )}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          )}

          {/* 2. Multiple Choice */}
          {question.type === 'multiple_choice' && question.content && 'options' in question.content && (
            <div className="space-y-3">
              {Object.entries((question.content as MultipleChoiceContent).options || {}).map(([key, value]) => {
                const currentAnswers = Array.isArray(answer) ? answer : [];
                const isUserAnswer = currentAnswers.includes(key);
                const isCorrectAnswer = Array.isArray(question.answer) ? (question.answer as string[]).includes(key) : false;
                
                let stateClasses = "border-slate-200 dark:border-slate-800 hover:border-primary/30 hover:bg-slate-50";
                
                if (showAnalysis) {
                  if (isCorrectAnswer) {
                    stateClasses = "border-green-500 bg-green-50/50 ring-1 ring-green-500 dark:bg-green-900/20";
                  } else if (isUserAnswer && !isCorrectAnswer) {
                    stateClasses = "border-red-500 bg-red-50/50 ring-1 ring-red-500 dark:bg-red-900/20";
                  } else {
                    stateClasses = "opacity-60 border-slate-200 grayscale-[0.5]";
                  }
                } else if (isUserAnswer) {
                  stateClasses = "border-primary bg-primary/5 ring-1 ring-primary";
                }

                return (
                  <div 
                    key={key} 
                    className="flex items-center"
                    onClick={() => handleMultipleChoiceToggle(key)}
                  >
                    <div
                      className={`flex-1 flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${stateClasses}`}
                    >
                      <div className="shrink-0 relative flex items-center justify-center pointer-events-none">
                        <Checkbox 
                          checked={isUserAnswer} 
                          disabled={showAnalysis}
                          className="w-5 h-5 border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary" 
                        />
                      </div>
                      <span className="font-bold text-slate-500 shrink-0">{key}.</span>
                      <div className="flex-1 text-base font-medium">
                        <ContentRenderer content={value} />
                      </div>
                      {showAnalysis && isCorrectAnswer && (
                        <Check className="w-5 h-5 text-green-600 shrink-0" />
                      )}
                    </div>
                  </div>
                );
              })}
              {!showAnalysis && (
                <p className="text-[11px] text-muted-foreground font-medium px-1 pt-1 flex items-center gap-1">
                  <SquareCheck className="w-3 h-3" /> 多选题：请选择所有正确选项
                </p>
              )}
            </div>
          )}

          {/* 3. Judgment */}
          {question.type === 'judgment' && (
            <div className="space-y-3">
              {['正确', '错误'].map((option) => {
                const isUserAnswer = answer === option;
                const isCorrectAnswer = question.answer === option;
                
                let stateClasses = "border-slate-200 dark:border-slate-800 hover:border-primary/30 hover:bg-slate-50";
                
                if (showAnalysis) {
                  if (isCorrectAnswer) {
                    stateClasses = "border-green-500 bg-green-50/50 ring-1 ring-green-500 dark:bg-green-900/20";
                  } else if (isUserAnswer && !isCorrect) {
                    stateClasses = "border-red-500 bg-red-50/50 ring-1 ring-red-500 dark:bg-red-900/20";
                  } else {
                    stateClasses = "opacity-60 border-slate-200 grayscale-[0.5]";
                  }
                } else if (isUserAnswer) {
                  stateClasses = "border-primary bg-primary/5 ring-1 ring-primary";
                }

                return (
                  <div 
                    key={option} 
                    className="flex items-center"
                    onClick={() => handleOptionClick(option)}
                  >
                    <div
                      className={`flex-1 flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${stateClasses}`}
                    >
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                        isUserAnswer 
                          ? (showAnalysis ? (isCorrect ? 'bg-green-600 border-green-600 text-white' : 'bg-red-600 border-red-600 text-white') : 'bg-primary border-primary text-primary-foreground') 
                          : 'border-slate-300 dark:border-slate-700 text-slate-500'
                      }`}>
                        {option === '正确' ? <Check className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 text-base font-bold">
                        {option}
                      </div>
                      {showAnalysis && isCorrectAnswer && (
                        <Check className="w-5 h-5 text-green-600 shrink-0" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* 4. Cloze / Essay / Blank */}
          {(question.type === 'cloze' || question.type === 'essay' || question.type === 'blank') && (
            <div className="space-y-2">
              <Textarea
                value={(answer as string) || ''}
                onChange={(e) => question.type === 'cloze' ? handleFillInBlankChange(e.target.value) : (question.type === 'blank' ? handleFillInBlankChange(e.target.value) : handleEssayChange(e.target.value))}
                placeholder="在此输入您的答案..."
                disabled={showAnalysis}
                className={`min-h-[160px] text-base p-4 rounded-xl border-2 transition-all ${
                  showAnalysis 
                    ? (isCorrect ? 'border-green-500 bg-green-50/20' : 'border-red-500 bg-red-50/20')
                    : 'focus:border-primary focus:ring-primary/20'
                }`}
              />
            </div>
          )}
        </div>

        {showAnalysis && (
          <div className="mt-10 space-y-2 animate-in slide-in-from-bottom-2 duration-400 w-full">
            {/* 1. Your Answer */}
            <div className={`${isCorrect ? 'bg-green-500/10 border-green-500/20 text-green-700' : 'bg-destructive/10 border-destructive/20 text-destructive'} border px-3 py-2 rounded-lg flex items-center gap-2 text-sm`}>
              <User className="w-4 h-4 shrink-0" />
              <div className="flex items-center gap-1 font-bold">
                <span className="opacity-70 text-[11px] uppercase tracking-wider">您的答案：</span>
                <span>{getAnswerString(answer) || '(未填写)'}</span>
              </div>
              <div className="ml-auto">
                {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              </div>
            </div>

            {/* 2. Correct Answer */}
            <div className="bg-primary/5 border border-primary/10 p-3 py-2 rounded-lg flex items-center gap-2 text-sm text-primary">
              <Check className="w-4 h-4 shrink-0" />
              <div className="flex items-center gap-1 font-bold text-foreground">
                <span className="text-primary opacity-70 text-[11px] uppercase tracking-wider">正确答案：</span>
                <ContentRenderer content={question.answer} />
              </div>
            </div>

            {/* 3. Score */}
            <div className="bg-muted border border-border px-3 py-2 rounded-lg flex items-center gap-2 text-[13px]">
              <div className={`w-4 h-4 flex items-center justify-center font-black text-[10px] shrink-0 ${isCorrect ? 'text-green-600' : 'text-destructive'}`}>
                {isCorrect ? question.score : 0}
              </div>
              <div className="flex items-center gap-1 font-bold">
                <span className="text-muted-foreground opacity-70 text-[11px] uppercase tracking-wider">本题得分：</span>
                <span className={isCorrect ? 'text-green-600' : 'text-destructive'}>{isCorrect ? question.score : 0}</span>
                <span className="text-muted-foreground/60 font-normal">/ {question.score} 分</span>
              </div>
            </div>
            
            {/* 4. Question Analysis */}
            <div className="bg-muted/30 p-4 rounded-xl border border-border mt-2">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1 bg-primary/10 rounded-md">
                  <Lightbulb className="w-3.5 h-3.5 text-primary" />
                </div>
                <h4 className="text-xs font-black text-foreground uppercase tracking-wider">题目解析</h4>
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed font-medium">
                <ContentRenderer content={question.analysis} />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
