import React, { useState } from "react";
import { Control, UseFieldArrayRemove, UseFieldArrayAppend, FieldErrors, UseFormRegister, UseFormSetValue, FieldArrayWithId } from "react-hook-form";
import { Plus, Trash2, X } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ProgramFormData } from "../types";

interface ProfitPayoutConfigProps {
    register: UseFormRegister<ProgramFormData>;
    payoutFields: FieldArrayWithId<ProgramFormData, "payoutFrequency", "id">[];
    appendPayout: UseFieldArrayAppend<ProgramFormData, "payoutFrequency">;
    removePayout: UseFieldArrayRemove;
    errors: FieldErrors<ProgramFormData>;
    payoutMethods: string[];
    setValue: UseFormSetValue<ProgramFormData>;
}

export const ProfitPayoutConfig: React.FC<ProfitPayoutConfigProps> = ({
    register,
    payoutFields,
    appendPayout,
    removePayout,
    errors,
    payoutMethods,
    setValue,
}) => {
    const [payoutMethodInput, setPayoutMethodInput] = useState("");

    const addPayoutMethod = () => {
        if (payoutMethodInput.trim()) {
            if (!payoutMethods.includes(payoutMethodInput.trim())) {
                setValue("payoutMethods", [...payoutMethods, payoutMethodInput.trim()], {
                    shouldValidate: true,
                    shouldDirty: true,
                });
                setPayoutMethodInput("");
            }
        }
    };

    const removePayoutMethod = (method: string) => {
        setValue(
            "payoutMethods",
            payoutMethods.filter((m: string) => m !== method),
            {
                shouldValidate: true,
                shouldDirty: true,
            }
        );
    };

    return (
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


                </div>

                <Separator />

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label>Payout Frequency Options *</Label>
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
                            <Button
                                type="button"
                                onClick={() => removePayout(index)}
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                disabled={payoutFields.length === 1}
                                title={payoutFields.length === 1 ? "At least one option is required" : "Remove option"}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}

                    {errors.payoutFrequency && (
                        <p className="text-sm text-destructive">
                            {typeof errors.payoutFrequency.message === 'string'
                                ? errors.payoutFrequency.message
                                : 'Please fill in all payout frequency options'}
                        </p>
                    )}
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
    );
};
