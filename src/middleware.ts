import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import AdminEmail from '@/models/AdminEmail'

// Type for AdminEmail model
type AdminEmailModel = {
  findOne: (query: { email: string; status: string }) => Promise<{ email: string; status: string } | null>
}

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)'
])

const isDashboardRoute = createRouteMatcher([
  '/admin(.*)'
])

const isAdminRoute = createRouteMatcher([
  '/admin/users(.*)',
  '/api/admin(.*)'
])



export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
    
    // Check dashboard routes for email-based access
    if (isDashboardRoute(req)) {
      const { userId } = await auth()
      
      if (!userId) {
        return NextResponse.redirect(new URL('/sign-in', req.url))
      }

      try {
        // Get user's email from Clerk directly (middleware context)
        const { clerkClient } = await import('@clerk/nextjs/server')
        const clerk = await clerkClient()
        const user = await clerk.users.getUser(userId)
        
        const userEmail = user.emailAddresses?.[0]?.emailAddress

        console.log('🔍 Middleware Debug:')
        console.log('- User ID:', userId)
        console.log('- User Email Addresses:', user.emailAddresses?.map(e => e.emailAddress))
        console.log('- Primary Email:', userEmail)

        if (!userEmail) {
          console.log('❌ No email found in user object')
          return NextResponse.redirect(new URL('/', req.url))
        }

        // Check admin status using database admin emails
        console.log('🔍 Checking admin status for:', userEmail.toLowerCase())
        
        // Connect to database and check if email is in admin list
        await connectDB()
        const adminEmail = await (AdminEmail as unknown as AdminEmailModel).findOne({ 
          email: userEmail.toLowerCase(), 
          status: 'active' 
        })

        const isAdmin = !!adminEmail

        console.log('🔍 Admin check result:', isAdmin ? 'ADMIN FOUND' : 'NOT ADMIN')
        console.log('🔍 Admin email found:', adminEmail)

        if (!isAdmin) {
          console.log('❌ User is not an admin, redirecting to home')
          // Redirect non-admin users to home page
          return NextResponse.redirect(new URL('/', req.url))
        }

        console.log('✅ Admin access granted')
        // Allow admin to proceed
        return NextResponse.next()

      } catch (error) {
        console.error('❌ Middleware error:', error)
        // If there's a database error, allow access for now
        // You might want to change this behavior based on your needs
        return NextResponse.next()
      }
    }
    
    // Check admin routes
    if (isAdminRoute(req)) {
      const { userId } = await auth()
      
      if (!userId) {
        return NextResponse.redirect(new URL('/sign-in', req.url))
      }
      
      // For now, we'll let the API routes handle role checking
      // This ensures the user is authenticated before reaching the API
    }
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}