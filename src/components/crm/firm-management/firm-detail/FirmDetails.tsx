/* eslint-disable */
// @ts-nocheck
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Building2,
  Star,
  MessageSquare,
  Shield,
  Eye,
  TrendingUp,
  CreditCard,
  Edit,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface FirmData {
  _id: string;
  firmDetails: any;
  leadership: any;
  ratings: any;
  socialLinks: any;
  support: any;
  compliance: any;
  transparency: any;
  trading: any;
  payments: any;
  programs: any;
}

function FirmDetails({ id }: { id: string }) {
  const router = useRouter();
  const [firmData, setFirmData] = useState<FirmData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFirmData = async () => {
      try {
        const response = await fetch(`/api/admin/firm/${id}`);
        const data = await response.json();
        setFirmData(data?.data);
      } catch (error) {
        console.error("Error fetching firm data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFirmData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!firmData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-destructive">Failed to load firm data</div>
      </div>
    );
  }

  const handleEdit = (program: any) => {
    console.log("Edit program:", program);
    // Open edit modal or navigate to edit page
     router.push(`/admin/firm-management/${id}/edit-program/${program._id}`);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-primary">
              {firmData.firmDetails.name}
            </h1>
            <p className="text-muted-foreground">
              {firmData.firmDetails.legalEntityName}
            </p>
          </div>
        </div>
        <Button
          className="gap-2"
          onClick={() =>
            router.push(`/admin/firm-management/${id}/add-program`)
          }
        >
          <Plus className="h-4 w-4" />
          Add Challenge
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="firm" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9 gap-2">
          <TabsTrigger value="firm">Firm Details</TabsTrigger>
          {/* <TabsTrigger value="leadership">Leadership</TabsTrigger> */}
          <TabsTrigger value="ratings">Ratings</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="transparency">Transparency</TabsTrigger>
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="payments">Payments & Social</TabsTrigger>
          <TabsTrigger value="program">Program</TabsTrigger>
        </TabsList>

        {/* Firm Details Tab */}
        <TabsContent value="firm">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Firm Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Legal Entity Name
                  </label>
                  <p className="text-base">
                    {firmData.firmDetails.legalEntityName}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Registration Number
                  </label>
                  <p className="text-base">
                    {firmData.firmDetails.registrationNumber}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    License Number
                  </label>
                  <p className="text-base">
                    {firmData.firmDetails.licenseNumber}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Regulator
                  </label>
                  <p className="text-base">{firmData.firmDetails.regulator}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Jurisdiction
                  </label>
                  <p className="text-base">
                    {firmData.firmDetails.jurisdiction}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Year Founded
                  </label>
                  <p className="text-base">
                    {firmData.firmDetails.yearFounded}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Status
                  </label>
                  <Badge
                    variant={
                      firmData.firmDetails.status === "Active"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {firmData.firmDetails.status}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    HQ Address
                  </label>
                  <p className="text-base">{firmData.firmDetails.hqAddress}</p>
                </div>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Languages Supported
                </label>
                <div className="flex gap-2 mt-2">
                  {firmData.firmDetails.languagesSupported.map(
                    (lang: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {lang}
                      </Badge>
                    )
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Brokers
                </label>
                <div className="flex gap-2 mt-2">
                  {firmData.firmDetails.brokers.map(
                    (broker: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {broker}
                      </Badge>
                    )
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Liquidity Providers
                </label>
                <div className="flex gap-2 mt-2">
                  {firmData.firmDetails.liquidityProviders.map(
                    (provider: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {provider}
                      </Badge>
                    )
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <Label>Company Description</Label>
                <p className="text-base text-muted-foreground">
                  {firmData.firmDetails.companyDescription}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Official Website
                </label>
                <a
                  href={firmData.firmDetails.officialWebsite}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline block mt-1"
                >
                  {firmData.firmDetails.officialWebsite}
                </a>
              </div>
              <Separator />
              <Label className="text-2xl">Leadership</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {firmData.leadership.leadership.map((leader: any) => (
                  <Card key={leader._id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{leader.name}</CardTitle>
                      <CardDescription>{leader.role}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          Verified:
                        </span>
                        <Badge
                          variant={leader.verified ? "default" : "secondary"}
                        >
                          {leader.verified ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-2">
                          Social Links:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(leader.links).map(
                            ([platform, link]: [string, any]) => (
                              <a
                                key={platform}
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Badge
                                  variant="outline"
                                  className="cursor-pointer hover:bg-accent"
                                >
                                  {platform}
                                </Badge>
                              </a>
                            )
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ratings Tab */}
        <TabsContent value="ratings">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Ratings & Reviews
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-accent rounded-lg">
                <label className="text-sm font-medium text-muted-foreground">
                  TrustPilot Rating
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-3xl font-bold">
                    {firmData.ratings.trustPilotRating}
                  </span>
                  <span className="text-muted-foreground">/ 5.0</span>
                </div>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-3 block">
                  Other Ratings
                </label>
                <div className="space-y-3">
                  {firmData.ratings.otherRatings.map((rating: any) => (
                    <div
                      key={rating._id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <span className="font-medium">{rating.platform}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold">
                          {rating.rating}
                        </span>
                        <span className="text-muted-foreground">/ 5</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Support Tab */}
        <TabsContent value="support">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Customer Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Average Resolution Time
                  </label>
                  <p className="text-2xl font-bold">
                    {firmData.support.avgResolutionTime} hours
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Support Hours
                  </label>
                  <p className="text-2xl font-bold">
                    {firmData.support.supportHours}
                  </p>
                </div>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-3 block">
                  Support Channels
                </label>
                <div className="space-y-3">
                  {firmData.support.channels.map((channel: any) => (
                    <Card key={channel._id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium capitalize">
                            {channel.type}
                          </span>
                          <div className="flex gap-2">
                            {channel.preferred && <Badge>Preferred</Badge>}
                            <Badge
                              variant={
                                channel.status === "active"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {channel.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Response Time: {channel.responseTime} hours
                        </p>
                        <a
                          href={channel.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-sm"
                        >
                          {channel.link}
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Compliance & Regulations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  KYC Provider
                </label>
                <p className="text-base mt-1">
                  {firmData.compliance.kycProvider}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  KYC Requirements
                </label>
                <div className="flex gap-2 mt-2">
                  {firmData.compliance.kycRequirements.map(
                    (req: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {req}
                      </Badge>
                    )
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Restricted Countries
                </label>
                <div className="flex gap-2 mt-2">
                  {firmData.compliance.restrictedCountries.map(
                    (country: string, index: number) => (
                      <Badge key={index} variant="destructive">
                        {country}
                      </Badge>
                    )
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Regulations Complied
                </label>
                <div className="flex gap-2 mt-2">
                  {firmData.compliance.regulationsComplied.map(
                    (reg: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {reg}
                      </Badge>
                    )
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  AML Policy
                </label>
                <a
                  href={firmData.compliance.amlLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline block mt-1"
                >
                  {firmData.compliance.amlLink}
                </a>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transparency Tab */}
        <TabsContent value="transparency">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Transparency Metrics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-accent rounded-lg">
                <label className="text-sm font-medium text-muted-foreground">
                  Transparency Score
                </label>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-3xl font-bold">
                    {firmData.transparency.transparencyScore}
                  </span>
                  <span className="text-muted-foreground">/ 5</span>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium">CEO Public</span>
                  <Badge
                    variant={
                      firmData.transparency.ceoPublic ? "default" : "secondary"
                    }
                  >
                    {firmData.transparency.ceoPublic ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium">Office Verified</span>
                  <Badge
                    variant={
                      firmData.transparency.officeVerified
                        ? "default"
                        : "secondary"
                    }
                  >
                    {firmData.transparency.officeVerified ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium">Terms Public & Updated</span>
                  <Badge
                    variant={
                      firmData.transparency.termsPublicUpdated
                        ? "default"
                        : "secondary"
                    }
                  >
                    {firmData.transparency.termsPublicUpdated ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium">Payout Proof Public</span>
                  <Badge
                    variant={
                      firmData.transparency.payoutProofPublic
                        ? "default"
                        : "secondary"
                    }
                  >
                    {firmData.transparency.payoutProofPublic ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="font-medium">Third Party Audit</span>
                  <Badge
                    variant={
                      firmData.transparency.thirdPartyAudit
                        ? "default"
                        : "secondary"
                    }
                  >
                    {firmData.transparency.thirdPartyAudit ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
              {firmData.transparency.notes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Notes
                  </label>
                  <p className="text-base mt-2">
                    {firmData.transparency.notes}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trading Tab */}
        <TabsContent value="trading">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Trading Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-3 block">
                  Leverage Matrix
                </label>
                <div className="space-y-4">
                  {Object.entries(firmData.trading.leverageMatrix).map(
                    ([asset, leverage]: [string, any]) => (
                      <Card key={asset}>
                        <CardHeader>
                          <CardTitle className="text-base">{asset}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="text-xs text-muted-foreground">
                                Instant
                              </label>
                              <p className="font-medium">{leverage.Instant}</p>
                            </div>
                            <div>
                              <label className="text-xs text-muted-foreground">
                                1-Step
                              </label>
                              <p className="font-medium">
                                {leverage["1-Step"]}
                              </p>
                            </div>
                            <div>
                              <label className="text-xs text-muted-foreground">
                                2-Step
                              </label>
                              <p className="font-medium">
                                {leverage["2-Step"]}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  )}
                </div>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-3 block">
                  Commissions
                </label>
                <div className="space-y-2">
                  {Object.entries(firmData.trading.commissions).map(
                    ([type, commission]: [string, any]) => (
                      <div key={type} className="p-3 bg-muted rounded-lg">
                        <span className="font-medium">{type}:</span>
                        <p className="text-sm mt-1">{commission}</p>
                      </div>
                    )
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Base Currency
                  </label>
                  <p className="text-2xl font-bold">
                    {firmData.payments.baseCurrency}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Min Withdrawal
                  </label>
                  <p className="text-2xl font-bold">
                    ${firmData.payments.minWithdrawal}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Processing Time
                  </label>
                  <p className="text-2xl font-bold">
                    {firmData.payments.processingTime} days
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Payout Schedule
                  </label>
                  <p className="text-2xl font-bold capitalize">
                    {firmData.payments.payoutSchedule}
                  </p>
                </div>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Payment Methods
                </label>
                <div className="flex gap-2 mt-2">
                  {firmData.payments.methods.map(
                    (method: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {method}
                      </Badge>
                    )
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Payout Methods
                </label>
                <div className="flex gap-2 mt-2">
                  {firmData.payments.payoutMethods.map(
                    (method: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {method}
                      </Badge>
                    )
                  )}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">
                  Refund Policy
                </label>
                <p className="text-base mt-2">
                  {firmData.payments.refundPolicy}
                </p>
              </div>
              <Separator />
              <p className="text-xl">Social Media Links</p>
              <div className="space-y-3">
                {Object.entries(firmData.socialLinks.socialLinks).map(
                  ([platform, link]: [string, any]) => (
                    <div
                      key={platform}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <span className="font-medium capitalize">{platform}</span>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Visit
                      </a>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="program">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Program{" "}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <Table>
                <TableCaption>List of all challenge programs.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Evaluation Phases</TableHead>
                    <TableHead>Account Sizes</TableHead>
                    <TableHead>Profit Split</TableHead>
                    <TableHead>Leverage</TableHead>
                    <TableHead>Features</TableHead>
                    <TableHead>Payout</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {firmData?.programs.map((program:any) => (
                    <TableRow key={program._id}>
                      <TableCell>{program.type}</TableCell>
                      <TableCell className="font-medium">
                        {program.name}
                      </TableCell>
                      <TableCell>{program.evaluationPhases}</TableCell>
                      <TableCell>
                        {program.accountSizes.map((a: any) => (
                          <div key={a._id}>
                            ${a.size.toLocaleString()} – ${a.price}
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>{program.profitSplit}%</TableCell>
                      <TableCell>{program.leverage}</TableCell>
                      <TableCell className="max-w-[180px]">
                        <div className="flex flex-wrap gap-1">
                          {program.stopLossRequired && <Badge>Stop Loss</Badge>}
                          {program.eaAllowed && <Badge>EA</Badge>}
                          {program.weekendHolding && <Badge>Weekend</Badge>}
                          {program.overnightHolding && <Badge>Overnight</Badge>}
                          {program.newsTrading && (
                            <Badge variant="destructive">No News</Badge>
                          )}
                          {program.copyTrading && <Badge>Copy</Badge>}
                        </div>
                      </TableCell>
                      <TableCell>
                        {program.payoutFrequency.map((p: any) => (
                          <div key={p._id}>
                            {p.label} ({p.percentage})
                          </div>
                        ))}
                      </TableCell>
                      <TableCell>
                        {new Date(program.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleEdit(program)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default FirmDetails;
