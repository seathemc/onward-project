"use client";

import { useEffect, useState } from "react";
import { fetchDataStatus, DataStatus } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { RefreshCw, AlertCircle, CheckCircle2 } from "lucide-react";

function relativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60_000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return "just now";
}

export function DataFreshnessBadge() {
  const [status, setStatus] = useState<DataStatus | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDataStatus().then(setStatus);
  }, []);

  if (!status) return null;

  const isStale = Object.values(status.staleness).some(Boolean);
  const latestUpdate = Object.values(status.datasets)
    .map((d) => d.lastUpdated)
    .sort()
    .at(-1);

  async function handleRefresh() {
    setRefreshing(true);
    try {
      await fetch("/api/refresh", { method: "POST" });
      const newStatus = await fetchDataStatus();
      setStatus(newStatus);
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={handleRefresh}>
            {isStale ? (
              <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
            ) : (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            )}
            <Badge
              variant="outline"
              className="text-xs h-5 gap-1 font-normal border-border/60 text-muted-foreground"
            >
              {refreshing ? (
                <RefreshCw className="h-2.5 w-2.5 animate-spin" />
              ) : null}
              {latestUpdate ? relativeTime(latestUpdate) : "live"}
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="text-xs max-w-xs">
          <p className="font-medium mb-1">Data sources</p>
          {Object.entries(status.datasets).map(([type, info]) => (
            <div key={type} className="flex justify-between gap-4">
              <span className="text-muted-foreground capitalize">{type.replace(/_/g, " ")}</span>
              <span>{info.source} · {relativeTime(info.lastUpdated)}</span>
            </div>
          ))}
          <p className="mt-1 text-muted-foreground/70">Click to refresh</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
