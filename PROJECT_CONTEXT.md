# PROJECT_CONTEXT.md

## 📋 Project Overview

**My Forex Firms (MFF)** is a comprehensive platform for rating, reviewing, and managing proprietary trading firms. The platform provides transparency, verified ratings, and community trust for traders evaluating prop firms.

### Core Purpose
- **Transparency**: Provide verified information about prop trading firms
- **Community Trust**: Enable traders to share experiences and reviews
- **Rating System**: Comprehensive rating methodology for prop firms
- **Admin Management**: Full CMS for managing firms, reviews, and content
- **Dynamic Content**: Blog management system with multiple templates

### Business Model
- Platform for traders to research and review prop firms
- Admin panel for managing firm data, reviews, and content
- Newsletter system for subscriber management
- Dynamic blog system for content marketing
- Future monetization: Featured listings, affiliate links, ads

---

## 🛠 Tech Stack

### Frontend
- **Framework**: Next.js 15.5.4 (App Router)
- **React**: 19.1.0
- **TypeScript**: 5.x
- **Styling**: Tailwind CSS 4.1.14
- **UI Components**: Radix UI (shadcn/ui components)
- **Forms**: React Hook Form 7.64.0 + Zod 4.1.12
- **State Management**: Zustand 5.0.8
- **Data Fetching**: TanStack Query (React Query) + Axios
- **Animations**: Motion (Framer Motion) 12.23.24
- **Charts**: Recharts 3.4.1
- **Icons**: Lucide React 0.545.0

### Backend
- **Runtime**: Node.js
- **API**: Next.js API Routes (App Router)
- **Database**: MongoDB with Mongoose 8.19.1
- **Authentication**: Clerk 6.33.5
- **File Storage**: 
  - Cloudinary (for firm logos/images)
  - BunnyCDN (for review attachments)

### Additional Services
- **Email**: SendGrid 8.1.6
- **Analytics**: Google Analytics (G-ETPND6JE72)
  - **GA4 Data API**: `@google-analytics/data` for admin dashboard analytics
- **Webhooks**: Svix 1.80.0 (for Clerk webhooks)

---

## 📁 Project Structure

```
my-forex-firms/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Authentication routes
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   ├── (website)/                # Public website routes
│   │   │   ├── blogs/                # Blog pages (dynamic routing)
│   │   │   │   ├── [slug]/           # Dynamic blog detail pages
│   │   │   │   └── page.tsx          # Blog listing page
│   │   │   ├── firms/                # Firm listing & detail pages
│   │   │   │   ├── [slug]/           # Dynamic firm detail pages
│   │   │   │   └── page.tsx          # Firm listing page
│   │   │   ├── complaints/            # Complaints page (formerly reviews)
│   │   │   ├── post-complaint/       # Submit complaint page (formerly post-review)
│   │   │   ├── profile/              # User profile
│   │   │   ├── layout.tsx            # Website layout (Navbar, Footer)
│   │   │   └── page.tsx              # Landing page
│   │   ├── admin/                    # Admin dashboard routes
│   │   │   ├── dashboard/            # Admin dashboard
│   │   │   ├── firm-management/      # Firm CRUD operations
│   │   │   ├── reviews/              # Review management (enhanced)
│   │   │   ├── point-evaluation/     # Point evaluation system
│   │   │   │   ├── [id]/             # Individual evaluation details
│   │   │   │   └── page.tsx          # Evaluation listing
│   │   │   ├── penalties/            # Penalty management
│   │   │   ├── affiliates/           # Affiliate links (admin only)
│   │   │   ├── blogs/                # Blog management system
│   │   │   │   ├── add/              # Create new blog (template selection)
│   │   │   │   ├── [slug]/           # Edit existing blog (inline editing)
│   │   │   │   └── page.tsx          # Blog listing
│   │   │   ├── faq-management/       # FAQ management
│   │   │   ├── newsletter/           # Newsletter subscribers (admin only)
│   │   │   ├── live-firms/           # Published firms
│   │   │   ├── users/                # User management
│   │   │   ├── role-management/      # Role assignment (admin only)
│   │   │   ├── unauthorized/         # Access denied page
│   │   │   ├── profile/              # Admin profile
│   │   │   └── layout.tsx            # Admin layout (Sidebar)
│   │   ├── api/                      # API routes
│   │   │   ├── admin/                # Admin API endpoints
│   │   │   │   ├── firm-reviews/     # Firm review/blog management API
│   │   │   │   │   ├── [slug]/       # Single review operations
│   │   │   │   │   └── route.ts      # List and create reviews
│   │   │   │   ├── migrate-firm-reviews/ # Migration endpoint
│   │   │   │   ├── firm/             # Firm management API
│   │   │   │   ├── firm-program/     # Firm program API
│   │   │   │   ├── point-eval/       # Point evaluation API
│   │   │   │   ├── reviews/          # Review management API (enhanced)
│   │   │   │   ├── users/            # User management API
│   │   │   │   └── faq/              # FAQ management API
│   │   │   ├── reviews/              # Review API
│   │   │   ├── newsletter/           # Newsletter API
│   │   │   ├── public/               # Public API endpoints
│   │   │   │   ├── firm-reviews/    # Public firm review/blog API
│   │   │   │   │   ├── [slug]/      # Single review endpoint
│   │   │   │   │   └── route.ts     # List reviews endpoint
│   │   │   │   ├── faqs/             # Public FAQ API
│   │   │   │   └── firm-details/     # Public firm API
│   │   │   ├── users/                # User API (webhooks)
│   │   │   ├── test-db/              # Database testing
│   │   │   └── website/              # Website API
│   │   ├── layout.tsx                # Root layout (ClerkProvider)
│   │   └── globals.css               # Global styles
│   ├── components/
│   │   ├── admin/                    # Admin-specific components
│   │   │   └── blog-editor/         # Blog editing components
│   │   │       ├── EditableField.tsx # Base inline editing component
│   │   │       ├── EditableText.tsx  # Single-line text editor
│   │   │       ├── EditableTextarea.tsx # Multi-line text editor
│   │   │       ├── EditableArray.tsx # Array/list editor
│   │   │       ├── EditableKeyValue.tsx # Key-value pair editor
│   │   │       ├── EditableProsCons.tsx # Pros/cons editor
│   │   │       ├── TemplateSelectionModal.tsx # Template selection modal
│   │   │       └── sections/         # Section-specific editors
│   │   │           ├── BasicInfoEditor.tsx
│   │   │           ├── OverviewEditor.tsx
│   │   │           ├── WhatIsEditor.tsx
│   │   │           ├── HowDiffersEditor.tsx
│   │   │           ├── ProgramsComparisonEditor.tsx
│   │   │           ├── PlatformsEditor.tsx
│   │   │           └── FinalVerdictEditor.tsx
│   │   ├── crm/                      # Admin/CRM components
│   │   │   ├── app-sidebar.tsx       # Admin sidebar navigation (role-based)
│   │   │   ├── dashboard/            # Dashboard components
│   │   │   ├── faq/                  # FAQ management components
│   │   │   ├── point-evaluation/     # Point evaluation components
│   │   │   │   ├── ScoreDetail.tsx   # Score detail component
│   │   │   │   └── types/            # Point evaluation types and constants
│   │   │   └── firm-management/      # Firm form components
│   │   ├── website/                  # Public website components
│   │   │   ├── blog/                 # Blog rendering components
│   │   │   │   ├── BlogHero.tsx      # Blog hero section with share functionality
│   │   │   │   ├── BlogIntroduction.tsx # Introduction section
│   │   │   │   ├── BlogOverview.tsx  # Overview/quick snapshot section
│   │   │   │   ├── BlogWhatIs.tsx    # "What is" section
│   │   │   │   ├── BlogHowDiffers.tsx # "How differs" section
│   │   │   │   ├── BlogProgramsComparison.tsx # Programs comparison table
│   │   │   │   ├── BlogPlatforms.tsx # Platforms and execution section
│   │   │   │   ├── BlogFinalVerdict.tsx # Final verdict section
│   │   │   │   └── BlogTableOfContents.tsx # Table of contents component
│   │   │   ├── firms/                # Firm display components
│   │   │   ├── landing-page/         # Landing page sections
│   │   │   ├── post-complaint/       # Complaint submission form (formerly post-review)
│   │   │   ├── navbar.jsx            # Navigation bar (with scroll progress indicator)
│   │   │   ├── footer.jsx            # Footer
│   │   │   ├── bottombar.jsx         # Bottom navigation
│   │   │   └── ...                   # Other website components
│   │   ├── profile/                  # User profile components
│   │   ├── reviews/                  # Review/Complaint display components
│   │   ├── ui/                       # Reusable UI components (shadcn/ui)
│   │   │   └── infinite-slider.tsx   # InfiniteSlider component for seamless scrolling
│   │   └── svgs/                     # SVG icon components
│   ├── lib/                          # Utility libraries
│   │   ├── mongodb.ts                # MongoDB connection
│   │   ├── cloudinary.ts             # Cloudinary config
│   │   ├── bunnycdn.ts               # BunnyCDN file operations
│   │   ├── fileUpload.ts             # File upload utilities
│   │   ├── formUtils.ts              # Form helper functions
│   │   ├── helperMethods.ts          # General utilities
│   │   ├── reviewApi.ts              # Review API helpers
│   │   ├── reviewFileUtils.ts        # Review file utilities
│   │   ├── blog-templates.ts         # Blog template definitions
│   │   ├── api/                      # API wrapper utilities
│   │   │   └── apiWrapper.ts         # Axios wrapper functions
│   │   ├── axios/                    # Axios configuration
│   │   │   ├── baseAxios.ts          # Base Axios instance
│   │   │   └── interceptors.ts       # Request/response interceptors
│   │   └── utils.ts                  # General utilities (cn, etc.)
│   ├── models/                       # Mongoose models
│   │   ├── Firm.ts                   # Main Firm model (new schema)
│   │   ├── FirmDetails.ts            # FirmDetails model (legacy)
│   │   ├── FirmProgram.ts            # Firm program/challenge model
│   │   ├── FirmReview.ts             # Firm review/blog model
│   │   ├── firmRule.ts               # Firm rules model
│   │   ├── Review.ts                 # Review model (enhanced with categories)
│   │   ├── User.ts                   # User model (with analytics)
│   │   ├── Faq.ts                    # FAQ model
│   │   ├── FaqCategory.ts            # FAQ category model
│   │   ├── EmailSubscription.ts      # Newsletter subscriptions
│   │   └── AuditLog.ts               # Audit trail
│   ├── services/                     # Business logic services
│   │   ├── cloudinary.ts             # Cloudinary service
│   │   ├── faqServices.ts            # FAQ business logic
│   │   ├── firm-validation-service.ts # Firm validation
│   │   └── userService.ts            # User service
│   ├── stores/                       # Zustand stores
│   │   ├── firmManagementStore.ts    # Firm management state
│   │   ├── faqStore.ts               # FAQ data management
│   │   └── blogStore.ts              # Blog/firm review data management
│   ├── types/                        # TypeScript types
│   │   ├── index.ts                  # Type exports
│   │   ├── user.ts                   # User types
│   │   ├── firm-review.ts            # Firm review/blog types
│   │   └── mongoose.d.ts             # Mongoose type extensions
│   ├── hooks/                        # Custom React hooks
│   │   ├── queries/                  # React Query hooks
│   │   │   ├── useFirmProgramList.ts # Firm program data fetching
│   │   │   └── useFirmDetails.ts     # Firm details data fetching
│   │   ├── use-mobile.ts             # Mobile detection
│   │   └── useFormDataChange.ts      # Form change tracking
│   └── middleware.ts                 # Next.js middleware (auth)
├── public/                           # Static assets
│   ├── images/                       # Image assets
│   ├── logo.svg                      # Logo files
│   └── firm-data.json                # Static firm data
├── docs/                             # Documentation
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── next.config.ts                    # Next.js config
└── components.json                   # shadcn/ui config
```

---

## 🗄 Database Models

### 1. Firm Model (`models/Firm.ts`)
**Collection**: `firms`

**Key Fields**:
- Basic Info: `firmName`, `logoUrl`, `logoFile`, `legalEntityName`, `registrationNumber`, `jurisdiction`, `yearFounded`, `headquartersAddress`, `ceoFounderName`, `officialWebsite`, `status`, `shortDescription`
- Nested Objects:
  - `tradingInfrastructure`: Trading platforms, data feeds
  - `payoutFinancial`: Profit split, payout methods, timing
  - `challenges`: Array of challenge types (1-step, 2-step, instant, hybrid)
  - `tradingEnvironment`: Spreads, commissions, rule matrix, rule details
  - `supportOperations`: Support channels, response times, KYC requirements
  - `transparencyVerification`: CEO public, office verified, payout proofs
  - `administrationAudit`: Data source, verified by, verification date
  - `reviews`: TrustPilot rating, likes, dislikes
- System: `createdBy`, `lastModifiedBy`, `isDraft`, `isPublished`, `publishedAt`, `version`

**Status Values**: `'active' | 'paused' | 'suspended' | 'closed'`
**Challenge Types**: `'1-step' | '2-step' | 'instant' | 'hybrid'`
**Data Sources**: `'firm' | 'mff' | 'community'`

### 2. FirmDetails Model (`models/FirmDetails.ts`) - Legacy
**Collection**: `funding_firms`

**Note**: This appears to be a legacy model. The new `Firm` model should be used for new implementations.

### 3. Review Model (`models/Review.ts`)
**Collection**: `reviews`

**Key Fields**:
- `userId`, `firmId`, `firmName`, `customFirmName`
- `issueType`: `'user-complaints' | 'payout-delays' | 'slippage-reports' | 'payout-denials' | 'poor-practices' | 'platform-instability' | 'unethical-marketing' | 'community-trust' | 'other'`
- `customIssueType`, `description`, `rating` (1-5)
- `files`: Array of file objects (stored on BunnyCDN)
- `status`: `'pending' | 'approved' | 'rejected'`
- `isVerified`, `adminNotes`, `reviewedBy`, `reviewedAt`
- `analytics`: views, helpfulVotes, notHelpfulVotes, shares

### 4. User Model (`models/User.ts`)
**Collection**: `users`

**Key Fields**:
- `userId`: Clerk user ID (unique)
- `email`, `firstName`, `lastName`, `fullName`, `imageUrl`, `phone`
- `role`: `'user' | 'editor' | 'moderator' | 'admin'`
- `status`: `'active' | 'inactive' | 'suspended' | 'pending'`
- `address`: Street, city, state, zipCode, country
- `analytics`: loginCount, lastActivity, totalFirmsCreated, totalReviewsCreated, totalReportsManaged
- `clerkMetadata`: publicMetadata, privateMetadata, unsafeMetadata

### 5. FAQ Models
- **Faq** (`models/Faq.ts`): `question`, `answer`, `categoryId`, `order`, `isActive`
- **FaqCategory** (`models/FaqCategory.ts`): Category organization

### 6. EmailSubscription Model (`models/EmailSubscription.ts`)
**Collection**: `emailsubscriptions`

**Key Fields**: `email` (unique), `ipAddress`, `userAgent`, `subscribedAt`, `isActive`

### 7. AuditLog Model (`models/AuditLog.ts`)
**Key Fields**: `userId`, `userName`, `userRole`, `entity`, `entityId`, `action` ('CREATE' | 'UPDATE' | 'DELETE'), `changes`

### 8. FirmProgram Model (`models/FirmProgram.ts`)
**Key Fields**: Program type, evaluation phases, account sizes, profit split, leverage, trading rules

### 9. FirmReview Model (`models/FirmReview.ts`)
**Collection**: `firmreviews`

**Key Fields**:
- Basic Info: `slug` (unique, required, must end with `-review`), `firmName`, `title`, `subtitle`, `publishedAt`, `readTime`, `trustScore`, `rating`, `ratingLabel`, `introduction`
- Nested Sections:
  - `overview`: Quick snapshot with icon, title, and key-value data pairs
  - `whatIs`: Firm introduction with content, highlights, and conclusion
  - `howDiffers`: Advantages and limitations lists
  - `programsComparison`: Comparison table with headers and rows
  - `platformsExecution`: Platforms and instruments lists
  - `finalVerdict`: Rating, strengths, weaknesses, and recommendation
- `tableOfContents`: Array of navigation items with id, title, and icon
- System: `createdAt`, `updatedAt` (timestamps)

**Validation**: Slug must be lowercase, hyphen-separated, and end with `-review`

---

## 🔐 Authentication & Authorization

### Authentication Provider: Clerk
- **Package**: `@clerk/nextjs` 6.33.5
- **Setup**: Configured in root `layout.tsx` with `ClerkProvider`
- **Webhook**: `/api/users/webhook` for user sync

### Role-Based Access Control (RBAC)

**Roles**:
- `user`: Regular users (default)
- `editor`: Can edit content
- `moderator`: Can moderate reviews
- `admin`: Full access

**Middleware Protection** (`src/middleware.ts`):
- **Public Routes**: `/`, `/sign-in`, `/sign-up`, `/blogs`, `/firms`, `/reviews`, `/api/users/webhook`, `/api/public/*`
- **Protected Routes**: All other routes require authentication
- **Dashboard Routes** (`/admin/*`): Require roles: `admin`, `moderator`, or `editor`
- **Admin Routes** (`/admin/users`, `/api/admin/*`): Additional role checks in API
- **Editor Restricted Routes**: `/admin/role-management`, `/admin/newsletter`, `/admin/affiliates` (admin only)

**Role Storage**: Stored in Clerk's `publicMetadata.role` and synced to MongoDB User model

---

## 🛣 API Routes

### Admin API (`/api/admin/`)

#### Firm Management
- `GET /api/admin/firm` - List firms (with pagination, search)
- `POST /api/admin/firm` - Create firm (with Cloudinary image upload)
- `GET /api/admin/firm/[id]` - Get firm by ID
- `PUT /api/admin/firm/[id]` - Update firm
- `DELETE /api/admin/firm/[id]` - Delete firm

#### Firm Program
- `GET /api/admin/firm-program` - List programs
- `POST /api/admin/firm-program` - Create program
- `GET /api/admin/firm-program/[id]` - Get program
- `PUT /api/admin/firm-program/[id]` - Update program
- `DELETE /api/admin/firm-program/[id]` - Delete program

#### Firm Rules
- Similar CRUD operations for firm rules

#### Reviews/Complaints
- `GET /api/admin/reviews` - List complaints (with filters, terminology updated)
- `POST /api/admin/reviews` - Approve/reject complaint

#### Users
- `GET /api/admin/users` - List users (with advanced filtering)
- `POST /api/admin/users/assign-role` - Assign role
- `PUT /api/admin/users/[userId]/role` - Update user role
- `POST /api/admin/users/sync` - Sync users from Clerk

#### FAQ
- `GET /api/admin/faq/faqs` - List FAQs
- `POST /api/admin/faq/faqs` - Create FAQ
- `GET /api/admin/faq/faqs/[id]` - Get FAQ
- `PUT /api/admin/faq/faqs/[id]` - Update FAQ
- `DELETE /api/admin/faq/faqs/[id]` - Delete FAQ
- `GET /api/admin/faq/faq-categories` - List categories
- `POST /api/admin/faq/faq-categories` - Create category
- `POST /api/admin/faq/reorder` - Reorder FAQs

#### Point Evaluation (PTI)
- `GET /api/admin/point-eval` - Get evaluation points and metrics for firm assessment
- **PTI Score Calculation**: Automatic calculation and storage of PropTrust Index scores

#### Firm Reviews (Blog Management)
- `GET /api/admin/firm-reviews` - List all firm reviews (with search, pagination, sorting)
- `POST /api/admin/firm-reviews` - Create new firm review
- `GET /api/admin/firm-reviews/[slug]` - Get single review by slug
- `PUT /api/admin/firm-reviews/[slug]` - Update existing review
- `DELETE /api/admin/firm-reviews/[slug]` - Delete review
- `POST /api/admin/migrate-firm-reviews` - Migrate JSON data to database

### Public API (`/api/public/`)

#### FAQs
- `GET /api/public/faqs` - Get active FAQs with category filtering
  - Query params: `categoryId` (ObjectId), `category` (name, case-insensitive)
  - Returns only active FAQs from active categories
  - Populates category names in response

#### Firm Details
- `GET /api/public/firm-details/[slug]` - Get published firm by slug
- `GET /api/public/firm-details/[slug]/program` - Get firm programs by slug

#### Firm Reviews (Public Blog)
- `GET /api/public/firm-reviews` - List all published firm reviews (with search, pagination, sorting)
- `GET /api/public/firm-reviews/[slug]` - Get single published review by slug

### Reviews/Complaints API (`/api/reviews/`)
- `GET /api/reviews` - Get complaints (filtered by user/admin, terminology updated from "reviews")
- `POST /api/reviews` - Create complaint (with BunnyCDN file upload, terminology updated)
- `DELETE /api/reviews` - Delete complaint(s)

### Newsletter API (`/api/newsletter/`)
- `GET /api/newsletter` - List subscriptions (admin)
- `POST /api/newsletter` - Subscribe or bulk operations
- `DELETE /api/newsletter` - Unsubscribe

### User API (`/api/users/`)
- `POST /api/users/webhook` - Clerk webhook for user sync
- `POST /api/users/sync` - Manual user sync
- `GET /api/users/sync` - Get sync status
- `PUT /api/users/sync` - Update sync settings

### Website API (`/api/website/`)
- `GET /api/website/prop-firm-list` - Get published firms list

### Analytics API (`/api/analytics/`)
- `GET /api/analytics/overview` - Get overview analytics (admin only)
  - Returns: total users (7d/30d), page views (7d/30d), sessions (7d/30d), bounce rate (7d)
  - Includes growth percentages vs previous periods
  - Enhanced error handling: Specific error messages for missing env vars, auth failures, permission errors
- `GET /api/analytics/page` - Get page-specific analytics (admin only)
  - Query params: `path` (required), `startDate`, `endDate`
  - Returns: page views for specified path
- `GET /api/analytics/top-pages` - Get top pages by views (admin only)
  - Query params: `limit` (default: 10), `startDate`, `endDate`
  - Returns: array of top pages with path and view counts
  - Enhanced error handling: Detailed error messages for debugging

### Testing API (`/api/test-db/`)
- `GET /api/test-db` - Test MongoDB connection and list collections

---

## 🎯 Key Features

### 1. Firm Management
- **8-Step Firm Creation Form**: Comprehensive form with draft saving
- **Draft System**: Save firms as drafts before publishing
- **Publish/Unpublish**: Control firm visibility
- **Image Upload**: Cloudinary integration for firm logos
- **Version Control**: Track changes with version numbers
- **Audit Trail**: Log all changes via AuditLog model

### 2. Complaints System (formerly Reviews)
- **Complaint Submission**: Users can submit complaints with files (rebranded from "Reviews" to "Complaints")
- **File Upload**: BunnyCDN integration for complaint attachments
- **Moderation**: Admin approval/rejection workflow
- **Issue Types**: Categorized complaint types (payout issues, account/platform issues, trading issues, rule/policy issues, support/communication issues, misconduct)
- **Analytics**: Track views, helpful votes, shares
- **Verification**: Admin can verify complaints
- **Terminology**: Consistent use of "Complaints" terminology across the application

### 2.5. Analytics Dashboard
- **GA4 Integration**: Google Analytics 4 Data API integration
- **Admin Dashboard**: Real-time analytics metrics display
- **Metrics**: Total users, page views, sessions, bounce rate
- **Growth Tracking**: Period-over-period growth calculations
- **Top Pages**: Most viewed pages list
- **Admin Only**: Analytics access restricted to admin role
- **Error Handling**: Enhanced error messages for API failures, missing environment variables, authentication issues, and permission errors
- **User Feedback**: Detailed error messages displayed in Dashboard component with proper error extraction from API responses

### 3. Admin Dashboard
- **Dashboard**: Statistics and overview with GA4 analytics integration
  - Total users (7d/30d) with growth indicators
  - Page views (7d/30d) with growth indicators
  - Sessions (7d/30d)
  - Bounce rate (7d)
  - Top pages list
- **Firm Management**: Full CRUD for firms
- **Review Management**: Approve/reject reviews
- **User Management**: View and manage users
- **Role Management**: Assign roles to users
- **FAQ Management**: Create and organize FAQs
- **Newsletter**: Manage email subscriptions
- **Penalties**: Track firm penalties (partial implementation)
- **Affiliates**: Affiliate link management (partial implementation)

### 4. Public Website
- **Landing Page**: Hero with 3D models, firm slider (InfiniteSlider), firm list, complaints, FAQ, blogs, newsletter
- **Firm Detail Pages**: Dashboard, challenges, complaints tabs with enhanced UI
- **Complaint Submission**: Public form to submit complaints with file uploads (rebranded from Reviews)
- **Blog System**: Dynamic blog listing and detail pages with table of contents
- **FAQ Section**: Categorized FAQs with Zustand store management
- **Newsletter Signup**: Email subscription with admin management
- **Scroll Progress Indicator**: Visual scroll progress bar in navbar
- **ScrollToTop**: Automatic scroll to top on route changes

### 5. User Profile
- **Account Info**: View/edit profile
- **Personal Info**: Update name, phone, address
- **Security Settings**: Password, 2FA (via Clerk)
- **Notification Settings**: Email preferences
- **Danger Zone**: Account deletion

### 6. Enhanced UI/UX Features
- **Scroll-Linked Animation**: Navbar scroll progress indicator with gradient bar (Framer Motion)
- **Hidden Scrollbars**: Cross-browser scrollbar hiding for cleaner UI
- **InfiniteSlider**: Seamless scrolling image display component
- **ScrollToTop**: Automatic scroll to top on route changes
- **AnimatedNumber**: Dynamic number display with animations
- **3D Model Integration**: GLB format 3D models on landing page
- **Loading States**: Skeleton components for tables and content
- **Challenge Drawer**: Detailed challenge information with card-based layout, trading rules, and tooltips
- **Verification Badges**: Visual indicators for firm transparency features (check/cross icons)
- **Role-Based Navigation**: Dynamic sidebar based on user permissions (admin/editor)
- **Responsive Design**: Mobile-optimized layouts and components
- **Error Handling**: Comprehensive error states and user feedback
- **Table of Contents**: Sticky navigation for blog posts with scroll tracking and body scroll lock on mobile
- **Modal Dialogs**: Company description modals and confirmation dialogs
- **Enhanced Forms**: Multi-step forms with draft saving and validation
- **AnimatedSection**: Customizable animation thresholds for better control

### 7. Dynamic Blog Management System (Firm Reviews)
- **Database-Backed**: MongoDB FirmReview model with comprehensive schema
- **Blog Templates**: Pre-configured templates for different content types
  - **Review Template**: For prop firm and broker reviews (fully implemented)
  - **Guide Template**: For educational and how-to content (planned)
  - **News Template**: For industry news and updates (planned)
  - **Comparison Template**: For comparing services and platforms (planned)
- **Admin Interface**: Complete inline editing system
  - **Template Selection**: Modal for choosing blog template
  - **Inline Editing**: Click-to-edit functionality for all fields
  - **Section Editors**: Dedicated editors for each blog section
    - Basic Info (title, subtitle, firm name, rating, etc.)
    - Overview (quick snapshot with key-value pairs)
    - What Is (introduction with highlights and conclusion)
    - How Differs (advantages and limitations)
    - Programs Comparison (comparison table)
    - Platforms & Execution (platforms and instruments lists)
    - Final Verdict (rating, strengths, weaknesses, recommendation)
  - **Real-time Preview**: See changes as you edit
  - **Save/Draft System**: Save changes with loading states
- **Public Display**: Modular component-based rendering
  - **BlogHero**: Hero section with share functionality
  - **BlogIntroduction**: Introduction section
  - **BlogOverview**: Quick snapshot section
  - **BlogWhatIs**: "What is" section
  - **BlogHowDiffers**: "How differs" section
  - **BlogProgramsComparison**: Comparison table
  - **BlogPlatforms**: Platforms and execution
  - **BlogFinalVerdict**: Final verdict with strengths and weaknesses
  - **BlogTableOfContents**: Sticky navigation with scroll tracking
- **State Management**: Zustand store (`blogStore`) for data fetching
- **API Integration**: 
  - Admin API: Full CRUD operations with authentication
  - Public API: Read-only access for published reviews
  - Migration API: One-time migration from JSON to database
- **SEO Structure**: Organized content with meta information and TOC
- **Toast Notifications**: User feedback via sonner Toaster

---

## 🔧 Environment Variables

Required environment variables (`.env.local`):

```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017/my-forex-firms
# or
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
CLERK_WEBHOOK_SECRET=whsec_...

# Cloudinary (for firm logos)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# BunnyCDN (for review attachments)
BUNNYCDN_STORAGE_HOSTNAME=storage.bunnycdn.com
BUNNYCDN_STORAGE_ZONE_NAME=your-zone-name
BUNNYCDN_API_KEY=your-api-key
BUNNYCDN_CDN_BASE_URL=https://your-cdn.b-cdn.net

# SendGrid (for emails)
SENDGRID_API_KEY=SG....

# Google Analytics
NEXT_PUBLIC_GA_ID=G-ETPND6JE72

# Google Analytics 4 Data API (for admin analytics)
GA4_PROPERTY_ID=YOUR_GA4_PROPERTY_ID
GA_CLIENT_EMAIL=your-service-account@email
GA_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

---

## 🚀 Development Setup

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Clerk account
- Cloudinary account (for image uploads)
- BunnyCDN account (for file storage)

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Development Server
- **URL**: http://localhost:3000
- **Turbopack**: Enabled for faster builds

---

## 📝 Key Business Logic

### Firm Publishing Workflow
1. Admin creates firm via 8-step form
2. Firm saved as draft (`isDraft: true`, `isPublished: false`)
3. Admin can edit draft multiple times
4. When ready, admin publishes firm (`isPublished: true`, `isDraft: false`)
5. Published firms appear on public website
6. Status changes (closed/suspended) auto-unpublish firm

### Review Workflow
1. User submits review via `/post-review` page
2. Files uploaded to BunnyCDN
3. Review saved with `status: 'pending'`
4. Admin reviews in `/admin/reviews`
5. Admin approves (`status: 'approved'`) or rejects (`status: 'rejected'`)
6. Approved reviews appear on firm detail pages

### User Sync Workflow
1. User signs up via Clerk
2. Clerk webhook triggers `/api/users/webhook`
3. User record created/updated in MongoDB
4. Role synced from Clerk `publicMetadata.role`
5. Manual sync available via `/api/users/sync`

### File Upload Flow

**Firm Logos (Cloudinary)**:
- Upload via `/api/admin/firm` POST endpoint
- File sent as FormData
- Uploaded to Cloudinary
- URL stored in `logoFile` or `logoUrl`

**Review Attachments (BunnyCDN)**:
- Upload via `/api/reviews` POST endpoint
- Files sent as FormData
- Uploaded to BunnyCDN with retry logic
- URLs stored in review `files` array
- Files deleted when review is deleted

---

## 🎨 UI/UX Patterns

### Component Library
- **shadcn/ui**: Radix UI components with Tailwind styling
- **Location**: `src/components/ui/`
- **Configuration**: `components.json`

### Styling
- **Tailwind CSS**: Utility-first CSS
- **Custom Theme**: Defined in `globals.css`
- **Fonts**: Geist Sans, Geist Mono, Montserrat, Inter

### Animations
- **Motion (Framer Motion)**: Page transitions, component animations, scroll-linked animations
- **AnimatedSection**: Wrapper component for scroll animations with customizable thresholds
- **Scroll-Linked Animation**: Navbar scroll progress indicator using `useScroll` and `scrollYProgress`
- **AnimatedNumber**: Dynamic number display with smooth transitions
- **InfiniteSlider**: Seamless infinite scrolling animations for images

### Form Handling
- **React Hook Form**: Form state management
- **Zod**: Schema validation
- **@hookform/resolvers**: Zod integration

---

## 🔍 Important Notes

### Dual Firm Models
- **Firm** (`models/Firm.ts`): New, comprehensive schema
- **FirmDetails** (`models/FirmDetails.ts`): Legacy schema
- **Note**: Check which model is used in each API route. New implementations should use `Firm` model.

### Database Collections
- `firms` - New Firm model
- `funding_firms` - Legacy FirmDetails model
- `firmreviews` - Firm reviews/blogs (FirmReview model)
- `reviews` - Reviews
- `users` - Users
- `faqs` - FAQs
- `faqcategories` - FAQ categories
- `emailsubscriptions` - Newsletter subscriptions
- `auditlogs` - Audit trail

### Authentication Context
- Use `currentUser()` from `@clerk/nextjs/server` in API routes
- Use `useUser()` from `@clerk/nextjs` in client components
- User ID is stored as `userId` in MongoDB (matches Clerk user ID)

### File Storage Strategy
- **Cloudinary**: Firm logos, images (optimized, CDN)
- **BunnyCDN**: Review attachments (cost-effective, fast)
- **Public folder**: Static assets (logos, icons)

### Error Handling
- API routes return JSON with `success` boolean
- Error messages in `message` or `error` field
- HTTP status codes: 200 (success), 400 (bad request), 401 (unauthorized), 403 (forbidden), 404 (not found), 500 (server error)
- **Analytics API**: Enhanced error handling with specific messages for:
  - Missing Google Analytics environment variables
  - Authentication/credential failures
  - Permission errors (403 status)
  - Safe error message exposure (excludes sensitive data like private keys)
- **Frontend Error Display**: Dashboard components extract and display actual error messages from API responses for better debugging

### Pagination Pattern
- Query params: `page`, `limit`
- Response includes: `data`, `pagination: { page, limit, total, totalPages }`

### Search Pattern
- Text search via MongoDB `$regex` with case-insensitive option
- Full-text search indexes on key fields
- Search param: `search` or `query`

---

## 🐛 Common Issues & Solutions

### MongoDB Connection
- **Issue**: Connection timeout
- **Solution**: Check `MONGODB_URI`, ensure MongoDB is running, check network/firewall

### Clerk Authentication
- **Issue**: User not authenticated in API routes
- **Solution**: Ensure `currentUser()` is awaited, check middleware configuration

### File Upload Failures
- **Issue**: Cloudinary/BunnyCDN upload fails
- **Solution**: Check API keys, verify file size limits, check network connectivity

### Role Access Denied
- **Issue**: User can't access admin routes
- **Solution**: Check `publicMetadata.role` in Clerk, ensure role is synced to MongoDB

---

## 📚 Additional Resources

### Documentation Files
- `docs/IMPLEMENTATION_SUMMARY.md` - Implementation details
- `docs/FORM_IMPLEMENTATION_SUMMARY.md` - Form implementation
- `docs/NEWSLETTER_API_SUMMARY.md` - Newsletter API docs
- `docs/BUNNYCDN_INTEGRATION_REPORT.md` - BunnyCDN setup
- `TrackFile.md` - Feature tracking and progress

### External Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Clerk Docs](https://clerk.com/docs)
- [Mongoose Docs](https://mongoosejs.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)

---

## 🎯 Development Workflow

### Starting a New Feature
1. Check existing models and API routes
2. Create/update Mongoose model if needed
3. Create API route in appropriate folder
4. Create UI components in appropriate folder
5. Add route protection in middleware if needed
6. Test authentication and authorization
7. Test file uploads if applicable
8. Update documentation

### Code Style
- **TypeScript**: Strict mode enabled
- **ESLint**: Configured with Next.js rules
- **Formatting**: Prefer consistent formatting (consider Prettier)

### Git Workflow
- **Branch**: `v1` (current branch)
- **Untracked files**: Some new features may be untracked (check git status)

---

## 📝 Recent Git Commits

### Latest Commits Summary (December 7-12, 2025)
- **b46ba6c** (Dec 12): Enhance role-based access control and error handling in analytics and reviews APIs - Improved error messages for Google Analytics API failures, enhanced Dashboard component error handling with detailed error extraction from API responses, added specific error messages for missing environment variables, authentication failures, and permission errors in analytics routes
- **a834491** (Dec 12): Rebrand Reviews to Complaints and enhance admin navigation - Updated terminology and navigation structure
- **fdfb132** (Dec 12): Update ReviewViewModal and FirmListSection for improved UI and terminology - Added MessageCircle icon, updated styling, changed "Reviews" to "Complaints"
- **6def384** (Dec 12): Enhance scrollbar visibility and navbar scroll effect - Hidden scrollbars across all browsers, integrated scroll progress indicator with gradient bar
- **a7be352** (Dec 12): Introduce InfiniteSlider component for enhanced image display - Seamless scrolling image experience, integrated into TrustedFirmSlider
- **1213e49** (Dec 11): Implement CRM point evaluation system with admin APIs, UI components, and review management
- **67feef7** (Dec 11): Update FirstSection component for improved UI consistency - Changed "Verified Brokers" to "Verified Propfirms"
- **222847d** (Dec 11): Implement point evaluation and review management system with dedicated API endpoints, models, and utilities
- **3b3db88** (Dec 11): Add new trusted firms to TrustedFirmSlider - Funding Pips, 5%ers, Alpha Capital
- **f7853db** (Dec 11): Enhance blog navigation and user interaction - Integrated useRouter for direct navigation to blog posts
- **5044186** (Dec 11): Enhance scrolling behavior and UI components - ScrollToTop component, improved BlogDetailPage scroll calculation, customizable AnimatedSection threshold
- **341d841** (Dec 11): Update UI elements in Subscribe and TrustedFirmSlider components - Cleaner button styling, improved layout
- **07f390d** (Dec 11): Refine UI elements and enhance user feedback in complaints section - Improved text shadows, gradient text styling, redirect after form submission
- **4ac63d5** (Dec 10): Introduce Complaints functionality and update related components - New pages and components for managing user complaints, updated terminology from "Reviews" to "Complaints"
- **7cbe7dd** (Dec 10): Update terminology from "Reviews" to "Complaints" across the application
- **866ef4d** (Dec 10): Enhance ChallengesContent and FirmHeader components - Detailed trading rules, tooltips, formatPayout function
- **dd45540** (Dec 8): Implement firm program creation and configuration within CRM - Profit/payout settings, trading rules, evaluation steps
- **d9578ea** (Dec 8): Introduce AnimatedNumber component for dynamic number display
- **c752163** (Dec 7): PTI score calculation implementation
- **50fb259** (Dec 7): Replace GLTF model with GLB format and enhance 3D canvas integration
- **e00de20** (Dec 7): Enhance landing page with 3D model and updated statistics

### Previous Commits Summary (November 27-28, 2024)
- **0045c93** (Nov 28): Enhanced blog components and improved loading states - Modularized blog components, added Toaster for notifications
- **41e8490** (Nov 28): Introduced blog management features and enhanced admin interface - Complete blog CRUD system with inline editing
- **abf2c8d** (Nov 28): Implemented blog detail page with dynamic review data and loading state
- **0335272** (Nov 28): Enhanced website metadata and introduced new blog and review pages - SEO improvements
- **65bfe15** (Nov 27): Added blog detail page, sidebar navigation, and slider component
- **1e5e825** (Nov 27): Implemented blog detail page with dynamic content and interactive table of contents
- **9b07c36** (Nov 27): Updated Skeleton component styling and enhanced table header font weight
- **c6d7d80** (Nov 27): Updated success color scheme and enhanced UI components across the platform

### Key Development Milestones
1. **Scroll-Linked Animation**: Navbar scroll progress indicator with gradient bar (December 12, 2025)
2. **Complaints System**: Complete rebranding from "Reviews" to "Complaints" with new functionality (December 10, 2025)
3. **InfiniteSlider Component**: Seamless scrolling image display for firm logos (December 12, 2025)
4. **Point Evaluation System (PTI)**: Complete scoring system for firm assessment with calculation and storage (December 7-11, 2025)
5. **ScrollToTop Component**: Automatic scroll to top on route changes (December 11, 2025)
6. **AnimatedNumber Component**: Dynamic number display with animations (December 8, 2025)
7. **3D Model Integration**: GLB format 3D models on landing page (December 7, 2025)
8. **Blog Management System**: Complete CRUD system with database-backed firm reviews (November 28, 2024)
9. **Component Modularization**: Broke down blog pages into reusable components (BlogHero, BlogIntroduction, etc.)
10. **Toast Notifications**: Integrated sonner Toaster for user feedback
11. **Modern Data Fetching**: Migration to TanStack Query + Axios
12. **UI Consistency**: Success color theming and improved component styling
13. **Role-Based Security**: Enhanced access control and loading states

---

## 🔄 Recent Changes & Status

### Completed Features ✅
- **Admin Dashboard**: Full admin panel with role-based sidebar navigation
- **Firm Management**: 8-step form with draft system, publish/unpublish functionality
- **Complaints System**: Complete complaint submission system (rebranded from Reviews) with enhanced categorization and file uploads (BunnyCDN)
- **Point Evaluation System (PTI)**: Comprehensive firm assessment with scoring metrics, calculation, and storage
- **User Authentication**: Clerk integration with role-based access control
- **FAQ Management**: Admin panel with categories, public API with Zustand store
- **Newsletter System**: Enhanced subscription management with form validation and error handling
- **User Management**: User listing, role assignment, Clerk webhook sync
- **Role Management**: Admin/Editor/Moderator roles with route restrictions
- **File Uploads**: Cloudinary (firm logos) + BunnyCDN (review attachments)
- **Public API**: `/api/public/faqs` with category filtering and firm program endpoints
- **UI Components**: Custom accordion, loading screens, skeleton components with improved styling
- **Firm Detail Pages**: Dashboard, challenges, complaints with enhanced UI and scroll tracking
- **Challenge Management**: Programs with detailed drawer interface, trading rules, and tooltips
- **Blog System**: Complete database-backed blog management system with inline editing
- **Blog Components**: Modular, reusable components for blog rendering (BlogHero, BlogIntroduction, etc.)
- **Content Builder**: Inline editing system with section-specific editors
- **Public Blog Display**: Dynamic blog rendering with table of contents and scroll tracking
- **Blog State Management**: Zustand store for blog data with Axios integration
- **Toast Notifications**: sonner Toaster for user feedback and notifications
- **Data Fetching**: Modern data fetching with TanStack Query and Axios integration
- **UI Theming**: Consistent success color scheme across all components
- **Scroll-Linked Animation**: Navbar scroll progress indicator with gradient bar using Framer Motion
- **InfiniteSlider Component**: Seamless scrolling image display for firm logos and images
- **ScrollToTop Component**: Automatic scroll to top on route changes
- **AnimatedNumber Component**: Dynamic number display with animations
- **3D Model Integration**: GLB format 3D models integrated into landing page
- **Hidden Scrollbars**: Cross-browser scrollbar hiding for cleaner UI
- **Firm Program Configuration**: Complete CRM system for firm program creation with profit/payout settings

### Recently Added Features 🆕 (December 7-12, 2025)
- **Analytics Error Handling**: Enhanced error handling for analytics API
  - Detailed error messages for missing Google Analytics environment variables
  - Specific error messages for authentication and credential failures
  - Permission error handling with appropriate HTTP status codes
  - Dashboard component extracts and displays actual error messages from API responses
  - Improved debugging experience with clear error context
- **Scroll-Linked Animation**: Navbar scroll progress indicator
  - Framer Motion integration with `useScroll` hook and `scrollYProgress`
  - Gradient progress bar (3px height) at top of page
  - Fixed positioning with z-index 51 (above navbar)
  - Smooth horizontal scaling from 0 to 1 based on scroll position
- **Hidden Scrollbars**: Cross-browser scrollbar hiding
  - CSS rules for Chrome, Safari, Opera (webkit-scrollbar)
  - Firefox (scrollbar-width: none)
  - IE/Edge (-ms-overflow-style: none)
  - Applied to both html and body elements
- **InfiniteSlider Component**: Seamless scrolling image display
  - Reusable component for infinite horizontal scrolling
  - Integrated into TrustedFirmSlider for firm logos
  - Type-safe with SliderImage interface
  - Directional control (left/right)
- **Complaints System**: Complete rebranding from "Reviews" to "Complaints"
  - Updated terminology across all components and pages
  - New complaint icon and visual representation
  - Updated navigation links and routes
  - Enhanced complaint submission form with redirect after submission
  - Success modal with dialog header for user feedback
- **Point Evaluation System (PTI)**: Comprehensive scoring system
  - PTI score calculation and storage
  - Admin APIs for point evaluation
  - UI components for displaying evaluation metrics
  - Integration with firm assessment workflow
- **ScrollToTop Component**: Automatic scroll management
  - Scrolls to top on route changes
  - Improved BlogDetailPage scroll position calculation
  - Enhanced navigation experience
- **AnimatedNumber Component**: Dynamic number display
  - Animated number transitions
  - Used for statistics and metrics display
- **3D Model Integration**: Enhanced landing page
  - GLB format 3D models (replaced GLTF)
  - Enhanced 3D canvas integration
  - Updated statistics display
- **Enhanced ChallengesContent**: Improved challenge details
  - Detailed trading rules display
  - Tooltips for user guidance
  - Better layout and loading states
- **FirmHeader Enhancements**: Improved firm information display
  - formatPayout function for better payout value display
  - Enhanced UI consistency
- **Firm Program Configuration**: Complete CRM system
  - Firm program creation and configuration
  - Profit/payout settings
  - Trading rules configuration
  - Evaluation steps management
- **AnimatedSection Improvements**: Customizable animation thresholds
  - Threshold prop for animation triggering control
  - Better animation control in BlogIntroduction and BlogOverview
  - Mobile Table of Contents with body scroll lock
- **Blog Navigation Enhancements**: Improved user interaction
  - Direct navigation to individual blog posts via useRouter
  - Enhanced cursor styling for clickable elements
  - Better user feedback on interactions
- **TrustedFirmSlider Updates**: Enhanced firm display
  - Added new firms: Funding Pips, 5%ers, Alpha Capital
  - Updated links and logos
  - Improved layout and padding
  - Reduced logo size for better alignment
- **FirstSection Updates**: Improved landing page hero
  - Changed "Verified Brokers" to "Verified Propfirms"
  - Adjusted maximum width for better responsiveness
  - Enhanced text styling with tracking-tight

### Previously Added Features 🆕 (November 27-28, 2024)
- **Complete Blog Management System**: Database-backed firm review system with full CRUD operations
  - MongoDB FirmReview model with comprehensive schema
  - Admin API endpoints for blog management
  - Public API endpoints for blog display
  - Migration endpoint for JSON to database migration
- **Modular Blog Components**: Broke down blog pages into reusable components
  - BlogHero with share functionality (copy URL to clipboard)
  - BlogIntroduction, BlogOverview, BlogWhatIs, BlogHowDiffers
  - BlogProgramsComparison, BlogPlatforms, BlogFinalVerdict
  - BlogTableOfContents with scroll tracking
- **Inline Blog Editing**: Complete admin interface for editing blog content
  - Template selection modal
  - Click-to-edit functionality for all fields
  - Section-specific editors (BasicInfo, Overview, WhatIs, etc.)
  - Real-time preview and save functionality
- **Toast Notifications**: Integrated sonner Toaster for user feedback
  - Success/error notifications for user actions
  - Position: top-center with rich colors
- **Blog State Management**: Zustand store (`blogStore`) for centralized blog data
  - Fetch all blogs and single blog by slug
  - Loading states and error handling
  - Helper hooks: `useBlogList()` and `useBlog()`
- **SEO Enhancements**: Dynamic metadata for blog and firm pages
  - Individual page layouts with metadata
  - Open Graph image updates
- **Component Modularization**: Refactored large components into smaller, focused ones
  - Improved code maintainability
  - Better loading states and error handling
- **Blog Detail Pages**: Complete blog detail pages with dynamic content and interactive table of contents
- **Scroll Tracking**: Active section highlighting as users scroll through blog content
- **Admin Point Evaluation System**: Comprehensive point evaluation system for firm assessment
- **Enhanced Review System**: Improved review management with better categorization
- **Firm Program API**: Public API endpoints for firm program details
- **TanStack Query Integration**: Modern data fetching with Axios and TanStack Query
- **Success Color Theming**: Consistent success color scheme across all components
- **Enhanced Subscribe Component**: Form handling and error states for newsletter subscription
- **Skeleton Component Updates**: Improved loading states with better visual consistency
- **Slider Component**: New reusable slider component for UI interactions
- **Role-Based Access Control**: Editor restrictions for sensitive admin pages
- **Unauthorized Page**: Dedicated page for access denied scenarios
- **FAQ Store**: Zustand store for FAQ data management with category filtering
- **Enhanced UI Components**: 
  - Table skeleton loading states with improved styling
  - Custom accordion with animation
  - Challenge detail drawer with card-based layout
  - Improved firm header with verification badges
  - Modal dialogs for detailed content
- **Middleware Enhancements**: Route protection with role-based redirects
- **API Improvements**: Public FAQ API with category support

### Partially Implemented ⚠️
- **Penalty System**: Basic structure exists, needs full implementation
- **Analytics Dashboard**: Basic stats, needs comprehensive metrics
- **Affiliate Links**: Structure exists, needs full functionality (admin only access implemented)
- **Challenge System**: Basic structure with enhanced UI, needs PropTrust Index integration
- **Blog Templates**: Only Review Template fully implemented, other templates (Guide, News, Comparison) planned
- **Firm Model**: Legacy FirmDetails model still in use, new Firm model partially implemented

### Not Implemented ❌
- **PropTrust Index Calculation**: Core rating algorithm
- **Leaderboard System**: Firm ranking and comparison
- **Compare Firms Feature**: Side-by-side firm comparison
- **Featured Listings**: Paid promotion system
- **Comprehensive Analytics**: Advanced metrics and reporting
- **Schema Markup (SEO)**: Structured data for search engines
- **Real-time Notifications**: Push notifications for admin actions
- **Blog SEO Optimization**: Meta tags, structured data for blogs
- **Blog Comments System**: User comments on blog posts
- **Blog Search**: Search functionality for blog content

---

## 💡 Tips for Daily Development

1. **Always check authentication**: Use `currentUser()` in API routes
2. **Check role permissions**: Verify user has required role before operations
3. **Handle file uploads carefully**: Use appropriate service (Cloudinary vs BunnyCDN)
4. **Use TypeScript types**: Leverage model interfaces for type safety
5. **Test with real data**: Use MongoDB Compass or similar to verify data
6. **Check middleware**: Ensure routes are properly protected
7. **Review audit logs**: Check AuditLog collection for change history
8. **Monitor errors**: Check console and API responses for error messages
9. **Use draft system**: Save firms as drafts before publishing
10. **Test file cleanup**: Ensure files are deleted when entities are deleted
11. **Use Zustand stores**: Leverage existing stores for state management (FAQ, Firm Management)
12. **Implement loading states**: Use skeleton components for better UX
13. **Test role restrictions**: Verify editor/admin access controls work correctly
14. **Use public APIs**: Leverage `/api/public/*` endpoints for public data
15. **Follow UI patterns**: Use established card layouts and component structures
16. **Blog Template System**: Use template-based approach for consistent blog structure
17. **Section-Based Content**: Build content using modular sections for flexibility
18. **Auto-Initialize Templates**: System automatically creates default templates on first use

---

**Last Updated**: December 12, 2025 - Updated based on recent Git commits (Dec 7-12, 2025) including analytics error handling improvements, role-based access control enhancements, scroll-linked animation, complaints system rebranding, InfiniteSlider component, PTI point evaluation system, ScrollToTop component, AnimatedNumber component, 3D model integration, and various UI/UX enhancements
**Version**: 1.5.0
**Maintainer**: Development Team

## 🎨 Recent UI/UX Improvements

### Enhanced Components (December 2025)
- **Scroll Progress Indicator**: Gradient progress bar in navbar showing scroll position
  - Framer Motion scroll-linked animation
  - 3px height gradient bar (orange to dark brown)
  - Fixed at top of page with proper z-index
- **InfiniteSlider**: Seamless horizontal scrolling for images
  - Used in TrustedFirmSlider for firm logos
  - Smooth infinite loop animation
  - Type-safe implementation
- **ScrollToTop**: Automatic scroll management on route changes
  - Improves navigation experience
  - Better scroll position calculation
- **AnimatedNumber**: Dynamic number display with animations
  - Used for statistics and metrics
  - Smooth number transitions
- **Hidden Scrollbars**: Cleaner UI with hidden default scrollbars
  - Cross-browser support
  - Maintains scroll functionality
- **Complaint Icons**: New SVG icons for complaints functionality
- **Enhanced ChallengesContent**: 
  - Detailed trading rules with tooltips
  - Better layout and loading states
  - Improved skeleton display
- **FirmHeader Improvements**: 
  - formatPayout function for better value display
  - Enhanced UI consistency
- **3D Model Integration**: GLB format 3D models on landing page
  - Enhanced 3D canvas integration
  - Better performance with GLB format

### Enhanced Components (Previous)
- **Challenge Details Drawer**: Clean, card-based layout with key metrics
- **Table Skeletons**: Professional loading states for data tables
- **Verification Badges**: Visual indicators for firm transparency (CEO verified, office verified, etc.)
- **Custom Accordion**: Animated FAQ accordion with proper state management
- **Loading Screens**: Branded loading screens with progress indicators
- **Blog Table of Contents**: Sticky navigation with scroll-based highlighting
- **Modal Dialogs**: Company description and confirmation modals
- **Modular Blog Components**: 
  - BlogHero with share functionality
  - BlogIntroduction, BlogOverview, BlogWhatIs, BlogHowDiffers
  - BlogProgramsComparison, BlogPlatforms, BlogFinalVerdict
  - Each component wrapped in AnimatedSection for smooth transitions
- **Toast Notifications**: sonner Toaster for user feedback (top-center position)
- **Inline Editors**: EditableField, EditableText, EditableTextarea, EditableArray, EditableKeyValue, EditableProsCons
- **Section Editors**: BasicInfoEditor, OverviewEditor, WhatIsEditor, HowDiffersEditor, ProgramsComparisonEditor, PlatformsEditor, FinalVerdictEditor

### Role-Based Features
- **Dynamic Sidebar**: Different navigation items for admin vs editor roles
- **Access Control**: Proper restrictions for sensitive admin functions
- **Unauthorized Page**: Dedicated page for access denied scenarios
- **Loading States**: Show loading while determining user permissions
- **Blog Management**: Role-based access to blog creation and editing

### Data Management
- **FAQ Store**: Zustand store for FAQ data with category filtering
- **Blog Store**: Zustand store (`blogStore`) for blog/firm review data management
  - Centralized state for blog list and single blog
  - Helper hooks: `useBlogList()` and `useBlog()`
  - Axios integration with error handling
- **Public API Integration**: Clean separation of public vs admin APIs
- **Enhanced Middleware**: Comprehensive route protection with role checks
- **Blog Template System**: Template definitions in `lib/blog-templates.ts`
- **Content Builder**: Inline editing system with section-specific editors
- **Database Models**: FirmReview model with comprehensive schema validation

### Blog System Features
- **Database-Backed**: MongoDB FirmReview model with full schema
- **Template Selection**: Multiple blog templates (Review Template fully implemented)
- **Inline Editing**: Click-to-edit functionality for all blog fields
- **Section Editors**: Dedicated editors for each blog section
- **Content Types**: Text, tables, pros/cons, ratings, images, lists, key-value pairs
- **Modular Components**: Reusable blog rendering components (BlogHero, BlogIntroduction, etc.)
- **Public Rendering**: Dynamic blog display with enhanced UX and interactive table of contents
- **Scroll Tracking**: Active section highlighting as users navigate through content
- **Share Functionality**: Copy blog URL to clipboard with toast notification
- **State Management**: Zustand store for centralized blog data management
- **API Integration**: Admin and public API endpoints with authentication
- **Migration Support**: One-time migration from JSON to database
- **SEO Ready**: Structured content with meta information and dynamic metadata
- **Responsive Design**: Mobile-optimized blog layouts with floating TOC button
- **Toast Notifications**: User feedback via sonner Toaster

