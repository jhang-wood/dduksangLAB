"use client";

import { useEffect, useState } from "react";

interface HealthData {
  ok: boolean;
  mode: "MOCK" | "SUPABASE" | "ERROR";
  timestamp: string;
  status: string;
}

export default function DataSourceBadge() {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [showBadge, setShowBadge] = useState(false);

  useEffect(() => {
    // Only show badge in development mode
    if (process.env.NODE_ENV !== "development") {
      return;
    }

    const fetchHealth = async () => {
      try {
        const response = await fetch("/api/health");
        const data = await response.json();
        setHealthData(data);
        setShowBadge(true);
      } catch (error) {
        // Silent fail in production, only log in development
        if (process.env.NODE_ENV === "development") {
          console.warn("[DataSourceBadge] Failed to fetch health data:", error);
        }
        setHealthData({
          ok: false,
          mode: "ERROR",
          timestamp: new Date().toISOString(),
          status: "error"
        });
        setShowBadge(true);
      }
    };

    fetchHealth();
    
    // Refresh health data every 30 seconds
    const interval = setInterval(fetchHealth, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (!showBadge || !healthData) {
    return null;
  }

  const getBadgeColor = () => {
    switch (healthData.mode) {
      case "MOCK":
        return {
          bg: "rgba(255, 193, 7, 0.2)",
          border: "rgba(255, 193, 7, 0.5)",
          text: "#ffc107"
        };
      case "SUPABASE":
        return {
          bg: "rgba(40, 167, 69, 0.2)",
          border: "rgba(40, 167, 69, 0.5)",
          text: "#28a745"
        };
      case "ERROR":
        return {
          bg: "rgba(220, 53, 69, 0.2)",
          border: "rgba(220, 53, 69, 0.5)",
          text: "#dc3545"
        };
      default:
        return {
          bg: "rgba(108, 117, 125, 0.2)",
          border: "rgba(108, 117, 125, 0.5)",
          text: "#6c757d"
        };
    }
  };

  const getBadgeText = () => {
    switch (healthData.mode) {
      case "MOCK":
        return "MOCK";
      case "SUPABASE":
        return "LIVE";
      case "ERROR":
        return "ERR";
      default:
        return "UNK";
    }
  };

  const colors = getBadgeColor();

  return (
    <div
      style={{
        position: "fixed",
        top: "16px",
        right: "16px",
        zIndex: 1000,
        backgroundColor: colors.bg,
        border: `1px solid ${colors.border}`,
        borderRadius: "12px",
        padding: "4px 8px",
        fontSize: "11px",
        fontWeight: "600",
        color: colors.text,
        fontFamily: "monospace",
        cursor: "pointer",
        transition: "all 0.2s ease"
      }}
      title={`Data Source: ${healthData.mode}\nStatus: ${healthData.status}\nLast Updated: ${new Date(healthData.timestamp).toLocaleTimeString()}`}
      onClick={() => {
        // Only log debug info in development
        if (process.env.NODE_ENV === "development") {
          console.log("[DataSourceBadge] Health Data:", healthData);
        }
      }}
    >
      {getBadgeText()}
    </div>
  );
}