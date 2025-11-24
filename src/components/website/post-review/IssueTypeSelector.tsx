import React from 'react'
import { AlertCircle } from 'lucide-react'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { IssueTypeSelectorProps } from '../types/types'

export const IssueTypeSelector: React.FC<IssueTypeSelectorProps> = ({
  issueCategories,
  selectedCategory,
  selectedSubCategory,
  onCategoryChange,
  onSubCategoryChange,
  error
}) => {
  const selectedCategoryData = issueCategories.find(c => c.id === selectedCategory);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-base font-semibold">
          Issue Category *
        </Label>
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select an issue category" />
          </SelectTrigger>
          <SelectContent>
            {issueCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedCategory && selectedCategoryData && (
        <div className="space-y-3">
          <Label className="text-base font-semibold">
            Specific Issue *
          </Label>
          <RadioGroup
            onValueChange={onSubCategoryChange}
            value={selectedSubCategory}
            className="grid grid-cols-1 md:grid-cols-1 gap-3"
          >
            {selectedCategoryData.subCategories.map((sub) => (
              <div
                key={sub.value}
                className="flex items-start space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <RadioGroupItem
                  value={sub.value}
                  id={sub.value}
                  className="mt-1"
                />
                <div className="flex-1">
                  <Label
                    htmlFor={sub.value}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {sub.label}
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    {sub.description}
                  </p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  )
}