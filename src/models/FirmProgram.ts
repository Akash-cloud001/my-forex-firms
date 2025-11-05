import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProgram extends Document {
  propFirmId: mongoose.Types.ObjectId;
  type: string; // "1-Step" | "2-Step"
  name: string;
  evaluationPhases: number;
  evaluationSteps: {
    stepNumber: number;
    profitTarget: string;
    maxLoss: string;
    dailyLoss: string;
    minTradingDays: number;
  }[];
  accountSizes: {
    size: number;
    price: number;
  }[];
  profitSplit: string;
  payoutFrequency: {
    label: string;
    percentage: string;
  }[];
  leverage: string;
  stopLossRequired: boolean;
  eaAllowed: boolean;
  weekendHolding: boolean;
  overnightHolding: boolean;
  newsTrading: boolean;
  copyTrading: boolean;
  refundFee: boolean;
  payoutMethods: string[];
  profitTarget: string;
  dailyLoss: string;
  maxLoss: string;
  maxLossType: string;
  timeLimit: string;
  drawdownResetType: string;
  minTradingDays: number;
}

const ProgramSchema = new Schema<IProgram>(
  {
    propFirmId: {
      type: Schema.Types.ObjectId,
      ref: 'FundingFirm',
      required: true,
    },
    type: {
      type: String,
      // enum: ['1-Step', '2-Step'],
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    evaluationPhases: {
      type: Number,
      // required: true,
    },
    evaluationSteps: [
      {
        stepNumber: { type: Number, required: true },
        profitTarget: { type: String, required: true },
        maxLoss: { type: String, required: true },
        dailyLoss: { type: String, required: true },
        minTradingDays: { type: Number, required: true },
      },
    ],
    accountSizes: [
      {
        size: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    profitSplit: { type: String, required: true },
    payoutFrequency: [
      {
        label: { type: String, required: true },
        percentage: { type: String, required: true },
      },
    ],
    leverage: { type: String, required: true },
    stopLossRequired: { type: Boolean, default: false },
    eaAllowed: { type: Boolean, default: false },
    weekendHolding: { type: Boolean, default: false },
    overnightHolding: { type: Boolean, default: false },
    newsTrading: { type: Boolean, default: false },
    copyTrading: { type: Boolean, default: false },
    refundFee: { type: Boolean, default: false },
    payoutMethods: [{ type: String }],
    profitTarget: { type: String },
    dailyLoss: { type: String },
    maxLoss: { type: String },
    maxLossType: { type: String },
    timeLimit: { type: String },
    drawdownResetType: { type: String },
    minTradingDays: { type: Number },
  },
  { timestamps: true }
);

const Program: Model<IProgram> =
  mongoose.models.Program || mongoose.model<IProgram>('Program', ProgramSchema);

export default Program;