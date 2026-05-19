import { z } from 'zod';
import type { 
  ContentBlock, 
  ChoiceOption, 
  QuestionContent, 
  Question, 
  PaperSection, 
  Paper 
} from './paper';

export const BlankContentBlockSchema = z.object({
  type: z.literal("blank"),
});

export const BreakContentBlockSchema = z.object({
  type: z.literal("break"),
});

export const ImageContentBlockSchema = z.object({
  type: z.literal("image"),
  src: z.string(),
  width: z.number(),
  height: z.number(),
  inline: z.boolean().optional(),
});

export const MathContentBlockSchema = z.object({
  type: z.literal("math"),
  expression: z.string(),
  inline: z.boolean().optional(),
});

// Recursive ContentBlock Schema
export const ContentBlockSchema: z.ZodType<ContentBlock> = z.lazy(() =>
  z.union([
    z.string(),
    BlankContentBlockSchema,
    BreakContentBlockSchema,
    ImageContentBlockSchema,
    MathContentBlockSchema,
    z.array(ContentBlockSchema),
  ])
);

export const QuestionTypeSchema = z.union([
  z.literal("single_choice"),
  z.literal("multiple_choice"),
  z.literal("cloze"),
  z.literal("judgment"),
  z.literal("blank"),
  z.literal("matching"),
  z.literal("essay"),
  z.literal("coding"),
  z.literal("composite"),
]);

export const ChoiceOptionSchema: z.ZodType<ChoiceOption> = z.record(z.string(), ContentBlockSchema);

export const SingleChoiceContentSchema = z.object({
  options: ChoiceOptionSchema,
});

export const MultipleChoiceContentSchema = z.object({
  options: ChoiceOptionSchema,
});

export const ClozeContentSchema = z.object({
  options: ChoiceOptionSchema.optional(),
});

export const QuestionContentSchema: z.ZodType<QuestionContent> = z.union([
  SingleChoiceContentSchema,
  MultipleChoiceContentSchema,
  ClozeContentSchema,
  z.any(),
]);

export const QuestionSchema: z.ZodType<Question> = z.object({
  type: QuestionTypeSchema.optional(),
  stem: ContentBlockSchema.optional(),
  content: QuestionContentSchema.optional(),
  answer: ContentBlockSchema.optional(),
  score: z.number().optional(),
  tags: z.array(z.string()).optional(),
  difficulty: z.number().optional(),
  analysis: ContentBlockSchema.optional(),
  prompt: z.string().optional(),
});

export const PaperSectionSchema: z.ZodType<PaperSection> = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  content: z.any().optional(),
  totalScore: z.number().optional(),
  totalQuestions: z.number().optional(),
  totalDuration: z.number().optional(),
  questions: z.array(QuestionSchema).optional(),
  // For dynamic exams
  questionBank: z.array(QuestionSchema).optional(),
  randomSelection: z.object({
    count: z.number(),
    types: z.array(QuestionTypeSchema).optional(),
  }).optional(),
});

export const PaperSchema: z.ZodType<Paper> = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  year: z.number().optional(),
  month: z.number().optional(),
  totalScore: z.number().optional(),
  totalQuestions: z.number().optional(),
  totalDuration: z.number().optional(),
  passingScore: z.number().optional(),
  sections: z.array(PaperSectionSchema).optional(),
});
