/* eslint-disable */
// @ts-nocheck
'use client';

import { DollarSign } from 'lucide-react';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MultiSelect } from '@/components/ui/multi-select';
import { FirmFormData } from '../schema/schema';
import { PAYMENT_METHOD_OPTIONS, PAYOUT_METHOD_OPTIONS } from '../constants';

interface Step9PaymentsProps {
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  onSubmit: () => void;
}

export function Step9Payments({ onPrevious, onSubmit, onNext, isLastStep }: Step9PaymentsProps) {
  const { register, watch, setValue, formState: { errors, isSubmitting } } = useFormContext<FirmFormData>();

  // Watch payment arrays for MultiSelect default values
  const methods = watch('payments.methods') || [];
  const payoutMethods = watch('payments.payoutMethods') || [];

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
        <MultiSelect
          options={PAYMENT_METHOD_OPTIONS.map(opt => ({ label: opt.label, value: opt.value }))}
          onValueChange={(value) => {
            setValue('payments.methods', value, { shouldValidate: true });
          }}
          defaultValue={Array.isArray(methods) ? methods : []}
          placeholder="Select payment methods"
          variant="inverted"
          maxCount={5}
        />
        <p className="text-xs text-gray-500">
          Select the payment methods accepted for deposits
        </p>
      </div>

      {/* Payout Methods (Withdrawal) */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Payout Methods (Withdrawal)</Label>
        <MultiSelect
          options={PAYOUT_METHOD_OPTIONS.map(opt => ({ label: opt.label, value: opt.value }))}
          onValueChange={(value) => {
            setValue('payments.payoutMethods', value, { shouldValidate: true });
          }}
          defaultValue={Array.isArray(payoutMethods) ? payoutMethods : []}
          placeholder="Select payout methods"
          variant="inverted"
          maxCount={5}
        />
        <p className="text-xs text-gray-500">
          Select the payout methods available for withdrawals
        </p>
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
            {...register('payments.minWithdrawal')}
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
          <Label className="text-sm font-medium">Processing Time</Label>

          <div className="flex gap-2">
            {/* Value field */}
            <Input
              type="number"
              min="1"
              className="w-24"
              placeholder="1"
              {...register("payments.processingTime.value", { valueAsNumber: true })}
            />

            {/* Unit Dropdown */}
            <select
              className="border border-input bg-background rounded-md px-3 py-2 text-sm"
              {...register("payments.processingTime.unit")}
            >
              <option value="">Select</option>
              <option value="hours">Hours</option>
              <option value="days">Days</option>
              <option value="weeks">Weeks</option>

            </select>
          </div>

          <p className="text-xs text-gray-500">Expected time to process withdrawals</p>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-medium">Processing Time Policy</Label>
          <select
            className="border border-input bg-background rounded-md px-3 py-2 text-sm"
            {...register("payments.processingTimePolicy")}
          >
            <option value="">Select</option>
            <option value="after-approval">After Approval</option>
            <option value="after-request">After Request</option>
            <option value="no">No</option>
          </select>
          <p className="text-xs text-gray-500">Policy for processing time</p>
        </div>


        <div className="space-y-2">
          <Label htmlFor="payoutSchedule" className="text-sm font-medium">
            Payout Schedule
          </Label>
          <MultiSelect
            options={[
              { label: "On Demand", value: "ondemand" },
              { label: "Weekly", value: "weekly" },
              { label: "Bi-weekly", value: "biweekly" },
              { label: "Monthly", value: "monthly" },
            ]}
            onValueChange={(value) => {
              setValue('payments.payoutSchedule', value, { shouldValidate: true });
            }}
            defaultValue={Array.isArray(watch('payments.payoutSchedule')) ? watch('payments.payoutSchedule') : []}
            placeholder="Select payout schedule"
            variant="inverted"
            maxCount={3}
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
