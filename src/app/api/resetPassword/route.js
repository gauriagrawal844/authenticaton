import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req) {
  const { token, newPassword } = await req.json();

  const user = await prisma.user.findFirst({ where: { verificationToken: token } });
  if (!user) return Response.json({ error: "Invalid or expired token" }, { status: 400 });

  const hashed = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashed, verificationToken: null },
  });

  return Response.json({ message: "Password updated successfully" }, { status: 200 });
}
