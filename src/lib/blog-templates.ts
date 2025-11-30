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
        // ✅ NEW SECTION 1: Payouts & Withdrawal
        payoutsWithdrawal: {
            id: 'payouts-withdrawal',
            title: 'Payouts, Profit Split & Withdrawal Process',
            icon: 'DollarSign',
            profitSplit: '',
            firstPayout: '',
            subsequentPayouts: '',
            payoutMethods: [],
            payoutSpeed: '',
            payoutProof: '',
            notes: '',
        },
        // ✅ NEW SECTION 2: Support & Reputation
        supportReputation: {
            id: 'support-reputation',
            title: 'Support & Reputation',
            icon: 'Users',
            supportQuality: {
                responseTime: '',
                description: '',
            },
            ratings: {
                trustpilot: 0,
                communitySize: '',
            },
            mostLoved: [],
            mostComplained: [],
        },
        // ✅ NEW SECTION 3: Trader Feedback
        traderFeedback: {
            id: 'trader-feedback',
            title: 'Trader Feedback – Real User Sentiment',
            icon: 'MessageCircle',
            praised: [],
            complaints: [],
        },
        // ✅ NEW SECTION 4: Pros & Cons
        prosCons: {
            id: 'pros-cons',
            title: 'Pros & Cons',
            icon: 'CheckCircle',
            pros: [],
            cons: [],
        },
        // ✅ NEW SECTION 5: Red Flags
        redFlags: {
            id: 'red-flags',
            title: 'Red Flags (If Any)',
            icon: 'AlertTriangle',
            items: [],
        },
        // ✅ NEW SECTION 6: Who Should Use
        whoShouldUse: {
            id: 'who-should-use',
            title: 'Who Should Use [Firm Name]?',
            icon: 'Target',
            perfectFor: [],
            notIdealFor: [],
        },
        // ✅ NEW SECTION 7: Funded Account Process
        fundedAccountProcess: {
            id: 'funded-account-process',
            steps: [],
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
            { id: 'payouts-withdrawal', title: 'Payouts & Withdrawals', icon: 'DollarSign' },
            { id: 'support-reputation', title: 'Support & Reputation', icon: 'Users' },
            { id: 'trader-feedback', title: 'Trader Feedback', icon: 'MessageCircle' },
            { id: 'pros-cons', title: 'Pros & Cons', icon: 'CheckCircle' },
            { id: 'red-flags', title: 'Red Flags', icon: 'AlertTriangle' },
            { id: 'who-should-use', title: 'Who Should Use', icon: 'Target' },
            { id: 'funded-account-process', title: 'Step-by-Step: How to Get Funded', icon: 'List' },
            { id: 'final-verdict', title: 'Final Verdict', icon: 'Star' },
        ],
        // ✅ Optional: SEO tags and FAQs
        seoTags: [],
        faqs: [],
    };
}
