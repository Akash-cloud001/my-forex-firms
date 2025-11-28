import { FirmReview } from '@/types/firm-review';

export function getReviewTemplate(): Omit<FirmReview, 'slug'> {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    return {
        firmName: '',
        title: '',
        subtitle: '',
        publishedAt: formattedDate,
        readTime: 0,
        trustScore: 0,
        rating: 0,
        ratingLabel: '',
        introduction: '',
        overview: {
            title: 'Overview – Quick Snapshot',
            icon: 'Star',
            data: {
                left: [
                    { label: 'Firm Name:', value: '' },
                    { label: 'Founded:', value: '' },
                    { label: 'Headquarters:', value: '' },
                    { label: 'Max Funding:', value: '', highlight: true },
                ],
                right: [
                    { label: 'Profit Split:', value: '', highlight: 'success' },
                    { label: 'Trust Score:', value: '', highlight: true },
                    { label: 'Funding Model:', value: '' },
                    { label: 'Best For:', value: '' },
                ],
            },
        },
        whatIs: {
            id: 'what-is',
            title: 'What is [Firm Name]?',
            icon: 'Search',
            content: '',
            highlights: {
                title: 'It aims to offer:',
                items: [],
            },
            conclusion: '',
        },
        howDiffers: {
            id: 'how-differs',
            title: 'How [Firm Name] Differs From Other Prop Firms',
            icon: 'Scale',
            advantages: [],
            limitations: [],
        },
        programsComparison: {
            id: 'programs-comparison',
            title: 'Funding Programs Comparison',
            icon: 'BarChart3',
            headers: ['Criteria', 'Instant Account', '1‑Phase Evaluation', '2‑Phase Evaluation'],
            rows: [
                {
                    criteria: 'Account Sizes',
                    instant: '',
                    phase1: '',
                    phase2: '',
                },
                {
                    criteria: 'Challenge Fee',
                    instant: '',
                    phase1: '',
                    phase2: '',
                },
                {
                    criteria: 'Profit Target',
                    instant: '',
                    phase1: '',
                    phase2: '',
                },
                {
                    criteria: 'Max Drawdown',
                    instant: '',
                    phase1: '',
                    phase2: '',
                },
                {
                    criteria: 'Daily Drawdown',
                    instant: '',
                    phase1: '',
                    phase2: '',
                },
                {
                    criteria: 'Profit Split',
                    instant: '',
                    phase1: '',
                    phase2: '',
                },
                {
                    criteria: 'Time Limit',
                    instant: '',
                    phase1: '',
                    phase2: '',
                },
            ],
        },
        platformsExecution: {
            id: 'platforms-execution',
            title: 'Platforms, Instruments & Execution',
            icon: 'TrendingUp',
            platforms: [],
            instruments: [],
        },
        finalVerdict: {
            id: 'final-verdict',
            title: 'Final Verdict',
            icon: 'Star',
            subtitle: 'Our comprehensive analysis conclusion',
            rating: 0,
            ratingLabel: '',
            strengths: [],
            weaknesses: [],
            recommendation: {
                title: 'Our Recommendation',
                content: '',
                footer: '',
            },
        },
        tableOfContents: [
            { id: 'overview', title: 'Overview – Quick Snapshot', icon: 'Star' },
            { id: 'what-is', title: 'What is [Firm Name]?', icon: 'Search' },
            { id: 'how-differs', title: 'How [Firm Name] Differs', icon: 'Scale' },
            { id: 'programs-comparison', title: 'Programs Comparison', icon: 'BarChart3' },
            { id: 'platforms-execution', title: 'Platforms & Execution', icon: 'TrendingUp' },
            { id: 'final-verdict', title: 'Final Verdict', icon: 'Star' },
        ],
    };
}

