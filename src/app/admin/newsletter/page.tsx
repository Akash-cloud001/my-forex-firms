"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Users,
  TrendingUp,
  Calendar,
  Search,
  Download,
  Trash2,
  RefreshCw,
} from "lucide-react";

interface Subscription {
  _id: string;
  email: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

interface Stats {
  total: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  recentTrend: Array<{ date: string; count: number }>;
}

interface ApiResponse {
  success: boolean;
  data: {
    subscriptions: Subscription[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    stats: Stats;
  };
}

export default function AdminNewsletter() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    recentTrend: [],
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fetchSubscriptions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search,
        sortBy,
        sortOrder,
      });

      const response = await fetch(`/api/newsletter?${params}`);
      const data: ApiResponse = await response.json();

      if (data.success) {
        setSubscriptions(data.data.subscriptions);
        setPagination(data.data.pagination);
        setStats(data.data.stats);
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.limit, sortBy, sortOrder]);

  const handleSearch = () => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    fetchSubscriptions();
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEmails(subscriptions.map((sub) => sub.email));
    } else {
      setSelectedEmails([]);
    }
  };

  const handleSelectEmail = (email: string, checked: boolean) => {
    if (checked) {
      setSelectedEmails((prev) => [...prev, email]);
    } else {
      setSelectedEmails((prev) => prev.filter((e) => e !== email));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedEmails.length === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedEmails.length} subscription(s)?`)) {
      return;
    }

    try {
      setDeleting(true);
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "bulk-delete",
          emails: selectedEmails,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSelectedEmails([]);
        fetchSubscriptions();
      } else {
        alert("Failed to delete subscriptions");
      }
    } catch (error) {
      console.error("Error deleting subscriptions:", error);
      alert("Failed to delete subscriptions");
    } finally {
      setDeleting(false);
    }
  };

  const handleExport = async () => {
    try {
      setExporting(true);
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "export" }),
      });

      const data = await response.json();

      if (data.success) {
        // Convert to CSV
        const csv = [
          ["Email", "IP Address", "User Agent", "Subscribed Date"].join(","),
          ...data.data.map((sub: Subscription) =>
            [
              sub.email,
              sub.ipAddress || "",
              `"${sub.userAgent || ""}"`,
              new Date(sub.createdAt).toISOString(),
            ].join(",")
          ),
        ].join("\n");

        // Download CSV
        const blob = new Blob([csv], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `newsletter-subscribers-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error exporting subscriptions:", error);
      alert("Failed to export subscriptions");
    } finally {
      setExporting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Newsletter Subscribers"
        description="Manage your email subscribers and track growth."
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={exporting || stats.total === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={fetchSubscriptions}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        }
      />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.today}</div>
            <p className="text-xs text-muted-foreground mt-1">New subscribers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisWeek}</div>
            <p className="text-xs text-muted-foreground mt-1">Last 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.thisMonth}</div>
            <p className="text-xs text-muted-foreground mt-1">Current month</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Subscriber List</CardTitle>
          <CardDescription>
            View and manage all newsletter subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Search by email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="max-w-sm"
              />
              <Button onClick={handleSearch}>
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

            <div className="flex gap-2">
              {/* <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Date</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
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
          {selectedEmails.length > 0 && (
            <div className="flex items-center gap-4 mb-4 p-3 bg-muted/50 rounded-lg">
              <span className="text-sm font-medium">
                {selectedEmails.length} selected
              </span>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleBulkDelete}
                disabled={deleting}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          )}

          {/* Table */}
          <div className="relative overflow-x-auto">
            {loading ? (
              <div className="py-8 text-center text-muted-foreground">
                Loading subscriptions...
              </div>
            ) : subscriptions.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No subscribers found
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                  <tr>
                    <th className="p-3 text-left">
                      <Checkbox
                        checked={
                          selectedEmails.length === subscriptions.length &&
                          subscriptions.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="p-3 text-left">Email</th>
                    <th className="p-3 text-left">IP Address</th>
                    <th className="p-3 text-left">Subscribed Date</th>
                    <th className="p-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {subscriptions.map((subscription) => (
                    <tr key={subscription._id} className="hover:bg-muted/30">
                      <td className="p-3">
                        <Checkbox
                          checked={selectedEmails.includes(subscription.email)}
                          onCheckedChange={(checked) =>
                            handleSelectEmail(subscription.email, checked as boolean)
                          }
                        />
                      </td>
                      <td className="p-3 font-medium">{subscription.email}</td>
                      <td className="p-3 text-muted-foreground">
                        {subscription.ipAddress || "N/A"}
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {formatDate(subscription.createdAt)}
                      </td>
                      <td className="p-3">
                        <Badge variant="secondary">Active</Badge>
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
                  disabled={!pagination.hasPrev}
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
                      <div key={idx}>
                        {idx > 0 && arr[idx - 1] !== page - 1 && (
                          <span className="px-2">
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
                      </div>
                    ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
                  }
                  disabled={!pagination.hasNext}
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
