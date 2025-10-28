import { NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import { userService } from '@/services/userService';

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify role-based access using Clerk metadata only
    const clerk = await clerkClient();
    const currentUser = await clerk.users.getUser(userId);
    const userRole = currentUser.publicMetadata?.role as string | undefined;
    const allowedRoles = ['admin', 'moderator', 'editor'];
    
    if (!userRole || !allowedRoles.includes(userRole)) {
      return NextResponse.json(
        { error: 'Admin, moderator, or editor access required' }, 
        { status: 403 }
      );
    }

    await connectDB();

    // Get query params
    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('userId');
    const searchTerm = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const status = searchParams.get('status') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    // If specific userId is requested, fetch that user
    if (targetUserId) {
      try {
        const user = await userService.getUserByUserId(targetUserId);
        if (!user) {
          return NextResponse.json(
            { error: 'User not found' }, 
            { status: 404 }
          );
        }
        return NextResponse.json({ user });
      } catch {
        return NextResponse.json(
          { error: 'User not found' }, 
          { status: 404 }
        );
      }
    }

    // Build query options
    const queryOptions = {
      filters: {} as Record<string, string>,
      sort: { field: 'createdAt' as const, order: 'desc' as const },
      pagination: { page, limit }
    };

    // Add filters if provided
    if (role) queryOptions.filters.role = role;
    if (status) queryOptions.filters.status = status;

    let users;
    let totalCount;

    if (searchTerm) {
      const searchResult = await userService.searchUsers(searchTerm, queryOptions);
      users = searchResult.users;
      totalCount = searchResult.total;
    } else {
      const listResult = await userService.getUsers(queryOptions);
      users = listResult.users;
      totalCount = listResult.total;
    }

    // Transform users to match expected format
    const transformedUsers = users.map(user => ({
      id: user.userId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      lastSignInAt: user.lastLoginAt,
      fullName: user.fullName,
      phone: user.phone,
      analytics: user.analytics
    }));

    return NextResponse.json({
      users: transformedUsers,
      totalCount,
      page,
      totalPages: Math.ceil(totalCount / limit)
    });

  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch users' }, 
      { status: 500 }
    );
  }
}
