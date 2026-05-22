"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Marketplace", href: "/marketplace" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "For Agents", href: "/#for-agents" },
];

export default function Navbar({ transparent = false }: { transparent?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = !transparent || scrolled;

  return (
    <>
      <motion.header
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          solid
            ? "bg-white/95 backdrop-blur-md border-b border-[#e2e8f0] shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1 group">
            <span
              className={cn(
                "text-2xl font-black tracking-tight transition-colors duration-300",
                solid ? "text-[#0b1f5c]" : "text-white"
              )}
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Rent
            </span>
            <span
              className="text-2xl font-black tracking-tight text-[#19d3c5]"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              ara
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors duration-200 hover:text-[#19d3c5]",
                  solid ? "text-[#6b7a99]" : "text-white/80"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className={cn(
                "text-sm font-medium px-4 py-2 rounded-lg transition-colors",
                solid
                  ? "text-[#0b1f5c] hover:bg-[#f5f7fa]"
                  : "text-white/90 hover:text-white"
              )}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold px-5 py-2 rounded-lg bg-[#19d3c5] text-[#0b1f5c] hover:bg-[#0fb5a8] transition-colors"
            >
              Get started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              "md:hidden p-2 rounded-lg transition-colors",
              solid ? "text-[#0b1f5c] hover:bg-[#f5f7fa]" : "text-white"
            )}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-40 bg-[#0b1f5c] flex flex-col pt-20 px-6 md:hidden"
          >
            <nav className="flex flex-col gap-2 mt-4">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-xl font-semibold text-white/80 hover:text-[#19d3c5] py-3 border-b border-white/10 transition-colors"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="flex flex-col gap-3 mt-8">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="text-center py-3 rounded-xl border border-white/20 text-white font-medium"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="text-center py-3 rounded-xl bg-[#19d3c5] text-[#0b1f5c] font-semibold"
              >
                Get started free
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
