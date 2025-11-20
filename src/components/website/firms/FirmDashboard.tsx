"use client"
import React, { useState } from 'react'
import { 
  TrendingUp, 
  CreditCard, 
  Coins, 
  Building2, 
  Globe
} from 'lucide-react'
import { IFundingFirm } from '@/models/FirmDetails'

interface FirmDashboardProps {
  firmData?: IFundingFirm | null
}

const FirmDashboard: React.FC<FirmDashboardProps> = ({ firmData }) => {
  const [showMoreCountries, setShowMoreCountries] = useState(false)
  const [showMoreLanguages, setShowMoreLanguages] = useState(false)

  if (!firmData) {
    return <div className="text-foreground">Loading...</div>
  }

  const restrictedCountries = firmData.compliance?.restrictedCountries || []
  const languagesSupported = firmData.firmDetails?.languagesSupported || []
  const displayCountries = showMoreCountries ? restrictedCountries : restrictedCountries.slice(0, 3)
  const displayLanguages = showMoreLanguages ? languagesSupported : languagesSupported.slice(0, 4)

  // Platform icons mapping
  const platformIcons: Record<string, React.ReactNode> = {
    'cTrader': <span className="text-red-500 font-bold text-sm">C</span>,
    'Match Trader': <span className="text-yellow-500">★</span>,
    'MT5': <span className="text-green-500">▲</span>,
    'MT4': <span className="text-blue-500">▲</span>
  }

  // Payment method icons
  const paymentIcons: Record<string, React.ReactNode> = {
    'Credit/Debit Card': <CreditCard className="w-4 h-4" />,
    'Debit/credit card': <CreditCard className="w-4 h-4" />,
    'Crypto': <Coins className="w-4 h-4" />,
    'Cryptocurrencies': <Coins className="w-4 h-4" />,
    'Korapay': <span className="text-blue-500 font-bold text-sm">K</span>,
    'Skrill': <span className="text-purple-500 font-bold text-sm">S</span>
  }

  // Get platforms - check if tradingInfrastructure exists, otherwise use default
  // Note: tradingInfrastructure may not be in IFundingFirm interface but could be in data
  const platforms = (firmData as IFundingFirm & { tradingInfrastructure?: { tradingPlatforms?: string[] } }).tradingInfrastructure?.tradingPlatforms || ['cTrader', 'Match Trader', 'MT5']
  
  // Format payment methods from data
  const paymentMethods = firmData.payments?.methods || []
  const payoutMethods = firmData.payments?.payoutMethods || []
  
  // Map payment methods to display format and get icon
  const getPaymentMethodDisplay = (method: string) => {
    const lowerMethod = method.toLowerCase()
    if (lowerMethod.includes('card') || lowerMethod.includes('debit') || lowerMethod.includes('credit')) {
      return { display: 'Credit/Debit Card', icon: paymentIcons['Credit/Debit Card'] }
    }
    if (lowerMethod.includes('crypto')) {
      return { display: 'Crypto', icon: paymentIcons['Crypto'] }
    }
    if (lowerMethod.includes('skrill')) {
      return { display: 'Skrill', icon: paymentIcons['Skrill'] || <CreditCard className="w-4 h-4" /> }
    }
    if (lowerMethod.includes('bank') || lowerMethod.includes('wire')) {
      return { display: method, icon: <Building2 className="w-4 h-4" /> }
    }
    return { display: method, icon: <CreditCard className="w-4 h-4" /> }
  }

  // Get broker/liquidity provider
  const broker = firmData.firmDetails?.liquidityProviders?.[0] || 
                 firmData.firmDetails?.brokers?.[0] || 
                 'Datafeed Provider'

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Left Panel - Company Information */}
      <div className="border border-border rounded-lg p-6 bg-card space-y-4">
        <div>
          <p className="text-xs text-foreground/60 mb-1">Legal Name</p>
          <p className="text-foreground font-medium">{firmData.firmDetails?.legalEntityName || firmData.firmDetails?.name}</p>
        </div>
        
        <div>
          <p className="text-xs text-foreground/60 mb-1">Registration Number</p>
          <p className="text-foreground font-medium">{firmData.firmDetails?.registrationNumber || 'N/A'}</p>
        </div>
        
        <div>
          <p className="text-xs text-foreground/60 mb-1">License Number</p>
          <p className="text-foreground font-medium">{firmData.firmDetails?.licenseNumber || 'N/A'}</p>
        </div>
        
        <div>
          <p className="text-xs text-foreground/60 mb-1">Regulator</p>
          <p className="text-foreground font-medium">{firmData.firmDetails?.regulator || 'N/A'}</p>
        </div>
        
        <div>
          <p className="text-xs text-foreground/60 mb-1">HeadQuarters</p>
          <a 
            href={`https://maps.google.com/?q=${encodeURIComponent(firmData.firmDetails?.hqAddress || '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground font-medium underline hover:text-primary transition-colors"
          >
            {firmData.firmDetails?.hqAddress || 'N/A'}
          </a>
        </div>
        
        <div>
          <p className="text-xs text-foreground/60 mb-1">Year Founded</p>
          <p className="text-foreground font-medium">{firmData.firmDetails?.yearFounded || 'N/A'}</p>
        </div>
        
        <div>
          <p className="text-xs text-foreground/60 mb-1">Company Description</p>
          <p className="text-foreground text-sm leading-relaxed line-clamp-4">
            {firmData.firmDetails?.companyDescription || 'No description available.'}
          </p>
        </div>
      </div>

      {/* Right Panel - Operational Information */}
      <div className="border border-border rounded-lg p-6 bg-card space-y-6">
        {/* Broker */}
        <div>
          <p className="text-xs text-foreground/60 mb-2">Broker</p>
          <div className="flex items-center gap-2">
            <span className="px-5 py-1.5 bg-foreground/5 rounded-full text-sm text-foreground flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-foreground/60" />
              {broker}
            </span>
          </div>
        </div>

        {/* Platform */}
        <div>
          <p className="text-xs text-foreground/60 mb-2">Platform</p>
          <div className="flex flex-wrap gap-2">
            {platforms.map((platform: string) => (
              <div key={platform} className="flex items-center gap-2 px-5 py-1.5 bg-foreground/5 rounded-full">
                {platformIcons[platform] || <span className="text-foreground/60 text-sm">●</span>}
                <span className="text-sm text-foreground">{platform}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div>
          <p className="text-xs text-foreground/60 mb-2">Payment Methods</p>
          <div className="flex flex-wrap gap-2">
            {paymentMethods.slice(0, 3).map((method, idx) => {
              const { display, icon } = getPaymentMethodDisplay(method)
              return (
                <div key={idx} className="flex items-center gap-2 px-5 py-1.5 bg-foreground/5 rounded-full">
                  {icon}
                  <span className="text-sm text-foreground">{display}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Payout Methods */}
        <div>
          <p className="text-xs text-foreground/60 mb-2">Payout Methods</p>
          <div className="flex flex-wrap gap-2">
            {payoutMethods.slice(0, 3).map((method, idx) => {
              const { display, icon } = getPaymentMethodDisplay(method)
              const isBank = method.toLowerCase().includes('bank') || method.toLowerCase().includes('wire')
              return (
                <div key={idx} className="flex items-center gap-2 px-5 py-1.5 bg-foreground/5 rounded-full">
                  {isBank ? <Building2 className="w-4 h-4" /> : icon}
                  <span className="text-sm text-foreground">
                    {isBank ? 'Bank Transfer' : display}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Restricted Countries */}
        <div>
          <p className="text-xs text-foreground/60 mb-2">Restricted Countries</p>
          <div className="flex flex-wrap gap-2">
            {displayCountries.map((country, idx) => (
              <div key={idx} className="flex items-center gap-2 px-5 py-1.5 bg-foreground/5 rounded-full">
                <Globe className="w-4 h-4 text-foreground/60" />
                <span className="text-sm text-foreground">{country}</span>
              </div>
            ))}
            {restrictedCountries.length > 3 && (
              <button
                onClick={() => setShowMoreCountries(!showMoreCountries)}
                className="px-3 py-1.5 bg-foreground/5 rounded-full text-sm  hover:bg-foreground/20 transition-colors text-primary"
              >
                View more...
              </button>
            )}
          </div>
        </div>

        {/* Language Supported */}
        <div>
          <p className="text-xs text-foreground/60 mb-2">Language Supported</p>
          <div className="flex flex-wrap gap-2">
            {displayLanguages.map((language, idx) => (
              <span 
                key={idx} 
                className="px-5 py-1.5 bg-foreground/5 text-primary rounded-full text-sm font-medium"
              >
                {language}
              </span>
            ))}
            {languagesSupported.length > 4 && (
              <button
                onClick={() => setShowMoreLanguages(!showMoreLanguages)}
                className="px-3 py-1.5 bg-foreground/5 rounded-full text-sm hover:bg-foreground/20 transition-colors text-primary"
              >
                View more...
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FirmDashboard
