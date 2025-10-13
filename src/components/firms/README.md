# Firm Multi-Step Form Documentation

## Overview

This multi-step form allows admins to add new prop firms to the platform with comprehensive information. The form is broken down into 5 logical steps, each handling a specific category of firm data.

## Form Structure

### Step 1: Basic Information
**File:** `steps/basic-information-step.tsx`

Captures essential firm details for brand identification and transparency:

- **Company Details:**
  - Firm Name (required)
  - Logo URL
  - Founded Year (required)
  - Country (required)
  - Headquarters (required)
  - CEO Name

- **Contact Information:**
  - Official Website (required)
  - Support Email (required)
  - Support Phone

- **Social Media Links:**
  - Facebook, Twitter, LinkedIn, Instagram, Discord, Telegram

- **Quick Overview:**
  - Firm Description
  - Supported Platforms (MT4, MT5, cTrader, etc.)
  - Payout Methods
  - Max Funding
  - Profit Split
  - Payout Frequency

---

### Step 2: Challenge Types & Account Options
**File:** `steps/challenge-types-step.tsx`

Defines various challenge programs and account types with dynamic field arrays:

**Features:**
- Add multiple challenge types
- Remove challenge types (minimum 1 required)

**Per Challenge:**
- Account Type (1-step, 2-step, instant, evaluation, standard)
- Max Funding
- Profit Split
- Challenge Price
- Leverage
- Time Limit
- Payout Cycle
- Refund Policy
- Scaling Plan Details

**Feature Permissions (Checkboxes):**
- Allow EA/Bot Usage
- Allow Copy Trading
- Allow News Trading
- Allow Weekend Holding

---

### Step 3: Rules & Policies
**File:** `steps/rules-policies-step.tsx`

Defines clear trading rules and policies with visual indicators:

**Drawdown Limits:**
- Daily Drawdown Limit (%)
- Daily Drawdown Value ($)
- Max Drawdown Limit (%)
- Max Drawdown Value ($)
- Minimum Trading Days

**Trading Policies (with ✅/❌/⚠️ indicators):**
- Weekend Holding Policy (allowed/not-allowed/conditional)
- EA/Bot Usage
- Copy Trading Rules
- News Trading Policy
- Each policy includes optional conditional notes

**Consequences & Terms:**
- Refund Conditions
- Breach Consequences
- Termination Terms
- Additional Rules

---

### Step 4: Payout Insights
**File:** `steps/payout-insights-step.tsx`

Showcases verified payout performance data:

**Payout Statistics:**
- Total Verified Payouts
- Average Payout Processing Time
- Fastest Payout Record
- Largest Payout Record

**Payout Method Distribution (%):**
- Bank Transfer
- Cryptocurrency
- PayPal
- Other Methods

**Documentation:**
- Payout Proof Gallery URLs
- Additional Payout Notes

---

### Step 5: Additional Specifications
**File:** `steps/additional-specs-step.tsx`

Provides additional transparency and deep insights:

**Performance Metrics:**
- Challenge Pass Rate (%)

**Technical Infrastructure:**
- Risk Desk Type (internal/external/hybrid)
- Liquidity Providers
- Account Type (simulated/live/hybrid)

**Support & Compliance:**
- Support Languages
- Regulation / Licenses
- Partnerships & Affiliations

**API & Integration:**
- API Availability (available/private/planned/not-available)

**Additional Information:**
- Free-form notes field

---

## Features

### ✨ Key Features

1. **Multi-Step Navigation**
   - Visual stepper with progress indicators
   - Click-to-navigate between steps
   - Completed steps marked with checkmarks

2. **Form Validation**
   - Built with react-hook-form
   - Real-time validation
   - Required field indicators
   - Pattern matching for URLs and emails

3. **Save Functionality**
   - Save draft at any time
   - Auto-save progress between steps
   - Resume from last completed step

4. **Dynamic Fields**
   - Add/remove challenge types
   - Conditional fields based on selections
   - Array field management

5. **User-Friendly UI**
   - Clear section headers
   - Helpful descriptions
   - Form field tooltips
   - Visual policy indicators

---

## Technical Stack

- **Form Management:** React Hook Form v7.64.0
- **UI Components:** shadcn/ui
  - Input, Select, Textarea, Checkbox, Radio Group
  - Card, Badge, Button
  - Form components with built-in validation
- **Icons:** Lucide React
- **Styling:** Tailwind CSS

---

## Usage

### Adding the Form to a Page

```tsx
import NewFirm from "@/app/admin/firms/new/page";

// The page is already configured at /admin/firms/new
// Access it directly via the navigation
```

### Extending the Form

To add a new step:

1. Create a new step component in `steps/` directory
2. Add the step to the `steps` array in `new/page.tsx`
3. Define the TypeScript interface for form data
4. Implement the step component with proper props

```tsx
// Example step component structure
interface StepProps {
  data: Record<string, unknown>;
  onNext: (data: Record<string, unknown>) => void;
  onPrevious: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
}

export default function YourStep({ data, onNext, onPrevious }: StepProps) {
  // Implementation
}
```

---

## Data Flow

1. **User fills out Step 1** → Data saved to main form state
2. **User clicks "Next Step"** → Step 1 data validated and merged
3. **Process repeats** for Steps 2-4
4. **Step 5 submission** → All data combined and sent to API
5. **Draft saving** → Current progress saved at any point

---

## Future Enhancements

- [ ] File upload for logos and payout proofs
- [ ] Image optimization and CDN integration
- [ ] Auto-complete for country/firm names
- [ ] Rich text editor for descriptions
- [ ] Drag-and-drop for challenge type ordering
- [ ] Import/export firm data
- [ ] Template system for common configurations
- [ ] Revision history and version control
- [ ] Bulk import from CSV

---

## API Integration

The form prepares data for submission to your backend API. You'll need to implement:

```typescript
// POST /api/firms
interface FirmData {
  // Step 1
  firmName: string;
  logoUrl?: string;
  // ... all other fields from all steps
}
```

Update the `handleFinalSubmit` function in `new/page.tsx` to connect to your API endpoint.

---

## Notes

- All required fields are marked with `*`
- Form validation prevents proceeding without required fields
- Data persists across step navigation
- Draft saving is local until final submission
- The form is fully responsive and mobile-friendly

