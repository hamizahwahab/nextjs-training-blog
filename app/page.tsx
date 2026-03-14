import clientPromise, { dbName } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import Link from 'next/link';

// 1. Define the TypeScript interface for our Blog Post
interface Post {
  _id: ObjectId;
  title: string;
  author: string;
  content: string;
  createdAt?: Date;
}

// 2. Ensure the page doesn't show old cached data (Force Fresh Data)
export const revalidate = 0;

export default async function HomePage() {
  // 3. Connect to MongoDB using your typed promise
  const client = await clientPromise;
  const db = client.db(dbName);
  
  // 4. Fetch posts, sorted by newest first
  const posts = await db
    .collection<Post>("posts")
    .find({})
    .sort({ _id: -1 })
    .toArray();

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Recent Stories</h1>
        <p style={styles.subtitle}>Insights and thoughts from the `blog_db` database.</p>
      </header>

      {/* 5. Handle empty state if no posts exist yet */}
      {posts.length === 0 ? (
        <div style={styles.empty}>
          <p>No posts found. Be the first to write something!</p>
          <Link href="/add" style={styles.createLink}>Create a Post</Link>
        </div>
      ) : (
        <div style={styles.grid}>
          {posts.map((post) => (
            <article key={post._id.toString()} style={styles.card}>
              <div style={styles.cardContent}>
                <h2 style={styles.postTitle}>{post.title}</h2>
                <p style={styles.postAuthor}>By {post.author}</p>
                <p style={styles.excerpt}>
                  {post.content.substring(0, 120)}...
                </p>
                <Link href={`/post/${post._id.toString()}`} style={styles.readMore}>
                  Read Full Article →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}

// Inline styles for a clean, modern look
const styles = {
  container: { maxWidth: '900px', margin: '0 auto', padding: '40px 20px' },
  header: { marginBottom: '40px', textAlign: 'center' as const },
  title: { fontSize: '2.5rem', fontWeight: '800', color: '#111', marginBottom: '10px' },
  subtitle: { color: '#666', fontSize: '1.1rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '25px' },
  card: { 
    border: '1px solid #eee', 
    borderRadius: '12px', 
    overflow: 'hidden', 
    transition: 'transform 0.2s',
    backgroundColor: '#fff',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
  },
  cardContent: { padding: '20px' },
  postTitle: { fontSize: '1.4rem', marginBottom: '8px', color: '#0070f3' },
  postAuthor: { fontSize: '0.85rem', color: '#888', textTransform: 'uppercase' as const, letterSpacing: '1px', marginBottom: '15px' },
  excerpt: { color: '#444', lineHeight: '1.6', marginBottom: '20px' },
  readMore: { fontWeight: '600', color: '#0070f3', textDecoration: 'none' },
  empty: { textAlign: 'center' as const, padding: '60px', border: '2px dashed #eee', borderRadius: '12px' },
  createLink: { color: '#0070f3', fontWeight: 'bold' }
};