import React from "react";
import { useFormContext, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { FirmFormData } from "../schema/schema";

export interface StepProps {
  onNext: () => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  onSubmit: () => void;
}
export function Step2Leadership({
  onNext,
  isFirstStep,
}: StepProps) {
  const {
    register,
    formState: { errors },
    control,
    watch,
    setValue,
  } = useFormContext<FirmFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "leadership.leadership",
  });

  const addLeader = () => {
    append({
      name: "",
      role: "",
      verified: false,
      links: {
        twitter: "",
        instagram: "",
        telegram: "",
        linkedin: "",
        website: "",
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Users className="h-6 w-6 text-primary-foreground" />
          Leadership Team
        </h2>
        <p className="text-gray-600 mt-1">
          Add key personnel and leadership information
        </p>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <Card key={field.id} className="p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-semibold text-lg">Leader {index + 1}</h3>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(index)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-2">
              <div className="space-y-2">
                <Label>Name *</Label>
                <Input
                  {...register(`leadership.leadership.${index}.name`)}
                  placeholder="Full name"
                  className={
                    errors.leadership?.leadership?.[index]?.name
                      ? "border-red-500"
                      : ""
                  }
                />
                {errors.leadership?.leadership?.[index]?.name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.leadership.leadership[index]?.name?.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Role *</Label>
                <Input
                  {...register(`leadership.leadership.${index}.role`)}
                  placeholder="CEO, CTO, etc."
                  className={
                    errors.leadership?.leadership?.[index]?.role
                      ? "border-red-500"
                      : ""
                  }
                />
                {errors.leadership?.leadership?.[index]?.role && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.leadership.leadership[index]?.role?.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mb-2 w-fit gap-4">
              <Label>Verified Identity</Label>
              <Switch
                checked={
                  watch(`leadership.leadership.${index}.verified`) || false
                }
                onCheckedChange={(checked) =>
                  setValue(`leadership.leadership.${index}.verified`, checked)
                }
              />
            </div>

           
            <div className="space-y-2">
              <Label>Social Links</Label>
              {(["twitter", "instagram", "telegram", "linkedin", "website"] as const).map(
                (platform) => (
                  <Input
                    key={platform}
                    {...register(
              `leadership.leadership.${index}.links.${platform}` as const
                    )}
                    placeholder={`${
                      platform.charAt(0).toUpperCase() + platform.slice(1)
                    } URL`}
                    type="url"
                  />
                )
              )}
            </div>
          </Card>
        ))}
      </div>

      <Button
        type="button"
        onClick={addLeader}
        variant="outline"
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Leader
      </Button>

      <div className="flex justify-between pt-6 ">
        <Button
          type="button"
          variant="outline"
          onClick={() => {}}
          disabled={isFirstStep}
        >
          Previous
        </Button>
        <Button type="button" onClick={onNext}>
          Next Step
        </Button>
      </div>
    </div>
  );
}
