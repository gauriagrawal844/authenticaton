"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState("");
  const router = useRouter();

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (name === "email") {
      setEmailVerified(false);
      setOtp("");
      setOtpSent(false);
      setVerifyMsg("");
    }
  };

  const validate = () => {
    if (!form.name || !form.email || !form.password)
      return "Name, email & password are required";
    if (form.phone && !/^\d{10}$/.test(form.phone))
      return "Phone must be 10 digits if provided";
    return null;
  };

  const sendSignupOtp = async () => {
    setErr("");
    setVerifyMsg("");
    if (!form.email) return setErr("Enter email first");
    try {
      const res = await fetch("/api/send-signup-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");
      setOtpSent(true);
      setVerifyMsg("OTP sent to your email");
    } catch (e) {
      setErr(e.message);
    }
  };

  const verifySignupOtp = async () => {
    setErr("");
    setVerifyMsg("");
    if (!otp) return setErr("Enter OTP to verify email");
    try {
      const res = await fetch("/api/verify-signup-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to verify OTP");
      setEmailVerified(true);
      setVerifyMsg("Email verified successfully");
    } catch (e) {
      setErr(e.message);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    const v = validate();
    if (v) return setErr(v);
    if (!emailVerified) return setErr("Verify your email first");
    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      router.push("/login");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>
        <form onSubmit={onSubmit}>
          <div>
            <label className="block font-medium mb-1">Full Name</label>
            <input name="name" value={form.name} onChange={onChange} />
          </div>
          <div>
            <label className="block font-medium mb-1">Email</label>
            <div className="flex gap-2">
              <input name="email" type="email" value={form.email} onChange={onChange} className="flex-1" />
              <button type="button" onClick={sendSignupOtp} disabled={emailVerified} className="shrink-0">
                {emailVerified ? "Verified" : "Verify Email"}
              </button>
            </div>
            {otpSent && !emailVerified && (
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="flex-1"
                />
                <button type="button" onClick={verifySignupOtp} className="shrink-0">
                  Verify OTP
                </button>
              </div>
            )}
            {verifyMsg && <p className="text-green-600 text-sm mt-1">{verifyMsg}</p>}
          </div>
          <div>
            <label className="block font-medium mb-1">Phone (optional)</label>
            <input name="phone" value={form.phone} onChange={onChange} />
          </div>
          <div>
            <label className="block font-medium mb-1">Password</label>
            <input name="password" type="password" value={form.password} onChange={onChange} />
          </div>

          {err && <p className="text-red-600 text-sm mt-2">{err}</p>}
          <button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
