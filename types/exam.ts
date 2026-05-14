export type BlankContentBlock = { type: "blank" };

export type ImageContentBlock = {
  type: "image";
  src: string;
  width: number;
  height: number;
  inline?: boolean;
};

export type MathContentBlock = {
  type: "math";
  expression: string;
  inline?: boolean;
};

export type ContentBlock =
  | string
  | BlankContentBlock
  | ImageContentBlock
  | MathContentBlock
  | ContentBlock[];

export type QuestionType =
  | "single_choice"
  | "multiple_choice"
  | "cloze"
  | "judgment"
  | "blank"
  | "matching"
  | "essay"
  | "coding"
  | "composite";

export type ChoiceOption = Record<string, ContentBlock>;

export type SingleChoiceContent = {
  options: ChoiceOption;
};

export type MultipleChoiceContent = {
  options: ChoiceOption[];
};

export type ClozeContent = {
  options: ChoiceOption[];
};

export type QuestionContent =
  | SingleChoiceContent
  | MultipleChoiceContent
  | ClozeContent;

export type Question = {
  type?: QuestionType;
  stem?: ContentBlock;
  content?: QuestionContent;
  answer?: ContentBlock;
  score?: number;
  tags?: string[];
  difficulty?: number;
  analysis?: ContentBlock;
  prompt?: string;
};

export type PaperSection = {
  title?: string;
  description?: string;
  content?: any;
  totalScore?: number;
  totalQuestions?: number;
  totalDuration?: number;
  questions?: Question[];
};

export type Paper = {
  name?: string;
  year?: number;
  month?: number;
  totalScore?: number;
  totalQuestions?: number;
  totalDuration?: number;
  passingScore?: number;
  sections?: PaperSection[];
};

/**
 * 科目枚举
 */
export enum Subject {
  CHINESE = 'chinese',
  MATH = 'math',
  ENGLISH = 'english',
}

/**
 * 难度级别
 */
export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

/**
 * 用户答题记录
 */
export interface UserAnswer {
  questionIndex: number;        // 题目索引
  answer: string | string[];    // 用户的答案
  isCorrect?: boolean;          // 是否正确
  pointsObtained?: number;      // 获得的分数
}

/**
 * 考试记录
 */
export interface ExamRecord {
  id: string;                   // 记录 ID
  paperName: string;            // 试卷名称
  subject: Subject;             // 科目
  difficulty: DifficultyLevel;  // 难度
  startTime: number;            // 开始时间（时间戳）
  endTime?: number;             // 结束时间（时间戳）
  totalTime: number;            // 总时间（分钟）
  timeUsed?: number;            // 实际用时（秒）
  totalPoints: number;          // 总分
  obtainedPoints: number;       // 获得分数
  accuracy: number;             // 正确率（百分比）
  answers: UserAnswer[];        // 答题记录
  status: 'in_progress' | 'completed' | 'abandoned';
}
