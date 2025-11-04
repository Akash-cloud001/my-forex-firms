import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Headphones, Plus, Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { StepProps } from "./Step2Leadership";
import { FirmFormData } from "../schema/schema";

export function Step5Support({ onNext, onPrevious }:StepProps) {
  const { register, control, watch, setValue } = useFormContext<FirmFormData>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'support.channels',
  });

  return (
    <div className="space-y-6">
      <div className="text-primary-foreground">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Headphones className="h-6 w-6 " />
          Customer Support
        </h2>
        <p className="text-gray-600 mt-1">Configure support channels and availability</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Average Resolution Time</Label>
          <Input {...register('support.avgResolutionTime')} placeholder="e.g., 24 hours" />
        </div>
        <div>
          <Label>Support Hours</Label>
          <Input {...register('support.supportHours')} placeholder="e.g., 24/7" />
        </div>
      </div>

      <div>
        <Label className="mb-3 block">Support Channels</Label>
        <div className="space-y-3">
          {fields.map((field, index) => (
            <Card key={field.id} className="p-4">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Label className="text-xs">Type</Label>
                    <Select
                      value={watch(`support.channels.${index}.type`)}
                      onValueChange={(value) =>
                        setValue(`support.channels.${index}.type`, value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="chat">Live Chat</SelectItem>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="ticket">Ticket System</SelectItem>
                        <SelectItem value="discord">Discord</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs">Link/Contact</Label>
                    <Input {...register(`support.channels.${index}.link`)} />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    className="mt-5"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Label className="text-xs">Response Time</Label>
                    <Input
                      {...register(`support.channels.${index}.responseTime`)}
                      placeholder="e.g., 2 hours"
                    />
                  </div>
                  <div className="flex-1">
                    <Label className="text-xs">Status</Label>
                    <Select
                      value={watch(`support.channels.${index}.status`)}
                      onValueChange={(value) =>
                        setValue(`support.channels.${index}.status`,   value as "active" | "inactive")
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={watch(`support.channels.${index}.preferred`) || false}
                    onCheckedChange={(checked) =>
                      setValue(`support.channels.${index}.preferred`, checked)
                    }
                  />
                  <Label className="text-xs">Preferred Channel</Label>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <Button
          type="button"
          onClick={() =>
            append({
              type: '',
              link: '',
              preferred: false,
              responseTime: '',
              status: 'active',
            })
          }
          variant="outline"
          className="w-full mt-3"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Support Channel
        </Button>
      </div>

      <div className="flex justify-between pt-6">
        <Button type="button" variant="outline" onClick={onPrevious}>
          Previous
        </Button>
        <Button type="button" onClick={onNext}>Next Step</Button>
      </div>
    </div>
  );
}
