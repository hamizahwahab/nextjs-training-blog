import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
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
    <html lang="en">
      <body className={inter.className} style={styles.body}>
        {/* Persistent Navbar */}
        <nav style={styles.navbar}>
          <div style={styles.navContainer}>
            <Link href="/" style={styles.logo}>
              🚀 MyBlog
            </Link>
            <div style={styles.navLinks}>
              <Link href="/" style={styles.link}>Home</Link>
              <Link href="/add" style={styles.addButton}>+ New Post</Link>
            </div>
          </div>
        </nav>

        {/* The actual page content */}
        <div style={styles.content}>
          {children}
        </div>

        {/* Persistent Footer */}
        <footer style={styles.footer}>
          <p>© {new Date().getFullYear()} My Next.js Training Blog</p>
        </footer>
      </body>
    </html>
  );
}

const styles = {
  body: { margin: 0, padding: 0, minHeight: '100vh', display: 'flex', flexDirection: 'column' as const },
  navbar: { backgroundColor: '#1a1a1a', color: 'white', padding: '15px 0', borderBottom: '1px solid #333' },
  navContainer: { maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 20px' },
  logo: { fontSize: '1.5rem', fontWeight: 'bold', textDecoration: 'none', color: 'white' },
  navLinks: { display: 'flex', gap: '20px', alignItems: 'center' },
  link: { textDecoration: 'none', color: '#ccc' },
  addButton: { backgroundColor: '#0070f3', color: 'white', padding: '8px 15px', borderRadius: '5px', textDecoration: 'none' },
  content: { flex: 1 }, // This pushes the footer to the bottom
  footer: { textAlign: 'center' as const, padding: '20px', borderTop: '1px solid #eee', color: '#666' }
};