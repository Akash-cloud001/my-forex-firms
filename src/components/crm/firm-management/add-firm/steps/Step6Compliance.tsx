import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Shield } from 'lucide-react';
import { FirmFormData } from '../schema/schema';

interface Step6ComplianceProps {
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep?: boolean;
  isLastStep?: boolean;
  onSubmit?: () => void;
}

export default function Step6Compliance({ onNext, onPrevious }: Step6ComplianceProps) {
  const { register, watch, setValue, formState: { errors } } = useFormContext<FirmFormData>();

  // Local state for input fields
  const [kycInput, setKycInput] = useState('');
  const [countryInput, setCountryInput] = useState('');
  const [regulationInput, setRegulationInput] = useState('');

  // Helper that returns the array for a compliance key
const getArray = <T extends keyof FirmFormData['compliance']>(
  field: T
): string[] => {
  const value = watch(`compliance.${field}` as `compliance.${T}`);
  return (value as string[]) || [];
};

  const kycReqs = getArray('kycRequirements');
  const restrictedCountries = getArray('restrictedCountries');
  const regulations = getArray('regulationsComplied');

  // Generic add function — accepts the compliance key (like 'kycRequirements')
  const addItem = (
    field: keyof FirmFormData['compliance'],
    value: string,
    setInput: (val: string) => void
  ) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const current = getArray(field);
    // setValue path must be the full path
    setValue(`compliance.${String(field)}` as any, [...current, trimmed] as any, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setInput('');
  };

  // Generic remove function
  const removeItem = (field: keyof FirmFormData['compliance'], value: string) => {
    const current = getArray(field);
    setValue(
      `compliance.${String(field)}` as any,
      (current as string[]).filter((item) => item !== value) as any,
      { shouldValidate: true, shouldDirty: true }
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-primary-foreground">
        <h2 className="text-2xl font-bold  flex items-center gap-2">
          <Shield className="h-6 w-6 " />
          Compliance & Regulations
        </h2>
        <p className="text-gray-600 mt-1">Set compliance requirements and regulatory restrictions</p>
      </div>

      {/* KYC Provider */}
      <div className="space-y-2">
        <Label htmlFor="kycProvider" className="text-sm font-medium">
          KYC Provider
        </Label>
        <Input
          id="kycProvider"
          {...register('compliance.kycProvider')}
          placeholder="e.g., Jumio, Onfido, Sumsub"
        />
        <p className="text-xs text-gray-500">Identity verification service provider</p>
      </div>

      {/* KYC Requirements */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">KYC Requirements</Label>
        <div className="flex gap-2">
          <Input
            value={kycInput}
            onChange={(e) => setKycInput(e.target.value)}
            placeholder="Add requirement (e.g., Government ID)"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addItem('kycRequirements', kycInput, setKycInput);
              }
            }}
          />
          <Button
            type="button"
            onClick={() => addItem('kycRequirements', kycInput, setKycInput)}
            size="icon"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {kycReqs.map((req) => (
            <Badge key={req} variant="secondary" className="px-3 py-1">
              {req}
              <button
                type="button"
                onClick={() => removeItem('kycRequirements', req)}
                className="ml-2 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        {kycReqs.length === 0 && <p className="text-xs text-gray-500">No requirements added yet</p>}
      </div>

      {/* Restricted Countries */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Restricted Countries</Label>
        <div className="flex gap-2">
          <Input
            value={countryInput}
            onChange={(e) => setCountryInput(e.target.value)}
            placeholder="Add country (e.g., United States)"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addItem('restrictedCountries', countryInput, setCountryInput);
              }
            }}
          />
          <Button
            type="button"
            onClick={() => addItem('restrictedCountries', countryInput, setCountryInput)}
            size="icon"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {restrictedCountries.map((country) => (
            <Badge key={country} variant="destructive" className="px-3 py-1">
              {country}
              <button
                type="button"
                onClick={() => removeItem('restrictedCountries', country)}
                className="ml-2 hover:text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        {restrictedCountries.length === 0 && <p className="text-xs text-gray-500">No restricted countries</p>}
      </div>

      {/* Regulations Complied */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Regulations Complied</Label>
        <div className="flex gap-2">
          <Input
            value={regulationInput}
            onChange={(e) => setRegulationInput(e.target.value)}
            placeholder="Add regulation (e.g., MiFID II, GDPR)"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addItem('regulationsComplied', regulationInput, setRegulationInput);
              }
            }}
          />
          <Button
            type="button"
            onClick={() => addItem('regulationsComplied', regulationInput, setRegulationInput)}
            size="icon"
            variant="outline"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {regulations.map((reg) => (
            <Badge key={reg} variant="secondary" className="px-3 py-1 bg-green-100 text-green-700">
              {reg}
              <button
                type="button"
                onClick={() => removeItem('regulationsComplied', reg)}
                className="ml-2 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        {regulations.length === 0 && <p className="text-xs text-gray-500">No regulations added yet</p>}
      </div>

      {/* AML Policy Link */}
      <div className="space-y-2">
        <Label htmlFor="amlLink" className="text-sm font-medium">
          AML Policy Link
        </Label>
        <Input
          id="amlLink"
          {...register('compliance.amlLink')}
          type="url"
          placeholder="https://example.com/aml-policy"
          className={errors.compliance?.amlLink ? 'border-red-500' : ''}
        />
        {errors.compliance?.amlLink && (
          <p className="text-sm text-red-500">{errors.compliance.amlLink.message as string}</p>
        )}
        <p className="text-xs text-gray-500">Link to Anti-Money Laundering policy document</p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button type="button" onClick={onNext}>
          Next Step
        </Button>
      </div>
    </div>
  );
}
