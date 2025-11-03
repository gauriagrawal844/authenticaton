"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateProfilePage() {
  const [form, setForm] = useState({ bio: "", location: "", profession: "" });
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Create Your Profile</h1>
        <form onSubmit={onSubmit}>
          <div>
            <label className="block font-medium mb-1">Bio</label>
            <textarea
              name="bio"
              rows="3"
              value={form.bio}
              onChange={onChange}
              placeholder="Tell us about yourself..."
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Location</label>
            <input name="location" value={form.location} onChange={onChange} />
          </div>
          <div>
            <label className="block font-medium mb-1">Profession</label>
            <input name="profession" value={form.profession} onChange={onChange} />
          </div>
          {err && <p className="text-red-600 text-sm mt-2">{err}</p>}
          <button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
