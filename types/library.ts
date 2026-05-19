/**
 * Types for the recursive Exam Library structure
 */

export type LibraryNode = string | { [key: string]: LibraryNode };

export type ExamLibrary = Record<string, LibraryNode>;

export interface LibraryPaper {
  id: string;
  name: string;
  url: string;
  path: string[]; // 记录路径，例如 ["官方题库", "初级", "语文"]
}
