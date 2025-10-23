import { auth, clerkClient } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import AdminEmail from '@/models/AdminEmail';

// Type for AdminEmail model
type AdminEmailModel = {
  findOne: (query: { email: string; status: string }) => Promise<{ email: string; status: string } | null>
}

/**
 * Check if the current authenticated user is an admin based on database admin emails
 * 
 * ⚠️ NOTE: This function uses Clerk's auth() which cannot be called from middleware.
 * For middleware usage, use the direct Clerk client approach instead.
 * 
 * @returns Promise<boolean> - true if user is admin, false otherwise
 */
export async function isCurrentUserAdmin(): Promise<boolean> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return false;
    }

    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const userEmail = user.emailAddresses?.[0]?.emailAddress;
    
    if (!userEmail) {
      return false;
    }
    
    await connectDB();
    const adminEmail = await (AdminEmail as unknown as AdminEmailModel).findOne({ 
      email: userEmail.toLowerCase(), 
      status: 'active' 
    });
    
    return !!adminEmail;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

/**
 * Check if a specific user ID is an admin based on database admin emails
 * @param userId - The Clerk user ID to check
 * @returns Promise<boolean> - true if user is admin, false otherwise
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  try {
    if (!userId) {
      return false;
    }

    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const userEmail = user.emailAddresses?.[0]?.emailAddress;
    
    if (!userEmail) {
      return false;
    }
    
    await connectDB();
    const adminEmail = await (AdminEmail as unknown as AdminEmailModel).findOne({ 
      email: userEmail.toLowerCase(), 
      status: 'active' 
    });
    
    return !!adminEmail;
  } catch (error) {
    console.error('Error checking admin status for user:', userId, error);
    return false;
  }
}

/**
 * Check if a specific email is an admin based on database admin emails
 * @param email - The email address to check
 * @returns Promise<boolean> - true if email is admin, false otherwise
 */
export async function isEmailAdmin(email: string): Promise<boolean> {
  try {
    if (!email) {
      return false;
    }
    
    await connectDB();
    const adminEmail = await (AdminEmail as unknown as AdminEmailModel).findOne({ 
      email: email.toLowerCase(), 
      status: 'active' 
    });
    
    return !!adminEmail;
  } catch (error) {
    console.error('Error checking admin status for email:', email, error);
    return false;
  }
}

/**
 * Get the current user's email if they are authenticated
 * @returns Promise<string | null> - user email or null if not authenticated
 */
export async function getCurrentUserEmail(): Promise<string | null> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return null;
    }

    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const userEmail = user.emailAddresses?.[0]?.emailAddress;
    
    return userEmail || null;
  } catch (error) {
    console.error('Error getting current user email:', error);
    return null;
  }
}

/**
 * Require admin access - throws error if user is not admin
 * @throws Error if user is not admin
 * @returns Promise<true> if user is admin
 */
export async function requireAdmin(): Promise<true> {
  const isAdmin = await isCurrentUserAdmin();
  
  if (!isAdmin) {
    throw new Error('Admin access required');
  }
  
  return true;
}

/**
 * Get admin status with detailed information for debugging
 * @returns Promise<{isAdmin: boolean, userEmail: string | null, adminEmail: any}>
 */
export async function getAdminStatus(): Promise<{
  isAdmin: boolean;
  userEmail: string | null;
  adminEmail: { email: string; status: string } | null;
}> {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { isAdmin: false, userEmail: null, adminEmail: null };
    }

    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    const userEmail = user.emailAddresses?.[0]?.emailAddress;
    
    if (!userEmail) {
      return { isAdmin: false, userEmail: null, adminEmail: null };
    }
    
    await connectDB();
    const adminEmail = await (AdminEmail as unknown as AdminEmailModel).findOne({ 
      email: userEmail.toLowerCase(), 
      status: 'active' 
    });
    
    return {
      isAdmin: !!adminEmail,
      userEmail,
      adminEmail
    };
  } catch (error) {
    console.error('Error getting admin status:', error);
    return { isAdmin: false, userEmail: null, adminEmail: null };
  }
}
