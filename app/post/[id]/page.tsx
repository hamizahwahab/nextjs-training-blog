import clientPromise, { dbName } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { notFound } from 'next/navigation';
import Link from 'next/link';

// Define the shape of the post document
interface Post {
  _id: ObjectId;
  title: string;
  author: string;
  content: string;
  createdAt?: Date;
}

// Props for Next.js 15 dynamic routes
type PostPageProps = {
  params: Promise<{ id: string }>;
};

export default async function PostPage({ params }: PostPageProps) {
  // 1. Await the dynamic parameters from the URL
  const { id } = await params;

  // 2. Validate the ID format (prevents app crash on invalid hex strings)
  if (!ObjectId.isValid(id)) {
    return notFound();
  }

  // 3. Connect to MongoDB Atlas
  const client = await clientPromise;
  const db = client.db(dbName);

  // 4. Fetch the specific post
  const post = await db.collection<Post>("posts").findOne({ 
    _id: new ObjectId(id) 
  });

  // 5. If no post is found in 'blog_db', trigger the 404 page
  if (!post) {
    return notFound();
  }

  return (
    <main style={styles.container}>
      <Link href="/" style={styles.backButton}>← Back to All Posts</Link>
      
      <article style={styles.article}>
        <header style={styles.header}>
          <h1 style={styles.title}>{post.title}</h1>
          <div style={styles.meta}>
            <span>Published by <strong>{post.author}</strong></span>
            {post.createdAt && (
              <span> • {new Date(post.createdAt).toLocaleDateString()}</span>
            )}
          </div>
        </header>

        <section style={styles.content}>
          {post.content}
        </section>
      </article>
    </main>
  );
}

const styles = {
  container: { maxWidth: '800px', margin: '0 auto', padding: '40px 20px' },
  backButton: { color: '#0070f3', textDecoration: 'none', fontWeight: '500' },
  article: { marginTop: '30px', backgroundColor: '#fff', padding: '30px', borderRadius: '8px', border: '1px solid #eee' },
  header: { borderBottom: '2px solid #f0f0f0', marginBottom: '20px', paddingBottom: '15px' },
  title: { fontSize: '2.5rem', color: '#1a1a1a', margin: '0 0 10px 0' },
  meta: { color: '#666', fontSize: '0.9rem' },
  content: { lineHeight: '1.8', fontSize: '1.1rem', color: '#333', whiteSpace: 'pre-wrap' as const }
};