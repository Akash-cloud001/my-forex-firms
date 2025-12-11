"use client";

import React from 'react';
import Link from 'next/link';
import { Star, Search, Scale, BarChart3, TrendingUp, List, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableOfContentsItem } from '@/types/firm-review';
import { useBlogDetails } from '@/hooks/queries/useBlogDetails';
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
    const [slug, setSlug] = React.useState<string>('');

    // Get slug from params
    React.useEffect(() => {
        params.then(({ slug: blogSlug }) => {
            setSlug(blogSlug);
        });
    }, [params]);

    // Fetch blog using React Query
    const { data: reviewData, isLoading, isError } = useBlogDetails(slug);

    // Table of contents data from review data
    const tableOfContents = React.useMemo(() => {
        if (!reviewData?.tableOfContents) return [];
        return reviewData.tableOfContents.map((item: TableOfContentsItem) => ({
            id: item.id,
            title: item.title,
            icon: iconMap[item.icon] || Star,
        }));
    }, [reviewData]);

 
    // Scroll tracking for active section with proper timing for React Query
    React.useEffect(() => {
        if (!tableOfContents || tableOfContents.length === 0 || !reviewData) return;

        let observer: IntersectionObserver | null = null;
        let retryTimeout: NodeJS.Timeout | null = null;
        let initialTimeout: NodeJS.Timeout | null = null;

        // Function to set up the observer
        const setupObserver = () => {
            // IntersectionObserver options: rootMargin moves the "viewport" so
            // the section becomes active roughly when it's near the middle of the screen.
            const observerOptions: IntersectionObserverInit = {
                root: null,
                rootMargin: '-40% 0px -40% 0px', // triggers roughly when section is in center area
                threshold: 0, // 0 is fine because rootMargin handles when it becomes active
            };

            observer = new IntersectionObserver((entries) => {
                // We want the entry that's intersecting and has the largest intersectionRatio / isIntersecting
                // Since rootMargin shrinks the intersection area, first intersecting entry is usually what we want.
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(entry.target.id);
                    }
                });
            }, observerOptions);

            // Try to observe each section element
            const elementsToObserve: Element[] = [];
            tableOfContents.forEach((item) => {
                const el = document.getElementById(item.id);
                if (el) {
                    elementsToObserve.push(el);
                    observer!.observe(el);
                }
            });

            // If we found elements, we're done
            if (elementsToObserve.length > 0) {
                // Set initial active section to overview if it exists and no section is active yet
                const overviewEl = document.getElementById('overview');
                if (overviewEl) {
                    // Use a small delay to check current state
                    setTimeout(() => {
                        const currentEl = document.querySelector('[id].bg-primary\\/10');
                        if (!currentEl) {
                            setActiveSection('overview');
                        }
                    }, 50);
                }
                return true;
            }

            return false;
        };

        // Use requestAnimationFrame to wait for DOM to be ready, then try to set up observer
        const frameId = requestAnimationFrame(() => {
            // Try setting up observer immediately
            if (!setupObserver()) {
                // If elements aren't found, retry after a short delay
                retryTimeout = setTimeout(() => {
                    if (!setupObserver()) {
                        // Final retry after a longer delay
                        setTimeout(() => {
                            setupObserver();
                        }, 300);
                    }
                }, 100);
            }
        });

        // Fallback: ensure initial active is 'overview' if nothing intersects quickly
        initialTimeout = setTimeout(() => {
            const overviewEl = document.getElementById('overview');
            if (overviewEl) {
                // Check if any section is currently active by looking for the active class
                const activeEl = document.querySelector('[id].bg-primary\\/10');
                if (!activeEl) {
                    setActiveSection('overview');
                }
            }
        }, 500);

        return () => {
            cancelAnimationFrame(frameId);
            if (observer) {
                observer.disconnect();
            }
            if (retryTimeout) {
                clearTimeout(retryTimeout);
            }
            if (initialTimeout) {
                clearTimeout(initialTimeout);
            }
        };
    }, [tableOfContents, reviewData]); // Depend on reviewData to ensure data is loaded


    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            // Use getBoundingClientRect() to get accurate position relative to viewport
            const rect = element.getBoundingClientRect();
            // Calculate absolute position from top of document
            const absoluteTop = rect.top + window.scrollY;
            // Account for fixed navbar (pt-24 = 96px, plus some spacing)
            const offsetPosition = absoluteTop - 200;

            window.scrollTo({
                top: Math.max(0, offsetPosition), // Ensure we don't scroll to negative position
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
    if (isError || !reviewData) {
        return (
            <div className="min-h-screen bg-background pt-12 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-destructive text-lg mb-4">Review not found</p>
                    <Button asChild variant="link">
                        <Link href="/blogs">Back to Blogs</Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background pt-24">
            {/* <ScrollToTop /> */}
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
