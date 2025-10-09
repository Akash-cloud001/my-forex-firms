import mongoose, { Schema, models } from "mongoose";

export interface IEmailSubscription {
  email: string;
  ipAddress?: string;
  userAgent?: string;
  subscribedAt: Date;
  isActive: boolean;
}

const EmailSubscriptionSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    ipAddress: {
      type: String,
      default: "unknown",
    },
    userAgent: {
      type: String,
      default: "unknown",
    },
    subscribedAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create unique index on email for faster lookups and duplicate prevention
EmailSubscriptionSchema.index({ email: 1 }, { unique: true });

const EmailSubscription =
  models.EmailSubscription ||
  mongoose.model<IEmailSubscription>("EmailSubscription", EmailSubscriptionSchema);

export default EmailSubscription;

