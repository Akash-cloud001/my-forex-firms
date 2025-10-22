"use client"
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Star, Upload, X, CheckCircle, AlertCircle, FileText, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createReview } from '@/lib/reviewApi'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Image from 'next/image'

// Form validation schema
const reviewFormSchema = z.object({
  firmName: z.string().min(1, 'Please select a firm'),
  customFirmName: z.string().optional(),
  issueType: z.string().min(1, 'Please select an issue type'),
  customIssueType: z.string().optional(),
  description: z.string()
    .min(50, 'Description must be at least 50 characters')
    .max(2000, 'Description must be less than 2000 characters'),
  rating: z.number().min(1, 'Please provide a rating').max(5),
  files: z.array(z.any()).optional()
}).refine((data) => {
  if (data.issueType === 'other' && (!data.customIssueType || data.customIssueType.trim().length === 0)) {
    return false
  }
  return true
}, {
  message: 'Please specify the issue type',
  path: ['customIssueType']
}).refine((data) => {
  if (data.firmName === 'Other' && (!data.customFirmName || data.customFirmName.trim().length === 0)) {
    return false
  }
  return true
}, {
  message: 'Please specify the firm name',
  path: ['customFirmName']
})

// Mock firm data - replace with actual API call
const mockFirms = [
  { id: '1', name: 'FTMO', verified: true },
  { id: '2', name: 'MyForexFunds', verified: true },
  { id: '3', name: 'The5ers', verified: true },
  { id: '4', name: 'TopStep', verified: false },
  { id: '5', name: 'Apex Trader Funding', verified: true },
  { id: '6', name: 'E8 Markets', verified: false },
  { id: '7', name: 'SurgeTrader', verified: true },
  { id: '8', name: 'Traders With Edge', verified: false },
  { id: 'other', name: 'Other', verified: false },
]

const issueTypes = [
  {
    value: 'user-complaints',
    label: 'User Complaints',
    description: 'General issues or dissatisfaction'
  },
  {
    value: 'payout-delays',
    label: 'Payout Delay Reports',
    description: 'Payment took longer than expected or promised timeframe'
  },
  {
    value: 'slippage-reports',
    label: 'Slippage Reports',
    description: 'Execution quality problems'
  },
  {
    value: 'payout-denials',
    label: 'Payout Denials',
    description: 'Withdrawal request was rejected or not honored'
  },
  {
    value: 'poor-practices',
    label: 'Poor Practices',
    description: 'Unethical business behavior'
  },
  {
    value: 'platform-instability',
    label: 'Platform Instability',
    description: 'Technical issues, downtime, crashes'
  },
  {
    value: 'unethical-marketing',
    label: 'Unethical Marketing',
    description: 'Misleading advertising or false claims'
  },
  {
    value: 'community-trust',
    label: 'Community Trust Impact',
    description: 'General negative community feedback'
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Specify a different issue type'
  }
]

// Star Rating Component
const StarRating = ({ value, onChange, error }) => {
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
          {value === 1 && 'Very Poor'}
          {value === 2 && 'Poor'}
          {value === 3 && 'Average'}
          {value === 4 && 'Good'}
          {value === 5 && 'Excellent'}
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

// File Upload Component
const FileUpload = ({ files, onFilesChange, error }) => {
  const [dragActive, setDragActive] = useState(false)
  
  const handleFiles = (newFiles) => {
    const fileArray = Array.from(newFiles)
    const validFiles = fileArray.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf'
      const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB
      return isValidType && isValidSize
    })
    
    if (validFiles.length !== fileArray.length) {
      alert('Some files were rejected. Only JPG, PNG, PDF files under 5MB are allowed.')
    }
    
    onFilesChange([...files, ...validFiles].slice(0, 5)) // Max 5 files
  }
  
  const removeFile = (index) => {
    onFilesChange(files.filter((_, i) => i !== index))
  }
  
  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }
  
  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }
  
  return (
    <div className="space-y-4">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          error ? "border-destructive" : ""
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <div className="space-y-2">
          <p className="text-lg font-medium">
            {dragActive ? 'Drop files here' : 'Upload proof documents'}
          </p>
          <p className="text-sm text-muted-foreground">
            Drag and drop files here, or click to browse
          </p>
          <p className="text-xs text-muted-foreground">
            JPG, PNG, PDF up to 5MB each (max 5 files)
          </p>
        </div>
        <input
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          id="file-upload"
        />
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() => document.getElementById('file-upload').click()}
        >
          Choose Files
        </Button>
      </div>
      
      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Uploaded Files ({files.length}/5)</p>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2">
                  {file.type.startsWith('image/') ? (
                    <ImageIcon className="h-4 w-4 text-blue-500" />
                  ) : (
                    <FileText className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm font-medium truncate max-w-[200px]">
                    {file.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    ({(file.size / 1024 / 1024).toFixed(1)}MB)
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => removeFile(index)}
                  className="text-destructive hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
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

const ReviewPage = () => {
  const [firmSearch, setFirmSearch] = useState('')
  const [showFirmDropdown, setShowFirmDropdown] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [isSubmittingForm, setIsSubmittingForm] = useState(false)
  const [showThankYouModal, setShowThankYouModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset
  } = useForm({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      firmName: '',
      customFirmName: '',
      issueType: '',
      customIssueType: '',
      description: '',
      rating: 0,
      files: []
    }
  })
  
  const watchedRating = watch('rating')
  const watchedDescription = watch('description')
  const watchedIssueType = watch('issueType')
  const watchedFirmName = watch('firmName')
  
  const filteredFirms = mockFirms.filter(firm =>
    firm.name.toLowerCase().includes(firmSearch.toLowerCase())
  )
  
  const onSubmit = async (data) => {
    setIsSubmittingForm(true)
    try {
      console.log('Form submitted:', data)
      
      // Prepare review data for API
      const reviewData = {
        firmName: data.firmName,
        customFirmName: data.customFirmName,
        issueType: data.issueType,
        customIssueType: data.customIssueType,
        description: data.description,
        rating: data.rating,
        files: selectedFiles
      }
      
      // Submit to API
      const result = await createReview(reviewData)
      console.log('Review created:', result)
      
      // Show thank you modal
      setShowThankYouModal(true)
      
      // Reset form
      reset()
      setSelectedFiles([])
      setFirmSearch('')
      setShowFirmDropdown(false)
      
    } catch (error) {
      console.error('Error submitting review:', error)
      setErrorMessage(error.message || 'An unexpected error occurred. Please try again.')
      setShowErrorModal(true)
    } finally {
      setIsSubmittingForm(false)
    }
  }
  
  return (
    <div className="min-h-screen py-8 grid grid-cols-1 lg:grid-cols-2 relative" >
      <div className="col-span-1 relative h-full">
        <div className="text-center flex flex-col items-center justify-start gap-4 static lg:sticky lg:top-0 lg:z-10">
            <Image src="/website/review.svg" alt="review" width={500} height={500} className='hidden md:block opacity-20' />
            <h1 className="text-4xl font-geist-sans opacity-50 font-bold text-foreground mb-4">
            Submit Your Review
            </h1>
        </div>
      </div>
      <div className="container mx-auto px-4 max-w-4xl">
        
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Review Form</CardTitle>
            <CardDescription>
              Please provide detailed information about your experience. All fields are required unless marked optional.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Firm Selection */}
              <div className="space-y-3">
                <Label htmlFor="firmName" className="text-base font-semibold">
                  Firm Name *
                </Label>
                <div className="relative">
                  <Input
                    id="firmName"
                    placeholder="Search for a prop firm..."
                    value={firmSearch}
                    onChange={(e) => {
                      setFirmSearch(e.target.value)
                      setShowFirmDropdown(true)
                      setValue('firmName', e.target.value)
                    }}
                    onFocus={() => setShowFirmDropdown(true)}
                    className={cn(
                      "pr-10",
                      errors.firmName && "border-destructive"
                    )}
                  />
                  {firmSearch && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => {
                        setFirmSearch('')
                        setValue('firmName', '')
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {showFirmDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {filteredFirms.length > 0 ? (
                        filteredFirms.map((firm) => (
                          <button
                            key={firm.id}
                            type="button"
                            className="w-full px-4 py-3 text-left hover:bg-muted flex items-center justify-between"
                            onClick={() => {
                              setFirmSearch(firm.name)
                              setValue('firmName', firm.name)
                              setShowFirmDropdown(false)
                            }}
                          >
                            <span>{firm.name}</span>
                            {firm.verified && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-muted-foreground">
                          No firms found. Try a different search term.
                        </div>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Custom Firm Name Input */}
                {watchedFirmName === 'Other' && (
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="customFirmName" className="text-sm font-medium">
                      Please specify the firm name *
                    </Label>
                    <Input
                      id="customFirmName"
                      placeholder="Enter the firm name..."
                      className={cn(
                        errors.customFirmName && "border-destructive"
                      )}
                      {...register('customFirmName')}
                    />
                    {errors.customFirmName && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.customFirmName.message}
                      </p>
                    )}
                  </div>
                )}
                
                {errors.firmName && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.firmName.message}
                  </p>
                )}
              </div>
              
              {/* Issue Type Selection */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  Issue Type *
                </Label>
                <RadioGroup
                  onValueChange={(value) => setValue('issueType', value)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                  {issueTypes.map((issue) => (
                    <div key={issue.value} className="flex items-start space-x-3 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
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
                
                {/* Custom Issue Type Input */}
                {watchedIssueType === 'other' && (
                  <div className="mt-4 space-y-2">
                    <Label htmlFor="customIssueType" className="text-sm font-medium">
                      Please specify the issue type *
                    </Label>
                    <Input
                      id="customIssueType"
                      placeholder="Enter the specific issue type..."
                      className={cn(
                        errors.customIssueType && "border-destructive"
                      )}
                      {...register('customIssueType')}
                    />
                    {errors.customIssueType && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.customIssueType.message}
                      </p>
                    )}
                  </div>
                )}
                
                {errors.issueType && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.issueType.message}
                  </p>
                )}
              </div>
              
              {/* Description */}
              <div className="space-y-3">
                <Label htmlFor="description" className="text-base font-semibold">
                  Description *
                </Label>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    To help verify your review, please include:
                  </p>
                  <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1 ml-4">
                    <li>Specific dates and timeframes</li>
                    <li>Transaction or account reference numbers</li>
                    <li>Steps you've taken to resolve the issue</li>
                    <li>Communication received from the firm</li>
                  </ul>
                </div>
                <Textarea
                  id="description"
                  placeholder="Please describe your experience in detail."
                  className={cn(
                    "min-h-32 resize-none",
                    errors.description && "border-destructive"
                  )}
                  {...register('description')}
                />
                <div className="flex justify-between items-center text-sm">
                  <span className={cn(
                    "text-sm",
                    watchedDescription?.length > 2000 ? "text-destructive" : "text-muted-foreground"
                  )}>
                    {watchedDescription?.length || 0}/2000
                  </span>
                </div>
                {errors.description && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.description.message}
                  </p>
                )}
              </div>
              
              {/* Rating */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  Overall Rating *
                </Label>
                <StarRating
                  value={watchedRating}
                  onChange={(rating) => setValue('rating', rating)}
                  error={errors.rating?.message}
                />
              </div>
              
              {/* File Upload */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  Upload Proof Documents (Optional)
                </Label>
                <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <div className="text-blue-600 dark:text-blue-400 text-lg">💡</div>
                    <p className="text-xs text-blue-800 dark:text-blue-200">
                      <strong>Tip:</strong> Uploading proof (screenshots, emails, statements) significantly increases the credibility of your review and helps us verify your experience.
                    </p>
                  </div>
                </div>
                <FileUpload
                  files={selectedFiles}
                  onFilesChange={setSelectedFiles}
                  error={errors.files?.message}
                />
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmittingForm}
                  className="min-w-32 btn-grad"
                >
                  {isSubmittingForm ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        <p className="text-xs text-muted-foreground max-w-3xl mx-auto mt-8 px-5 text-center">
                Help the trading community by sharing your experience with prop firms. 
                Your review contributes to our PropTrust Index™ and helps other traders make informed decisions.
            </p>
      </div>
      
      {/* Thank You Modal */}
      <Dialog open={showThankYouModal} onOpenChange={setShowThankYouModal} className="text-white fill-white stroke-white">
        <DialogContent className="sm:max-w-md text-white border-none rounded-md">
          <div className="space-y-4 py-4">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 text-4xl">
              🎉
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Review Submitted Successfully
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Your review will be reviewed by our team and published once approved. 
                This helps maintain the quality and credibility of our PropTrust Index™.
              </p>
            </div>
            <div className="flex justify-center">
              <Button 
                onClick={() => setShowThankYouModal(false)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Error Modal */}
      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-red-600">
              Submission Failed
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              There was an error submitting your review.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Review Submission Failed
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {errorMessage}
              </p>
            </div>
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <div className="text-red-600 dark:text-red-400 text-lg">⚠️</div>
                <div className="text-sm text-red-800 dark:text-red-200">
                  <p className="font-medium mb-1">What you can do:</p>
                  <ul className="text-xs space-y-1">
                    <li>• Check your internet connection</li>
                    <li>• Try submitting again</li>
                    <li>• Contact support if the problem persists</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <Button 
                onClick={() => setShowErrorModal(false)}
                className="w-full"
              >
                Try Again
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ReviewPage