/* eslint-disable */
// @ts-nocheck
import React from 'react'
import { Card, CardContent,  CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { TabsContent } from '@/components/ui/tabs'
import { Star } from 'lucide-react'
function RatingTab({firmData}:any) {
  return (
     <TabsContent value="ratings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Ratings & Reviews
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-accent rounded-lg">
                <label className="text-sm font-medium text-muted-foreground">
                  TrustPilot Rating
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-3xl font-bold">
                    {firmData.ratings.trustPilotRating}
                  </span>
                  <span className="text-muted-foreground">/ 5.0</span>
                </div>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-3 block">
                  Other Ratings
                </label>
                <div className="space-y-3">
                  {firmData.ratings.otherRatings.map((rating: any) => (
                    <div
                      key={rating._id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <span className="font-medium">{rating.platform}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold">
                          {rating.rating}
                        </span>
                        <span className="text-muted-foreground">/ 5</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
  )
}

export default RatingTab