"use client";
import React, { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller, FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, Save, ArrowLeft, Info, X } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useParams, useRouter } from "next/navigation";

// Zod Schema
const evaluationStepSchema = z.object({
  stepNumber: z.number().min(1),
  profitTarget: z.string().min(1, "Profit target is required"),
  maxLoss: z.string().optional(),
  dailyLoss: z.string().optional(),
  minTradingDays: z.number().optional(),
});

const accountSizeSchema = z.object({
  size: z.number().min(1, "Size must be greater than 0"),
  price: z.number().min(0, "Price must be positive"),
});

const payoutFrequencySchema = z.object({
  label: z.string().min(1, "Label is required"),
  percentage: z.string().min(1, "Percentage is required"),
});

const programSchema = z.object({
  propFirmId: z.string().min(1, "Prop Firm ID is required"),
  type: z.string().min(1, "Type is required"),
  name: z.string().min(1, "Name is required"),
  evaluationPhases: z.number().optional(),
  evaluationSteps: z.array(evaluationStepSchema).optional(),
  accountSizes: z.array(accountSizeSchema).min(1, "At least one account size required"),
  profitSplit: z.string().min(1, "Profit split is required"),
  payoutFrequency: z.array(payoutFrequencySchema).min(1),
  leverage: z.string().min(1, "Leverage is required"),
  stopLossRequired: z.boolean(),
  eaAllowed: z.boolean(),
  weekendHolding: z.boolean(),
  overnightHolding: z.boolean(),
  newsTrading: z.boolean(),
  copyTrading: z.boolean(),
  refundFee: z.boolean(),
  payoutMethods: z
    .array(z.string())
    .min(1, "At least one payout method required"),
  profitTarget: z.string().optional(),
  dailyLoss: z.string().optional(),
  maxLoss: z.string().optional(),
  maxLossType: z.string().optional(),
  timeLimit: z.string().optional(),
  drawdownResetType: z.string().optional(),
  minTradingDays: z.number().optional(),
})
type ProgramFormData = z.infer<typeof programSchema>;

const ProgramForm = ({ programId }: { programId?: string }) => {
  const [submitStatus, setSubmitStatus] = useState("");
  const [payoutMethodInput, setPayoutMethodInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingProgram, setIsLoadingProgram] = useState(false);


  const params = useParams<{ id: string }>();
  const router = useRouter()

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ProgramFormData>({
    resolver: zodResolver(programSchema),
    defaultValues: {
      propFirmId: params.id || "",
      type: "",
      name: "",
      evaluationPhases: 0,
      evaluationSteps: [],
      accountSizes: [],
      profitSplit: "",
      payoutFrequency: [],
      leverage: "",
      stopLossRequired: false,
      eaAllowed: true,
      weekendHolding: true,
      overnightHolding: true,
      newsTrading: false,
      copyTrading: true,
      refundFee: false,
      payoutMethods: [],
      minTradingDays: 0,
    },
  });
  useEffect(() => {
    const fetchProgramData = async () => {
      if (!programId) return;

      setIsLoadingProgram(true);
      setIsEditing(true);

      try {
        const response = await fetch(`/api/admin/firm-program/${programId}`);
        const result = await response.json();

        if (result.success && result.data) {
          const program = result.data;

          // Reset form with fetched data
          reset({
            propFirmId: program.propFirmId || params.id,
            type: program.type,
            name: program.name,
            evaluationPhases: program.evaluationPhases,
            evaluationSteps: program.evaluationSteps || [],
            accountSizes: program.accountSizes || [],
            profitSplit: program.profitSplit,
            payoutFrequency: program.payoutFrequency || [],
            leverage: program.leverage,
            stopLossRequired: program.stopLossRequired,
            eaAllowed: program.eaAllowed,
            weekendHolding: program.weekendHolding,
            overnightHolding: program.overnightHolding,
            newsTrading: program.newsTrading,
            copyTrading: program.copyTrading,
            refundFee: program.refundFee,
            payoutMethods: program.payoutMethods || [],
            profitTarget: program.profitTarget,
            dailyLoss: program.dailyLoss,
            maxLoss: program.maxLoss,
            maxLossType: program.maxLossType,
            timeLimit: program.timeLimit,
            drawdownResetType: program.drawdownResetType,
            minTradingDays: program.minTradingDays,
          });

          console.log("Program data loaded successfully");
        }
      } catch (error) {
        console.error("Error fetching program data:", error);
        setSubmitStatus("error");
      } finally {
        setIsLoadingProgram(false);
      }
    };

    fetchProgramData();
  }, [programId, setValue, params.id, reset]);






  const selectedType = watch("type");
  const isInstantType = selectedType === "Instant";
  const payoutMethods = watch("payoutMethods") || [];

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

  const addPayoutMethod = () => {
    if (payoutMethodInput.trim()) {
      const currentMethods = payoutMethods;
      if (!currentMethods.includes(payoutMethodInput.trim())) {
        setValue('payoutMethods', [...currentMethods, payoutMethodInput.trim()], {
          shouldValidate: true,
          shouldDirty: true
        });
        setPayoutMethodInput('');
      }
    }
  };

  const removePayoutMethod = (method: string) => {
    const currentMethods = payoutMethods;
    setValue('payoutMethods', currentMethods.filter((m: string) => m !== method), {
      shouldValidate: true,
      shouldDirty: true
    });
  };

  const onSubmit = async (data: ProgramFormData) => {
    try {
      if (data.type === "Instant") {
        delete data.evaluationPhases;
        delete data.evaluationSteps;
      }

      const url = isEditing
        ? `/api/admin/firm-program/${programId}`
        : "/api/admin/firm-program";

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Check if response has content before parsing JSON
      const contentType = res.headers.get("content-type");
      let result;

      if (contentType && contentType.includes("application/json")) {
        const text = await res.text();
        result = text ? JSON.parse(text) : {};
      } else {
        result = { success: res.ok };
      }

      if (!res.ok) {
        console.error(`Failed to ${isEditing ? 'update' : 'create'} program:`, result.message || 'Unknown error');
        setSubmitStatus("error");
        return;
      }

      console.log(`Program ${isEditing ? 'updated' : 'created'} successfully:`, result.data);
      setSubmitStatus("success");

      // Navigate after a short delay to show success message
      setTimeout(() => {
        router.push(`/admin/firm-management/${params.id}/firm-detail`);
      }, 1000);

    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitStatus("error");
    } finally {
      setTimeout(() => setSubmitStatus(""), 5000);
    }
  };


  const onError = (errors: FieldErrors<ProgramFormData>) => {
    console.error(" Validation Errors:", errors);
    setSubmitStatus("error");
    setTimeout(() => setSubmitStatus(""), 5000);
  };

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
    <div className="min-h-screen bg-background ">
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
                  Program Configuration
                </h1>
                <p className="text-sm text-muted-foreground">
                  Create and configure your trading program
                </p>
              </div>
            </div>
            <Button
              onClick={handleFormSubmit}
              className="bg-primary hover:bg-primary/90"
            >
              <Save className="h-4 w-4 mr-2" />
              {isEditing ? 'Update Program' : 'Save Program'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {submitStatus === "success" && (
          <Alert className="mb-6 bg-success/10 border-success">
            <Info className="h-4 w-4 text-success" />
            <AlertDescription className="text-success font-medium">
              Program saved successfully! Check console for details.
            </AlertDescription>
          </Alert>
        )}

        {submitStatus === "error" && (
          <Alert className="mb-6 bg-red-500/10 border-red-500">
            <Info className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-500 font-medium">
              Please fix the errors below before submitting. Check console for details.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Configure the fundamental program details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="propFirmId">Prop Firm ID *</Label>
                  <Input
                    id="propFirmId"
                    {...register("propFirmId")}
                    disabled
                    className="bg-muted"
                  />
                  {errors.propFirmId && (
                    <p className="text-sm text-destructive">
                      {errors.propFirmId.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Program Type *</Label>
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-Step">1-Step Challenge</SelectItem>
                          <SelectItem value="2-Step">2-Step Challenge</SelectItem>
                          <SelectItem value="3-Step">3-Step Challenge</SelectItem>
                          <SelectItem value="Instant">Instant Funding</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.type && (
                    <p className="text-sm text-destructive">
                      {errors.type.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="name">Program Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="e.g., FundingPips - Pro Challenge"
                />
                {errors.name && (
                  <p className="text-sm text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {!isInstantType && (
                <div className="space-y-2">
                  <Label htmlFor="evaluationPhases">Evaluation Phases *</Label>
                  <Input
                    id="evaluationPhases"
                    {...register("evaluationPhases", { valueAsNumber: true })}
                    placeholder="Number of phases"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Evaluation Steps */}
          {!isInstantType && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Evaluation Steps</CardTitle>
                    <CardDescription>
                      Define the challenge phases and requirements
                    </CardDescription>
                  </div>
                  <Button
                    type="button"
                    onClick={() =>
                      appendStep({
                        stepNumber: stepFields.length + 1,
                        profitTarget: "",
                      })
                    }
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Step
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {stepFields.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No evaluation steps added yet. Click  &quot;Add Step &quot; to get started.
                  </div>
                )}
                {stepFields.map((field, index) => (
                  <Card key={field.id} className="bg-accent/50">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          Phase {index + 1}
                        </CardTitle>
                        <Button
                          type="button"
                          onClick={() => removeStep(index)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div className="space-y-2">
                          <Label>Step Number *</Label>
                          <Input
                            type="number"
                            {...register(
                              `evaluationSteps.${index}.stepNumber`,
                              { valueAsNumber: true }
                            )}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Profit Target *</Label>
                          <Input
                            {...register(`evaluationSteps.${index}.profitTarget`)}
                            placeholder="e.g., 8%"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Max Loss</Label>
                          <Input
                            {...register(`evaluationSteps.${index}.maxLoss`)}
                            placeholder="e.g., 6%"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Daily Loss</Label>
                          <Input
                            {...register(`evaluationSteps.${index}.dailyLoss`)}
                            placeholder="e.g., 4%"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Min Trading Days</Label>
                          <Input
                            type="number"
                            {...register(
                              `evaluationSteps.${index}.minTradingDays`,
                              { valueAsNumber: true }
                            )}
                            placeholder="e.g., 5"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Account Sizes & Pricing */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Account Sizes & Pricing</CardTitle>
                  <CardDescription>
                    Define available account sizes and their prices
                  </CardDescription>
                </div>
                <Button
                  type="button"
                  onClick={() => appendSize({ size: 0, price: 0 })}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Size
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sizeFields.map((field, index) => (
                  <Card key={field.id} className="bg-accent/50">
                    <CardContent className="pt-4 space-y-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">
                          Account {index + 1}
                        </span>
                        <Button
                          type="button"
                          onClick={() => removeSize(index)}
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <Label>Account Size ($) *</Label>
                        <Input
                          type="number"
                          {...register(`accountSizes.${index}.size`, {
                            valueAsNumber: true,
                          })}
                          placeholder="e.g., 10000"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Price ($) *</Label>
                        <Input
                          type="number"
                          {...register(`accountSizes.${index}.price`, {
                            valueAsNumber: true,
                          })}
                          placeholder="e.g., 89"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {errors.accountSizes && (
                <p className="text-sm text-destructive mt-2">
                  {errors.accountSizes.message}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Profit & Payout Configuration */}
          <Card>
            <CardHeader>
              <CardTitle>Profit & Payout Configuration</CardTitle>
              <CardDescription>
                Set profit sharing and payout terms
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="profitSplit">Profit Split *</Label>
                  <Input
                    id="profitSplit"
                    {...register("profitSplit")}
                    placeholder="e.g., 80%"
                  />
                  {errors.profitSplit && (
                    <p className="text-sm text-destructive">
                      {errors.profitSplit.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="leverage">Leverage *</Label>
                  <Input
                    id="leverage"
                    {...register("leverage")}
                    placeholder="e.g., 1:50"
                  />
                  {errors.leverage && (
                    <p className="text-sm text-destructive">
                      {errors.leverage.message}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Payout Frequency Options</Label>
                  <Button
                    type="button"
                    onClick={() => appendPayout({ label: "", percentage: "" })}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Option
                  </Button>
                </div>

                {payoutFields.map((field, index) => (
                  <div key={field.id} className="flex gap-3 items-start">
                    <div className="flex-1 space-y-2">
                      <Input
                        {...register(`payoutFrequency.${index}.label`)}
                        placeholder="e.g., Bi-weekly"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <Input
                        {...register(`payoutFrequency.${index}.percentage`)}
                        placeholder="e.g., 80%"
                      />
                    </div>
                    {payoutFields.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removePayout(index)}
                        variant="ghost"
                        size="icon"
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Payout Methods *</Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Add payment methods available for traders (e.g., PayPal, Wise, Cryptocurrency)
                  </p>
                </div>

                <div className="flex gap-2">
                  <Input
                    value={payoutMethodInput}
                    onChange={(e) => setPayoutMethodInput(e.target.value)}
                    placeholder="Enter payout method name"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addPayoutMethod();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={addPayoutMethod}
                    size="default"
                    variant="secondary"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>

                {payoutMethods.length > 0 ? (
                  <div className="flex flex-wrap gap-2 p-4 bg-accent/30 rounded-lg border border-border">
                    {payoutMethods.map((method: string) => (
                      <Badge
                        key={method}
                        variant="secondary"
                        className="px-3 py-1.5 text-sm flex items-center gap-1"
                      >
                        <span>{method}</span>
                        <button
                          type="button"
                          onClick={() => removePayoutMethod(method)}
                          className="ml-1 hover:text-destructive transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-sm text-muted-foreground bg-accent/20 rounded-lg border border-dashed border-border">
                    No payout methods added yet
                  </div>
                )}

                {errors.payoutMethods && (
                  <p className="text-sm text-destructive">
                    {errors.payoutMethods.message}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Trading Rules */}
          <Card>
            <CardHeader>
              <CardTitle>Trading Rules & Restrictions</CardTitle>
              <CardDescription>
                Define what traders can and cannot do
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {([
                  { name: "stopLossRequired", label: "Stop Loss Required" },
                  { name: "eaAllowed", label: "Expert Advisors (EA) Allowed" },
                  { name: "weekendHolding", label: "Weekend Position Holding" },
                  { name: "overnightHolding", label: "Overnight Position Holding" },
                  { name: "newsTrading", label: "News Trading Allowed" },
                  { name: "copyTrading", label: "Copy Trading Allowed" },
                  { name: "refundFee", label: "Refundable Fee" },
                ] as const).map((rule) => (
                  <div
                    key={rule.name}
                    className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                  >
                    <Controller
                      name={rule.name}
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          id={rule.name}
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-0.5"
                        />
                      )}
                    />
                    <Label
                      htmlFor={rule.name}
                      className="text-sm font-normal cursor-pointer leading-tight"
                    >
                      {rule.label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Optional Advanced Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>
                Optional configurations for legacy support
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Profit Target (Legacy)</Label>
                  <Input
                    {...register("profitTarget")}
                    placeholder="e.g., 10%"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Daily Loss (Legacy)</Label>
                  <Input
                    {...register("dailyLoss")}
                    placeholder="e.g., 5%"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Max Loss</Label>
                  <Input
                    {...register("maxLoss")}
                    placeholder="e.g., 10%"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Max Loss Type</Label>
                  <Input
                    {...register("maxLossType")}
                    placeholder="e.g., Static, Trailing"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Time Limit</Label>
                  <Input
                    {...register("timeLimit")}
                    placeholder="e.g., 30 days"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Drawdown Reset Type</Label>
                  <Input
                    {...register("drawdownResetType")}
                    placeholder="e.g., Daily, Weekly"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Min Trading Days (Legacy)</Label>
                  <Input
                    {...register("minTradingDays", { valueAsNumber: true })}
                    placeholder="e.g., 5"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 pb-8">
            <Button
              type="button"
              variant="secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleFormSubmit}
              className="bg-primary hover:bg-primary/90"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Program
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgramForm;