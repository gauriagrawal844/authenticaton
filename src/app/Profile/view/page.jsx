"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Briefcase,
  MapPin,
  Globe,
  Heart,
  GraduationCap,
  Building,
  FileText,
} from "lucide-react";

export default function ViewProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) {
          router.replace(`/login?next=${encodeURIComponent("/Profile/view")}`);
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

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-500 border-solid"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-50 py-12 px-4 flex justify-center">
      <div className="w-full max-w-5xl bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl p-10 border border-indigo-100 relative overflow-hidden">

        {/* Decorative gradient blob */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>

        {/* Header */}
        <div className="text-center relative z-10">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-tr from-indigo-400 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg mb-4">
            {profile?.firstName?.[0]?.toUpperCase() || "U"}
          </div>
          <h1 className="text-3xl font-extrabold text-indigo-700">
            {profile?.firstName} {profile?.lastName}
          </h1>
          <p className="text-gray-500 flex justify-center items-center gap-2 mt-1">
            <Mail size={18} /> {profile?.email}
          </p>
        </div>

        {err && (
          <p className="text-red-600 text-sm mt-4 mb-4 text-center bg-red-50 py-2 rounded-md">
            {err}
          </p>
        )}

        {!profile ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-6">No profile found yet.</p>
            <button
              onClick={() => router.push("/createProfile")}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
            >
              Create Profile
            </button>
          </div>
        ) : (
          <>
            {/* Profile Sections */}
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
              {/* Personal Info Card */}
              <InfoCard title="Personal Information">
                <Field label="Date of Birth" value={profile.dob ? new Date(profile.dob).toLocaleDateString() : ""} icon={<FileText />} />
                <Field label="Address" value={profile.address} icon={<MapPin />} />
                <Field label="Location" value={profile.location} icon={<MapPin />} />
              </InfoCard>

              {/* Professional Info Card */}
              <InfoCard title="Professional Details">
                <Field label="Profession" value={profile.profession} icon={<Briefcase />} />
                <Field label="Company Name" value={profile.companyName} icon={<Building />} />
                <Field label="Company Details" value={profile.companyDetails} icon={<FileText />} />
              </InfoCard>

              {/* Education & Skills */}
              <InfoCard title="Education & Skills">
                <Field label="Education" value={profile.education} icon={<GraduationCap />} />
                <Field label="Skills" value={profile.skills} icon={<FileText />} />
              </InfoCard>

              {/* Hobbies & Web */}
              <InfoCard title="More About You">
                <Field label="Hobbies" value={profile.hobbies} icon={<Heart />} />
                <Field label="Website" value={profile.website} icon={<Globe />} />
                <Field label="Bio" value={profile.bio} icon={<FileText />} />
              </InfoCard>
            </div>
          </>
        )}

        {/* Buttons */}
        <div className="mt-12 flex justify-center gap-6">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-6 py-3 bg-gray-100 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-200 transition"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => router.push("/Profile/update")}
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ title, children }) {
  return (
    <div className="bg-gradient-to-br from-white to-indigo-50 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 p-5">
      <h2 className="text-lg font-semibold text-indigo-700 mb-3 border-b pb-1">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, value, icon }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">{icon} {label}</div>
      <div className="px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-800 shadow-inner">
        {value || "—"}
      </div>
    </div>
  );
}
