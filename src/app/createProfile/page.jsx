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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 p-6">
      <div className="w-full max-w-3xl bg-white shadow-2xl rounded-2xl p-8 border border-blue-100 transition-all duration-300 hover:shadow-blue-200">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-blue-700">
          Create Your Professional Profile
        </h1>

        <form onSubmit={onSubmit} className="space-y-8">
          {/* Personal Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="First Name" name="firstName" value={form.firstName} onChange={onChange} placeholder="Enter your first name" />
              <Input label="Last Name" name="lastName" value={form.lastName} onChange={onChange} placeholder="Enter your last name" />
              <Input type="email" label="Email" name="email" value={form.email} onChange={onChange} placeholder="your@email.com" />
              <Input type="date" label="Date of Birth" name="dob" value={form.dob} onChange={onChange} />
              <Input className="md:col-span-2" label="Address" name="address" value={form.address} onChange={onChange} placeholder="Enter your address" />
              <Input className="md:col-span-2" label="Location" name="location" value={form.location} onChange={onChange} placeholder="City, Country" />
            </div>
          </div>

          {/* Professional Details */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
              Professional Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Profession" name="profession" value={form.profession} onChange={onChange} placeholder="Your current role" />
              <Input label="Company Name" name="companyName" value={form.companyName} onChange={onChange} placeholder="Company you work at" />
              <Textarea className="md:col-span-2" label="Company Details" name="companyDetails" rows="3" value={form.companyDetails} onChange={onChange} placeholder="Brief about your company..." />
              <Input className="md:col-span-2" label="Education" name="education" value={form.education} onChange={onChange} placeholder="Your highest qualification" />
              <Input className="md:col-span-2" label="Skills" name="skills" value={form.skills} onChange={onChange} placeholder="E.g. React, Node.js, Communication, Leadership" />
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
              Additional Information
            </h2>
            <div className="space-y-4">
              <Input label="Hobbies" name="hobbies" value={form.hobbies} onChange={onChange} placeholder="Your interests or hobbies" />
              <Input type="url" label="Website" name="website" value={form.website} onChange={onChange} placeholder="https://yourportfolio.com" />
              <Textarea label="Bio" name="bio" rows="3" value={form.bio} onChange={onChange} placeholder="Tell us more about yourself..." />
            </div>
          </div>

          {err && (
            <p className="text-red-600 text-sm mt-2 bg-red-50 p-2 rounded-md border border-red-200">
              ⚠️ {err}
            </p>
          )}

          <button
            type="submit"
            className={`w-full text-lg font-semibold py-3 rounded-lg transition-all ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
            }`}
            disabled={loading}
          >
            {loading ? "Saving Profile..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ✅ Reusable Input component
function Input({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
}) {
  return (
    <div className={className}>
      <label className="block font-medium mb-1 text-gray-700">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition-all duration-200"
      />
    </div>
  );
}

// ✅ Reusable Textarea component
function Textarea({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 3,
  className = "",
}) {
  return (
    <div className={className}>
      <label className="block font-medium mb-1 text-gray-700">{label}</label>
      <textarea
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none transition-all duration-200"
      />
    </div>
  );
}
