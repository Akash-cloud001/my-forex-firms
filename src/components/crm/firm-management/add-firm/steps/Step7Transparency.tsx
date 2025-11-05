import { useFormContext } from "react-hook-form";
import { StepProps } from "./Step2Leadership";
import { Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function Step7Transparency({ onNext, onPrevious }:StepProps) {
  const { register, watch, setValue } = useFormContext();

  const toggles = [
    { field: 'ceoPublic', label: 'CEO Public Identity' },
    { field: 'officeVerified', label: 'Office Verified' },
    { field: 'termsPublicUpdated', label: 'Terms Public & Updated' },
    { field: 'payoutProofPublic', label: 'Payout Proof Public' },
    { field: 'thirdPartyAudit', label: 'Third-Party Audit' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Eye className="h-6 w-6 " />
          Transparency Metrics
        </h2>
        <p className="text-gray-600 mt-1">Set transparency indicators and scores</p>
      </div>

      <Card className="p-6 space-y-4">
        {toggles.map(({ field, label }) => (
          <div key={field} className="flex items-center justify-between p-3  rounded">
            <Label>{label}</Label>
            <Switch
              checked={watch(`transparency.${field}`) || false}
              onCheckedChange={(checked) => setValue(`transparency.${field}`, checked)}
            />
          </div>
        ))}
      </Card>

      <div>
        <Label>Transparency Score (0-10)</Label>
        <div className="flex items-center gap-3 mt-2">
          <input
            type="range"
            min="0"
            max="10"
            value={watch('transparency.transparencyScore') || 0}
            onChange={(e) =>
              setValue('transparency.transparencyScore', parseInt(e.target.value))
            }
            className="flex-1"
          />
          <span className="w-8 text-center font-semibold">
            {watch('transparency.transparencyScore') || 0}
          </span>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Notes</Label>
        <Textarea
          {...register('transparency.notes')}
          placeholder="Additional transparency notes..."
          rows={4}
        />
      </div>

      <div className="flex justify-between pt-6 ">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button type="button" onClick={onNext}>Next Step</Button>
      </div>
    </div>
  );
}
