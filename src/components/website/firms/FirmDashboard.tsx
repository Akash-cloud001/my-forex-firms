"use client"
import React, { useState } from 'react'
import * as Flags from 'country-flag-icons/react/3x2'
import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'

countries.registerLocale(enLocale)
import Image from 'next/image'
import {
  CreditCard,
  Globe,
  ChartLine
} from 'lucide-react'
import { IFundingFirm } from '@/models/FirmDetails'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import Link from 'next/link'
import {
  FacebookIcon,
  RedditIcon,
  TwitterIcon,
  LinkedInIcon,
  InstagramIcon,
  DiscordIcon,
  TelegramIcon,
  YoutubeIcon
} from '@/components/svgs'

interface FirmDashboardProps {
  firmData?: IFundingFirm | null
}

const FirmDashboard: React.FC<FirmDashboardProps> = ({ firmData }) => {
  const [isCountriesModalOpen, setIsCountriesModalOpen] = useState(false)
  const [isLanguagesModalOpen, setIsLanguagesModalOpen] = useState(false)
  const [isDescriptionModalOpen, setIsDescriptionModalOpen] = useState(false)

  if (!firmData) {
    return <div className="text-foreground">Loading...</div>
  }

  const restrictedCountries = firmData.compliance?.restrictedCountries || []
  const languagesSupported = firmData.firmDetails?.languagesSupported || []
  const displayCountries = restrictedCountries.slice(0, 3)
  const displayLanguages = languagesSupported.slice(0, 4)

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

  // Map payment method names to SVG file paths
  const getPaymentSvgPath = (methodName: string): string | null => {
    const normalized = methodName.toLowerCase().replace(/\s+/g, '')

    const paymentMap: Record<string, string> = {
      'credit': '/website/payments/credit.svg',
      'debit': '/website/payments/credit.svg',
      'card': '/website/payments/credit.svg',
      'creditcard': '/website/payments/credit.svg',
      'debitcard': '/website/payments/credit.svg',
      'credit/debitcard': '/website/payments/credit.svg',
      'debit/creditcard': '/website/payments/credit.svg',
      'crypto': '/website/payments/crypto.svg',
      'cryptocurrency': '/website/payments/crypto.svg',
      'cryptocurrencies': '/website/payments/crypto.svg',
      'bank': '/website/payments/bank.svg',
      'banktransfer': '/website/payments/bank.svg',
      'bank transfer': '/website/payments/bank.svg',
      'wire': '/website/payments/bank.svg',
      'wiretransfer': '/website/payments/bank.svg',
      'wire transfer': '/website/payments/bank.svg',
      'korapay': '/website/payments/korapay.svg',
      'riseworks': '/website/payments/riseworks.svg',
      'rise works': '/website/payments/riseworks.svg',
    }

    return paymentMap[normalized] || null
  }

  // Get platforms - check if tradingInfrastructure exists, otherwise use default
  // Note: tradingInfrastructure may not be in IFundingFirm interface but could be in data
  const platforms = (firmData as IFundingFirm & { tradingInfrastructure?: { tradingPlatforms?: string[] } }).tradingInfrastructure?.tradingPlatforms || ['cTrader', 'Match Trader', 'MT5']

  // Format payment methods from data
  const paymentMethods = firmData.payments?.methods || []
  const payoutMethods = firmData.payments?.payoutMethods || []

  // Map payment methods to display format and get SVG path
  const getPaymentMethodDisplay = (method: string) => {
    const lowerMethod = method.toLowerCase()
    let display = method

    // Normalize display names
    if (lowerMethod.includes('card') || lowerMethod.includes('debit') || lowerMethod.includes('credit')) {
      display = 'Credit/Debit Card'
    } else if (lowerMethod.includes('crypto')) {
      display = 'Crypto'
    } else if (lowerMethod.includes('bank') || lowerMethod.includes('wire')) {
      display = 'Bank Transfer'
    }

    const svgPath = getPaymentSvgPath(method)
    return { display, svgPath }
  }

  const getCountryCode = (name: string) => {
    // Try to get alpha-2 code from name
    const code = countries.getAlpha2Code(name, 'en')
    return code
  }

  const renderFlag = (countryName: string) => {
    const code = getCountryCode(countryName)
    if (code && code in Flags) {
      const FlagComponent = Flags[code as keyof typeof Flags]
      return <FlagComponent className="w-4 h-4 " />
    }
    return <Globe className="w-4 h-4 text-foreground/60" />
  }

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Left Panel - Company Information */}
      <div className="border border-border rounded-lg p-6 card-custom-grad space-y-4">
        {(firmData.firmDetails?.legalEntityName || firmData.firmDetails?.name) && <div>
          <p className="text-xs text-foreground/60 mb-1">Legal Name</p>
          <p className="text-foreground font-medium">{firmData.firmDetails?.legalEntityName || firmData.firmDetails?.name}</p>
        </div>}

        {firmData.firmDetails?.registrationNumber && <div>
          <p className="text-xs text-foreground/60 mb-1">Registration Number</p>
          <p className="text-foreground font-medium">{firmData.firmDetails?.registrationNumber || 'N/A'}</p>
        </div>}

        {firmData.firmDetails?.licenseNumber && <div>
          <p className="text-xs text-foreground/60 mb-1">License Number</p>
          <p className="text-foreground font-medium">{firmData.firmDetails?.licenseNumber || 'N/A'}</p>
        </div>}

        {firmData.firmDetails?.regulator && <div>
          <p className="text-xs text-foreground/60 mb-1">Regulator</p>
          <p className="text-foreground font-medium">{firmData.firmDetails?.regulator || 'N/A'}</p>
        </div>}

        {firmData.firmDetails?.hqAddress && <div>
          <p className="text-xs text-foreground/60 mb-1">HeadQuarters</p>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(firmData.firmDetails?.hqAddress || '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground font-medium underline hover:text-primary transition-colors"
          >
            {firmData.firmDetails?.hqAddress || 'N/A'}
          </a>
        </div>}

        {firmData.firmDetails?.yearFounded && <div>
          <p className="text-xs text-foreground/60 mb-1">Year Founded</p>
          <p className="text-foreground font-medium">{firmData.firmDetails?.yearFounded || 'N/A'}</p>
        </div>}

        {firmData.firmDetails?.companyDescription && <div>
          <p className="text-xs text-foreground/60 mb-1">Company Description</p>
          <div 
            className="cursor-pointer hover:bg-foreground/5 p-2 rounded-lg transition-colors"
            onClick={() => setIsDescriptionModalOpen(true)}
          >
            <p className="text-foreground text-sm leading-relaxed line-clamp-3">
              {firmData.firmDetails?.companyDescription || 'No description available.'}
            </p>
            <p className="text-primary text-xs mt-1 hover:underline">Click to read more...</p>
          </div>
        </div>}
      </div>

      {/* Right Panel - Operational Information */}
      <div className="border border-border rounded-lg p-6 card-custom-grad space-y-6">
        {/* Broker */}
        {firmData?.firmDetails?.brokers && firmData?.firmDetails?.brokers?.length > 0 && <div>
          <p className="text-xs text-foreground/60 mb-2">Broker</p>
          <div className="flex items-center gap-2">
            {firmData?.firmDetails?.brokers?.map((broker: string, idx: number) => (
              <span key={idx} className="px-5 py-1.5 bg-foreground/5 rounded-full text-sm text-foreground flex items-center gap-2">
                <ChartLine className="w-4 h-4 text-primary" />
                {broker}
              </span>
            ))}
          </div>
        </div>}

        {/* Platform */}
        {platforms && platforms.length > 0 && <div>
          <p className="text-xs text-foreground/60 mb-2">Platform</p>
          <div className="flex flex-wrap gap-2">
            {platforms.map((platform: string) => {
              const svgPath = getPlatformSvgPath(platform)
              return (
                <div key={platform} className="flex items-center gap-2 px-5 py-1.5 bg-foreground/5 rounded-full">
                  {svgPath ? (
                    <div className="relative w-4 h-4">
                      <Image
                        src={svgPath}
                        alt={platform}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <span className="text-foreground/60 text-sm">●</span>
                  )}
                  <span className="text-sm text-foreground">{platform}</span>
                </div>
              )
            })}
          </div>
        </div>}

        {/* Payment Methods */}
        {firmData?.payments?.methods && firmData?.payments?.methods?.length > 0 && <div>
          <p className="text-xs text-foreground/60 mb-2">Payment Methods</p>
          <div className="flex flex-wrap gap-2">
            {paymentMethods.slice(0, 3).map((method, idx) => {
              const { display, svgPath } = getPaymentMethodDisplay(method)
              return (
                <div key={idx} className="flex items-center gap-2 px-5 py-1.5 bg-foreground/5 rounded-full">
                  {svgPath ? (
                    <div className="relative w-4 h-4">
                      <Image
                        src={svgPath}
                        alt={display}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <CreditCard className="w-4 h-4 text-foreground/60" />
                  )}
                  <span className="text-sm text-foreground">{display}</span>
                </div>
              )
            })}
          </div>
        </div>}

        {/* Payout Methods */}
        {payoutMethods && payoutMethods.length > 0 && <div>
          <p className="text-xs text-foreground/60 mb-2">Payout Methods</p>
          <div className="flex flex-wrap gap-2">
            {payoutMethods.slice(0, 3).map((method, idx) => {
              const { display, svgPath } = getPaymentMethodDisplay(method)
              return (
                <div key={idx} className="flex items-center gap-2 px-5 py-1.5 bg-foreground/5 rounded-full">
                  {svgPath ? (
                    <div className="relative w-4 h-4">
                      <Image
                        src={svgPath}
                        alt={display}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <CreditCard className="w-4 h-4 text-foreground/60" />
                  )}
                  <span className="text-sm text-foreground">{display}</span>
                </div>
              )
            })}
          </div>
        </div>}





        {/* Restricted Countries */}
        {restrictedCountries.length > 0 && <div>
          <p className="text-xs text-foreground/60 mb-2">Restricted Countries</p>
          <div className="flex flex-wrap gap-2">
            {displayCountries.map((country, idx) => (
              <div key={idx} className="flex items-center gap-2 px-5 py-1.5 bg-foreground/5 rounded-full">
                {renderFlag(country)}
                <span className="text-sm text-foreground">{country}</span>
              </div>
            ))}
            {restrictedCountries.length > 3 && (
              <button
                onClick={() => setIsCountriesModalOpen(true)}
                className="px-3 py-1.5 bg-foreground/5 rounded-full text-sm  hover:bg-foreground/20 transition-colors text-primary"
              >
                View more...
              </button>
            )}
          </div>
        </div>}

        {/* Restricted Countries Modal */}
        <Dialog open={isCountriesModalOpen} onOpenChange={setIsCountriesModalOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground">Restricted Countries</DialogTitle>
              <DialogDescription className="text-foreground/70">
                The following countries are restricted from using this firm&apos;s services.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {restrictedCountries.map((country, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-4 py-2 bg-foreground/5 rounded-full border border-border hover:bg-foreground/10 transition-colors"
                  >
                    {renderFlag(country)}
                    <span className="text-sm text-foreground font-medium">{country}</span>
                  </div>
                ))}
              </div>
              {restrictedCountries.length === 0 && (
                <p className="text-sm text-foreground/60 text-center py-8">
                  No restricted countries listed.
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Language Supported */}
        {languagesSupported.length > 0 && <div>
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
                onClick={() => setIsLanguagesModalOpen(true)}
                className="px-3 py-1.5 bg-foreground/5 rounded-full text-sm hover:bg-foreground/20 transition-colors text-primary"
              >
                View more...
              </button>
            )}
          </div>
        </div>}

        {/* Supported Languages Modal */}
        <Dialog open={isLanguagesModalOpen} onOpenChange={setIsLanguagesModalOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground">Supported Languages</DialogTitle>
              <DialogDescription className="text-foreground/70">
                The following languages are supported by this firm.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {languagesSupported.map((language, idx) => (
                  <span
                    key={idx}
                    className="px-4 py-2 bg-foreground/5 text-primary rounded-full border border-border hover:bg-foreground/10 transition-colors text-sm font-medium"
                  >
                    {language}
                  </span>
                ))}
              </div>
              {languagesSupported.length === 0 && (
                <p className="text-sm text-foreground/60 text-center py-8">
                  No supported languages listed.
                </p>
              )}
            </div>
          </DialogContent>
        </Dialog>

{/* Socials Available Section */}
        {firmData?.socialLinks?.socialLinks && Object.entries(firmData.socialLinks.socialLinks).length > 0 && (() => {
            const socialEntries = Object.entries(firmData.socialLinks.socialLinks).filter((entry) => {
              const url = entry[1];
              return url && typeof url === 'string' && url.trim();
            });
            
            if (socialEntries.length === 0) return null;

            // Normalize platform name for matching (lowercase, trim, handle variations)
            const normalizePlatform = (platform: string): string => {
              return platform.trim().toLowerCase().replace(/[\/\s]/g, '');
            };

            // Map platform names to icon components (case-insensitive)
            const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
              'facebook': FacebookIcon,
              'instagram': InstagramIcon,
              'x': TwitterIcon,
              'twitter': TwitterIcon,
              'xtwitter': TwitterIcon,
              'linkedin': LinkedInIcon,
              'reddit': RedditIcon,
              'discord': DiscordIcon,
              'telegram': TelegramIcon,
              'youtube': YoutubeIcon,
              'youtubechannel': YoutubeIcon,
            };

            return (
              <div className="">
                <p className="text-xs text-foreground/60 mb-2">Socials Available</p>
                <div className="flex items-start justify-start gap-4 ">
                  {socialEntries.map(([platform, url]) => {
                    const normalizedPlatform = normalizePlatform(platform);
                    const IconComponent = iconMap[normalizedPlatform];
                    
                    if (!IconComponent) {
                      // Log unmapped platforms for debugging
                      console.warn(`Social icon not found for platform: "${platform}" (normalized: "${normalizedPlatform}")`);
                      return null;
                    }

                    return (
                      <Link
                        key={platform}
                        href={url as string}
                        target='_blank'
                        rel="noopener noreferrer"
                        className="relative h-6 w-6 rounded flex items-center justify-center hover:opacity-80 transition-opacity"
                      >
                        <IconComponent className='w-5 h-5 text-foreground/50' />
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
        })()}

        {/* Company Description Modal */}
        <Dialog open={isDescriptionModalOpen} onOpenChange={setIsDescriptionModalOpen}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground">Company Description</DialogTitle>
              <DialogDescription className="text-foreground/70">
                Full company description for {firmData?.firmDetails?.name || 'this firm'}.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <div className="prose prose-sm max-w-none text-foreground">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {firmData?.firmDetails?.companyDescription || 'No description available.'}
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default FirmDashboard
