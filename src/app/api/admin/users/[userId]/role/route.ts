import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    // Verify the requesting user is authenticated
    const { userId: adminUserId } = await auth();
    
    if (!adminUserId) {
      return NextResponse.json(
        { error: 'Unauthorized' }, 
        { status: 401 }
      );
    }

    // Get current user and verify admin role
    const clerk = await clerkClient();
    const adminUser = await clerk.users.getUser(adminUserId);
    const adminRole = adminUser.publicMetadata?.role;

    if (adminRole !== 'admin') {
      return NextResponse.json(
        { error: 'Only admins can change user roles' }, 
        { status: 403 }
      );
    }

    // Parse request body
    const { role } = await request.json();
    const { userId: targetUserId } = await params;

    // Validate role
    const validRoles = ['user', 'editor', 'moderator', 'admin'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role specified' }, 
        { status: 400 }
      );
    }

    // Prevent self-demotion from admin
    if (targetUserId === adminUserId && role !== 'admin') {
      return NextResponse.json(
        { error: 'Cannot change your own admin role' }, 
        { status: 400 }
      );
    }

    // Update the user's role in Clerk
    const updatedUser = await clerk.users.updateUserMetadata(targetUserId, {
      publicMetadata: {
        role: role,
        roleUpdatedBy: adminUserId,
        roleUpdatedAt: new Date().toISOString()
      }
    });

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.emailAddresses[0]?.emailAddress,
        role: updatedUser.publicMetadata?.role
      }
    });

  } catch (error: unknown) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { error: 'Failed to update user role' }, 
      { status: 500 }
    );
  }
}
