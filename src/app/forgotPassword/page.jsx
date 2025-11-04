"use client";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    if (!email) return setErr("Email is required");
    setLoading(true);

    try {
      const res = await fetch("/api/forgotPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Request failed");
      setMsg("Password reset link sent! Check your email.");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 text-center">
        <h1 className="text-2xl font-bold mb-6">Forgot Password</h1>
        <form onSubmit={onSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {err && <p className="text-red-600 text-sm mt-2">{err}</p>}
          {msg && <p className="text-green-600 text-sm mt-2">{msg}</p>}
          <button type="submit" className="w-full mt-3" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}
