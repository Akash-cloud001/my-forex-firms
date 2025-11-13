"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { X, AlertCircle, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Firm {
  id: string;
  name: string;
}

interface FirmSelectorProps {
  value?: string;
  onChange: (name: string, id?: string) => void;
  error?: string;
}

export const FirmSelector: React.FC<FirmSelectorProps> = ({
  value,
  onChange,
  error,
}) => {
  const [search, setSearch] = useState(value ?? "");
  const [firms, setFirms] = useState<Firm[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [showDropdown, setShowDropdown] = useState(false);

  const observer = useRef<IntersectionObserver | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isFetchingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const pageRef = useRef(1);
  const searchRef = useRef("");

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  useEffect(() => {
    searchRef.current = search;
  }, [search]);

  const fetchFirms = useCallback(async (reset: boolean = false, qOverride?: string) => {
    if (isFetchingRef.current) return;
    if (!reset && !hasMoreRef.current) return;

    isFetchingRef.current = true;
    setLoading(true);

    const q = (qOverride ?? searchRef.current).trim();
    const currentPage = reset ? 1 : pageRef.current;

    const url = new URL("/api/website/prop-firm-list", location.origin);
    url.searchParams.set("page", currentPage.toString());
    url.searchParams.set("limit", "5");
    if (q) url.searchParams.set("q", q);

    try {
      const res = await fetch(url);
      const json = await res.json();

      if (!json.success) throw new Error(json.message);

      const newFirms: Firm[] = json.data.map((f: { id: string; name: string; }) => ({
        id: f.id,
        name: f.name,
      }));

      setFirms((prev) => (reset ? newFirms : [...prev, ...newFirms]));
      setHasMore(json.pagination.hasMore);

      if (!reset && json.pagination.hasMore) {
        setPage((prev) => prev + 1);
      } else if (reset) {
        setPage(json.pagination.hasMore ? 2 : 1);
      }
    } catch (e) {
      console.error("Error fetching firms:", e);
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, []); 

  useEffect(() => {
    if (!showDropdown) return;

    const timer = setTimeout(() => {
      setPage(1);
      setHasMore(true);
      fetchFirms(true, search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search, showDropdown, fetchFirms]);

  const lastItemRef = useCallback(
    (node: HTMLButtonElement | null) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        const first = entries[0];

        if (
          first.isIntersecting &&
          hasMoreRef.current &&
          !isFetchingRef.current
        ) {
          fetchFirms(false);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, fetchFirms]
  );

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setSearch(value ?? "");
  }, [value]);

  useEffect(() => {
    if (showDropdown && firms.length === 0 && !loading && !isFetchingRef.current) {
      fetchFirms(true);
    }
  }, [showDropdown]); 

  const handleSelect = (firm: Firm) => {
    setSearch(firm.name);
    onChange(firm.name, firm.id);
    setShowDropdown(false);
  };

  const handleClear = () => {
    setSearch("");
    onChange("");
    setFirms([]);
    setPage(1);
    setHasMore(true);
    setShowDropdown(true);
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="firmName" className="text-base font-semibold">
        Firm Name *
      </Label>

      <div className="relative" ref={dropdownRef}>
        <Input
          id="firmName"
          placeholder="Search for a prop firm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          className={cn("pr-10", error && "border-destructive")}
        />

        {search && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={handleClear}
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        {showDropdown && (
          <div className="absolute z-10 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-y-auto">
            {!loading && firms.length === 0 && (
              <div className="px-4 py-3 text-muted-foreground">
                No firms found.
              </div>
            )}

            {firms.map((firm, idx) => (
              <button
                key={firm.id}
                ref={idx === firms.length - 1 ? lastItemRef : null}
                type="button"
                className="w-full px-4 py-3 text-left hover:bg-muted"
                onClick={() => handleSelect(firm)}
              >
                {firm.name}
              </button>
            ))}

            {loading && (
              <div className="flex items-center justify-center py-3">
                <Loader2 className="h-4 w-4 animate-spin" />
              </div>
            )}

           
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
};