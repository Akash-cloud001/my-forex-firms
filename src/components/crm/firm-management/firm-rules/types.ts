import { z } from 'zod';

export const questionSchema = z.object({
  _id: z.string().optional(),
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
});

export const categorySchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1, 'Category name is required'),
  questions: z.array(questionSchema).min(1, 'At least one question is required'),
});

export const firmRuleSchema = z.object({
  firmId: z.string().min(1, 'Firm ID is required'),
  categories: z.array(categorySchema).min(1, 'At least one category is required'),
});

export type QuestionFormData = z.infer<typeof questionSchema>;
export type CategoryFormData = z.infer<typeof categorySchema>;
export type FirmRuleFormData = z.infer<typeof firmRuleSchema>;