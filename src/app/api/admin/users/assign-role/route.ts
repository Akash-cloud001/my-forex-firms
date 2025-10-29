import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import { userService } from '@/services/userService';

export async function POST(req: NextRequest) {
  try {
    const { userId: currentUserId } = await auth();
    
    if (!currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify current user is admin using Clerk metadata only
    const clerk = await clerkClient();
    const currentUser = await clerk.users.getUser(currentUserId);
    const isAdmin = currentUser.publicMetadata?.role === 'admin';
    
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Admin access required' }, 
        { status: 403 }
      );
    }

    const body = await req.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return NextResponse.json(
        { error: 'User ID and role are required' }, 
        { status: 400 }
      );
    }

    // Validate role
    const validRoles = ['user', 'editor', 'moderator', 'admin'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be one of: user, editor, moderator, admin' }, 
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user exists in our database
    const existingUser = await userService.getUserByUserId(userId);
    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' }, 
        { status: 404 }
      );
    }

    // Check if user exists in Clerk
    let clerkUser;
    try {
      clerkUser = await clerk.users.getUser(userId);
    } catch {
      // User doesn't exist in Clerk, we'll create a placeholder in our database
    }

    // Update database role
    const updatedUser = await userService.updateUser(userId, { role });
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to update user role' },
        { status: 500 }
      );
    }

    // Update Clerk metadata if user exists in Clerk
    if (clerkUser) {
      try {
        await clerk.users.updateUserMetadata(userId, {
          publicMetadata: {
            ...clerkUser.publicMetadata,
            role: role,
            roleUpdatedBy: currentUserId,
            roleUpdatedAt: new Date().toISOString()
          }
        });
      } catch {
        // Swallow Clerk metadata update errors, DB already updated
        // Don't fail the entire operation if Clerk update fails
      }
    }

    return NextResponse.json({
      message: 'Role assigned successfully',
      user: {
        id: updatedUser.userId,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        role: updatedUser.role,
        status: updatedUser.status
      }
    });

  } catch {
    return NextResponse.json(
      { error: 'Failed to assign role' }, 
      { status: 500 }
    );
  }
}

// HTTP Method Restrictions
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PATCH() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
