import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Target, Shield, Eye, TrendingUp, Users, CheckCircle2, Info, Lightbulb, FileText, BarChart3, Heart, Lock, Globe2 } from 'lucide-react';

export const metadata = {
  title: 'About Us | MyForexFirms.com',
  description: 'Learn about MyForexFirms.com - Our mission, vision, values, and commitment to transparency in the prop trading industry.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto pt-24 pb-12 px-4">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              About Us — MyForexFirms
            </h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            Independent Prop Trading Intelligence Platform
          </p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="pt-6 sm:pt-8 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              {/* Introduction */}
              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Introduction
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                  MyForexFirms is an independent Prop Trading Intelligence platform created to bring clarity, structure, and accountability to the global prop firm industry. In a space where rules change often, payout consistency varies, and transparency is rare, we provide traders with data-backed insights they can trust.
                </p>
                <p className="text-sm sm:text-base text-foreground font-semibold leading-relaxed">
                  Our mission is simple: Give traders the truth — not opinions, not marketing, not hype.
                </p>
              </section>

              <Separator className="my-6 sm:my-8" />

              {/* Why We Built This */}
              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Why We Built This
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                  The prop firm industry grew fast, but reliable information didn&apos;t. Traders were left dealing with hidden conditions, inconsistent payouts, unclear rules, and biased review platforms.
                </p>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                  After years inside the industry — trading, analyzing conditions, working with firms, and supporting trader communities — we saw the need for a platform built for traders, not for affiliate revenue.
                </p>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  MyForexFirms was created to fix that. We deliver structured ratings, verified data, transparent scoring models, and evidence-based reporting. No paid reviews. No manipulation. The goal is clarity and accountability.
                </p>
              </section>

              <Separator className="my-6 sm:my-8" />

              {/* What We Do */}
              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  What We Do
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
                  MyForexFirms provides:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Card className="border-border bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                        <div>
                          <h3 className="text-base font-semibold text-foreground mb-2">TriMetric Rating System</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            a three‑pillar scoring framework analyzing operational fundamentals, trading conditions, and payout reliability.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                        <div>
                          <h3 className="text-base font-semibold text-foreground mb-2">Prop Trust Index (PTI)</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            a dynamic trustworthiness indicator based on verified complaints, transparency signals, and firm behavior.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                        <div>
                          <h3 className="text-base font-semibold text-foreground mb-2">Verified Complaint System</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            traders can submit evidence‑based issues which influence transparency scoring.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                        <div>
                          <h3 className="text-base font-semibold text-foreground mb-2">Prop Firm Database</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            a structured directory with challenge types, pricing, rules, leverage, platforms, payout systems, and trader insights.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                        <div>
                          <h3 className="text-base font-semibold text-foreground mb-2">Industry News & Insights</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            updates on firm changes, platform shifts, regulations, and major events.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                        <div>
                          <h3 className="text-base font-semibold text-foreground mb-2">Educational Content</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            clear explanations of prop firm rules, risks, trading conditions, and best practices.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <Separator className="my-6 sm:my-8" />

              {/* Mission & Vision */}
              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-6">
                  Mission & Vision
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-border bg-muted/30">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Target className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-bold text-foreground">Mission</h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        To empower traders with unbiased, transparent, and actionable information so they can make informed decisions in the prop trading space.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-border bg-muted/30">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <Eye className="h-5 w-5 text-primary" />
                        <h3 className="text-lg font-bold text-foreground">Vision</h3>
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        To become the global standard for prop firm transparency
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <Separator className="my-6 sm:my-8" />

              {/* Core Values */}
              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Our Core Values
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="border-border bg-muted/30">
                    <CardContent className="p-4 text-center">
                      <Shield className="h-6 w-6 text-primary mx-auto mb-3" />
                      <h3 className="text-base font-semibold text-foreground mb-2">Integrity</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Ratings are never influenced by money or partnerships.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-border bg-muted/30">
                    <CardContent className="p-4 text-center">
                      <CheckCircle2 className="h-6 w-6 text-primary mx-auto mb-3" />
                      <h3 className="text-base font-semibold text-foreground mb-2">Accuracy</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Every rating is supported by research and verification.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-border bg-muted/30">
                    <CardContent className="p-4 text-center">
                      <Eye className="h-6 w-6 text-primary mx-auto mb-3" />
                      <h3 className="text-base font-semibold text-foreground mb-2">Transparency</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Our methodology and scoring are public and fair.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-border bg-muted/30">
                    <CardContent className="p-4 text-center">
                      <TrendingUp className="h-6 w-6 text-primary mx-auto mb-3" />
                      <h3 className="text-base font-semibold text-foreground mb-2">Independence</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Affiliate links never affect ratings or PTI.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="border-border bg-muted/30 sm:col-span-2 lg:col-span-1">
                    <CardContent className="p-4 text-center">
                      <Users className="h-6 w-6 text-primary mx-auto mb-3" />
                      <h3 className="text-base font-semibold text-foreground mb-2">Trader‑First</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Every feature is built with trader protection in mind.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <Separator className="my-6 sm:my-8" />

              {/* Team */}
              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Team Behind MyForexFirms
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
                  The MFF team consists of:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-border bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                        <div>
                          <h3 className="text-base font-semibold text-foreground mb-2">Experienced Prop Traders</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            With real knowledge of challenges, funded accounts, and payout issues.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                        <div>
                          <h3 className="text-base font-semibold text-foreground mb-2">Industry Analysts</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            experts in liquidity conditions, spreads, platforms, and rule structures.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                        <div>
                          <h3 className="text-base font-semibold text-foreground mb-2">Compliance & Verification Contributors</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            specialists in data analysis, fraud detection, and evidence validation.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-border bg-muted/30">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0"></div>
                        <div>
                          <h3 className="text-base font-semibold text-foreground mb-2">Tech & Transparency Developers</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                            building the TriMetric system, PTI logic, and structured scoring engines.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mt-6">
                  We have experienced the industry from every angle as traders, partners, analysts, and community leaders giving us the clarity needed to evaluate firms honestly and accurately.
                </p>
              </section>

              <Separator className="my-6 sm:my-8" />

              {/* Independence */}
              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Independence
                </h2>
                <Card className="border-border bg-muted/30">
                  <CardContent className="p-6">
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
                      We maintain strict neutrality:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <p className="text-xs sm:text-sm text-muted-foreground">No paid reviews</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <p className="text-xs sm:text-sm text-muted-foreground">No rating manipulation</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <p className="text-xs sm:text-sm text-muted-foreground">No influence from affiliate earnings</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <p className="text-xs sm:text-sm text-muted-foreground">Evidence required for complaint impact</p>
                      </div>
                      <div className="flex items-start gap-3 sm:col-span-2">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <p className="text-xs sm:text-sm text-muted-foreground">Transparent penalty and scoring rules</p>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base text-foreground font-semibold mt-6">
                      Accountability is built into our core.
                    </p>
                  </CardContent>
                </Card>
              </section>

              <Separator className="my-6 sm:my-8" />

              {/* Commitment */}
              <section className="mb-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Globe2 className="h-5 w-5" />
                  Commitment to Traders
                </h2>
                <Card className="border-border bg-muted/30">
                  <CardContent className="p-6">
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
                      We promise to:
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <p className="text-xs sm:text-sm text-muted-foreground">Stay neutral</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <p className="text-xs sm:text-sm text-muted-foreground">Stay transparent</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <p className="text-xs sm:text-sm text-muted-foreground">Protect trader interests</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <p className="text-xs sm:text-sm text-muted-foreground">Keep improving scoring models</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <p className="text-xs sm:text-sm text-muted-foreground">Update firm ratings as new data emerges</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        <p className="text-xs sm:text-sm text-muted-foreground">Hold firms accountable using verified reporting</p>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base text-foreground font-semibold mt-8 text-center">
                      Your trust is the foundation of MyForexFirms.
                    </p>
                  </CardContent>
                </Card>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
