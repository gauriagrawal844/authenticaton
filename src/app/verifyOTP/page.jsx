"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const next = searchParams.get("next");
  const [otp, setOtp] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!otp) return setErr("OTP required");
    setErr("");
    setLoading(true);

    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Verification failed");

      localStorage.setItem("token", data.token);
      const dest = next && next.startsWith("/") ? next : "/createProfile";
      router.push(dest);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 text-center border border-green-100">
        <h1 className="text-3xl font-bold mb-4 text-green-700">Verify OTP</h1>
        <p className="text-gray-600 mb-6">
          OTP sent to <span className="font-semibold">{email}</span>
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
          {err && <p className="text-red-600 text-sm">{err}</p>}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-all"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
      </div>
    </div>
  );
}
