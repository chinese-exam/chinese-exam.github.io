/**
 * 数据加载和管理服务
 */

import { Paper, Subject, DifficultyLevel } from '@/types/exam';

const BASE_URL = '/questions';

/**
 * 加载试卷数据
 */
export async function loadExamPaper(
  subject: Subject,
  difficulty: DifficultyLevel
): Promise<Paper | null> {
  const filename = `${subject}_${difficulty}.json`;
  try {
    const response = await fetch(`${BASE_URL}/${filename}`);
    if (!response.ok) {
      throw new Error(`Failed to load ${filename}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading exam paper:`, error);
    return null;
  }
}

/**
 * 获取所有可用的科目和难度组合
 */
export const EXAM_CATALOG = {
  subjects: [
    { value: 'chinese' as Subject, label: '中文' },
    { value: 'math' as Subject, label: '数学' },
    { value: 'english' as Subject, label: '英文' },
  ],
  difficulties: [
    { value: 'easy' as DifficultyLevel, label: '简单', color: 'bg-green-500' },
    { value: 'medium' as DifficultyLevel, label: '中等', color: 'bg-yellow-500' },
    { value: 'hard' as DifficultyLevel, label: '困难', color: 'bg-red-500' },
  ],
};

/**
 * 本地存储管理
 */
const STORAGE_PREFIX = 'exam_';

export function saveExamProgress(recordId: string, data: any) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`${STORAGE_PREFIX}${recordId}`, JSON.stringify(data));
  }
}

export function loadExamProgress(recordId: string) {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(`${STORAGE_PREFIX}${recordId}`);
    return data ? JSON.parse(data) : null;
  }
  return null;
}

export function deleteExamProgress(recordId: string) {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(`${STORAGE_PREFIX}${recordId}`);
  }
}

export function getAllExamProgress() {
  if (typeof window !== 'undefined') {
    const result = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) {
        result.push(JSON.parse(localStorage.getItem(key) || '{}'));
      }
    }
    return result;
  }
  return [];
}
