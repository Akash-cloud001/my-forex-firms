import { useFormContext } from "react-hook-form";
import { StepProps } from "./Step2Leadership";
import { useState } from "react";
import { LinkIcon, Plus, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FirmFormData } from "../schema/schema";

export function Step4SocialLinks({ onNext, onPrevious }:StepProps) {
 const {  setValue, watch } = useFormContext<FirmFormData>();  
 const [newPlatform, setNewPlatform] = useState('');
  const [newUrl, setNewUrl] = useState('');
  
  const socialLinks = watch('socialLinks.socialLinks') || {};

  const addSocialLink = () => {
    if (newPlatform && newUrl) {
      setValue('socialLinks.socialLinks', {
        ...socialLinks,
        [newPlatform]: newUrl,
      });
      setNewPlatform('');
      setNewUrl('');
    }
  };

  const removeSocialLink = (platform:string) => {
    const updated = { ...socialLinks };
    delete updated[platform];
    setValue('socialLinks.socialLinks', updated);
  };

  return (
    <div className="space-y-6">
      <div className="text-primary-foreground">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <LinkIcon className="h-6 w-6 " />
          Social Media Links
        </h2>
        <p className="text-gray-600 mt-1">Add social media and community links</p>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Input
            value={newPlatform}
            onChange={(e) => setNewPlatform(e.target.value)}
            placeholder="Platform name (e.g., Twitter)"
          />
          <Input
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="URL"
            type="url"
          />
        </div>
        <Button type="button" onClick={addSocialLink} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Social Link
        </Button>
      </Card>

      <div className="space-y-2">
        {Object.entries(socialLinks).map(([platform, url]) => (
          <Card key={platform} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold">{platform}</p>
                <p className="text-sm text-gray-600 truncate">{url}</p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeSocialLink(platform)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
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