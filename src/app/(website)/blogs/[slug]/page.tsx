"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Star, CheckCircle, XCircle, Share2, Search, Scale, BarChart3, TrendingUp, List, Menu, X, LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TableOfContentsItem } from '@/types/firm-review';
import { useBlog } from '@/stores/blogStore';
import LoadingScreen from '@/components/ui/LoadingScreen';
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
                {/* Table of Contents - Fixed Sidebar */}
                <div className="min-h-screen z-40 hidden xl:inline-block col-span-3">
                    <div className="sticky left-4 top-1/2 -translate-y-1/2  bg-background/80 backdrop-blur-sm border border-border rounded-lg p-4 w-64 max-h-[70vh] overflow-y-auto">
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
                            <List className="h-4 w-4 text-primary" />
                            <span className="font-semibold text-foreground text-sm">Table of Contents</span>
                        </div>
                        <nav className="space-y-2">
                            {tableOfContents.map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => scrollToSection(item.id)}
                                        className={`w-full flex items-center gap-3 p-2 rounded-md text-left text-xs transition-all duration-200 hover:bg-accent/50 ${activeSection === item.id
                                                ? 'bg-primary/10 text-primary border-l-2 border-primary'
                                                : 'text-muted-foreground hover:text-foreground'
                                            }`}
                                    >
                                        <IconComponent className="h-4 w-4 shrink-0" />
                                        <span className="truncate">{item.title}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </div>
                </div>

                {/* Main Content Area */}
                <article className="col-span-12 xl:col-span-8">

                    {/* Mobile Table of Contents Button */}
                    <div className="fixed bottom-6 left-6 z-50 xl:hidden">
                        <Button
                            onClick={() => setIsMobileTocOpen(!isMobileTocOpen)}
                            size="lg"
                            className="rounded-full h-10 w-10 shadow-lg bg-primary hover:bg-primary/90"
                        >
                            {isMobileTocOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                        </Button>
                    </div>

                    {/* Mobile Table of Contents Overlay */}
                    {isMobileTocOpen && (
                        <div className="fixed inset-0 z-40 xl:hidden">
                            <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileTocOpen(false)} />
                            <div className="absolute bottom-20 left-8 bg-background border border-border rounded-lg p-4 w-80 max-h-[60vh] overflow-y-auto shadow-xl max-w-2xs">
                                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-border">
                                    <List className="h-4 w-4 text-primary" />
                                    <span className="font-semibold text-foreground text-sm">Table of Contents</span>
                                </div>
                                <nav className="space-y-2">
                                    {tableOfContents.map((item) => {
                                        const IconComponent = item.icon;
                                        return (
                                            <button
                                                key={item.id}
                                                onClick={() => scrollToSection(item.id)}
                                                className={`w-full flex items-center gap-3 p-3 rounded-md text-left text-xs transition-all duration-200 hover:bg-accent/50 ${activeSection === item.id
                                                        ? 'bg-primary/10 text-primary border-l-2 border-primary'
                                                        : 'text-muted-foreground hover:text-foreground'
                                                    }`}
                                            >
                                                <IconComponent className="h-4 w-4 shrink-0" />
                                                <span className="truncate">{item.title}</span>
                                            </button>
                                        );
                                    })}
                                </nav>
                            </div>
                        </div>
                    )}

                    {/* Hero Section with Header Image */}
                    <section className="relative overflow-hidden max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                        <div className="w-full ">
                            <div className="flex items-center justify-between mb-8">
                                {/* Back Button */}
                                <Button
                                    asChild
                                    variant="link"
                                    className=" text-white/80 hover:text-white hover:bg-white/10"
                                >
                                    <Link href="/blogs" className="flex items-center gap-2">
                                        <ArrowLeft className="h-4 w-4" />
                                        Back to Blogs
                                    </Link>
                                </Button>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" className='text-primary/90 font-medium hover:text-primary transition-all duration-300'>
                                        <Share2 className="h-4 w-4" />
                                        <span className='hidden sm:inline'>Share</span>
                                    </Button>
                                    {/* <Button variant="ghost" size="sm" className='text-primary/90 font-medium hover:text-primary transition-all duration-300'>
                                        <Bookmark className="h-4 w-4" />
                                        <span className='hidden sm:inline'>Save</span>
                                    </Button> */}
                                </div>
                            </div>
                            {/* Article Meta */}
                            <div className="">
                                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                                    {reviewData?.title || 'Loading...'}
                                </h1>
                                <p className="text-lg sm:text-xl text-white/80 max-w-3xl font-light">
                                    {reviewData?.subtitle || ''}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-white/60 pt-5">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{reviewData?.publishedAt || ''}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>{reviewData?.readTime || 0} min read</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="font-semibold text-foreground">Trust Score: {reviewData?.trustScore || 0}/10</span>
                            </div>
                        </div>
                    </section>

                    {/* Article Content */}
                    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

                        {/* Introduction */}
                        {reviewData?.introduction && (
                            <div className="prose prose-lg max-w-none mb-12">
                                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                                    {reviewData.introduction}
                                </p>
                            </div>
                        )}

                        {/* Quick Snapshot Card */}
                        {reviewData?.overview && (
                            <Card id="overview" className="mb-12 card-custom-grad border-border">
                                <CardContent className="p-8">
                                    <div className="flex items-center gap-3 mb-6">
                                        {React.createElement(iconMap[reviewData.overview.icon] || Star, { className: "h-6 w-6 text-primary" })}
                                        <h2 className="text-2xl font-bold text-foreground">{reviewData.overview.title}</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            {reviewData.overview.data.left.map((item, index) => (
                                                <div key={index} className="flex justify-between items-center py-2 border-b border-border/50">
                                                    <span className="text-muted-foreground">{item.label}</span>
                                                    <span className={`text-right font-semibold ${item.highlight ? 'text-primary' : 'text-foreground'}`}>
                                                        {item.value}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="space-y-4">
                                            {reviewData.overview.data.right.map((item, index) => (
                                                <div key={index} className="flex justify-between items-center py-2 border-b border-border/50">
                                                    <span className="text-muted-foreground">{item.label}</span>
                                                    <span className={`text-right font-semibold ${
                                                        item.highlight === 'success' ? 'text-green-400' : 
                                                        item.highlight ? 'text-primary' : 
                                                        'text-foreground'
                                                    }`}>
                                                        {item.value}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* What is Section */}
                        {reviewData?.whatIs && (
                            <section id={reviewData.whatIs.id} className="mb-12">
                                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    {React.createElement(iconMap[reviewData.whatIs.icon] || Search, { className: "h-6 sm:h-8 w-6 sm:w-8 text-primary" })}
                                    {reviewData.whatIs.title}
                                </h2>
                                <div className="prose prose-lg max-w-none text-muted-foreground">
                                    <p className="mb-4">
                                        {reviewData.whatIs.content}
                                    </p>

                                    {reviewData.whatIs.highlights && (
                                        <div className="bg-accent/20 border border-accent/30 rounded-lg p-6 my-6">
                                            <h4 className="font-semibold text-foreground mb-3">{reviewData.whatIs.highlights.title}</h4>
                                            <ul className="space-y-2">
                                                {reviewData.whatIs.highlights.items.map((item: string, index: number) => (
                                                    <li key={index} className="flex items-center gap-2">
                                                        <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {reviewData.whatIs.conclusion && (
                                        <p>
                                            {reviewData.whatIs.conclusion}
                                        </p>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* How Differs Section */}
                        {reviewData?.howDiffers && (
                            <section id={reviewData.howDiffers.id} className="mb-12">
                                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    {React.createElement(iconMap[reviewData.howDiffers.icon] || Scale, { className: "h-8 w-8 text-primary" })}
                                    {reviewData.howDiffers.title}
                                </h2>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Advantages */}
                                    {reviewData.howDiffers.advantages && reviewData.howDiffers.advantages.length > 0 && (
                                        <Card className="border-green-500/20 bg-green-500/5">
                                            <CardContent className="p-6">
                                                <h3 className="font-semibold text-green-400 mb-4 flex items-center gap-2">
                                                    <CheckCircle className="h-5 w-5" />
                                                    Advantages
                                                </h3>
                                                <ul className="space-y-3">
                                                    {reviewData.howDiffers.advantages.map((item, index) => (
                                                        <li key={index} className="flex items-start gap-2">
                                                            <CheckCircle className="h-4 w-4 text-green-400 shrink-0 mt-0.5" />
                                                            <div>
                                                                <strong>{item.title}</strong>
                                                                {item.description && (
                                                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                                                )}
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {/* Limitations */}
                                    {reviewData.howDiffers.limitations && reviewData.howDiffers.limitations.length > 0 && (
                                        <Card className="border-red-500/20 bg-red-500/5">
                                            <CardContent className="p-6">
                                                <h3 className="font-semibold text-red-500 mb-4 flex items-center gap-2">
                                                    <XCircle className="h-5 w-5" />
                                                    Limitations
                                                </h3>
                                                <ul className="space-y-3">
                                                    {reviewData.howDiffers.limitations.map((item, index) => (
                                                        <li key={index} className="flex items-start gap-2">
                                                            <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                                            <div>
                                                                <strong>{item.title}</strong>
                                                                {item.description && (
                                                                    <p className="text-sm text-muted-foreground">{item.description}</p>
                                                                )}
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Program Comparison Table */}
                        {reviewData?.programsComparison && (
                            <section id={reviewData.programsComparison.id} className="mb-12">
                                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    {React.createElement(iconMap[reviewData.programsComparison.icon] || BarChart3, { className: "h-8 w-8 text-primary" })}
                                    {reviewData.programsComparison.title}
                                </h2>

                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse border border-border rounded-lg overflow-hidden text-foreground">
                                        <thead>
                                            <tr className="bg-accent/20">
                                                {reviewData.programsComparison.headers.map((header: string, index: number) => (
                                                    <th 
                                                        key={index} 
                                                        className={`text-sm sm:text-base border border-border p-4 ${index === 0 ? 'text-left' : 'text-center'} font-semibold`}
                                                    >
                                                        {header}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {reviewData.programsComparison.rows.map((row, rowIndex) => (
                                                <tr key={rowIndex} className={rowIndex % 2 === 1 ? 'bg-accent/10' : ''}>
                                                    <td className="border border-border p-4 text-sm sm:text-base font-medium">{row.criteria}</td>
                                                    <td className={`border border-border p-4 text-sm sm:text-base text-center ${
                                                        row.instantHighlight === 'red' ? 'text-red-500' :
                                                        row.instantHighlight === 'yellow' ? 'text-yellow-500' :
                                                        row.instantHighlight === 'success' ? 'text-green-400' : ''
                                                    }`}>
                                                        {row.instant || ''}
                                                    </td>
                                                    <td className={`border border-border p-4 text-center text-sm sm:text-base ${
                                                        row.phase1Highlight === 'red' ? 'text-red-500' :
                                                        row.phase1Highlight === 'yellow' ? 'text-yellow-500' :
                                                        row.phase1Highlight === 'success' ? 'text-green-400' : ''
                                                    }`}>
                                                        {row.phase1 || ''}
                                                    </td>
                                                    <td className={`border border-border p-4 text-sm sm:text-base text-center ${
                                                        row.phase2Highlight === 'red' ? 'text-red-500' :
                                                        row.phase2Highlight === 'yellow' ? 'text-yellow-500' :
                                                        row.phase2Highlight === 'success' ? 'text-green-400' : ''
                                                    }`}>
                                                        {row.phase2 || ''}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        )}

                        {/* Platforms & Execution */}
                        {reviewData?.platformsExecution && (
                            <section id={reviewData.platformsExecution.id} className="mb-12">
                                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                                    {React.createElement(iconMap[reviewData.platformsExecution.icon] || TrendingUp, { className: "h-8 w-8 text-primary" })}
                                    {reviewData.platformsExecution.title}
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {reviewData.platformsExecution.platforms && reviewData.platformsExecution.platforms.length > 0 && (
                                        <Card className="card-custom-grad border-border">
                                            <CardContent className="p-6">
                                                <h3 className="font-semibold text-foreground mb-4">Trading Platforms</h3>
                                                <ul className="space-y-2">
                                                    {reviewData.platformsExecution.platforms.map((platform: string, index: number) => (
                                                        <li key={index} className="flex items-center gap-2">
                                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                                            {platform}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {reviewData.platformsExecution.instruments && reviewData.platformsExecution.instruments.length > 0 && (
                                        <Card className="card-custom-grad border-border">
                                            <CardContent className="p-6">
                                                <h3 className="font-semibold text-foreground mb-4">Available Instruments</h3>
                                                <ul className="space-y-2">
                                                    {reviewData.platformsExecution.instruments.map((instrument: string, index: number) => (
                                                        <li key={index} className="flex items-center gap-2">
                                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                                            {instrument}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </CardContent>
                                        </Card>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Final Verdict */}
                        {reviewData?.finalVerdict && (
                            <section id={reviewData.finalVerdict.id} className="mb-12">
                                <Card className="relative overflow-hidden  border border-white/10 bg-linear-to-br from-black/80 via-neutral-900/80 to-black/70">
                                    <div className="absolute inset-0 bg-linear-to-b from-white/5 via-transparent to-black/60 pointer-events-none" />
                                    <div className="absolute -left-24 top-6 h-60 w-60 rounded-full bg-[#F66435]/20 blur-[120px]" />
                                    <div className="absolute -right-24 bottom-6 h-60 w-60 rounded-full bg-[#F66435]/25 blur-[120px]" />
                                    <CardContent className="relative p-8 z-10">
                                        {/* Header Section */}
                                        <div className="text-center mb-8">
                                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 border border-primary/30 mb-4">
                                                {React.createElement(iconMap[reviewData.finalVerdict.icon] || Star, { className: "h-10 w-10 text-primary fill-current" })}
                                            </div>
                                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-2">{reviewData.finalVerdict.title}</h2>
                                            <p className="text-white/60 text-base sm:text-lg">{reviewData.finalVerdict.subtitle}</p>
                                        </div>

                                        {/* Rating Section */}
                                        <div className="text-center mb-8">
                                            <div className="inline-flex flex-col items-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="text-4xl sm:text-4xl md:text-5xl font-bold gradient-text">{reviewData.finalVerdict.rating}</span>
                                                    <div className="text-left">
                                                        <div className="flex mb-1">
                                                            {[1, 2, 3, 4, 5].map((star) => (
                                                                <Star 
                                                                    key={star} 
                                                                    className={`h-4 sm:h-5 md:h-6 w-4 sm:w-5 md:w-6 ${
                                                                        star <= Math.round(reviewData.finalVerdict.rating) 
                                                                            ? 'text-yellow-400 fill-current' 
                                                                            : 'text-white/30'
                                                                    }`} 
                                                                />
                                                            ))}
                                                        </div>
                                                        <p className="text-white/60 text-xs sm:text-sm">out of 5.0</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs sm:text-sm text-white/80">
                                                    <div className="w-2 h-2 bg-success rounded-full"></div>
                                                    <span>{reviewData.finalVerdict.ratingLabel}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Key Strengths */}
                                        {reviewData.finalVerdict.strengths && reviewData.finalVerdict.strengths.length > 0 && (
                                            <div className="mb-8">
                                                <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 text-center">Why {reviewData.firmName} Stands Out</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {reviewData.finalVerdict.strengths.map((strength, index) => (
                                                        <div key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                                                    <CheckCircle className="h-4 w-4 text-green-400" />
                                                                </div>
                                                                <span className="font-medium text-white">{strength.title}</span>
                                                            </div>
                                                            <p className="text-white/70 text-sm">{strength.description}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Key Weaknesses */}
                                        {reviewData.finalVerdict.weaknesses && reviewData.finalVerdict.weaknesses.length > 0 && (
                                            <div className="mb-8">
                                                <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 text-center">Areas for Improvement</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {reviewData.finalVerdict.weaknesses.map((weakness, index) => (
                                                        <div key={index} className="bg-white/5 backdrop-blur-sm border border-red-500/20 rounded-xl p-4">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                                                                    <XCircle className="h-4 w-4 text-red-400" />
                                                                </div>
                                                                <span className="font-medium text-white">{weakness.title}</span>
                                                            </div>
                                                            <p className="text-white/70 text-sm">{weakness.description}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Final Recommendation */}
                                        {reviewData.finalVerdict.recommendation && (
                                            <div className="bg-linear-to-r from-green-500/10 via-green-500/5 to-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center">
                                                <div className="flex items-center justify-center gap-2 mb-4">
                                                    <div className="w-8 h-8 rounded-full bg-green-500/20 items-center justify-center hidden sm:flex">
                                                        <CheckCircle className="h-5 w-5 text-green-400" />
                                                    </div>
                                                    <h3 className="text-lg sm:text-xl font-semibold text-green-400">{reviewData.finalVerdict.recommendation.title}</h3>
                                                </div>
                                                <p className="text-white/80 text-sm sm:text-base md:text-lg leading-relaxed mb-6">
                                                    {reviewData.finalVerdict.recommendation.content}
                                                </p>
                                                {reviewData.finalVerdict.recommendation.footer && (
                                                    <span className="text-white font-medium text-sm sm:text-base">{reviewData.finalVerdict.recommendation.footer}</span>
                                                )}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </section>
                        )}
                    </section>
                </article>
            </div>
        </div>
    );
}
