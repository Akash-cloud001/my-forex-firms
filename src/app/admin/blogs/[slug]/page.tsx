"use client";

import React from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Eye, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import LoadingScreen from '@/components/ui/LoadingScreen';
import { FirmReview } from '@/types/firm-review';
import BasicInfoEditor from '@/components/admin/blog-editor/sections/BasicInfoEditor';
import OverviewEditor from '@/components/admin/blog-editor/sections/OverviewEditor';
import WhatIsEditor from '@/components/admin/blog-editor/sections/WhatIsEditor';
import HowDiffersEditor from '@/components/admin/blog-editor/sections/HowDiffersEditor';
import ProgramsComparisonEditor from '@/components/admin/blog-editor/sections/ProgramsComparisonEditor';
import PlatformsEditor from '@/components/admin/blog-editor/sections/PlatformsEditor';
import FinalVerdictEditor from '@/components/admin/blog-editor/sections/FinalVerdictEditor';

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
                    // Deep clone the data to track original
                    const clonedData = JSON.parse(JSON.stringify(data.review));
                    setReviewData(clonedData);
                    setOriginalData(clonedData);
                } else {
                    throw new Error('Invalid response format');
                }
            } catch (error) {
                console.error('Error fetching review:', error);
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

            // Update original data after successful save
            setOriginalData(JSON.parse(JSON.stringify(reviewData)));
            toast.success('Review updated successfully!');
        } catch (error) {
            console.error('Error saving review:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to save review. Please try again.';
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
                                <h1 className="text-2xl font-bold text-foreground">Edit: {reviewData.title}</h1>
                                <p className="text-sm text-muted-foreground">Click on any field to edit its content. Save changes when done.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                asChild
                            >
                                <Link href={`/blogs/${slug}`} target="_blank" className="text-foreground/80 flex items-center gap-2">
                                    <Eye className="h-4 w-4" />
                                    Preview
                                </Link>
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={!hasChanges || isSaving}
                                size="sm"
                                className="flex items-center gap-2"
                            >
                                {isSaving ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                    {hasChanges && (
                        <div className="mt-2 text-sm text-yellow-600 dark:text-yellow-400">
                            You have unsaved changes
                        </div>
                    )}
                </div>
            </div>

            {/* Editor Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-muted/30 border border-border rounded-lg p-4 mb-6">
                    <p className="text-sm text-muted-foreground">
                        Click on any field to edit. Changes will be saved when you click &quot;Save Changes&quot;.
                    </p>
                </div>

                {/* Editable Sections */}
                {reviewData && (
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
                )}
            </div>
        </div>
    );
}

