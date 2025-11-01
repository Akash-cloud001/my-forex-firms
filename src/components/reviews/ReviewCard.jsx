"use client"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Star, FileText, ExternalLink, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const ReviewCard = ({ 
  review, 
  onView, 
  onDelete, 
  getStatusColor, 
  getRatingColor, 
  formatDate 
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow overflow-hidden bg-card/50 backdrop-blur-sm border-border/50">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-1 capitalize flex items-center gap-2">
              {review.firmName} 
              <Badge className={cn("text-[10px] capitalize", getStatusColor(review.status))}>
                {review.status === 'pending' ? 'In Review' : review.status === 'approved' ? 'Posted' : 'Rejected'}
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-white/50 bg-white/10 backdrop-blur-sm px-2 py-1 rounded-md">
                Issue Type: {review.issueType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < review.rating ? "fill-current" : "text-muted-foreground",
                    getRatingColor(review.rating)
                  )}
                />
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-2 -mt-4">
        <p className="text-sm text-muted-foreground first-letter:capitalize line-clamp-1">
          {review.description}
        </p>

        {/* File count indicator */}
        {review.files && review.files.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <FileText className="h-3 w-3" />
            <span>{review.files.length} attachment{review.files.length !== 1 ? 's' : ''}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4">
          <Button onClick={() => onView(review)} variant="outline" size="sm" className="flex-1">
            <ExternalLink className="h-3 w-3 mr-1" />
            View
          </Button>
          <Button onClick={() => onDelete(review)} variant="outline" size="sm" className="text-destructive hover:text-destructive">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ReviewCard
