"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  MessageSquare,
  User,
  LogOut,
  Plus,
  Eye,
  Edit,
  Archive,
  X,
  Upload,
  CheckCircle2,
  TrendingUp,
  Star,
} from "lucide-react";
import { formatIDR, cn } from "@/lib/utils";
import { SAMPLE_LISTINGS } from "@/lib/seed-data";
import type { ListingStatus } from "@/types";

const STATUS_CONFIG: Record<ListingStatus, { label: string; className: string }> = {
  active: { label: "Active", className: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  pending: { label: "Pending review", className: "bg-amber-50 text-amber-700 border-amber-200" },
  rejected: { label: "Rejected", className: "bg-red-50 text-red-700 border-red-200" },
  archived: { label: "Archived", className: "bg-[#f5f7fa] text-[#6b7a99] border-[#e2e8f0]" },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function UploadModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<"form" | "success">("form");
  const [form, setForm] = useState({
    title: "", area: "", price: "", bedrooms: "", bathrooms: "", size: "",
    furnished: "fully-furnished", description: "", is_pet_friendly: false,
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStep("success");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/50"
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-white rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto"
      >
        <div className="p-6 border-b border-[#e2e8f0] flex items-center justify-between">
          <h2 className="font-black text-[#0b1f5c] text-lg" style={{ fontFamily: "Poppins, sans-serif" }}>
            {step === "form" ? "Upload new listing" : "Listing submitted!"}
          </h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-[#f5f7fa] text-[#6b7a99]">
            <X size={18} />
          </button>
        </div>

        {step === "success" ? (
          <div className="p-10 text-center">
            <CheckCircle2 size={48} className="text-[#19d3c5] mx-auto mb-4" />
            <p className="font-bold text-[#0b1f5c] text-lg mb-2">Submitted for review</p>
            <p className="text-[#6b7a99] text-sm mb-6">
              Our team will verify your listing within 24 hours and notify you once it&apos;s live.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-xl bg-[#0b1f5c] text-white font-semibold text-sm"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-[#6b7a99] uppercase tracking-wide mb-1.5">Title *</label>
                <input
                  required
                  placeholder="e.g. Modern Studio at SCBD"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#19d3c5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6b7a99] uppercase tracking-wide mb-1.5">Area *</label>
                <select
                  required
                  value={form.area}
                  onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#19d3c5]"
                >
                  <option value="">Select area</option>
                  {["SCBD", "Kemang", "Menteng", "Pondok Indah", "BSD", "PIK", "Kelapa Gading", "Senayan"].map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6b7a99] uppercase tracking-wide mb-1.5">Price/month (IDR) *</label>
                <input
                  required
                  type="number"
                  placeholder="8500000"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#19d3c5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6b7a99] uppercase tracking-wide mb-1.5">Bedrooms</label>
                <select
                  value={form.bedrooms}
                  onChange={(e) => setForm((f) => ({ ...f, bedrooms: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#19d3c5]"
                >
                  <option value="0">Studio</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4+</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6b7a99] uppercase tracking-wide mb-1.5">Bathrooms</label>
                <select
                  value={form.bathrooms}
                  onChange={(e) => setForm((f) => ({ ...f, bathrooms: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#19d3c5]"
                >
                  {["1", "2", "3", "4"].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6b7a99] uppercase tracking-wide mb-1.5">Size (m²)</label>
                <input
                  type="number"
                  placeholder="45"
                  value={form.size}
                  onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#19d3c5]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6b7a99] uppercase tracking-wide mb-1.5">Furnished</label>
                <select
                  value={form.furnished}
                  onChange={(e) => setForm((f) => ({ ...f, furnished: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#19d3c5]"
                >
                  <option value="unfurnished">Unfurnished</option>
                  <option value="semi-furnished">Semi-furnished</option>
                  <option value="fully-furnished">Fully-furnished</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-semibold text-[#6b7a99] uppercase tracking-wide mb-1.5">Description</label>
                <textarea
                  rows={3}
                  placeholder="Describe the property..."
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#19d3c5] resize-none"
                />
              </div>

              {/* Photo upload */}
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-[#6b7a99] uppercase tracking-wide mb-1.5">Photos</label>
                <div className="border-2 border-dashed border-[#e2e8f0] rounded-xl p-8 text-center hover:border-[#19d3c5] transition-colors cursor-pointer">
                  <Upload size={24} className="text-[#6b7a99] mx-auto mb-2" />
                  <p className="text-sm text-[#6b7a99]">Drag & drop photos or <span className="text-[#19d3c5] font-medium">browse</span></p>
                  <p className="text-xs text-[#6b7a99] mt-1">JPG, PNG up to 10MB each</p>
                </div>
              </div>

              {/* Pet friendly */}
              <div className="col-span-2 flex items-center justify-between p-4 bg-[#f5f7fa] rounded-xl">
                <span className="text-sm font-medium text-[#0b1f5c]">Pet friendly</span>
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, is_pet_friendly: !f.is_pet_friendly }))}
                  className={cn(
                    "relative w-10 h-5 rounded-full transition-colors",
                    form.is_pet_friendly ? "bg-[#19d3c5]" : "bg-[#e2e8f0]"
                  )}
                >
                  <span className={cn("absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform", form.is_pet_friendly && "translate-x-5")} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#0b1f5c] text-white font-bold text-sm hover:bg-[#122470] transition-colors"
            >
              Submit for review →
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

export default function AgentDashboard() {
  const [activeTab, setActiveTab] = useState<"listings" | "inquiries" | "profile">("listings");
  const [showUpload, setShowUpload] = useState(false);

  const stats = [
    { label: "Active Listings", value: "6", icon: <LayoutGrid size={20} />, color: "text-[#19d3c5]" },
    { label: "Total Inquiries", value: "34", icon: <MessageSquare size={20} />, color: "text-purple-500" },
    { label: "Response Rate", value: "97%", icon: <TrendingUp size={20} />, color: "text-emerald-500" },
    { label: "Avg. Rating", value: "4.9", icon: <Star size={20} />, color: "text-amber-500" },
  ];

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0b1f5c] flex-col hidden md:flex">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-black text-white" style={{ fontFamily: "Poppins, sans-serif" }}>Rent</span>
            <span className="text-xl font-black text-[#19d3c5]" style={{ fontFamily: "Poppins, sans-serif" }}>ara</span>
          </Link>
          <span className="text-xs text-white/30 mt-1 block">Agent Portal</span>
        </div>

        <div className="p-4">
          <button
            onClick={() => setShowUpload(true)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#19d3c5] text-[#0b1f5c] font-semibold text-sm mb-4"
          >
            <Plus size={16} />
            New Listing
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {[
            { id: "listings", label: "My Listings", icon: <LayoutGrid size={16} /> },
            { id: "inquiries", label: "Inquiries", icon: <MessageSquare size={16} /> },
            { id: "profile", label: "Profile", icon: <User size={16} /> },
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
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/50 hover:text-red-400 transition-colors">
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <div className="bg-white border-b border-[#e2e8f0] px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-black text-[#0b1f5c]" style={{ fontFamily: "Poppins, sans-serif" }}>
              {activeTab === "listings" && "My Listings"}
              {activeTab === "inquiries" && "Inquiries"}
              {activeTab === "profile" && "Profile"}
            </h1>
            <p className="text-[#6b7a99] text-xs">Agent Dashboard</p>
          </div>
          <button
            onClick={() => setShowUpload(true)}
            className="md:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#19d3c5] text-[#0b1f5c] font-semibold text-sm"
          >
            <Plus size={15} />
            New
          </button>
        </div>

        <div className="p-6">
          {/* Stats row */}
          {activeTab === "listings" && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-[#e2e8f0] p-5"
                >
                  <div className={cn("mb-2", stat.color)}>{stat.icon}</div>
                  <p className="text-2xl font-black text-[#0b1f5c]" style={{ fontFamily: "Poppins, sans-serif" }}>{stat.value}</p>
                  <p className="text-xs text-[#6b7a99]">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          )}

          {/* Listings table */}
          {activeTab === "listings" && (
            <div className="bg-white rounded-2xl border border-[#e2e8f0] overflow-hidden">
              <div className="p-5 border-b border-[#e2e8f0] flex items-center justify-between">
                <h2 className="font-bold text-[#0b1f5c]" style={{ fontFamily: "Poppins, sans-serif" }}>All Listings</h2>
                <button
                  onClick={() => setShowUpload(true)}
                  className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0b1f5c] text-white text-sm font-medium"
                >
                  <Plus size={14} />
                  Add listing
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#e2e8f0] bg-[#f5f7fa]">
                      {["Property", "Area", "Price", "Status", "Actions"].map((h) => (
                        <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-[#6b7a99] uppercase tracking-wide">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SAMPLE_LISTINGS.map((listing) => {
                      const statusCfg = STATUS_CONFIG[listing.status];
                      return (
                        <tr key={listing.id} className="border-b border-[#e2e8f0] hover:bg-[#f5f7fa] transition-colors">
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0b1f5c] to-[#122470] shrink-0" />
                              <p className="font-medium text-[#0b1f5c] line-clamp-1 max-w-[200px]">{listing.title}</p>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-[#6b7a99]">{listing.area}</td>
                          <td className="px-5 py-4 font-semibold text-[#0b1f5c] price-tag">{formatIDR(listing.price_monthly)}</td>
                          <td className="px-5 py-4">
                            <span className={cn("inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border", statusCfg.className)}>
                              {statusCfg.label}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <Link href={`/listings/${listing.id}`} className="p-1.5 rounded-lg hover:bg-[#e2e8f0] text-[#6b7a99] hover:text-[#0b1f5c] transition-colors">
                                <Eye size={15} />
                              </Link>
                              <button className="p-1.5 rounded-lg hover:bg-[#e2e8f0] text-[#6b7a99] hover:text-[#0b1f5c] transition-colors">
                                <Edit size={15} />
                              </button>
                              <button className="p-1.5 rounded-lg hover:bg-[#e2e8f0] text-[#6b7a99] hover:text-red-500 transition-colors">
                                <Archive size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Inquiries */}
          {activeTab === "inquiries" && (
            <div className="space-y-3">
              {SAMPLE_LISTINGS.slice(0, 5).map((listing, i) => (
                <motion.div
                  key={listing.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-white rounded-2xl border border-[#e2e8f0] p-5 flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#0b1f5c] to-[#122470] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#0b1f5c] text-sm truncate">{listing.title}</p>
                    <p className="text-[#6b7a99] text-xs">Renter #{i + 101} · {i + 1} day{i !== 0 ? "s" : ""} ago</p>
                    <p className="text-[#6b7a99] text-xs mt-0.5 truncate">
                      &ldquo;I&apos;m interested in this property. Is it still available?&rdquo;
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button className="px-3 py-1.5 rounded-lg bg-[#19d3c5] text-[#0b1f5c] text-xs font-semibold">
                      Reply
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Profile */}
          {activeTab === "profile" && (
            <div className="max-w-lg">
              <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b border-[#e2e8f0]">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#19d3c5] to-[#0b1f5c] flex items-center justify-center text-white text-xl font-bold">B</div>
                  <div>
                    <p className="font-bold text-[#0b1f5c]">Budi Santoso</p>
                    <p className="text-[#6b7a99] text-sm">budi@rentara.id</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <CheckCircle2 size={12} className="text-[#19d3c5]" />
                      <span className="text-xs text-[#19d3c5] font-medium">Verified agent</span>
                    </div>
                  </div>
                </div>
                {[
                  { label: "Full name", placeholder: "Budi Santoso", type: "text" },
                  { label: "Email", placeholder: "budi@rentara.id", type: "email" },
                  { label: "WhatsApp", placeholder: "628xxxxxxxx", type: "tel" },
                  { label: "Agency", placeholder: "Budi Property Group", type: "text" },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="block text-xs font-semibold text-[#6b7a99] uppercase tracking-wide mb-1.5">{f.label}</label>
                    <input type={f.type} placeholder={f.placeholder} className="w-full px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#19d3c5]" />
                  </div>
                ))}
                <button className="w-full py-3 rounded-xl bg-[#0b1f5c] text-white font-semibold text-sm">Save changes</button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Upload modal */}
      <AnimatePresence>
        {showUpload && <UploadModal onClose={() => setShowUpload(false)} />}
      </AnimatePresence>
    </div>
  );
}
