import clientPromise, { dbName } from '@/lib/mongodb';
import { redirect } from 'next/navigation';

export default function AddPostPage() {
  // This is a "Server Action" - it runs only on the server
  async function createPost(formData: FormData) {
    'use server';

    const title = formData.get('title');
    const author = formData.get('author');
    const content = formData.get('content');

    if (!title || !content) return;

    const client = await clientPromise;
    const db = client.db(dbName);

    await db.collection('posts').insertOne({
      title,
      author,
      content,
      createdAt: new Date(),
    });

    // Send the user back to the homepage after saving
    redirect('/');
  }

  return (
    <main style={styles.container}>
      <h1>Add New Post</h1>
      <form action={createPost} style={styles.form}>
        <input 
          name="title" 
          placeholder="Post Title" 
          required 
          style={styles.input} 
        />
        <input 
          name="author" 
          placeholder="Your Name" 
          required 
          style={styles.input} 
        />
        <textarea 
          name="content" 
          placeholder="Write your content here..." 
          required 
          style={styles.textarea} 
        />
        <button type="submit" style={styles.button}>Publish Post</button>
      </form>
    </main>
  );
}

const styles = {
  container: { maxWidth: '600px', margin: '40px auto', padding: '0 20px' },
  form: { display: 'flex', flexDirection: 'column' as const, gap: '15px' },
  input: { padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc' },
  textarea: { padding: '10px', fontSize: '16px', borderRadius: '4px', border: '1px solid #ccc', minHeight: '150px' },
  button: { padding: '12px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};