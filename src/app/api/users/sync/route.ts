import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { userService } from '@/services/userService';
import { CreateUserData } from '@/types/user';

export async function POST(req: NextRequest) {
  try {
    console.log('🔄 [USER-SYNC] Starting single user sync...');
    
    // Check if user is authenticated
    const { userId: currentUserId } = await auth();
    if (!currentUserId) {
      console.log('❌ [USER-SYNC] Unauthorized - no userId found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { clerkUserId } = body;

    if (!clerkUserId) {
      console.log('❌ [USER-SYNC] Missing clerkUserId');
      return NextResponse.json({ error: 'clerkUserId is required' }, { status: 400 });
    }

    console.log('🔍 [USER-SYNC] Checking if user exists:', clerkUserId);

    // Check if user already exists
    const existingUser = await userService.getUserByUserId(clerkUserId);
    if (existingUser) {
      console.log('⏭️ [USER-SYNC] User already exists in database');
      return NextResponse.json({
        message: 'User already exists in database',
        user: existingUser
      });
    }

    // Fetch user details from Clerk
    console.log('📥 [USER-SYNC] Fetching user from Clerk...');
    const clerkUser = await (await clerkClient()).users.getUser(clerkUserId);
    if (!clerkUser) {
      console.log('❌ [USER-SYNC] User not found in Clerk');
      return NextResponse.json({ error: 'User not found in Clerk' }, { status: 404 });
    }

    console.log('✅ [USER-SYNC] Clerk user found:', clerkUser.emailAddresses[0]?.emailAddress);

    // Extract user data from Clerk
    const createUserData: CreateUserData = {
      userId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      firstName: clerkUser.firstName || '',
      lastName: clerkUser.lastName || '',
      imageUrl: clerkUser.imageUrl,
      role: (clerkUser.publicMetadata?.role as 'admin' | 'moderator' | 'editor' | 'user') || 'user', // Use Clerk role or default to 'user'
      status: 'active', // Set to active by default
      phone: clerkUser.phoneNumbers[0]?.phoneNumber,
      clerkMetadata: {
        publicMetadata: clerkUser.publicMetadata,
        privateMetadata: clerkUser.privateMetadata,
        unsafeMetadata: clerkUser.unsafeMetadata,
      },
    };

    // Validate required fields
    if (!createUserData.email) {
      console.log('❌ [USER-SYNC] User has no email address');
      return NextResponse.json({ 
        error: 'User has no email address' 
      }, { status: 400 });
    }

    if (!createUserData.firstName) {
      console.log('❌ [USER-SYNC] User has no first name');
      return NextResponse.json({ 
        error: 'User has no first name' 
      }, { status: 400 });
    }

    console.log('💾 [USER-SYNC] Creating user in database...');
    const newUser = await userService.createUser(createUserData);
    console.log('✅ [USER-SYNC] User created successfully:', newUser.userId);

    return NextResponse.json({
      message: 'User synced successfully from Clerk',
      user: newUser
    });
  } catch (error) {
    console.error('💥 [USER-SYNC] Error syncing user:', error);
    return NextResponse.json(
      { error: 'Failed to sync user' },
      { status: 500 }
    );
  }
}

// HTTP Method Restrictions
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use /api/admin/users/sync for bulk operations.' },
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
