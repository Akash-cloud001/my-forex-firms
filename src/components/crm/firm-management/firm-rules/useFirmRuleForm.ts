import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { firmRuleSchema, FirmRuleFormData } from './types';

interface UseFirmRuleFormProps {
  firmId: string;
  existingData?: FirmRuleFormData;
}

export const useFirmRuleForm = ({ firmId, existingData }: UseFirmRuleFormProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors,isSubmitting },
    setValue,
    watch,
    getValues,
  } = useForm<FirmRuleFormData>({
    resolver: zodResolver(firmRuleSchema),
    defaultValues: existingData || { firmId, categories: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'categories',
  });

  useEffect(() => {
    setValue('firmId', firmId);
  }, [firmId, setValue]);

  return {
    control,
    handleSubmit,
    errors,
    isSubmitting,
    setValue,
    watch,
    getValues,
    categoryFields: fields,
    appendCategory: append,
    removeCategory: remove,
  };
};