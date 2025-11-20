"use client"
import React, { useEffect, useState } from 'react'
import { IFundingFirm } from '@/models/FirmDetails'
import Image from 'next/image'
import Link from 'next/link'
import LoadingScreen from '@/components/ui/LoadingScreen'
import { Plus, Check } from 'lucide-react'
import  RadarChartComponent  from '@/components/ui/RadarChart'
import { motion, AnimatePresence } from 'motion/react'
import { 
  FacebookIcon, 
  RedditIcon, 
  TwitterIcon, 
  LinkedInIcon, 
  InstagramIcon, 
  DiscordIcon 
} from '@/components/svgs'
import ReviewsContent from '@/components/website/firms/ReviewsContent'
import ChallengesContent from '@/components/website/firms/ChallengesContent'
import FirmDashboard from '@/components/website/firms/FirmDashboard'


const tabs = [
    {
        name: 'Firm Dashboard',
        value: 'dashboard'
    },
    {
        name: 'Challenges',
        value: 'challenges'
    },
    {
        name: 'Reviews',
        value: 'reviews'
    }
];

const factor1 = [
    {
      subject: 'Identity Transparency',
      A: 6.8,
      fullMark: 10,
    },
    {
      subject: 'Operational Transparency',
      A: 8,
      fullMark: 10,
    },
    {
      subject: 'Social Presence',
      A: 7,
      fullMark: 10,
    },
    {
      subject: 'Historical Trust Signals',
      A: 10,
      fullMark: 10,
    },
  
  ];
  
const factor2 = [
    {
      subject: 'Challenge Structure',
      A: 6.8,
      fullMark: 10,
    },
    {
      subject: 'Platform Quality',
      A: 8,
      fullMark: 10,
    },
    {
      subject: 'Rule Transparency',
      A: 7,
      fullMark: 10,
    },
    {
      subject: 'Trader-Friendliness',
      A: 10,
      fullMark: 10,
    },
  ];

  const factor3 = [
    {
      subject: 'Payout Reliability',
      A: 6.8,
      fullMark: 10,
    },
    {
      subject: 'Financial Structure',
      A: 8,
      fullMark: 10,
    },
    {
      subject: 'Payout History',
      A: 7,
      fullMark: 10,
    },
    {
      subject: 'Payout Behavior',
      A: 10,
      fullMark: 10,
    },
  ];

const FirmPage = () => {
    const firmId = "690cbdca770e44adfbaddd4a"
    const [firmData, setFirmData] = useState<IFundingFirm | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'challenges' | 'reviews'>('dashboard');
  useEffect(()=>
    {
        const fetchFirmData = async()=>{
            try{
                const res = await fetch(`/api/admin/firm/${firmId}`);
                const data = await res.json();
                setFirmData(data.data);
            }catch(error){
                console.error("Error fetching firm data:", error);
                setFirmData(null);
            }finally{
                setLoading(false);
            }
        }
        fetchFirmData();
    },[firmId])

    if(loading){
        return <LoadingScreen title="Getting things ready..." subtitle="This will only take a moment." />
    }
  return (
    <section className='w-full min-h-screen py-12 px-4 lg:px-0 text-foreground background-gradient'>

        <section className='max-w-7xl mx-auto p-8 card-custom-grad rounded-3xl'>
            <div className="flex items-start justify-between w-full">
                <div className='flex items-center gap-4'>
                    <figure className="relative h-24 w-24 bg-foreground/10 rounded-[8px]">
                        <Image src={firmData?.firmDetails.image?.url || ""} alt={firmData?.firmDetails.name || ""} fill className='object-contain scale-70' />
                    </figure>
                    <figure className="h-24 w-24 bg-foreground/10 rounded-[8px]  relative flex flex-col items-center justify-end pb-2">
                        <figure className='absolute h-5 w-6 right-1.5 top-1.5'>
                            <Image src="/website/badge/badge1.png" alt="PTI INDEX" fill className='object-contain' />
                        </figure>
                            <span className='text-primary text-[32px] font-bold'>
                                9.5<span className='text-xl font-light'>/10</span>
                            </span>
                            <span className='text-base text-foreground/90 -mt-2'>
                                PTI INDEX
                            </span>
                    </figure>

                    <div className='flex flex-col items-start justify-between h-full w-fit'>
                        <Link href={firmData?.firmDetails.officialWebsite || ""} target='_blank' className='flex items-center gap-2 gradient-text text-[32px] font-semibold capitalize'>
                            {firmData?.firmDetails.name} 
                                <Image src={"/website/link.svg"} alt="link" width={24} height={24} />
                        </Link>
                        <div className='font-geist-sans flex items-start justify-center gap-4'>
                            <div className='flex flex-col items-start'>
                                <span className='text-xs text-foreground/80'>
                                    Jurisdiction
                                </span>
                                <span className='text-base text-foreground font-medium flex items-center gap-1'>
                                    <div className='w-[32px] h-4 bg-red-400'></div> {firmData?.firmDetails.jurisdiction}
                                </span>
                            </div>
                            
                            <div className='flex flex-col items-start border-l border-foreground/20 pl-4 '>
                                <span className='text-xs text-foreground/80'>
                                    Years in Operation
                                </span>
                                <span className='text-base text-foreground font-medium'>
                                    {firmData?.firmDetails.yearFounded}
                                </span>
                            </div>
                            <div className='flex flex-col items-start border-l border-foreground/20 pl-4 '>
                                <span className='text-xs text-foreground/80'>
                                    CEO
                                </span>
                                <span className='text-base text-foreground font-medium'>
                                    {firmData?.leadership.leadership?.[0]?.name}
                                </span>
                            </div>
                            <div className='flex flex-col items-start border-l border-foreground/20 pl-4 '>
                                <span className='text-xs text-foreground/80'>
                                    Reviews
                                </span>
                                <span className='text-base text-foreground font-medium'>
                                    560
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <Link href={`/post-review?firmId=${firmId}`} className='flex items-center gap-2 px-4 py-2 rounded-full border-gradient text-primary tracking-tight'>
                    <Plus className='w-4 h-4 text-primary' />
                    Add Review
                </Link>
            </div>
            <div className='flex items-start justify-between gap-4'>
                <div className='flex items-start justify-start gap-4 opacity-80'>
                    <figure className='flex flex-col items-center justify-center'>
                        <RadarChartComponent data={factor1} width={300} height={300} outerRadius={60} innerRadius={0} dataKey="A" stroke="#F66435" fill="#F66435" fillOpacity={0.5} name="Mike" margin={{ top: 20, left: 20, right: 20, bottom: 20 }} />
                        <figcaption>
                            <h3 className='text-base text-foreground font-semibold -mt-2 uppercase'>
                                Factor 1
                            </h3>
                        </figcaption>
                    </figure>

                    <figure className='flex flex-col items-center justify-center'>
                        <RadarChartComponent data={factor2} width={300} height={300} outerRadius={60} innerRadius={0} dataKey="A" stroke="#F66435" fill="#F66435" fillOpacity={0.5} name="Mike" margin={{ top: 20, left: 20, right: 20, bottom: 20 }} />
                        <figcaption>
                            <h3 className='text-base text-foreground font-semibold -mt-2 uppercase'>
                                Factor 2
                            </h3>
                        </figcaption>
                    </figure>

                    <figure className='flex flex-col items-center justify-center'>
                        <RadarChartComponent data={factor3} width={300} height={300} outerRadius={60} innerRadius={0} dataKey="A" stroke="#F66435" fill="#F66435" fillOpacity={0.5} name="Mike" margin={{ top: 20, left: 20, right: 20, bottom: 20 }} />
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
                        {firmData?.transparency?.ceoPublic && (
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded bg-gradient-to-br from-[#F66435] to-[#672611] flex items-center justify-center shrink-0">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-foreground/80 text-sm">CEO Publicly Verified</span>
                            </div>
                        )}
                        {firmData?.transparency?.officeVerified && (
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded bg-gradient-to-br from-[#F66435] to-[#672611] flex items-center justify-center shrink-0">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-foreground/80 text-sm">Office Address Verified</span>
                            </div>
                        )}
                        {firmData?.transparency?.termsPublicUpdated && (
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded bg-gradient-to-br from-[#F66435] to-[#672611] flex items-center justify-center shrink-0">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-foreground/80 text-sm">Terms Publicly Updated</span>
                            </div>
                        )}
                        {firmData?.transparency?.payoutProofPublic && (
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded bg-gradient-to-br from-[#F66435] to-[#672611] flex items-center justify-center shrink-0">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-foreground/80 text-sm">Payout Proof Available</span>
                            </div>
                        )}
                        {firmData?.transparency?.thirdPartyAudit && (
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded bg-gradient-to-br from-[#F66435] to-[#672611] flex items-center justify-center shrink-0">
                                    <Check className="w-3 h-3 text-white" />
                                </div>
                                <span className="text-foreground/80 text-sm">Third Party Audited</span>
                            </div>
                        )}
                    </div>

                    {/* Socials Available Section */}
                    <div className="border border-border rounded-lg px-6 py-5">
                        <h3 className="text-foreground/80 text-sm mb-2 text-center font-medium">Socials Available</h3>
                        <div className="flex items-center justify-center gap-3">
                            {firmData?.socialLinks?.socialLinks && Object.entries(firmData.socialLinks.socialLinks).map(([platform, url]) => {
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
                </div>
            </div>


        </section>
        <section className='max-w-7xl mx-auto rounded-3xl'>
            {/* Tab Navigation */}
            <div className="mt-8 ">
                <div className="flex gap-2">
                    {tabs.map((tab)=>(
                        <button
                            key={tab.value}
                            onClick={() => setActiveTab(tab.value as 'dashboard' | 'challenges' | 'reviews')}
                        className={`px-6 py-3 rounded-full text-lg font-medium font-geist-sans transition-colors ${
                            activeTab === tab.value
                                ? 'bg-foreground/10 text-foreground'
                                : 'text-foreground/60 hover:text-foreground/80'
                        }`}
                            >
                                {tab.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="mt-6 min-h-[400px]">
                <AnimatePresence mode="wait">
                    {activeTab === 'dashboard' && (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full rounded-lg"
                        >
                            <FirmDashboard firmData={firmData} />
                        </motion.div>
                    )}
                    {activeTab === 'challenges' && (
                        <motion.div
                            key="challenges"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full rounded-lg"
                        >
                            <ChallengesContent />
                        </motion.div>
                    )}
                    {activeTab === 'reviews' && (
                        <motion.div
                            key="reviews"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="w-full h-full rounded-lg"
                        >
                            <ReviewsContent />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>

    </section>
  )
}

export default FirmPage