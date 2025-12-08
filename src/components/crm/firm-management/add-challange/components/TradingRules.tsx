import React from "react";
import { Control, Controller, UseFormRegister } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ProgramFormData } from "../types";

interface TradingRulesProps {
    control: Control<ProgramFormData>;
    register: UseFormRegister<ProgramFormData>;
    isInstantType: boolean;
}

export const TradingRules: React.FC<TradingRulesProps> = ({ control, register, isInstantType }) => {
    const ruleLabels = [
        { key: "stopLoss", label: "Stop Loss Required" },
        { key: "eaAllowed", label: "EA Allowed" },
        { key: "weekendHolding", label: "Weekend Holding" },
        { key: "overnightHolding", label: "Overnight Holding" },
        { key: "newsTrading", label: "News Trading" },
        { key: "copyTrading", label: "Copy Trading" },
        { key: "consistency", label: "Consistency Rule" },
        { key: "maxRiskPerTrade", label: "Max Risk Per Trade" },
    ] as const;

    return (
        <Card>
            <CardHeader>
                <CardTitle>Trading Rules & Restrictions</CardTitle>
                <CardDescription>
                    Configure trading rules for evaluation and funded phases
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                {/* Evaluation Rules */}
                {!isInstantType && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 pb-2 border-b">
                            <div className="h-8 w-1 bg-primary rounded-full" />
                            <h3 className="text-lg font-semibold">Evaluation Phase Rules</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {ruleLabels.map(({ key, label }) => (
                                <div key={`eval-${key}`} className="space-y-3 p-4 bg-accent/30 rounded-lg border border-border">
                                    <div className="flex items-center space-x-3">
                                        <Controller
                                            control={control}
                                            name={`evaluationRule.${key}.required`}
                                            render={({ field }) => (
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                    id={`eval-${key}`}
                                                />
                                            )}
                                        />
                                        <Label htmlFor={`eval-${key}`} className="font-medium cursor-pointer text-base">
                                            {label}
                                        </Label>
                                    </div>
                                    <Textarea
                                        {...register(`evaluationRule.${key}.note`)}
                                        placeholder={`Add notes about ${label.toLowerCase()} for evaluation phase...`}
                                        className="min-h-[80px] text-sm resize-none"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Funded Rules */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 pb-2 border-b">
                        <div className="h-8 w-1 bg-green-500 rounded-full" />
                        <h3 className="text-lg font-semibold">Funded Phase Rules</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ruleLabels.map(({ key, label }) => (
                            <div key={`funded-${key}`} className="space-y-3 p-4 bg-accent/30 rounded-lg border border-border">
                                <div className="flex items-center space-x-3">
                                    <Controller
                                        control={control}
                                        name={`fundedRule.${key}.required`}
                                        render={({ field }) => (
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                id={`funded-${key}`}
                                            />
                                        )}
                                    />
                                    <Label htmlFor={`funded-${key}`} className="font-medium cursor-pointer text-base">
                                        {label}
                                    </Label>
                                </div>
                                <Textarea
                                    {...register(`fundedRule.${key}.note`)}
                                    placeholder={`Add notes about ${label.toLowerCase()} for funded phase...`}
                                    className="min-h-[80px] text-sm resize-none"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};