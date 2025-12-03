import React from "react";
import { UseFieldArrayRemove, UseFieldArrayAppend, FieldErrors, UseFormRegister, FieldArrayWithId } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ProgramFormData } from "../types";

interface AccountSizesProps {
    register: UseFormRegister<ProgramFormData>;
    sizeFields: FieldArrayWithId<ProgramFormData, "accountSizes", "id">[];
    appendSize: UseFieldArrayAppend<ProgramFormData, "accountSizes">;
    removeSize: UseFieldArrayRemove;
    errors: FieldErrors<ProgramFormData>;
}

export const AccountSizes: React.FC<AccountSizesProps> = ({
    register,
    sizeFields,
    appendSize,
    removeSize,
    errors,
}) => {
    return (
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
    );
};
