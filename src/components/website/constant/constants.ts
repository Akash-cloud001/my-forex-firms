// constants.ts
import { Firm, IssueType } from './types'

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

export const ISSUE_TYPES: IssueType[] = [
  {
    value: 'user-complaints',
    label: 'User Complaints',
    description: 'General issues or dissatisfaction'
  },
  {
    value: 'payout-delays',
    label: 'Payout Delay Reports',
    description: 'Payment took longer than expected or promised timeframe'
  },
  {
    value: 'slippage-reports',
    label: 'Slippage Reports',
    description: 'Execution quality problems'
  },
  {
    value: 'payout-denials',
    label: 'Payout Denials',
    description: 'Withdrawal request was rejected or not honored'
  },
  {
    value: 'poor-practices',
    label: 'Poor Practices',
    description: 'Unethical business behavior'
  },
  {
    value: 'platform-instability',
    label: 'Platform Instability',
    description: 'Technical issues, downtime, crashes'
  },
  {
    value: 'unethical-marketing',
    label: 'Unethical Marketing',
    description: 'Misleading advertising or false claims'
  },
  {
    value: 'community-trust',
    label: 'Community Trust Impact',
    description: 'General negative community feedback'
  },
  {
    value: 'other',
    label: 'Other',
    description: 'Specify a different issue type'
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