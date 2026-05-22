"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Bed, Bath, Maximize2, PawPrint, MapPin } from "lucide-react";
import { formatIDR, bedroomLabel, cn } from "@/lib/utils";
import type { Listing } from "@/types";
import VerifiedBadge from "@/components/ui/VerifiedBadge";

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

interface ListingCardProps {
  listing: Listing;
  priority?: boolean;
}

export default function ListingCard({ listing, priority = false }: ListingCardProps) {
  const gradient = AREA_GRADIENTS[listing.area] ?? "from-[#0b1f5c] to-[#122470]";
  const hasPhoto = listing.photos && listing.photos.length > 0;

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 24px 48px rgba(11,31,92,0.12)" }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="group bg-white rounded-2xl overflow-hidden border border-[#e2e8f0] shadow-sm"
    >
      <Link href={`/listings/${listing.id}`} className="block">
        {/* Photo area */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {hasPhoto ? (
            <img
              src={listing.photos![0]}
              alt={listing.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className={cn(
                "w-full h-full bg-gradient-to-br flex items-end p-4",
                gradient
              )}
            >
              <span
                className="text-4xl font-black text-white/20 leading-none"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {listing.area}
              </span>
            </div>
          )}

          {/* Verified badge overlay */}
          {listing.is_verified && (
            <div className="absolute top-3 left-3">
              <VerifiedBadge size="sm" />
            </div>
          )}

          {/* Pet friendly */}
          {listing.is_pet_friendly && (
            <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/90 backdrop-blur flex items-center justify-center">
              <PawPrint size={13} className="text-[#8b6b4a]" />
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-[#0b1f5c]/0 group-hover:bg-[#0b1f5c]/40 transition-colors duration-300 flex items-center justify-center">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-[#0b1f5c] text-sm font-semibold px-4 py-2 rounded-full">
              View Details
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Area */}
          <div className="flex items-center gap-1 mb-1.5">
            <MapPin size={12} className="text-[#19d3c5]" />
            <span className="text-xs font-medium text-[#19d3c5] uppercase tracking-wide">
              {listing.area}
            </span>
          </div>

          {/* Title */}
          <h3
            className="font-semibold text-[#0b1f5c] text-[15px] leading-snug line-clamp-2 mb-3"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {listing.title}
          </h3>

          {/* Stats row */}
          <div className="flex items-center gap-3 text-xs text-[#6b7a99] mb-3">
            <span className="flex items-center gap-1">
              <Bed size={12} />
              {bedroomLabel(listing.bedrooms)}
            </span>
            <span className="w-px h-3 bg-[#e2e8f0]" />
            <span className="flex items-center gap-1">
              <Bath size={12} />
              {listing.bathrooms ?? "—"} Bath
            </span>
            {listing.size_sqm && (
              <>
                <span className="w-px h-3 bg-[#e2e8f0]" />
                <span className="flex items-center gap-1">
                  <Maximize2 size={12} />
                  {listing.size_sqm} m²
                </span>
              </>
            )}
          </div>

          {/* Furnished tag */}
          {listing.furnished && (
            <span className="inline-block text-xs px-2 py-0.5 rounded-md bg-[#f5f7fa] text-[#6b7a99] mb-3 capitalize">
              {listing.furnished}
            </span>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-1">
            <span
              className="text-lg font-bold text-[#0b1f5c] price-tag"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {formatIDR(listing.price_monthly)}
            </span>
            <span className="text-xs text-[#6b7a99]">/ bulan</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function ListingCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#e2e8f0]">
      <div className="aspect-[4/3] skeleton" />
      <div className="p-4 space-y-3">
        <div className="h-3 w-16 skeleton rounded" />
        <div className="h-4 w-3/4 skeleton rounded" />
        <div className="h-3 w-1/2 skeleton rounded" />
        <div className="h-5 w-2/5 skeleton rounded" />
      </div>
    </div>
  );
}
