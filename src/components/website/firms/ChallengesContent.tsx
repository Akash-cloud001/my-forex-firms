"use client"
import React, { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChevronRight } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'

interface ChallengeDetail {
  _id: string
  propFirmId: string
  type: string
  name: string
  evaluationPhases: number
  evaluationSteps: Array<{
    stepNumber: number
    profitTarget: string
    maxLoss: string
    dailyLoss: string
    minTradingDays: number
    _id: string
  }>
  accountSizes: Array<{
    size: number
    price: number
    _id: string
  }>
  profitSplit: string
  payoutFrequency: Array<{
    label: string
    percentage: string
    _id: string
  }>
  leverage: string
  stopLossRequired: boolean
  eaAllowed: boolean
  weekendHolding: boolean
  overnightHolding: boolean
  newsTrading: boolean
  copyTrading: boolean
  refundFee: boolean
  payoutMethods: string[]
  profitTarget: string
  dailyLoss: string
  maxLoss: string
  maxLossType: string
  timeLimit: string
  drawdownResetType: string
  minTradingDays: number
  createdAt: string
  updatedAt: string
}

const ChallengesContent = () => {
  const [selectedSteps, setSelectedSteps] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [selectedAssets, setSelectedAssets] = useState<string>('')
  const [selectedChallenge, setSelectedChallenge] = useState<ChallengeDetail | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // Sample data - in real app, this would come from props or API
  const challenges = [
    {
      challenge: 'Alpha Pro 10%',
      steps: '2-Step',
      accountSize: '$5000',
      fee: '$50',
      profitTarget: '10%',
      profitSplit: '80%',
      leverage: '1:100',
      maxLoss: '10%',
      dailyLoss: '5%'
    },
    {
      challenge: 'Alpha Pro 10%',
      steps: '2-Step',
      accountSize: '$5000',
      fee: '$50',
      profitTarget: '10%',
      profitSplit: '80%',
      leverage: '1:100',
      maxLoss: '10%',
      dailyLoss: '5%'
    },
    {
      challenge: 'Alpha Pro 10%',
      steps: '2-Step',
      accountSize: '$5000',
      fee: '$50',
      profitTarget: '10%',
      profitSplit: '80%',
      leverage: '1:100',
      maxLoss: '10%',
      dailyLoss: '5%'
    },
    {
      challenge: 'Alpha Pro 10%',
      steps: '2-Step',
      accountSize: '$5000',
      fee: '$50',
      profitTarget: '10%',
      profitSplit: '80%',
      leverage: '1:100',
      maxLoss: '10%',
      dailyLoss: '5%'
    },
    {
      challenge: 'Alpha Pro 10%',
      steps: '2-Step',
      accountSize: '$5000',
      fee: '$50',
      profitTarget: '10%',
      profitSplit: '80%',
      leverage: '1:100',
      maxLoss: '10%',
      dailyLoss: '5%'
    },
    {
      challenge: 'Alpha Pro 10%',
      steps: '2-Step',
      accountSize: '$5000',
      fee: '$50',
      profitTarget: '10%',
      profitSplit: '80%',
      leverage: '1:100',
      maxLoss: '10%',
      dailyLoss: '5%'
    },
    {
      challenge: 'Alpha Pro 10%',
      steps: '2-Step',
      accountSize: '$5000',
      fee: '$50',
      profitTarget: '10%',
      profitSplit: '80%',
      leverage: '1:100',
      maxLoss: '10%',
      dailyLoss: '5%'
    },
    {
      challenge: 'Alpha Pro 10%',
      steps: '2-Step',
      accountSize: '$5000',
      fee: '$50',
      profitTarget: '10%',
      profitSplit: '80%',
      leverage: '1:100',
      maxLoss: '10%',
      dailyLoss: '5%'
    },
    {
      challenge: 'Alpha Pro 10%',
      steps: '2-Step',
      accountSize: '$5000',
      fee: '$50',
      profitTarget: '10%',
      profitSplit: '80%',
      leverage: '1:100',
      maxLoss: '10%',
      dailyLoss: '5%'
    },
    {
      challenge: 'Alpha Pro 10%',
      steps: '2-Step',
      accountSize: '$5000',
      fee: '$50',
      profitTarget: '10%',
      profitSplit: '80%',
      leverage: '1:100',
      maxLoss: '10%',
      dailyLoss: '5%'
    }
  ]

  return (
    <div className="w-full border border-border p-8 rounded-lg card-custom-grad">
      {/* Filter Section */}
      <div className="flex gap-4 mb-6">
        <Select value={selectedSteps} onValueChange={setSelectedSteps}>
          <SelectTrigger className="w-[180px] !bg-white/10 !text-white">
            <SelectValue placeholder="Steps: Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="1-step">1-Step</SelectItem>
            <SelectItem value="2-step">2-Step</SelectItem>
          </SelectContent>
        </Select>

        <Select value={selectedSize} onValueChange={setSelectedSize}>
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
              {challenges.map((challenge, index) => (
                <tr 
                  key={index} 
                  className="border-b border-foreground/20 last:border-b-0 hover:bg-foreground/5 transition-colors cursor-pointer"
                  onClick={() => {
                    // In real app, fetch challenge details by ID
                    // For now, using sample data structure
                    const sampleChallenge: ChallengeDetail = {
                      _id: `challenge-${index}`,
                      propFirmId: '690cbdca770e44adfbaddd4a',
                      type: challenge.steps,
                      name: challenge.challenge,
                      evaluationPhases: 2,
                      evaluationSteps: [
                        {
                          stepNumber: 1,
                          profitTarget: challenge.profitTarget.replace('%', ''),
                          maxLoss: challenge.maxLoss.replace('%', ''),
                          dailyLoss: challenge.dailyLoss.replace('%', ''),
                          minTradingDays: 7,
                          _id: `step-${index}`
                        }
                      ],
                      accountSizes: [
                        {
                          size: parseInt(challenge.accountSize.replace('$', '').replace(',', '')),
                          price: parseInt(challenge.fee.replace('$', '')),
                          _id: `size-${index}`
                        }
                      ],
                      profitSplit: challenge.profitSplit.replace('%', ''),
                      payoutFrequency: [
                        { label: 'Bi-weekly', percentage: '80', _id: 'freq-1' },
                        { label: 'Monthly', percentage: '90', _id: 'freq-2' }
                      ],
                      leverage: challenge.leverage,
                      stopLossRequired: true,
                      eaAllowed: true,
                      weekendHolding: true,
                      overnightHolding: true,
                      newsTrading: true,
                      copyTrading: false,
                      refundFee: false,
                      payoutMethods: ['Paypal', 'UPI'],
                      profitTarget: challenge.profitTarget.replace('%', ''),
                      dailyLoss: challenge.dailyLoss.replace('%', ''),
                      maxLoss: challenge.maxLoss.replace('%', ''),
                      maxLossType: 'Static',
                      timeLimit: '30',
                      drawdownResetType: 'Daily',
                      minTradingDays: 5,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString()
                    }
                    setSelectedChallenge(sampleChallenge)
                    setIsDrawerOpen(true)
                  }}
                >
                  <td className="px-4 py-4 text-sm text-foreground">
                    {challenge.challenge}
                  </td>
                  <td className="px-4 py-4 text-sm text-foreground">
                    {challenge.steps}
                  </td>
                  <td className="px-4 py-4 text-sm text-primary">
                    {challenge.accountSize}
                  </td>
                  <td className="px-4 py-4 text-sm text-red-500">
                    {challenge.fee}
                  </td>
                  <td className="px-4 py-4 text-sm text-green-500">
                    {challenge.profitTarget}
                  </td>
                  <td className="px-4 py-4 text-sm text-green-500">
                    {challenge.profitSplit}
                  </td>
                  <td className="px-4 py-4 text-sm text-foreground">
                    {challenge.leverage}
                  </td>
                  <td className="px-4 py-4 text-sm text-red-500">
                    {challenge.maxLoss}
                  </td>
                  <td className="px-4 py-4 text-sm text-red-500">
                    {challenge.dailyLoss}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <ChevronRight className="w-5 h-5 text-primary cursor-pointer hover:opacity-80" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
                      {selectedChallenge.evaluationSteps.map((step) => (
                        <div key={step._id} className="p-3 bg-foreground/5 rounded-lg">
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
                      {selectedChallenge.accountSizes.map((size) => (
                        <div key={size._id} className="flex justify-between items-center p-2 bg-foreground/5 rounded">
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
                        {selectedChallenge.payoutFrequency.map((freq) => (
                          <div key={freq._id} className="flex justify-between items-center p-2 bg-foreground/5 rounded mb-1">
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
