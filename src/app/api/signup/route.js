import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { name, email, phone, password } = await req.json();

    if (!name || !email || !password)
      return Response.json({ error: "Name, email & password required" }, { status: 400 });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return Response.json({ error: "Email already registered" }, { status: 400 });

    // Ensure email has been verified via signup OTP
    const ev = await prisma.emailVerification.findUnique({ where: { email } });
    if (!ev || !ev.verified) {
      return Response.json({ error: "Verify your email first" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        name,
        email,
        phone,
        password: hashed,
        emailVerified: true,
      },
    });

    // Cleanup verification record
    await prisma.emailVerification.delete({ where: { email } }).catch(() => {});

    return Response.json({ message: "Signup successful" }, { status: 201 });
  } catch (err) {
    console.error(err);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}