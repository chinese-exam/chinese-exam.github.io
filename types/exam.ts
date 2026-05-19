import { Question } from './paper';

export interface ExamSection {
  title: string;
  description?: string;
  questions: Question[]; // 题库池
  questionsCount: number; // 抽取的题目数量
  scorePerQuestion?: number; // 每题分数（若一致）
}

export interface Exam {
  id: string;
  name: string;
  description?: string;
  type: 'fixed' | 'dynamic';
  
  // 考试设置
  totalScore: number;
  totalDuration: number; // 分钟
  passingScore: number;
  
  // 固定模式：预定义的试卷列表
  papers?: Record<string, string>; // 名称 -> URL
  
  // 动态模式：从题库抽取的章节定义
  sections?: ExamSection[];
  
  // 图标
  icon?: string;
}

export interface UserAnswer {
  questionIndex: number;
  answer: string | string[];
  isCorrect?: boolean;
  pointsObtained?: number;
}

export interface ExamRecord {
  id: string;
  paperName: string;
  startTime: number;
  endTime?: number;
  totalTime: number;
  timeUsed?: number;
  totalPoints: number;
  obtainedPoints: number;
  accuracy: number;
  answers: UserAnswer[];
  status: 'in_progress' | 'completed' | 'abandoned';
}
