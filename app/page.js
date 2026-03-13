// app/page.js
import clientPromise from '@/lib/mongodb';
import Link from 'next/link';

export const revalidate = 0;

export default async function HomePage() {
  // 1. Get the actual client from the promise
  const client = await clientPromise;
  
  // 2. Access the database using your .env variable
  const db = client.db(process.env.MONGODB_DB);
  
  // 3. Fetch the posts
  const posts = await db
    .collection("posts")
    .find({})
    .sort({ _id: -1 })
    .toArray();

  return (
    <main style={{ padding: '20px' }}>
      <h1>Recent Posts</h1>
      {posts.length === 0 ? (
        <p>No posts found in {process.env.MONGODB_DB}</p>
      ) : (
        posts.map((post) => (
          <div key={post._id.toString()} style={{ border: '1px solid #ccc', padding: '10px', margin: '10px 0' }}>
            <h2>{post.title}</h2>
                {/* Convert _id to string here */}
                <Link href={`/post/${post._id.toString()}`}>
                  Read More
                </Link>
          </div>
        ))
      )}
    </main>
  );
}