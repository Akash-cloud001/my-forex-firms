export const initialScoresData = {
    company_id: 1,
    company_name: "Demo Prop Firm",
    scores: {
        credibility: {
            physical_legal_presence: {
                registered_company: 1,
                physical_office: 0,
                dashboard_friendlyness: 0.5,
            },

            public_identity_transparency: {
                public_ceo_founder: 1,
                support_quality: 0.7,   // (0.5 + 0.2 example)
                terms_clarity: 0.7,
                brocker_backed: 0.15,
            },

            social_community_presence: {
                active_social: 0.3,
                transparent_comm: 0.5,
            },

            trust_signals_history: {
                verified_payouts: 0.5,
                lifetime_payouts: 0.8,
                no_controversies: 0.25,
                consistent_ops: 0.4,
            }
        },

        trading_experience: {
            trading_conditions: {
                fair_spreads: 0.7,
                fair_commissions: 1,
                acceptable_slippage: 0.7,
                multiple_trading_platforms: 0.8,
            },

            trading_freedom: {
                profit_targets: 0.8,
                consistancy_rule: 0.9,
                news_trading: 0.8, // using one of the criteria values
            },

            rules_fairness: {
                lavrage_margin_rule: 1,
                no_hidden_restrictions_stratgy: 1,
                dd_type: 1,
            }
        },

        payout_payment_experience: {
            payout_reliability: {
                no_payout_denial_policy: 1,
                payout_cycle: 1,
                single_highest_payout: 0.8,
            },

            payout_behavior: {
                payout_time: 2,
                flexible_payout_methods: 1,
                payout_denials: 1,
            },

            payout_payment_structure: {
                fair_profit_split: 1,
                flexible_payment_methods: 1,
                reasonable_minimum_payout_requiremnts: 1,
            }
        }
    }
};


import type { Pillar } from './constant.types';

export const pillarsConfig: Pillar[] = [
    {
        id: "credibility",
        name: "Credibility & Transparency",
        categories: [
            // ---------------------------------------------------------
            // 1. Physical & Legal Presence
            // ---------------------------------------------------------
            {
                id: "physical_legal_presence",
                name: "Physical & Legal Presence",
                factors: {
                    registered_company: {
                        label: "Registered legal company (public record)",
                        max: 1,
                        criteria: [
                            { label: "Default", value: 0 },
                            { label: "Yes (public record)", value: 1 }
                        ]
                    },

                    physical_office: {
                        label: "Physical office address visible",
                        max: 1,
                        criteria: [
                            { label: "Default", value: 0 },
                            { label: "Visible office address", value: 1 }
                        ]
                    },

                    dashboard_friendlyness: {
                        label: "Dashboard/website user frindlyness",
                        max: 1,
                        criteria: [
                            { label: "Slow Update/Manul Payout Button/Payout Date Not visible", value: 0.5 },
                            { label: "All good", value: 1 }
                        ]
                    }
                }
            },

            // ---------------------------------------------------------
            // 2. Public Identity & Transparency
            // ---------------------------------------------------------
            {
                id: "public_identity_transparency",
                name: "Public Identity & Transparency",
                factors: {
                    public_ceo_founder: {
                        label: "Public CEO / Founder",
                        max: 1,
                        criteria: [
                            { label: "Public Profile Not Avilable", value: 0 },
                            { label: "Avilable", value: 1 }
                        ]
                    },

                    support_quality: {
                        label: "Good Support/Low Waiting Time",
                        max: 1,
                        criteria: [
                            { label: "Waiting time Above 1H", value: 0.5 },
                            { label: "Multi chanal support", value: 0.2 },
                            { label: "Waiting Time Under 1H", value: 0.8 },
                            { label: "Multi chanal support", value: 0.2 }
                        ]
                    },

                    terms_clarity: {
                        label: "Clear, accessible, well-written rules / T&C",
                        max: 1,
                        criteria: [
                            { label: "Stretgy not explaind or Faq not Avil.", value: 0 },
                            { label: "Rule Without Example", value: 0.7 },
                            { label: "Well - Written", value: 1 }
                        ]
                    },

                    brocker_backed: {
                        label: "Brocker backed",
                        max: 0.3,
                        criteria: [
                            { label: "Reputed broker", value: 0.3 },
                            { label: "new broker", value: 0.15 },
                            { label: "no broker", value: 0 }
                        ]
                    }
                }
            },

            // ---------------------------------------------------------
            // 3. Social & Community Presence
            // ---------------------------------------------------------
            {
                id: "social_community_presence",
                name: "Social & Community Presence",
                factors: {
                    active_social: {
                        label: "Active social media (X / IG / Discord) Consistent posting & announcements",
                        max: 0.5,
                        criteria: [
                            { label: "No post in past 30 Days", value: 0.25 },
                            { label: "No Post in past 15 Days", value: 0.3 },
                            { label: "Proper posting with opretional updates/Issues", value: 0.5 }
                        ]
                    },

                    transparent_comm: {
                        label: "Transparent communication during issues",
                        max: 0.5,
                        criteria: [
                            { label: "No Annoucemnt related to Issues/Rule change or major upgrad", value: 0.1 },
                            { label: "Proper annoucement", value: 0.5 }
                        ]
                    }
                }
            },

            // ---------------------------------------------------------
            // 4. Trust Signals & History
            // ---------------------------------------------------------
            {
                id: "trust_signals_history",
                name: "Trust Signals & History",
                factors: {
                    verified_payouts: {
                        label: "Verified payout history (public proofs or traders)",
                        max: 0.5,
                        criteria: [
                            { label: "No on chain or Tp/Payout junction record", value: 0.3 },
                            { label: "Onchain Records Avil. And Traders posting Payouts", value: 0.5 }
                        ]
                    },

                    lifetime_payouts: {
                        label: "Life time payouts",
                        max: 1.2,
                        criteria: [
                            { label: "Under $1M", value: 0.5 },
                            { label: "$1M+", value: 0.7 },
                            { label: "$10M+", value: 0.8 },
                            { label: "$50M+", value: 1 },
                            { label: "$100M+", value: 1.2 }
                        ]
                    },

                    no_controversies: {
                        label: "No major controversies / scandals",
                        max: 0.5,
                        criteria: [
                            { label: "Mass Ban, Stretgy Ban, Opretion Pouse, Mass Rejection, Kyc Bans", value: 0.25 },
                            { label: "No Scandls", value: 0.5 }
                        ]
                    },

                    consistent_ops: {
                        label: "Consistent operations",
                        max: 0.5,
                        criteria: [
                            { label: "Under 1 Year old Firm", value: 0.2 },
                            { label: "Under 2year", value: 0.4 },
                            { label: "2y+", value: 0.5 }
                        ]
                    }
                }
            }
        ]
    },
    {
        id: "trading_experience",
        name: "Trading Experience",
        categories: [
            // ---------------------------------------------------------
            // 1. Trading Conditions
            // ---------------------------------------------------------
            {
                id: "trading_conditions",
                name: "Trading Conditions",
                factors: {
                    fair_spreads: {
                        label: "Fair spreads",
                        max: 1,
                        criteria: [
                            { label: "Low Close to Zero or Zero", value: 1 },
                            { label: "Medium", value: 0.7 },
                            { label: "High", value: 0.5 }
                        ]
                    },

                    fair_commissions: {
                        label: "Fair commissions",
                        max: 1,
                        criteria: [
                            { label: "Zero Com", value: 1 },
                            { label: "Round Under $5", value: 0.7 },
                            { label: "$4+", value: 0.5 }
                        ]
                    },

                    acceptable_slippage: {
                        label: "Acceptable slippage",
                        max: 1,
                        criteria: [
                            { label: "No Slippage", value: 1 },
                            { label: "Spipage", value: 0.7 }
                        ]
                    },

                    multiple_trading_platforms: {
                        label: "Multiple trading Platforms",
                        max: 1,
                        criteria: [
                            { label: "All Major", value: 1 },
                            { label: "Only MT5", value: 0.8 },
                            { label: "Only Ctrader + Other", value: 0.7 },
                            { label: "No Mt5/ctrader", value: 0.5 }
                        ]
                    }
                }
            },

            // ---------------------------------------------------------
            // 2. Trading Freedom
            // ---------------------------------------------------------
            {
                id: "trading_freedom",
                name: "Trading Freedom",
                factors: {
                    profit_targets: {
                        label: "PROFIT TARGETs",
                        max: 1,
                        criteria: [
                            { label: "8 + 5", value: 1 },
                            { label: "10+4", value: 0.8 },
                            { label: "10+5", value: 0.7 },
                            { label: "10+8", value: 0.6 }
                        ]
                    },

                    consistancy_rule: {
                        label: "Consistancy Rule",
                        max: 1,
                        criteria: [
                            { label: "NO", value: 1 },
                            { label: "Yes", value: 0.7 },
                            { label: "Multi Option", value: 0.9 }
                        ]
                    },

                    news_trading: {
                        label: "NEWS TRADING",
                        max: 1,
                        criteria: [
                            { label: "Allowed - 1 On Funded and Evalutaion both", value: 1 },
                            { label: "5 min restrictions - 0.8 (Allowed in Evals)", value: 0.8 },
                            { label: "Not allowed on Both (Evals + Funded)", value: 0.5 },
                            { label: "Holding ALLOWD", value: 0.1 },
                            { label: "Holding Not ALLOWD", value: 0 }
                        ]
                    }
                }
            },

            // ---------------------------------------------------------
            // 3. Rules & Fairness
            // ---------------------------------------------------------
            {
                id: "rules_fairness",
                name: "Rules & Fairness",
                factors: {
                    lavrage_margin_rule: {
                        label: "Lavrage/Margin Rule",
                        max: 1,
                        criteria: [
                            { label: "No Rule", value: 1 },
                            { label: "Margin Rule Yes", value: 0.5 }
                        ]
                    },

                    no_hidden_restrictions_stratgy: {
                        label: "No hidden restrictions/Stratgy",
                        max: 1,
                        criteria: [
                            { label: "NO", value: 1 },
                            { label: "Yes", value: 0.7 }
                        ]
                    },

                    dd_type: {
                        label: "DD TYPE",
                        max: 1,
                        criteria: [
                            { label: "BALANCE BASED DD", value: 1 },
                            { label: "EQUITY BASED DAILY or MAX", value: 0.5 }
                        ]
                    }
                }
            }
        ]
    },
    {
        id: "payout_payment_experience",
        name: "Payout/Payment Experience",
        categories: [
            // ---------------------------------------------------------
            // 1. Payout Reliability
            // ---------------------------------------------------------
            {
                id: "payout_reliability",
                name: "Payout Reliability",
                factors: {
                    no_payout_denial_policy: {
                        label: "No Payout Denial policy",
                        max: 1,
                        criteria: [
                            { label: "1 point", value: 1 },
                            { label: "No", value: 0.7 }
                        ]
                    },

                    payout_cycle: {
                        label: "payout cycle ( from 1st Payout)",
                        max: 1,
                        criteria: [
                            { label: "Biweekly or Weekly", value: 1 },
                            { label: "15+ days", value: 0.7 }
                        ]
                    },

                    single_highest_payout: {
                        label: "Single Highest Payout",
                        max: 1,
                        criteria: [
                            { label: "10k+ ", value: 1 },
                            { label: "5k +", value: 0.8 },
                            { label: "Under 5k", value: 0.5 }
                        ]
                    }
                }
            },

            // ---------------------------------------------------------
            // 2. Payout Behavior
            // ---------------------------------------------------------
            {
                id: "payout_behavior",
                name: "Payout Behavior",
                factors: {
                    payout_time: {
                        label: "Payout Time",
                        max: 2,
                        criteria: [
                            { label: "24H policy - 1P ( After Aproval)", value: 1 },
                            { label: "Same Day or Within 24h - 2 ( After Request)", value: 2 },
                            { label: "No Policy", value: 0.5 }
                        ]
                    },

                    flexible_payout_methods: {
                        label: "Flexible payout methods",
                        max: 1,
                        criteria: [
                            { label: "Rise,Crypto,Bank", value: 1 },
                            { label: "Only Rise", value: 0.7 },
                            { label: "Only Crypto", value: 0.9 }
                        ]
                    },

                    payout_denials: {
                        label: "Payout denials",
                        max: 1,
                        criteria: [
                            { label: "No denials", value: 1 },
                            { label: "Few Reports", value: 0.5 }
                        ]
                    }
                }
            },

            // ---------------------------------------------------------
            // 3. Payout/Payment Structure
            // ---------------------------------------------------------
            {
                id: "payout_payment_structure",
                name: "Payout/Payment Structure",
                factors: {
                    fair_profit_split: {
                        label: "Fair profit split",
                        max: 1,
                        criteria: [
                            { label: "80 & Above", value: 1 },
                            { label: "60+", value: 0.8 },
                            { label: "u60", value: 0.5 }
                        ]
                    },

                    flexible_payment_methods: {
                        label: "Flexible Payment methods",
                        max: 1,
                        criteria: [
                            { label: "Cards,Crypto,UPI& More", value: 1 },
                            { label: "Only Cards", value: 0.6 },
                            { label: "Only Crypto/Cards", value: 0.8 }
                        ]
                    },

                    reasonable_minimum_payout_requiremnts: {
                        label: "Reasonable minimum payout Requiremnts",
                        max: 1,
                        criteria: [
                            { label: "No Req", value: 1 },
                            { label: "Consistancy or 0.5x3 Day mini", value: 0.7 }
                        ]
                    }
                }
            }
        ]
    }
];
const sampleFirms = [
    {
        id: 1,
        name: "Demo Prop Firm",
        scores: initialScoresData.scores
    },
    {
        id: 2,
        name: "Alpha Trading Firm",
        scores: {
            credibility: {
                physical_legal_presence: {
                    registered_company: 1,
                    physical_office: 1,
                    dashboard_friendlyness: 1,
                },
                public_identity_transparency: {
                    public_ceo_founder: 1,
                    support_quality: 0.8,
                    terms_clarity: 1,
                    brocker_backed: 0.3,
                },
                social_community_presence: {
                    active_social: 0.5,
                    transparent_comm: 0.5,
                },
                trust_signals_history: {
                    verified_payouts: 0.5,
                    lifetime_payouts: 1.2,
                    no_controversies: 0.5,
                    consistent_ops: 0.5,
                }
            },
            trading_experience: {
                trading_conditions: {
                    fair_spreads: 1,
                    fair_commissions: 1,
                    acceptable_slippage: 1,
                    multiple_trading_platforms: 1,
                },
                trading_freedom: {
                    profit_targets: 1,
                    consistancy_rule: 1,
                    news_trading: 1,
                },
                rules_fairness: {
                    lavrage_margin_rule: 1,
                    no_hidden_restrictions_stratgy: 1,
                    dd_type: 1,
                }
            },
            payout_payment_experience: {
                payout_reliability: {
                    no_payout_denial_policy: 1,
                    payout_cycle: 1,
                    single_highest_payout: 1,
                },
                payout_behavior: {
                    payout_time: 2,
                    flexible_payout_methods: 1,
                    payout_denials: 1,
                },
                payout_payment_structure: {
                    fair_profit_split: 1,
                    flexible_payment_methods: 1,
                    reasonable_minimum_payout_requiremnts: 1,
                }
            }
        }
    },
    {
        id: 3,
        name: "Beta Capital Firm",
        scores: {
            credibility: {
                physical_legal_presence: {
                    registered_company: 0,
                    physical_office: 0,
                    dashboard_friendlyness: 0.5,
                },
                public_identity_transparency: {
                    public_ceo_founder: 0,
                    support_quality: 0.5,
                    terms_clarity: 0.7,
                    brocker_backed: 0,
                },
                social_community_presence: {
                    active_social: 0.25,
                    transparent_comm: 0.1,
                },
                trust_signals_history: {
                    verified_payouts: 0.3,
                    lifetime_payouts: 0.5,
                    no_controversies: 0.25,
                    consistent_ops: 0.2,
                }
            },
            trading_experience: {
                trading_conditions: {
                    fair_spreads: 0.7,
                    fair_commissions: 0.7,
                    acceptable_slippage: 0.7,
                    multiple_trading_platforms: 0.8,
                },
                trading_freedom: {
                    profit_targets: 0.7,
                    consistancy_rule: 0.7,
                    news_trading: 0.5,
                },
                rules_fairness: {
                    lavrage_margin_rule: 0.5,
                    no_hidden_restrictions_stratgy: 0.7,
                    dd_type: 0.5,
                }
            },
            payout_payment_experience: {
                payout_reliability: {
                    no_payout_denial_policy: 0.7,
                    payout_cycle: 0.7,
                    single_highest_payout: 0.5,
                },
                payout_behavior: {
                    payout_time: 0.5,
                    flexible_payout_methods: 0.7,
                    payout_denials: 0.5,
                },
                payout_payment_structure: {
                    fair_profit_split: 0.8,
                    flexible_payment_methods: 0.8,
                    reasonable_minimum_payout_requiremnts: 0.7,
                }
            }
        }
    }
]
