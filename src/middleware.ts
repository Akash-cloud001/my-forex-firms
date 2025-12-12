import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/users/webhook',
  '/api/public(.*)',
  '/api/coming-soon',
  '/blogs(.*)',
  '/firms(.*)',
  '/privacy-policy(.*)',
  '/terms-conditions(.*)',
  '/about(.*)',
  '/model(.*)',
  '/site-map(.*)',
])

const isDashboardRoute = createRouteMatcher([
  '/admin(.*)'
])

const isAdminRoute = createRouteMatcher([
  '/admin/users(.*)',
  '/api/admin(.*)'
])

const isEditorRestrictedRoute = createRouteMatcher([
  '/admin/role-management(.*)',
  '/admin/newsletter(.*)',
  '/admin/affiliates(.*)',
  '/admin/reviews(.*)',
  '/admin/point-evaluation(.*)',
  '/admin/faq-management(.*)',
])

const isModeratorRestrictedRoute = createRouteMatcher([
  '/admin/role-management(.*)',
  '/admin/newsletter(.*)',
  '/admin/affiliates(.*)'
])


export default clerkMiddleware(async (auth, req) => {
  if (req.nextUrl.pathname === '/api/users/webhook') {
    return NextResponse.next();
  }
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

        if (!userEmail) {
          return NextResponse.redirect(new URL('/', req.url))
        }

        // Check role-based access using Clerk public metadata
        const userRole = user.publicMetadata?.role as string | undefined
        const allowedRoles = ['admin', 'moderator', 'editor']

        if (!userRole || !allowedRoles.includes(userRole)) {
          // Redirect users without proper roles to home page
          return NextResponse.redirect(new URL('/', req.url))
        }

        // Check if editor is trying to access restricted routes
        if (isEditorRestrictedRoute(req) && userRole === 'editor') {
          return NextResponse.redirect(new URL('/admin/unauthorized', req.url))
        }

        // Check if moderator is trying to access restricted routes
        if (isModeratorRestrictedRoute(req) && userRole === 'moderator') {
          return NextResponse.redirect(new URL('/admin/unauthorized', req.url))
        }

        // Allow admin to proceed
        return NextResponse.next()

      } catch (error) {
        console.error('Middleware error:', error)
        // If there's an error, redirect to home for security
        return NextResponse.redirect(new URL('/', req.url))
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
