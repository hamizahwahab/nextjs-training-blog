import { NextResponse } from "next/server";
import clientPromise, { dbName } from "@/lib/mongodb";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    
    const comments = await db.collection("comments")
      .find({ postId: id })
      .sort({ createdAt: -1 })
      .toArray();
    
    return NextResponse.json(comments);
  } catch (error) {
    console.log('Error Fetch Comments: ', error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  try {
    const body = await request.json();
    const { author, content } = body;
    
    const client = await clientPromise;
    const db = client.db(dbName);
    
    const result = await db.collection("comments").insertOne({
      postId: id,
      author,
      content,
      createdAt: new Date(),
    });
    
    return NextResponse.json({ message: "Comment added", id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.log('Error Comments added: ', error);
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}
