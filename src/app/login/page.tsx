"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";
import { SAMPLE_LISTINGS } from "@/lib/seed-data";
import { formatIDR } from "@/lib/utils";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginForm) {
    setLoading(true);
    setAuthError("");
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword(data);
      if (error) {
        setAuthError(error.message);
      } else {
        router.push("/renter");
      }
    } catch {
      setAuthError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const previewListings = SAMPLE_LISTINGS.slice(0, 3);

  return (
    <div className="min-h-screen flex">
      {/* Left — brand panel */}
      <div className="hidden lg:flex lg:w-[55%] bg-[#070f2e] relative overflow-hidden flex-col justify-between p-12">
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#19d3c5]/08 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-[#122470]/60 blur-3xl animate-pulse [animation-delay:1s]" />

        {/* Logo */}
        <Link href="/" className="relative z-10 flex items-center">
          <span className="text-2xl font-black text-white" style={{ fontFamily: "Poppins, sans-serif" }}>
            Rent
          </span>
          <span className="text-2xl font-black text-[#19d3c5]" style={{ fontFamily: "Poppins, sans-serif" }}>
            ara
          </span>
        </Link>

        {/* Floating property cards */}
        <div className="relative z-10 space-y-3">
          {previewListings.map((listing, i) => (
            <motion.div
              key={listing.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
              className="bg-white/8 backdrop-blur border border-white/10 rounded-2xl p-4 flex items-center gap-4"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#19d3c5]/30 to-[#0b1f5c] flex items-center justify-center">
                <span className="text-white/60 text-xs font-bold">{listing.area[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate">{listing.title}</p>
                <p className="text-[#19d3c5] text-xs">{formatIDR(listing.price_monthly)}/bln</p>
              </div>
              {listing.is_verified && <ShieldCheck size={16} className="text-[#19d3c5] shrink-0" />}
            </motion.div>
          ))}
        </div>

        {/* Tagline */}
        <div className="relative z-10">
          <h2
            className="text-4xl font-black text-white leading-tight mb-3"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Jakarta rental
            <br />
            market.{" "}
            <span className="text-[#19d3c5]">Fixed.</span>
          </h2>
          <p className="text-white/40 text-sm">
            Verified listings · Real agents · Zero scams
          </p>
        </div>
      </div>

      {/* Right — form panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <Link href="/" className="flex items-center mb-8 lg:hidden">
            <span className="text-2xl font-black text-[#0b1f5c]" style={{ fontFamily: "Poppins, sans-serif" }}>
              Rent
            </span>
            <span className="text-2xl font-black text-[#19d3c5]" style={{ fontFamily: "Poppins, sans-serif" }}>
              ara
            </span>
          </Link>

          <h1
            className="text-3xl font-black text-[#0b1f5c] mb-2"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Welcome back
          </h1>
          <p className="text-[#6b7a99] mb-8">Sign in to your Rentara account</p>

          {/* Google OAuth */}
          <button
            onClick={async () => {
              const supabase = createClient();
              await supabase.auth.signInWithOAuth({ provider: "google" });
            }}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border-2 border-[#e2e8f0] text-[#0b1f5c] font-medium text-sm hover:border-[#19d3c5] hover:bg-[#f5f7fa] transition-all mb-6"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[#e2e8f0]" />
            <span className="text-xs text-[#6b7a99] font-medium">OR</span>
            <div className="flex-1 h-px bg-[#e2e8f0]" />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0b1f5c] mb-1.5">
                Email address
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                className={cn(
                  "w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#19d3c5] transition-colors",
                  errors.email ? "border-red-400" : "border-[#e2e8f0]"
                )}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0b1f5c] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={cn(
                    "w-full px-4 py-3 pr-10 rounded-xl border text-sm focus:outline-none focus:border-[#19d3c5] transition-colors",
                    errors.password ? "border-red-400" : "border-[#e2e8f0]"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7a99] hover:text-[#0b1f5c]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {authError && (
              <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#0b1f5c] text-white font-bold text-sm hover:bg-[#122470] transition-colors disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
              {!loading && <ArrowRight size={16} />}
            </button>
          </form>

          <p className="text-center text-sm text-[#6b7a99] mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-[#19d3c5] font-semibold hover:underline">
              Sign up free
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
