import { useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';

/**
 * Custom hook to handle real-time form data changes
 * This hook provides a standardized way to handle onDataChange across all form steps
 */
export function useFormDataChange<T extends Record<string, any>>(
  form: UseFormReturn<T, any, T>,
  onDataChange?: (data: Record<string, unknown>) => void
) {
  const handleDataChange = useCallback(
    (fieldName: keyof T, value: any) => {
      if (onDataChange) {
        const currentData = form.getValues();
        const updatedData = { ...currentData, [fieldName]: value };
        onDataChange(updatedData as Record<string, unknown>);
      }
    },
    [form, onDataChange]
  );

  const createFieldChangeHandler = useCallback(
    (fieldName: keyof T) => {
      return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value = e.target.value;
        form.setValue(fieldName, value as T[keyof T]);
        handleDataChange(fieldName, value);
      };
    },
    [form, handleDataChange]
  );

  const createSelectChangeHandler = useCallback(
    (fieldName: keyof T) => {
      return (value: string) => {
        form.setValue(fieldName, value as T[keyof T]);
        handleDataChange(fieldName, value);
      };
    },
    [form, handleDataChange]
  );

  const createCheckboxChangeHandler = useCallback(
    (fieldName: keyof T) => {
      return (checked: boolean) => {
        form.setValue(fieldName, checked as T[keyof T]);
        handleDataChange(fieldName, checked);
      };
    },
    [form, handleDataChange]
  );

  return {
    handleDataChange,
    createFieldChangeHandler,
    createSelectChangeHandler,
    createCheckboxChangeHandler,
  };
}
