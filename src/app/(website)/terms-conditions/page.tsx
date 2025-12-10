import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export const metadata = {
  title: 'Terms & Conditions | MyForexFirms.com',
  description: 'Terms & Conditions for MyForexFirms.com - Read our terms of service and usage policies.',
};

export default function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto pt-24 pb-12 px-4">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              Terms & Conditions
            </h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            Effective Date: 10th December 2025
          </p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="pt-6 sm:pt-8 pb-8 sm:pb-12 px-4 sm:px-6 lg:px-8">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              {/* Introduction */}
              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                  1. Introduction
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Welcome to MyForexFirms.com! By using our website, you agree to these Terms & Conditions. If you do not agree, please stop using the site.
                </p>
              </section>

              <Separator className="my-6 sm:my-8" />

              {/* What We Do */}
              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                  2. What We Do
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  MyForexFirms.com is an independent platform that provides prop firm ratings, the TriMetric Rating System, the Prop Trust Index (PTI), verified complaint processing, firm comparisons, and industry updates. We are not a prop firm, broker, trading platform, or financial advisor.
                </p>
              </section>

              <Separator className="my-6 sm:my-8" />

              {/* Who Can Use Our Platform */}
              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                  3. Who Can Use Our Platform
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  To use the site, you must be at least 18 years old, provide accurate information, and obey all laws. Do not impersonate others or misuse the platform.
                </p>
              </section>

              <Separator className="my-6 sm:my-8" />

              {/* Using Our Website */}
              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                  4. Using Our Website
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  You may browse ratings, compare firms, and submit complaints. You may not submit fake complaints, manipulate ratings, spam, hack, or misuse the platform in any harmful way.
                </p>
              </section>

              <Separator className="my-6 sm:my-8" />

              {/* Information Accuracy */}
              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                  5. Information Accuracy
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  We try to keep information accurate, but prop firm rules and policies change frequently. We do not guarantee that all data is always current or complete.
                </p>
              </section>

              <Separator className="my-6 sm:my-8" />

              {/* Ratings & Indexes */}
              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                  6. Ratings & Indexes
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Our TriMetric Rating System and Prop Trust Index (PTI) are independent evaluation tools based on public data, verified complaints, transparency factors, and user experience metrics. These are not financial advice.
                </p>
              </section>

              <Separator className="my-6 sm:my-8" />

              {/* Submitting Complaints */}
              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                  7. Submitting Complaints
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Complaint submissions must be truthful and supported by evidence. Your identity remains private. We may reject fake, abusive, or unsupported complaints.
                </p>
              </section>

              <Separator className="my-6 sm:my-8" />

              {/* Prop Firm Submissions */}
              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                  8. Prop Firm Submissions
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Prop firms submitting information must ensure it is accurate. We may verify details or request additional documentation. False submissions may affect ratings.
                </p>
              </section>

              <Separator className="my-6 sm:my-8" />

              {/* No Financial Advice */}
              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                  9. No Financial Advice
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  MyForexFirms.com does not offer investment or trading advice. Trading involves risk. You are responsible for your own decisions.
                </p>
              </section>

              <Separator className="my-6 sm:my-8" />

              {/* Our Responsibility */}
              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                  10. Our Responsibility
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  We are not liable for trading losses, payout issues, firm-related problems, or actions taken based on information on our site. Use of the platform is at your own risk.
                </p>
              </section>

              <Separator className="my-6 sm:my-8" />

              {/* Intellectual Property */}
              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                  11. Intellectual Property
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  All content—including ratings, research, PTI, TriMetric, design, logos, and data—is owned by MyForexFirms.com. You may not copy or reuse content without permission.
                </p>
              </section>

              <Separator className="my-6 sm:my-8" />

              {/* External Links */}
              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                  12. External Links
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  We may link to external websites and prop firms. We are not responsible for their content, actions, or privacy policies.
                </p>
              </section>

              <Separator className="my-6 sm:my-8" />

              {/* Account Removal */}
              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                  13. Account Removal
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  We may suspend or remove accounts that violate rules, submit false information, manipulate the system, or harm the platform.
                </p>
              </section>

              <Separator className="my-6 sm:my-8" />

              {/* Changes to These Terms */}
              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                  14. Changes to These Terms
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  We may modify these Terms at any time. Continued use of the website means you accept the updated Terms.
                </p>
              </section>

              <Separator className="my-6 sm:my-8" />

              {/* Contact Us */}
              <section className="mb-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                  15. Contact Us
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  For any questions or concerns, please contact us at{' '}
                  <a 
                    href="mailto:support@myforexfirms.com" 
                    className="text-primary hover:underline font-medium"
                  >
                    support@myforexfirms.com
                  </a>
                  {' '}or visit{' '}
                  <a 
                    href="https://myforexfirms.com" 
                    className="text-primary hover:underline font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    myforexfirms.com
                  </a>.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
