"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // { name, email }

  const loadUser = useCallback(async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      const res = await fetch("/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("unauth");
      const data = await res.json();
      setUser(data);
    } catch (_) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser, pathname]);

  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "token") {
        loadUser();
      }
    };
    if (typeof window !== "undefined") {
      window.addEventListener("storage", onStorage);
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", onStorage);
      }
    };
  }, [loadUser]);

  const logout = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
    setUser(null);
    router.push("/");
  };

  return (
    <header className="sticky top-0 left-0 w-full flex justify-between items-center p-6 bg-white/70 backdrop-blur z-50 shadow-sm">
      <h1
        className="text-2xl font-bold text-blue-700 cursor-pointer"
        onClick={() => router.push("/")}
      >
        AuthFlow App
      </h1>
      <nav className="space-x-4">
        {loading ? null : user ? (
          <>
            <span className="text-gray-700">Hi, {user.name || user.email}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/signup")}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition"
            >
              Sign Up
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
