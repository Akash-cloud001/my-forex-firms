"use client"
import React, { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronRight } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { useFirmProgramList } from '@/hooks/queries/useFirmProgramList'
import { useParams } from 'next/navigation'
import { Pagination } from '@/components/common/Pagination'
import { IProgram } from '@/models/FirmProgram'

const ChallengesContent = () => {
  const params = useParams()
  const slug = params.slug as string

  const [selectedSteps, setSelectedSteps] = useState<string>('all')
  const [selectedSize, setSelectedSize] = useState<string>('all')
  const [selectedAssets, setSelectedAssets] = useState<string>('all')
  const [selectedChallenge, setSelectedChallenge] = useState<IProgram | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)

  const { data, isLoading } = useFirmProgramList({
    slug,
    type: selectedSteps !== 'all' ? selectedSteps : undefined,
    size: selectedSize !== 'all' ? parseInt(selectedSize) : undefined,
    page,
    limit
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value)
  }

  const getDisplaySizeAndFee = (program: IProgram) => {
    if (selectedSize !== 'all') {
      const sizeObj = program.accountSizes.find(s => s.size === parseInt(selectedSize))
      if (sizeObj) {
        return {
          size: formatCurrency(sizeObj.size),
          fee: formatCurrency(sizeObj.price)
        }
      }
    }

    if (program.accountSizes.length === 0) return { size: '-', fee: '-' }

    const minSize = Math.min(...program.accountSizes.map(s => s.size))
    const maxSize = Math.max(...program.accountSizes.map(s => s.size))
    const minFee = Math.min(...program.accountSizes.map(s => s.price))

    return {
      size: minSize === maxSize ? formatCurrency(minSize) : `${formatCurrency(minSize)} - ${formatCurrency(maxSize)}`,
      fee: `${formatCurrency(minFee)}`
    }
  }

  return (
    <div className="w-full border border-border p-8 rounded-lg card-custom-grad">
      {/* Filter Section */}
      <div className="flex gap-4 mb-6">
        <div className="flex items-center gap-2">
          <p className="text-sm text-foreground/60">Steps:</p>
          <Select value={selectedSteps} onValueChange={(val) => { setSelectedSteps(val); setPage(1); }}>
          <SelectTrigger className="w-[100px] !bg-white/10 !text-white">
            <SelectValue placeholder="Steps: Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="1-Step">1-Step</SelectItem>
            <SelectItem value="2-Step">2-Step</SelectItem>
            <SelectItem value="3-Step">3-Step</SelectItem>
            <SelectItem value="Instant">Instant</SelectItem>
          </SelectContent>
        </Select>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-sm text-foreground/60">Size:</p>
          <Select value={selectedSize} onValueChange={(val) => { setSelectedSize(val); setPage(1); }}>
          <SelectTrigger className="w-[120px] !bg-white/10 !text-white">
            <SelectValue placeholder=" Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="5000">$5,000</SelectItem>
            <SelectItem value="10000">$10,000</SelectItem>
            <SelectItem value="25000">$25,000</SelectItem>
            <SelectItem value="50000">$50,000</SelectItem>
            <SelectItem value="100000">$100,000</SelectItem>
          </SelectContent>
        </Select>
        </div>

        {/* <div className="flex items-center gap-2">
          <p className="text-sm text-foreground/60">Assets:</p>
          <Select value={selectedAssets} onValueChange={setSelectedAssets}>
            <SelectTrigger className="w-[150px] !bg-white/10 !text-white">
              <SelectValue placeholder=" Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="forex">Forex</SelectItem>
              <SelectItem value="crypto">Crypto</SelectItem>
              <SelectItem value="stocks">Stocks</SelectItem>
              <SelectItem value="indices">Indices</SelectItem>
            </SelectContent>
          </Select>
        </div> */}
      </div>

      {/* Table Section */}
      <div className=" rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-foreground/20 ">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground flex items-center relative">
                  CHALLENGE
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground ">
                  STEPS
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground ">
                  ACCOUNT SIZE
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground ">
                  FEE
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground ">
                  PROFIT TARGET
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground ">
                  PROFIT SPLIT
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground ">
                  LEVERAGE
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground ">
                  MAX LOSS
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground">
                  DAILY LOSS
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-foreground w-10">
                  {/* Empty header for chevron */}
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                // Skeleton rows
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index} className={`border-b border-foreground/20 w-full ${index === 4 ? 'last:border-b-0' : ''}`}>
                    <td className="px-4 py-4">
                      <Skeleton className="h-4 w-32" />
                    </td>
                    <td className="px-4 py-4">
                      <Skeleton className="h-4 w-20" />
                    </td>
                    <td className="px-4 py-4">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="px-4 py-4">
                      <Skeleton className="h-4 w-12" />
                    </td>
                    <td className="px-4 py-4">
                      <Skeleton className="h-4 w-10" />
                    </td>
                    <td className="px-4 py-4">
                      <Skeleton className="h-4 w-10" />
                    </td>
                    <td className="px-4 py-4">
                      <Skeleton className="h-4 w-14" />
                    </td>
                    <td className="px-4 py-4">
                      <Skeleton className="h-4 w-10" />
                    </td>
                    <td className="px-4 py-4">
                      <Skeleton className="h-4 w-10" />
                    </td>
                    <td className="px-4 py-4 text-center">
                      <Skeleton className="h-5 w-5 mx-auto" />
                    </td>
                  </tr>
                ))
              ) : data?.programs.map((program, index) => {
                const { size, fee } = getDisplaySizeAndFee(program)
                return (
                  <tr
                    key={program._id as string}
                    className="border-b border-foreground/20 last:border-b-0 hover:bg-foreground/5 transition-colors cursor-pointer"
                    onClick={() => {
                      setSelectedChallenge(program)
                      setIsDrawerOpen(true)
                    }}
                  >
                    <td className="px-4 py-4 text-sm text-foreground">
                      {program.name}
                    </td>
                    <td className="px-4 py-4 text-sm text-foreground">
                      {program.type}
                    </td>
                    <td className="px-4 py-4 text-sm text-primary">
                      {size}
                    </td>
                    <td className="px-4 py-4 text-sm text-red-500">
                      {fee}
                    </td>
                    <td className="px-4 py-4 text-sm text-success">
                      {program.profitTarget ? program.profitTarget + '%' : '-'}
                    </td>
                    <td className="px-4 py-4 text-sm text-success">
                      {program.profitSplit ? program.profitSplit + '%' : '-'}
                    </td>
                    <td className="px-4 py-4 text-sm text-foreground">
                      {program.leverage}
                    </td>
                    <td className="px-4 py-4 text-sm text-red-500">
                      {program.maxLoss ? program.maxLoss + '%' : '-'}
                    </td>
                    <td className="px-4 py-4 text-sm text-red-500">
                      {program.dailyLoss ? program.dailyLoss + '%' : '-'}
                    </td>
                    <td className="px-4 py-4 text-center">
                      <ChevronRight className="w-5 h-5 text-muted-foreground cursor-pointer hover:opacity-80" />
                    </td>
                  </tr>
                )
              })}
              {!isLoading && (!data?.programs || data.programs.length === 0) && (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-foreground">No programs found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {data?.pagination && data.pagination.totalPages > 1 && (
          <div className="mt-4">
            <Pagination
              currentPage={page}
              totalPages={data.pagination.totalPages}
              totalItems={data.pagination.total}
              itemsPerPage={limit}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>

      {/* Challenge Details Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent
          side="right"
          className="w-full max-w-[380px] overflow-y-auto text-white border-none bg-background p-0"
        >
          {selectedChallenge && (
            <div className="h-full flex flex-col">
              {/* Header */}
              <SheetHeader className="mt-8 -mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl gradient-text capitalize font-semibold text-foreground">{selectedChallenge.name}</h2>
                  <p className="text-sm text-muted-foreground">Steps: {selectedChallenge.type}</p>
                </div>
              </SheetHeader>

              {/* Content */}
              <div className="flex-1 px-4 py-4 space-y-4">
                {/* Key Metrics Cards */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Max Drawdown & Profit Target Card */}
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">Account Size</p>
                        <div className="space-y-2">
                      {selectedChallenge.accountSizes.map((size, idx) => (
                          <span key={idx} className="text-2xl font-bold text-success/80">${size.size.toLocaleString()}</span>
                      ))}
                    </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Fee:</p>
                      {selectedChallenge.accountSizes.map((size, idx) => (
                        <span key={idx} className="text-2xl font-bold text-foreground/80">${size.price.toLocaleString()}</span>
                      ))}
                    </div>
                  </div>
                  

                  {/* Daily Loss Card */}
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Daily Loss:</p>
                      <p className="text-xl font-bold text-destructive/80">{selectedChallenge.dailyLoss}%</p>
                    </div>
                  </div>

                  {/* Max Loss Type Card */}
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Max Loss Type:</p>
                      <p className="text-lg font-bold text-foreground/80">{selectedChallenge.maxLossType}</p>
                    </div>
                  </div>

                  <div className="bg-card border border-border rounded-lg p-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Profit Split</p>
                      <p className="text-lg font-bold text-success/80">
                      {selectedChallenge.profitSplit}%
                      </p>
                    </div>
                  </div>

                  {/* Min Trading Days Card */}
                  <div className="bg-card border border-border rounded-lg p-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Min Trading Days:</p>
                      <p className="text-lg font-bold text-foreground/80">{selectedChallenge.minTradingDays} days</p>
                    </div>
                  </div>

                </div>
                {/* Program Details */}
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3">Program Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Evaluation Phases</span>
                      <span className="text-sm font-medium text-foreground">{selectedChallenge.evaluationPhases}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Min Trading Days</span>
                      <span className="text-sm font-medium text-foreground">{selectedChallenge.minTradingDays} days</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Time Limit</span>
                      <span className="text-sm font-medium text-foreground">{selectedChallenge.timeLimit === 'Unlimited' ? '∞ Unlimited' : `${selectedChallenge.timeLimit} days`}</span>
                    </div>
                  </div>
                </div>

                {/* Challenge Trading Overview */}
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3">Challenge Trading Overview</h3>
                  <div className="space-y-2">
                    {[
                      { label: 'Max Drawdown', value: selectedChallenge.maxLoss + '%', allowed: true },
                      { label: 'News Trading', value: selectedChallenge.newsTrading ? 'Yes' : 'No', allowed: selectedChallenge.newsTrading },
                      { label: 'Copy Trading', value: selectedChallenge.copyTrading ? 'Yes' : 'No', allowed: selectedChallenge.copyTrading },
                      { label: 'EA Trading', value: selectedChallenge.eaAllowed ? 'Yes' : 'No', allowed: selectedChallenge.eaAllowed },
                      { label: 'Weekend Holding', value: selectedChallenge.weekendHolding ? 'Yes' : 'No', allowed: selectedChallenge.weekendHolding },
                      { label: 'Overnight Holding', value: selectedChallenge.overnightHolding ? 'Yes' : 'No', allowed: selectedChallenge.overnightHolding },
                      { label: 'Stop Loss Required', value: selectedChallenge.stopLossRequired ? 'Yes' : 'No', allowed: selectedChallenge.stopLossRequired }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{item.value}</span>
                          <div className={`w-2 h-2 rounded-full ${item.allowed ? 'bg-success' : 'bg-red-500'}`}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payout Overview */}
                <div>
                  <h3 className="text-sm font-medium text-foreground mb-3">Payout Overview</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Refundable Fee</span>
                      <span className="text-sm font-medium text-foreground">{selectedChallenge.refundFee ? 'Yes' : 'No'}</span>
                    </div>
                    {selectedChallenge.payoutFrequency && selectedChallenge.payoutFrequency.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Payout Frequency</p>
                        {selectedChallenge.payoutFrequency.map((freq, idx) => (
                          <div key={idx} className="flex justify-between items-center text-sm mb-0.5 px-2">
                            <span className="text-muted-foreground">{freq.label}</span>
                            <span className="font-medium text-foreground">{freq.percentage}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                

              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}

export default ChallengesContent
