import React from "react";
import { Control, Controller, FieldErrors, UseFormRegister } from "react-hook-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProgramFormData } from "../types";

interface BasicInformationProps {
    control: Control<ProgramFormData>;
    register: UseFormRegister<ProgramFormData>;
    errors: FieldErrors<ProgramFormData>;
    isInstantType: boolean;
}

export const BasicInformation: React.FC<BasicInformationProps> = ({
    control,
    register,
    errors,
    isInstantType,
}) => {
    return (
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
                            type="number"
                            {...register("evaluationPhases", { valueAsNumber: true })}
                            placeholder="Number of phases"
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
