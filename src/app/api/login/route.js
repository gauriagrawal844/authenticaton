import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { sendEmail } from "@/lib/mailer";

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return Response.json({ error: "User not found" }, { status: 404 });

    if (!user.emailVerified) {
      return Response.json({ error: "Verify your email first" }, { status: 400 });
    }

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return Response.json({ error: "Invalid password" }, { status: 400 });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { email },
      data: { otp, otpExpires },
    });

    await sendEmail(
      email,
      "Login OTP Verification",
      `<p>Your OTP for login is <b>${otp}</b>. It will expire in 10 minutes.</p>`
    );

    return Response.json({ message: "OTP sent successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Server error" }, { status: 500 });
  }
}
