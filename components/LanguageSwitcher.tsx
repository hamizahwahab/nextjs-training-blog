/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex gap-2 text-sm">
        <span className="text-neutral-400">EN</span>
        <span className="text-neutral-500">|</span>
        <span className="text-neutral-400">MS</span>
      </div>
    );
  }

  return (
    <div className="flex gap-2 text-sm">
      <button
        onClick={() => setLocale("en")}
        className={`transition-colors ${
          locale === "en" 
            ? "text-blue-500 font-bold" 
            : "text-neutral-400 hover:text-white"
        }`}
      >
        EN
      </button>
      <span className="text-neutral-500">|</span>
      <button
        onClick={() => setLocale("ms")}
        className={`transition-colors ${
          locale === "ms" 
            ? "text-blue-500 font-bold" 
            : "text-neutral-400 hover:text-white"
        }`}
      >
        MS
      </button>
    </div>
  );
}
