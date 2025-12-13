"use client"
import React, { useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useFirmProgramList } from '@/hooks/queries/useFirmProgramList'
import { useFirmDetails } from '@/hooks/queries/useFirmDetails'
import { useParams } from 'next/navigation'
import { IProgram } from '@/models/FirmProgram'
import Image from 'next/image'
import { ArrowRight, Infinity, Info } from 'lucide-react'
import mongoose from 'mongoose'

// Extended program interface to include optional leverage field
interface IProgramWithLeverage extends IProgram {
  leverage?: string
  stopLossRequired?: boolean
  eaAllowed?: boolean
  weekendHolding?: boolean
  overnightHolding?: boolean
  newsTrading?: boolean
  copyTrading?: boolean
  refundFee?: boolean
}
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const ChallengesContent = () => {
  const params = useParams()
  const slug = params.slug as string
  const [isFeaturesModalOpen, setIsFeaturesModalOpen] = useState(false)
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null)
  // Track selected account size for each program (keyed by program ID)
  const [selectedAccountSizes, setSelectedAccountSizes] = useState<Record<string, number>>({})

  const { data: programsData, isLoading: isLoadingPrograms } = useFirmProgramList({
    slug,
    page: 1,
    limit: 1000 // Get all programs to group them
  })

  const { data: firmData, isLoading: isLoadingFirm } = useFirmDetails(slug)

  // Map platform names to SVG file paths
  const getPlatformSvgPath = (platformName: string): string | null => {
    const normalized = platformName.toLowerCase().replace(/\s+/g, '')

    const platformMap: Record<string, string> = {
      'ctrader': '/website/platforms/ctrader.svg',
      'matchtrader': '/website/platforms/matchtrader.svg',
      'mt5': '/website/platforms/mt5.svg',
      'metatrader5': '/website/platforms/mt5.svg',
      'metatrader 5': '/website/platforms/mt5.svg',
      'dxtrade': '/website/platforms/dxtrade.svg',
      'dxt': '/website/platforms/dxtrade.svg',
      'dx trade': '/website/platforms/dxtrade.svg',
      'traderlocker': '/website/platforms/traderlocker.svg',
      'trader locker': '/website/platforms/traderlocker.svg',
    }

    return platformMap[normalized] || null
  }

  const formatCurrency = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatPrice = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}k`
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value)
  }

  // Helper function to format percentage values
  const formatPercentage = (value: string | undefined | null): string => {
    if (!value || value === '-') return '-'
    // Remove any existing % and add it back
    const numericValue = value.replace('%', '').trim()
    if (!numericValue) return '-'
    return `${numericValue}%`
  }

  // Helper function to format profit split
  const formatProfitSplit = (value: string | undefined | null): string => {
    if (!value || value === '-') return '-'
    if (value.includes('%')) return value
    return `${value}%`
  }

  // Get leverage from program or firm data
  const getProgramLeverage = (program: IProgram): string | null => {
    // First try to get leverage from program itself
    const programWithLeverage = program as IProgramWithLeverage
    if (programWithLeverage.leverage) {
      return programWithLeverage.leverage
    }
    
    // Fallback to firm data leverage matrix
    if (!firmData?.trading?.leverageMatrix) return null

    const leverageEntries: Array<{ asset: string; leverage: string }> = []
    
    Object.entries(firmData.trading.leverageMatrix).forEach(([asset, stepTypes]) => {
      if (stepTypes && typeof stepTypes === 'object') {
        // Try to match step type (handle case variations)
        const stepTypeKey = Object.keys(stepTypes).find(
          key => key.toLowerCase() === program.type.toLowerCase()
        )
        if (stepTypeKey && stepTypes[stepTypeKey as keyof typeof stepTypes]) {
          leverageEntries.push({
            asset,
            leverage: stepTypes[stepTypeKey as keyof typeof stepTypes] as string
          })
        }
      }
    })

    // Return first leverage entry or null
    return leverageEntries.length > 0 ? leverageEntries[0].leverage : null
  }

  const isLoading = isLoadingPrograms || isLoadingFirm

  if (isLoading) {
    return (
      <div className="max-w-7xl w-full mx-auto mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
          {Array.from({ length: 2 }).map((_, index) => (
            <div key={index} className="w-[600px] rounded-sm overflow-hidden">
              <Skeleton className="h-96 w-full bg-gray-800/20">
                <Skeleton className="h-16 w-full bg-gray-800/30 " />
              
              </Skeleton>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!programsData?.programs || programsData.programs.length === 0) {
    return (
      <div className="w-full border border-border p-8 rounded-lg card-custom-grad">
        <p className="text-center text-foreground">No challenge programs found</p>
      </div>
    )
  }

  // Sort account sizes for each program
  const sortedPrograms = programsData.programs.map(program => {
    const sortedAccountSizes = [...program.accountSizes].sort((a, b) => a.size - b.size)
    return {
      ...program.toObject ? program.toObject() : program,
      accountSizes: sortedAccountSizes
    } as IProgram
  })

  return (
    <div className="max-w-7xl w-full mx-auto mt-8">
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8 justify-items-center">
        {sortedPrograms.map((program) => {
          const firstStep = program.evaluationSteps && program.evaluationSteps.length > 0 
            ? program.evaluationSteps[0] 
            : null
          
          const programLeverage = getProgramLeverage(program)
          const platforms = firmData?.trading?.tradingPlatforms || []
          const programId = (program._id as mongoose.Types.ObjectId).toString()

          return (
            <div
              key={programId}
              className="w-full sm:w-[600px] rounded-lg overflow-hidden border border-primary/50 bg-secondary/5 relative pb-8"
            >
              {/* Header Section - Orange Background */}
              <div className="bg-primary p-5 flex items-center justify-between flex-wrap gap-0 sm:gap-3 h-auto sm:h-16">
                <p className="text-white font-normal text-xs sm:text-sm">
                  Challenge Name: <span className="font-semibold">{program.name || 'Challenge'}</span>
                </p>
                <p className="text-white font-normal text-xs sm:text-sm ">
                  Type: <span className="font-semibold">{(program.type || 'Unknown').toUpperCase().replace('-', ' ')}</span>
                </p>
              </div>

              {/* Main Content - Dark Gray Background */}
              <div className="p-5 space-y-3 text-white ">
                {/* Account Sizes */}
                <div className="flex justify-between items-start">
                  <p className="text-xs sm:text-sm font-medium text-secondary/80">Account Sizes:</p>
                  {/* Mobile: Select dropdown */}
                  <div className="sm:hidden">
                    <Select
                      value={selectedAccountSizes[programId]?.toString() || program.accountSizes[0]?.size.toString() || ''}
                      onValueChange={(value) => {
                        setSelectedAccountSizes(prev => ({
                          ...prev,
                          [programId]: parseInt(value)
                        }))
                      }}
                    >
                      <SelectTrigger className="w-[120px] bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {program.accountSizes.map(({ size }, idx) => (
                          <SelectItem key={idx} value={size.toString()}>
                            {formatCurrency(size)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Desktop: List of sizes */}
                  <div className="hidden sm:flex flex-wrap gap-2 items-end justify-end">
                    {program.accountSizes.map(({ size }, idx) => (
                      <span
                        key={idx}
                        className="w-16 py-1.5 text-xs sm:text-sm text-success flex items-center justify-center rounded-md bg-success/10 border border-success/20 font-semibold font-inter  "
                      >
                        {formatCurrency(size)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Prices/Fees */}
                <div className="flex justify-between items-start">
                  <p className="text-xs sm:text-sm font-medium text-secondary/80">Prices:</p>
                  {/* Mobile: Show selected size's fee */}
                  <div className="sm:hidden">
                    {(() => {
                      const selectedSize = selectedAccountSizes[programId] || program.accountSizes[0]?.size
                      const selectedSizeObj = program.accountSizes.find(s => s.size === selectedSize)
                      return selectedSizeObj ? (
                        <span className="w-16 py-1.5 text-xs text-secondary flex items-center justify-center rounded-md bg-white/10 border border-white/20 font-semibold font-inter">
                          {formatPrice(selectedSizeObj.price)}
                        </span>
                      ) : null
                    })()}
                  </div>
                  {/* Desktop: List of all fees */}
                  <div className="hidden sm:flex flex-wrap gap-2 items-end justify-end">
                    {program.accountSizes.map(({ price }, idx) => (
                      <span
                        key={idx}
                        className="w-16 py-1.5 text-xs text-secondary flex items-center justify-center rounded-md bg-white/10 border border-white/20 font-semibold font-inter  "
                      >
                        {formatPrice(price)}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Profit Targets */}
                {program.evaluationSteps && program.evaluationSteps.length > 0 && (
                  <div className="flex justify-between items-start">
                    <p className="text-xs sm:text-sm font-medium text-secondary/80">Profit Targets:</p>
                    <div className="flex flex-wrap gap-2 items-end justify-end">
                      {program.evaluationSteps.map((step, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-1.5 text-xs text-secondary flex items-center justify-center rounded-md bg-white/10 border border-white/20 font-semibold font-inter  "
                        >
                          Phase {step.stepNumber} - {formatPercentage(step.profitTarget).replace('%', '')}%
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Profit Split */}
                <div className="flex justify-between items-start">
                  <p className="text-xs sm:text-sm font-medium text-secondary/80">Profit Split:</p>
                  <div className="flex flex-wrap gap-2 items-end justify-end">
                    <span className="px-4 py-1.5 text-xs text-secondary flex items-center justify-center rounded-md bg-white/10 border border-white/20 font-semibold font-inter  ">
                      {formatProfitSplit(program.profitSplit)}
                    </span>
                  </div>
                </div>

                {/* Platforms */}
                {platforms.length > 0 && (
                  <div className="flex justify-between items-start">
                    <p className="text-xs sm:text-sm font-medium text-secondary/80">Platforms:</p>
                    <div className="flex flex-wrap gap-2 items-end justify-end">
                      {platforms.map((platform, idx) => {
                        const iconPath = getPlatformSvgPath(platform)
                        return (
                          <span
                            key={idx}
                            className="px-4 py-1.5 text-xs text-secondary justify-center rounded-md bg-white/10 border border-white/20 font-semibold font-inter  flex items-center gap-2"
                          >
                            {iconPath && (
                              <Image
                                src={iconPath}
                                alt={platform}
                                width={12}
                                height={12}
                                className="object-contain"
                              />
                            )}
                            {platform}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Leverage */}
                {programLeverage && (
                  <div className="flex justify-between items-start gap-4">
                    <p className="text-xs sm:text-sm font-medium text-secondary/80">Leverage:</p>
                    <div className="flex flex-wrap gap-2 items-end justify-end">
                      <span className="px-4 py-1.5 text-xs text-secondary flex items-center justify-center rounded-md bg-white/10 border border-white/20 font-semibold font-inter  ">
                        {programLeverage}
                      </span>
                    </div>
                  </div>
                )}

                {/* Max Draw Down */}
                <div className="flex justify-between items-center">
                  <p className="text-xs sm:text-sm font-medium text-secondary/80">Max Draw Down:</p>
                  <p className="text-xs sm:text-sm text-white font-medium text-right">
                    {formatPercentage(firstStep?.maxLoss)}
                  </p>
                </div>

                {/* Daily Draw Down */}
                <div className="flex justify-between items-center">
                  <p className="text-xs sm:text-sm font-medium text-secondary/80">Daily Draw Down:</p>
                  <p className="text-xs sm:text-sm text-white font-medium text-right">
                    {formatPercentage(firstStep?.dailyLoss)}
                  </p>
                </div>

                {/* Draw Down Step */}
                <div className="flex justify-between items-center">
                  <p className="text-xs sm:text-sm font-medium text-secondary/80">Draw Down Type:</p>
                  <p className="text-xs sm:text-sm text-white font-medium text-right">
                    {firstStep?.maxLossType || program.drawdownResetType || '-'}
                  </p>
                </div>

                {/* Min Trading Days */}
                {firstStep?.minTradingDays && firstStep.minTradingDays > 0 && (
                  <div className="flex justify-between items-center">
                    <p className="text-xs sm:text-sm font-medium text-secondary/80">Min Trading Days:</p>
                    <p className="text-xs sm:text-sm text-white font-medium text-right">{firstStep.minTradingDays}</p>
                  </div>
                )}

                {/* Features Link */}
                <div className="absolute bottom-5 right-5">
                  <button
                    onClick={() => {
                      setSelectedProgramId(programId)
                      setIsFeaturesModalOpen(true)
                    }}
                    className="text-[#F66435] text-xs sm:text-sm hover:opacity-80 transition-opacity flex items-center gap-1"
                  >
                    Features <ArrowRight className="w-4 h-4 -rotate-45" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Features Modal */}
      <Dialog open={isFeaturesModalOpen} onOpenChange={setIsFeaturesModalOpen}>
        <DialogContent className="max-w-xs sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-xl text-primary">
              Features - {selectedProgramId && programsData?.programs.find(p => (p._id as mongoose.Types.ObjectId).toString() === selectedProgramId)?.name || ''} Challenge
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-6">
            {(() => {
              const program = programsData?.programs.find(p => (p._id as mongoose.Types.ObjectId).toString() === selectedProgramId) as IProgramWithLeverage | undefined

              if (!program) {
                return <p className="text-foreground/60">No challenge data available.</p>
              }

              return (
                <div className="space-y-6">
                  {/* Trading Rules */}
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-2">Trading Rules</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {(() => {
                        // Handle both direct properties and evaluationRule structure
                        const stopLoss = program.stopLossRequired ?? program.evaluationRule?.stopLoss?.required ?? false
                        const eaAllowed = program.eaAllowed ?? program.evaluationRule?.eaAllowed?.required ?? false
                        const weekendHolding = program.weekendHolding ?? program.evaluationRule?.weekendHolding?.required ?? false
                        const overnightHolding = program.overnightHolding ?? program.evaluationRule?.overnightHolding?.required ?? false
                        const newsTrading = program.newsTrading ?? program.evaluationRule?.newsTrading?.required ?? false
                        const copyTrading = program.copyTrading ?? program.evaluationRule?.copyTrading?.required ?? false

                        const rules = [
                          { name: 'Stop Loss Required', value: stopLoss },
                          { name: 'EA Allowed', value: eaAllowed },
                          { name: 'Weekend Holding', value: weekendHolding },
                          { name: 'Overnight Holding', value: overnightHolding },
                          { name: 'News Trading', value: newsTrading },
                          { name: 'Copy Trading', value: copyTrading },
                        ]

                        return (
                          <>
                            {rules.map((rule, idx) => (
                              <div key={idx} className="flex justify-between items-center">
                                <span className="text-sm text-foreground/60">{rule.name}:</span>
                                <div className="flex items-center gap-2">
                                  <span className={`text-sm font-medium ${rule.value ? 'text-success' : 'text-destructive'}`}>
                                    {rule.value ? 'Yes' : 'No'}
                                  </span>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Info className="w-4 h-4 text-foreground/40 hover:text-foreground/60 cursor-help" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>{rule.name}</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </div>
                              </div>
                            ))}
                          </>
                        )
                      })()}
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div>
                    <h3 className="text-base font-semibold text-foreground mb-2">Additional Information</h3>
                    <div className="space-y-2">
                      {(program.leverage || getProgramLeverage(program)) && (
                        <div className="flex justify-between">
                          <span className="text-sm text-foreground/60 text-left">Leverage:</span>
                          <span className="text-sm font-medium text-foreground text-right">
                            {program.leverage || getProgramLeverage(program) || '-'}
                          </span>
                        </div>
                      )}
                      {program.timeLimit && (
                        <div className="flex justify-between">
                          <span className="text-sm text-foreground/60 text-left">Time Limit:</span>
                          <span className="text-sm font-medium text-foreground text-right">
                            {program.timeLimit === 'Unlimited' ? <Infinity className="w-6 h-6" /> +'Unlimited' : `${program.timeLimit} days`}
                          </span>
                        </div>
                      )}
                      {program.drawdownResetType && (
                        <div className="flex justify-between">
                          <span className="text-sm text-foreground/60 text-left">Drawdown Reset Type:</span>
                          <span className="text-sm font-medium text-foreground text-right">{program.drawdownResetType}</span>
                        </div>
                      )}
                      {program.refundFee !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-sm text-foreground/60 text-left">Refundable Fee:</span>
                          <span className="text-sm font-medium text-foreground text-right">{program.refundFee ? 'Yes' : 'No'}</span>
                        </div>
                      )}
                      {program.evaluationSteps && program.evaluationSteps.length > 0 && program.evaluationSteps[0]?.profitTarget && (
                        <div className="flex justify-between">
                          <span className="text-sm text-foreground/60 text-left">Profit Target:</span>
                          <span className="text-sm font-medium text-foreground text-right">
                            {formatPercentage(program.evaluationSteps[0].profitTarget)}
                          </span>
                        </div>
                      )}
                      {program.evaluationSteps && program.evaluationSteps.length > 0 && program.evaluationSteps[0]?.maxLoss && (
                        <div className="flex justify-between">
                          <span className="text-sm text-foreground/60 text-left">Max Loss:</span>
                          <span className="text-sm font-medium text-foreground text-right">
                            {formatPercentage(program.evaluationSteps[0].maxLoss)}
                          </span>
                        </div>
                      )}
                      {program.evaluationSteps && program.evaluationSteps.length > 0 && program.evaluationSteps[0]?.dailyLoss && (
                        <div className="flex justify-between">
                          <span className="text-sm text-foreground/60 text-left">Daily Loss:</span>
                          <span className="text-sm font-medium text-foreground text-right">
                            {formatPercentage(program.evaluationSteps[0].dailyLoss)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ChallengesContent
