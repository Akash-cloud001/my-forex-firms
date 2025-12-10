import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export const metadata = {
  title: 'Privacy Policy | MyForexFirms.com',
  description: 'Privacy Policy for MyForexFirms.com - Learn how we collect, use, and protect your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto pt-24 pb-12 px-4">
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              Privacy Policy
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
                  Introduction
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                  Welcome to MyForexFirms.com (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;, or &quot;the Platform&quot;). We are committed to protecting your privacy and ensuring that your information is handled responsibly and transparently.
                </p>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-4">
                  We comply with GDPR, CCPA, UK Data Protection Act, Indian DPDP Act, and global privacy standards.
                </p>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  By using MyForexFirms.com, you agree to this Privacy Policy. If you do not agree, please discontinue use.
                </p>
              </section>

              <Separator className="my-6 sm:my-8" />

              {/* Who We Are */}
              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                  Who We Are
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  MyForexFirms.com is a Prop Trading Data based review Platform offering unbiased prop firm ratings, the TriMetric Rating System, the Prop Trust Index (PTI), and verified complaint processing.
                </p>
              </section>

              <Separator className="my-6 sm:my-8" />

              {/* Information We Collect */}
              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                  Information We Collect
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  We collect personal information you provide (emails, account data, complaint details) and non‑personal information automatically (device data, IP address, analytics, cookies).
                </p>
              </section>

              <Separator className="my-6 sm:my-8" />

              {/* How We Use Your Information */}
              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                  How We Use Your Information
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  We use your information to operate the Platform, improve functionality, verify complaints, update firm ratings, enhance user experience, and comply with legal obligations.
                </p>
              </section>

              <Separator className="my-6 sm:my-8" />

              {/* Complaint Data Confidentiality */}
              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                  Complaint Data Confidentiality
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Your identity is never made public. Complaint information is used only for verification and rating adjustments.
                </p>
              </section>

              <Separator className="my-6 sm:my-8" />

              {/* Legal Basis for Processing */}
              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                  Legal Basis for Processing
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  We process data under consent, contractual necessity, legitimate interests, and legal obligations.
                </p>
              </section>

              <Separator className="my-6 sm:my-8" />

              {/* Data Sharing */}
              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                  Data Sharing
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  We never sell data. We may share limited information with hosting partners, analytics tools, and legal authorities when required.
                </p>
              </section>

              <Separator className="my-6 sm:my-8" />

              {/* Data Retention */}
              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                  Data Retention
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-2">
                  Account data is kept until you request deletion. Complaint data is stored for 12–24 months. Analytics data may be retained longer in anonymized form.
                </p>
              </section>

              <Separator className="my-6 sm:my-8" />

              {/* Your Rights */}
              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                  Your Rights
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  You can request access, correction, deletion, restriction, or opt‑out of marketing. Contact{' '}
                  <a 
                    href="mailto:support@myforexfirms.com" 
                    className="text-primary hover:underline font-medium"
                  >
                    support@myforexfirms.com
                  </a>.
                </p>
              </section>

              <Separator className="my-6 sm:my-8" />

              {/* Data Security */}
              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                  Data Security
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  We use encryption, secure servers, access controls, and minimal data collection practices.
                </p>
              </section>

              <Separator className="my-6 sm:my-8" />

              {/* Third‑Party Links */}
              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                  Third‑Party Links
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  External sites linked from our Platform follow their own privacy policies.
                </p>
              </section>

              <Separator className="my-6 sm:my-8" />

              {/* Children's Privacy */}
              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                  Children&apos;s Privacy
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  The Platform is not intended for individuals under 18.
                </p>
              </section>

              <Separator className="my-6 sm:my-8" />

              {/* International Transfers */}
              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                  International Transfers
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Your data may be processed outside your country under privacy‑compliant safeguards.
                </p>
              </section>

              <Separator className="my-6 sm:my-8" />

              {/* Updates to This Policy */}
              <section className="mb-8 sm:mb-10">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                  Updates to This Policy
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  We may update this Privacy Policy as needed. Continued use of the Platform confirms acceptance of changes.
                </p>
              </section>

              <Separator className="my-6 sm:my-8" />

              {/* Contact Us */}
              <section className="mb-4">
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-4">
                  Contact Us
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  For privacy inquiries, please contact us at{' '}
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

