// ============================================================================
// USER TYPES INDEX
// ============================================================================
// This file provides a centralized export point for all user-related types
// making imports cleaner and more maintainable

export * from './user';

// Import original interface names for use in this file
import type { IUser, IUserAnalytics, IClerkMetadata } from './user';

// ============================================================================
// CONVENIENCE RE-EXPORTS
// ============================================================================
// Re-export commonly used types with shorter names for convenience

export type {
  IUser as User,
  CreateUserData as CreateUser,
  UpdateUserData as UpdateUser,
  UserFilters as Filters,
  UserStats as Stats,
  UserRole as Role,
  UserStatus as Status,
  UserTheme as Theme,
  UserLanguage as Language,
  IUserAddress as Address,
  IUserAnalytics as Analytics,
  IClerkMetadata as ClerkMetadata,
  ClerkUserData as ClerkUser,
  ClerkWebhookEvent as WebhookEvent,
  IUserService as UserService,
  UserListResponse as ListResponse,
  UserSearchResult as SearchResult,
  UserQueryOptions as QueryOptions,
  UserSortOptions as SortOptions,
  UserPaginationOptions as PaginationOptions,
  UserValidationResult as ValidationResult,
  UserCreateValidation as CreateValidation,
  UserPublicProfile as PublicProfile,
  UserAdminView as AdminView,
  UserMinimal as Minimal
} from './user';

// ============================================================================
// TYPE UTILITIES
// ============================================================================
// Additional utility types that combine or extend the base types

export type UserWithAnalytics = IUser & {
  analytics: Required<IUserAnalytics>;
};

export type UserWithMetadata = IUser & {
  clerkMetadata: Required<IClerkMetadata>;
};

export type UserSummary = Pick<IUser, 'userId' | 'email' | 'firstName' | 'lastName' | 'role' | 'status'>;

export type UserProfile = Pick<IUser, 
  'userId' | 'firstName' | 'lastName' | 'imageUrl' | 'phone' | 
  'address'
>;

// ============================================================================
// CONSTANTS RE-EXPORTS
// ============================================================================

export {
  USER_ROLES,
  USER_STATUSES,
  USER_THEMES,
  USER_LANGUAGES
} from './user';

// ============================================================================
// HELPER FUNCTIONS RE-EXPORTS
// ============================================================================

export {
  isUserRole,
  isUserStatus,
  isUserTheme,
  isUserLanguage,
  createUserDisplayName,
  validateUserEmail,
  validateUserPhone,
  getUserRoleDisplayName,
  getUserStatusDisplayName
} from './user';
