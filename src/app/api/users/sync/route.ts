import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { userService } from '@/services/userService';
import { CreateUserData } from '@/types/user';

export async function POST(req: NextRequest) {
  try {
    // Check if user is authenticated
    const { userId: currentUserId } = await auth();
    if (!currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { clerkUserId } = body;

    if (!clerkUserId) {
      return NextResponse.json({ error: 'clerkUserId is required' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await userService.getUserByUserId(clerkUserId);
    if (existingUser) {
      return NextResponse.json({
        message: 'User already exists in database',
        user: existingUser
      });
    }

    // Fetch user details from Clerk
    const clerkUser = await (await clerkClient()).users.getUser(clerkUserId);
    if (!clerkUser) {
      return NextResponse.json({ error: 'User not found in Clerk' }, { status: 404 });
    }

    console.log('clerkUser', clerkUser);

    // Extract user data from Clerk
    const createUserData: CreateUserData = {
      userId: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress || '',
      firstName: clerkUser.firstName || '',
      lastName: clerkUser.lastName || '',
      imageUrl: clerkUser.imageUrl,
      role: 'user', // Default role, can be updated later
      phone: clerkUser.phoneNumbers[0]?.phoneNumber,
      clerkMetadata: {
        publicMetadata: clerkUser.publicMetadata,
        privateMetadata: clerkUser.privateMetadata,
        unsafeMetadata: clerkUser.unsafeMetadata,
      },
    };

    // Validate required fields
    if (!createUserData.email) {
      return NextResponse.json({ 
        error: 'User has no email address' 
      }, { status: 400 });
    }

    if (!createUserData.firstName) {
      return NextResponse.json({ 
        error: 'User has no first name' 
      }, { status: 400 });
    }

    const newUser = await userService.createUser(createUserData);

    return NextResponse.json({
      message: 'User synced successfully from Clerk',
      user: newUser
    });
  } catch (error) {
    console.error('Error syncing user:', error);
    return NextResponse.json(
      { error: 'Failed to sync user' },
      { status: 500 }
    );
  }
}

// GET method to sync all users (admin only)
export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const { userId: currentUserId } = await auth();
    if (!currentUserId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if current user is admin
    const currentUser = await userService.getUserByUserId(currentUserId);
    if (!currentUser || currentUser.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Get all Clerk users
    const clerkUsers = await (await clerkClient()).users.getUserList();
    
    let syncedCount = 0;
    let skippedCount = 0;
    const results = [];

    for (const clerkUser of clerkUsers.data) {
      try {
        // Check if user already exists
        const existingUser = await userService.getUserByUserId(clerkUser.id);
        if (existingUser) {
          skippedCount++;
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
          role: 'user',
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
          results.push({
            userId: clerkUser.id,
            email: clerkUser.emailAddresses[0]?.emailAddress,
            status: 'skipped',
            reason: 'Missing required fields'
          });
          continue;
        }

        const newUser = await userService.createUser(createUserData);
        syncedCount++;
        results.push({
          userId: clerkUser.id,
          email: newUser.email,
          status: 'synced',
          user: newUser
        });

      } catch (error) {
        console.error(`Error syncing user ${clerkUser.id}:`, error);
        results.push({
          userId: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return NextResponse.json({
      message: 'Bulk sync completed',
      summary: {
        total: clerkUsers.data.length,
        synced: syncedCount,
        skipped: skippedCount,
        errors: clerkUsers.data.length - syncedCount - skippedCount
      },
      results
    });

  } catch (error) {
    console.error('Error in bulk sync:', error);
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
