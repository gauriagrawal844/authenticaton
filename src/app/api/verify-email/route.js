import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    if (!token) return Response.json({ error: "Token required" }, { status: 400 });

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return Response.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    const { name, email, phone, password } = payload;

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    
    if (existing) {
      // If user exists but not verified, verify them
      if (!existing.emailVerified) {
        await prisma.user.update({
          where: { email },
          data: { emailVerified: true }
        });
        return Response.json({ message: "Email verified successfully" });
      }
      return Response.json({ error: "Email already verified" }, { status: 400 });
    }

    // Create new verified user
    await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password,
        emailVerified: true
      },
    });

    return Response.json({ message: "Email verified and account created" }, { status: 200 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}