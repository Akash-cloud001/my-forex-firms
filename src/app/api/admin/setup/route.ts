import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    
    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' }, 
        { status: 400 }
      );
    }

    // Find user by email
    const clerk = await clerkClient();
    const users = await clerk.users.getUserList({
      emailAddress: [email]
    });

    if (users.data.length === 0) {
      return NextResponse.json(
        { error: 'User not found with that email' }, 
        { status: 404 }
      );
    }

    const user = users.data[0];

    // Update user metadata to set admin role
    const updatedUser = await clerk.users.updateUserMetadata(user.id, {
      publicMetadata: {
        role: 'admin',
        roleUpdatedBy: 'system',
        roleUpdatedAt: new Date().toISOString()
      }
    });

    return NextResponse.json({
      success: true,
      message: `User ${email} has been granted admin role`,
      user: {
        id: updatedUser.id,
        email: updatedUser.emailAddresses[0]?.emailAddress,
        role: updatedUser.publicMetadata?.role
      }
    });

  } catch (error: unknown) {
    console.error('Error setting up admin:', error);
    return NextResponse.json(
      { error: 'Failed to setup admin role' }, 
      { status: 500 }
    );
  }
}
