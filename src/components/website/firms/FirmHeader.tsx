"use client"
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Check, X, Globe } from 'lucide-react'
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
  return (
    <section className='max-w-7xl mx-auto p-8 card-custom-grad rounded-3xl'>
      <div className="flex items-start justify-between w-full">
        <div className='flex items-center gap-4'>
          <figure className="relative h-24 w-24 bg-foreground/10 rounded-[8px]">
            <Image
              src={firmData?.firmDetails.image?.url || "/website/firm/imagePlac.png"}
              alt={firmData?.firmDetails.name || ""}
              fill
              className='object-contain scale-70'
            />
          </figure>
          <figure className="h-24 w-24 bg-foreground/10 rounded-[8px] relative flex flex-col items-center justify-end pb-2">
            <figure className='absolute h-5 w-6 right-1.5 top-1.5'>
              <Image
                src="/website/badge/badge1.png"
                alt="PTI INDEX"
                fill
                className='object-contain'
              />
            </figure>
            <span className='text-primary text-[32px] font-bold'>
              9.5<span className='text-xl font-light'>/10</span>
            </span>
            <span className='text-base text-foreground/90 -mt-2'>
              PTI INDEX
            </span>
          </figure>

          <div className='flex flex-col items-start justify-between h-full w-fit'>
            <Link
              href={firmData?.firmDetails.officialWebsite || ""}
              target='_blank'
              className='flex items-center gap-2 gradient-text text-[32px] font-semibold capitalize'
            >
              {firmData?.firmDetails.name}
              <Image src={"/website/link.svg"} alt="link" width={24} height={24} />
            </Link>
            <div className='font-geist-sans flex items-start justify-center gap-4'>
              {firmData?.firmDetails?.jurisdiction && <div className='flex flex-col items-start'>
                <span className='text-xs text-foreground/80'>
                  Jurisdiction
                </span>
                <span className='text-base text-foreground font-medium flex items-center gap-1'>
                  { renderFlag(firmData.firmDetails.jurisdiction)} {firmData?.firmDetails?.jurisdiction || 'N/A'}
                </span>
              </div>}

              {firmData?.firmDetails?.yearFounded && <div className='flex flex-col items-start border-l border-foreground/20 pl-4 '>
                <span className='text-xs text-foreground/80'>
                  Years in Operation
                </span>
                <span className='text-base text-foreground font-medium'>
                  {firmData?.firmDetails.yearFounded}
                </span>
              </div>}
              {firmData?.leadership.leadership?.[0]?.name && <div className='flex flex-col items-start border-l border-foreground/20 pl-4 '>
                <span className='text-xs text-foreground/80'>
                  CEO
                </span>
                <span className='text-base text-foreground font-medium'>
                  {firmData?.leadership.leadership?.[0]?.name}
                </span>
              </div>}
              {firmData?.firmDetails?.totalPayout && <div className='flex flex-col items-start border-l border-foreground/20 pl-4 '>
                <span className='text-xs text-foreground/80'>
                  Total Payout
                </span>
                <span className='text-base text-primary font-bold'>
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(firmData?.firmDetails?.totalPayout))}
                </span>
              </div>}
            </div>
          </div>
        </div>

        <Link
          href={`/post-review?firmId=${firmId}`}
          className='flex items-center gap-2 px-4 py-2 rounded-full border-gradient text-primary tracking-tight'
        >
          <Plus className='w-4 h-4 text-primary' />
          Add Review
        </Link>
      </div>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex items-start justify-start gap-4 opacity-80'>
          <figure className='flex flex-col items-center justify-center'>
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

          <figure className='flex flex-col items-center justify-center'>
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

          <figure className='flex flex-col items-center justify-center'>
            <RadarChartComponent
              data={factor3}
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
                Factor 3
              </h3>
            </figcaption>
          </figure>
        </div>
        <div className="flex flex-col gap-6">
          {/* Verified Features Section */}
          <div className="flex flex-col gap-3">
            {firmData?.transparency?.ceoPublic !== null && firmData?.transparency?.ceoPublic !== undefined && (
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 bg-gradient-to-br from-[#F66435] to-[#672611]`}>
                  {firmData.transparency.ceoPublic ? (
                    <Check className="w-3 h-3 text-white" />
                  ) : (
                    <X className="w-3 h-3 text-white" />
                  )}
                </div>
                <span className="text-foreground/80 text-sm">CEO Publicly Verified</span>
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
                <span className="text-foreground/80 text-sm">Office Address Verified</span>
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
                <span className="text-foreground/80 text-sm">Terms Publicly Updated</span>
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
                <span className="text-foreground/80 text-sm">Payout Proof Available</span>
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
                <span className="text-foreground/80 text-sm">Third Party Audited</span>
              </div>
            )}
          </div>

          {/* Socials Available Section */}
          {firmData?.socialLinks?.socialLinks && Object.entries(firmData.socialLinks.socialLinks).length > 0 && <div className="border border-border rounded-lg px-6 py-5">
            <h3 className="text-foreground/80 text-sm mb-2 text-center font-medium">Socials Available</h3>
            <div className="flex items-center justify-center gap-3">
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
          </div>}
        </div>
      </div>
    </section>
  )
}

export default FirmHeader

