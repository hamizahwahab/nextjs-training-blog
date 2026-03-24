import { NextResponse } from "next/server";
import clientPromise, { dbName } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";
import { ObjectId } from "mongodb";

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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db(dbName);

    const comment = await db.collection("comments").findOne({ _id: new ObjectId(id) });
    
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (comment.author !== user.username) {
      return NextResponse.json({ error: "Not authorized to delete this comment" }, { status: 403 });
    }

    await db.collection("comments").deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
