"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ViewProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) {
          router.replace(`/login?next=${encodeURIComponent("/profile/view")}`);
          return;
        }
        const res = await fetch("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Failed to load profile");
        }
        const data = await res.json();
        setProfile(data);
      } catch (e) {
        setErr(e.message);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [router]);

  if (loading) return null;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-50">
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-indigo-700">Your Profile</h1>
        {err && <p className="text-red-600 text-sm mb-4 text-center">{err}</p>}
        {!profile ? (
          <div className="text-center">
            <p className="text-gray-600 mb-4">No profile found.</p>
            <button
              onClick={() => router.push("/createProfile")}
              className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Profile
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="First Name" value={profile.firstName} />
            <Field label="Last Name" value={profile.lastName} />
            <Field label="Email" value={profile.email} />
            <Field label="Date of Birth" value={profile.dob ? new Date(profile.dob).toLocaleDateString() : ""} />
            <Field label="Address" value={profile.address} full />
            <Field label="Location" value={profile.location} full />
            <Field label="Profession" value={profile.profession} />
            <Field label="Company Name" value={profile.companyName} />
            <Field label="Company Details" value={profile.companyDetails} full />
            <Field label="Education" value={profile.education} full />
            <Field label="Skills" value={profile.skills} full />
            <Field label="Hobbies" value={profile.hobbies} full />
            <Field label="Website" value={profile.website} full />
            <Field label="Bio" value={profile.bio} full />
          </div>
        )}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-5 py-2 bg-gray-100 border rounded-md hover:bg-gray-200"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => router.push("/Profile/update")}
            className="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, full }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="block text-sm font-medium text-gray-500">{label}</label>
      <div className="mt-1 px-3 py-2 rounded-md border bg-gray-50 text-gray-800 min-h-[42px]">
        {value || "—"}
      </div>
    </div>
  );
}
