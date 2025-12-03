import React from "react";
import { Control, Controller } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ProgramFormData } from "../types";
import { TRADING_RULES } from "../constants";

interface TradingRulesProps {
    control: Control<ProgramFormData>;
}

export const TradingRules: React.FC<TradingRulesProps> = ({ control }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Trading Rules & Restrictions</CardTitle>
                <CardDescription>
                    Define what traders can and cannot do
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {TRADING_RULES.map((rule) => (
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

                <Separator />


            </CardContent>
        </Card>
    );
};
