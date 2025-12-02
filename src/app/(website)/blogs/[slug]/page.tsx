"use client";

import React from 'react';
import Link from 'next/link';
import { Star, Search, Scale, BarChart3, TrendingUp, List, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableOfContentsItem } from '@/types/firm-review';
import { useBlog } from '@/stores/blogStore';
import LoadingScreen from '@/components/ui/LoadingScreen';
import BlogHero from '@/components/website/blog/BlogHero';
import BlogIntroduction from '@/components/website/blog/BlogIntroduction';
import BlogOverview from '@/components/website/blog/BlogOverview';
import BlogWhatIs from '@/components/website/blog/BlogWhatIs';
import BlogHowDiffers from '@/components/website/blog/BlogHowDiffers';
import BlogProgramsComparison from '@/components/website/blog/BlogProgramsComparison';
import BlogPlatforms from '@/components/website/blog/BlogPlatforms';
import BlogFinalVerdict from '@/components/website/blog/BlogFinalVerdict';
import BlogTableOfContents from '@/components/website/blog/BlogTableOfContents';
import BlogPayoutsWithdrawal from '@/components/website/blog/BlogPayoutsWithdrawalProps';
import BlogSupportReputation from '@/components/website/blog/BlogSupportReputationProps';
import BlogTraderFeedback from '@/components/website/blog/BlogTraderFeedbackProps';
import BlogProsConsProps from '@/components/website/blog/BlogProsConsProps';
import BlogRedFlags from '@/components/website/blog/BlogRedFlags';
import BlogWhoShouldUse from '@/components/website/blog/BlogWhoShouldUse';
import BlogFundedAccountProcess from '@/components/website/blog/BlogFundedAccountProcess';
import AnimatedSection from '@/components/website/AnimatedSection';
import { CustomAccordion } from '@/components/ui/custom-accordion';
interface BlogPageProps {
    params: Promise<{ slug: string }>;
}

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
    Star,
    Search,
    Scale,
    BarChart3,
    TrendingUp,
    List,
};

export default function BlogDetailPage({ params }: BlogPageProps) {
    const [activeSection, setActiveSection] = React.useState('overview');
    const [isMobileTocOpen, setIsMobileTocOpen] = React.useState(false);
    const { blog: reviewData, isLoading, error, fetchBlog, clearBlog } = useBlog();

    // Get slug from params and fetch blog
    React.useEffect(() => {
        params.then(({ slug: blogSlug }) => {
            fetchBlog(blogSlug);
        });

        // Cleanup: clear blog when component unmounts
        return () => {
            clearBlog();
        };
    }, [params, fetchBlog, clearBlog]);

    // Table of contents data from review data
    const tableOfContents = React.useMemo(() => {
        if (!reviewData?.tableOfContents) return [];
        return reviewData.tableOfContents.map((item: TableOfContentsItem) => ({
            id: item.id,
            title: item.title,
            icon: iconMap[item.icon] || Star,
        }));
    }, [reviewData]);

 
    // Replace the existing "Scroll tracking for active section" useEffect with this:
    React.useEffect(() => {
        if (!tableOfContents || tableOfContents.length === 0) return;

        // If the overview section exists right away, ensure activeSection starts as 'overview'
        const overviewEl = document.getElementById('overview');
        if (overviewEl) {
            setActiveSection('overview');
        }

        // IntersectionObserver options: rootMargin moves the "viewport" so
        // the section becomes active roughly when it's near the middle of the screen.
        const observerOptions: IntersectionObserverInit = {
            root: null,
            rootMargin: '-40% 0px -40% 0px', // triggers roughly when section is in center area
            threshold: 0, // 0 is fine because rootMargin handles when it becomes active
        };

        const observer = new IntersectionObserver((entries) => {
            // We want the entry that's intersecting and has the largest intersectionRatio / isIntersecting
            // Since rootMargin shrinks the intersection area, first intersecting entry is usually what we want.
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, observerOptions);

        // Observe each section element that exists
        tableOfContents.forEach((item) => {
            const el = document.getElementById(item.id);
            if (el) observer.observe(el);
        });

        // Fallback: ensure initial active is 'overview' if nothing intersects quickly
        const initialTimeout = window.setTimeout(() => {
            if (!document.getElementById(activeSection)) {
                // if activeSection is invalid for some reason, set to overview if present
                if (overviewEl) setActiveSection('overview');
            }
        }, 200); // short timeout — safe fallback

        return () => {
            observer.disconnect();
            clearTimeout(initialTimeout);
        };
    }, [tableOfContents]); // only re-run when tableOfContents changes


    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const elementPosition = element.offsetTop;
            const offsetPosition = elementPosition; // 100px offset for navbar spacing

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            setIsMobileTocOpen(false); // Close mobile TOC after navigation
        }
    };

    // Loading state
    if (isLoading) {
        return (
            <LoadingScreen />
        );
    }

    // Error state
    if (error || !reviewData) {
        return (
            <div className="min-h-screen bg-background pt-12 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-destructive text-lg mb-4">{error || 'Review not found'}</p>
                    <Button asChild variant="link">
                        <Link href="/blogs">Back to Blogs</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-12">
            {/* Main Layout Container */}
            <div className="relative max-w-7xl mx-auto grid grid-cols-12">
                {/* Table of Contents */}
                <BlogTableOfContents
                    tableOfContents={tableOfContents}
                    activeSection={activeSection}
                    isMobileTocOpen={isMobileTocOpen}
                    setIsMobileTocOpen={setIsMobileTocOpen}
                    scrollToSection={scrollToSection}
                />

                {/* Main Content Area */}
                <article className="col-span-12 xl:col-span-8">
                    {/* Hero Section */}
                    <BlogHero reviewData={reviewData} />

                    {/* Article Content */}
                    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                        {/* Introduction */}
                        <BlogIntroduction introduction={reviewData.introduction} />

                        {/* Overview */}
                        <BlogOverview overview={reviewData.overview} iconMap={iconMap} />

                        {/* What is Section */}
                        <BlogWhatIs whatIs={reviewData.whatIs} iconMap={iconMap} />

                        {/* How Differs Section */}
                        <BlogHowDiffers howDiffers={reviewData.howDiffers} iconMap={iconMap} />

                        {/* Program Comparison */}
                        <BlogProgramsComparison programsComparison={reviewData.programsComparison} iconMap={iconMap} />

                        {/* Platforms & Execution */}
                        <BlogPlatforms platformsExecution={reviewData.platformsExecution} iconMap={iconMap} />

                        {/* Payouts & Withdrawal */}
                        <BlogPayoutsWithdrawal payoutsWithdrawal={reviewData.payoutsWithdrawal} iconMap={iconMap} />
                        
                        {/* Support & Reputation */}
                        <BlogSupportReputation supportReputation={reviewData.supportReputation} iconMap={iconMap} />

                        {/* Trader Feedback */}
                        <BlogTraderFeedback traderFeedback={reviewData.traderFeedback} iconMap={iconMap} />

                        {/* Pros and Cons */}
                        <BlogProsConsProps prosCons={reviewData.prosCons} iconMap={iconMap} />

                        {/* Red Flags */}
                        <BlogRedFlags redFlags={reviewData.redFlags} iconMap={iconMap} />

                        {/* Who Should Use */}
                        <BlogWhoShouldUse whoShouldUse={reviewData.whoShouldUse} iconMap={iconMap} />

                        {/* Funded Account Process */}
                        <BlogFundedAccountProcess fundedAccountProcess={reviewData.fundedAccountProcess} />

                        {/* Final Verdict */}
                        <BlogFinalVerdict
                            finalVerdict={reviewData.finalVerdict}
                            firmName={reviewData.firmName}
                            iconMap={iconMap}
                            trustScore={reviewData.trustScore}
                        />

                        {/* FAQ's */}
                        {reviewData.faqs && reviewData.faqs.length > 0 && 
                        <AnimatedSection id="faqs">
                            <section className='w-full pb-16'>
                                <div className='flex w-full flex-col gap-10 btn-grad rounded-[32px] py-10 sm:py-16 px-6 sm:px-10'>
                                    <h2 className='text-2xl font-semibold tracking-tight sm:text-4xl text-center text-wrap'>
                                        Frequently Asked Questions
                                    </h2>
                                    <div className='relative font-geist-sans w-full md:max-w-4xl mx-auto'>
                                        <CustomAccordion
                                            items={reviewData.faqs.map((faq) => ({
                                                question: faq.question,
                                                answer: faq.answer,
                                            }))}
                                        />
                                    </div>
                                </div>
                            </section>
                        </AnimatedSection>}

                    </section>
                </article>
            </div>
        </div>
    );
}
