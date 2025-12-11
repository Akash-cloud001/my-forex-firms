import { IssueType } from "@/models/Review";

export const ISSUE_SCORING_MAP: Record<IssueType, string> = {
    // Payout Issues → payout_payment_experience
    'payout-delays': 'payout_payment_experience.payout_behavior.payout_time',
    'payout-denial': 'payout_payment_experience.payout_reliability.no_payout_denial_policy',
    'other-payout': 'payout_payment_experience',

    // Account/Platform Issues → credibility / physical legal
    'missing-account': 'credibility.physical_legal_presence.registered_company',
    'technical-problems': 'credibility.physical_legal_presence.physical_office',
    'platform-instability': 'credibility.physical_legal_presence.dashboard_friendlyness',
    'other-account': 'credibility.physical_legal_presence',

    // Trading Related Issues → trading_experience.trading_conditions
    'slippage': 'trading_experience.trading_conditions.acceptable_slippage',
    'spreads': 'trading_experience.trading_conditions.fair_spreads',
    'execution': 'trading_experience.trading_conditions.multiple_trading_platforms',
    'commissions-discrepancy': 'trading_experience.trading_conditions.fair_commissions',

    // Rules / Fairness
    'rule-enforcement': 'trading_experience.rules_fairness.no_hidden_restrictions_stratgy',
    'restrictions': 'trading_experience.rules_fairness.lavrage_margin_rule',
    'other-trading': 'trading_experience',

    // Rule/Policy Issues → credibility.public_identity_transparency
    'rule-changes': 'credibility.public_identity_transparency.terms_clarity',
    'unclear-terms': 'credibility.public_identity_transparency.terms_clarity',
    'hidden-rules': 'credibility.public_identity_transparency.terms_clarity',
    'other-rule': 'credibility.public_identity_transparency',

    // Support/Communication Issues
    'no-response': 'credibility.public_identity_transparency.support_quality',
    'slow-support': 'credibility.public_identity_transparency.support_quality',
    'miscommunication': 'credibility.public_identity_transparency.support_quality',
    'immature-support': 'credibility.public_identity_transparency.support_quality',
    'other-support': 'credibility.public_identity_transparency',

    // Misconduct → credibility.trust_signals_history
    'misleading-marketing': 'credibility.trust_signals_history.no_controversies',
    'unfair-practices': 'credibility.trust_signals_history.consistent_ops',
    'fake-claims': 'credibility.trust_signals_history.lifetime_payouts',
};

export function getRelatedSubFactor(issueType: IssueType): string | null {
    const path = ISSUE_SCORING_MAP[issueType];
    if (!path) return null;

    // Extract only the last segment (sub-factor name) from the path
    // e.g., "trading_experience.trading_conditions.acceptable_slippage" -> "acceptable_slippage"
    const segments = path.split('.');
    return segments[segments.length - 1];
}
