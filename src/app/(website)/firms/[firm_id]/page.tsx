"use client"
import React, { useEffect, useState } from 'react'
import { IFundingFirm } from '@/models/FirmDetails'
import LoadingScreen from '@/components/ui/LoadingScreen'
import { motion, AnimatePresence } from 'motion/react'
import ReviewsContent from '@/components/website/firms/ReviewsContent'
import ChallengesContent from '@/components/website/firms/ChallengesContent'
import FirmDashboard from '@/components/website/firms/FirmDashboard'
import FirmHeader from '@/components/website/firms/FirmHeader'
import { useParams } from 'next/navigation'


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
    const params = useParams();
    const firmId = params.firm_id as string;
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
      <FirmHeader 
        firmData={firmData}
        firmId={firmId}
        factor1={factor1}
        factor2={factor2}
        factor3={factor3}
      />
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