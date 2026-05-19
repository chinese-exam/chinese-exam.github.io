/**
 * Content and Question blocks that make up a Paper
 */

export type BlankContentBlock = {
  type: "blank";
};

export type BreakContentBlock = {
  type: "break";
};

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
  | BreakContentBlock
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

export interface SingleChoiceContent {
  options: ChoiceOption;
}

export interface MultipleChoiceContent {
  options: ChoiceOption;
}

export interface ClozeContent {
  options?: ChoiceOption;
}

export type QuestionContent =
  | SingleChoiceContent
  | MultipleChoiceContent
  | ClozeContent
  | any; // Fallback for other types

export interface Question {
  type?: QuestionType;
  stem?: ContentBlock;
  content?: QuestionContent;
  answer?: ContentBlock;
  score?: number;
  tags?: string[];
  difficulty?: number;
  analysis?: ContentBlock;
  prompt?: string;
}

export interface PaperSection {
  title?: string;
  description?: string;
  content?: any;
  totalScore?: number;
  totalQuestions?: number;
  totalDuration?: number;
  questions?: Question[];
  // For dynamic exams
  questionBank?: Question[];
  randomSelection?: {
    count: number;
    types?: QuestionType[];
  };
}

export interface Paper {
  id?: string;
  name?: string;
  year?: number;
  month?: number;
  totalScore?: number;
  totalQuestions?: number;
  totalDuration?: number;
  passingScore?: number;
  sections?: PaperSection[];
}
