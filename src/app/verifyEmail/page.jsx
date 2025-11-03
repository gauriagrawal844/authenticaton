'use client';
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function VerifyEmail() {
  const [status, setStatus] = useState("Verifying...");
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const notice = searchParams.get("notice");

  useEffect(() => {
    if (notice === "check-your-email") {
      setStatus("Please check your email for verification link");
      return;
    }

    if (!token) {
      setStatus("Invalid verification link");
      return;
    }

    fetch(`/api/verify-email?token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setStatus(data.error);
        } else {
          setStatus("Email verified successfully! Redirecting to login...");
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        }
      })
      .catch(() => {
        setStatus("Verification failed. Please try again.");
      });
  }, [token, notice, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
        <p
          className={`text-lg ${
            status.includes("successfully")
              ? "text-green-600"
              : status.includes("failed") || status.includes("Invalid")
              ? "text-red-600"
              : "text-gray-600"
          }`}
        >
          {status}
        </p>
      </div>
    </div>
  );
}