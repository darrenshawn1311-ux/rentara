"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutGrid,
  Users,
  ClipboardList,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  LogOut,
  Eye,
  Download,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { formatIDR, cn } from "@/lib/utils";
import { SAMPLE_LISTINGS } from "@/lib/seed-data";

const SAMPLE_AGENTS = [
  { id: "a1", name: "Budi Santoso", email: "budi@rentara.id", listings: 6, is_verified: true },
  { id: "a2", name: "Sari Dewi", email: "sari@realty.co.id", listings: 3, is_verified: false },
  { id: "a3", name: "Rizki Firmansyah", email: "rizki@propindo.id", listings: 8, is_verified: true },
];

const SAMPLE_WAITLIST = [
  { id: "w1", full_name: "Anisa R.", email: "anisa@gmail.com", whatsapp: "62811xxx", preferred_area: "Kemang", rental_budget: "10-20jt", created_at: "2024-10-14" },
  { id: "w2", full_name: "David C.", email: "david@corp.com", whatsapp: "62812xxx", preferred_area: "SCBD", rental_budget: "20-40jt", created_at: "2024-10-13" },
  { id: "w3", full_name: "Maya S.", email: "maya@mail.id", whatsapp: "62813xxx", preferred_area: "BSD", rental_budget: "5-10jt", created_at: "2024-10-12" },
];

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState<"listings" | "agents" | "waitlist">("listings");
  const [listingStatuses, setListingStatuses] = useState<Record<string, string>>({});
  const [agentVerified, setAgentVerified] = useState<Record<string, boolean>>({});

  function approveListig(id: string) {
    setListingStatuses((s) => ({ ...s, [id]: "approved" }));
  }

  function rejectListing(id: string) {
    setListingStatuses((s) => ({ ...s, [id]: "rejected" }));
  }

  function toggleAgent(id: string, current: boolean) {
    setAgentVerified((s) => ({ ...s, [id]: !current }));
  }

  const pendingCount = SAMPLE_LISTINGS.filter((l) => !listingStatuses[l.id]).length;

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#070f2e] flex-col hidden md:flex">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-black text-white" style={{ fontFamily: "Poppins, sans-serif" }}>Rent</span>
            <span className="text-xl font-black text-[#19d3c5]" style={{ fontFamily: "Poppins, sans-serif" }}>ara</span>
          </Link>
          <span className="text-xs text-white/30 mt-1 block">Admin Panel</span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: "listings", label: "Listings Queue", icon: <ClipboardList size={16} />, badge: pendingCount },
            { id: "agents", label: "Agents", icon: <Users size={16} /> },
            { id: "waitlist", label: "Waitlist", icon: <LayoutGrid size={16} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as typeof activeTab)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left",
                activeTab === item.id ? "bg-white/15 text-white" : "text-white/50 hover:text-white/80 hover:bg-white/5"
              )}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {item.badge ? (
                <span className="bg-[#19d3c5] text-[#0b1f5c] text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              ) : null}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/50 hover:text-red-400 transition-colors">
            <LogOut size={16} />Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="bg-white border-b border-[#e2e8f0] px-6 py-4">
          <h1 className="text-xl font-black text-[#0b1f5c]" style={{ fontFamily: "Poppins, sans-serif" }}>
            {activeTab === "listings" && "Listings Queue"}
            {activeTab === "agents" && "Agent Management"}
            {activeTab === "waitlist" && "Waitlist"}
          </h1>
          <p className="text-[#6b7a99] text-xs">Admin Dashboard</p>
        </div>

        <div className="p-6">
          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Listings", value: SAMPLE_LISTINGS.length.toString(), color: "bg-blue-50 text-blue-600" },
              { label: "Pending Review", value: pendingCount.toString(), color: "bg-amber-50 text-amber-600" },
              { label: "Total Agents", value: SAMPLE_AGENTS.length.toString(), color: "bg-emerald-50 text-emerald-600" },
              { label: "Waitlist", value: SAMPLE_WAITLIST.length.toString(), color: "bg-purple-50 text-purple-600" },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-2xl border border-[#e2e8f0] p-5">
                <p className="text-2xl font-black text-[#0b1f5c]" style={{ fontFamily: "Poppins, sans-serif" }}>{stat.value}</p>
                <p className="text-xs text-[#6b7a99] mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Mobile tab bar */}
          <div className="flex gap-2 mb-6 md:hidden">
            {["listings", "agents", "waitlist"].map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t as typeof activeTab)}
                className={cn(
                  "flex-1 py-2 rounded-xl text-xs font-medium capitalize",
                  activeTab === t ? "bg-[#0b1f5c] text-white" : "bg-white border border-[#e2e8f0] text-[#6b7a99]"
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Listings Queue */}
          {activeTab === "listings" && (
            <div className="space-y-3">
              {SAMPLE_LISTINGS.map((listing) => {
                const status = listingStatuses[listing.id];
                return (
                  <motion.div
                    key={listing.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "bg-white rounded-2xl border p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-opacity",
                      status ? "opacity-50" : "border-[#e2e8f0]"
                    )}
                  >
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#0b1f5c] to-[#122470] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-[#0b1f5c] truncate">{listing.title}</p>
                        {listing.is_verified && <ShieldCheck size={14} className="text-[#19d3c5] shrink-0" />}
                      </div>
                      <p className="text-[#6b7a99] text-xs">{listing.area} · {formatIDR(listing.price_monthly)}/bln</p>
                    </div>

                    {status ? (
                      <span className={cn(
                        "text-xs font-semibold px-3 py-1.5 rounded-full border",
                        status === "approved"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      )}>
                        {status === "approved" ? "✓ Approved" : "✗ Rejected"}
                      </span>
                    ) : (
                      <div className="flex items-center gap-2 shrink-0">
                        <Link href={`/listings/${listing.id}`} className="p-2 rounded-lg border border-[#e2e8f0] text-[#6b7a99] hover:text-[#0b1f5c] transition-colors">
                          <Eye size={15} />
                        </Link>
                        <button
                          onClick={() => approveListig(listing.id)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600 transition-colors"
                        >
                          <CheckCircle2 size={13} />
                          Approve
                        </button>
                        <button
                          onClick={() => rejectListing(listing.id)}
                          className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 transition-colors"
                        >
                          <XCircle size={13} />
                          Reject
                        </button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Agents */}
          {activeTab === "agents" && (
            <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e2e8f0] bg-[#f5f7fa]">
                    {["Agent", "Email", "Listings", "Status", "Action"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#6b7a99] uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {SAMPLE_AGENTS.map((agent) => {
                    const isVerified = agentVerified[agent.id] ?? agent.is_verified;
                    return (
                      <tr key={agent.id} className="border-b border-[#e2e8f0] hover:bg-[#f5f7fa] transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#19d3c5] to-[#0b1f5c] flex items-center justify-center text-white text-sm font-bold">
                              {agent.name[0]}
                            </div>
                            <span className="font-medium text-[#0b1f5c]">{agent.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-[#6b7a99]">{agent.email}</td>
                        <td className="px-5 py-4 text-[#0b1f5c] font-semibold">{agent.listings}</td>
                        <td className="px-5 py-4">
                          <span className={cn(
                            "inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border",
                            isVerified
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-amber-50 text-amber-700 border-amber-200"
                          )}>
                            {isVerified ? <CheckCircle2 size={11} /> : null}
                            {isVerified ? "Verified" : "Pending"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => toggleAgent(agent.id, isVerified)}
                            className={cn(
                              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                              isVerified
                                ? "bg-[#f5f7fa] text-[#6b7a99] hover:bg-red-50 hover:text-red-600"
                                : "bg-[#0b1f5c] text-white hover:bg-[#122470]"
                            )}
                          >
                            {isVerified ? <ToggleRight size={13} /> : <ToggleLeft size={13} />}
                            {isVerified ? "Revoke" : "Verify"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Waitlist */}
          {activeTab === "waitlist" && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-[#6b7a99]">{SAMPLE_WAITLIST.length} signups</p>
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm font-medium text-[#0b1f5c] bg-white hover:bg-[#f5f7fa] transition-colors">
                  <Download size={14} />
                  Export CSV
                </button>
              </div>
              <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#e2e8f0] bg-[#f5f7fa]">
                      {["Name", "Email", "WhatsApp", "Area", "Budget", "Date"].map((h) => (
                        <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#6b7a99] uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SAMPLE_WAITLIST.map((entry) => (
                      <tr key={entry.id} className="border-b border-[#e2e8f0] hover:bg-[#f5f7fa] transition-colors">
                        <td className="px-5 py-4 font-medium text-[#0b1f5c]">{entry.full_name}</td>
                        <td className="px-5 py-4 text-[#6b7a99]">{entry.email}</td>
                        <td className="px-5 py-4 text-[#6b7a99]">{entry.whatsapp}</td>
                        <td className="px-5 py-4 text-[#6b7a99]">{entry.preferred_area}</td>
                        <td className="px-5 py-4 text-[#6b7a99]">{entry.rental_budget}</td>
                        <td className="px-5 py-4 text-[#6b7a99]">{entry.created_at}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
