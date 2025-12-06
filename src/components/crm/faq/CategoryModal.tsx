"use client"
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CategoryFormData } from './type';

export const CategoryModal = ({
  isOpen,
  onClose,
  onSubmit,
  mode,
  defaultValues,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => void;
  mode: 'create' | 'edit';
  defaultValues?: Partial<CategoryFormData>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CategoryFormData>({
    defaultValues: defaultValues || { name: '', description: '' },
  });

  React.useEffect(() => {
    if (isOpen && defaultValues) {
      reset(defaultValues);
    }
  }, [isOpen, defaultValues, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const onFormSubmit = async (data: CategoryFormData) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">
            {mode === 'create' ? 'Create New Category' : 'Edit Category'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Add a new category to organize your FAQs'
              : 'Update category information'}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className='text-white'>
              Category Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="e.g., Billing, Shipping, Account..."
              {...register('name', {
                required: 'Category name is required',
                minLength: {
                  value: 2,
                  message: 'Category name must be at least 2 characters',
                },
              })}
            className={`text-white ${errors.name ? 'border-destructive' : ''}`}

            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className='text-white'>Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Brief description of what this category covers..."
              className='text-white'
              rows={3}
              {...register('description')}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" className='text-white' onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit(onFormSubmit)}
            disabled={isSubmitting}
            className="bg-linear-to-r from-[#F66435] to-[#672611]"
          >
            {mode === 'create' ? 'Create Category' : 'Update Category'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};