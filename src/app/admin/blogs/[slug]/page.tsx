"use client";

import React from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { FirmReview } from '@/types/firm-review';
import BlogEditorLayout from '@/components/admin/blog-editor/BlogEditorLayout';
import EditableBlogHero from '@/components/admin/blog-editor/editable/EditableBlogHero';
import EditableBlogIntroduction from '@/components/admin/blog-editor/editable/EditableBlogIntroduction';
import EditableBlogOverview from '@/components/admin/blog-editor/editable/EditableBlogOverview';
import EditableBlogWhatIs from '@/components/admin/blog-editor/editable/EditableBlogWhatIs';
import EditableBlogHowDiffers from '@/components/admin/blog-editor/editable/EditableBlogHowDiffers';
import EditableBlogProgramsComparison from '@/components/admin/blog-editor/editable/EditableBlogProgramsComparison';
import EditableBlogPlatforms from '@/components/admin/blog-editor/editable/EditableBlogPlatforms';
import EditableBlogPayoutsWithdrawal from '@/components/admin/blog-editor/editable/EditableBlogPayoutsWithdrawal';
import EditableBlogSupportReputation from '@/components/admin/blog-editor/editable/EditableBlogSupportReputation';
import EditableBlogTraderFeedback from '@/components/admin/blog-editor/editable/EditableBlogTraderFeedback';
import EditableBlogProsCons from '@/components/admin/blog-editor/editable/EditableBlogProsCons';
import EditableBlogRedFlags from '@/components/admin/blog-editor/editable/EditableBlogRedFlags';
import EditableBlogWhoShouldUse from '@/components/admin/blog-editor/editable/EditableBlogWhoShouldUse';
import EditableBlogFundedAccountProcess from '@/components/admin/blog-editor/editable/EditableBlogFundedAccountProcess';
import EditableBlogFinalVerdict from '@/components/admin/blog-editor/editable/EditableBlogFinalVerdict';
import EditableBlogFAQs from '@/components/admin/blog-editor/editable/EditableBlogFAQs';
import BlogTableOfContents from '@/components/website/blog/BlogTableOfContents';
import { Star, Search, Scale, BarChart3, TrendingUp, List, LucideIcon } from 'lucide-react';
import { TableOfContentsItem } from '@/types/firm-review';

const iconMap: Record<string, LucideIcon> = {
    Star,
    Search,
    Scale,
    BarChart3,
    TrendingUp,
    List,
};

interface AdminBlogPageProps {
    params: Promise<{ slug: string }>;
}

export default function AdminBlogEditorPage({ params }: AdminBlogPageProps) {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [reviewData, setReviewData] = React.useState<FirmReview | null>(null);
    const [originalData, setOriginalData] = React.useState<FirmReview | null>(null);
    const [slug, setSlug] = React.useState<string>('');
    const [isSaving, setIsSaving] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [activeSection, setActiveSection] = React.useState('overview');
    const [isMobileTocOpen, setIsMobileTocOpen] = React.useState(false);

    // Check authentication and role
    React.useEffect(() => {
        if (isLoaded && user) {
            const userRole = user.publicMetadata?.role as string | undefined;
            if (!userRole || !['admin', 'editor'].includes(userRole)) {
                router.push('/admin/unauthorized');
            }
        }
    }, [isLoaded, user, router]);

    // Load review data from API
    React.useEffect(() => {
        const fetchReviewData = async () => {
            try {
                const { slug: blogSlug } = await params;
                setSlug(blogSlug);
                
                const response = await fetch(`/api/admin/firm-reviews/${blogSlug}`);
                const data = await response.json();

                if (!response.ok) {
                    if (response.status === 404) {
                        toast.error('Review not found');
                        router.push('/admin/blogs');
                        return;
                    }
                    throw new Error(data.error || 'Failed to fetch review');
                }

                if (data.success && data.review) {
                    const clonedData = JSON.parse(JSON.stringify(data.review));
                    setReviewData(clonedData);
                    setOriginalData(clonedData);
                } else {
                    throw new Error('Invalid response format');
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to load review';
                toast.error(errorMessage);
                router.push('/admin/blogs');
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviewData();
    }, [params, router]);

    // Check if there are changes
    const hasChanges = React.useMemo(() => {
        if (!reviewData || !originalData) return false;
        return JSON.stringify(reviewData) !== JSON.stringify(originalData);
    }, [reviewData, originalData]);

    // Handle data updates
    const handleUpdate = React.useCallback((updates: Partial<FirmReview>) => {
        if (!reviewData) return;
        setReviewData({ ...reviewData, ...updates });
    }, [reviewData]);

    // Handle section-specific updates
    const handleSectionUpdate = React.useCallback((section: keyof FirmReview, data: unknown) => {
        if (!reviewData) return;
        setReviewData({ ...reviewData, [section]: data });
    }, [reviewData]);

    // Handle save
    const handleSave = async () => {
        if (!reviewData || !hasChanges) return;
        
        setIsSaving(true);
        try {
            const response = await fetch(`/api/admin/firm-reviews/${slug}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reviewData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update review');
            }

            setOriginalData(JSON.parse(JSON.stringify(reviewData)));
            toast.success('Review updated successfully!');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to save review. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    // Table of contents data
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
        if (!tableOfContents || tableOfContents.length === 0 || !reviewData) return;

        const observerOptions: IntersectionObserverInit = {
            root: null,
            rootMargin: '-40% 0px -40% 0px',
            threshold: 0,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, observerOptions);

        tableOfContents.forEach((item) => {
            const el = document.getElementById(item.id);
            if (el) {
                observer.observe(el);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, [tableOfContents, reviewData]);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const elementPosition = element.offsetTop;
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
            setIsMobileTocOpen(false);
        }
    };

    // Show loading while user data is being fetched
    if (!isLoaded) {
        return <LoadingScreen title="Loading..." subtitle="Checking permissions..." />;
    }

    // Check role after user is loaded
    const userRole = user?.publicMetadata?.role as string | undefined;
    if (isLoaded && user && (!userRole || !['admin', 'editor'].includes(userRole))) {
        return null;
    }

    // Loading state
    if (isLoading || !reviewData) {
        return (
            <div className="min-h-screen bg-background pt-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading review...</p>
                </div>
            </div>
        );
    }

    return (
        <BlogEditorLayout
            title={`Edit: ${reviewData.title}`}
            subtitle="Click on any field to edit its content. Save changes when done."
            slug={slug}
            hasChanges={hasChanges}
            isSaving={isSaving}
            onSave={handleSave}
            isEditMode={true}
        >
            <div className="min-h-screen bg-background pt-24">
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
                        <EditableBlogHero
                            reviewData={reviewData}
                            onUpdate={handleUpdate}
                        />

                        {/* Article Content */}
                        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                            {/* Introduction */}
                            <EditableBlogIntroduction
                                introduction={reviewData.introduction}
                                onUpdate={(newValue) => handleUpdate({ introduction: newValue })}
                            />

                            {/* Overview */}
                            <EditableBlogOverview
                                overview={reviewData.overview}
                                onUpdate={(newValue) => handleSectionUpdate('overview', newValue)}
                            />

                            {/* What is Section */}
                            <EditableBlogWhatIs
                                whatIs={reviewData.whatIs}
                                onUpdate={(newValue) => handleSectionUpdate('whatIs', newValue)}
                            />

                            {/* How Differs Section */}
                            <EditableBlogHowDiffers
                                howDiffers={reviewData.howDiffers}
                                onUpdate={(newValue) => handleSectionUpdate('howDiffers', newValue)}
                            />

                            {/* Program Comparison */}
                            <EditableBlogProgramsComparison
                                programsComparison={reviewData.programsComparison}
                                onUpdate={(newValue) => handleSectionUpdate('programsComparison', newValue)}
                            />

                            {/* Platforms & Execution */}
                            <EditableBlogPlatforms
                                platformsExecution={reviewData.platformsExecution}
                                onUpdate={(newValue) => handleSectionUpdate('platformsExecution', newValue)}
                            />

                            {/* Payouts & Withdrawal */}
                            <EditableBlogPayoutsWithdrawal
                                payoutsWithdrawal={reviewData.payoutsWithdrawal}
                                onUpdate={(newValue) => handleSectionUpdate('payoutsWithdrawal', newValue)}
                            />
                            
                            {/* Support & Reputation */}
                            <EditableBlogSupportReputation
                                supportReputation={reviewData.supportReputation}
                                onUpdate={(newValue) => handleSectionUpdate('supportReputation', newValue)}
                            />

                            {/* Trader Feedback */}
                            <EditableBlogTraderFeedback
                                traderFeedback={reviewData.traderFeedback}
                                onUpdate={(newValue) => handleSectionUpdate('traderFeedback', newValue)}
                            />

                            {/* Pros and Cons */}
                            <EditableBlogProsCons
                                prosCons={reviewData.prosCons}
                                onUpdate={(newValue) => handleSectionUpdate('prosCons', newValue)}
                            />

                            {/* Red Flags */}
                            <EditableBlogRedFlags
                                redFlags={reviewData.redFlags}
                                onUpdate={(newValue) => handleSectionUpdate('redFlags', newValue)}
                            />

                            {/* Who Should Use */}
                            <EditableBlogWhoShouldUse
                                whoShouldUse={reviewData.whoShouldUse}
                                onUpdate={(newValue) => handleSectionUpdate('whoShouldUse', newValue)}
                            />

                            {/* Funded Account Process */}
                            <EditableBlogFundedAccountProcess
                                fundedAccountProcess={reviewData.fundedAccountProcess}
                                onUpdate={(newValue) => handleSectionUpdate('fundedAccountProcess', newValue)}
                            />

                            {/* Final Verdict */}
                            <EditableBlogFinalVerdict
                                finalVerdict={reviewData.finalVerdict}
                                firmName={reviewData.firmName}
                                trustScore={reviewData.trustScore}
                                onUpdate={(newValue) => handleSectionUpdate('finalVerdict', newValue)}
                            />

                            {/* FAQ's */}
                            <EditableBlogFAQs
                                faqs={reviewData.faqs || []}
                                onUpdate={(newValue) => handleUpdate({ faqs: newValue })}
                            />
                        </section>
                    </article>
                </div>
            </div>
        </BlogEditorLayout>
    );
}
