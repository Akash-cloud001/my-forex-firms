import React, { useState, useRef, useEffect } from 'react'
import { X, CheckCircle, AlertCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { FirmSelectorProps } from '../types/types'

export const FirmSelector: React.FC<FirmSelectorProps> = ({ 
  value, 
  onChange, 
  error, 
  firms 
}) => {
  const [firmSearch, setFirmSearch] = useState(value)
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    setFirmSearch(value)
  }, [value])
  
 const filteredFirms = firms.filter(firm =>
  (firm.name ?? "").toLowerCase().includes((firmSearch ?? "").toLowerCase())
)

  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  
  const handleSelectFirm = (firmName: string) => {
    setFirmSearch(firmName)
    onChange(firmName)
    setShowDropdown(false)
  }
  
  const handleClear = () => {
    setFirmSearch('')
    onChange('')
    setShowDropdown(true)
  }
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setFirmSearch(newValue)
    setShowDropdown(true)
    onChange(newValue)
  }
  
  return (
    <div className="space-y-3">
      <Label htmlFor="firmName" className="text-base font-semibold">
        Firm Name *
      </Label>
      <div className="relative" ref={dropdownRef}>
        <Input
          id="firmName"
          placeholder="Search for a prop firm..."
          value={firmSearch}
          onChange={handleInputChange}
          onFocus={() => setShowDropdown(true)}
          className={cn(
            "pr-10",
            error && "border-destructive"
          )}
        />
        {firmSearch && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        
        {showDropdown && filteredFirms.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
            {filteredFirms.map((firm) => (
              <button
                key={firm.id}
                type="button"
                className="w-full px-4 py-3 text-left hover:bg-muted flex items-center justify-between"
                onClick={() => handleSelectFirm(firm.name)}
              >
                <span>{firm.name}</span>
                {firm.verified && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
              </button>
            ))}
          </div>
        )}
        
        {showDropdown && firmSearch && filteredFirms.length === 0 && (
          <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg">
            <div className="px-4 py-3 text-muted-foreground">
              No firms found. Try a different search term.
            </div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  )
}