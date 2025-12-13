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
            <CardContent className="gap-4">


                <div className="space-y-2 mb-3">
                    <Label>Time Limit</Label>
                    <Input
                        {...register("timeLimit")}
                        placeholder="e.g., 4 (in days) "
                    />
                </div>

                <div className="space-y-2">
                    <Label>Drawdown Reset Type</Label>
                    <Input
                        {...register("drawdownResetType")}
                        placeholder="e.g., Daily, Weekly"
                    />
                </div>


            </CardContent>
        </Card>
    );
};
