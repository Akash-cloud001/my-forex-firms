/* eslint-disable */
// @ts-nocheck
"use client";
import React, { useState } from 'react';
import { Save, AlertTriangle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

import { useFirmRuleForm } from './useFirmRuleForm';
import { CategoryList } from './CategoryList';
import { CategoryQuestionsForm } from './CategoryQuestionsForm';
import type { FirmRuleFormData } from './types';

interface Props {
  firmId: string;
  existingData?: FirmRuleFormData;
  onSubmit: (data: FirmRuleFormData) => void;
}

export const FirmRuleForm: React.FC<Props> = ({ firmId, existingData, onSubmit }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [deleteDlg, setDeleteDlg] = useState<{
    open: boolean;
    idx: number;
    name: string;
  }>({ open: false, idx: -1, name: '' });

  const {
    control,
    handleSubmit,
    errors,
    isSubmitting,
    setValue,
    watch,
    getValues,
    categoryFields,
    appendCategory,
    removeCategory,
  } = useFirmRuleForm({ firmId, existingData });

  // ---------- Category CRUD ----------
  const createCategory = () => {
    const trimmed = newName.trim();
    if (!trimmed) return;

    appendCategory({
      name: trimmed,
      questions: [{ question: '', answer: '' }],
    });

    setTimeout(() => {
      const cats = getValues('categories');
      setSelectedIdx(cats.length - 1);
    }, 0);

    setAdding(false);
    setNewName('');
  };

  const confirmDelete = () => {
    removeCategory(deleteDlg.idx);
    if (selectedIdx === deleteDlg.idx) setSelectedIdx(null);
    else if (selectedIdx !== null && selectedIdx > deleteDlg.idx) setSelectedIdx((s) => s! - 1);
    setDeleteDlg((d) => ({ ...d, open: false }));
  };

  // ---------- Submission ----------
  const onFormSubmit = (data: FirmRuleFormData) => {
    const cleaned = {
      ...data,
      categories: data.categories.map((c) => ({
        ...(c._id ? { _id: c._id } : {}),
        name: c.name,
        questions: c.questions.map((q) => ({
          ...(q._id ? { _id: q._id } : {}),
          question: q.question,
          answer: q.answer,
        })),
      })),
    };
    // console.log('=== SUBMIT ===', JSON.stringify(cleaned, null, 2));
    onSubmit(cleaned);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Firm Rules Management</h1>
            <p className="text-muted-foreground">Organize firm rules into categories with detailed Q&A</p>
          </div>
          <Button
            onClick={handleSubmit(onFormSubmit)}
             disabled={isSubmitting}
            className="flex items-center gap-2 bg-gradient-to-r from-[#F66435] to-[#672611] text-white px-6 py-3 rounded-lg hover:opacity-90 transition-all font-semibold shadow-lg"
          >
            <Save className="h-5 w-5" />
            Save All Rules
          </Button>
        </div>

        {errors.categories?.message && (
          <Alert className="mb-6 border-destructive bg-destructive/10">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">{errors.categories.message}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left – Questions */}
          <div className="lg:col-span-8">
            <div className="bg-card border border-border rounded-lg shadow-sm">
              {selectedIdx !== null && categoryFields[selectedIdx] ? (
                <CategoryQuestionsForm
                  key={selectedIdx}
                  control={control}
                  categoryIndex={selectedIdx}
                  errors={errors}
                  categoryName={watch(`categories.${selectedIdx}.name`)}
                />
              ) : (
                <div className="flex items-center justify-center h-[600px] text-muted-foreground">
                  <div className="text-center space-y-4">
                    <div className="mx-auto w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center">
                      <Plus className="h-12 w-12 text-accent-foreground" />
                    </div>
                    <p className="text-xl font-semibold text-foreground mb-2">No Category Selected</p>
                    <p className="text-sm">Create a category using the &quot;Add Category&quot; button on the right</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right – Category List */}
          <div className="lg:col-span-4">
            <CategoryList
              categoryFields={categoryFields}
              selectedIndex={selectedIdx}
              editingIndex={editingIdx}
              isAdding={adding}
              newName={newName}
              watch={watch}
              control={control}
              errors={errors}
              onSelect={setSelectedIdx}
              onEdit={(i, e) => {
                e.stopPropagation();
                setEditingIdx(i);
              }}
              onSaveEdit={(i) => {
                const n = getValues(`categories.${i}.name`);
                if (n?.trim()) setEditingIdx(null);
              }}
              onCancelEdit={(i, orig) => {
                setValue(`categories.${i}.name`, orig);
                setEditingIdx(null);
              }}
              onAddClick={() => setAdding(true)}
              onCreate={createCategory}
              onCancelAdd={() => {
                setAdding(false);
                setNewName('');
              }}
              onSetName={setNewName}
              onDeleteCategory={(i, name, e) => {
                e.stopPropagation();
                setDeleteDlg({ open: true, idx: i, name });
              }}
            />
          </div>
        </div>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDlg.open} onOpenChange={(o) => setDeleteDlg((d) => ({ ...d, open: o }))}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirm Deletion
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Are you sure you want to delete{' '}
              <span className="font-semibold text-foreground">&quot;{deleteDlg.name}&quot;</span>? This will
              permanently remove the category and all its questions.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-muted text-foreground hover:bg-muted/80">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      
    </div>
  );
};