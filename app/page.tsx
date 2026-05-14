'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Subject, DifficultyLevel } from '@/types/exam';
import { EXAM_CATALOG } from '@/lib/exam-service';

export default function HomePage() {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyLevel | null>(null);

  const canStart = selectedSubject && selectedDifficulty;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">模拟考试系统</h1>
          <p className="text-xl text-gray-600">选择科目和难度，开始你的考试之旅</p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl p-8">
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">选择科目</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {EXAM_CATALOG.subjects.map((subject) => (
                <button
                  key={subject.value}
                  onClick={() => setSelectedSubject(subject.value)}
                  className={`p-6 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 ${
                    selectedSubject === subject.value
                      ? 'bg-indigo-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {subject.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">选择难度</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {EXAM_CATALOG.difficulties.map((difficulty) => (
                <button
                  key={difficulty.value}
                  onClick={() => setSelectedDifficulty(difficulty.value)}
                  className={`p-6 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105 ${
                    selectedDifficulty === difficulty.value
                      ? `${difficulty.color} text-white shadow-lg`
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {difficulty.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            {canStart ? (
              <Link
                href={`/exam?subject=${selectedSubject}&difficulty=${selectedDifficulty}`}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 px-12 rounded-lg text-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                开始考试 →
              </Link>
            ) : (
              <button
                disabled
                className="bg-gray-300 text-gray-500 font-bold py-4 px-12 rounded-lg text-xl cursor-not-allowed"
              >
                请先选择科目和难度
              </button>
            )}
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-4xl mb-4">⏱️</div>
            <h3 className="text-xl font-bold mb-2">实时计时</h3>
            <p className="text-gray-600">精确的考试计时，时间管理更科学</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2">自动评分</h3>
            <p className="text-gray-600">实时显示成绩，查看答题分析</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-4xl mb-4">💾</div>
            <h3 className="text-xl font-bold mb-2">进度保存</h3>
            <p className="text-gray-600">自动保存进度，意外中断也不怕</p>
          </div>
        </div>
      </div>
    </div>
  );
}
