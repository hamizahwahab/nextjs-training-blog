import clientPromise, { dbName } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { notFound, redirect } from 'next/navigation';

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Validate ID
  if (!ObjectId.isValid(id)) return notFound();

  const client = await clientPromise;
  const db = client.db(dbName);
  const post = await db.collection("posts").findOne({ _id: new ObjectId(id) });

  if (!post) return notFound();

  async function updatePost(formData: FormData) {
    'use server';
    const client = await clientPromise;
    const db = client.db(dbName);
    
    await db.collection("posts").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: formData.get('title'),
          author: formData.get('author'),
          content: formData.get('content'),
        }
      }
    );
    redirect(`/post/${id}`);
  }

  return (
    <main style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Edit Post</h1>
      <form action={updatePost} style={styles.form}>
        <input name="title" defaultValue={post.title} style={styles.input} placeholder="Title" />
        <input name="author" defaultValue={post.author} style={styles.input} placeholder="Author" />
        <textarea name="content" defaultValue={post.content} style={styles.textarea} placeholder="Content" />
        <button type="submit" style={styles.button}>Save Changes</button>
      </form>
    </main>
  );
}

const styles = {
  form: { display: 'flex', flexDirection: 'column' as const, gap: '15px' },
  input: { padding: '10px', borderRadius: '4px', border: '1px solid #ccc' },
  textarea: { padding: '10px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '150px' },
  button: { padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', cursor: 'pointer' }
};