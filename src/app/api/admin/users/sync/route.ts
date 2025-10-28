import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { userService } from '@/services/userService';
import { CreateUserData } from '@/types/user';

export async function POST(req: NextRequest) {
  try {
    console.log('🔄 [ADMIN-SYNC] Starting single user sync...');
    
    // Check if user is authenticated
    const { userId: currentUserId } = await auth();
    if (!currentUserId) {
      console.log('❌ [ADMIN-SYNC] Unauthorized - no userId found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify current user is admin using Clerk metadata
    const clerk = await clerkClient();
    const currentUser = await clerk.users.getUser(currentUserId);
    const isAdmin = currentUser.publicMetadata?.role === 'admin';
    
    if (!isAdmin) {
      console.log('❌ [ADMIN-SYNC] Admin access denied for user:', currentUserId, 'Clerk role:', currentUser.publicMetadata?.role);
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    console.log('✅ [ADMIN-SYNC] Admin access verified via Clerk metadata for:', currentUser.emailAddresses[0]?.emailAddress);

    const body = await req.json();
    const { clerkUserId } = body;

    if (!clerkUserId) {
      console.log('❌ [ADMIN-SYNC] Missing clerkUserId');
      return NextResponse.json({ error: 'clerkUserId is required' }, { status: 400 });
    }

    console.log('🔍 [ADMIN-SYNC] Checking if user exists:', clerkUserId);

    // Check if user already exists
    const existingUser = await userService.getUserByUserId(clerkUserId);
    if (existingUser) {
      console.log('⏭️ [ADMIN-SYNC] User already exists in database');
      return NextResponse.json({
        message: 'User already exists in database',
        user: existingUser
      });
    }

    // Fetch user details from Clerk
    console.log('📥 [ADMIN-SYNC] Fetching user from Clerk...');
    const clerkUser = await clerk.users.getUser(clerkUserId);
    if (!clerkUser) {
      console.log('❌ [ADMIN-SYNC] User not found in Clerk');
      return NextResponse.json({ error: 'User not found in Clerk' }, { status: 404 });
    }

    console.log('✅ [ADMIN-SYNC] Clerk user found:', clerkUser.emailAddresses[0]?.emailAddress);

    // Extract user data from Clerk
    const createUserData: CreateUserData = {
      userId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      firstName: clerkUser.firstName || '',
      lastName: clerkUser.lastName || '',
      imageUrl: clerkUser.imageUrl,
      role: clerkUser.publicMetadata?.role || 'user', // Use Clerk role or default to 'user'
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
      console.log('❌ [ADMIN-SYNC] User has no email address');
      return NextResponse.json({ 
        error: 'User has no email address' 
      }, { status: 400 });
    }

    if (!createUserData.firstName) {
      console.log('❌ [ADMIN-SYNC] User has no first name');
      return NextResponse.json({ 
        error: 'User has no first name' 
      }, { status: 400 });
    }

    console.log('💾 [ADMIN-SYNC] Creating user in database...');
    const newUser = await userService.createUser(createUserData);
    console.log('✅ [ADMIN-SYNC] User created successfully:', newUser.userId);

    return NextResponse.json({
      message: 'User synced successfully from Clerk',
      user: newUser
    });
  } catch (error) {
    console.error('💥 [ADMIN-SYNC] Error syncing user:', error);
    return NextResponse.json(
      { error: 'Failed to sync user' },
      { status: 500 }
    );
  }
}

// GET method to sync all users (admin only)
export async function GET(req: NextRequest) {
  try {
    console.log('🔄 [ADMIN-SYNC] Starting bulk user sync...');
    
    // Check if user is authenticated and is admin
    const { userId: currentUserId } = await auth();
    if (!currentUserId) {
      console.log('❌ [ADMIN-SYNC] Unauthorized - no userId found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify current user is admin using Clerk metadata
    const clerk = await clerkClient();
    const currentUser = await clerk.users.getUser(currentUserId);
    const isAdmin = currentUser.publicMetadata?.role === 'admin';
    
    if (!isAdmin) {
      console.log('❌ [ADMIN-SYNC] Admin access denied for user:', currentUserId, 'Clerk role:', currentUser.publicMetadata?.role);
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    console.log('✅ [ADMIN-SYNC] Admin access verified via Clerk metadata for:', currentUser.emailAddresses[0]?.emailAddress);

    // Get all Clerk users
    console.log('📥 [ADMIN-SYNC] Fetching all users from Clerk...');
    const clerkUsers = await clerk.users.getUserList();
    console.log('📊 [ADMIN-SYNC] Found', clerkUsers.data.length, 'users in Clerk');
    
    let syncedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    const results = [];

    for (const clerkUser of clerkUsers.data) {
      try {
        console.log(`\n📝 [ADMIN-SYNC] Processing user: ${clerkUser.emailAddresses[0]?.emailAddress}`);
        
        // Check if user already exists
        const existingUser = await userService.getUserByUserId(clerkUser.id);
        if (existingUser) {
          skippedCount++;
          console.log('⏭️ [ADMIN-SYNC] User already exists - skipping');
          results.push({
            userId: clerkUser.id,
            email: clerkUser.emailAddresses[0]?.emailAddress,
            status: 'skipped',
            reason: 'Already exists'
          });
          continue;
        }

        // Create user data
        const createUserData: CreateUserData = {
          userId: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          firstName: clerkUser.firstName || '',
          lastName: clerkUser.lastName || '',
          imageUrl: clerkUser.imageUrl,
          role: clerkUser.publicMetadata?.role || 'user', // Use Clerk role or default to 'user'
          status: 'active', // Set to active by default
          phone: clerkUser.phoneNumbers[0]?.phoneNumber,
          clerkMetadata: {
            publicMetadata: clerkUser.publicMetadata,
            privateMetadata: clerkUser.privateMetadata,
            unsafeMetadata: clerkUser.unsafeMetadata,
          },
        };

        // Skip users without required fields
        if (!createUserData.email || !createUserData.firstName) {
          skippedCount++;
          console.log('⏭️ [ADMIN-SYNC] Missing required fields - skipping');
          results.push({
            userId: clerkUser.id,
            email: clerkUser.emailAddresses[0]?.emailAddress,
            status: 'skipped',
            reason: 'Missing required fields'
          });
          continue;
        }

        console.log('💾 [ADMIN-SYNC] Creating user...');
        const newUser = await userService.createUser(createUserData);
        syncedCount++;
        console.log('✅ [ADMIN-SYNC] User synced successfully');
        results.push({
          userId: clerkUser.id,
          email: newUser.email,
          status: 'synced',
          user: newUser
        });

      } catch (error) {
        errorCount++;
        console.error(`❌ [ADMIN-SYNC] Error syncing user ${clerkUser.id}:`, error);
        results.push({
          userId: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    console.log('\n📊 [ADMIN-SYNC] Bulk sync completed!');
    console.log('📈 [ADMIN-SYNC] Summary:', {
      total: clerkUsers.data.length,
      synced: syncedCount,
      skipped: skippedCount,
      errors: errorCount
    });

    return NextResponse.json({
      message: 'Bulk sync completed',
      summary: {
        total: clerkUsers.data.length,
        synced: syncedCount,
        skipped: skippedCount,
        errors: errorCount
      },
      results
    });

  } catch (error) {
    console.error('💥 [ADMIN-SYNC] Error in bulk sync:', error);
    return NextResponse.json(
      { error: 'Failed to sync users' },
      { status: 500 }
    );
  }
}

// HTTP Method Restrictions
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
