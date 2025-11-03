import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  const { bio, address, avatarUrl } = await req.json();

  if (!token) return Response.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await prisma.profile.create({
      data: {
        userId: decoded.id,
        bio,
        address,
        avatarUrl,
      },
    });

    return Response.json({ message: "Profile created successfully" }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Invalid or expired token" }, { status: 401 });
  }
}
