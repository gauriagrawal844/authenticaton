"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const empty = {
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
};

export default function UpdateProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(empty);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const init = async () => {
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) {
          router.replace(`/login?next=${encodeURIComponent("/profile/update")}`);
          return;
        }
        const res = await fetch("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setForm({
            ...empty,
            ...data,
            dob: data.dob ? new Date(data.dob).toISOString().slice(0, 10) : "",
          });
        }
      } catch {
        setErr("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [router]);

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setMsg("");
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save profile");
      setMsg("Profile updated successfully");
      setTimeout(() => router.push("/dashboard"), 1200);
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-sky-100 via-white to-sky-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-sky-500 border-solid"></div>
      </div>
    );

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-sky-100 via-white to-sky-50 p-6 relative overflow-hidden">
      {/* background decorative blobs */}
      <div className="absolute -top-20 -right-20 w-72 h-72 bg-sky-300 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply blur-3xl opacity-30 animate-pulse"></div>

      <div className="w-full max-w-3xl bg-white/70 backdrop-blur-lg border border-sky-100 shadow-2xl rounded-3xl p-10 relative z-10">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-sky-700 tracking-tight">
          ✏️ Update Your Profile
        </h1>

        {err && (
          <p className="text-red-600 text-sm mb-4 text-center bg-red-50 py-2 rounded-md">
            {err}
          </p>
        )}
        {msg && (
          <p className="text-green-600 text-sm mb-4 text-center bg-green-50 py-2 rounded-md">
            {msg}
          </p>
        )}

        <form onSubmit={onSubmit} className="space-y-10">
          <FormSection title="Personal Information">
            <Grid>
              <Input label="First Name" name="firstName" value={form.firstName} onChange={onChange} />
              <Input label="Last Name" name="lastName" value={form.lastName} onChange={onChange} />
              <Input label="Email" type="email" name="email" value={form.email} onChange={onChange} />
              <Input label="Date of Birth" type="date" name="dob" value={form.dob} onChange={onChange} />
              <Input label="Address" name="address" value={form.address} onChange={onChange} full />
              <Input label="Location" name="location" value={form.location} onChange={onChange} full />
            </Grid>
          </FormSection>

          <FormSection title="Professional Details">
            <Grid>
              <Input label="Profession" name="profession" value={form.profession} onChange={onChange} />
              <Input label="Company Name" name="companyName" value={form.companyName} onChange={onChange} />
              <TextArea label="Company Details" name="companyDetails" value={form.companyDetails} onChange={onChange} full />
              <Input label="Education" name="education" value={form.education} onChange={onChange} full />
              <Input label="Skills" name="skills" value={form.skills} onChange={onChange} full />
            </Grid>
          </FormSection>

          <FormSection title="Additional Information">
            <Grid>
              <Input label="Hobbies" name="hobbies" value={form.hobbies} onChange={onChange} full />
              <Input label="Website" type="url" name="website" value={form.website} onChange={onChange} full />
              <TextArea label="Bio" name="bio" value={form.bio} onChange={onChange} full />
            </Grid>
          </FormSection>

          <button
            type="submit"
            className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-xl shadow-md hover:shadow-lg transform transition-all duration-200"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => router.push("/dashboard")}
            className="px-5 py-2 bg-gray-100 border rounded-md shadow-sm hover:bg-gray-200 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

/* —————— Subcomponents —————— */
function FormSection({ title, children }) {
  return (
    <div className="bg-gradient-to-br from-white to-sky-50 border border-sky-100 shadow-sm hover:shadow-md rounded-2xl p-6 transition-all">
      <h2 className="text-lg font-semibold mb-4 text-sky-700 border-b pb-2">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Grid({ children }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>;
}

function Input({ label, full, ...props }) {
  return (
    <div className={`${full ? "md:col-span-2" : ""} group relative`}>
      <label className="block text-sm font-medium text-gray-500 mb-1 group-hover:text-sky-600 transition">
        {label}
      </label>
      <input
        {...props}
        className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-gray-50 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition-all shadow-inner hover:shadow-md`}
      />
    </div>
  );
}

function TextArea({ label, full, ...props }) {
  return (
    <div className={`${full ? "md:col-span-2" : ""} group relative`}>
      <label className="block text-sm font-medium text-gray-500 mb-1 group-hover:text-sky-600 transition">
        {label}
      </label>
      <textarea
        rows={props.rows || 3}
        {...props}
        className={`w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-700 bg-gray-50 focus:ring-2 focus:ring-sky-400 focus:border-sky-400 outline-none transition-all shadow-inner hover:shadow-md`}
      />
    </div>
  );
}
