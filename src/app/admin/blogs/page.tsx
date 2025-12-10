"use client";

import React from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Book, Plus, Search, Edit, Eye, Calendar, Clock, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingScreen from '@/components/ui/LoadingScreen';
import TemplateSelectionModal from '@/components/admin/blog-editor/TemplateSelectionModal';
import { FirmReview } from '@/types/firm-review';

export default function AdminBlogsPage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [searchTerm, setSearchTerm] = React.useState('');
    const [blogs, setBlogs] = React.useState<FirmReview[]>([]);
    const [isTemplateModalOpen, setIsTemplateModalOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState<string | null>(null);

    // Check authentication and role
    React.useEffect(() => {
        if (isLoaded && user) {
            const userRole = user.publicMetadata?.role as string | undefined;
            if (!userRole || !['admin', 'editor'].includes(userRole)) {
                router.push('/admin/unauthorized');
            }
        }
    }, [isLoaded, user, router]);

    // Load blogs from API
    React.useEffect(() => {
        const fetchBlogs = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const response = await fetch('/api/admin/firm-reviews');
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Failed to fetch blogs');
                }

                if (data.success && data.reviews) {
                    setBlogs(data.reviews);
                } else {
                    throw new Error('Invalid response format');
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Failed to load blogs';
                setError(errorMessage);
            } finally {
                setIsLoading(false);
            }
        };

        if (isLoaded && user) {
            fetchBlogs();
        }
    }, [isLoaded, user]);

    // Filter blogs based on search term
    const filteredBlogs = React.useMemo(() => {
        if (!searchTerm.trim()) return blogs;
        
        const search = searchTerm.toLowerCase();
        return blogs.filter(blog => 
            blog.title.toLowerCase().includes(search) ||
            blog.firmName.toLowerCase().includes(search) ||
            blog.subtitle.toLowerCase().includes(search) ||
            blog.slug.toLowerCase().includes(search)
        );
    }, [blogs, searchTerm]);

    // Show loading while user data is being fetched
    if (!isLoaded || isLoading) {
        return <LoadingScreen title="Loading..." subtitle={isLoading ? "Loading blogs..." : "Checking permissions..."} />;
    }

    // Check role after user is loaded
    const userRole = user?.publicMetadata?.role as string | undefined;
    if (isLoaded && user && (!userRole || !['admin', 'editor'].includes(userRole))) {
        return null; // Redirect will happen
    }

    // Error state
    if (error) {
        return (
            <div className="p-6">
                <div className="bg-destructive/10 border border-destructive rounded-lg p-4">
                    <p className="text-destructive">{error}</p>
                    <Button onClick={() => window.location.reload()} className="mt-4">
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                        Blog Reviews Management
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Create, edit, and manage firm review blog posts
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {/* <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                            placeholder="Search blogs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 w-64"
                        />
                    </div> */}
                    <Button
                        onClick={() => setIsTemplateModalOpen(true)}
                        className="flex items-center gap-2"
                    >
                        <Plus className="h-4 w-4" />
                        Create New Blog
                    </Button>
                </div>
            </div>

            {/* Blogs List */}
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardHeader>
                    <CardTitle className="text-foreground">
                        All Blog Reviews ({filteredBlogs.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredBlogs.length === 0 ? (
                        <div className="text-center py-12">
                            <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-foreground mb-2">
                                {searchTerm ? 'No blogs found' : 'No blog reviews yet'}
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                {searchTerm 
                                    ? 'Try adjusting your search terms'
                                    : 'Get started by creating your first firm review blog post'
                                }
                            </p>
                            {!searchTerm && (
                                <Button
                                    onClick={() => setIsTemplateModalOpen(true)}
                                    className="flex items-center gap-2 mx-auto"
                                >
                                    <Plus className="h-4 w-4" />
                                    Create New Blog
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border/50">
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Title</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Firm</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Rating</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Published</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Read Time</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBlogs.map((blog) => (
                                        <tr
                                            key={blog.slug}
                                            className="border-b border-border/30 hover:bg-card/30 transition-colors"
                                        >
                                            <td className="py-4 px-4">
                                                <div>
                                                    <h3 className="font-medium text-foreground text-sm">
                                                        {blog.title}
                                                    </h3>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {blog.subtitle}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-foreground font-medium">
                                                        {blog.firmName}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                                    <span className="text-sm text-foreground font-medium">
                                                        {blog.rating}/5.0
                                                    </span>
                                                    <Badge variant="outline" className="text-xs">
                                                        {blog.trustScore}/10
                                                    </Badge>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Calendar className="h-4 w-4" />
                                                    {blog.publishedAt}
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Clock className="h-4 w-4" />
                                                    {blog.readTime} min
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8"
                                                    >
                                                        <Link href={`/blogs/edit/${blog.slug}`} className="flex items-center gap-2">
                                                            <Edit className="h-4 w-4" />
                                                            Edit
                                                        </Link>
                                                    </Button>
                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8"
                                                    >
                                                        <Link href={`/blogs/${blog.slug}`} target="_blank" className="flex items-center gap-2">
                                                            <Eye className="h-4 w-4" />
                                                            View
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Template Selection Modal */}
            <TemplateSelectionModal
                open={isTemplateModalOpen}
                onOpenChange={setIsTemplateModalOpen}
            />
        </div>
    );
}

