/**
 * PTI v2 Calculator Utility
 * Handles score deductions when reviews are approved
 */

// Slab rates based on firm's totalPayout

export function getDeductionRate(totalPayout: number): number {
    if (totalPayout >= 50_000_000) return 0.10;  // S4: 50M+
    if (totalPayout >= 10_000_000) return 0.12;  // S3: 10-50M
    if (totalPayout >= 2_000_000) return 0.16;   // S2: 2-10M
    return 0.20;                                  // S1: 0-2M
}

// Category max points (sum of sub-factors in each category)
export const CATEGORY_MAX_POINTS: Record<string, number> = {
    // Credibility (10 total)
    "physical_legal_presence": 3.0,
    "public_identity_transparency": 3.3,
    "social_community_presence": 1.0,
    "trust_signals_history": 2.7,
    // Trading Experience (10 total)
    "trading_conditions": 3.0,
    "trading_freedom": 4.0,
    "rules_fairness": 3.0,
    // Payout Reliability (10 total)
    "payout_reliability": 3.0,
    "payout_behavior": 4.0,
    "payout_payment_structure": 3.0,
};

// Sub-factor to category and pillar mapping
export const SUBFACTOR_MAPPING: Record<string, { pillar: string; category: string }> = {
    // Credibility - Physical & Legal Presence
    "registered_company": { pillar: "credibility", category: "physical_legal_presence" },
    "physical_office": { pillar: "credibility", category: "physical_legal_presence" },
    "dashboard_friendlyness": { pillar: "credibility", category: "physical_legal_presence" },
    // Credibility - Public Identity Transparency
    "public_ceo_founder": { pillar: "credibility", category: "public_identity_transparency" },
    "support_quality": { pillar: "credibility", category: "public_identity_transparency" },
    "terms_clarity": { pillar: "credibility", category: "public_identity_transparency" },
    "brocker_backed": { pillar: "credibility", category: "public_identity_transparency" },
    // Credibility - Social & Community Presence
    "active_social": { pillar: "credibility", category: "social_community_presence" },
    "transparent_comm": { pillar: "credibility", category: "social_community_presence" },
    // Credibility - Trust Signals History
    "verified_payouts": { pillar: "credibility", category: "trust_signals_history" },
    "lifetime_payouts": { pillar: "credibility", category: "trust_signals_history" },
    "no_controversies": { pillar: "credibility", category: "trust_signals_history" },
    "consistent_ops": { pillar: "credibility", category: "trust_signals_history" },
    // Trading Experience - Trading Conditions
    "fair_spreads": { pillar: "trading_experience", category: "trading_conditions" },
    "fair_commissions": { pillar: "trading_experience", category: "trading_conditions" },
    "acceptable_slippage": { pillar: "trading_experience", category: "trading_conditions" },
    // Trading Experience - Trading Freedom
    "multiple_trading_platforms": { pillar: "trading_experience", category: "trading_freedom" },
    "profit_targets": { pillar: "trading_experience", category: "trading_freedom" },
    "consistancy_rule": { pillar: "trading_experience", category: "trading_freedom" },
    "news_trading": { pillar: "trading_experience", category: "trading_freedom" },
    // Trading Experience - Rules & Fairness
    "lavrage_margin_rule": { pillar: "trading_experience", category: "rules_fairness" },
    "no_hidden_restrictions_stratgy": { pillar: "trading_experience", category: "rules_fairness" },
    "dd_type": { pillar: "trading_experience", category: "rules_fairness" },
    // Payout - Payout Reliability
    "no_payout_denial_policy": { pillar: "payout_payment_experience", category: "payout_reliability" },
    "payout_cycle": { pillar: "payout_payment_experience", category: "payout_reliability" },
    "single_highest_payout": { pillar: "payout_payment_experience", category: "payout_reliability" },
    // Payout - Payout Behavior
    "payout_time": { pillar: "payout_payment_experience", category: "payout_behavior" },
    "flexible_payout_methods": { pillar: "payout_payment_experience", category: "payout_behavior" },
    "payout_denials": { pillar: "payout_payment_experience", category: "payout_behavior" },
    // Payout - Payout Structure
    "fair_profit_split": { pillar: "payout_payment_experience", category: "payout_payment_structure" },
    "flexible_payment_methods": { pillar: "payout_payment_experience", category: "payout_payment_structure" },
    "reasonable_minimum_payout_requiremnts": { pillar: "payout_payment_experience", category: "payout_payment_structure" },
};

/**
 * Calculate per-complaint deduction amount
 * Formula: PerComplaint = d_slab × (categoryMaxPoints / 10)
 */
export function calculateDeduction(totalPayout: number, category: string): number {
    const deductionRate = getDeductionRate(totalPayout);
    const categoryMax = CATEGORY_MAX_POINTS[category] || 1;
    return deductionRate * (categoryMax / 10);
}

/**
 * Get the path information for a sub-factor
 */
export function getSubFactorPath(subFactor: string): { pillar: string; category: string; subFactor: string } | null {
    const mapping = SUBFACTOR_MAPPING[subFactor];
    if (!mapping) return null;
    return {
        pillar: mapping.pillar,
        category: mapping.category,
        subFactor: subFactor
    };
}

// sum all values in a nested object
const sumValues = (obj: Record<string, unknown>): number => {
    let total = 0;
    for (const key in obj) {
        const value = obj[key];
        if (typeof value === 'object' && value !== null) {
            total += sumValues(value as Record<string, unknown>);
        } else if (typeof value === 'number') {
            total += value;
        }
    }
    return total;
};

/**
 * Recalculate pillar totals and PTI score
 * PTI = (0.35 × Credibility) + (0.30 × Trading) + (0.35 × Payout)
 */
export function recalculatePTI(scores: {
    credibility: Record<string, Record<string, number>>;
    trading_experience: Record<string, Record<string, number>>;
    payout_payment_experience: Record<string, Record<string, number>>;
}): {
    credibilityTotal: number;
    tradingTotal: number;
    payoutTotal: number;
    ptiScore: number;
} {
    const credibilityTotal = sumValues(scores.credibility);
    const tradingTotal = sumValues(scores.trading_experience);
    const payoutTotal = sumValues(scores.payout_payment_experience);

    const ptiScore = (0.35 * credibilityTotal) + (0.30 * tradingTotal) + (0.35 * payoutTotal);

    return {
        credibilityTotal: parseFloat(credibilityTotal.toFixed(3)),
        tradingTotal: parseFloat(tradingTotal.toFixed(3)),
        payoutTotal: parseFloat(payoutTotal.toFixed(3)),
        ptiScore: parseFloat(ptiScore.toFixed(3))
    };
}
