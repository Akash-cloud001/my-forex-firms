/* eslint-disable */
// @ts-nocheck
'use client';

import { DollarSign, Plus, X } from 'lucide-react';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { FirmFormData } from '../schema/schema';

interface Step9PaymentsProps {
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  onSubmit: () => void;
}

export function Step9Payments({ onPrevious, onSubmit, onNext, isLastStep }: Step9PaymentsProps) {
  const { register, watch, setValue, formState: { errors } } = useFormContext<FirmFormData>();

  // Local input states
  const [methodInput, setMethodInput] = useState('');
  const [payoutInput, setPayoutInput] = useState('');

  // ✅ Type-safe helper to get an array from payments.*
  const getArray = <T extends keyof FirmFormData['payments']>(field: T): string[] => {
    const value = watch(`payments.${field}` as `payments.${T}`);
    return (value as string[]) || [];
  };

  // ✅ Generic add function (type-safe)
  const addItem = <T extends keyof FirmFormData['payments']>(
    field: T,
    value: string,
    setInput: (val: string) => void
  ) => {
    if (!value.trim()) return;
    const current = getArray(field);
    setValue(`payments.${field}` as `payments.${T}`, [...current, value.trim()] as any, { shouldValidate: true });
    setInput('');
  };

  // ✅ Generic remove function (type-safe)
  const removeItem = <T extends keyof FirmFormData['payments']>(field: T, value: string) => {
    const current = getArray(field);
    setValue(
      `payments.${field}` as `payments.${T}`,
      current.filter((item) => item !== value) as any,
      { shouldValidate: true }
    );
  };

  // Watch payment arrays
  const methods = getArray('methods');
  const payoutMethods = getArray('payoutMethods');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <DollarSign className="h-6 w-6" />
          Payment Methods
        </h2>
        <p className="text-gray-600 mt-1">
          Configure payment and payout options for traders
        </p>
      </div>

      {/* Payment Methods (Deposit) */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Payment Methods (Deposit)</Label>
        <div className="flex gap-2">
          <Input
            value={methodInput}
            onChange={(e) => setMethodInput(e.target.value)}
            placeholder="Add payment method (e.g., Credit Card, PayPal)"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addItem('methods', methodInput, setMethodInput);
              }
            }}
          />
          <Button
            type="button"
            onClick={() => addItem('methods', methodInput, setMethodInput)}
            size="icon"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {methods.map((method) => (
            <Badge key={method} variant="secondary" className="px-3 py-1 bg-blue-100 text-blue-700">
              {method}
              <button
                type="button"
                onClick={() => removeItem('methods', method)}
                className="ml-2 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        {methods.length === 0 && (
          <p className="text-xs text-gray-500">No payment methods added yet</p>
        )}
      </div>

      {/* Payout Methods (Withdrawal) */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Payout Methods (Withdrawal)</Label>
        <div className="flex gap-2">
          <Input
            value={payoutInput}
            onChange={(e) => setPayoutInput(e.target.value)}
            placeholder="Add payout method (e.g., Bank Transfer, Crypto)"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addItem('payoutMethods', payoutInput, setPayoutInput);
              }
            }}
          />
          <Button
            type="button"
            onClick={() => addItem('payoutMethods', payoutInput, setPayoutInput)}
            size="icon"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {payoutMethods.map((method) => (
            <Badge key={method} variant="secondary" className="px-3 py-1 bg-green-100 text-green-700">
              {method}
              <button
                type="button"
                onClick={() => removeItem('payoutMethods', method)}
                className="ml-2 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        {payoutMethods.length === 0 && (
          <p className="text-xs text-gray-500">No payout methods added yet</p>
        )}
      </div>

      {/* Base Currency & Min Withdrawal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="baseCurrency" className="text-sm font-medium">
            Base Currency
          </Label>
          <Input
            id="baseCurrency"
            {...register('payments.baseCurrency')}
            placeholder="e.g., USD, EUR"
          />
          <p className="text-xs text-gray-500">Primary currency for transactions</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="minWithdrawal" className="text-sm font-medium">
            Minimum Withdrawal Amount
          </Label>
          <Input
            id="minWithdrawal"
            type="number"
            step="0.01"
            {...register('payments.minWithdrawal', { valueAsNumber: true })}
            placeholder="e.g., 100"
            className={errors.payments?.minWithdrawal ? 'border-red-500' : ''}
          />
          {errors.payments?.minWithdrawal && (
            <p className="text-sm text-red-500">
              {errors.payments.minWithdrawal.message as string}
            </p>
          )}
          <p className="text-xs text-gray-500">
            Minimum amount for withdrawal requests
          </p>
        </div>
      </div>

      {/* Processing Time & Payout Schedule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="processingTime" className="text-sm font-medium">
            Processing Time
          </Label>
          <Input
            id="processingTime"
            {...register('payments.processingTime')}
            placeholder="e.g., 1-3 business days"
          />
          <p className="text-xs text-gray-500">
            Expected time to process withdrawals
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="payoutSchedule" className="text-sm font-medium">
            Payout Schedule
          </Label>
          <Input
            id="payoutSchedule"
            {...register('payments.payoutSchedule')}
            placeholder="e.g., Bi-weekly, On-demand"
          />
          <p className="text-xs text-gray-500">
            How often payouts are processed
          </p>
        </div>
      </div>

      {/* Refund Policy */}
      <div className="space-y-2">
        <Label htmlFor="refundPolicy" className="text-sm font-medium">
          Refund Policy
        </Label>
        <Textarea
          id="refundPolicy"
          {...register('payments.refundPolicy')}
          placeholder="Describe the refund policy in detail..."
          rows={4}
          className="resize-none"
        />
        <p className="text-xs text-gray-500">
          Explain conditions and process for refunds
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        {isLastStep ? (
          <Button type="submit" onClick={onSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        ) : (
          <Button type="button" onClick={onNext}>
            Next Step
          </Button>
        )}
      </div>
    </div>
  );
}
