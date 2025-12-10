"use client"
import React, { useState, useMemo } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useFirmProgramList } from '@/hooks/queries/useFirmProgramList'
import { useFirmDetails } from '@/hooks/queries/useFirmDetails'
import { useParams } from 'next/navigation'
import { IProgram } from '@/models/FirmProgram'
import Image from 'next/image'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface GroupedProgram {
  type: string
  programs: IProgram[]
  name: string // First program's name for this type
  accountSizes: Array<{ size: number; price: number }>
  profitTargets: Array<{ phase: number; target: string }>
  profitSplit: string
  maxDrawDown: string
  dailyDrawDown: string
  drawDownStep: string
  minTradingDays: number
}

const ChallengesContent = () => {
  const params = useParams()
  const slug = params.slug as string
  const [isFeaturesModalOpen, setIsFeaturesModalOpen] = useState(false)
  const [selectedStepType, setSelectedStepType] = useState<string | null>(null)
  // Track selected account size for each group (keyed by group type)
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

  // Group programs by type and aggregate data
  const groupedPrograms = useMemo(() => {
    if (!programsData?.programs || programsData.programs.length === 0) {
      return []
    }

    const groups = new Map<string, GroupedProgram>()

    programsData.programs.forEach((program) => {
      const type = program.type || 'Unknown'
      
      if (!groups.has(type)) {
        // Get first program's evaluation step data
        const firstStep = program.evaluationSteps && program.evaluationSteps.length > 0 
          ? program.evaluationSteps[0] 
          : null

        // Format profit split - add % if not present
        let profitSplit = program.profitSplit || '-'
        if (profitSplit !== '-' && !profitSplit.includes('%')) {
          profitSplit = `${profitSplit}%`
        }

        groups.set(type, {
          type,
          programs: [],
          name: program.name || 'Challenge',
          accountSizes: [],
          profitTargets: [],
          profitSplit,
          maxDrawDown: firstStep?.maxLoss ? `${firstStep.maxLoss}%` : '-',
          dailyDrawDown: firstStep?.dailyLoss ? `${firstStep.dailyLoss}%` : '-',
          drawDownStep: firstStep?.maxLossType || program.drawdownResetType || '-',
          minTradingDays: firstStep?.minTradingDays || 0
        })
      }

      const group = groups.get(type)!
      group.programs.push(program)

      // Aggregate account sizes (collect unique sizes with their prices)
      program.accountSizes.forEach(({ size, price }) => {
        const existing = group.accountSizes.find(s => s.size === size)
        if (!existing) {
          group.accountSizes.push({ size, price })
        }
      })

      // Extract profit targets from evaluation steps
      if (program.evaluationSteps && program.evaluationSteps.length > 0) {
        program.evaluationSteps.forEach((step) => {
          const existing = group.profitTargets.find(p => p.phase === step.stepNumber)
          if (!existing) {
            group.profitTargets.push({
              phase: step.stepNumber,
              target: step.profitTarget
            })
          }
        })
      }
    })

    // Sort account sizes by size
    groups.forEach((group) => {
      group.accountSizes.sort((a, b) => a.size - b.size)
      group.profitTargets.sort((a, b) => a.phase - b.phase)
    })

    return Array.from(groups.values())
  }, [programsData?.programs])

  const getLeverageForStepType = (stepType: string): Array<{ asset: string; leverage: string }> => {
    if (!firmData?.trading?.leverageMatrix) return []

    const leverageEntries: Array<{ asset: string; leverage: string }> = []
    
    Object.entries(firmData.trading.leverageMatrix).forEach(([asset, stepTypes]) => {
      if (stepTypes && typeof stepTypes === 'object') {
        // Try to match step type (handle case variations)
        const stepTypeKey = Object.keys(stepTypes).find(
          key => key.toLowerCase() === stepType.toLowerCase()
        )
        if (stepTypeKey && stepTypes[stepTypeKey as keyof typeof stepTypes]) {
          leverageEntries.push({
            asset,
            leverage: stepTypes[stepTypeKey as keyof typeof stepTypes] as string
          })
        }
      }
    })

    return leverageEntries
  }

  const isLoading = isLoadingPrograms || isLoadingFirm

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="w-[500px] rounded-lg overflow-hidden">
              <Skeleton className="h-12 w-full bg-orange-500/20" />
              <Skeleton className="h-96 w-full bg-gray-800/20" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!groupedPrograms || groupedPrograms.length === 0) {
    return (
      <div className="w-full border border-border p-8 rounded-lg card-custom-grad">
        <p className="text-center text-foreground">No challenge programs found</p>
      </div>
    )
  }

  return (
    <div className="max-w-[1032px] w-full mx-auto mt-8">
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-8 justify-items-center">
        {groupedPrograms.map((group) => {
          const leverageData = getLeverageForStepType(group.type)
          const platforms = firmData?.trading?.tradingPlatforms || []

          return (
            <div
              key={group.type}
              className="w-full sm:w-[500px] rounded-lg overflow-hidden border border-primary/50 bg-secondary/5"
            >
              {/* Header Section - Orange Background */}
              <div className="bg-primary p-5 flex items-center justify-between flex-wrap gap-0 sm:gap-3 h-auto sm:h-16">
                <p className="text-white font-normal text-xs sm:text-sm">
                  Challenge Name: <span className="font-semibold">{group.name}</span>
                </p>
                <p className="text-white font-normal text-xs sm:text-sm ">
                  Type: <span className="font-semibold">{group.type.toUpperCase().replace('-', ' ')}</span>
                </p>
              </div>

              {/* Main Content - Dark Gray Background */}
              <div className="p-5 space-y-3 text-white">
                {/* Account Sizes */}
                <div className="flex justify-between items-center">
                  <p className="text-xs sm:text-sm font-medium text-secondary/80">Account Sizes:</p>
                  {/* Mobile: Select dropdown */}
                  <div className="sm:hidden">
                    <Select
                      value={selectedAccountSizes[group.type]?.toString() || group.accountSizes[0]?.size.toString() || ''}
                      onValueChange={(value) => {
                        setSelectedAccountSizes(prev => ({
                          ...prev,
                          [group.type]: parseInt(value)
                        }))
                      }}
                    >
                      <SelectTrigger className="w-[120px] bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {group.accountSizes.map(({ size }, idx) => (
                          <SelectItem key={idx} value={size.toString()}>
                            {formatCurrency(size)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {/* Desktop: List of sizes */}
                  <div className="hidden sm:flex flex-wrap gap-2 items-end justify-end">
                    {group.accountSizes.map(({ size }, idx) => (
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
                <div className="flex justify-between items-center">
                  <p className="text-xs sm:text-sm font-medium text-secondary/80">Prices:</p>
                  {/* Mobile: Show selected size's fee */}
                  <div className="sm:hidden">
                    {(() => {
                      const selectedSize = selectedAccountSizes[group.type] || group.accountSizes[0]?.size
                      const selectedSizeObj = group.accountSizes.find(s => s.size === selectedSize)
                      return selectedSizeObj ? (
                        <span className="w-16 py-1.5 text-xs text-secondary flex items-center justify-center rounded-md bg-white/10 border border-white/20 font-semibold font-inter">
                          {formatPrice(selectedSizeObj.price)}
                        </span>
                      ) : null
                    })()}
                  </div>
                  {/* Desktop: List of all fees */}
                  <div className="hidden sm:flex flex-wrap gap-2 items-end justify-end">
                    {group.accountSizes.map(({ price }, idx) => (
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
                {group.profitTargets.length > 0 && (
                  <div className="flex justify-between items-center">
                    <p className="text-xs sm:text-sm font-medium text-secondary/80">Profit Targets:</p>
                    <div className="flex flex-wrap gap-2 items-end justify-end">
                      {group.profitTargets.map((target, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-1.5 text-xs text-secondary flex items-center justify-center rounded-md bg-white/10 border border-white/20 font-semibold font-inter  "
                        >
                          Phase {target.phase} - {target.target.split('%')[0]}%
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Profit Split */}
                <div className="flex justify-between items-center">
                  <p className="text-xs sm:text-sm font-medium text-secondary/80">Profit Split:</p>
                  <div className="flex flex-wrap gap-2 items-end justify-end">
                    <span className="px-4 py-1.5 text-xs text-secondary flex items-center justify-center rounded-md bg-white/10 border border-white/20 font-semibold font-inter  ">
                      {group.profitSplit}
                    </span>
                  </div>
                </div>

                {/* Platforms */}
                {platforms.length > 0 && (
                  <div className="flex justify-between items-center">
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
                {leverageData.length > 0 && (
                  <div className="flex justify-between items-start gap-4">
                    <p className="text-xs sm:text-sm font-medium text-secondary/80">Leverage:</p>
                    <div className="flex flex-wrap gap-2 items-end justify-end">
                      {leverageData.map((item, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-1.5 text-xs text-secondary flex items-center justify-center rounded-md bg-white/10 border border-white/20 font-semibold font-inter  "
                        >
                          {item.asset} | {item.leverage}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Max Draw Down */}
                <div className="flex justify-between items-center">
                  <p className="text-xs sm:text-sm font-medium text-secondary/80">Max Draw Down:</p>
                  <p className="text-xs sm:text-sm text-white font-medium text-right">{group.maxDrawDown.endsWith('%') ? group.maxDrawDown.split('%')[0] + '%' : group.maxDrawDown}</p>
                </div>

                {/* Daily Draw Down */}
                <div className="flex justify-between items-center">
                  <p className="text-xs sm:text-sm font-medium text-secondary/80">Daily Draw Down:</p>
                  <p className="text-xs sm:text-sm text-white font-medium text-right">{group.dailyDrawDown.endsWith('%') ? group.dailyDrawDown.split('%')[0] + '%' : group.dailyDrawDown}</p>
                </div>

                {/* Draw Down Step */}
                <div className="flex justify-between items-center">
                  <p className="text-xs sm:text-sm font-medium text-secondary/80">Draw Down Step:</p>
                  <p className="text-xs sm:text-sm text-white font-medium text-right">{group.drawDownStep.endsWith('%') ? group.drawDownStep.split('%')[0] : group.drawDownStep}</p>
                </div>

                {/* Min Trading Days */}
                {group.minTradingDays > 0 && (
                  <div className="flex justify-between items-center">
                    <p className="text-xs sm:text-sm font-medium text-secondary/80">Min Trading Days:</p>
                    <p className="text-xs sm:text-sm text-white font-medium text-right">{group.minTradingDays}</p>
                  </div>
                )}

                {/* Features Link */}
                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => {
                      setSelectedStepType(group.type)
                      setIsFeaturesModalOpen(true)
                    }}
                    className="text-[#F66435] underline text-xs sm:text-sm hover:opacity-80 transition-opacity"
                  >
                    Features
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Features Modal */}
      <Dialog open={isFeaturesModalOpen} onOpenChange={setIsFeaturesModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Features - {selectedStepType ? selectedStepType.toUpperCase().replace('-', ' ') : ''} Challenge
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-foreground/60">Features content will be added here.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ChallengesContent
