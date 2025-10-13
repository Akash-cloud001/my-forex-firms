'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import Image from "next/image";
import { 
  Building2, 
  Eye, 
  Edit, 
  CheckCircle,
  Clock,
  AlertCircle,
  Search,
  Download,
  Trash2,
  RefreshCw,
  TrendingUp,
  Image as ImageIcon
} from 'lucide-react';

interface Firm {
  _id: string;
  firmName: string;
  legalEntityName: string;
  registrationNumber: string;
  jurisdiction: string;
  yearFounded: number;
  headquartersAddress: string;
  ceoFounderName?: string;
  officialWebsite: string;
  status: 'active' | 'paused' | 'suspended' | 'closed';
  shortDescription: string;
  isDraft: boolean;
  isPublished: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastModifiedBy: string;
  version: number;
  logo?: {
    url?: string;
    filename?: string;
    originalName?: string;
  };
  socialMedia?: {
    supportEmail?: string;
    twitterUrl?: string;
    linkedinUrl?: string;
  };
  payoutFinancial?: {
    profitSplit: string;
    payoutMethods: string[];
  };
  challenges?: Array<{
    challengeName: string;
    challengeType: string;
    profitSplit: string;
  }>;
}

interface FirmsResponse {
  firms: Firm[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export default function FirmsList() {
  const [firms, setFirms] = useState<Firm[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedFirms, setSelectedFirms] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });

  const fetchFirms = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
        search,
        sortBy,
        sortOrder,
      });

      const response = await fetch(`/api/firms?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch firms');
      }
      
      const data: FirmsResponse = await response.json();
      setFirms(data.firms);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Error fetching firms:', err);
    } finally {
      setLoading(false);
    }
  }, [pagination.limit, search, sortBy, sortOrder]);

  useEffect(() => {
    fetchFirms();
  }, [fetchFirms, pagination.page]);

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchFirms();
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFirms(firms.map((firm) => firm._id));
    } else {
      setSelectedFirms([]);
    }
  };

  const handleSelectFirm = (firmId: string, checked: boolean) => {
    if (checked) {
      setSelectedFirms((prev) => [...prev, firmId]);
    } else {
      setSelectedFirms((prev) => prev.filter((id) => id !== firmId));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedFirms.length === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedFirms.length} firm(s)?`)) {
      return;
    }

    try {
      setDeleting(true);
      // Implement bulk delete API call here
      console.log('Bulk delete firms:', selectedFirms);
      setSelectedFirms([]);
      fetchFirms();
    } catch (error) {
      console.error('Error deleting firms:', error);
      alert('Failed to delete firms');
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      // Convert to CSV
      const csv = [
        ["Firm Name", "Legal Entity", "Jurisdiction", "Year Founded", "Status", "Published", "Created Date"].join(","),
        ...firms.map((firm) =>
          [
            firm.firmName,
            firm.legalEntityName,
            firm.jurisdiction,
            firm.yearFounded,
            firm.status,
            firm.isPublished ? "Yes" : "No",
            new Date(firm.createdAt).toISOString(),
          ].join(",")
        ),
      ].join("\n");

      // Download CSV
      const blob = new Blob([csv], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `firms-export-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting firms:", error);
      alert("Failed to export firms");
    } finally {
      setExporting(false);
    }
  };

  const getStatusBadge = (firm: Firm) => {
    if (firm.isPublished) {
      return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Published</Badge>;
    } else if (firm.isDraft) {
      return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Draft</Badge>;
    } else {
      return <Badge variant="outline" className="bg-gray-100 text-gray-800"><AlertCircle className="w-3 h-3 mr-1" />Unknown</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600';
      case 'paused': return 'text-yellow-600';
      case 'suspended': return 'text-orange-600';
      case 'closed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Firm Management"
        description={`Search, filter, and manage all forex firms on the platform. ${pagination.total} firms found.`}
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={exporting || firms.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => fetchFirms()}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button asChild>
              <Link href="/admin/firms/new">
                Add New Firm
              </Link>
            </Button>
          </div>
        }
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Firms</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pagination.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Published</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{firms.filter(f => f.isPublished).length}</div>
            <p className="text-xs text-muted-foreground mt-1">Live firms</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Drafts</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{firms.filter(f => f.isDraft).length}</div>
            <p className="text-xs text-muted-foreground mt-1">Pending review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{firms.filter(f => f.status === 'active').length}</div>
            <p className="text-xs text-muted-foreground mt-1">Currently active</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Firm List</CardTitle>
          <CardDescription>
            View and manage all forex trading firms
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Search by firm name, jurisdiction, or CEO..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="max-w-sm"
              />
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-1" />
                Search
              </Button>
            </div>

            <div className="flex gap-2">
              {/* <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Date Created</SelectItem>
                  <SelectItem value="firmName">Firm Name</SelectItem>
                  <SelectItem value="jurisdiction">Jurisdiction</SelectItem>
                  <SelectItem value="yearFounded">Year Founded</SelectItem>
                </SelectContent>
              </Select> */}

              <Select value={sortOrder} onValueChange={(val) => setSortOrder(val as "asc" | "desc")}>
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

          {/* Bulk Actions */}
          {selectedFirms.length > 0 && (
            <div className="flex items-center gap-4 mb-4 p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">
                {selectedFirms.length} selected
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                disabled={deleting}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete Selected
              </Button>
            </div>
          )}

          {/* Table */}
          <div className="relative overflow-x-auto">
            {loading ? (
              <div className="py-8 text-center text-muted-foreground">
                Loading firms...
              </div>
            ) : firms.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                <Building2 className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No firms found</h3>
                <p className="mb-4">Get started by creating your first firm.</p>
                <Button asChild>
                  <Link href="/admin/firms/new">
                    Create First Firm
                  </Link>
                </Button>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                  <tr>
                    <th className="p-3 text-left">
                      <Checkbox
                        checked={
                          selectedFirms.length === firms.length &&
                          firms.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="p-3 text-left">Firm</th>
                    <th className="p-3 text-left">
                      <div className="flex items-center space-x-1">
                        <span>Jurisdiction</span>
                      </div>
                    </th>
                    <th className="p-3 text-left">
                      <div className="flex items-center space-x-1">
                        <span>Founded</span>
                      </div>
                    </th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Published</th>
                    <th className="p-3 text-left">Created</th>
                    <th className="p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {firms.map((firm) => (
                    <tr key={firm._id} className="hover:bg-muted/30">
                      <td className="p-3">
                        <Checkbox
                          checked={selectedFirms.includes(firm._id)}
                          onCheckedChange={(checked) =>
                            handleSelectFirm(firm._id, checked as boolean)
                          }
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center overflow-hidden">
                            {firm.logo?.url ? (
                              <Image 
                                src={firm.logo.url} 
                                alt={firm.firmName}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{firm.firmName}</div>
                            <div className="text-xs text-muted-foreground">Reg: {firm.registrationNumber}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span>{firm.jurisdiction}</span>
                      </td>
                      <td className="p-3">
                        <span>{firm.yearFounded}</span>
                      </td>
                      <td className="p-3">
                        <Badge variant="outline" className={getStatusColor(firm.status)}>
                          {firm.status.charAt(0).toUpperCase() + firm.status.slice(1)}
                        </Badge>
                      </td>
                      <td className="p-3">
                        {getStatusBadge(firm)}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {formatDate(firm.createdAt)}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/firms/${firm._id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/firms/${firm._id}/edit`}>
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                {pagination.total} results
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
                  }
                  disabled={pagination.page <= 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === pagination.totalPages ||
                        Math.abs(page - pagination.page) <= 1
                    )
                    .map((page, idx, arr) => (
                      <>
                        {idx > 0 && arr[idx - 1] !== page - 1 && (
                          <span key={`ellipsis-${page}`} className="px-2">
                            ...
                          </span>
                        )}
                        <Button
                          key={page}
                          variant={pagination.page === page ? "default" : "outline"}
                          size="sm"
                          onClick={() =>
                            setPagination((prev) => ({ ...prev, page }))
                          }
                        >
                          {page}
                        </Button>
                      </>
                    ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                  }
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

