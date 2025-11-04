"use client";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-blue-50 to-white relative overflow-hidden">

      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 -right-20 w-80 h-80 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-700"></div>
      </div>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center text-center p-6">
        <div className=" backdrop-blur-xl rounded-2xlp-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 text-gray-900">
            Welcome to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
              AuthFlow
            </span>
          </h1>

          <p className="text-lg text-gray-700 leading-relaxed max-w-xl mx-auto mb-8">
            A modern, secure authentication system built with{" "}
            <span className="font-semibold text-blue-600">Next.js</span>,{" "}
            <span className="font-semibold text-indigo-600">Prisma</span>, and{" "}
            <span className="font-semibold text-blue-500">PostgreSQL</span> — complete with
            email verification, OTP login, and password reset functionality.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => router.push("/signup")}
              className="px-8 py-3 text-lg font-semibold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
            >
              Get Started
            </button>

            <button
              onClick={() => router.push("/login")}
              className="px-8 py-3 text-lg font-semibold rounded-xl border border-gray-300 text-gray-700 bg-white/60 hover:bg-gray-100 shadow-sm transition-all duration-300 transform hover:scale-105"
            >
              Already Have an Account
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full text-center py-6 text-gray-500 text-sm">
        <div className="w-2/3 mx-auto h-[1px] bg-gradient-to-r from-transparent via-gray-300 to-transparent mb-3"></div>
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-gray-700">AuthFlow</span> — Built with ❤️ using{" "}
        <span className="text-blue-600">Next.js</span> &{" "}
        <span className="text-indigo-600">Prisma</span>
      </footer>
    </div>
  );
}
