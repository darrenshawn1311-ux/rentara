"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  animate,
  useInView,
  type Variants,
} from "framer-motion";
import {
  ArrowDown,
  CheckCircle2,
  Search,
  ShieldCheck,
  MessageCircle,
  Star,
  ChevronDown,
  ChevronUp,
  Bed,
  Bath,
  Maximize2,
  MapPin,
  PawPrint,
} from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import VerifiedBadge from "@/components/ui/VerifiedBadge";
import { AgentCard } from "@/components/agents/AgentCard";
import { UserSegmentModal } from "@/components/shared/UserSegmentModal";
import { useIntent } from "@/lib/IntentContext";
import { useLang } from "@/lib/i18n/LanguageContext";
import { formatIDR, cn } from "@/lib/utils";
import { SAMPLE_LISTINGS } from "@/lib/seed-data";
import { AGENTS } from "@/lib/agents";
import { createClient } from "@/lib/supabase";

/* ─── Animation variants ──────────────────────────────────────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
};

/* ─── Floating property card ──────────────────────────────────────── */
function FloatingCard({
  listing,
  delay,
  x,
  y,
}: {
  listing: (typeof SAMPLE_LISTINGS)[0];
  delay: number;
  x: string;
  y: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: [0, -8, 0] }}
      transition={{
        opacity: { delay, duration: 0.6 },
        y: { delay, duration: 4, repeat: Infinity, ease: "easeInOut" },
      }}
      className="absolute hidden lg:block"
      style={{ left: x, top: y }}
    >
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 w-56 shadow-2xl">
        <div className="h-24 rounded-xl bg-gradient-to-br from-[#19d3c5]/30 to-[#0b1f5c]/60 mb-3 flex items-end p-2">
          <span className="text-xs font-bold text-white/60 uppercase tracking-widest">
            {listing.area}
          </span>
        </div>
        <p className="text-white text-sm font-semibold leading-snug line-clamp-1 mb-1">
          {listing.title}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[#19d3c5] text-sm font-bold">
            {formatIDR(listing.price_monthly).replace("Rp ", "Rp ")}
          </span>
          {listing.is_verified && (
            <ShieldCheck size={14} className="text-[#19d3c5]" />
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Animated counter ────────────────────────────────────────────── */
function Counter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(count, target, { duration: 2, ease: "easeOut" });
    const unsub = count.on("change", (v) => {
      if (ref.current) ref.current.textContent = Math.round(v).toLocaleString() + suffix;
    });
    return () => {
      controls.stop();
      unsub();
    };
  }, [inView, target, count, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

/* ─── FAQ Item ────────────────────────────────────────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[#e2e8f0]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-semibold text-[#0b1f5c] text-base pr-4">{q}</span>
        {open ? (
          <ChevronUp size={18} className="shrink-0 text-[#19d3c5]" />
        ) : (
          <ChevronDown size={18} className="shrink-0 text-[#6b7a99]" />
        )}
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
      >
        <p className="pb-5 text-[#6b7a99] leading-relaxed text-sm">{a}</p>
      </motion.div>
    </div>
  );
}

/* ─── Main page ───────────────────────────────────────────────────── */
export default function HomePage() {
  const router = useRouter();
  const { setIntent } = useIntent();
  const { t } = useLang();

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const [waitlistSubmitted, setWaitlistSubmitted] = useState(false);
  const [waitlistLoading, setWaitlistLoading] = useState(false);
  const [waitlistForm, setWaitlistForm] = useState({
    full_name: "",
    email: "",
    whatsapp: "",
    preferred_area: "",
    rental_budget: "",
  });

  async function handleWaitlist(e: React.FormEvent) {
    e.preventDefault();
    setWaitlistLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("waitlist").insert([{
        full_name: waitlistForm.full_name,
        email: waitlistForm.email,
        whatsapp: waitlistForm.whatsapp,
        preferred_area: waitlistForm.preferred_area || null,
        rental_budget: waitlistForm.rental_budget || null,
      }]);
      if (!error) setWaitlistSubmitted(true);
    } catch {
      // Demo mode: show success anyway
      setWaitlistSubmitted(true);
    } finally {
      setWaitlistLoading(false);
    }
  }

  const trustStats = [
    "2,400+ Verified Listings",
    "100% Scam-Free Guarantee",
    "48hr Response Time",
    "500+ Licensed Agents",
    "Jaksel · Kemang · SCBD · Menteng · BSD · PIK",
  ];

  const painPoints = [
    { icon: "🚫", title: "Fake photos from 3 years ago", desc: "You show up and the property looks nothing like the listing." },
    { icon: "🚫", title: "Agents who ghost after WhatsApp", desc: "You send a message, they read it — and disappear for weeks." },
    { icon: "🚫", title: "Hidden fees on signing day", desc: "The real price drops on you after you've already committed." },
    { icon: "🚫", title: '"Available" listings already rented', desc: "Bait listings that waste your time and energy." },
  ];

  const solutions = [
    { stat: 30, suffix: "d", label: "Photo verification", desc: "Every photo verified within the last 30 days — or the listing is removed." },
    { stat: 48, suffix: "h", label: "Agent response SLA", desc: "Agents who don't reply in 48 hours get flagged and de-ranked." },
    { stat: 100, suffix: "%", label: "Price transparency", desc: "Full cost breakdown before you ever visit the property." },
    { stat: 0, suffix: " scams", label: "Zero tolerance", desc: "Real-time availability sync and identity-verified agents only." },
  ];

  const steps = [
    { num: "01", icon: <Search size={24} />, title: "Browse", desc: "Search thousands of verified listings by area, budget, and lifestyle." },
    { num: "02", icon: <ShieldCheck size={24} />, title: "Filter & Verify", desc: "Filter for verified listings with up-to-date photos and confirmed availability." },
    { num: "03", icon: <Star size={24} />, title: "Compare", desc: "Save favourites, compare side-by-side, and read agent reviews." },
    { num: "04", icon: <MessageCircle size={24} />, title: "WhatsApp Agent", desc: "Connect directly via WhatsApp — no intermediaries, no hidden fees." },
  ];

  const areas = [
    { name: "SCBD", tag: "Business District", count: 340 },
    { name: "Kemang", tag: "Expat Favourite", count: 218 },
    { name: "Menteng", tag: "Historic & Central", count: 156 },
    { name: "Pondok Indah", tag: "Luxury Residential", count: 204 },
    { name: "BSD City", tag: "Modern Township", count: 289 },
    { name: "PIK", tag: "Waterfront Living", count: 172 },
    { name: "Kelapa Gading", tag: "Family-Friendly", count: 195 },
    { name: "Senayan", tag: "Lifestyle Hub", count: 127 },
  ];

  const testimonials = [
    {
      name: "Anisa Rahmawati",
      role: "Marketing Manager, Jakarta",
      quote: "Found my Kemang apartment in 3 days. The agent responded in 2 hours and the photos were exactly what I saw on arrival. First time I haven't been deceived renting in Jakarta.",
      stars: 5,
    },
    {
      name: "David Chen",
      role: "Expat, Financial Services",
      quote: "As an expat unfamiliar with Jakarta's neighbourhoods, Rentara's area guides and verified agent network made the whole process stress-free. Highly recommend.",
      stars: 5,
    },
    {
      name: "Rizki Pratama",
      role: "Startup Founder, Jakarta",
      quote: "Listed my property on Rentara and had qualified inquiries within 24 hours. The verification process gave tenants confidence and filled my unit fast.",
      stars: 5,
    },
  ];

  const faqs = [
    { q: "How does Rentara verify listings?", a: "Our team physically inspects each property and re-verifies photos every 30 days. Any listing with outdated or misleading photos is immediately suspended." },
    { q: "Are agents on Rentara licensed?", a: "Yes. Every agent must submit their SBN (Surat Bukti Nomor) license and pass identity verification before listing on Rentara." },
    { q: "Is Rentara free for renters?", a: "Completely free for renters. We earn revenue from agents who list properties. There are no hidden charges, admin fees, or commissions from tenants." },
    { q: "What areas does Rentara cover?", a: "We currently cover all major Jakarta areas including SCBD, Kemang, Menteng, Pondok Indah, Kelapa Gading, BSD, PIK, Gading Serpong, and more." },
    { q: "How do I contact an agent?", a: "Once you find a listing you like, click 'Chat on WhatsApp' to connect directly with the agent. No call centres or delays." },
    { q: "What is the 48-hour response guarantee?", a: "Licensed agents on Rentara are contractually required to respond to inquiries within 48 hours. Agents who consistently fail are suspended from the platform." },
    { q: "Can I list my property on Rentara?", a: "Yes. Sign up as an agent, submit your license details, and our team will review your account within 24 hours. Listing creation takes under 10 minutes." },
    { q: "What happens if a listing is inaccurate?", a: "Report it via the listing page. Our team investigates within 24 hours, and confirmed inaccuracies result in immediate listing removal and agent warnings." },
  ];

  return (
    <div className="bg-white overflow-x-hidden">
      <Navbar transparent />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#070f2e]"
      >
        {/* Animated gradient orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[#19d3c5]/10 blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-[#0b1f5c]/60 blur-3xl animate-pulse [animation-delay:1s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#122470]/30 blur-3xl" />
        </div>

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Floating cards */}
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0">
          <FloatingCard listing={SAMPLE_LISTINGS[0]} delay={0.8} x="5%" y="20%" />
          <FloatingCard listing={SAMPLE_LISTINGS[1]} delay={1.1} x="75%" y="15%" />
          <FloatingCard listing={SAMPLE_LISTINGS[4]} delay={1.4} x="80%" y="60%" />
        </motion.div>

        {/* Hero content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24 pb-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 text-[#19d3c5] text-sm font-semibold tracking-widest uppercase mb-6 bg-[#19d3c5]/10 px-4 py-2 rounded-full border border-[#19d3c5]/20">
                <ShieldCheck size={14} />
                Jakarta&apos;s first verified rental marketplace
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-tight mb-6"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Jakarta rental
              <br />
              market.{" "}
              <span className="text-[#19d3c5]">Finally</span>
              <br />
              fixed.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg sm:text-xl text-white/60 max-w-xl mx-auto mb-10 leading-relaxed"
            >
              Verified listings. Real agents. Zero scams.
              <br />
              Find your Jakarta home without the usual chaos.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/marketplace"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#19d3c5] text-[#0b1f5c] font-bold text-base hover:bg-[#0fb5a8] transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Browse Listings
              </Link>
              <button
                onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-white/20 text-white font-semibold text-base hover:bg-white/10 transition-all"
              >
                Join Waitlist
              </button>
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mt-4 flex-wrap">
              <span className="text-blue-200/60 text-sm">or jump straight to:</span>
              <button
                onClick={() => { setIntent("renter"); router.push("/marketplace"); }}
                className="text-sm text-[#19d3c5] hover:text-[#4dddd1] underline underline-offset-2 transition-colors"
              >
                {t("segment.renter.label")}
              </button>
              <span className="text-blue-200/40">·</span>
              <button
                onClick={() => { setIntent("agent"); router.push("/agents/onboarding"); }}
                className="text-sm text-[#d9cbb8] hover:text-white underline underline-offset-2 transition-colors"
              >
                {t("segment.agent.label")}
              </button>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 8, 0] }}
          transition={{ delay: 2, duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 flex flex-col items-center gap-2"
        >
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ArrowDown size={16} />
        </motion.div>
      </section>

      {/* ── TRUST BAR ────────────────────────────────────────────── */}
      <div className="bg-[#0b1f5c] py-4 overflow-hidden">
        <div className="flex">
          <div className="marquee-track flex items-center gap-8 whitespace-nowrap">
            {[...trustStats, ...trustStats].map((stat, i) => (
              <span key={i} className="flex items-center gap-6">
                <span className="text-white/70 text-sm font-medium">{stat}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#19d3c5]" />
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── PAIN POINTS ──────────────────────────────────────────── */}
      <section className="py-24 bg-[#070f2e]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} className="text-[#19d3c5] text-sm font-semibold uppercase tracking-widest mb-3">
              The Problem
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl sm:text-5xl font-black text-white"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              The old way of renting
              <br />
              in Jakarta is{" "}
              <span className="text-red-400">broken.</span>
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {painPoints.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4, boxShadow: "0 0 40px rgba(25,211,197,0.08)" }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#19d3c5]/30 transition-colors"
              >
                <span className="text-3xl block mb-4">{p.icon}</span>
                <h3 className="font-bold text-white text-base mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                  {p.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOLUTION ─────────────────────────────────────────────── */}
      <section className="py-24 bg-[#f7f3ee]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
            >
              <motion.p variants={fadeUp} className="text-[#19d3c5] text-sm font-semibold uppercase tracking-widest mb-3">
                The Rentara Way
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="text-4xl sm:text-5xl font-black text-[#0b1f5c] mb-6"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Renting done
                <br />
                right. Finally.
              </motion.h2>
              <motion.p variants={fadeUp} className="text-[#6b7a99] text-lg leading-relaxed mb-8">
                We built the infrastructure Jakarta renters deserve — with verified agents, real-time availability, and zero tolerance for scams.
              </motion.p>
              <motion.div variants={fadeUp}>
                <Link
                  href="/marketplace"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0b1f5c] text-white font-semibold hover:bg-[#122470] transition-colors"
                >
                  Explore Listings
                </Link>
              </motion.div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              {solutions.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="bg-white rounded-2xl p-6 shadow-sm border border-[#e2e8f0]"
                >
                  <div
                    className="text-4xl font-black text-[#0b1f5c] mb-1"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    <Counter target={s.stat} suffix={s.suffix} />
                  </div>
                  <p className="text-[#19d3c5] text-xs font-semibold uppercase tracking-wide mb-2">{s.label}</p>
                  <p className="text-[#6b7a99] text-xs leading-relaxed">{s.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} className="text-[#19d3c5] text-sm font-semibold uppercase tracking-widest mb-3">
              Process
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl sm:text-5xl font-black text-[#0b1f5c]"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              From search to keys
              <br />
              in four steps.
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.6 }}
                className="relative"
              >
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-full h-px bg-gradient-to-r from-[#19d3c5]/40 to-transparent z-0" />
                )}
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-[#f5f7fa] flex items-center justify-center text-[#0b1f5c] mb-4">
                    {step.icon}
                  </div>
                  <div
                    className="text-5xl font-black text-[#e2e8f0] mb-2 leading-none"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {step.num}
                  </div>
                  <h3 className="font-bold text-[#0b1f5c] text-lg mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                    {step.title}
                  </h3>
                  <p className="text-[#6b7a99] text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROPERTY SHOWCASE ─────────────────────────────────────── */}
      <section className="py-24 bg-[#f5f7fa]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <motion.p variants={fadeUp} className="text-[#19d3c5] text-sm font-semibold uppercase tracking-widest mb-2">
                Featured
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="text-4xl sm:text-5xl font-black text-[#0b1f5c]"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Hand-picked
                <br />
                properties.
              </motion.h2>
            </div>
            <motion.div variants={fadeUp}>
              <Link
                href="/marketplace"
                className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-[#0b1f5c] hover:text-[#19d3c5] transition-colors"
              >
                View all listings →
              </Link>
            </motion.div>
          </motion.div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SAMPLE_LISTINGS.slice(0, 6).map((listing, i) => {
              const gradients: Record<string, string> = {
                SCBD: "from-[#0b1f5c] to-[#122470]",
                Kemang: "from-[#1a3a2a] to-[#2d5a40]",
                Menteng: "from-[#3a1a0b] to-[#5a2d1a]",
                BSD: "from-[#1a2a0b] to-[#2d4a1a]",
                PIK: "from-[#0b3a3a] to-[#1a5a5a]",
                "Pondok Indah": "from-[#2a1a3a] to-[#3d2d5a]",
              };
              const grad = gradients[listing.area] ?? "from-[#0b1f5c] to-[#122470]";
              const isBig = i === 0 || i === 3;

              return (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  whileHover={{ y: -6, boxShadow: "0 24px 48px rgba(11,31,92,0.12)" }}
                  className={cn(
                    "group relative rounded-2xl overflow-hidden cursor-pointer",
                    isBig ? "sm:col-span-1 lg:row-span-1" : ""
                  )}
                >
                  <Link href={`/listings/${listing.id}`}>
                    <div className={cn("bg-gradient-to-br h-56", grad, "relative")}>
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 flex items-center justify-center">
                        <span className="bg-white text-[#0b1f5c] text-sm font-semibold px-4 py-2 rounded-full">
                          View Property
                        </span>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                        <div className="flex items-center gap-1 mb-1">
                          <MapPin size={11} className="text-[#19d3c5]" />
                          <span className="text-[#19d3c5] text-xs font-medium uppercase tracking-wide">
                            {listing.area}
                          </span>
                        </div>
                        <p className="text-white font-semibold text-sm line-clamp-1">
                          {listing.title}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-white/80 text-xs font-medium">
                            {formatIDR(listing.price_monthly)}/bln
                          </span>
                          {listing.is_verified && (
                            <VerifiedBadge size="sm" />
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURED AGENTS ──────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <motion.p variants={fadeUp} className="text-[#19d3c5] text-sm font-semibold uppercase tracking-widest mb-2">
                Top Agents
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="text-4xl sm:text-5xl font-black text-[#0b1f5c]"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Jakarta&apos;s top
                <br />
                verified agents.
              </motion.h2>
              <motion.p variants={fadeUp} className="text-[#6b7a99] mt-3 text-base">
                Handpicked specialists. Proven track records.
              </motion.p>
            </div>
            <motion.div variants={fadeUp}>
              <Link
                href="/agents"
                className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-[#0b1f5c] hover:text-[#19d3c5] transition-colors"
              >
                See all agents →
              </Link>
            </motion.div>
          </motion.div>

          <div className="flex gap-5 overflow-x-auto pb-4 -mx-2 px-2 snap-x">
            {AGENTS
              .filter((a) => ["agent-003", "agent-001", "agent-005"].includes(a.id))
              .sort((a, b) => b.rating - a.rating)
              .map((agent, i) => (
                <motion.div
                  key={agent.id}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.5, ease: "easeOut" }}
                  className="shrink-0 snap-start w-80"
                >
                  <AgentCard agent={agent} />
                </motion.div>
              ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link href="/agents" className="text-sm font-semibold text-[#0b1f5c] hover:text-[#19d3c5] transition-colors">
              See all agents →
            </Link>
          </div>
        </div>
      </section>

      {/* ── AGENT PROGRAM ─────────────────────────────────────────── */}
      <section id="agent-program" className="py-24 bg-[#f7f3ee] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Left column */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col gap-6"
            >
              <span className="inline-flex w-fit items-center px-3 py-1.5 rounded-full text-xs font-bold bg-[#19d3c5]/12 text-[#0fb5a8] uppercase tracking-widest border border-[#19d3c5]/25">
                For Agents
              </span>

              <h2
                className="text-4xl sm:text-5xl font-black text-[#0b1f5c] leading-tight"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Your next client is already looking.{" "}
                <span className="text-[#19d3c5]">Be the agent they find.</span>
              </h2>

              <p className="text-[#6b7a99] text-lg leading-relaxed">
                Rentara&apos;s verified agent program connects you with serious renters — not tire-kickers. Every lead is pre-qualified by area, budget, and move-in date.
              </p>

              <ul className="space-y-3">
                {[
                  "Verified profile badge renters trust",
                  "WhatsApp leads sent directly to you",
                  "Analytics dashboard to track performance",
                ].map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#19d3c5]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 size={12} className="text-[#19d3c5]" />
                    </div>
                    <span className="text-[#0b1f5c] font-medium text-sm">{benefit}</span>
                  </li>
                ))}
              </ul>

              <div>
                <button
                  onClick={() => document.getElementById("waitlist")?.scrollIntoView({ behavior: "smooth" })}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#0b1f5c] text-white font-bold text-base hover:bg-[#122470] transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Join the Agent Program →
                </button>
                <p className="text-[#6b7a99] text-xs mt-3">
                  Currently accepting agents in SCBD, Kemang, Menteng and 8 more areas
                </p>
              </div>
            </motion.div>

            {/* Right column */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
              className="relative pt-6"
            >
              {/* Card A — Agent Profile Preview */}
              <div
                className="bg-white rounded-2xl p-5 relative z-10"
                style={{ boxShadow: "0 16px 48px -8px rgba(25,211,197,0.18), 0 4px 16px rgba(11,31,92,0.08)" }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-full ring-2 ring-[#19d3c5] ring-offset-2 overflow-hidden flex-shrink-0">
                    <Image
                      src={AGENTS[0].avatar}
                      alt={AGENTS[0].name}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-[#0b1f5c] text-sm">{AGENTS[0].name}</span>
                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#19d3c5]/10 text-[#0fb5a8] border border-[#19d3c5]/25">
                        ✓ Verified
                      </span>
                    </div>
                    <p className="text-xs text-[#6b7a99] truncate">{AGENTS[0].agency}</p>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} size={10} className="fill-amber-400 text-amber-400" />
                      ))}
                      <span className="text-xs font-semibold text-[#0b1f5c] ml-1">{AGENTS[0].rating}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {AGENTS[0].areas.map((area) => (
                    <span
                      key={area}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium border border-[#19d3c5]/30 text-[#0fb5a8] bg-[#19d3c5]/5"
                    >
                      <MapPin size={8} />
                      {area}
                    </span>
                  ))}
                </div>

                <a
                  href={`https://wa.me/${AGENTS[0].whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-[#19d3c5] text-[#0b1f5c] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#0fb5a8] transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.858L.057 23.571a.5.5 0 0 0 .617.632l5.938-1.554A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.648-.523-5.153-1.43l-.359-.214-3.723.976.994-3.634-.234-.374A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                  </svg>
                  WhatsApp
                </a>
              </div>

              {/* Card B — Analytics (floating, overlaps Card A) */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="bg-[#0b1f5c] rounded-2xl p-5 -mt-6 ml-8 relative z-20 shadow-2xl"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-1 h-4 rounded-full bg-[#19d3c5]" />
                  <span className="text-white text-sm font-semibold" style={{ fontFamily: "Poppins, sans-serif" }}>
                    Your Performance
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Views", value: "12.4k" },
                    { label: "Leads", value: "342" },
                    { label: "WhatsApp Chats", value: "278" },
                    { label: "Response Rate", value: "98%" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white/8 rounded-xl p-3">
                      <div className="flex items-start justify-between mb-1">
                        <span
                          className="text-white text-xl font-black"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {stat.value}
                        </span>
                        <span className="text-emerald-400 text-[10px] font-semibold flex items-center gap-0.5 mt-1">
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
                            <path d="M4 1L7 5H1L4 1Z" />
                          </svg>
                        </span>
                      </div>
                      <span className="text-white/50 text-[10px]">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── AREAS ────────────────────────────────────────────────── */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="text-[#19d3c5] text-sm font-semibold uppercase tracking-widest mb-2">
              Explore
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl sm:text-5xl font-black text-[#0b1f5c]"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Jakarta&apos;s best
              <br />
              neighbourhoods.
            </motion.h2>
          </motion.div>
        </div>

        <div className="flex gap-4 overflow-x-auto px-6 pb-4 scrollbar-hide snap-x">
          {areas.map((area, i) => (
            <motion.div
              key={area.name}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ y: -4 }}
              className="shrink-0 snap-start w-52 bg-[#0b1f5c] rounded-2xl p-6 cursor-pointer"
            >
              <Link href={`/marketplace?area=${encodeURIComponent(area.name)}`}>
                <p className="text-[#19d3c5] text-xs font-medium mb-1">{area.count} listings</p>
                <h3
                  className="text-white font-black text-xl mb-1"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {area.name}
                </h3>
                <p className="text-white/40 text-xs">{area.tag}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── WAITLIST CTA ─────────────────────────────────────────── */}
      <section id="waitlist" className="py-24 bg-gradient-to-br from-[#0b1f5c] via-[#122470] to-[#0b2a3a]">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="text-[#19d3c5] text-sm font-semibold uppercase tracking-widest mb-3">
              Early Access
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl sm:text-5xl font-black text-white mb-4"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Be first.
              <br />
              Rent smarter.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-white/60 text-lg mb-10">
              Join 1,200+ Jakarta renters already on the waitlist.
            </motion.p>

            {waitlistSubmitted ? (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[#19d3c5]/10 border border-[#19d3c5]/30 rounded-2xl p-8 text-center"
              >
                <CheckCircle2 size={40} className="text-[#19d3c5] mx-auto mb-3" />
                <p className="text-white font-semibold text-lg mb-1">You&apos;re on the list!</p>
                <p className="text-white/60 text-sm">We&apos;ll be in touch when your area opens up.</p>
              </motion.div>
            ) : (
              <motion.form
                variants={fadeUp}
                onSubmit={handleWaitlist}
                className="space-y-3"
              >
                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    required
                    placeholder="Full name"
                    value={waitlistForm.full_name}
                    onChange={(e) => setWaitlistForm((f) => ({ ...f, full_name: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#19d3c5] transition-colors"
                  />
                  <input
                    required
                    type="email"
                    placeholder="Email address"
                    value={waitlistForm.email}
                    onChange={(e) => setWaitlistForm((f) => ({ ...f, email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#19d3c5] transition-colors"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    required
                    placeholder="WhatsApp number"
                    value={waitlistForm.whatsapp}
                    onChange={(e) => setWaitlistForm((f) => ({ ...f, whatsapp: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-[#19d3c5] transition-colors"
                  />
                  <select
                    value={waitlistForm.preferred_area}
                    onChange={(e) => setWaitlistForm((f) => ({ ...f, preferred_area: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#19d3c5] transition-colors"
                    style={{ colorScheme: "dark" }}
                  >
                    <option value="">Preferred area</option>
                    {["SCBD", "Kemang", "Menteng", "Pondok Indah", "BSD", "PIK", "Kelapa Gading", "Senayan"].map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
                <select
                  value={waitlistForm.rental_budget}
                  onChange={(e) => setWaitlistForm((f) => ({ ...f, rental_budget: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white focus:outline-none focus:border-[#19d3c5] transition-colors"
                  style={{ colorScheme: "dark" }}
                >
                  <option value="">Monthly budget</option>
                  <option value="under-5jt">Under Rp 5jt</option>
                  <option value="5-10jt">Rp 5jt – 10jt</option>
                  <option value="10-20jt">Rp 10jt – 20jt</option>
                  <option value="20-40jt">Rp 20jt – 40jt</option>
                  <option value="40jt+">Rp 40jt+</option>
                </select>
                <button
                  type="submit"
                  disabled={waitlistLoading}
                  className="w-full py-4 rounded-xl bg-[#19d3c5] text-[#0b1f5c] font-bold text-base hover:bg-[#0fb5a8] transition-all disabled:opacity-60"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {waitlistLoading ? "Joining..." : "Join the waitlist →"}
                </button>
              </motion.form>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────── */}
      <section className="py-24 bg-[#f7f3ee]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-14"
          >
            <motion.p variants={fadeUp} className="text-[#19d3c5] text-sm font-semibold uppercase tracking-widest mb-2">
              Reviews
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl sm:text-5xl font-black text-[#0b1f5c]"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Trusted by Jakarta renters.
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl p-7 shadow-sm border border-[#e2e8f0]"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, s) => (
                    <Star key={s} size={14} className="fill-[#19d3c5] text-[#19d3c5]" />
                  ))}
                </div>
                <p className="text-[#0b1f5c] text-sm leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#19d3c5] to-[#0b1f5c] flex items-center justify-center text-white text-sm font-bold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-[#0b1f5c] text-sm">{t.name}</p>
                    <p className="text-[#6b7a99] text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.p variants={fadeUp} className="text-[#19d3c5] text-sm font-semibold uppercase tracking-widest mb-2">
              FAQ
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl sm:text-5xl font-black text-[#0b1f5c]"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              Common questions.
            </motion.h2>
          </motion.div>

          <div className="divide-y divide-[#e2e8f0]">
            {faqs.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <UserSegmentModal />
    </div>
  );
}
