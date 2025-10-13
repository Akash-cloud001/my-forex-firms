"use client";

import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface StepProps {
  data: Record<string, unknown>;
  onNext: (data: Record<string, unknown>) => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

interface SocialCommunicationForm {
  twitterUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  youtubeUrl: string;
  discordInviteLink: string;
  telegramLink: string;
  statusTrustPageUrl: string;
  supportEmail: string;
  supportChatUrl: string;
  supportHours: string;
}

export default function SocialCommunicationStep({
  data,
  onNext,
  onPrevious,
}: StepProps) {
  const form = useForm<SocialCommunicationForm>({
    defaultValues: {
      twitterUrl: (data.twitterUrl as string) || "",
      instagramUrl: (data.instagramUrl as string) || "",
      linkedinUrl: (data.linkedinUrl as string) || "",
      youtubeUrl: (data.youtubeUrl as string) || "",
      discordInviteLink: (data.discordInviteLink as string) || "",
      telegramLink: (data.telegramLink as string) || "",
      statusTrustPageUrl: (data.statusTrustPageUrl as string) || "",
      supportEmail: (data.supportEmail as string) || "",
      supportChatUrl: (data.supportChatUrl as string) || "",
      supportHours: (data.supportHours as string) || "",
    },
  });

  const onSubmit = (formData: SocialCommunicationForm) => {
    onNext(formData as unknown as Record<string, unknown>);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div>
          <h3 className="text-lg font-semibold">Social & Communication</h3>
          <p className="text-sm text-muted-foreground mb-6">
            Provide social media links and communication channels for transparency.
          </p>

          <Card>
            <CardHeader>
              <CardTitle>Social Media Presence</CardTitle>
              <CardDescription>
                Official social media accounts and community channels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="twitterUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter (X) URL</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://twitter.com/company"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instagramUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram URL</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://instagram.com/company"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="linkedinUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn URL</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://linkedin.com/company/company"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="youtubeUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>YouTube URL</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://youtube.com/@company"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="discordInviteLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discord Invite Link</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://discord.gg/invite-code"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Permanent invite link to Discord server
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telegramLink"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telegram Link</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://t.me/company"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t border-border">
          <Button type="button" variant="outline" onClick={onPrevious}>
            Previous
          </Button>
          <Button type="submit">Next Step</Button>
        </div>
      </form>
    </Form>
  );
}
