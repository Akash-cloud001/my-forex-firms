"use client"
import React, { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronRight } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
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
        <Select value={selectedSteps} onValueChange={(val) => { setSelectedSteps(val); setPage(1); }}>
          <SelectTrigger className="w-[180px] !bg-white/10 !text-white">
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

        <Select value={selectedSize} onValueChange={(val) => { setSelectedSize(val); setPage(1); }}>
          <SelectTrigger className="w-[180px] !bg-white/10 !text-white">
            <SelectValue placeholder="Size: Select" />
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

        <Select value={selectedAssets} onValueChange={setSelectedAssets}>
          <SelectTrigger className="w-[180px] !bg-white/10 !text-white">
            <SelectValue placeholder="Assets: Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="forex">Forex</SelectItem>
            <SelectItem value="crypto">Crypto</SelectItem>
            <SelectItem value="stocks">Stocks</SelectItem>
            <SelectItem value="indices">Indices</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table Section */}
      <div className=" rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-foreground/20 ">
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground flex items-center relative">
                  CHALLENGE
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground ">
                  STEPS
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground ">
                  ACCOUNT SIZE
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground ">
                  FEE
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground ">
                  PROFIT TARGET
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground ">
                  PROFIT SPLIT
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground ">
                  LEVERAGE
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground ">
                  MAX LOSS
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground">
                  DAILY LOSS
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-foreground w-10">
                  {/* Empty header for chevron */}
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="px-4 py-8 text-center text-foreground">Loading...</td>
                </tr>
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
                    <td className="px-4 py-4 text-sm text-green-500">
                      {program.profitTarget}%
                    </td>
                    <td className="px-4 py-4 text-sm text-green-500">
                      {program.profitSplit}%
                    </td>
                    <td className="px-4 py-4 text-sm text-foreground">
                      {program.leverage}
                    </td>
                    <td className="px-4 py-4 text-sm text-red-500">
                      {program.maxLoss}%
                    </td>
                    <td className="px-4 py-4 text-sm text-red-500">
                      {program.dailyLoss}%
                    </td>
                    <td className="px-4 py-4 text-center">
                      <ChevronRight className="w-5 h-5 text-primary cursor-pointer hover:opacity-80" />
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
          className="w-full max-w-[320px] md:max-w-[575px] overflow-y-auto text-white border-none bg-card"
        >
          {selectedChallenge && (
            <div className="space-y-6">
              <SheetHeader>
                <SheetTitle className="text-2xl font-bold text-foreground">
                  {selectedChallenge.name}
                </SheetTitle>
                <SheetDescription className="text-foreground/60">
                  Challenge Details
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-4 px-4 pb-8">
                {/* Basic Information */}
                <div className="space-y-3 mt-8 border-b border-foreground/20 pb-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-foreground/60">Type</p>
                      <p className="text-foreground font-medium">{selectedChallenge.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Evaluation Phases</p>
                      <p className="text-foreground font-medium">{selectedChallenge.evaluationPhases}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Leverage</p>
                      <p className="text-foreground font-medium">{selectedChallenge.leverage}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Profit Split</p>
                      <p className="text-green-500 font-medium">{selectedChallenge.profitSplit}%</p>
                    </div>
                  </div>
                </div>

                {/* Profit Targets */}
                <div className="space-y-3 mt-8 border-b border-foreground/20 pb-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Profit Targets
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-foreground/60">Profit Target</p>
                      <p className="text-green-500 font-medium">{selectedChallenge.profitTarget}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Max Loss</p>
                      <p className="text-red-500 font-medium">{selectedChallenge.maxLoss}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Daily Loss</p>
                      <p className="text-red-500 font-medium">{selectedChallenge.dailyLoss}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Max Loss Type</p>
                      <p className="text-foreground font-medium">{selectedChallenge.maxLossType}</p>
                    </div>
                  </div>
                </div>

                {/* Evaluation Steps */}
                {selectedChallenge.evaluationSteps && selectedChallenge.evaluationSteps.length > 0 && (
                  <div className="space-y-3 mt-8 border-b border-foreground/20 pb-8">
                    <h3 className="text-lg font-semibold text-foreground">
                      Evaluation Steps
                    </h3>
                    <div className="space-y-3 mt-4">
                      {selectedChallenge.evaluationSteps.map((step, idx) => (
                        <div key={step.stepNumber || idx} className="p-3 bg-foreground/5 rounded-lg">
                          <p className="font-medium text-foreground mb-2">Step {step.stepNumber}</p>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <p className="text-foreground/60">Profit Target</p>
                              <p className="text-green-500">{step.profitTarget}%</p>
                            </div>
                            <div>
                              <p className="text-foreground/60">Max Loss</p>
                              <p className="text-red-500">{step.maxLoss}%</p>
                            </div>
                            <div>
                              <p className="text-foreground/60">Daily Loss</p>
                              <p className="text-red-500">{step.dailyLoss}%</p>
                            </div>
                            <div>
                              <p className="text-foreground/60">Min Trading Days</p>
                              <p className="text-foreground">{step.minTradingDays}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Account Sizes */}
                {selectedChallenge.accountSizes && selectedChallenge.accountSizes.length > 0 && (
                  <div className="space-y-3 mt-8 border-b border-foreground/20 pb-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      Account Sizes
                    </h3>
                    <div className="space-y-2">
                      {selectedChallenge.accountSizes.map((size, idx) => (
                        <div key={size.size || idx} className="flex justify-between items-center p-2 bg-foreground/5 rounded">
                          <span className="text-primary font-medium">${size.size.toLocaleString()}</span>
                          <span className="text-red-500">${size.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trading Rules */}
                <div className="space-y-3 mt-8 border-b border-foreground/20 pb-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Trading Rules
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${selectedChallenge.stopLossRequired ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span className="text-sm text-foreground">Stop Loss Required</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${selectedChallenge.eaAllowed ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span className="text-sm text-foreground">EA Allowed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${selectedChallenge.weekendHolding ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span className="text-sm text-foreground">Weekend Holding</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${selectedChallenge.overnightHolding ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span className="text-sm text-foreground">Overnight Holding</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${selectedChallenge.newsTrading ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span className="text-sm text-foreground">News Trading</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${selectedChallenge.copyTrading ? 'bg-green-500' : 'bg-red-500'}`}></span>
                      <span className="text-sm text-foreground">Copy Trading</span>
                    </div>
                  </div>
                </div>

                {/* Payout Information */}
                <div className="space-y-3 mt-8 border-b border-foreground/20 pb-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Payout Information
                  </h3>
                  <div className="space-y-2">
                    {selectedChallenge.payoutFrequency && selectedChallenge.payoutFrequency.length > 0 && (
                      <div>
                        <p className="text-sm text-foreground/60 mb-2">Payout Frequency</p>
                        {selectedChallenge.payoutFrequency.map((freq, idx) => (
                          <div key={freq.label || idx} className="flex justify-between items-center p-2 bg-foreground/5 rounded mb-1">
                            <span className="text-foreground">{freq.label}</span>
                            <span className="text-green-500 font-medium">{freq.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {selectedChallenge.payoutMethods && selectedChallenge.payoutMethods.length > 0 && (
                      <div>
                        <p className="text-sm text-foreground/60 mb-2">Payout Methods</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedChallenge.payoutMethods.map((method) => (
                            <span key={method} className="px-3 py-1 bg-foreground/10 rounded text-sm text-foreground">
                              {method}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Time Limits */}
                <div className="space-y-3 mt-8">
                  <h3 className="text-lg font-semibold text-foreground ">
                    Time Limits
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-foreground/60">Time Limit</p>
                      <p className="text-foreground font-medium">{selectedChallenge.timeLimit} days</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Min Trading Days</p>
                      <p className="text-foreground font-medium">{selectedChallenge.minTradingDays} days</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Drawdown Reset</p>
                      <p className="text-foreground font-medium">{selectedChallenge.drawdownResetType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-foreground/60">Refund Fee</p>
                      <p className={selectedChallenge.refundFee ? 'text-green-500 font-medium' : 'text-red-500 font-medium'}>
                        {selectedChallenge.refundFee ? 'Yes' : 'No'}
                      </p>
                    </div>
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
