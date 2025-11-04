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
      setMsg("✅ Password reset link sent! Check your email.");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 relative overflow-hidden">
      {/* Decorative Background Circles */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-blue-200 rounded-full blur-3xl opacity-40 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full blur-3xl opacity-40 animate-pulse delay-700" />

      {/* Forgot Password Card */}
      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-2xl p-10 text-center transition-transform hover:-translate-y-1 hover:shadow-blue-100/60">
        <h1 className="text-3xl font-bold mb-3 text-gray-800">
          Forgot Password?
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          Enter your email address and we’ll send you a reset link.
        </p>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="text-left">
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
              required
            />
          </div>

          {err && (
            <p className="text-red-500 text-sm bg-red-50 border border-red-100 p-2 rounded-lg text-center animate-fadeIn">
              {err}
            </p>
          )}
          {msg && (
            <p className="text-green-600 text-sm bg-green-50 border border-green-100 p-2 rounded-lg text-center animate-fadeIn">
              {msg}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white text-lg transition-all duration-200 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-blue-200/50"
            }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-6">
          Remembered your password?{" "}
          <a
            href="/login"
            className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition"
          >
            Back to Login
          </a>
        </p>
      </div>
    </div>
  );
}
