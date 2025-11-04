"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateProfilePage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dob: "",
    address: "",
    location: "",
    companyName: "",
    companyDetails: "",
    profession: "",
    education: "",
    skills: "",
    hobbies: "",
    website: "",
    bio: "",
  });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace(`/login?next=${encodeURIComponent("/createProfile")}`);
    }
  }, [router]);

  const onChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/create-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Profile creation failed");
      router.push("/dashboard");
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 p-4">
      <div className="w-full max-w-2xl bg-white shadow-2xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-700">
          Create Your Professional Profile
        </h1>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Personal Information */}
          <div>
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">First Name</label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={onChange}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Last Name</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={onChange}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your last name"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={onChange}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={onChange}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-medium mb-1">Address</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={onChange}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your address"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-medium mb-1">Location</label>
                <input
                  name="location"
                  value={form.location}
                  onChange={onChange}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  placeholder="City, Country"
                />
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div>
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">
              Professional Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium mb-1">Profession</label>
                <input
                  name="profession"
                  value={form.profession}
                  onChange={onChange}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  placeholder="Your current role"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Company Name</label>
                <input
                  name="companyName"
                  value={form.companyName}
                  onChange={onChange}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  placeholder="Company you work at"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-medium mb-1">
                  Company Details
                </label>
                <textarea
                  name="companyDetails"
                  rows="3"
                  value={form.companyDetails}
                  onChange={onChange}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  placeholder="Brief about your company..."
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-medium mb-1">Education</label>
                <input
                  name="education"
                  value={form.education}
                  onChange={onChange}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  placeholder="Your highest qualification"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block font-medium mb-1">Skills</label>
                <input
                  name="skills"
                  value={form.skills}
                  onChange={onChange}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  placeholder="E.g. React, Node.js, Communication, Leadership"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h2 className="text-lg font-semibold mb-4 border-b pb-2">
              Additional Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Hobbies</label>
                <input
                  name="hobbies"
                  value={form.hobbies}
                  onChange={onChange}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  placeholder="Your interests or hobbies"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Website</label>
                <input
                  type="url"
                  name="website"
                  value={form.website}
                  onChange={onChange}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  placeholder="https://yourportfolio.com"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Bio</label>
                <textarea
                  name="bio"
                  rows="3"
                  value={form.bio}
                  onChange={onChange}
                  className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  placeholder="Tell us more about yourself..."
                />
              </div>
            </div>
          </div>

          {err && <p className="text-red-600 text-sm mt-2">{err}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all"
            disabled={loading}
          >
            {loading ? "Saving Profile..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
