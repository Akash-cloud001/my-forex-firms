import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProgram extends Document {
  propFirmId: mongoose.Types.ObjectId;
  type: string;
  name: string;
  evaluationPhases: number;
  evaluationSteps: {
    stepNumber: number;
    profitTarget: string;
    maxLoss: string;
    dailyLoss: string;
    minTradingDays: number;
    maxLossType: string;
  }[];
  accountSizes: {
    size: number;
    price: number;
  }[];
  profitSplit: string;
  minPayout: string;
  payoutFrequency: {
    label: string;
    percentage: string;
  }[];

  evaluationRule: {
    stopLoss: { required: boolean; note: string };
    eaAllowed: { required: boolean; note: string };
    weekendHolding: { required: boolean; note: string };
    overnightHolding: { required: boolean; note: string };
    newsTrading: { required: boolean; note: string };
    copyTrading: { required: boolean; note: string };
    consistency: { required: boolean; note: string };
    maxRiskPerTrade: { required: boolean; note: string };
  };

  fundedRule: {
    stopLoss: { required: boolean; note: string };
    eaAllowed: { required: boolean; note: string };
    weekendHolding: { required: boolean; note: string };
    overnightHolding: { required: boolean; note: string };
    newsTrading: { required: boolean; note: string };
    copyTrading: { required: boolean; note: string };
    consistency: { required: boolean; note: string };
    maxRiskPerTrade: { required: boolean; note: string };
  };

  fundedCriteria: {
    profitTarget: { type: string, required: false },
    maxLoss: { type: string, required: false },
    dailyLoss: { type: string, required: false },
    minTradingDays: { type: number, required: false },
    maxLossType: { type: string, required: false }
  },

  payoutMethods: string[];
  timeLimit: string;
  drawdownResetType: string;
}

const RuleSchema = {
  required: { type: Boolean, default: false },
  note: { type: String, default: "" },
};

const ProgramSchema = new Schema<IProgram>(
  {
    propFirmId: {
      type: Schema.Types.ObjectId,
      ref: "FundingFirm",
      required: true,
    },
    type: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    evaluationPhases: { type: Number },

    evaluationSteps: [
      {
        stepNumber: { type: Number, required: true },
        profitTarget: { type: String, required: true },
        maxLoss: { type: String, required: true },
        dailyLoss: { type: String, required: true },
        minTradingDays: { type: Number, required: true },
        maxLossType: { type: String, required: true },
      },
    ],

    accountSizes: [
      {
        size: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],

    profitSplit: { type: String, required: true },
    minPayout: { type: String, required: true },

    payoutFrequency: [
      {
        label: { type: String, required: true },
        percentage: { type: String, required: true },
      },
    ],
    fundedCriteria: {
      profitTarget: { type: String, required: false },
      maxLoss: { type: String, required: false },
      dailyLoss: { type: String, required: false },
      minTradingDays: { type: Number, required: false },
      maxLossType: { type: String, required: false }
    },


    evaluationRule: {
      stopLoss: RuleSchema,
      eaAllowed: RuleSchema,
      weekendHolding: RuleSchema,
      overnightHolding: RuleSchema,
      newsTrading: RuleSchema,
      copyTrading: RuleSchema,
      consistency: RuleSchema,
      maxRiskPerTrade: RuleSchema,
    },

    fundedRule: {
      stopLoss: RuleSchema,
      eaAllowed: RuleSchema,
      weekendHolding: RuleSchema,
      overnightHolding: RuleSchema,
      newsTrading: RuleSchema,
      copyTrading: RuleSchema,
      consistency: RuleSchema,
      maxRiskPerTrade: RuleSchema
    },

    payoutMethods: [{ type: String }],
    timeLimit: { type: String },
    drawdownResetType: { type: String },
  },
  { timestamps: true }
);

const Program: Model<IProgram> =
  mongoose.models.Program || mongoose.model<IProgram>("Program", ProgramSchema);

export default Program;
