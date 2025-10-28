import { NextRequest, NextResponse } from 'next/server';
import { auth, clerkClient } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import AdminEmail from '@/models/AdminEmail';

// Type for AdminEmail model methods
type AdminEmailModel = {
  findOne: (query: unknown) => Promise<unknown>;
  find: (query: unknown) => { sort: (sort: unknown) => Promise<unknown[]> };
  countDocuments: (query: unknown) => Promise<number>;
  new: (data: unknown) => { save: () => Promise<unknown> };
};

// Constructor type
type AdminEmailConstructor = new (data: unknown) => { save: () => Promise<unknown> };

// Type for AdminEmail document
type AdminEmailDoc = {
  status: string;
  addedBy: string;
  addedAt: Date;
  save: () => Promise<unknown>;
};

// Get all admin emails
export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Get current user's email to verify they're an admin
    const clerk = await clerkClient();
    const currentUser = await clerk.users.getUser(userId);
    const currentEmail = currentUser.emailAddresses[0]?.emailAddress;

    // Check if current user is in admin list
    const isAdmin = await (AdminEmail as unknown as AdminEmailModel).findOne({ 
      email: currentEmail, 
      status: 'active' 
    });

    if (!isAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const adminEmails = await (AdminEmail as unknown as AdminEmailModel).find({ status: 'active' })
      .sort({ addedAt: -1 });

    return NextResponse.json({ 
      emails: adminEmails,
      currentUserEmail: currentEmail 
    });

  } catch (error) {
    console.error('Error fetching admin emails:', error);
    return NextResponse.json({ error: 'Failed to fetch admin emails' }, { status: 500 });
  }
}

// Add new admin email
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Verify current user is admin
    const clerk = await clerkClient();
    const currentUser = await clerk.users.getUser(userId);
    const currentEmail = currentUser.emailAddresses[0]?.emailAddress;

    const isAdmin = await (AdminEmail as unknown as AdminEmailModel).findOne({ 
      email: currentEmail, 
      status: 'active' 
    });

    if (!isAdmin) {
      return NextResponse.json({ error: 'Only admins can add new admins' }, { status: 403 });
    }

    const { email } = await request.json();

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    // Check if email already exists
    const existing = await (AdminEmail as unknown as AdminEmailModel).findOne({ email: email.toLowerCase() }) as AdminEmailDoc | null;
    if (existing) {
      if (existing.status === 'revoked') {
        // Reactivate revoked email
        existing.status = 'active';
        existing.addedBy = userId;
        existing.addedAt = new Date();
        await existing.save();

        // Also update Clerk user metadata if user exists
        try {
          const users = await clerk.users.getUserList({
            emailAddress: [email]
          });
          if (users.data.length > 0) {
            await clerk.users.updateUserMetadata(users.data[0].id, {
              publicMetadata: {
                role: 'admin',
                roleUpdatedBy: userId,
                roleUpdatedAt: new Date().toISOString()
              }
            });
          }
        } catch (clerkError) {
          console.warn('Failed to update Clerk metadata for reactivated user:', clerkError);
        }

        return NextResponse.json({ 
          message: 'Admin email reactivated', 
          email: existing 
        });
      }
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    // Add new admin email
    const newAdminEmail = new (AdminEmail as unknown as AdminEmailConstructor)({
      email: email.toLowerCase(),
      addedBy: userId
    });

    await newAdminEmail.save();

    // Also update Clerk user metadata if user exists
    try {
      const users = await clerk.users.getUserList({
        emailAddress: [email]
      });
      if (users.data.length > 0) {
        await clerk.users.updateUserMetadata(users.data[0].id, {
          publicMetadata: {
            role: 'admin',
            roleUpdatedBy: userId,
            roleUpdatedAt: new Date().toISOString()
          }
        });
      }
    } catch (clerkError) {
      console.warn('Failed to update Clerk metadata for new admin user:', clerkError);
    }

    return NextResponse.json({ 
      message: 'Admin email added successfully', 
      email: newAdminEmail 
    }, { status: 201 });

  } catch (error) {
    console.error('Error adding admin email:', error);
    return NextResponse.json({ error: 'Failed to add admin email' }, { status: 500 });
  }
}

// Delete/revoke admin email
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // Verify current user is admin
    const clerk = await clerkClient();
    const currentUser = await clerk.users.getUser(userId);
    const currentEmail = currentUser.emailAddresses[0]?.emailAddress;

    const isAdmin = await (AdminEmail as unknown as AdminEmailModel).findOne({ 
      email: currentEmail, 
      status: 'active' 
    });

    if (!isAdmin) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const { email } = await request.json();

    // Prevent removing yourself
    if (email.toLowerCase() === currentEmail.toLowerCase()) {
      return NextResponse.json({ 
        error: 'Cannot remove your own admin access' 
      }, { status: 400 });
    }

    // Ensure at least one admin remains
    const activeAdmins = await (AdminEmail as unknown as AdminEmailModel).countDocuments({ status: 'active' });
    if (activeAdmins <= 1) {
      return NextResponse.json({ 
        error: 'Cannot remove the last admin' 
      }, { status: 400 });
    }

    const adminEmail = await (AdminEmail as unknown as AdminEmailModel).findOne({ email: email.toLowerCase() }) as AdminEmailDoc | null;
    if (!adminEmail) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }

    // Soft delete by changing status
    adminEmail.status = 'revoked';
    await adminEmail.save();

    // Also remove admin role from Clerk user metadata if user exists
    try {
      const users = await clerk.users.getUserList({
        emailAddress: [email]
      });
      if (users.data.length > 0) {
        await clerk.users.updateUserMetadata(users.data[0].id, {
          publicMetadata: {
            role: 'user',
            roleUpdatedBy: userId,
            roleUpdatedAt: new Date().toISOString()
          }
        });
      }
    } catch (clerkError) {
      console.warn('Failed to update Clerk metadata for revoked user:', clerkError);
    }

    return NextResponse.json({ 
      message: 'Admin email removed successfully' 
    });

  } catch (error) {
    console.error('Error removing admin email:', error);
    return NextResponse.json({ error: 'Failed to remove admin email' }, { status: 500 });
  }
}
