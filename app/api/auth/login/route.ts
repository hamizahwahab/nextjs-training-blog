import { NextResponse } from "next/server";
import clientPromise, { dbName } from "@/lib/mongodb";
import { userLoginSchema } from "@/lib/schemas";
import { verifyPassword, setUserSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    const result = userLoginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }
    
    const { username, password } = result.data;
    
    const client = await clientPromise;
    const db = client.db(dbName);
    
    // Find user by username
    const user = await db.collection("users").findOne({ username });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }
    
    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }
    
    // Set session cookie
    await setUserSession(username);
    
    return NextResponse.json({ message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
