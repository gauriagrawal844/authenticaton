"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // from /api/me
  const [profile, setProfile] = useState(null); // from /api/profile
  const [err, setErr] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) {
          router.replace(`/login?next=${encodeURIComponent("/dashboard")}`);
          return;
        }
        const meRes = await fetch("/api/me", { headers: { Authorization: `Bearer ${token}` } });
        if (meRes.ok) {
          const me = await meRes.json();
          setUser(me);
        }
        const profRes = await fetch("/api/profile", { headers: { Authorization: `Bearer ${token}` } });
        if (profRes.ok) {
          const prof = await profRes.json();
          setProfile(prof);
        }
      } catch (e) {
        setErr("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [router]);

  if (loading) return null;

  const displayName = profile?.firstName?.trim()
    ? `${profile.firstName}${profile.lastName ? " " + profile.lastName : ""}`
    : user?.name || user?.email || "User";

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-emerald-100 via-white to-emerald-50">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-emerald-700 text-center">Welcome, {displayName}!</h1>
        <p className="text-gray-600 mt-3 text-center">
          {profile ? "Your profile has been saved. You can update it anytime." : "You haven't created your profile yet."}
        </p>

        <div className="mt-8">
          {!profile ? (
            <div className="text-center">
              <button
                onClick={() => router.push("/createProfile")}
                className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-lg font-medium w-full sm:w-auto"
              >
                Create Your Profile
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button
                onClick={() => router.push("/Profile/view")}
                className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-md border flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                View Profile
              </button>
              <button
                onClick={() => router.push("/Profile/update")}
                className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.793.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Update Profile
              </button>
            </div>
          )}
        </div>

        {err && <p className="text-red-600 text-sm mt-6 text-center">{err}</p>}
      </div>
    </div>
  );
}
