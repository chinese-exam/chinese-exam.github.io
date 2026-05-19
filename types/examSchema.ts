import { z } from 'zod';
import { QuestionSchema } from './paperSchema';
import type { 
  Exam, 
  ExamSection 
} from './exam';

export const ExamSectionSchema: z.ZodType<ExamSection> = z.object({
  title: z.string(),
  description: z.string().optional(),
  questions: z.array(QuestionSchema),
  questionsCount: z.number(),
  scorePerQuestion: z.number().optional(),
});

export const ExamSchema: z.ZodType<Exam> = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  type: z.enum(['fixed', 'dynamic']),
  totalScore: z.number(),
  totalDuration: z.number(),
  passingScore: z.number(),
  papers: z.record(z.string(), z.string()).optional(),
  sections: z.array(ExamSectionSchema).optional(),
  icon: z.string().optional(),
});
