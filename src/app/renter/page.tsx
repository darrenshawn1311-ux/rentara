"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import {
  Heart,
  MessageSquare,
  User,
  LogOut,
  Bell,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
} from "lucide-react";
import { formatIDR, cn } from "@/lib/utils";
import { SAMPLE_LISTINGS } from "@/lib/seed-data";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const SAMPLE_INQUIRIES = [
  { id: "inq-1", listing: SAMPLE_LISTINGS[0], status: "replied", date: "2024-10-14" },
  { id: "inq-2", listing: SAMPLE_LISTINGS[2], status: "pending", date: "2024-10-13" },
  { id: "inq-3", listing: SAMPLE_LISTINGS[4], status: "closed", date: "2024-10-10" },
];

const STATUS_CONFIG = {
  pending: { label: "Pending", icon: <Clock size={13} />, className: "bg-amber-50 text-amber-700 border-amber-200" },
  replied: { label: "Replied", icon: <CheckCircle2 size={13} />, className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  closed: { label: "Closed", icon: <XCircle size={13} />, className: "bg-[#f5f7fa] text-[#6b7a99] border-[#e2e8f0]" },
};

export default function RenterDashboard() {
  const [activeTab, setActiveTab] = useState<"saved" | "inquiries" | "profile">("saved");
  const savedListings = SAMPLE_LISTINGS.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Sidebar + main layout */}
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-[#0b1f5c] flex flex-col hidden md:flex">
          <div className="p-6 border-b border-white/10">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-black text-white" style={{ fontFamily: "Poppins, sans-serif" }}>
                Rent
              </span>
              <span className="text-xl font-black text-[#19d3c5]" style={{ fontFamily: "Poppins, sans-serif" }}>
                ara
              </span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {[
              { id: "saved", label: "Saved Listings", icon: <Heart size={16} /> },
              { id: "inquiries", label: "My Inquiries", icon: <MessageSquare size={16} /> },
              { id: "profile", label: "Profile", icon: <User size={16} /> },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as typeof activeTab)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left",
                  activeTab === item.id
                    ? "bg-white/15 text-white"
                    : "text-white/50 hover:text-white/80 hover:bg-white/5"
                )}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10">
            <Link
              href="/marketplace"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Search size={16} />
              Browse listings
            </Link>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/50 hover:text-red-400 transition-colors">
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {/* Header */}
          <div className="bg-white border-b border-[#e2e8f0] px-6 py-4 flex items-center justify-between">
            <div>
              <h1
                className="text-xl font-black text-[#0b1f5c]"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {activeTab === "saved" && "Saved Listings"}
                {activeTab === "inquiries" && "My Inquiries"}
                {activeTab === "profile" && "Profile Settings"}
              </h1>
              <p className="text-[#6b7a99] text-xs">Renter Dashboard</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="w-9 h-9 rounded-xl bg-[#f5f7fa] flex items-center justify-center text-[#6b7a99] hover:bg-[#e2e8f0] transition-colors">
                <Bell size={16} />
              </button>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#19d3c5] to-[#0b1f5c] flex items-center justify-center text-white text-sm font-bold">
                A
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Mobile tab bar */}
            <div className="flex gap-2 mb-6 md:hidden">
              {[
                { id: "saved", label: "Saved", icon: <Heart size={14} /> },
                { id: "inquiries", label: "Inquiries", icon: <MessageSquare size={14} /> },
                { id: "profile", label: "Profile", icon: <User size={14} /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium transition-colors",
                    activeTab === tab.id
                      ? "bg-[#0b1f5c] text-white"
                      : "bg-white border border-[#e2e8f0] text-[#6b7a99]"
                  )}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Saved Listings */}
            {activeTab === "saved" && (
              <motion.div initial="hidden" animate="visible" variants={stagger}>
                {savedListings.length === 0 ? (
                  <div className="text-center py-16">
                    <Heart size={40} className="text-[#e2e8f0] mx-auto mb-4" />
                    <p className="font-semibold text-[#0b1f5c] mb-2">No saved listings</p>
                    <p className="text-[#6b7a99] text-sm mb-4">Browse the marketplace and save listings you like.</p>
                    <Link href="/marketplace" className="inline-block px-5 py-2.5 rounded-xl bg-[#0b1f5c] text-white text-sm font-medium">
                      Browse listings
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {savedListings.map((listing) => (
                      <motion.div key={listing.id} variants={fadeUp}>
                        <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden group hover:shadow-md transition-shadow">
                          <div className="h-44 bg-gradient-to-br from-[#0b1f5c] to-[#122470] relative">
                            <button className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                              <Heart size={14} className="fill-red-500 text-red-500" />
                            </button>
                          </div>
                          <div className="p-4">
                            <p className="text-xs text-[#19d3c5] font-medium uppercase tracking-wide mb-1">{listing.area}</p>
                            <h3 className="font-semibold text-[#0b1f5c] text-sm line-clamp-1 mb-2">{listing.title}</h3>
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-[#0b1f5c] text-base">{formatIDR(listing.price_monthly)}<span className="text-xs font-normal text-[#6b7a99]">/bln</span></span>
                              <Link href={`/listings/${listing.id}`} className="text-xs text-[#19d3c5] font-medium flex items-center gap-0.5">
                                View <ChevronRight size={12} />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Inquiries */}
            {activeTab === "inquiries" && (
              <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-3">
                {SAMPLE_INQUIRIES.map((inq) => {
                  const statusCfg = STATUS_CONFIG[inq.status as keyof typeof STATUS_CONFIG];
                  return (
                    <motion.div
                      key={inq.id}
                      variants={fadeUp}
                      className="bg-white rounded-2xl border border-[#e2e8f0] p-5 flex items-center gap-4"
                    >
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#0b1f5c] to-[#122470] shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#0b1f5c] text-sm truncate">{inq.listing.title}</p>
                        <p className="text-[#6b7a99] text-xs">{inq.listing.area} · {inq.date}</p>
                      </div>
                      <span className={cn("inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border", statusCfg.className)}>
                        {statusCfg.icon}
                        {statusCfg.label}
                      </span>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}

            {/* Profile */}
            {activeTab === "profile" && (
              <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-lg">
                <motion.div variants={fadeUp} className="bg-white rounded-2xl border border-[#e2e8f0] p-6 space-y-4">
                  <div className="flex items-center gap-4 pb-4 border-b border-[#e2e8f0]">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#19d3c5] to-[#0b1f5c] flex items-center justify-center text-white text-xl font-bold">
                      A
                    </div>
                    <div>
                      <p className="font-bold text-[#0b1f5c]">Demo User</p>
                      <p className="text-[#6b7a99] text-sm">demo@rentara.id</p>
                      <span className="text-xs text-[#19d3c5] font-medium">Renter</span>
                    </div>
                  </div>

                  {[
                    { label: "Full name", placeholder: "Your full name", type: "text" },
                    { label: "Email", placeholder: "your@email.com", type: "email" },
                    { label: "WhatsApp", placeholder: "628xxxxxxxx", type: "tel" },
                  ].map((field) => (
                    <div key={field.label}>
                      <label className="block text-xs font-semibold text-[#6b7a99] mb-1.5 uppercase tracking-wide">{field.label}</label>
                      <input
                        type={field.type}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#19d3c5] transition-colors"
                      />
                    </div>
                  ))}

                  <button className="w-full py-3 rounded-xl bg-[#0b1f5c] text-white font-semibold text-sm hover:bg-[#122470] transition-colors">
                    Save changes
                  </button>
                </motion.div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
