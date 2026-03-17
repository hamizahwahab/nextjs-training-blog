import { NextResponse } from "next/server";
import clientPromise, { dbName } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  if (!ObjectId.isValid(id)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }
  
  try {
    const client = await clientPromise;
    const db = client.db(dbName);
    
    await db.collection("comments").deleteOne({ _id: new ObjectId(id) });
    
    return NextResponse.json({ message: "Comment deleted" });
  } catch (error) {
    console.log('Error Delete Comment: ', error);
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 });
  }
}
