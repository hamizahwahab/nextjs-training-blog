import { NextResponse } from "next/server";
import clientPromise, { dbName } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";

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
  
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized - Please login" }, { status: 401 });
  }
  
  try {
    const body = await request.json();
    const { content } = body;
    
    if (!content || content.trim() === "") {
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 });
    }
    
    const client = await clientPromise;
    const db = client.db(dbName);
    
    const result = await db.collection("comments").insertOne({
      postId: id,
      author: user.username,
      content,
      createdAt: new Date(),
    });
    
    return NextResponse.json({ message: "Comment added", id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.log('Error Adding Comment: ', error);
    return NextResponse.json({ error: "Failed to add comment" }, { status: 500 });
  }
}
