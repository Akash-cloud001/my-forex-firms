/* eslint-disable */
// @ts-nocheck

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { TabsContent } from '@/components/ui/tabs'
import { Star } from 'lucide-react'
import { Label } from '@/components/ui/label'

function RatingTab({ firmData }: any) {
  const ratings = firmData?.ratings || {}

  return (
    <TabsContent value="ratings">
      <Card className="shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Star className="h-5 w-5" />
            Ratings & Reviews
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* TrustPilot */}
          <div className="p-5 rounded-xl space-y-2">
            <Label className="text-sm text-muted-foreground">
              TrustPilot Rating
            </Label>

            <div className="flex items-end gap-2">
              <span className="text-4xl font-semibold leading-none">
                {ratings.trustPilotRating ?? "-"}
              </span>
              <span className="text-muted-foreground text-sm mb-1">/ 5.0</span>
            </div>
          </div>

          <Separator />

          {/* Other Ratings */}
          <div className="space-y-4">
            <Label className="text-sm text-muted-foreground">
              Other Rated Platforms
            </Label>

            <div className="space-y-3">
              {(ratings.otherRatings || []).map((rating: any) => (
                <div
                  key={rating._id}
                  className="flex items-center justify-between bg-muted p-4 rounded-lg"
                >
                  <span className="text-sm font-medium">
                    {rating.platform}
                  </span>

                  <div className="flex items-center gap-1">
                    <span className="text-xl font-semibold leading-none">
                      {rating.rating}
                    </span>
                    <span className="text-muted-foreground text-sm">/ 5</span>
                  </div>
                </div>
              ))}

              {(!ratings.otherRatings || ratings.otherRatings.length === 0) && (
                <div className="text-sm text-muted-foreground p-4 text-center rounded-lg border">
                  No additional rating sources available
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )
}

export default RatingTab
