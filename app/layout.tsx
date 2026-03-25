import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Notification from "@/components/Notification";
import WebVitals from "@/components/WebVitals";
import { ThemeProvider } from "@/components/ThemeProvider";
import { I18nProvider } from "@/lib/i18n";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My MongoDB Blog",
  description: "Built with Next.js 15 and TypeScript",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors`}>
        <I18nProvider>
          <ThemeProvider>
          <WebVitals />
          <Navbar />
          <Notification />
          <main className="flex-1">{children}</main>
          <footer className="text-center py-6 border-t border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 text-sm">
            <p>© {new Date().getFullYear()} My Next.js Training Blog</p>
          </footer>
        </ThemeProvider>
        </I18nProvider>
        
      </body>
    </html>
  );
}
