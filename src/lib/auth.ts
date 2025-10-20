import { auth, clerkClient } from '@clerk/nextjs/server';

export async function getCurrentUserRole() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return null;
    }

    const clerk = await clerkClient();
    const user = await clerk.users.getUser(userId);
    return user.publicMetadata?.role as string || 'user';
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
}

export async function requireAdmin() {
  const role = await getCurrentUserRole();
  
  if (role !== 'admin') {
    throw new Error('Admin access required');
  }
  
  return true;
}

export async function requireRole(requiredRole: string) {
  const role = await getCurrentUserRole();
  
  if (!role) {
    throw new Error('Authentication required');
  }
  
  const roleHierarchy = ['user', 'editor', 'moderator', 'admin'];
  const userRoleIndex = roleHierarchy.indexOf(role);
  const requiredRoleIndex = roleHierarchy.indexOf(requiredRole);
  
  if (userRoleIndex < requiredRoleIndex) {
    throw new Error(`Role '${requiredRole}' or higher required`);
  }
  
  return true;
}
