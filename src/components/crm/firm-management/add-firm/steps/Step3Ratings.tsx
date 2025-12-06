import { useFieldArray, useFormContext } from "react-hook-form";
import { StepProps } from "./Step2Leadership";
import { Plus, Star, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function Step3Ratings({ onNext, onPrevious }: StepProps) {
  const { register, control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "ratings.otherRatings",
  });

  return (
    <div className="space-y-6">
      <div className="text-primary-foreground">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Star className="h-6 w-6 " />
          Ratings & Reviews
        </h2>
        <p className="text-gray-600 mt-1">Add ratings from various platforms</p>
      </div>

      <Card className="p-6 space-y-3 flex flex-row">
        <Label htmlFor="trustPilotRating">TrustPilot Rating (0–5)</Label>
        <Input
          id="trustPilotRating"
          step="0.1"
          min="0"
          max="5"
          placeholder="Enter rating"
          {...register("ratings.trustPilotRating", { valueAsNumber: true })}
          className="max-w-20"
        />
      </Card>

      <div>
        <Label className="mb-3 block">Other Ratings</Label>
        <div className="space-y-3">
          {fields.map((field, index) => (
            <Card key={field.id} className="p-4">
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <Label className="text-xs">Platform</Label>
                  <Input
                    {...register(`ratings.otherRatings.${index}.platform`)}
                    placeholder="e.g., Google Reviews"
                  />
                </div>
                <div className="w-32">
                  <Label className="text-xs">Rating (0-5)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    {...register(`ratings.otherRatings.${index}.rating`, {
                      valueAsNumber: true,
                    })}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
        <Button
          type="button"
          onClick={() => append({ platform: "", rating: 0 })}
          variant="outline"
          className="w-full mt-3"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Rating
        </Button>
      </div>

      <div className="flex justify-between pt-6 ">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button type="button" onClick={onNext}>
          Next Step
        </Button>
      </div>
    </div>
  );
}
