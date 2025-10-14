"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Challenge {
  challengeName: string;
  challengeType: string;
  profitSplit: string;
  accountSize: string;
  maximumDrawdown: string;
}

interface Firm {
  challenges?: Challenge[];
}

interface ChallengesTabProps {
  firm: Firm;
}

export function ChallengesTab({ firm }: ChallengesTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Trading Challenges</CardTitle>
          <CardDescription>Available challenge programs and requirements</CardDescription>
        </CardHeader>
        <CardContent>
          {firm.challenges && firm.challenges.length > 0 ? (
            <div className="space-y-4">
              {firm.challenges.map((challenge, index) => (
                <Card key={index} className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Challenge Name</label>
                      <p className="font-medium">{challenge.challengeName ? challenge.challengeName : 'N/A'}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-medium text-muted-foreground mr-1">Type</label>
                      <Badge variant="outline">{challenge.challengeType}</Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Profit Split</label>
                      <p className="font-medium">{challenge.profitSplit ? challenge.profitSplit : 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Account Size</label>
                      <p className="font-medium">{challenge.accountSize ? challenge.accountSize : 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Max Drawdown</label>
                      <p className="font-medium">{challenge.maximumDrawdown ? challenge.maximumDrawdown : 'N/A'}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No challenge information available.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
