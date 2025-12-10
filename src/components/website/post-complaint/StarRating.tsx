import React, { useState } from 'react'
import { Star, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StarRatingProps } from '../types/types'
import { RATING_LABELS } from '../constant/constants'

export const StarRating: React.FC<StarRatingProps> = ({ value, onChange, error }) => {
  const [hoveredStar, setHoveredStar] = useState(0)
  
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={cn(
            "transition-colors duration-200 rounded-sm",
            "hover:scale-110 transform"
          )}
          onMouseEnter={() => setHoveredStar(star)}
          onMouseLeave={() => setHoveredStar(0)}
          onClick={() => onChange(star)}
        >
          <Star
            className={cn(
              "h-8 w-8 transition-colors duration-200",
              star <= (hoveredStar || value)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300 hover:text-yellow-300"
            )}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-sm text-muted-foreground">
          {RATING_LABELS[value as keyof typeof RATING_LABELS]}
        </span>
      )}
      {error && (
        <span className="ml-2 text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </span>
      )}
    </div>
  )
}