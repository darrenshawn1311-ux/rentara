"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { Search, SlidersHorizontal, ShieldCheck, Users, Star, Zap } from "lucide-react";
import { AGENTS } from "@/lib/agents";
import { AgentCard, AgentCardSkeleton } from "@/components/agents/AgentCard";

const ALL_AREAS = Array.from(new Set(AGENTS.flatMap((a) => a.areas))).sort();

const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2, ease: "easeIn" } },
};

const SORT_OPTIONS = [
  { value: "rating", label: "Highest Rated" },
  { value: "reviews", label: "Most Reviewed" },
  { value: "listings", label: "Most Listings" },
  { value: "deals", label: "Most Deals" },
];

const STATS = [
  { icon: Users, value: `${AGENTS.length}`, label: "Verified Agents" },
  { icon: Star, value: "4.8", label: "Avg Rating" },
  { icon: Zap, value: "< 3h", label: "Avg Response" },
  { icon: ShieldCheck, value: "98%", label: "Response Rate" },
];

export default function AgentsPage() {
  const [search, setSearch] = useState("");
  const [area, setArea] = useState("all");
  const [sort, setSort] = useState("rating");
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const filtered = useMemo(() => {
    let list = [...AGENTS];

    if (verifiedOnly) list = list.filter((a) => a.verified);
    if (area !== "all") list = list.filter((a) => a.areas.includes(area));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.agency.toLowerCase().includes(q) ||
          a.areas.some((ar) => ar.toLowerCase().includes(q))
      );
    }

    list.sort((a, b) => {
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "reviews") return b.reviews - a.reviews;
      if (sort === "listings") return b.activeListings - a.activeListings;
      if (sort === "deals") return b.totalDeals - a.totalDeals;
      return 0;
    });

    return list;
  }, [search, area, sort, verifiedOnly]);

  return (
    <div className="min-h-screen bg-gray-soft">
      {/* Breadcrumb bar */}
      <div className="w-full bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 py-3" aria-label="Breadcrumb">
            <Link
              href="/"
              className="text-xs text-gray-400 hover:text-gray-700 transition-colors duration-150 font-medium"
            >
              Home
            </Link>
            <svg
              className="w-3 h-3 text-gray-300 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <Link
              href="/marketplace"
              className="text-xs text-gray-400 hover:text-gray-700 transition-colors duration-150 font-medium"
            >
              Listings
            </Link>
            <svg
              className="w-3 h-3 text-gray-300 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-xs font-semibold" style={{ color: "#0B1F5C" }}>
              Agent Directory
            </span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 sm:pt-14 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="text-center mb-10"
          >
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-teal/15 text-teal border border-teal/30 mb-4">
              Agent Directory
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">
              Find Your Perfect{" "}
              <span className="text-teal">Jakarta Agent</span>
            </h1>
            <p className="text-white/60 max-w-xl mx-auto text-sm leading-relaxed">
              Every agent on Rentara is independently rated, area-verified, and committed to a guaranteed response time.
            </p>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto"
          >
            {STATS.map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center gap-1 bg-white/8 rounded-2xl py-4 px-3">
                <Icon size={18} className="text-teal mb-0.5" />
                <span className="text-xl font-bold text-white">{value}</span>
                <span className="text-xs text-white/50">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Filters bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search by name, agency or area…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 focus:border-teal bg-gray-soft placeholder:text-muted/60"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Area filter */}
            <div className="relative">
              <SlidersHorizontal size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="pl-7 pr-8 py-2 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 bg-gray-soft text-navy appearance-none cursor-pointer"
              >
                <option value="all">All Areas</option>
                {ALL_AREAS.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2 rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 bg-gray-soft text-navy appearance-none cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            {/* Verified toggle */}
            <button
              onClick={() => setVerifiedOnly((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-colors ${
                verifiedOnly
                  ? "bg-teal text-navy border-teal"
                  : "bg-gray-soft text-muted border-border hover:border-teal/40"
              }`}
            >
              <ShieldCheck size={13} />
              Verified only
            </button>
          </div>

          <span className="text-xs text-muted ml-auto hidden sm:block whitespace-nowrap">
            {filtered.length} agent{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <AnimatePresence mode="wait">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-24 text-muted"
            >
              <Users size={40} className="mx-auto mb-4 opacity-30" />
              <p className="font-medium">No agents match your filters.</p>
              <button
                onClick={() => { setSearch(""); setArea("all"); setVerifiedOnly(false); }}
                className="mt-3 text-sm text-teal hover:underline"
              >
                Clear filters
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={`${search}-${area}-${sort}-${verifiedOnly}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((agent, i) => (
                <motion.div key={agent.id} variants={cardVariants}>
                  <AgentCard agent={agent} featured={i === 0 && sort === "rating" && !search && area === "all" && !verifiedOnly} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
