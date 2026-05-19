/**
 * 数据加载和管理服务
 */

import { DifficultyLevel, ExamAnswer } from '@/types/exam';
import { LibraryPaper, LibraryNode, ExamLibrary } from '@/types/library';
import { Paper, Question } from '@/types/paper';
import { PaperSchema } from '@/types/paperSchema';
import { ExamLibrarySchema } from '@/types/librarySchema';

const BASE_URL = '/questions';

/**
 * 获取试卷库清单
 */
export async function getExamLibrary(): Promise<ExamLibrary | null> {
  try {
    const response = await fetch('/library.json', { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Failed to load library manifest');
    }
    const rawData = await response.json();
    
    // Zod Validation for recursive structure
    const result = ExamLibrarySchema.safeParse(rawData);
    if (!result.success) {
      console.error('Zod Validation Error for Library:', result.error.format());
      return null;
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching exam library:', error);
    return null;
  }
}

/**
 * 展平递归题库为扁平列表，方便 UI 显示
 */
export function flattenLibrary(library: ExamLibrary): LibraryPaper[] {
  const papers: LibraryPaper[] = [];

  function traverse(name: string, node: LibraryNode, path: string[]) {
    if (typeof node === 'string') {
      // It's a paper URL
      const currentPath = [...path, name];
      papers.push({
        id: currentPath.join('->'), // Use full path as unique ID
        name: name,
        url: node,
        path: path
      });
    } else {
      // It's a category (Recursive Record)
      const currentPath = [...path, name];
      Object.entries(node).forEach(([childName, childNode]) => {
        traverse(childName, childNode, currentPath);
      });
    }
  }

  Object.entries(library).forEach(([name, node]) => {
    traverse(name, node, []);
  });

  return papers;
}

/**
 * 加载试卷数据（支持本地相对路径或远程绝对路径）
 */
export async function loadExamPaperFromUrl(url: string): Promise<Paper | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to load paper from ${url}`);
    }
    const rawData = await response.json();
    
    // Zod Validation
    const result = PaperSchema.safeParse(rawData);
    if (!result.success) {
      console.error('Zod Validation Error for Paper:', result.error.format());
      throw new Error('试卷数据格式校验失败，请检查 JSON 结构。');
    }
    
    return result.data;
  } catch (error) {
    console.error(`Error loading exam paper from ${url}:`, error);
    throw error; // Throwing error to let caller handle specialized UI
  }
}

/**
 * 保持向下兼容的加载方法
 */
export async function loadExamPaper(
  subject: string,
  difficulty: DifficultyLevel
): Promise<Paper | null> {
  const filename = `${subject}_${difficulty}.json`;
  return loadExamPaperFromUrl(`${BASE_URL}/${filename}`);
}

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

/**
 * 计算考试得分
 */
export function calculateExamScore(questions: Question[], answers: Record<number, string | string[]>) {
  let obtainedPoints = 0;
  const userAnswers: ExamAnswer[] = [];

  questions.forEach((question, index) => {
    const userAnswer = answers[index];
    const correctAnswer = question.answer;
    let isCorrect = false;

    const getAnswerString = (ans: any): string => {
      if (typeof ans === 'string') return ans.trim();
      if (Array.isArray(ans)) return ans.map(getAnswerString).join('').trim();
      if (ans && typeof ans === 'object' && ans.type === 'math') return ans.expression.trim();
      return '';
    };

    const correctStr = getAnswerString(correctAnswer);

    if (question.type === 'single_choice' || question.type === 'judgment') {
      isCorrect = userAnswer === correctStr;
    } else if (question.type === 'multiple_choice') {
      const userArr = Array.isArray(userAnswer) ? [...userAnswer].sort() : [];
      let correctArr: string[] = [];
      if (Array.isArray(correctAnswer)) {
        correctArr = [...(correctAnswer as any)].sort();
      } else if (typeof correctAnswer === 'string') {
        correctArr = correctAnswer.split('').sort();
      }
      isCorrect = JSON.stringify(userArr) === JSON.stringify(correctArr);
    } else if (question.type === 'cloze' || question.type === 'blank') {
      const userStr = typeof userAnswer === 'string' ? userAnswer.trim() : '';
      isCorrect = userStr.toLowerCase() === correctStr.toLowerCase();
    } else if (question.type === 'essay') {
      isCorrect = false; 
    }

    if (isCorrect) {
      obtainedPoints += question.score || 0;
    }

    userAnswers.push({
      questionIndex: index,
      answer: userAnswer,
      isCorrect,
      pointsObtained: isCorrect ? (question.score || 0) : 0
    });
  });

  const accuracy = questions.length > 0 ? (userAnswers.filter(a => a.isCorrect).length / questions.length) * 100 : 0;

  return { obtainedPoints, userAnswers, accuracy };
}
