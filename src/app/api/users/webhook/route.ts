import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { userService } from '@/services/userService';
import { CreateUserData, UpdateUserData, ClerkUserData, ClerkWebhookEvent } from '@/types/user';

export async function POST(req: NextRequest) {
  try {
    // 1. Environment Variable Validation
    const webhookSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;
    
    if (!webhookSecret) {
      console.error('Missing CLERK_WEBHOOK_SIGNING_SECRET environment variable');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // 2. Extract Raw Payload and Headers
    const payload = await req.text();
    const headers = Object.fromEntries(req.headers.entries());

    // 3. Signature Verification
    const wh = new Webhook(webhookSecret);
    let evt: ClerkWebhookEvent;

    try {
      evt = wh.verify(payload, headers) as ClerkWebhookEvent;
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    console.log('Webhook event received:', evt.type);

    // 4. Event Type Routing
    switch (evt.type) {
      case 'user.created':
        await handleUserCreated(evt.data);
        break;
      
      case 'user.updated':
        await handleUserUpdated(evt.data);
        break;
      
      case 'user.deleted':
        await handleUserDeleted(evt.data);
        break;
      
      default:
        console.log('Unhandled webhook event type:', evt.type);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Event Handler: User Created
async function handleUserCreated(userData: ClerkUserData) {
  try {
    console.log('Creating new user:', userData.id);

    // Check for existing user
    const existingUser = await userService.getUserByUserId(userData.id);
    if (existingUser) {
      console.log('User already exists:', userData.id);
      return;
    }

    // Transform Clerk data to application format
    const createUserData: CreateUserData = {
      userId: userData.id,
      email: userData.email_addresses?.[0]?.email_address || '',
      firstName: userData.first_name || '',
      lastName: userData.last_name,
      imageUrl: userData.image_url,
      role: 'user', // Default role
      phone: userData.phone_numbers?.[0]?.phone_number,
      clerkMetadata: {
        publicMetadata: userData.public_metadata,
        privateMetadata: userData.private_metadata,
        unsafeMetadata: userData.unsafe_metadata,
      },
    };

    // Validate required fields
    if (!createUserData.email) {
      console.error('User creation failed: No email provided for user:', userData.id);
      return;
    }

    if (!createUserData.firstName) {
      console.error('User creation failed: No first name provided for user:', userData.id);
      return;
    }

    // Create user in database
    const newUser = await userService.createUser(createUserData);
    console.log('User created successfully:', newUser.userId);

  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

// Event Handler: User Updated
async function handleUserUpdated(userData: ClerkUserData) {
  try {
    console.log('Updating user:', userData.id);

    // Find existing user
    const existingUser = await userService.getUserByUserId(userData.id);
    if (!existingUser) {
      console.log('User not found for update:', userData.id);
      return;
    }

    // Prepare update data
    const updateData: UpdateUserData = {
      firstName: userData.first_name,
      lastName: userData.last_name,
      imageUrl: userData.image_url,
      phone: userData.phone_numbers?.[0]?.phone_number,
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof UpdateUserData] === undefined) {
        delete updateData[key as keyof UpdateUserData];
      }
    });

    // Update clerk metadata if provided
    if (userData.public_metadata || userData.private_metadata || userData.unsafe_metadata) {
      updateData.clerkMetadata = {
        publicMetadata: userData.public_metadata,
        privateMetadata: userData.private_metadata,
        unsafeMetadata: userData.unsafe_metadata,
      };
    }

    // Update user in database
    const updatedUser = await userService.updateUser(existingUser.userId, updateData);
    console.log('User updated successfully:', updatedUser?.userId);

  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

// Event Handler: User Deleted
async function handleUserDeleted(userData: ClerkUserData) {
  try {
    console.log('Deleting user:', userData.id);

    // Find existing user
    const existingUser = await userService.getUserByUserId(userData.id);
    if (!existingUser) {
      console.log('User not found for deletion:', userData.id);
      return;
    }

    // Delete user from database
    const deleted = await userService.deleteUser(existingUser.userId);
    if (deleted) {
      console.log('User deleted successfully:', existingUser.userId);
    } else {
      console.log('Failed to delete user:', existingUser.userId);
    }

  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
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
