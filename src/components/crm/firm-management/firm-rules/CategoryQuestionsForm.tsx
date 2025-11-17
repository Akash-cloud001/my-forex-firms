/* eslint-disable */
// @ts-nocheck
import React from 'react';
import { useFieldArray, Controller } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import type { QuestionFormData } from './types';

interface Props {
  control: any;
  categoryIndex: number;
  errors: any;
  categoryName: string;
}

export const CategoryQuestionsForm: React.FC<Props> = ({
  control,
  categoryIndex,
  errors,
  categoryName,
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `categories.${categoryIndex}.questions`,
  });

  const handleAdd = () => append({ question: '', answer: '' } as QuestionFormData);

  const handleDelete = (idx: number) => {
    if (fields.length === 1) {
      alert('Cannot delete the last question. A category must have at least one question.');
      return;
    }
    remove(idx);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {categoryName || 'Untitled Category'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {fields.length} {fields.length === 1 ? 'question' : 'questions'} in this category
          </p>
        </div>
        <Button
          onClick={handleAdd}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:opacity-90 transition-all text-sm font-semibold"
        >
          <Plus className="h-4 w-4" />
          Add Question
        </Button>
      </div>

      {errors.categories?.[categoryIndex]?.questions?.message && (
        <Alert className="mb-6 border-destructive bg-destructive/10">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">
            {errors.categories[categoryIndex].questions.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto pr-2">
        {fields.map((field, qIdx) => (
          <div
            key={field.id}
            className="group p-6 bg-accent/30 border border-border rounded-lg hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">
                  {qIdx + 1}
                </span>
                <h3 className="text-base font-semibold text-foreground">
                  Question {qIdx + 1}
                </h3>
              </div>
              {fields.length > 1 && (
                <Button
                  onClick={() => handleDelete(qIdx)}
                  className="text-destructive hover:text-destructive/80 p-2 hover:bg-destructive/10 rounded-md transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Question <span className="text-destructive">*</span>
                </label>
                <Controller
                  name={`categories.${categoryIndex}.questions.${qIdx}.question`}
                  control={control}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="text"
                      placeholder="Enter your question here"
                      className={`w-full px-4 py-3 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm text-foreground placeholder:text-muted-foreground ${
                        errors.categories?.[categoryIndex]?.questions?.[qIdx]?.question
                          ? 'border-destructive'
                          : 'border-input'
                      }`}
                    />
                  )}
                />
                {errors.categories?.[categoryIndex]?.questions?.[qIdx]?.question && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.categories[categoryIndex].questions[qIdx].question.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Answer <span className="text-destructive">*</span>
                </label>
                <Controller
                  name={`categories.${categoryIndex}.questions.${qIdx}.answer`}
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      placeholder="Enter detailed answer here..."
                      rows={6}
                      className={`w-full px-4 py-3 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm text-foreground placeholder:text-muted-foreground resize-y min-h-[150px] ${
                        errors.categories?.[categoryIndex]?.questions?.[qIdx]?.answer
                          ? 'border-destructive'
                          : 'border-input'
                      }`}
                    />
                  )}
                />
                {errors.categories?.[categoryIndex]?.questions?.[qIdx]?.answer && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.categories[categoryIndex].questions[qIdx].answer.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};