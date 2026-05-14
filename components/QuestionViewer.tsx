'use client';

import React from 'react';
import { Question } from '@/types/exam';

interface QuestionViewerProps {
  question: Question;
  answer?: string | string[];
  onAnswerChange: (answer: string | string[]) => void;
  questionNumber: number;
  totalQuestions: number;
}

export default function QuestionViewer({
  question,
  answer,
  onAnswerChange,
  questionNumber,
  totalQuestions,
}: QuestionViewerProps) {
  const handleOptionClick = (optionKey: string) => {
    onAnswerChange(optionKey);
  };

  const handleFillInBlankChange = (value: string) => {
    onAnswerChange(value);
  };

  const handleEssayChange = (value: string) => {
    onAnswerChange(value);
  };

  return (
    <div className="bg-white rounded-lg shadow p-8 mb-8">
      {/* Question Header */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-4 mb-4">
          <span className="bg-indigo-600 text-white px-3 py-1 rounded text-sm font-semibold">
            第 {questionNumber} / {totalQuestions} 题
          </span>
          <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded text-sm">
            {question.score} 分
          </span>
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          {typeof question.stem === 'string' ? question.stem : 'Untitled'}
        </h2>
      </div>

      {/* Question Content */}
      <div className="mb-8">
        {question.type === 'single_choice' && question.content && 'options' in question.content && (
          <div className="space-y-3">
            {Object.entries(question.content.options || {}).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleOptionClick(key)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 flex items-center gap-3 ${
                  answer === key
                    ? 'bg-indigo-50 border-indigo-600'
                    : 'bg-gray-50 border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    answer === key ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300'
                  }`}
                >
                  {answer === key && <div className="w-2 h-2 bg-white rounded-full"></div>}
                </div>
                <span className="font-semibold text-gray-700">{key}.</span>
                <span className="text-gray-700">{value as any}</span>
              </button>
            ))}
          </div>
        )}

        {question.type === 'cloze' && (
          <div className="space-y-4">
            <textarea
              value={(answer as string) || ''}
              onChange={(e) => handleFillInBlankChange(e.target.value)}
              placeholder="请输入你的答案..."
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 resize-none"
              rows={4}
            ></textarea>
          </div>
        )}

        {question.type === 'essay' && (
          <div className="space-y-4">
            <textarea
              value={(answer as string) || ''}
              onChange={(e) => handleEssayChange(e.target.value)}
              placeholder="请输入你的答案..."
              className="w-full p-4 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 resize-none"
              rows={8}
            ></textarea>
          </div>
        )}
      </div>

      {/* Answer Indicator */}
      {answer && (
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
          <p className="text-sm text-blue-600">
            ✓ 你的答案: <span className="font-semibold">{answer}</span>
          </p>
        </div>
      )}
    </div>
  );
}
