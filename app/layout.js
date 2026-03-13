import "./globals.css";
import Link from 'next/link'; // Import the Next.js Link component

export const metadata = {
  title: "My Native MongoDB Blog",
  description: "Built with Next.js 15 and the Native MongoDB Driver",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav style={styles.nav}>
          {/* Use Link instead of <a> for faster, SPA-like navigation */}
          <Link href="/" style={styles.logo}>
            MyBlog
          </Link>
        </nav>
        
        {children}
        
        <footer style={styles.footer}>
          <p>© 2026 My Developer Blog</p>
        </footer>
      </body>
    </html>
  );
}

const styles = {
  nav: { 
    padding: '1rem 2rem', 
    borderBottom: '1px solid #eee', 
    display: 'flex', 
    justifyContent: 'space-between',
    backgroundColor: '#fff' 
  },
  logo: { 
    fontWeight: 'bold', 
    fontSize: '1.2rem', 
    textDecoration: 'none', 
    color: '#000' 
  },
  footer: { 
    textAlign: 'center', 
    padding: '2rem', 
    marginTop: '4rem', 
    color: '#888',
    borderTop: '1px solid #eee' 
  }
};