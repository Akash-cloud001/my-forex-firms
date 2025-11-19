/* eslint-disable */
// @ts-nocheck
"use client";
import React, { useState, useEffect, useMemo } from "react";
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
  Trash2,
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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";
import FirmDetailsTab from "./FirmDetailsTab";
import RatingTab from "./RatingTab";
import ComplianceTab from "./ComplianceTab";
import ProgramTab from "./ProgramTab";
import PaymentTab from "./PaymentTab";
import TransparencyTab from "./TransparencyTab";
import SupportTab from "./SupportTab";

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
  firmRules: any;
}

function FirmDetails({ id }: { id: string }) {
  const router = useRouter();
  const [firmData, setFirmData] = useState<FirmData | null>(null);
  const [loading, setLoading] = useState(true);
  const [openDrawerId, setOpenDrawerId] = useState<string | null>(null);

  const groupedCategories = useMemo(() => {
    const grouped = new Map<string, any>();

    firmData?.firmRules?.forEach((rule) => {
      rule.categories?.forEach((cat) => {
        const key = cat.name.trim();
        if (!key) return;

        if (!grouped.has(key)) {
          grouped.set(key, {
            _id: cat._id,
            name: cat.name,
            createdAt: cat.createdAt,
            questions: [...cat.questions],
          });
        } else {
          const existing = grouped.get(key);
          existing.questions.push(...cat.questions);
          if (new Date(cat.createdAt) < new Date(existing.createdAt)) {
            existing.createdAt = cat.createdAt;
            existing._id = cat._id;
          }
        }
      });
    });

    return Array.from(grouped.values()).sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [firmData?.firmRules]);

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
        <div className="gap-3 flex">
          <Button
            className="gap-2"
            onClick={() =>
              router.push(`/admin/firm-management/${id}/firm-rule`)
            }
          >
            <Plus className="h-4 w-4" />
            Add Rules
          </Button>
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
      </div>

      {/* Tabs */}
      <Tabs defaultValue="firm" className="space-y-4">
        <TabsList className="grid grid-cols-4 lg:grid-cols-9 gap-2">
          <TabsTrigger value="firm">Firm Details</TabsTrigger>
          {/* <TabsTrigger value="leadership">Leadership</TabsTrigger> */}
          <TabsTrigger value="ratings">Ratings</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="transparency">Transparency</TabsTrigger>
          <TabsTrigger value="trading">Trading</TabsTrigger>
          <TabsTrigger value="payments">Payments & Social</TabsTrigger>
          <TabsTrigger value="program">Program</TabsTrigger>
          <TabsTrigger value="firmRule">Firm rule</TabsTrigger>
        </TabsList>

        {/* Firm Details Tab */}
        <FirmDetailsTab firmData={firmData} />

        {/* Ratings Tab */}
        <RatingTab firmData={firmData} />

        {/* Support Tab */}

        <SupportTab firmData={firmData} />
        {/* Compliance Tab */}
        <ComplianceTab firmData={firmData} />

        {/* Transparency Tab */}
        <TransparencyTab firmData={firmData} />

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
                            <div>
                              <label className="text-xs text-muted-foreground">
                                3-Step
                              </label>
                              <p className="font-medium">
                                {leverage["3-Step"]}
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
        <PaymentTab firmData={firmData} />

        {/* Program Tab */}
        <ProgramTab firmData={firmData} handleEdit={handleEdit} />

        {/* Firm Rule  */}
        <TabsContent value="firmRule">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Firm Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-5 mx-auto">
                {groupedCategories.map((category,idx:number) => (
                  <Sheet
                    key={category._id}
                    open={openDrawerId === category._id}
                    onOpenChange={(open) =>
                      setOpenDrawerId(open ? category._id : null)
                    }
                  >
                    <SheetTrigger asChild>
                      <div className={`cursor-pointer border-muted-foreground/40  ${idx !== groupedCategories.length - 1 ? "border-b pb-4" : ""}`}>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex-1 ">
                            <h3 className="font-semibold text-base text-foreground capitalize">
                              {category.name}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-0.5 capitalize">
                              {category.questions.length}{" "}
                              {category.questions.length === 1
                                ? "question"
                                : "questions"}
                              {" • "}
                              Created{" "}
                              {new Date(
                                category.createdAt
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle edit action
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full max-w-4xl overflow-x-hidden overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle className="text-2xl font-bold text-foreground capitalize">{category.name}</SheetTitle>
                        <SheetDescription>
                          {category.questions.length}{" "}
                          {category.questions.length === 1
                            ? "question"
                            : "questions"}
                          {" • "}
                          Created{" "}
                          {new Date(category.createdAt).toLocaleDateString()}
                        </SheetDescription>
                      </SheetHeader>
                      <div className="space-y-4 w-full">
                        {category.questions.map((q, idx) => (
                          <div
                            key={q._id}
                            className={`pb-4 pl-4 ${
                              idx !== category.questions.length - 1
                                ? "mb-4"
                                : ""
                            }`}
                          >
                            <div className="flex justify-between items-start gap-4">
                              <div className="flex-1 space-y-2 min-w-0">
                                <div>
                                  <p className="text-sm font-medium mt-1 text-foreground whitespace-normal wrap-break-word">
                                  Q{idx + 1}: {q.question}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground mt-1 whitespace-normal wrap-break-word">
                                  {q.answer}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2 shrink-0">
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </SheetContent>
                  </Sheet>
                ))}
              </div>

              {groupedCategories.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No firm rules found
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default FirmDetails;
