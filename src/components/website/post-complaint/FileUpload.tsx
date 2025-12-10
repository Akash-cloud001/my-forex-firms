import React, { useState, useEffect } from 'react'
import { Upload, X, AlertCircle, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { FileUploadProps } from '../types/types'
import { FILE_UPLOAD_CONFIG } from '../constant/constants'

export const FileUpload: React.FC<FileUploadProps> = ({ files, onFilesChange, error }) => {
  const [dragActive, setDragActive] = useState(false)
  const [filePreviews, setFilePreviews] = useState<{ [key: number]: string }>({})
  
  useEffect(() => {
    // const newPreviews: { [key: number]: string } = {}
    
    files.forEach((file, index) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setFilePreviews(prev => ({
            ...prev,
            [index]: reader.result as string
          }))
        }
        reader.readAsDataURL(file)
      }
    })
    
    // Cleanup function to revoke object URLs
    return () => {
      Object.values(filePreviews).forEach(preview => {
        if (preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview)
        }
      })
    }
  }, [files])
  
  const handleFiles = (newFiles: FileList | null) => {
    if (!newFiles) return
    
    const fileArray = Array.from(newFiles)
    const validFiles = fileArray.filter(file => {
      const isValidType = FILE_UPLOAD_CONFIG.acceptedTypes.some(type => 
        file.type === type || file.type.startsWith('image/')
      )
      const isValidSize = file.size <= FILE_UPLOAD_CONFIG.maxFileSize
      return isValidType && isValidSize
    })
    
    if (validFiles.length !== fileArray.length) {
      alert('Some files were rejected. Only JPG, PNG, PDF files under 5MB are allowed.')
    }
    
    onFilesChange([...files, ...validFiles].slice(0, FILE_UPLOAD_CONFIG.maxFiles))
  }
  
  const removeFile = (index: number) => {
    onFilesChange(files.filter((_, i) => i !== index))
  }
  
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }
  
  const getFilePreview = (file: File, index: number) => {
    if (file.type.startsWith('image/')) {
      const preview = filePreviews[index]
      return preview ? (
        <img 
          src={preview} 
          alt={file.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      )
    }
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 dark:bg-red-950/20">
        <FileText className="h-12 w-12 text-red-500 mb-2" />
        <span className="text-xs text-red-600 dark:text-red-400 font-medium">PDF</span>
      </div>
    )
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
            JPG, PNG, PDF up to 5MB each (max {FILE_UPLOAD_CONFIG.maxFiles} files)
          </p>
        </div>
        <input
          type="file"
          multiple
          accept={FILE_UPLOAD_CONFIG.acceptedExtensions}
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
          id="file-upload"
        />
        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          Choose Files
        </Button>
      </div>
      
      {files.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium">
            Uploaded Files ({files.length}/{FILE_UPLOAD_CONFIG.maxFiles})
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {files.map((file, index) => (
              <div key={index} className="relative group">
                <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-border bg-muted hover:border-primary transition-colors">
                  {getFilePreview(file, index)}
                  
                  {/* Delete button overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removeFile(index)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity shadow-lg scale-90 hover:scale-100"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Filename below */}
                <p className="text-xs text-muted-foreground mt-2 truncate text-center px-1" title={file.name}>
                  {file.name}
                </p>
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