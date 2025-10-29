import React from 'react'
import { AlertCircle } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { IssueTypeSelectorProps } from '../types/types'

export const IssueTypeSelector: React.FC<IssueTypeSelectorProps> = ({ 
  value, 
  onChange, 
  error, 
  issueTypes 
}) => {
  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">
        Issue Type *
      </Label>
      <RadioGroup
        onValueChange={onChange}
        value={value}
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        {issueTypes.map((issue) => (
          <div 
            key={issue.value} 
            className="flex items-start space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <RadioGroupItem
              value={issue.value}
              id={issue.value}
              className="mt-1"
            />
            <div className="flex-1">
              <Label
                htmlFor={issue.value}
                className="text-sm font-medium cursor-pointer"
              >
                {issue.label}
              </Label>
              <p className="text-xs text-muted-foreground mt-1">
                {issue.description}
              </p>
            </div>
          </div>
        ))}
      </RadioGroup>
      
      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  )
}