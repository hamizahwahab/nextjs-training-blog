import { NextResponse } from "next/server";
import clientPromise, { dbName } from "@/lib/mongodb";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    const client = await clientPromise;
    const db = client.db(dbName);

    await db.collection("postLikes").updateOne(
      { postId: id, username: user.username },
      { $set: { postId: id, username: user.username, createdAt: new Date() } },
      { upsert: true }
    );

    const likeCount = await db.collection("postLikes").countDocuments({ postId: id });

    return NextResponse.json({ likes: likeCount });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Failed to like post" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { id } = await params;
    const client = await clientPromise;
    const db = client.db(dbName);

    await db.collection("postLikes").deleteOne({
      postId: id,
      username: user.username,
    });

    const likeCount = await db.collection("postLikes").countDocuments({ postId: id });

    return NextResponse.json({ likes: likeCount });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json({ error: "Failed to unlike post" }, { status: 500 });
  }
}
