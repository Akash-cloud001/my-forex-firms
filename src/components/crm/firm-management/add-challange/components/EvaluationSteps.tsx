import React from "react";
import { Control, UseFieldArrayRemove, UseFieldArrayAppend, UseFormRegister, FieldArrayWithId, FieldErrors, UseFormSetValue } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ProgramFormData } from "../types";

// Helper: Block % character input
const blockPercentChar = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '%') {
        e.preventDefault();
    }
};

interface EvaluationStepsProps {
    control: Control<ProgramFormData>;
    register: UseFormRegister<ProgramFormData>;
    setValue: UseFormSetValue<ProgramFormData>;
    stepFields: FieldArrayWithId<ProgramFormData, "evaluationSteps", "id">[];
    appendStep: UseFieldArrayAppend<ProgramFormData, "evaluationSteps">;
    removeStep: UseFieldArrayRemove;
    isInstantType: boolean;
    errors: FieldErrors<ProgramFormData>;
}

export const EvaluationSteps: React.FC<EvaluationStepsProps> = ({
    register,
    setValue,
    stepFields,
    appendStep,
    removeStep,
    isInstantType,
    errors,
}) => {
    if (isInstantType) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Funded Criteria</CardTitle>
                    <CardDescription>
                        Define the funded account criteria for instant funding
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>Profit Target *</Label>
                            <Input
                                {...register("fundedCriteria.profitTarget")}
                                placeholder="e.g., 10  (in %)"
                                onKeyDown={blockPercentChar}
                            />
                            {errors.fundedCriteria?.profitTarget && (
                                <p className="text-sm text-destructive">
                                    {errors.fundedCriteria.profitTarget.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Max Loss *</Label>
                            <Input
                                {...register("fundedCriteria.maxLoss")}
                                placeholder="e.g., 6  (in %)"
                                onKeyDown={blockPercentChar}
                            />
                            {errors.fundedCriteria?.maxLoss && (
                                <p className="text-sm text-destructive">
                                    {errors.fundedCriteria.maxLoss.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Daily Loss *</Label>
                            <Input
                                {...register("fundedCriteria.dailyLoss")}
                                placeholder="e.g., 4  (in %)"
                                onKeyDown={blockPercentChar}
                            />
                            {errors.fundedCriteria?.dailyLoss && (
                                <p className="text-sm text-destructive">
                                    {errors.fundedCriteria.dailyLoss.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Min Trading Days</Label>
                            <Input
                                type="number"
                                {...register("fundedCriteria.minTradingDays", {
                                    valueAsNumber: true,
                                })}
                                placeholder="e.g., 5"
                            />
                            {errors.fundedCriteria?.minTradingDays && (
                                <p className="text-sm text-destructive">
                                    {errors.fundedCriteria.minTradingDays.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Max Loss Type *</Label>
                            <Input
                                {...register("fundedCriteria.maxLossType")}
                                placeholder="e.g., static, trailing"
                                onChange={(e) => {
                                    setValue("fundedCriteria.maxLossType", e.target.value.toLowerCase() as "static" | "trailing");
                                }}
                            />
                            {errors.fundedCriteria?.maxLossType && (
                                <p className="text-sm text-destructive">
                                    {errors.fundedCriteria.maxLossType.message}
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
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
                                maxLoss: "",
                                dailyLoss: "",
                                minTradingDays: 0,
                                maxLossType: "static",
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
                        No evaluation steps added yet. Click &quot;Add Step&quot; to get started.
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
                                    {errors.evaluationSteps?.[index]?.stepNumber && (
                                        <p className="text-sm text-destructive">
                                            {errors.evaluationSteps[index]?.stepNumber?.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Profit Target *</Label>
                                    <Input
                                        {...register(`evaluationSteps.${index}.profitTarget`)}
                                        placeholder="e.g., 8  (in %)"
                                        onKeyDown={blockPercentChar}
                                    />
                                    {errors.evaluationSteps?.[index]?.profitTarget && (
                                        <p className="text-sm text-destructive">
                                            {errors.evaluationSteps[index]?.profitTarget?.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Max Loss *</Label>
                                    <Input
                                        {...register(`evaluationSteps.${index}.maxLoss`)}
                                        placeholder="e.g., 6  (in %)"
                                        onKeyDown={blockPercentChar}
                                    />
                                    {errors.evaluationSteps?.[index]?.maxLoss && (
                                        <p className="text-sm text-destructive">
                                            {errors.evaluationSteps[index]?.maxLoss?.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Daily Loss *</Label>
                                    <Input
                                        {...register(`evaluationSteps.${index}.dailyLoss`)}
                                        placeholder="e.g., 4  (in %)"
                                        onKeyDown={blockPercentChar}
                                    />
                                    {errors.evaluationSteps?.[index]?.dailyLoss && (
                                        <p className="text-sm text-destructive">
                                            {errors.evaluationSteps[index]?.dailyLoss?.message}
                                        </p>
                                    )}
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
                                    {errors.evaluationSteps?.[index]?.minTradingDays && (
                                        <p className="text-sm text-destructive">
                                            {errors.evaluationSteps[index]?.minTradingDays?.message}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Max Loss Type *</Label>
                                    <Input
                                        {...register(`evaluationSteps.${index}.maxLossType`)}
                                        placeholder="e.g., static, trailing"
                                        onChange={(e) => {
                                            setValue(`evaluationSteps.${index}.maxLossType`, e.target.value.toLowerCase() as "static" | "trailing");
                                        }}
                                    />
                                    {errors.evaluationSteps?.[index]?.maxLossType && (
                                        <p className="text-sm text-destructive">
                                            {errors.evaluationSteps[index]?.maxLossType?.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </CardContent>
        </Card>
    );
};