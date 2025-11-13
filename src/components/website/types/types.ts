export interface Firm {
  id: string
  name: string
  verified: boolean
}

export interface IssueType {
  value: string
  label: string
  description: string
}

export interface ReviewFormData {
  firmName: string
  firmId?:string
  customFirmName?: string
  issueType: string
  customIssueType?: string
  description: string
  rating: number
  files?: File[]
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
  value: string
  onChange: (value: string) => void
  error?: string
  issueTypes: IssueType[]
}