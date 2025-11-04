"use client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-100">

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">
          Welcome to <span className="text-blue-600">AuthFlow</span>
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mb-8">
          A secure authentication system built with Next.js, Prisma, and PostgreSQL — including
          email verification, OTP login, and password reset functionality.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => router.push("/signup")}
            className="px-6 py-3 bg-blue-600 text-white text-lg rounded-lg hover:bg-blue-700 transition"
          >
            Get Started
          </button>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-3 bg-white border border-gray-300 text-gray-700 text-lg rounded-lg hover:bg-gray-100 transition"
          >
            Already Have an Account
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full text-center py-4 text-gray-500 text-sm">
        © {new Date().getFullYear()} AuthFlow App — Built with ❤️ using Next.js & Prisma
      </footer>
    </div>
  );
}
