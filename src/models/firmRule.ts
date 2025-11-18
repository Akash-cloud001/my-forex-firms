import mongoose, { Schema, Types, Document } from "mongoose";

/* ------------------ INTERFACES ------------------ */
export interface IQuestion {
  question: string;
  answer: string;
  status: boolean;
}

export interface ICategory {
  name: string;
  questions: IQuestion[];
  status: boolean;
}

export interface IFirmRule extends Document {
  firmId: Types.ObjectId;
  categories: ICategory[];
}

/* ------------------ SCHEMAS ------------------ */
const QuestionSchema = new Schema<IQuestion>(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true, timestamps: true }
);

const CategorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    questions: {
      type: [QuestionSchema],
      default: [],
      validate: {
        validator: function (v: IQuestion[]) {
          return v.length > 0;
        },
        message: "A category must contain at least one question.",
      },
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { _id: true, timestamps: true }
);

const FirmRuleSchema = new Schema<IFirmRule>(
  {
    firmId: {
      type: Schema.Types.ObjectId,
      ref: "Firm",
      required: true,
    },
    categories: {
      type: [CategorySchema],
      default: [],
      validate: {
        validator: function (v: ICategory[]) {
          return v.length > 0;
        },
        message: "At least one category is required.",
      },
    },
  },
  { timestamps: true }
);

/* ------------------ MODEL ------------------ */

export default mongoose.models.FirmRule ||
  mongoose.model<IFirmRule>("FirmRule", FirmRuleSchema);
