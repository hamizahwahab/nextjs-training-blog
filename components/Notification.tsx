"use client";

import { useEffect } from "react";
import { useNotificationStore } from "@/lib/store";

export default function Notification() {
  const { message, type, clearNotification } = useNotificationStore();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        clearNotification();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, clearNotification]);

  if (!message) return null;

  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  }[type || "info"];

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div
        className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3`}
      >
        <span>{message}</span>
        <button
          onClick={clearNotification}
          className="hover:opacity-80"
          aria-label="Close notification"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
