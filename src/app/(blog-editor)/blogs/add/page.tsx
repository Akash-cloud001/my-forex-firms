"use client";

import React, { Suspense } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { getReviewTemplate } from '@/lib/blog-templates';
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

function AddBlogPageContent() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const searchParams = useSearchParams();
    const template = searchParams.get('template');
    
    const [reviewData, setReviewData] = React.useState<FirmReview | null>(null);
    const [originalData, setOriginalData] = React.useState<FirmReview | null>(null);
    const [isSaving, setIsSaving] = React.useState(false);
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

    // Initialize blog data based on template
    React.useEffect(() => {
        if (!template) {
            router.push('/admin/blogs');
            return;
        }

        if (template === 'review-template') {
            const templateData = getReviewTemplate();
            const tempSlug = 'new-blog-' + Date.now();
            const initialized = {
                ...templateData,
                slug: tempSlug,
            };
            setReviewData(initialized);
            setOriginalData(JSON.parse(JSON.stringify(initialized)));
        } else {
            router.push('/admin/blogs');
        }
    }, [template, router]);

    // Generate slug from firm name
    React.useEffect(() => {
        if (reviewData?.firmName && reviewData.firmName !== '') {
            const generatedSlug = reviewData.firmName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
                + '-review';
            
            if (generatedSlug && generatedSlug !== reviewData.slug) {
                setReviewData(prev => prev ? { ...prev, slug: generatedSlug } : null);
            }
        }
    }, [reviewData?.firmName, reviewData?.slug]);

    // Check if there are changes
    const hasChanges = React.useMemo(() => {
        if (!reviewData || !originalData) return false;
        return JSON.stringify(reviewData) !== JSON.stringify(originalData);
    }, [reviewData, originalData]);

    // Check if required fields are filled
    const hasRequiredFields = React.useMemo(() => {
        if (!reviewData) return false;
        return !!(
            reviewData.firmName &&
            reviewData.title &&
            reviewData.slug
        );
    }, [reviewData]);

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
        if (!reviewData || !hasRequiredFields) {
            toast.error('Please fill in required fields: Firm Name and Title');
            return;
        }
        
        if (!reviewData.slug.endsWith('-review')) {
            toast.error('Slug must end with "-review"');
            return;
        }
        
        setIsSaving(true);
        try {
            const response = await fetch('/api/admin/firm-reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reviewData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create blog');
            }

            toast.success('Blog created successfully!');
            setOriginalData(JSON.parse(JSON.stringify(reviewData)));
            router.push(`/blogs/${reviewData.slug}`);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to save blog. Please try again.';
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
    if (!reviewData) {
        return (
            <div className="min-h-screen bg-background pt-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Initializing template...</p>
                </div>
            </div>
        );
    }

    return (
        <BlogEditorLayout
            title="Create New Blog Review"
            subtitle="Template: Review Template"
            hasChanges={hasChanges && hasRequiredFields}
            isSaving={isSaving}
            onSave={handleSave}
            isEditMode={false}
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
                        <section className="mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                            {/* Introduction */}
                            <EditableBlogIntroduction
                                introduction={reviewData.introduction}
                                onUpdate={(newValue) => handleUpdate({ introduction: newValue })}
                            />

                            {/* Overview */}
                            <EditableBlogOverview
                                overview={reviewData.overview}
                                onUpdate={(newValue) => handleSectionUpdate('overview', newValue)}
                                firmName={reviewData.firmName}
                            />

                            {/* What is Section */}
                            <EditableBlogWhatIs
                                whatIs={reviewData.whatIs}
                                onUpdate={(newValue) => handleSectionUpdate('whatIs', newValue)}
                                firmName={reviewData.firmName}
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
                            {reviewData.faqs && reviewData.faqs.length > 0 && (
                                <EditableBlogFAQs
                                    faqs={reviewData.faqs}
                                    onUpdate={(newValue) => handleUpdate({ faqs: newValue })}
                                />
                            )}
                        </section>
                    </article>
                </div>
            </div>
        </BlogEditorLayout>
    );
}

export default function AddBlogPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background pt-12 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            </div>
        }>
            <AddBlogPageContent />
        </Suspense>
    );
}

