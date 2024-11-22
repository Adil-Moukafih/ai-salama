import { useState, useEffect } from "react";
import { getAlerts } from "@/lib/api";

export interface Alert {
  id: number;
  type: "critical" | "warning" | "info";
  message: string;
  camera_id: number;
  severity: string;
  location: string;
  timestamp: string;
  details?: string;
  object_detected?: string;
  actions?: string[];
}

export const useAlerts = (limit = 10, skip = 0) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const fetchedAlerts = await getAlerts(skip, limit);

      // Transform backend alerts to match our frontend interface
      const transformedAlerts: Alert[] = fetchedAlerts.map((alert: any) => ({
        ...alert,
        type:
          alert.severity === "High"
            ? "critical"
            : alert.severity === "Medium"
            ? "warning"
            : "info",
        location: `Camera ${alert.camera_id}`,
        timestamp: new Date(alert.timestamp).toLocaleString(),
        details: alert.message,
        actions: ["Acknowledge", "View Details"],
      }));

      setAlerts(transformedAlerts);
      setError(null);
    } catch (err) {
      console.error("Error fetching alerts:", err);
      setError("Failed to fetch alerts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [limit, skip]);

  return {
    alerts,
    loading,
    error,
    refetch: fetchAlerts,
  };
};
