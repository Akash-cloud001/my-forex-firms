"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Star, CheckCircle, XCircle, Share2, Bookmark, Search, Scale, BarChart3, TrendingUp, List, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface BlogPageProps {
    params: Promise<{ blog_id: string }>;
}

export default function BlogDetailPage({ params }: BlogPageProps) {
    const [activeSection, setActiveSection] = React.useState('overview');
    const [isMobileTocOpen, setIsMobileTocOpen] = React.useState(false);

    // Table of contents data
    const tableOfContents = React.useMemo(() => [
        { id: 'overview', title: 'Overview – Quick Snapshot', icon: Star },
        { id: 'what-is-funding-pips', title: 'What is Funding Pips?', icon: Search },
        { id: 'how-differs', title: 'How Funding Pips Differs', icon: Scale },
        { id: 'programs-comparison', title: 'Programs Comparison', icon: BarChart3 },
        { id: 'platforms-execution', title: 'Platforms & Execution', icon: TrendingUp },
        { id: 'final-verdict', title: 'Final Verdict', icon: Star },
    ], []);

    // For now, we'll show the Funding Pips review for any blog_id
    // In a real implementation, you'd fetch blog data based on the ID
    React.useEffect(() => {
        params.then(({ blog_id }) => {
            console.log('Blog ID:', blog_id);
        });
    }, [params]);

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
                            className="rounded-full shadow-lg bg-primary hover:bg-primary/90"
                        >
                            {isMobileTocOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>

                    {/* Mobile Table of Contents Overlay */}
                    {isMobileTocOpen && (
                        <div className="fixed inset-0 z-40 xl:hidden">
                            <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileTocOpen(false)} />
                            <div className="absolute bottom-24 right-6 bg-background border border-border rounded-lg p-4 w-80 max-h-[60vh] overflow-y-auto shadow-xl">
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
                                                className={`w-full flex items-center gap-3 p-3 rounded-md text-left text-sm transition-all duration-200 hover:bg-accent/50 ${activeSection === item.id
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
                                    variant="ghost"
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
                                    <Button variant="ghost" size="sm" className='text-primary/90 font-medium hover:text-primary transition-all duration-300'>
                                        <Bookmark className="h-4 w-4" />
                                        <span className='hidden sm:inline'>Save</span>
                                    </Button>
                                </div>
                            </div>
                            {/* Article Meta */}
                            <div className="">
                                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                                    Funding Pips Review 2025
                                </h1>
                                <p className="text-lg sm:text-xl text-white/80 max-w-3xl font-light">
                                    Honest, Deep & Complete Analysis
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-white/60 pt-5">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>November 27, 2024</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="h-4 w-4" />
                                    <span>12 min read</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                <span className="font-semibold text-foreground">Trust Score: 8.4/10</span>
                            </div>
                        </div>
                    </section>

                    {/* Article Content */}
                    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

                        {/* Introduction */}
                        <div className="prose prose-lg max-w-none mb-12">
                            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                                Is Funding Pips really a trader‑friendly prop firm, or just another hype-driven evaluation company?
                                After researching their rules, payout structure, trader feedback, risk parameters, and comparing them
                                with top prop firms in 2025, this is the most honest, complete, and data-based Funding Pips review
                                you&apos;ll read this year.
                            </p>
                        </div>

                        {/* Quick Snapshot Card */}
                        <Card id="overview" className="mb-12 card-custom-grad border-border">
                            <CardContent className="p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <Star className="h-6 w-6 text-primary" />
                                    <h2 className="text-2xl font-bold text-foreground">Overview – Quick Snapshot</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-2 border-b border-border/50">
                                            <span className="text-muted-foreground">Firm Name:</span>
                                            <span className="font-semibold text-foreground">Funding Pips</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-border/50">
                                            <span className="text-muted-foreground">Founded:</span>
                                            <span className="text-right font-semibold text-foreground">2022</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-border/50">
                                            <span className="text-muted-foreground">Headquarters:</span>
                                            <span className="text-right font-semibold text-foreground">UAE</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-border/50">
                                            <span className="text-muted-foreground">Max Funding:</span>
                                            <span className="text-right font-semibold text-primary">$200,000</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center py-2 border-b border-border/50">
                                            <span className="text-muted-foreground">Profit Split:</span>
                                            <span className="text-right font-semibold text-success">Up to 85%–100%</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-border/50">
                                            <span className="text-muted-foreground">Trust Score:</span>
                                            <span className="text-right  font-semibold text-primary">8.4/10</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-border/50">
                                            <span className="text-muted-foreground">Funding Model:</span>
                                            <span className="text-right font-semibold text-foreground">Instant, 1‑Phase & 2‑Phase</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-border/50">
                                            <span className="text-muted-foreground">Best For:</span>
                                            <span className="text-right  font-semibold text-foreground">Scalpers, Day Traders, EA</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* What is Funding Pips */}
                        <section id="what-is-funding-pips" className="mb-12">
                            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                                <Search className="h-6 sm:h-8 w-6 sm:w-8 text-primary" />
                                What is Funding Pips?
                            </h2>
                            <div className="prose prose-lg max-w-none text-muted-foreground">
                                <p className="mb-4">
                                    Funding Pips is a forex and CFD proprietary trading firm that funds traders after they complete
                                    an evaluation challenge. They provide access to funding capital, trading platforms like MT5,
                                    cTrader, and MatchTrader, and allow traders to keep up to 85–100% of their profits.
                                </p>

                                <div className="bg-accent/20 border border-accent/30 rounded-lg p-6 my-6">
                                    <h4 className="font-semibold text-foreground mb-3">It aims to offer:</h4>
                                    <ul className="space-y-2">
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-success shrink-0" />
                                            Simple rule structure
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-success shrink-0" />
                                            Flexible time limits (unlimited days)
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-success shrink-0" />
                                            Affordable challenge fees
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-success shrink-0" />
                                            Fast verification & payouts
                                        </li>
                                    </ul>
                                </div>

                                <p>
                                    For many traders, Funding Pips has become one of the easiest-to-pass 1-phase evaluation prop firms.
                                </p>
                            </div>
                        </section>

                        {/* How Funding Pips Differs */}
                        <section id="how-differs" className="mb-12">
                            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                                <Scale className="h-8 w-8 text-primary" />
                                How Funding Pips Differs From Other Prop Firms
                            </h2>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Pros */}
                                <Card className="border-green-500/20 bg-green-500/5">
                                    <CardContent className="p-6">
                                        <h3 className="font-semibold text-success mb-4 flex items-center gap-2">
                                            <CheckCircle className="h-5 w-5" />
                                            Advantages
                                        </h3>
                                        <ul className="space-y-3">
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" />
                                                <div>
                                                    <strong>No time limits on evaluation</strong>
                                                    <p className="text-sm text-muted-foreground">Big plus for swing traders or low frequency traders.</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" />
                                                <div>
                                                    <strong>Flexible account options</strong>
                                                    <p className="text-sm text-muted-foreground">Choose instant funding, 1-step or 2-step.</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" />
                                                <div>
                                                    <strong>Competitive profit splits</strong>
                                                    <p className="text-sm text-muted-foreground">Up to 85–100% depending on model.</p>
                                                </div>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" />
                                                <div>
                                                    <strong>Strong community reputation</strong>
                                                    <p className="text-sm text-muted-foreground">Fast support, transparent rules, good payout history.</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>

                                {/* Cons */}
                                <Card className="border-red-500/20 bg-red-500/5">
                                    <CardContent className="p-6">
                                        <h3 className="font-semibold text-red-500 mb-4 flex items-center gap-2">
                                            <XCircle className="h-5 w-5" />
                                            Limitations
                                        </h3>
                                        <ul className="space-y-3">
                                            <li className="flex items-start gap-2">
                                                <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                                <div>
                                                    <strong>Not suitable for high-frequency traders</strong>
                                                    <p className="text-sm text-muted-foreground">HFT, grid bots, latency arbitrage not allowed.</p>
                                                </div>
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>
                        </section>

                        {/* Program Comparison Table */}
                        <section id="programs-comparison" className="mb-12">
                            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                                <BarChart3 className="h-8 w-8 text-primary" />
                                Funding Programs Comparison
                            </h2>

                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse border border-border rounded-lg overflow-hidden text-foreground">
                                    <thead>
                                        <tr className="bg-accent/20">
                                            <th className="text-sm sm:text-base border border-border p-4 text-left font-semibold">Criteria</th>
                                            <th className="text-sm sm:text-base border border-border p-4 text-center font-semibold">Instant Account</th>
                                            <th className="text-sm sm:text-base border border-border p-4 text-center font-semibold">1‑Phase Evaluation</th>
                                            <th className="text-sm sm:text-base border border-border p-4 text-center font-semibold">2‑Phase Evaluation</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border border-border p-4 text-sm sm:text-base font-medium">Account Sizes</td>
                                            <td className="border border-border p-4 text-sm sm:text-base text-center">$10k–$200k</td>
                                            <td className="border border-border p-4 text-center text-sm sm:text-base">$10k–$200k</td>
                                            <td className="border border-border p-4 text-sm sm:text-base text-center">$10k–$200k</td>
                                        </tr>
                                        <tr className="bg-accent/10">
                                            <td className="border border-border p-4 text-sm sm:text-base font-medium">Challenge Fee</td>
                                            <td className="border border-border p-4 text-center text-sm sm:text-base text-red-500">Highest</td>
                                            <td className="border border-border p-4 text-center text-sm sm:text-base text-yellow-500">Moderate</td>
                                            <td className="border border-border p-4 text-center text-sm sm:text-base text-success">Lowest</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-border p-4 text-sm sm:text-base font-medium">Profit Target</td>
                                            <td className="border border-border p-4 text-center text-sm sm:text-base">N/A</td>
                                            <td className="border border-border p-4 text-center text-sm sm:text-base">8–10%</td>
                                            <td className="border border-border p-4 text-center text-sm sm:text-base">Phase 1: 8% / Phase 2: 5%</td>
                                        </tr>
                                        <tr className="bg-accent/10">
                                            <td className="border border-border p-4 text-sm sm:text-base font-medium">Max Drawdown</td>
                                            <td className="border border-border p-4 text-center text-sm sm:text-base">6%</td>
                                            <td className="border border-border p-4 text-center text-sm sm:text-base">6%</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-border p-4 text-sm sm:text-base font-medium">Daily Drawdown</td>
                                            <td className="border border-border p-4 text-center text-sm sm:text-base">3%</td>
                                            <td className="border border-border p-4 text-center text-sm sm:text-base">3%</td>
                                        </tr>
                                        <tr className="bg-accent/10">
                                            <td className="border border-border p-4 text-sm sm:text-base font-medium">Profit Split</td>
                                            <td className="border border-border p-4 text-center text-sm sm:text-base">50–70%</td>
                                            <td className="border border-border p-4 text-center text-sm sm:text-base text-success">Up to 85%</td>
                                            <td className="border border-border p-4 text-center text-sm sm:text-base text-success">Up to 85%</td>
                                        </tr>
                                        <tr>
                                            <td className="border border-border p-4 text-sm sm:text-base font-medium">Time Limit</td>
                                            <td className="border border-border p-4 text-center text-sm sm:text-base text-success">Unlimited</td>
                                            <td className="border border-border p-4 text-center text-sm sm:text-base text-success">Unlimited</td>
                                            <td className="border border-border p-4 text-center text-sm sm:text-base text-success">Unlimited</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* Platforms & Execution */}
                        <section id="platforms-execution" className="mb-12">
                            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
                                <TrendingUp className="h-8 w-8 text-primary" />
                                Platforms, Instruments & Execution
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <Card className="card-custom-grad border-border">
                                    <CardContent className="p-6">
                                        <h3 className="font-semibold text-foreground mb-4">Trading Platforms</h3>
                                        <ul className="space-y-2">
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-success" />
                                                MetaTrader 5 (MT5)
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-success" />
                                                cTrader
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-success" />
                                                MatchTrader
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>

                                <Card className="card-custom-grad border-border">
                                    <CardContent className="p-6">
                                        <h3 className="font-semibold text-foreground mb-4">Available Instruments</h3>
                                        <ul className="space-y-2">
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-success" />
                                                Forex (majors/minors)
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-success" />
                                                Gold & metals
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-success" />
                                                Indices (US30, NAS100, GER40)
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-success" />
                                                Crypto CFDs
                                            </li>
                                            <li className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-success" />
                                                Commodities
                                            </li>
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>
                        </section>

                        {/* Final Verdict */}
                        <section id="final-verdict" className="mb-12">
                            <Card className="relative overflow-hidden  border border-white/10 bg-linear-to-br from-black/80 via-neutral-900/80 to-black/70">
                                <div className="absolute inset-0 bg-linear-to-b from-white/5 via-transparent to-black/60 pointer-events-none" />
                                <div className="absolute -left-24 top-6 h-60 w-60 rounded-full bg-[#F66435]/20 blur-[120px]" />
                                <div className="absolute -right-24 bottom-6 h-60 w-60 rounded-full bg-[#F66435]/25 blur-[120px]" />
                                <CardContent className="relative p-8 z-10">
                                    {/* Header Section */}
                                    <div className="text-center mb-8">
                                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/20 border border-primary/30 mb-4">
                                            <Star className="h-10 w-10 text-primary fill-current" />
                                        </div>
                                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text mb-2">Final Verdict</h2>
                                        <p className="text-white/60 text-base sm:text-lg">Our comprehensive analysis conclusion</p>
                                    </div>

                                    {/* Rating Section */}
                                    <div className="text-center mb-8">
                                        <div className="inline-flex flex-col items-center bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="text-4xl sm:text-4xl md:text-5xl font-bold gradient-text">4.3</span>
                                                <div className="text-left">
                                                    <div className="flex mb-1">
                                                        {[1, 2, 3, 4].map((star) => (
                                                            <Star key={star} className="h-4 sm:h-5 md:h-6 w-4 sm:w-5 md:w-6 text-yellow-400 fill-current" />
                                                        ))}
                                                        <Star className="h-4 sm:h-5 md:h-6 w-4 sm:w-5 md:w-6 text-white/30" />
                                                    </div>
                                                    <p className="text-white/60 text-xs sm:text-sm">out of 5.0</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs sm:text-sm text-white/80">
                                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                                <span>Highly Recommended</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Key Strengths */}
                                    <div className="mb-8">
                                        <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 text-center">Why Funding Pips Stands Out</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                                        <CheckCircle className="h-4 w-4 text-green-400" />
                                                    </div>
                                                    <span className="font-medium text-white">Flexible Evaluation</span>
                                                </div>
                                                <p className="text-white/70 text-sm">Multiple program options with unlimited time limits</p>
                                            </div>

                                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                                        <CheckCircle className="h-4 w-4 text-green-400" />
                                                    </div>
                                                    <span className="font-medium text-white">High Profit Split</span>
                                                </div>
                                                <p className="text-white/70 text-sm">Up to 85-100% profit sharing for traders</p>
                                            </div>

                                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                                        <CheckCircle className="h-4 w-4 text-green-400" />
                                                    </div>
                                                    <span className="font-medium text-white">Reliable Payouts</span>
                                                </div>
                                                <p className="text-white/70 text-sm">Consistent payout history with fast processing</p>
                                            </div>

                                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                                        <CheckCircle className="h-4 w-4 text-green-400" />
                                                    </div>
                                                    <span className="font-medium text-white">Simple Rules</span>
                                                </div>
                                                <p className="text-white/70 text-sm">Easy-to-understand guidelines for all traders</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Final Recommendation */}
                                    <div className="bg-linear-to-r from-green-500/10 via-green-500/5 to-green-500/10 border border-green-500/20 rounded-2xl p-6 text-center">
                                        <div className="flex items-center justify-center gap-2 mb-4">
                                            <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                                <CheckCircle className="h-5 w-5 text-green-400" />
                                            </div>
                                            <h3 className="text-lg sm:text-xl font-semibold text-green-400">Our Recommendation</h3>
                                        </div>
                                        <p className="text-white/80 text-sm sm:text-base md:text-lg leading-relaxed mb-6">
                                            If your strategy is compliant and you prefer <span className="text-white font-medium">low-stress evaluations</span>,
                                            Funding Pips is one of the <span className="text-primary font-medium">best 1‑phase evaluation prop firms</span> to
                                            consider in 2025.
                                        </p>
                                        <span className="text-white font-medium text-sm sm:text-base ">Start small, test execution, then scale</span>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>
                    </section>
                </article>
            </div>
        </div>
    );
}
