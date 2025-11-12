/* eslint-disable */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Edit, Search, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pagination } from "@/components/common/Pagination";
import Image from "next/image";

interface Firm {
  _id: string;
  firmDetails: {
    name: string;
    registrationNumber: string;
    jurisdiction: string;
    yearFounded: string;
    status: string;
    image?: {
      url?: string | "";
    };
    challenges?: any[];
  };
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function FirmsList() {
  const router = useRouter();
  const [firms, setFirms] = useState<Firm[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const fetchFirms = async (page: number = 1) => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/admin/firm?page=${page}&limit=${pagination.limit}`,
        {
          cache: "no-store",
        }
      );
      if (!res.ok) throw new Error("Failed to fetch firms");
      const data = await res.json();
      console.log("🚀 ~ fetchFirms ~ data:", data);
      setFirms(data?.data || []);
      setPagination(data?.pagination || pagination);
    } catch (error) {
      console.error("Error fetching firms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFirms(pagination.page);
  }, [pagination.page]);

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  // Optional search filter (client side)
  const filteredFirms = firms.filter((firm) =>
    [
      firm.firmDetails.name,
      firm.firmDetails.jurisdiction,
      firm.firmDetails.registrationNumber,
    ].some((field) => field?.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Firm Management"
        description={`Search, filter, and manage all forex firms on the platform. ${pagination.total} firms found.`}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => fetchFirms(pagination.page)}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button asChild>
              <Link href="/admin/firm-management/firm-add">Add New Firm</Link>
            </Button>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Firm List</CardTitle>
          <CardDescription>
            View and manage all forex trading firms
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Search by firm name, jurisdiction, or registration number..."
                className="max-w-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button>
                <Search className="h-4 w-4 mr-1" />
                Search
              </Button>
            </div>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Order" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Newest</SelectItem>
                  <SelectItem value="asc">Oldest</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Loading / Empty / Table */}
          {loading ? (
            <div className="text-center py-10 text-muted-foreground">
              Loading firms...
            </div>
          ) : filteredFirms.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No firms found.
            </div>
          ) : (
            <>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                    <tr>
                      <th className="p-3 text-left">Image</th>
                      <th className="p-3 text-left">Firm</th>
                      <th className="p-3 text-left">Jurisdiction</th>
                      <th className="p-3 text-left">Founded</th>
                      <th className="p-3 text-left">Status</th>
                      <th className="p-3 text-left">Published</th>
                      <th className="p-3 text-left">Total Challenges</th>
                      <th className="p-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredFirms.map((firm) => (
                      <tr
                        key={firm._id}
                        className="hover:bg-primary/10 cursor-pointer transition-all duration-100"
                        onClick={() =>
                          router.push(
                            `/admin/firm-management/${firm._id}/firm-detail`
                          )
                        }
                      >
                        <td className="p-3">
                          <Image
                            src={
                              firm?.firmDetails?.image?.url ||
                              "/default-firm.png"
                            } 
                            alt={firm?.firmDetails?.name || "Firm logo"}
                            height={25}
                            width={25}
                          />
                        </td>
                        <td className="p-3">
                          <div className="flex items-center space-x-3">
                            <div>
                              <div className="font-medium capitalize">
                                {firm.firmDetails.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Reg: {firm.firmDetails.registrationNumber}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          {firm.firmDetails.jurisdiction || "N/A"}
                        </td>
                        <td className="p-3">
                          {firm.firmDetails.yearFounded || "N/A"}
                        </td>
                        <td className="p-3">
                          {firm.firmDetails.status ? (
                            <Badge variant="outline">
                              {firm.firmDetails.status.charAt(0).toUpperCase() +
                                firm.firmDetails.status.slice(1)}
                            </Badge>
                          ) : (
                            "N/A"
                          )}
                        </td>
                        <td className="p-3">
                          {firm.firmDetails.yearFounded || "N/A"}
                        </td>
                        <td className="p-3 text-muted-foreground">
                          {firm.firmDetails.challenges?.length || 0}
                        </td>
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                router.push(
                                  `/admin/firm-management/${firm._id}/edit-firm`
                                );
                              }}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Component */}
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                totalItems={pagination.total}
                itemsPerPage={pagination.limit}
                onPageChange={handlePageChange}
                className="mt-6"
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
