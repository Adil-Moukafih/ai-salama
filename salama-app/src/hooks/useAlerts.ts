import { useState, useEffect } from "react";
import { getAlerts } from "@/lib/api";

// Utility function for human-readable time difference
function formatTimeDifference(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 5) return "now";
  if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hr ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day ago`;
}

export interface Alert {
  id: number;
  type: "critical" | "warning" | "info";
  message: string;
  camera_id: number;
  severity: string;
  location: string;
  timestamp: string;
  fullTimestamp: string;
  rawDate: Date;
  details?: string;
  object_detected?: string;
  actions?: string[];
}

export const useAlerts = (
  limit = 10,
  skip = 0,
  autoRefreshInterval = 0 // New parameter for auto-refresh, defaults to no auto-refresh
) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const fetchedAlerts = await getAlerts(skip, limit);

      // Transform backend alerts to match our frontend interface
      const transformedAlerts: Alert[] = fetchedAlerts.map((alert: any) => {
        const date = new Date(alert.created_at);

        return {
          ...alert,
          type:
            alert.severity === "High"
              ? "critical"
              : alert.severity === "Medium"
              ? "warning"
              : "info",
          location: `Camera ${alert.camera_id}`,
          timestamp: formatTimeDifference(date),
          fullTimestamp: date.toLocaleString(),
          rawDate: date,
          details: alert.message,
          object_detected: alert.object_detected || "Unspecified Object",
          actions: ["Acknowledge", "View Details"],
        };
      });

      // Sort alerts by date, most recent first
      const sortedAlerts = transformedAlerts.sort(
        (a, b) => b.rawDate.getTime() - a.rawDate.getTime()
      );

      setAlerts(sortedAlerts);
      setError(null);
    } catch (err) {
      console.error("Error fetching alerts:", err);
      setError("Failed to fetch alerts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchAlerts();

    // Set up interval if autoRefreshInterval is greater than 0
    let intervalId: NodeJS.Timeout | null = null;
    if (autoRefreshInterval > 0) {
      intervalId = setInterval(fetchAlerts, autoRefreshInterval);
    }

    // Cleanup function
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [limit, skip, autoRefreshInterval]);

  return {
    alerts,
    loading,
    error,
    refetch: fetchAlerts,
  };
};
