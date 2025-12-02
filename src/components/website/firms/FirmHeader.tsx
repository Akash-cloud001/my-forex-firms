"use client"
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Check, X, Globe, LineChart } from 'lucide-react'
import RadarChartComponent from '@/components/ui/RadarChart'
import { IFundingFirm } from '@/models/FirmDetails'
import {
  FacebookIcon,
  RedditIcon,
  TwitterIcon,
  LinkedInIcon,
  InstagramIcon,
  DiscordIcon
} from '@/components/svgs'
import * as Flags from 'country-flag-icons/react/3x2'
import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'
import { useIsMobile } from '@/hooks/use-mobile'

countries.registerLocale(enLocale)
interface RadarChartData {
  subject: string
  A: number
  fullMark: number
}

interface FirmHeaderProps {
  firmData: IFundingFirm | null
  firmId: string
  factor1: RadarChartData[]
  factor2: RadarChartData[]
  factor3: RadarChartData[]
}

const FirmHeader: React.FC<FirmHeaderProps> = ({
  firmData,
  firmId,
  factor1,
  factor2,
  factor3
}) => {
  const isMobile = useIsMobile()
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
  console.log(firmData);
  
  // Responsive chart dimensions
  const chartWidth = isMobile ? 250 : 300
  const chartHeight = isMobile ? 250 : 300
  const chartOuterRadius = isMobile ? 50 : 60
  return (
    <section className='max-w-7xl mx-auto p-4 sm:p-6 md:p-8 card-custom-grad rounded-3xl'>
      {/* Top Section - Responsive Layout */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between w-full gap-4 md:gap-0">
        {/* Mobile: Logo and Name Row */}
        <div className='flex flex-col md:flex-row md:items-center gap-4 w-full md:w-auto'>
          {/* Logo and PTI Index Row */}
          <div className='flex items-center gap-4'>
            <figure className="relative h-20 w-20 sm:h-24 sm:w-24 bg-foreground/10 rounded-[8px] shrink-0">
              <Image
                src={firmData?.firmDetails.image?.url || "/website/firm/imagePlac.png"}
                alt={firmData?.firmDetails.name || ""}
                fill
                className='object-contain scale-70'
              />
            </figure>
            <figure className="h-20 w-20 sm:h-24 sm:w-24 bg-foreground/10 rounded-[8px] relative flex flex-col items-center justify-end pb-2 shrink-0">
              <figure className='absolute h-5 w-6 right-1.5 top-1.5 blur-sm'>
                <Image
                  src="/website/badge/badge1.png"
                  alt="PTI INDEX"
                  fill
                  className='object-contain'
                />
              </figure>
              <span className='text-primary text-2xl sm:text-[32px] font-bold blur-sm'>
                9.5<span className='text-lg sm:text-xl font-light'>/10</span>
              </span>
              <span className='text-base text-foreground/90 text-center flex flex-col items-center justify-center absolute inset-0 z-[2]'>
                <span className='text-primary font-bold text-sm sm:text-base'>PTI INDEX</span> <span className='text-foreground/90 text-[10px] -mt-1'>COMING SOON</span>
              </span>
            </figure>
          </div>

          {/* Firm Name and Stats */}
          <div className='flex flex-col items-start justify-between w-full md:w-fit'>
            <Link
              href={firmData?.firmDetails.officialWebsite || ""}
              target='_blank'
              className='flex items-center gap-2 gradient-text text-2xl sm:text-3xl md:text-[32px] font-semibold capitalize mb-3 md:mb-0'
            >
              {firmData?.firmDetails.name}
              <Image src={"/website/link.svg"} alt="link" width={20} height={20} className="sm:w-6 sm:h-6" />
            </Link>
            
            {/* Stats - Grid on mobile, horizontal on desktop */}
            <div className='font-geist-sans grid grid-cols-2 md:flex md:items-start md:justify-center gap-3 md:gap-4 w-full md:w-auto mt-2 md:mt-0'>
              {firmData?.firmDetails?.jurisdiction && <div className='flex flex-col items-start'>
                <span className='text-xs text-foreground/80'>
                  Jurisdiction
                </span>
                <span className='text-sm md:text-base text-foreground font-medium flex items-center gap-1'>
                  { renderFlag(firmData.firmDetails.jurisdiction)} {firmData?.firmDetails?.jurisdiction || 'N/A'}
                </span>
              </div>}

              {firmData?.firmDetails?.yearFounded && <div className='flex flex-col items-start md:border-l md:border-foreground/20 md:pl-4'>
                <span className='text-xs text-foreground/80'>
                  Years in Operation
                </span>
                <span className='text-sm md:text-base text-foreground font-medium'>
                  {firmData?.firmDetails.yearFounded}
                </span>
              </div>}
              {firmData?.leadership.leadership?.[0]?.name && <div className='flex flex-col items-start md:border-l md:border-foreground/20 md:pl-4'>
                <span className='text-xs text-foreground/80'>
                  CEO
                </span>
                <span className='text-sm md:text-base text-foreground font-medium'>
                  {firmData?.leadership.leadership?.[0]?.name}
                </span>
              </div>}
              {firmData?.firmDetails?.totalPayout && <div className='flex flex-col items-start md:border-l md:border-foreground/20 md:pl-4'>
                <span className='text-xs text-foreground/80'>
                  Total Payout
                </span>
                <span className='text-sm md:text-base text-primary font-bold'>
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(firmData?.firmDetails?.totalPayout))}
                </span>
              </div>}
            </div>
          </div>
        </div>

        {/* Add Complaint Button */}
        <Link
          href={`/post-review?firmId=${firmId}`}
          className='flex items-center justify-center md:justify-start gap-2 px-4 py-2 rounded-full border-gradient text-primary tracking-tight w-full md:w-auto shrink-0'
        >
          <Plus className='w-4 h-4 text-primary' />
          Add Complaint
        </Link>
      </div>
      {/* Charts and Bottom Section - Responsive Layout */}
      <div className='flex flex-col xl:flex-row items-start justify-between gap-6 xl:gap-4 mt-6 xl:mt-0'>
        {/* Charts Section */}
        <div className='flex items-center justify-center xl:items-start xl:justify-start gap-4 opacity-80 relative w-full xl:w-auto'>
          {/* Coming Soon Overlay - Visible on all sizes */}
          <div className='absolute inset-0 z-2 flex items-center justify-center'>
            <p className='text-foreground text-xl sm:text-2xl font-bold text-left flex flex-row items-center justify-center gap-2'>
              <LineChart className='w-10 h-10 sm:w-14 sm:h-14 text-primary' />
              <span>
                Visual Charts <br />Coming Soon
              </span>
            </p>
          </div>
          
          {/* Factor 1 - Hidden below md */}
          <figure className='hidden md:flex flex-col items-center justify-center blur-lg'>
            <RadarChartComponent
              data={factor1}
              width={300}
              height={300}
              outerRadius={60}
              innerRadius={0}
              dataKey="A"
              stroke="#F66435"
              fill="#F66435"
              fillOpacity={0.5}
              name="Mike"
              margin={{ top: 20, left: 20, right: 20, bottom: 20 }}
            />
            <figcaption>
              <h3 className='text-base text-foreground font-semibold -mt-2 uppercase'>
                Factor 1
              </h3>
            </figcaption>
          </figure>

          {/* Factor 2 - Hidden below md */}
          <figure className='hidden md:flex flex-col items-center justify-center blur-lg'>
            <RadarChartComponent
              data={factor2}
              width={300}
              height={300}
              outerRadius={60}
              innerRadius={0}
              dataKey="A"
              stroke="#F66435"
              fill="#F66435"
              fillOpacity={0.5}
              name="Mike"
              margin={{ top: 20, left: 20, right: 20, bottom: 20 }}
            />
            <figcaption>
              <h3 className='text-base text-foreground font-semibold -mt-2 uppercase'>
                Factor 2
              </h3>
            </figcaption>
          </figure>

          {/* Factor 3 - Visible on all sizes with blur */}
          <figure className='flex flex-col items-center justify-center blur-lg'>
            <RadarChartComponent
              data={factor3}
              width={chartWidth}
              height={chartHeight}
              outerRadius={chartOuterRadius}
              innerRadius={0}
              dataKey="A"
              stroke="#F66435"
              fill="#F66435"
              fillOpacity={0.5}
              name="Mike"
              margin={{ top: 20, left: 20, right: 20, bottom: 20 }}
            />
            <figcaption>
              <h3 className='text-base text-foreground font-semibold -mt-2 uppercase'>
                Factor 3
              </h3>
            </figcaption>
          </figure>
        </div>
        {/* Verification and Socials Section */}
        <div className="flex flex-col gap-4 xl:gap-6 w-full xl:w-auto">
          {/* Verified Features Section */}
          <div className="flex flex-col md:flex-row md:justify-between md:items-start xl:flex-col xl:items-start xl:justify-start gap-2 md:gap-3 w-full xl:w-max">
            {firmData?.transparency?.ceoPublic !== null && firmData?.transparency?.ceoPublic !== undefined && (
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 bg-gradient-to-br from-[#F66435] to-[#672611]`}>
                  {firmData.transparency.ceoPublic ? (
                    <Check className="w-3 h-3 text-white" />
                  ) : (
                    <X className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="text-foreground/80 text-sm md:text-sm">CEO Publicly Verified</span>
              </div>
            )}
            {firmData?.transparency?.officeVerified !== null && firmData?.transparency?.officeVerified !== undefined && (
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 bg-gradient-to-br from-[#F66435] to-[#672611]`}>
                  {firmData.transparency.officeVerified ? (
                    <Check className="w-3 h-3 text-white" />
                  ) : (
                    <X className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="text-foreground/80 text-sm md:text-sm">Office Address Verified</span>
              </div>
            )}
            {firmData?.transparency?.termsPublicUpdated !== null && firmData?.transparency?.termsPublicUpdated !== undefined && (
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 bg-gradient-to-br from-[#F66435] to-[#672611]`}>
                  {firmData.transparency.termsPublicUpdated ? (
                    <Check className="w-3 h-3 text-white" />
                  ) : (
                    <X className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="text-foreground/80 text-sm md:text-sm">Terms Publicly Updated</span>
              </div>
            )}
            {firmData?.transparency?.payoutProofPublic !== null && firmData?.transparency?.payoutProofPublic !== undefined && (
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 bg-gradient-to-br from-[#F66435] to-[#672611]`}>
                  {firmData.transparency.payoutProofPublic ? (
                    <Check className="w-3 h-3 text-white" />
                  ) : (
                    <X className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="text-foreground/80 text-sm md:text-sm">Payout Proof Available</span>
              </div>
            )}
            {firmData?.transparency?.thirdPartyAudit !== null && firmData?.transparency?.thirdPartyAudit !== undefined && (
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 bg-gradient-to-br from-[#F66435] to-[#672611] `}>
                  {firmData.transparency.thirdPartyAudit ? (
                    <Check className="w-3 h-3 text-white" />
                  ) : (
                    <X className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="text-foreground/80 text-sm md:text-sm">Third Party Audited</span>
              </div>
            )}
          </div>

          {/* Socials Available Section */}
          {firmData?.socialLinks?.socialLinks && Object.entries(firmData.socialLinks.socialLinks).length > 0 && (
            <div className="sm:border sm:border-border rounded-lg sm:px-6 sm:py-3 md:px-6 md:py-4 w-max">
              <h3 className="text-foreground/80 text-sm mb-2 text-center font-medium">Socials Available</h3>
              <div className="flex items-start justify-start gap-3">
                {Object.entries(firmData.socialLinks.socialLinks).map(([platform, url]) => {
                  if (!url) return null;

                  // Map platform names to icon components
                  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
                    'Facebook': FacebookIcon,
                    'Instagram': InstagramIcon,
                    'X': TwitterIcon,
                    'Twitter': TwitterIcon,
                    'LinkedIn': LinkedInIcon,
                    'Reddit': RedditIcon,
                    'Discord': DiscordIcon,
                  };

                  const IconComponent = iconMap[platform];
                  if (!IconComponent) return null;

                  return (
                    <Link
                      key={platform}
                      href={url as string}
                      target='_blank'
                      className="relative h-6 w-6 rounded flex items-center justify-center hover:opacity-80 transition-opacity"
                    >
                      <IconComponent className='w-5 h-5 text-foreground/50' />
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default FirmHeader

