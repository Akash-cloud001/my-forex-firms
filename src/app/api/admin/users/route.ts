import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify admin role
    const clerk = await clerkClient();
    const currentUser = await clerk.users.getUser(userId);
    if (currentUser.publicMetadata?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' }, 
        { status: 403 }
      );
    }

    // Get pagination params from query string
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;

    // Fetch users from Clerk
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
