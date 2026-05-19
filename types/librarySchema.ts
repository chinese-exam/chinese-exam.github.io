import { z } from 'zod';
import type { LibraryNode, ExamLibrary } from './library';

export const LibraryNodeSchema: z.ZodType<LibraryNode> = z.lazy(() =>
  z.union([
    z.string(),
    z.record(z.string(), LibraryNodeSchema),
  ])
);

export const ExamLibrarySchema: z.ZodType<ExamLibrary> = z.record(z.string(), LibraryNodeSchema);
