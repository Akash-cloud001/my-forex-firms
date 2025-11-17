import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFaqCategory extends Document {
  name: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FaqCategorySchema = new Schema<IFaqCategory>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const FaqCategory: Model<IFaqCategory> =
  mongoose.models.FaqCategory ||
  mongoose.model<IFaqCategory>("FaqCategory", FaqCategorySchema);

export default FaqCategory;