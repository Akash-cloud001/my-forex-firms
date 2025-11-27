import { Firm, IssueCategory } from '../types/types'

export const MOCK_FIRMS: Firm[] = [
  { id: '1', name: 'FTMO', verified: true },
  { id: '2', name: 'MyForexFunds', verified: true },
  { id: '3', name: 'The5ers', verified: true },
  { id: '4', name: 'TopStep', verified: false },
  { id: '5', name: 'Apex Trader Funding', verified: true },
  { id: '6', name: 'E8 Markets', verified: false },
  { id: '7', name: 'SurgeTrader', verified: true },
  { id: '8', name: 'Traders With Edge', verified: false },
  { id: 'other', name: 'Other', verified: false },
]

export const ISSUE_CATEGORIES: IssueCategory[] = [
  {
    id: 'payout-issue',
    label: 'Payout Issue',
    subCategories: [
      { value: 'payout-delays', label: 'Payout Delays', description: 'Payout is taking significantly longer than the stated processing time or promised timeframe' },
      { value: 'payout-denial', label: 'Payout Denial', description: 'Payout request was rejected or cancelled without a proper explanation or transparent reasoning' },
      { value: 'other-payout', label: 'Other payout related issues', description: 'Any other payout-related problem such as partial payout, unclear deductions, or repeated verification requests' }
    ]
  },
  {
    id: 'account-platform-issue',
    label: 'Account / Platform Issue',
    subCategories: [
      { value: 'missing-account', label: 'Missing account', description: 'Account disappears, becomes inaccessible, or shows incorrect details without user action' },
      { value: 'technical-problems', label: 'Technical problems', description: 'Unexpected errors, malfunctioning features, or system bugs affecting normal usage' },
      { value: 'platform-instability', label: 'Platform instability', description: 'Frequent downtime, app crashes, freezing, lagging, or unstable platform performance' },
      { value: 'other-account', label: 'Others', description: 'Any other account or platform problem not clearly listed above' }
    ]
  },
  {
    id: 'trading-conditions-issue',
    label: 'Trading Conditions Issue',
    subCategories: [
      { value: 'slippage', label: 'Slippage', description: 'Trades being executed at a noticeably different price than the one placed, causing losses or unexpected results' },
      { value: 'spreads', label: 'Spreads', description: 'Spread widening beyond normal or advertised ranges, increasing trading cost unfairly' },
      { value: 'execution', label: 'Execution', description: 'Orders not executing smoothly, getting delayed, or failing despite correct market conditions' },
      { value: 'rule-enforcement', label: 'Rule enforcement', description: 'Propfirm enforcing rules inconsistently, suddenly, or without proper justification' },
      { value: 'commissions-discrepancy', label: 'Commissions discrepancy', description: 'Commission charged incorrectly, higher than stated, or differing from platform’s published rates' },
      { value: 'other-trading', label: 'Other', description: 'Any other trading-related issue affecting execution, pricing, or conditions' }
    ]
  },
  {
    id: 'rule-policy-issue',
    label: 'Rule / Policy Issue',
    subCategories: [
      { value: 'rule-changes', label: 'Rule changes', description: 'Rules are changed suddenly without prior notice, affecting trading or payout expectations' },
      { value: 'unclear-terms', label: 'Unclear terms', description: 'Terms and conditions written vaguely, confusing users or creating room for misinterpretation' },
      { value: 'hidden-rules', label: 'Hidden rules', description: 'Rules not disclosed upfront but later used against the user during trading, verification, or payout' },
      { value: 'other-rule', label: 'Other', description: 'Any other issue related to unclear, unfair, or poorly communicated rules/policies' }
    ]
  },
  {
    id: 'support-communication-issue',
    label: 'Support / Communication Issue',
    subCategories: [
      // { value: 'ignored-emails', label: 'Ignored emails', description: 'Emails remain unanswered for an unusually long time despite multiple follow-ups' },
      { value: 'no-response', label: 'No response', description: 'Support fails to respond on any channel such as email, chat, or discord tickets' },
      { value: 'slow-support', label: 'Slow support', description: 'Support takes excessively long to reply, delaying issue resolution' },
      { value: 'miscommunication', label: 'Miscommunication', description: 'Support provides incorrect, inconsistent, or confusing information' },
      { value: 'immature-support', label: 'Immature support', description: 'Support staff behaving unprofessionally, lacking knowledge, or not handling concerns properly' },
      { value: 'other-support', label: 'Other', description: 'Any other communication or support-related problem' }
    ]
  },
  {
    id: 'misconduct-unethical-behavior',
    label: 'Misconduct / Unethical Behavior',
    subCategories: [
      { value: 'misleading-marketing', label: 'Misleading marketing', description: 'Advertisements or promotions that exaggerate results, hide risks, or create false expectations' },
      { value: 'unfair-practices', label: 'Unfair practices', description: 'Platform engaging in practices that disadvantage users intentionally or manipulate outcomes' },
      { value: 'fake-claims', label: 'Fake claims', description: 'Platform making promises or statements that are false, unverified, or impossible to achieve' }
    ]
  }
]

export const FILE_UPLOAD_CONFIG = {
  maxFiles: 5,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
  acceptedExtensions: '.jpg,.jpeg,.png,.pdf'
}

export const DESCRIPTION_CONFIG = {
  minLength: 50,
  maxLength: 2000
}

export const RATING_LABELS = {
  1: 'Very Poor',
  2: 'Poor',
  3: 'Average',
  4: 'Good',
  5: 'Excellent'
} as const