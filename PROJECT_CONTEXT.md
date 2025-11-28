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
│   │   │   ├── reviews/              # Reviews page
│   │   │   ├── post-review/          # Submit review page
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
│   │   │   │   ├── create/           # Create new blog
│   │   │   │   ├── [id]/edit/        # Edit existing blog
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
│   │   │   │   ├── blogs/            # Blog management API
│   │   │   │   ├── blog-templates/   # Blog template API
│   │   │   │   ├── firm/             # Firm management API
│   │   │   │   ├── firm-program/     # Firm program API
│   │   │   │   ├── point-eval/       # Point evaluation API
│   │   │   │   ├── reviews/          # Review management API (enhanced)
│   │   │   │   ├── users/            # User management API
│   │   │   │   └── faq/              # FAQ management API
│   │   │   ├── reviews/              # Review API
│   │   │   ├── newsletter/           # Newsletter API
│   │   │   ├── public/               # Public API endpoints
│   │   │   │   ├── blogs/            # Public blog API
│   │   │   │   ├── faqs/             # Public FAQ API
│   │   │   │   └── firm-details/     # Public firm API
│   │   │   ├── users/                # User API (webhooks)
│   │   │   ├── test-db/              # Database testing
│   │   │   └── website/              # Website API
│   │   ├── layout.tsx                # Root layout (ClerkProvider)
│   │   └── globals.css               # Global styles
│   ├── components/
│   │   ├── admin/                    # Admin-specific components
│   │   │   └── blog-builder/         # Blog creation components
│   │   │       ├── BlogBuilder.tsx   # Main blog builder
│   │   │       ├── SectionBuilder.tsx # Section builder
│   │   │       └── sections/         # Individual section builders
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
│   │   │   │   ├── DynamicBlogRenderer.tsx # Main blog renderer
│   │   │   │   └── sections/         # Blog section renderers
│   │   │   ├── firms/                # Firm display components
│   │   │   ├── landing-page/         # Landing page sections
│   │   │   ├── post-review/          # Review submission form
│   │   │   ├── navbar.jsx            # Navigation bar
│   │   │   ├── footer.jsx            # Footer
│   │   │   ├── bottombar.jsx         # Bottom navigation
│   │   │   └── ...                   # Other website components
│   │   ├── profile/                  # User profile components
│   │   ├── reviews/                  # Review display components
│   │   ├── ui/                       # Reusable UI components (shadcn/ui)
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
│   │   └── utils.ts                  # General utilities (cn, etc.)
│   ├── models/                       # Mongoose models
│   │   ├── Firm.ts                   # Main Firm model (new schema)
│   │   ├── FirmDetails.ts            # FirmDetails model (legacy)
│   │   ├── FirmProgram.ts            # Firm program/challenge model
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
│   │   └── faqStore.ts               # FAQ data management
│   ├── types/                        # TypeScript types
│   │   ├── index.ts                  # Type exports
│   │   ├── user.ts                   # User types
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

#### Reviews
- `GET /api/admin/reviews` - List reviews (with filters)
- `POST /api/admin/reviews` - Approve/reject review

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

#### Point Evaluation
- `GET /api/admin/point-eval` - Get evaluation points and metrics for firm assessment

### Public API (`/api/public/`)

#### FAQs
- `GET /api/public/faqs` - Get active FAQs with category filtering
  - Query params: `categoryId` (ObjectId), `category` (name, case-insensitive)
  - Returns only active FAQs from active categories
  - Populates category names in response

#### Firm Details
- `GET /api/public/firm-details/[slug]` - Get published firm by slug
- `GET /api/public/firm-details/[slug]/program` - Get firm programs by slug

### Reviews API (`/api/reviews/`)
- `GET /api/reviews` - Get reviews (filtered by user/admin)
- `POST /api/reviews` - Create review (with BunnyCDN file upload)
- `DELETE /api/reviews` - Delete review(s)

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

### 2. Review System
- **Review Submission**: Users can submit reviews with files
- **File Upload**: BunnyCDN integration for review attachments
- **Moderation**: Admin approval/rejection workflow
- **Issue Types**: Categorized complaint types
- **Analytics**: Track views, helpful votes, shares
- **Verification**: Admin can verify reviews

### 3. Admin Dashboard
- **Dashboard**: Statistics and overview
- **Firm Management**: Full CRUD for firms
- **Review Management**: Approve/reject reviews
- **User Management**: View and manage users
- **Role Management**: Assign roles to users
- **FAQ Management**: Create and organize FAQs
- **Newsletter**: Manage email subscriptions
- **Penalties**: Track firm penalties (partial implementation)
- **Affiliates**: Affiliate link management (partial implementation)

### 4. Public Website
- **Landing Page**: Hero, firm slider, firm list, reviews, FAQ, blogs, newsletter
- **Firm Detail Pages**: Dashboard, challenges, reviews tabs with enhanced UI
- **Review Submission**: Public form to submit reviews with file uploads
- **Blog System**: Dynamic blog listing and detail pages with table of contents
- **FAQ Section**: Categorized FAQs with Zustand store management
- **Newsletter Signup**: Email subscription with admin management

### 5. User Profile
- **Account Info**: View/edit profile
- **Personal Info**: Update name, phone, address
- **Security Settings**: Password, 2FA (via Clerk)
- **Notification Settings**: Email preferences
- **Danger Zone**: Account deletion

### 6. Enhanced UI/UX Features
- **Loading States**: Skeleton components for tables and content
- **Challenge Drawer**: Detailed challenge information with card-based layout
- **Verification Badges**: Visual indicators for firm transparency features (check/cross icons)
- **Role-Based Navigation**: Dynamic sidebar based on user permissions (admin/editor)
- **Responsive Design**: Mobile-optimized layouts and components
- **Error Handling**: Comprehensive error states and user feedback
- **Table of Contents**: Sticky navigation for blog posts with scroll tracking
- **Modal Dialogs**: Company description modals and confirmation dialogs
- **Enhanced Forms**: Multi-step forms with draft saving and validation

### 7. Dynamic Blog Management System
- **Blog Templates**: Pre-configured templates for different content types
  - **Review Template**: For prop firm and broker reviews
  - **Guide Template**: For educational and how-to content
  - **News Template**: For industry news and updates
  - **Comparison Template**: For comparing services and platforms
- **Content Builder**: Section-based blog creation with multiple content types
  - **Text Sections**: Rich text content with formatting
  - **Overview Tables**: Key information in structured format
  - **Pros & Cons**: Advantage/disadvantage comparisons
  - **Comparison Tables**: Side-by-side feature comparisons
  - **Rating Sections**: Star ratings and scoring
  - **Image Sections**: Media content with captions
  - **List Sections**: Ordered and unordered lists
- **Blog Management**: Complete CRUD operations for blog content
- **Public Display**: Dynamic blog rendering with enhanced UX
- **SEO Structure**: Organized content with meta information and TOC

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
- **Motion (Framer Motion)**: Page transitions, component animations
- **AnimatedSection**: Wrapper component for scroll animations

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
- HTTP status codes: 200 (success), 400 (bad request), 401 (unauthorized), 404 (not found), 500 (server error)

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

## 📝 Recent Git Commits (November 2024)

### Latest Commits Summary
- **65bfe15**: Added blog detail page, sidebar navigation, and slider component
- **1e5e825**: Implemented blog detail page with dynamic content and interactive table of contents
- **9b07c36**: Updated Skeleton component styling and enhanced table header font weight
- **c6d7d80**: Updated success color scheme and enhanced UI components across the platform
- **924753a**: Removed react-country-flag dependency, added firms page, enhanced Subscribe component
- **77c695b**: Major update - Introduced admin point evaluation, firm review system, and comprehensive CRM
- **79e0aa5**: Added totalPayout and slug support, updated forms, fixed FAQ count in admin
- **4c07077**: Integrated Axios + TanStack Query for modern data fetching
- **5c888b0**: Implemented role-based access control and loading states for admin pages

### Key Development Milestones
1. **Point Evaluation System**: Complete scoring system for firm assessment
2. **Enhanced Review Management**: Improved categorization and admin interface
3. **Modern Data Fetching**: Migration to TanStack Query + Axios
4. **Blog System Enhancement**: Interactive table of contents and scroll tracking
5. **UI Consistency**: Success color theming and improved component styling
6. **Role-Based Security**: Enhanced access control and loading states

---

## 🔄 Recent Changes & Status

### Completed Features ✅
- **Admin Dashboard**: Full admin panel with role-based sidebar navigation
- **Firm Management**: 8-step form with draft system, publish/unpublish functionality
- **Review System**: Complete review submission with enhanced categorization and file uploads (BunnyCDN)
- **Point Evaluation System**: Comprehensive firm assessment with scoring metrics
- **User Authentication**: Clerk integration with role-based access control
- **FAQ Management**: Admin panel with categories, public API with Zustand store
- **Newsletter System**: Enhanced subscription management with form validation and error handling
- **User Management**: User listing, role assignment, Clerk webhook sync
- **Role Management**: Admin/Editor/Moderator roles with route restrictions
- **File Uploads**: Cloudinary (firm logos) + BunnyCDN (review attachments)
- **Public API**: `/api/public/faqs` with category filtering and firm program endpoints
- **UI Components**: Custom accordion, loading screens, skeleton components with improved styling
- **Firm Detail Pages**: Dashboard, challenges, reviews with enhanced UI and scroll tracking
- **Challenge Management**: Programs with detailed drawer interface
- **Blog System**: Dynamic blog management with multiple templates and interactive table of contents
- **Content Builder**: Section-based blog builder with rich content types
- **Public Blog Display**: Dynamic blog rendering with table of contents and scroll tracking
- **Data Fetching**: Modern data fetching with TanStack Query and Axios integration
- **UI Theming**: Consistent success color scheme across all components

### Recently Added Features 🆕 (November 2024)
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
- **Blog Migration**: Migration script exists but needs to be executed
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

**Last Updated**: November 27, 2024 - Updated based on recent Git commits including blog detail pages, point evaluation system, enhanced review management, and modern data fetching
**Version**: 1.3.0
**Maintainer**: Development Team

## 🎨 Recent UI/UX Improvements

### Enhanced Components
- **Challenge Details Drawer**: Clean, card-based layout with key metrics
- **Table Skeletons**: Professional loading states for data tables
- **Verification Badges**: Visual indicators for firm transparency (CEO verified, office verified, etc.)
- **Custom Accordion**: Animated FAQ accordion with proper state management
- **Loading Screens**: Branded loading screens with progress indicators
- **Blog Table of Contents**: Sticky navigation with scroll-based highlighting
- **Modal Dialogs**: Company description and confirmation modals
- **Dynamic Blog Renderer**: Section-based content rendering with rich components

### Role-Based Features
- **Dynamic Sidebar**: Different navigation items for admin vs editor roles
- **Access Control**: Proper restrictions for sensitive admin functions
- **Unauthorized Page**: Dedicated page for access denied scenarios
- **Loading States**: Show loading while determining user permissions
- **Blog Management**: Role-based access to blog creation and editing

### Data Management
- **FAQ Store**: Zustand store for FAQ data with category filtering
- **Public API Integration**: Clean separation of public vs admin APIs
- **Enhanced Middleware**: Comprehensive route protection with role checks
- **Blog Template System**: Dynamic template initialization and management
- **Content Builder**: Modular section-based content creation

### Blog System Features
- **Template Selection**: Multiple blog templates for different content types
- **Section Builder**: Drag-and-drop style section management
- **Content Types**: Text, tables, pros/cons, ratings, images, lists
- **Public Rendering**: Dynamic blog display with enhanced UX and interactive table of contents
- **Scroll Tracking**: Active section highlighting as users navigate through content
- **SEO Ready**: Structured content with meta information
- **Responsive Design**: Mobile-optimized blog layouts with floating TOC button

