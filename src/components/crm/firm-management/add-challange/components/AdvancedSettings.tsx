import React from "react";
import { UseFormRegister } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProgramFormData } from "../types";

interface AdvancedSettingsProps {
    register: UseFormRegister<ProgramFormData>;
}

export const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({ register }) => {
    return (
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
                            type="number"
                            {...register("minTradingDays", { valueAsNumber: true })}
                            placeholder="e.g., 5"
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
