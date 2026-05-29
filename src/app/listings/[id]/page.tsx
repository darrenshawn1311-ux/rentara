"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  ShieldCheck,
  MessageCircle,
  Star,
  Bookmark,
  Share2,
  AirVent,
  Wifi,
  Car,
  Shield,
  Waves,
  Dumbbell,
  TreePine,
  Thermometer,
  WashingMachine,
  Refrigerator,
  Tv2,
  Building2,
  Camera,
  Key,
  ChevronLeft,
  PawPrint,
  CheckCircle2,
  User,
} from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useLang } from "@/lib/i18n/LanguageContext";
import ListingCard from "@/components/listings/ListingCard";
import VerifiedBadge from "@/components/ui/VerifiedBadge";
import { formatIDR, bedroomLabel, cn } from "@/lib/utils";
import { SAMPLE_LISTINGS } from "@/lib/seed-data";

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  "AC": <AirVent size={18} />,
  "WiFi": <Wifi size={18} />,
  "Parking": <Car size={18} />,
  "Security 24/7": <Shield size={18} />,
  "Pool": <Waves size={18} />,
  "Gym": <Dumbbell size={18} />,
  "Garden": <TreePine size={18} />,
  "Water Heater": <Thermometer size={18} />,
  "Washing Machine": <WashingMachine size={18} />,
  "Refrigerator": <Refrigerator size={18} />,
  "TV": <Tv2 size={18} />,
  "Balcony": <Building2 size={18} />,
  "Elevator": <Building2 size={18} />,
  "CCTV": <Camera size={18} />,
  "Intercom": <Key size={18} />,
};

const AREA_GRADIENTS: Record<string, string> = {
  SCBD: "from-[#0b1f5c] to-[#122470]",
  Kemang: "from-[#1a3a2a] to-[#2d5a40]",
  Menteng: "from-[#3a1a0b] to-[#5a2d1a]",
  "Pondok Indah": "from-[#2a1a3a] to-[#3d2d5a]",
  "Kelapa Gading": "from-[#0b2a3a] to-[#1a4a5a]",
  BSD: "from-[#1a2a0b] to-[#2d4a1a]",
  PIK: "from-[#0b3a3a] to-[#1a5a5a]",
  Senayan: "from-[#3a2a0b] to-[#5a401a]",
};

export default function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { t } = useLang();
  const listing = SAMPLE_LISTINGS.find((l) => l.id === id);

  if (!listing) notFound();

  const similar = SAMPLE_LISTINGS.filter(
    (l) => l.id !== listing.id && l.area === listing.area
  ).slice(0, 4);

  const gradient = AREA_GRADIENTS[listing.area] ?? "from-[#0b1f5c] to-[#122470]";

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <div className="pt-16">
        {/* Hero image */}
        <div className={cn("h-[55vh] bg-gradient-to-br relative overflow-hidden", gradient)}>
          <div className="absolute inset-0 flex items-end">
            <div className="w-full p-8 bg-gradient-to-t from-black/60 to-transparent">
              <div className="max-w-7xl mx-auto">
                <Link
                  href="/marketplace"
                  className="inline-flex items-center gap-1.5 text-white/70 text-sm mb-4 hover:text-white transition-colors"
                >
                  <ChevronLeft size={16} />
                  Back to listings
                </Link>
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={14} className="text-[#19d3c5]" />
                      <span className="text-[#19d3c5] text-sm font-medium uppercase tracking-wide">
                        {listing.area}
                      </span>
                      {listing.is_verified && <VerifiedBadge size="sm" />}
                    </div>
                    <h1
                      className="text-3xl sm:text-4xl font-black text-white"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {listing.title}
                    </h1>
                  </div>
                  <div className="text-right">
                    <div
                      className="text-3xl font-black text-white price-tag"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {formatIDR(listing.price_monthly)}
                    </div>
                    <span className="text-white/60 text-sm">per bulan</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Verified banner */}
          {listing.is_verified && (
            <div className="absolute top-6 right-6 bg-[#19d3c5]/10 backdrop-blur border border-[#19d3c5]/30 rounded-xl px-4 py-2 flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#19d3c5]" />
              <span className="text-white text-xs font-medium">Photos verified Oct 2024</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-10">
              {/* Quick stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-wrap gap-5 py-5 border-y border-[#e2e8f0]"
              >
                <div className="flex items-center gap-2 text-[#0b1f5c]">
                  <Bed size={20} className="text-[#19d3c5]" />
                  <div>
                    <p className="text-xs text-[#6b7a99]">Bedrooms</p>
                    <p className="font-semibold">{bedroomLabel(listing.bedrooms)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-[#0b1f5c]">
                  <Bath size={20} className="text-[#19d3c5]" />
                  <div>
                    <p className="text-xs text-[#6b7a99]">Bathrooms</p>
                    <p className="font-semibold">{listing.bathrooms ?? "—"}</p>
                  </div>
                </div>
                {listing.size_sqm && (
                  <div className="flex items-center gap-2 text-[#0b1f5c]">
                    <Maximize2 size={20} className="text-[#19d3c5]" />
                    <div>
                      <p className="text-xs text-[#6b7a99]">Size</p>
                      <p className="font-semibold">{listing.size_sqm} m²</p>
                    </div>
                  </div>
                )}
                {listing.furnished && (
                  <div className="flex items-center gap-2 text-[#0b1f5c]">
                    <Key size={20} className="text-[#19d3c5]" />
                    <div>
                      <p className="text-xs text-[#6b7a99]">Furnished</p>
                      <p className="font-semibold capitalize">{listing.furnished}</p>
                    </div>
                  </div>
                )}
                {listing.is_pet_friendly && (
                  <div className="flex items-center gap-2 text-[#0b1f5c]">
                    <PawPrint size={20} className="text-[#19d3c5]" />
                    <div>
                      <p className="text-xs text-[#6b7a99]">Pet Policy</p>
                      <p className="font-semibold">Pets allowed</p>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <h2
                  className="text-xl font-bold text-[#0b1f5c] mb-4"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  About this property
                </h2>
                <p className="text-[#6b7a99] leading-relaxed">
                  {listing.description}
                </p>
                {listing.address && (
                  <div className="flex items-start gap-2 mt-4 text-sm text-[#6b7a99]">
                    <MapPin size={15} className="text-[#19d3c5] mt-0.5 shrink-0" />
                    {listing.address}
                  </div>
                )}
              </motion.div>

              {/* Amenities */}
              {listing.amenities && listing.amenities.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.5 }}
                >
                  <h2
                    className="text-xl font-bold text-[#0b1f5c] mb-5"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Amenities
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {listing.amenities.map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center gap-3 p-3 rounded-xl bg-[#f5f7fa] border border-[#e2e8f0]"
                      >
                        <span className="text-[#19d3c5]">
                          {AMENITY_ICONS[amenity] ?? <CheckCircle2 size={18} />}
                        </span>
                        <span className="text-sm font-medium text-[#0b1f5c]">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Map placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h2
                  className="text-xl font-bold text-[#0b1f5c] mb-4"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Location
                </h2>
                <div className={cn(
                  "h-64 rounded-2xl overflow-hidden bg-gradient-to-br relative",
                  gradient
                )}>
                  <div className="absolute inset-0 flex items-center justify-center flex-col gap-2 text-white/40">
                    <MapPin size={32} />
                    <p className="text-sm font-medium">{listing.area}, Jakarta</p>
                    {listing.address && (
                      <p className="text-xs text-white/30 px-4 text-center">{listing.address}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Agent sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden"
                >
                  {/* Price header */}
                  <div className="bg-[#0b1f5c] p-5">
                    <div
                      className="text-2xl font-black text-white price-tag"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {formatIDR(listing.price_monthly)}
                    </div>
                    <p className="text-white/50 text-sm">per bulan</p>
                  </div>

                  <div className="p-5 space-y-4">
                    {/* Agent info */}
                    {listing.agent && (
                      <div className="flex items-center gap-3 pb-4 border-b border-[#e2e8f0]">
                        <button
                          onClick={() => router.push(`/agents/${listing.agent_id}`)}
                          className="relative flex-shrink-0 group cursor-pointer"
                          aria-label={`View ${listing.agent.full_name}'s profile`}
                        >
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#19d3c5] to-[#0b1f5c] flex items-center justify-center text-white font-bold">
                            {listing.agent.full_name?.[0] ?? "A"}
                          </div>
                          <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                        </button>
                        <div className="flex-1 min-w-0">
                          <button
                            onClick={() => router.push(`/agents/${listing.agent_id}`)}
                            className="font-semibold text-[#0b1f5c] text-sm hover:underline underline-offset-2 transition-colors text-left cursor-pointer"
                          >
                            {listing.agent.full_name}
                          </button>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={11} className="fill-[#19d3c5] text-[#19d3c5]" />
                            ))}
                            <span className="text-xs text-[#6b7a99] ml-1">5.0</span>
                          </div>
                          <div className="flex items-center gap-1 mt-0.5">
                            {listing.agent.is_verified && (
                              <span className="text-xs text-[#19d3c5] flex items-center gap-1">
                                <ShieldCheck size={11} />
                                Licensed agent
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Response time */}
                    <div className="bg-[#f5f7fa] rounded-xl p-3 text-center">
                      <p className="text-xs text-[#6b7a99]">Avg. response time</p>
                      <p className="text-sm font-bold text-[#0b1f5c]">Under 2 hours</p>
                    </div>

                    {/* CTA buttons */}
                    {listing.agent?.phone_whatsapp && (
                      <a
                        href={`https://wa.me/${listing.agent.phone_whatsapp}?text=Hi%2C%20I%27m%20interested%20in%20${encodeURIComponent(listing.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#19d3c5] text-[#0b1f5c] font-bold text-sm hover:bg-[#0fb5a8] transition-colors"
                      >
                        <MessageCircle size={16} />
                        Chat on WhatsApp
                      </a>
                    )}

                    {listing.agent_id && (
                      <button
                        onClick={() => router.push(`/agents/${listing.agent_id}`)}
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-[#0b1f5c] text-[#0b1f5c] font-semibold text-sm bg-white hover:bg-[#0b1f5c] hover:text-white transition-colors duration-200"
                      >
                        <User size={16} />
                        {t("listing.viewAgentProfile")}
                      </button>
                    )}

                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl border border-[#e2e8f0] text-sm font-medium text-[#6b7a99] hover:border-[#0b1f5c] hover:text-[#0b1f5c] transition-colors">
                        <Bookmark size={15} />
                        Save
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-xl border border-[#e2e8f0] text-sm font-medium text-[#6b7a99] hover:border-[#0b1f5c] hover:text-[#0b1f5c] transition-colors">
                        <Share2 size={15} />
                        Share
                      </button>
                    </div>

                    <p className="text-xs text-[#6b7a99] text-center">
                      No fees from Rentara. Direct agent contact only.
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Similar listings */}
          {similar.length > 0 && (
            <div className="mt-16">
              <h2
                className="text-2xl font-black text-[#0b1f5c] mb-6"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Similar in {listing.area}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {similar.map((l) => (
                  <ListingCard key={l.id} listing={l} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
