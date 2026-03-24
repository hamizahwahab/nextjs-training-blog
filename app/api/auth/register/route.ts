import { NextResponse } from "next/server";
import clientPromise, { dbName } from "@/lib/mongodb";
import { userRegisterSchema } from "@/lib/schemas";
import { hashPassword } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validate input
    const result = userRegisterSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }
    
    const { username, password } = result.data;
    
    const client = await clientPromise;
    const db = client.db(dbName);
    
    // Check if username already exists
    const existingUser = await db.collection("users").findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 }
      );
    }
    
    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    await db.collection("users").insertOne({
      username,
      password: hashedPassword,
      createdAt: new Date(),
    });
    
    return NextResponse.json(
      { message: "Registration successful" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
