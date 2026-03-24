"use client";

import { useEffect } from "react";

interface Metric {
  name: string;
  value: number;
  id: string;
}

export default function WebVitals() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const sendToAnalytics = (metric: Metric) => {
      console.log(`[Web Vitals] ${metric.name}:`, metric.value);
    };

    const handleWebVitals = (metric: Metric) => {
      sendToAnalytics(metric);
    };

    import("web-vitals").then((webVitals) => {
      if (webVitals.onCLS) webVitals.onCLS(handleWebVitals);
      if (webVitals.onFCP) webVitals.onFCP(handleWebVitals);
      if (webVitals.onINP) webVitals.onINP(handleWebVitals);
      if (webVitals.onLCP) webVitals.onLCP(handleWebVitals);
      if (webVitals.onTTFB) webVitals.onTTFB(handleWebVitals);
    }).catch(() => {
      console.log("Web Vitals library not available");
    });
  }, []);

  return null;
}
