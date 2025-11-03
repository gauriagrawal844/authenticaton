import prisma from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { sendEmail } from "@/lib/mailer";

export async function POST(req) {
  const { email } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  const token = uuidv4();
  await prisma.user.update({
    where: { email },
    data: { verificationToken: token },
  });

  const link = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;
  await sendEmail(email, "Reset your password", `<a href="${link}">Click to reset password</a>`);

  return Response.json({ message: "Password reset link sent" }, { status: 200 });
}
