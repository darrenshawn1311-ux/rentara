"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const signupSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["renter", "agent"]),
  whatsapp: z.string().optional(),
  agency_name: z.string().optional(),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: "renter" },
  });

  const role = watch("role");

  async function onSubmit(data: SignupForm) {
    setLoading(true);
    setAuthError("");
    try {
      const supabase = createClient();
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { full_name: data.full_name, role: data.role },
        },
      });

      if (signUpError) {
        setAuthError(signUpError.message);
        return;
      }

      if (authData.user) {
        await supabase.from("profiles").upsert({
          id: authData.user.id,
          full_name: data.full_name,
          email: data.email,
          phone_whatsapp: data.whatsapp ?? null,
          role: data.role,
        });
      }

      setSuccess(true);
    } catch {
      setAuthError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f7fa] p-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-sm border border-[#e2e8f0]"
        >
          <CheckCircle2 size={48} className="text-[#19d3c5] mx-auto mb-4" />
          <h2
            className="text-2xl font-black text-[#0b1f5c] mb-3"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Check your email
          </h2>
          <p className="text-[#6b7a99] mb-6">
            We sent a confirmation link to your inbox. Click it to activate your Rentara account.
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-3 rounded-xl bg-[#0b1f5c] text-white font-semibold text-sm"
          >
            Back to login
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left — brand panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#070f2e] relative overflow-hidden flex-col justify-between p-12">
        <div className="absolute top-1/3 left-1/3 w-72 h-72 rounded-full bg-[#19d3c5]/06 blur-3xl animate-pulse" />

        <Link href="/" className="relative z-10 flex items-center">
          <span className="text-2xl font-black text-white" style={{ fontFamily: "Poppins, sans-serif" }}>
            Rent
          </span>
          <span className="text-2xl font-black text-[#19d3c5]" style={{ fontFamily: "Poppins, sans-serif" }}>
            ara
          </span>
        </Link>

        <div className="relative z-10 space-y-4">
          {[
            "Photos verified every 30 days",
            "Agents respond within 48 hours",
            "Full price transparency",
            "Zero hidden fees",
          ].map((benefit, i) => (
            <motion.div
              key={benefit}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-3"
            >
              <div className="w-6 h-6 rounded-full bg-[#19d3c5]/20 flex items-center justify-center shrink-0">
                <CheckCircle2 size={13} className="text-[#19d3c5]" />
              </div>
              <p className="text-white/70 text-sm">{benefit}</p>
            </motion.div>
          ))}
        </div>

        <div className="relative z-10">
          <p className="text-white/30 text-sm">Join 1,200+ Jakarta renters and agents.</p>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md py-8"
        >
          <Link href="/" className="flex items-center mb-8 lg:hidden">
            <span className="text-2xl font-black text-[#0b1f5c]" style={{ fontFamily: "Poppins, sans-serif" }}>Rent</span>
            <span className="text-2xl font-black text-[#19d3c5]" style={{ fontFamily: "Poppins, sans-serif" }}>ara</span>
          </Link>

          <h1
            className="text-3xl font-black text-[#0b1f5c] mb-2"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Create account
          </h1>
          <p className="text-[#6b7a99] mb-8">Free forever for renters.</p>

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

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-[#f5f7fa] rounded-xl">
            {(["renter", "agent"] as const).map((r) => (
              <label key={r} className="cursor-pointer">
                <input {...register("role")} type="radio" value={r} className="sr-only" />
                <div
                  className={cn(
                    "py-2.5 rounded-lg text-center text-sm font-semibold transition-all",
                    role === r
                      ? "bg-white text-[#0b1f5c] shadow-sm"
                      : "text-[#6b7a99]"
                  )}
                >
                  {r === "renter" ? "🏠 Renter" : "🏢 Agent"}
                </div>
              </label>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#0b1f5c] mb-1.5">Full name</label>
              <input
                {...register("full_name")}
                placeholder="Budi Santoso"
                className={cn(
                  "w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#19d3c5] transition-colors",
                  errors.full_name ? "border-red-400" : "border-[#e2e8f0]"
                )}
              />
              {errors.full_name && <p className="text-red-500 text-xs mt-1">{errors.full_name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0b1f5c] mb-1.5">Email</label>
              <input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                className={cn(
                  "w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#19d3c5] transition-colors",
                  errors.email ? "border-red-400" : "border-[#e2e8f0]"
                )}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#0b1f5c] mb-1.5">Password</label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  className={cn(
                    "w-full px-4 py-3 pr-10 rounded-xl border text-sm focus:outline-none focus:border-[#19d3c5] transition-colors",
                    errors.password ? "border-red-400" : "border-[#e2e8f0]"
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7a99]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Agent-specific fields */}
            {role === "agent" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-4 overflow-hidden"
              >
                <div>
                  <label className="block text-sm font-medium text-[#0b1f5c] mb-1.5">WhatsApp number</label>
                  <input
                    {...register("whatsapp")}
                    placeholder="628xxxxxxxx"
                    className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#19d3c5]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#0b1f5c] mb-1.5">Agency name</label>
                  <input
                    {...register("agency_name")}
                    placeholder="Your agency or brokerage"
                    className="w-full px-4 py-3 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#19d3c5]"
                  />
                </div>
              </motion.div>
            )}

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
              {loading ? "Creating account..." : "Create account"}
              {!loading && <ArrowRight size={16} />}
            </button>

            <p className="text-xs text-[#6b7a99] text-center">
              By signing up you agree to our{" "}
              <a href="#" className="underline">Terms</a> and{" "}
              <a href="#" className="underline">Privacy Policy</a>
            </p>
          </form>

          <p className="text-center text-sm text-[#6b7a99] mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-[#19d3c5] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
