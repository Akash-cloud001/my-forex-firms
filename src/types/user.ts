import { Document, Types } from 'mongoose';

// ============================================================================
// CORE USER TYPES
// ============================================================================

export type UserRole = 'user' | 'editor' | 'moderator' | 'admin';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';
export type UserTheme = 'light' | 'dark' | 'system';
export type UserLanguage = 'en' | 'es';

// ============================================================================
// SUB-INTERFACES
// ============================================================================


export interface IUserAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface IUserAnalytics {
  loginCount: number;
  lastActivity: Date;
  totalFirmsCreated: number;
  totalReviewsCreated: number;
  totalReportsManaged: number;
}

export interface IClerkMetadata {
  publicMetadata?: Record<string, unknown>;
  privateMetadata?: Record<string, unknown>;
  unsafeMetadata?: Record<string, unknown>;
}

// ============================================================================
// MAIN USER INTERFACE
// ============================================================================

export interface IUser extends Document {
  _id: Types.ObjectId;
  
  // External Service Integration
  userId: string; // Clerk user ID
  email: string;
  firstName: string;
  lastName?: string;
  fullName: string;
  imageUrl?: string;
  phone?: string;
  
  // Role & Permissions
  role: UserRole;
  status: UserStatus;
  
  // Profile Information
  address?: IUserAddress;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  
  // External Service Metadata
  clerkMetadata?: IClerkMetadata;
  
  // Analytics
  analytics: IUserAnalytics;
  
  // Virtual Fields
  displayName: string;
  isActive: boolean;
  isAdmin: boolean;
  
  // Instance Methods
  updateLastLogin(): Promise<IUser>;
  updateAnalytics(updates: Partial<IUserAnalytics>): Promise<IUser>;
}

// ============================================================================
// DATA TRANSFER OBJECTS
// ============================================================================

export interface CreateUserData {
  userId: string;
  email: string;
  firstName: string;
  lastName?: string;
  imageUrl?: string;
  phone?: string;
  role?: UserRole;
  status?: UserStatus;
  address?: IUserAddress;
  clerkMetadata?: IClerkMetadata;
}

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  phone?: string;
  role?: UserRole;
  status?: UserStatus;
  address?: IUserAddress;
  lastLoginAt?: Date;
  analytics?: Partial<IUserAnalytics>;
  clerkMetadata?: IClerkMetadata;
}

// ============================================================================
// FILTER & QUERY TYPES
// ============================================================================

export interface UserFilters {
  role?: UserRole;
  status?: UserStatus;
  search?: string;
  createdAfter?: Date;
  createdBefore?: Date;
  lastLoginAfter?: Date;
  lastLoginBefore?: Date;
}

export interface UserSortOptions {
  field: 'createdAt' | 'updatedAt' | 'lastLoginAt' | 'firstName' | 'lastName' | 'email';
  order: 'asc' | 'desc';
}

export interface UserPaginationOptions {
  page: number;
  limit: number;
}

export interface UserQueryOptions {
  filters?: UserFilters;
  sort?: UserSortOptions;
  pagination?: UserPaginationOptions;
}

// ============================================================================
// RESPONSE TYPES
// ============================================================================

export interface UserListResponse {
  users: IUser[];
  total: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface UserStats {
  totalUsers: number;
  usersByRole: Record<UserRole, number>;
  usersByStatus: Record<UserStatus, number>;
  activeUsers: number;
  newUsersThisMonth: number;
}

export interface UserSearchResult {
  user: IUser;
  score?: number;
}

// ============================================================================
// WEBHOOK TYPES
// ============================================================================

export interface ClerkUserData {
  id: string;
  first_name?: string;
  last_name?: string;
  image_url?: string;
  email_addresses?: Array<{ email_address: string }>;
  phone_numbers?: Array<{ phone_number: string }>;
  public_metadata?: Record<string, unknown>;
  private_metadata?: Record<string, unknown>;
  unsafe_metadata?: Record<string, unknown>;
}

export interface ClerkWebhookEvent {
  type: 'user.created' | 'user.updated' | 'user.deleted';
  data: ClerkUserData;
  created_at?: number;
  object?: string;
}

// ============================================================================
// SERVICE INTERFACE TYPES
// ============================================================================

export interface IUserService {
  // CRUD Operations
  createUser(userData: CreateUserData): Promise<IUser>;
  getUserById(id: string): Promise<IUser | null>;
  getUserByUserId(userId: string): Promise<IUser | null>;
  getUserByEmail(email: string): Promise<IUser | null>;
  updateUser(userId: string, updateData: UpdateUserData): Promise<IUser | null>;
  deleteUser(userId: string): Promise<boolean>;
  
  // Query Operations
  getUsers(options?: UserQueryOptions): Promise<UserListResponse>;
  searchUsers(searchTerm: string, options?: UserQueryOptions): Promise<UserListResponse>;
  getUsersByRole(role: UserRole): Promise<IUser[]>;
  getUsersByStatus(status: UserStatus): Promise<IUser[]>;
  
  // Utility Operations
  userExists(userId: string): Promise<boolean>;
  getUserStats(): Promise<UserStats>;
  updateUserLastLogin(userId: string): Promise<IUser | null>;
  updateUserAnalytics(userId: string, updates: Partial<IUserAnalytics>): Promise<IUser | null>;
  
  // Bulk Operations
  bulkUpdateUsers(userIds: string[], updateData: UpdateUserData): Promise<number>;
  bulkDeleteUsers(userIds: string[]): Promise<number>;
}

// ============================================================================
// VALIDATION TYPES
// ============================================================================

export interface UserValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface UserCreateValidation {
  userId: UserValidationResult;
  email: UserValidationResult;
  firstName: UserValidationResult;
  lastName: UserValidationResult;
  phone?: UserValidationResult;
  role: UserValidationResult;
  status: UserValidationResult;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type UserCreateInput = Omit<IUser, '_id' | 'createdAt' | 'updatedAt' | 'fullName' | 'displayName' | 'isActive' | 'isAdmin'>;
export type UserUpdateInput = Partial<Omit<IUser, '_id' | 'userId' | 'createdAt' | 'updatedAt' | 'fullName' | 'displayName' | 'isActive' | 'isAdmin'>>;

// Pick specific fields for different use cases
export type UserPublicProfile = Pick<IUser, 'userId' | 'firstName' | 'lastName' | 'imageUrl' | 'role'>;
export type UserAdminView = Pick<IUser, 'userId' | 'email' | 'firstName' | 'lastName' | 'role' | 'status' | 'createdAt' | 'lastLoginAt'>;
export type UserMinimal = Pick<IUser, 'userId' | 'email' | 'firstName' | 'lastName'>;

// ============================================================================
// CONSTANTS
// ============================================================================

export const USER_ROLES: Record<UserRole, string> = {
  user: 'User',
  editor: 'Editor',
  moderator: 'Moderator',
  admin: 'Administrator'
};

export const USER_STATUSES: Record<UserStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  suspended: 'Suspended',
  pending: 'Pending'
};

export const USER_THEMES: Record<UserTheme, string> = {
  light: 'Light',
  dark: 'Dark',
  system: 'System'
};

export const USER_LANGUAGES: Record<UserLanguage, string> = {
  en: 'English',
  es: 'Spanish'
};

// ============================================================================
// TYPE GUARDS
// ============================================================================

export function isUserRole(role: string): role is UserRole {
  return ['user', 'editor', 'moderator', 'admin'].includes(role);
}

export function isUserStatus(status: string): status is UserStatus {
  return ['active', 'inactive', 'suspended', 'pending'].includes(status);
}

export function isUserTheme(theme: string): theme is UserTheme {
  return ['light', 'dark', 'system'].includes(theme);
}

export function isUserLanguage(language: string): language is UserLanguage {
  return ['en', 'es'].includes(language);
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function createUserDisplayName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}

export function validateUserEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateUserPhone(phone: string): boolean {
  const phoneRegex = /^\+?[\d\s\-\(\)]+$/;
  return phoneRegex.test(phone);
}

export function getUserRoleDisplayName(role: UserRole): string {
  return USER_ROLES[role];
}

export function getUserStatusDisplayName(status: UserStatus): string {
  return USER_STATUSES[status];
}
