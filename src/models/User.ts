import mongoose, { Schema, models, Model } from 'mongoose';
import {
  IUser,
  IUserAnalytics,
  UserRole
} from '../types/user';

// ============================================================================
// SUB-SCHEMAS (Best Practice: Break down complex schemas)
// ============================================================================


const UserAddressSchema = new Schema({
  street: { type: String, trim: true },
  city: { type: String, trim: true },
  state: { type: String, trim: true },
  zipCode: { type: String, trim: true },
  country: { type: String, trim: true }
}, { _id: false });

const UserAnalyticsSchema = new Schema({
  loginCount: { type: Number, default: 0, min: 0 },
  lastActivity: { type: Date, default: Date.now },
  totalFirmsCreated: { type: Number, default: 0, min: 0 },
  totalReviewsCreated: { type: Number, default: 0, min: 0 },
  totalReportsManaged: { type: Number, default: 0, min: 0 }
}, { _id: false });

const ClerkMetadataSchema = new Schema({
  publicMetadata: { type: Schema.Types.Mixed },
  privateMetadata: { type: Schema.Types.Mixed },
  unsafeMetadata: { type: Schema.Types.Mixed }
}, { _id: false });

// ============================================================================
// MAIN USER SCHEMA
// ============================================================================

const UserSchema = new Schema({
  // External Service Integration
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    validate: {
      validator: function (v: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please provide a valid email address'
    }
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  fullName: {
    type: String,
    trim: true,
    maxlength: [101, 'Full name cannot exceed 101 characters']
  },
  imageUrl: {
    type: String,
    trim: true,
    validate: {
      validator: function (v: string) {
        if (!v) return true; // Allow empty
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Image URL must be a valid HTTP/HTTPS URL'
    }
  },
  phone: {
    type: String,
    trim: true,
    validate: {
      validator: function (v: string) {
        if (!v) return true; // Allow empty
        return /^\+?[\d\s\-\(\)]+$/.test(v);
      },
      message: 'Please provide a valid phone number'
    }
  },

  // Role & Permissions
  role: {
    type: String,
    required: true,
    enum: {
      values: ['user', 'editor', 'moderator', 'admin'] as UserRole[],
      message: 'Role must be one of: user, editor, moderator, admin'
    },
    default: 'user'
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ['active', 'inactive', 'suspended', 'pending'],
      message: 'Status must be one of: active, inactive, suspended, pending'
    },
    default: 'active'
  },

  // Profile Information
  address: { type: UserAddressSchema },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  lastLoginAt: {
    type: Date
  },

  // External Service Metadata
  clerkMetadata: { type: ClerkMetadataSchema },

  // Analytics
  analytics: {
    type: UserAnalyticsSchema,
    default: () => ({
      loginCount: 0,
      lastActivity: new Date(),
      totalFirmsCreated: 0,
      totalReviewsCreated: 0,
      totalReportsManaged: 0
    })
  }
}, {
  timestamps: true,
  collection: 'users'
});

// ============================================================================
// VIRTUAL FIELDS (Best Practice: Use virtuals for computed properties)
// ============================================================================

UserSchema.virtual('displayName').get(function () {
  if (this.lastName) {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.firstName;
});

UserSchema.virtual('isActive').get(function () {
  return this.status === 'active';
});

UserSchema.virtual('isAdmin').get(function () {
  return this.role === 'admin';
});

// ============================================================================
// INDEXES (Optimized for filtering and search performance)
// ============================================================================

// Single field indexes for unique lookups and common queries
UserSchema.index({ userId: 1 }, { unique: true });
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ status: 1 });
UserSchema.index({ createdAt: -1 });
UserSchema.index({ updatedAt: -1 });
UserSchema.index({ lastLoginAt: -1 });

// Compound indexes for common filtering combinations
UserSchema.index({ role: 1, status: 1 });
UserSchema.index({ status: 1, role: 1 });
UserSchema.index({ role: 1, createdAt: -1 });
UserSchema.index({ status: 1, createdAt: -1 });
UserSchema.index({ role: 1, lastLoginAt: -1 });
UserSchema.index({ status: 1, lastLoginAt: -1 });

// Partial indexes for active users (most common queries)
UserSchema.index({ role: 1 }, { partialFilterExpression: { status: 'active' } });
UserSchema.index({ createdAt: -1 }, { partialFilterExpression: { status: 'active' } });
UserSchema.index({ lastLoginAt: -1 }, { partialFilterExpression: { status: 'active' } });

// Admin-specific indexes for admin queries
UserSchema.index({ role: 1, status: 1 }, { partialFilterExpression: { role: 'admin' } });
UserSchema.index({ role: 1, createdAt: -1 }, { partialFilterExpression: { role: 'admin' } });
UserSchema.index({ role: 1, lastLoginAt: -1 }, { partialFilterExpression: { role: 'admin' } });

// Text search index for full-text search across user fields
UserSchema.index({
  firstName: 'text',
  lastName: 'text',
  email: 'text',
  fullName: 'text'
}, {
  weights: {
    email: 10,      // Email has highest weight
    firstName: 5,   // First name has medium weight
    lastName: 5,    // Last name has medium weight
    fullName: 3     // Full name has lower weight
  },
  name: 'user_search_text'
});

// Sparse indexes for optional fields
UserSchema.index({ phone: 1 }, { sparse: true });
UserSchema.index({ imageUrl: 1 }, { sparse: true });

// Analytics indexes for reporting and statistics
UserSchema.index({ 'analytics.loginCount': -1 });
UserSchema.index({ 'analytics.lastActivity': -1 });
UserSchema.index({ 'analytics.totalFirmsCreated': -1 });
UserSchema.index({ 'analytics.totalReviewsCreated': -1 });

// Compound indexes for complex queries
UserSchema.index({ role: 1, 'analytics.lastActivity': -1 });
UserSchema.index({ status: 1, 'analytics.loginCount': -1 });
UserSchema.index({ createdAt: -1, role: 1, status: 1 });

// ============================================================================
// INSTANCE METHODS (Best Practice: Add business logic methods)
// ============================================================================

UserSchema.methods.updateLastLogin = function () {
  this.lastLoginAt = new Date();
  this.analytics.loginCount += 1;
  this.analytics.lastActivity = new Date();
  return this.save();
};

UserSchema.methods.updateAnalytics = function (updates: Partial<IUserAnalytics>) {
  Object.assign(this.analytics, updates);
  this.analytics.lastActivity = new Date();
  return this.save();
};

// ============================================================================
// STATIC METHODS (Best Practice: Add utility methods)
// ============================================================================

UserSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email: email.toLowerCase() });
};

UserSchema.statics.findByRole = function (role: UserRole) {
  return this.find({ role, status: 'active' });
};

UserSchema.statics.findActiveUsers = function () {
  return this.find({ status: 'active' });
};

UserSchema.statics.searchUsers = function (searchTerm: string) {
  return this.find({
    $text: { $search: searchTerm }
  }, {
    score: { $meta: 'textScore' }
  }).sort({ score: { $meta: 'textScore' } });
};

// ============================================================================
// PRE-SAVE MIDDLEWARE (Best Practice: Auto-generate computed fields)
// ============================================================================

UserSchema.pre('save', function (next) {
  // Auto-generate fullName
  if (this.firstName && this.lastName) {
    this.fullName = `${this.firstName} ${this.lastName}`;
  } else if (this.firstName) {
    this.fullName = this.firstName;
  }

  // Update updatedAt timestamp
  this.updatedAt = new Date();

  next();
});

// ============================================================================
// MODEL EXPORT (Best Practice: Check if model exists before creating)
// ============================================================================

const User: Model<IUser> = (models?.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);

export default User;

// ============================================================================
// RE-EXPORT TYPES (Best Practice: Re-export for convenience)
// ============================================================================

export type {
  UserCreateInput,
  UserUpdateInput,
  UserFilters,
  UserStats,
  UserRole,
  UserStatus
} from '../types/user';
