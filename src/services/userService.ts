import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { IUser } from '@/types';
import {
  CreateUserData,
  UpdateUserData,
  UserFilters,
  UserQueryOptions,
  UserListResponse,
  UserStats,
  UserRole,
  UserStatus,
  IUserAnalytics
} from '@/types/user';

// Type for Mongoose model with any methods
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type UserModel = any;


export class UserService {
  private collectionName = 'users';


  /**
   * Create a new user with default values
   */
  async createUser(userData: CreateUserData): Promise<IUser> {
    await connectDB();
    
    const now = new Date();
    const newUser = new User({
      ...userData,
      role: userData.role || 'user',
      status: userData.status || 'active',
      createdAt: now,
      updatedAt: now,
      analytics: {
        loginCount: 0,
        lastActivity: now,
        totalFirmsCreated: 0,
        totalReviewsCreated: 0,
        totalReportsManaged: 0,
      },
    });


    const savedUser = await newUser.save();
    return savedUser;
  }


  /**
   * Get user by external service user ID (Clerk ID)
   */
  async getUserByUserId(userId: string): Promise<IUser | null> {
    await connectDB();
    const user = await (User as UserModel).findOne({ userId }).lean();
    return user as IUser | null;
  }


  /**
   * Get user by email
   */
  async getUserByEmail(email: string): Promise<IUser | null> {
    await connectDB();
    const user = await (User as UserModel).findOne({ email: email.toLowerCase() }).lean();
    return user as IUser | null;
  }


  /**
   * Get user by MongoDB ObjectId
   */
  async getUserById(id: string): Promise<IUser | null> {
    await connectDB();
    const user = await (User as UserModel).findById(id).lean();
    return user as IUser | null;
  }


  /**
   * Update user with automatic field updates
   */
  async updateUser(userId: string, updateData: UpdateUserData): Promise<IUser | null> {
    await connectDB();
    
    const updatePayload: Record<string, unknown> = {
      ...updateData,
      updatedAt: new Date(),
    };


    // Auto-update fullName if firstName or lastName changed
    if (updateData.firstName || updateData.lastName) {
      const currentUser = await this.getUserByUserId(userId);
      if (currentUser) {
        const firstName = updateData.firstName || currentUser.firstName;
        const lastName = updateData.lastName || currentUser.lastName;
        updatePayload.fullName = lastName ? `${firstName} ${lastName}` : firstName;
      }
    }


    return await (User as UserModel).findOneAndUpdate(
      { userId },
      updatePayload,
      { new: true, runValidators: true }
    );
  }


  /**
   * Delete user by external service user ID
   */
  async deleteUser(userId: string): Promise<boolean> {
    await connectDB();
    const result = await (User as UserModel).deleteOne({ userId });
    return result.deletedCount > 0;
  }


  /**
   * Get users with advanced filtering and pagination
   */
  async getUsers(options: UserQueryOptions = {}): Promise<UserListResponse> {
    await connectDB();
    
    const {
      filters = {},
      sort = { field: 'createdAt', order: 'desc' },
      pagination = { page: 1, limit: 10 }
    } = options;


    // Build filter query
    const query: Record<string, unknown> = {};


    if (filters.role) {
      query.role = filters.role;
    }


    if (filters.status) {
      query.status = filters.status;
    }


    if (filters.search) {
      query.$or = [
        { firstName: { $regex: filters.search, $options: 'i' } },
        { lastName: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
        { fullName: { $regex: filters.search, $options: 'i' } },
      ];
    }


    if (filters.createdAfter) {
      query.createdAt = { ...(query.createdAt as Record<string, unknown> || {}), $gte: filters.createdAfter };
    }

    if (filters.createdBefore) {
      query.createdAt = { ...(query.createdAt as Record<string, unknown> || {}), $lte: filters.createdBefore };
    }

    if (filters.lastLoginAfter) {
      query.lastLoginAt = { ...(query.lastLoginAt as Record<string, unknown> || {}), $gte: filters.lastLoginAfter };
    }

    if (filters.lastLoginBefore) {
      query.lastLoginAt = { ...(query.lastLoginAt as Record<string, unknown> || {}), $lte: filters.lastLoginBefore };
    }


    // Get total count
    const total = await User.countDocuments(query);


    // Calculate pagination
    const skip = (pagination.page - 1) * pagination.limit;
    const totalPages = Math.ceil(total / pagination.limit);


    // Build sort object
    const sortObj: Record<string, 1 | -1> = {};
    sortObj[sort.field] = sort.order === 'asc' ? 1 : -1;


    // Get users
    const users = await (User as UserModel).find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(pagination.limit)
      .lean();

    return {
      users: users as IUser[],
      total,
      page: pagination.page,
      totalPages,
      hasNextPage: pagination.page < totalPages,
      hasPrevPage: pagination.page > 1,
    };
  }


  /**
   * Search users using MongoDB text search (optimized with indexes)
   */
  async searchUsers(searchTerm: string, options: UserQueryOptions = {}): Promise<UserListResponse> {
    await connectDB();
    
    const {
      filters = {},
      sort = { field: 'createdAt', order: 'desc' },
      pagination = { page: 1, limit: 10 }
    } = options;

    // Build base query with text search
    const query: Record<string, unknown> = {
      $text: { $search: searchTerm }
    };

    // Add additional filters
    if (filters.role) {
      query.role = filters.role;
    }

    if (filters.status) {
      query.status = filters.status;
    }

    // Get total count
    const total = await User.countDocuments(query);

    // Calculate pagination
    const skip = (pagination.page - 1) * pagination.limit;
    const totalPages = Math.ceil(total / pagination.limit);

    // Build sort object (prioritize text score)
    const sortObj: Record<string, unknown> = { score: { $meta: 'textScore' } };
    if (sort.field !== 'createdAt') {
      sortObj[sort.field] = sort.order === 'asc' ? 1 : -1;
    }

    // Get users with text score
    const users = await (User as UserModel).find(query, { score: { $meta: 'textScore' } })
      .sort(sortObj)
      .skip(skip)
      .limit(pagination.limit)
      .lean();

    return {
      users: users as IUser[],
      total,
      page: pagination.page,
      totalPages,
      hasNextPage: pagination.page < totalPages,
      hasPrevPage: pagination.page > 1,
    };
  }


  /**
   * Get users by role
   */
  async getUsersByRole(role: UserRole): Promise<IUser[]> {
    await connectDB();
    const users = await (User as UserModel).find({ role, status: 'active' }).lean();
    return users as IUser[];
  }


  /**
   * Get users by status
   */
  async getUsersByStatus(status: UserStatus): Promise<IUser[]> {
    await connectDB();
    const users = await (User as UserModel).find({ status }).lean();
    return users as IUser[];
  }


  /**
   * Check if user exists by external service user ID
   */
  async userExists(userId: string): Promise<boolean> {
    await connectDB();
    const count = await User.countDocuments({ userId });
    return count > 0;
  }


  /**
   * Get user statistics
   */
  async getUserStats(): Promise<UserStats> {
    await connectDB();
    
    const [
      totalUsers,
      usersByRole,
      usersByStatus,
      activeUsers,
      newUsersThisMonth
    ] = await Promise.all([
      User.countDocuments(),
      User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ]),
      User.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      User.countDocuments({ status: 'active' }),
      User.countDocuments({
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      })
    ]);


    // Transform aggregation results
    const roleStats: Record<UserRole, number> = {
      user: 0,
      editor: 0,
      moderator: 0,
      admin: 0
    };


    const statusStats: Record<UserStatus, number> = {
      active: 0,
      inactive: 0,
      suspended: 0,
      pending: 0
    };


    usersByRole.forEach((item: { _id: string; count: number }) => {
      if (roleStats.hasOwnProperty(item._id)) {
        roleStats[item._id as UserRole] = item.count;
      }
    });

    usersByStatus.forEach((item: { _id: string; count: number }) => {
      if (statusStats.hasOwnProperty(item._id)) {
        statusStats[item._id as UserStatus] = item.count;
      }
    });


    return {
      totalUsers,
      usersByRole: roleStats,
      usersByStatus: statusStats,
      activeUsers,
      newUsersThisMonth,
    };
  }


  /**
   * Update user's last login
   */
  async updateUserLastLogin(userId: string): Promise<IUser | null> {
    await connectDB();
    
    return await (User as UserModel).findOneAndUpdate(
      { userId },
      {
        $set: {
          lastLoginAt: new Date(),
          updatedAt: new Date(),
        },
        $inc: {
          'analytics.loginCount': 1,
        }
      },
      { new: true }
    );
  }


  /**
   * Update user analytics
   */
  async updateUserAnalytics(userId: string, updates: Partial<IUserAnalytics>): Promise<IUser | null> {
    await connectDB();
    
    const updatePayload: Record<string, unknown> = {
      updatedAt: new Date()
    };


    // Build analytics update
    Object.keys(updates).forEach(key => {
      if (updates[key as keyof IUserAnalytics] !== undefined) {
        updatePayload[`analytics.${key}`] = updates[key as keyof IUserAnalytics];
      }
    });


    return await (User as UserModel).findOneAndUpdate(
      { userId },
      updatePayload,
      { new: true }
    );
  }


  /**
   * Bulk update users
   */
  async bulkUpdateUsers(userIds: string[], updateData: UpdateUserData): Promise<number> {
    await connectDB();
    
    const result = await (User as UserModel).updateMany(
      { userId: { $in: userIds } },
      {
        ...updateData,
        updatedAt: new Date()
      }
    );


    return result.modifiedCount;
  }


  /**
   * Bulk delete users
   */
  async bulkDeleteUsers(userIds: string[]): Promise<number> {
    await connectDB();
    
    const result = await (User as UserModel).deleteMany({ userId: { $in: userIds } });
    return result.deletedCount;
  }


  /**
   * Get user count by filters
   */
  async getUserCount(filters: UserFilters = {}): Promise<number> {
    await connectDB();
    
    const query: Record<string, unknown> = {};


    if (filters.role) {
      query.role = filters.role;
    }


    if (filters.status) {
      query.status = filters.status;
    }


    if (filters.search) {
      query.$or = [
        { firstName: { $regex: filters.search, $options: 'i' } },
        { lastName: { $regex: filters.search, $options: 'i' } },
        { email: { $regex: filters.search, $options: 'i' } },
        { fullName: { $regex: filters.search, $options: 'i' } },
      ];
    }


    return await User.countDocuments(query);
  }


  /**
   * Get recent users
   */
  async getRecentUsers(limit: number = 10): Promise<IUser[]> {
    await connectDB();
    
    const users = await (User as UserModel).find({ status: 'active' })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
    
    return users as IUser[];
  }


  /**
   * Get users with no recent activity
   */
  async getInactiveUsers(daysSinceLastLogin: number = 30): Promise<IUser[]> {
    await connectDB();
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysSinceLastLogin);


    const users = await (User as UserModel).find({
      $or: [
        { lastLoginAt: { $lt: cutoffDate } },
        { lastLoginAt: { $exists: false } }
      ],
      status: 'active'
    }).lean();

    return users as IUser[];
  }
}


// Export singleton instance
export const userService = new UserService();
export default userService;