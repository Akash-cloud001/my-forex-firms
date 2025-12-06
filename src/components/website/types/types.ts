export interface Firm {
  id: string
  name: string
  verified: boolean
}

export interface SubCategory {
  value: string
  label: string
  description: string
}

export interface IssueCategory {
  id: string
  label: string
  subCategories: SubCategory[]
}

export interface ReviewFormData {
  firmName: string
  firmId?: string
  customFirmName?: string
  issueCategory: string
  issueSubCategory: string
  customIssueType?: string
  description: string
  // rating: number
  files: File[]
}

export interface FileUploadProps {
  files: File[]
  onFilesChange: (files: File[]) => void
  error?: string
}

export interface StarRatingProps {
  value: number
  onChange: (rating: number) => void
  error?: string
}

export interface FirmSelectorProps {
  value: string;
  onChange: (name: string, id?: string) => void;
  error?: string;
}

export interface IssueTypeSelectorProps {
  issueCategories: IssueCategory[]
  selectedCategory: string
  selectedSubCategory: string
  onCategoryChange: (category: string) => void
  onSubCategoryChange: (subCategory: string) => void
  error?: string
}