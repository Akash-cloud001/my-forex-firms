import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPointEvaluation extends Document {
    firmId: mongoose.Types.ObjectId;
    firmName: string;
    isEvaluated: boolean;
    evaluatedAt: Date;
    ptiScore: number;
    credibilityTransparency: {
        maxScore: number;
        score: number;
    }
    tradingExperience: {
        maxScore: number;
        score: number;
    }
    payoutPaymentReliability: {
        maxScore: number;
        score: number;
    }
    scores: {
        credibility: {
            physical_legal_presence: {
                registered_company: number;
                physical_office: number;
                dashboard_friendlyness: number;
            };
            public_identity_transparency: {
                public_ceo_founder: number;
                support_quality: number;
                terms_clarity: number;
                brocker_backed: number;
            };
            social_community_presence: {
                active_social: number;
                transparent_comm: number;
            };
            trust_signals_history: {
                verified_payouts: number;
                lifetime_payouts: number;
                no_controversies: number;
                consistent_ops: number;
            };
        };
        trading_experience: {
            trading_conditions: {
                fair_spreads: number;
                fair_commissions: number;
                acceptable_slippage: number;
            };
            trading_freedom: {
                multiple_trading_platforms: number;
                profit_targets: number;
                consistancy_rule: number;
                news_trading: number;
            };
            rules_fairness: {
                lavrage_margin_rule: number;
                no_hidden_restrictions_stratgy: number;
                dd_type: number;
            };
        };
        payout_payment_experience: {
            payout_reliability: {
                no_payout_denial_policy: number;
                payout_cycle: number;
                single_highest_payout: number;
            };
            payout_behavior: {
                payout_time: number;
                flexible_payout_methods: number;
                payout_denials: number;
            };
            payout_payment_structure: {
                fair_profit_split: number;
                flexible_payment_methods: number;
                reasonable_minimum_payout_requiremnts: number;
            };
        };
    };
    createdAt: Date;
    updatedAt: Date;
}

const PointEvaluationSchema = new Schema<IPointEvaluation>(
    {
        firmId: { type: Schema.Types.ObjectId, ref: "FundingFirm", required: true },
        firmName: { type: String, required: true },
        isEvaluated: { type: Boolean, default: false },
        evaluatedAt: { type: Date, default: Date.now },
        ptiScore: { type: Number, default: 0 },
        credibilityTransparency: {
            maxScore: { type: Number, default: 0 },
            score: { type: Number, default: 0 },
        },
        tradingExperience: {
            maxScore: { type: Number, default: 0 },
            score: { type: Number, default: 0 },
        },
        payoutPaymentReliability: {
            maxScore: { type: Number, default: 0 },
            score: { type: Number, default: 0 },
        },
        scores: {
            credibility: {
                physical_legal_presence: {
                    registered_company: { type: Number, default: 0 },
                    physical_office: { type: Number, default: 0 },
                    dashboard_friendlyness: { type: Number, default: 0 },
                },
                public_identity_transparency: {
                    public_ceo_founder: { type: Number, default: 0 },
                    support_quality: { type: Number, default: 0 },
                    terms_clarity: { type: Number, default: 0 },
                    brocker_backed: { type: Number, default: 0 },
                },
                social_community_presence: {
                    active_social: { type: Number, default: 0 },
                    transparent_comm: { type: Number, default: 0 },
                },
                trust_signals_history: {
                    verified_payouts: { type: Number, default: 0 },
                    lifetime_payouts: { type: Number, default: 0 },
                    no_controversies: { type: Number, default: 0 },
                    consistent_ops: { type: Number, default: 0 },
                },
            },
            trading_experience: {
                trading_conditions: {
                    fair_spreads: { type: Number, default: 0 },
                    fair_commissions: { type: Number, default: 0 },
                    acceptable_slippage: { type: Number, default: 0 },
                },
                trading_freedom: {
                    multiple_trading_platforms: { type: Number, default: 0 },
                    profit_targets: { type: Number, default: 0 },
                    consistancy_rule: { type: Number, default: 0 },
                    news_trading: { type: Number, default: 0 },
                },
                rules_fairness: {
                    lavrage_margin_rule: { type: Number, default: 0 },
                    no_hidden_restrictions_stratgy: { type: Number, default: 0 },
                    dd_type: { type: Number, default: 0 },
                },
            },
            payout_payment_experience: {
                payout_reliability: {
                    no_payout_denial_policy: { type: Number, default: 0 },
                    payout_cycle: { type: Number, default: 0 },
                    single_highest_payout: { type: Number, default: 0 },
                },
                payout_behavior: {
                    payout_time: { type: Number, default: 0 },
                    flexible_payout_methods: { type: Number, default: 0 },
                    payout_denials: { type: Number, default: 0 },
                },
                payout_payment_structure: {
                    fair_profit_split: { type: Number, default: 0 },
                    flexible_payment_methods: { type: Number, default: 0 },
                    reasonable_minimum_payout_requiremnts: { type: Number, default: 0 },
                },
            },
        },
    },
    {
        timestamps: true,
    }
);

const PointEvaluation: Model<IPointEvaluation> =
    mongoose.models.PointEvaluation ||
    mongoose.model<IPointEvaluation>("PointEvaluation", PointEvaluationSchema);

export default PointEvaluation;
