"use client";
import React from "react";
import { useForm, useFieldArray, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams, useRouter } from "next/navigation";

// Import types and schemas
import { programSchema, ProgramFormData } from "./types";
import { DEFAULT_FORM_VALUES } from "./constants";

// Import custom hooks
import { useProgramData } from "./hooks/useProgramData";
import { useProgramSubmit } from "./hooks/useProgramSubmit";
import { useAutoPopulate } from "./hooks/useAutoPopulate";

// Import components
import { BasicInformation } from "./components/BasicInformation";
import { EvaluationSteps } from "./components/EvaluationSteps";
import { AccountSizes } from "./components/AccountSizes";
import { ProfitPayoutConfig } from "./components/ProfitPayoutConfig";
import { TradingRules } from "./components/TradingRules";
import { AdvancedSettings } from "./components/AdvancedSettings";

const ProgramForm = ({ programId }: { programId?: string }) => {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProgramFormData>({
    resolver: zodResolver(programSchema) as Resolver<ProgramFormData>,
    defaultValues: {
      ...DEFAULT_FORM_VALUES,
      propFirmId: params.id || "",
    },
  });

  // Custom hooks
  const { isLoadingProgram, isEditing } = useProgramData({
    programId,
    propFirmId: params.id,
    reset,
  });

  const { onSubmit, onError, isSubmitting } = useProgramSubmit({
    programId,
    isEditing,
    propFirmId: params.id,
  });

  const { selectedType } = useAutoPopulate({
    watch,
    setValue,
    isEditing,
  });

  // Field arrays
  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
  } = useFieldArray({
    control,
    name: "evaluationSteps",
  });

  const {
    fields: sizeFields,
    append: appendSize,
    remove: removeSize,
  } = useFieldArray({
    control,
    name: "accountSizes",
  });

  const {
    fields: payoutFields,
    append: appendPayout,
    remove: removePayout,
  } = useFieldArray({
    control,
    name: "payoutFrequency",
  });

  const isInstantType = selectedType === "Instant";
  const payoutMethods = watch("payoutMethods") || [];

  const handleFormSubmit = () => {
    handleSubmit(onSubmit, onError)();
  };

  if (isLoadingProgram) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-muted-foreground">Loading program...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="text-white"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  {isEditing ? "Edit Program" : "Create Program"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {isEditing
                    ? "Update your trading program configuration"
                    : "Create and configure your trading program"}
                </p>
              </div>
            </div>
            <Button
              onClick={handleFormSubmit}
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting
                ? "Saving..."
                : isEditing
                  ? "Update Program"
                  : "Save Program"}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Basic Information */}
          <BasicInformation
            control={control}
            register={register}
            errors={errors}
            isInstantType={isInstantType}
          />

          {/* Evaluation Steps */}
          <EvaluationSteps
            control={control}
            register={register}
            setValue={setValue}
            stepFields={stepFields}
            appendStep={appendStep}
            removeStep={removeStep}
            isInstantType={isInstantType}
            errors={errors}
          />

          {/* Account Sizes & Pricing */}
          <AccountSizes
            register={register}
            sizeFields={sizeFields}
            appendSize={appendSize}
            removeSize={removeSize}
            errors={errors}
          />

          {/* Profit & Payout Configuration */}
          <ProfitPayoutConfig
            register={register}
            payoutFields={payoutFields}
            appendPayout={appendPayout}
            removePayout={removePayout}
            errors={errors}
            payoutMethods={payoutMethods}
            setValue={setValue}
          />

          {/* Trading Rules & Restrictions */}
          <TradingRules control={control} register={register} isInstantType={isInstantType} />

          {/* Advanced Settings */}
          <AdvancedSettings register={register} />

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 pb-8">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              onClick={handleFormSubmit}
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSubmitting
                ? "Saving..."
                : isEditing
                  ? "Update Program"
                  : "Save Program"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramForm;