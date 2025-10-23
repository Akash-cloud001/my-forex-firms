import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { isCurrentUserAdmin } from '@/lib/adminAuth';

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role using centralized auth
    const isUserAdmin = await isCurrentUserAdmin();
    
    if (!isUserAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' }, 
        { status: 403 }
      );
    }

    // Get query params
    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('userId');
    
    // If specific userId is requested, fetch that user
    if (targetUserId) {
      try {
        const clerk = await clerkClient();
        const targetUser = await clerk.users.getUser(targetUserId);
        const userData = {
          id: targetUser.id,
          email: targetUser.emailAddresses[0]?.emailAddress || '',
          firstName: targetUser.firstName || '',
          lastName: targetUser.lastName || '',
          imageUrl: targetUser.imageUrl || '',
          role: targetUser.publicMetadata?.role || 'user',
          createdAt: targetUser.createdAt,
          lastSignInAt: targetUser.lastSignInAt
        };
        
        return NextResponse.json({ user: userData });
      } catch {
        return NextResponse.json(
          { error: 'User not found' }, 
          { status: 404 }
        );
      }
    }

    // Get pagination params from query string
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // Fetch users from Clerk
    const clerk = await clerkClient();
    const usersResponse = await clerk.users.getUserList({
      limit,
      offset,
      orderBy: '-created_at'
    });

    const users = usersResponse.data.map((user: unknown) => {
      const userData = user as {
        id: string;
        emailAddresses: Array<{ emailAddress: string }>;
        firstName: string;
        lastName: string;
        imageUrl: string;
        publicMetadata: { role?: string };
        createdAt: number;
        lastSignInAt: number;
      };
      return {
        id: userData.id,
        email: userData.emailAddresses[0]?.emailAddress || '',
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        imageUrl: userData.imageUrl || '',
        role: userData.publicMetadata?.role || 'user',
        createdAt: userData.createdAt,
        lastSignInAt: userData.lastSignInAt
      };
    });

    return NextResponse.json({
      users,
      totalCount: usersResponse.totalCount,
      page,
      totalPages: Math.ceil(usersResponse.totalCount / limit)
    });

  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' }, 
      { status: 500 }
    );
  }
}
