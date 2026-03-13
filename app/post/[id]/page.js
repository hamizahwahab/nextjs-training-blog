import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function PostPage({ params }) {
  // 1. Await params in Next.js 15
  const { id } = await params;

  // 2. Connect to the database
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DB);

  let post;

  try {
    // 3. Convert the string ID to a MongoDB ObjectId
    post = await db.collection("posts").findOne({ 
      _id: new ObjectId(id) 
    });

  } catch (error) {
    // This catches "Argument passed in must be a string of 12 bytes..." errors
    console.log("Error: ", error);
    return notFound();
  }

  // 4. If the post doesn't exist in Atlas
  if (!post) {
    return notFound();
  }

  return (
    <main style={styles.container}>
      <Link href="/" style={styles.backLink}>← Back to Home</Link>
      
      <article style={styles.article}>
        <h1 style={styles.title}>{post.title}</h1>
        
        <div style={styles.meta}>
          <span>By {post.author || 'Anonymous'}</span>
          {post.createdAt && (
            <span> • {new Date(post.createdAt).toLocaleDateString()}</span>
          )}
        </div>

        <div style={styles.content}>
          {post.content}
        </div>
      </article>
    </main>
  );
}

const styles = {
  container: { maxWidth: '700px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif' },
  backLink: { color: '#0070f3', textDecoration: 'none', fontSize: '0.9rem' },
  article: { marginTop: '20px' },
  title: { fontSize: '2.5rem', marginBottom: '10px', lineHeight: '1.2' },
  meta: { color: '#666', marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '10px' },
  content: { lineHeight: '1.8', fontSize: '1.1rem', whiteSpace: 'pre-wrap', color: '#333' }
};