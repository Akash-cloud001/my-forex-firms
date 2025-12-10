import React from 'react'
import { AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface SuccessModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md text-white border-none rounded-md">
        <div className="space-y-4 py-4">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-secondary/5 flex items-center justify-center text-4xl mb-4">
              <Image src="/website/complaint-icon.svg" alt="Success" width={50} height={50} />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Complaint Submitted Successfully
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Your complaint will be reviewed by our team and published once approved. 
              This helps maintain the quality and credibility of our PropTrust Index™.
            </p>
          </div>
          <div className="flex justify-center">
            <Button 
              onClick={() => onOpenChange(false)}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface ErrorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  errorMessage: string
}

export const ErrorModal: React.FC<ErrorModalProps> = ({ open, onOpenChange, errorMessage }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-red-600">
            Submission Failed
          </DialogTitle>
          <DialogDescription className="text-center text-base">
            There was an error submitting your complaint.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Complaint Submission Failed
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
              onClick={() => onOpenChange(false)}
              className="w-full"
            >
              Try Again
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}