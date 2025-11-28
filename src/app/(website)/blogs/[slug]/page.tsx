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

    // Scroll tracking for active section
    React.useEffect(() => {
        const handleScroll = () => {
            const sections = tableOfContents.map(item => document.getElementById(item.id));
            const scrollPosition = window.scrollY + 150; // 150px offset to account for navbar and better UX

            for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section && section.offsetTop <= scrollPosition) {
                    setActiveSection(tableOfContents[i].id);
                    break;
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial check

        return () => window.removeEventListener('scroll', handleScroll);
    }, [tableOfContents]);

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

                        {/* Final Verdict */}
                        <BlogFinalVerdict 
                            finalVerdict={reviewData.finalVerdict} 
                            firmName={reviewData.firmName}
                            iconMap={iconMap}
                        />
                    </section>
                </article>
            </div>
        </div>
    );
}
