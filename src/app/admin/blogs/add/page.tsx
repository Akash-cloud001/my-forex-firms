"use client";

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { getReviewTemplate } from '@/lib/blog-templates';
import { FirmReview } from '@/types/firm-review';
import BasicInfoEditor from '@/components/admin/blog-editor/sections/BasicInfoEditor';
import OverviewEditor from '@/components/admin/blog-editor/sections/OverviewEditor';
import WhatIsEditor from '@/components/admin/blog-editor/sections/WhatIsEditor';
import HowDiffersEditor from '@/components/admin/blog-editor/sections/HowDiffersEditor';
import ProgramsComparisonEditor from '@/components/admin/blog-editor/sections/ProgramsComparisonEditor';
import PlatformsEditor from '@/components/admin/blog-editor/sections/PlatformsEditor';
import FinalVerdictEditor from '@/components/admin/blog-editor/sections/FinalVerdictEditor';

function AddBlogPageContent() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const searchParams = useSearchParams();
    const template = searchParams.get('template');
    
    const [reviewData, setReviewData] = React.useState<FirmReview | null>(null);
    const [isSaving, setIsSaving] = React.useState(false);

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
            // If no template, redirect to blogs list
            router.push('/admin/blogs');
            return;
        }

        if (template === 'review-template') {
            const templateData = getReviewTemplate();
            // Generate a temporary slug (will be updated when firm name is set)
            const tempSlug = 'new-blog-' + Date.now();
            setReviewData({
                ...templateData,
                slug: tempSlug,
            });
        } else {
            // Unknown template, redirect
            router.push('/admin/blogs');
        }
    }, [template, router]);

    // Generate slug from firm name (format: "firm-name-review")
    React.useEffect(() => {
        if (reviewData?.firmName && reviewData.firmName !== '') {
            const generatedSlug = reviewData.firmName
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
                + '-review';
            
            // Only update if slug is different
            if (generatedSlug && generatedSlug !== reviewData.slug) {
                setReviewData(prev => prev ? { ...prev, slug: generatedSlug } : null);
            }
        }
    }, [reviewData?.firmName, reviewData?.slug]);

    // Check if there are changes
    const hasChangesMemo = React.useMemo(() => {
        if (!reviewData) return false;
        // Check if required fields are filled
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

    // Handle save
    const handleSave = async () => {
        if (!reviewData || !hasChangesMemo) return;
        
        // Validate required fields
        if (!reviewData.firmName || !reviewData.title || !reviewData.slug) {
            toast.error('Please fill in required fields: Firm Name and Title');
            return;
        }
        
        // Validate slug format
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
            
            // After successful save, redirect to edit page
            router.push(`/admin/blogs/${reviewData.slug}`);
        } catch (error) {
            console.error('Error saving blog:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to save blog. Please try again.';
            toast.error(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    // Show loading while user data is being fetched
    if (!isLoaded) {
        return <LoadingScreen title="Loading..." subtitle="Checking permissions..." />;
    }

    // Check role after user is loaded
    const userRole = user?.publicMetadata?.role as string | undefined;
    if (isLoaded && user && (!userRole || !['admin', 'editor'].includes(userRole))) {
        return null; // Redirect will happen
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
        <div className="min-h-screen bg-background">
            {/* Admin Header */}
            <div className="border-b border-border bg-background sticky top-[53px] z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col items-start gap-4">
                            <Button
                                asChild
                                variant="link"
                                size="sm"
                            >
                                <Link href="/admin/blogs" className="flex items-center gap-2">
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to Blogs
                                </Link>
                            </Button>
                            <div>
                                <h1 className="text-2xl font-bold text-foreground">Create New Blog Review</h1>
                                <p className="text-sm text-muted-foreground">Template: Review Template</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={handleSave}
                                disabled={!hasChangesMemo || isSaving}
                                size="sm"
                                className="flex items-center gap-2"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        Create Blog
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                    {!hasChangesMemo && (
                        <div className="mt-2 text-sm text-muted-foreground">
                            Fill in the required fields (Firm Name and Title) to create the blog
                        </div>
                    )}
                </div>
            </div>

            {/* Editor Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-muted/30 border border-border rounded-lg p-4 mb-6">
                    <p className="text-sm text-muted-foreground">
                        Click on any field to edit. Fill in the Firm Name and Title, then click &quot;Create Blog&quot; to save.
                    </p>
                </div>

                {/* Editable Sections */}
                <div className="space-y-6">
                    <BasicInfoEditor
                        reviewData={reviewData}
                        onUpdate={handleUpdate}
                    />
                    
                    <OverviewEditor
                        reviewData={reviewData}
                        onUpdate={handleUpdate}
                    />
                    
                    <WhatIsEditor
                        reviewData={reviewData}
                        onUpdate={handleUpdate}
                    />
                    
                    <HowDiffersEditor
                        reviewData={reviewData}
                        onUpdate={handleUpdate}
                    />
                    
                    <ProgramsComparisonEditor
                        reviewData={reviewData}
                        onUpdate={handleUpdate}
                    />
                    
                    <PlatformsEditor
                        reviewData={reviewData}
                        onUpdate={handleUpdate}
                    />
                    
                    <FinalVerdictEditor
                        reviewData={reviewData}
                        onUpdate={handleUpdate}
                    />
                </div>
            </div>
        </div>
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

