import { z } from 'zod'
import { DESCRIPTION_CONFIG } from '../constant/constants'

export const reviewFormSchema = z.object({
  firmName: z.string().min(1, 'Please select a firm'),
  firmId: z.string().optional(),
  customFirmName: z.string().optional(),
  issueCategory: z.string().min(1, 'Please select an issue category'),
  issueSubCategory: z.string().min(1, 'Please select a specific issue'),
  customIssueType: z.string().optional(),
  description: z.string()
    .min(DESCRIPTION_CONFIG.minLength, `Description must be at least ${DESCRIPTION_CONFIG.minLength} characters`)
    .max(DESCRIPTION_CONFIG.maxLength, `Description must be less than ${DESCRIPTION_CONFIG.maxLength} characters`),
  // rating: z.number().min(1, 'Please provide a rating').max(5),
  files: z.array(z.any()).optional()
}).refine((data) => {
  if (data.issueSubCategory.startsWith('other-') && (!data.customIssueType || data.customIssueType.trim().length === 0)) {
    return false
  }
  return true
}, {
  message: 'Please specify the issue type',
  path: ['customIssueType']
}).refine((data) => {
  if (data.firmName === 'Other' && (!data.customFirmName || data.customFirmName.trim().length === 0)) {
    return false
  }
  return true
}, {
  message: 'Please specify the firm name',
  path: ['customFirmName']
})