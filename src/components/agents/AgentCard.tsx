"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Star, Clock, LayoutList, MapPin } from "lucide-react";
import type { Agent } from "@/lib/agents";

export interface AgentCardProps {
  agent: Agent;
  featured?: boolean;
}

const cardVariants: Variants = {
  rest: { y: 0, boxShadow: "0 1px 3px 0 rgba(0,0,0,0.08)" },
  hover: {
    y: -6,
    boxShadow: "0 20px 40px -8px rgba(11,31,92,0.18)",
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

const avatarRingVariants: Variants = {
  rest: { scale: 1 },
  hover: {
    scale: [1, 1.08, 1],
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

const borderVariants: Variants = {
  rest: { scaleY: 0, originY: 0 },
  hover: { scaleY: 1, originY: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

function VerifiedBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-teal/10 text-teal-dark border border-teal/30">
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M5 0L6.12 3.38H9.51L6.76 5.47L7.87 8.85L5 6.76L2.13 8.85L3.24 5.47L0.49 3.38H3.88L5 0Z" fill="#19d3c5" />
      </svg>
      Verified
    </span>
  );
}

function StarRating({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={12}
            className={i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-navy">{rating.toFixed(1)}</span>
      <span className="text-xs text-muted">({reviews})</span>
    </div>
  );
}

export function AgentCard({ agent, featured = false }: AgentCardProps) {
  const whatsappUrl = `https://wa.me/${agent.whatsapp}?text=${encodeURIComponent(`Hi ${agent.name}, I found your profile on Rentara and I'm interested in learning more about your listings.`)}`;

  if (featured) {
    return (
      <motion.div
        variants={cardVariants}
        initial="rest"
        whileHover="hover"
        className="relative rounded-2xl overflow-hidden bg-navy text-white p-6 flex flex-col gap-4 cursor-default"
      >
        <motion.div
          variants={borderVariants}
          className="absolute left-0 top-0 bottom-0 w-1 bg-teal rounded-l-2xl"
        />

        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-teal text-navy">
            ⭐ Top Agent
          </span>
        </div>

        <div className="flex items-start gap-4 pt-2">
          <motion.div variants={avatarRingVariants} className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-full ring-2 ring-teal ring-offset-2 ring-offset-navy overflow-hidden">
              <Image
                src={agent.avatar}
                alt={agent.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-white text-base leading-tight">{agent.name}</h3>
              {agent.verified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-teal/20 text-teal border border-teal/40">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M5 0L6.12 3.38H9.51L6.76 5.47L7.87 8.85L5 6.76L2.13 8.85L3.24 5.47L0.49 3.38H3.88L5 0Z" fill="#19d3c5" />
                  </svg>
                  Verified
                </span>
              )}
            </div>
            <p className="text-sm text-teal-light/80 truncate">{agent.agency}</p>
            <StarRating rating={agent.rating} reviews={agent.reviews} />
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-1.5">
            <Clock size={12} className="text-teal" />
            <span className="text-xs text-white/90">{agent.responseTime}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-3 py-1.5">
            <LayoutList size={12} className="text-teal" />
            <span className="text-xs text-white/90">{agent.activeListings} listings</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {agent.areas.map((area) => (
            <span
              key={area}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border border-teal/40 text-teal-light"
            >
              <MapPin size={9} />
              {area}
            </span>
          ))}
        </div>

        <p className="text-sm text-white/70 leading-relaxed line-clamp-2">{agent.bio}</p>

        <div className="flex gap-2 mt-auto pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal text-navy font-semibold text-sm hover:bg-teal-dark transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.858L.057 23.571a.5.5 0 0 0 .617.632l5.938-1.554A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.648-.523-5.153-1.43l-.359-.214-3.723.976.994-3.634-.234-.374A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
            </svg>
            WhatsApp
          </a>
          <Link
            href={`/agents/${agent.id}`}
            className="flex-1 flex items-center justify-center py-2.5 rounded-xl border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
          >
            View Profile
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      className="relative rounded-2xl overflow-hidden bg-white border border-border p-6 flex flex-col gap-4 cursor-default"
    >
      <motion.div
        variants={borderVariants}
        className="absolute left-0 top-0 bottom-0 w-1 bg-teal rounded-l-2xl"
      />

      <div className="flex items-start gap-4">
        <motion.div variants={avatarRingVariants} className="relative flex-shrink-0">
          <div className={`w-16 h-16 rounded-full overflow-hidden ${agent.verified ? "ring-2 ring-teal ring-offset-2" : "ring-1 ring-border"}`}>
            <Image
              src={agent.avatar}
              alt={agent.name}
              width={64}
              height={64}
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-navy text-base leading-tight">{agent.name}</h3>
            {agent.verified && <VerifiedBadge />}
          </div>
          <p className="text-sm text-muted truncate">{agent.agency}</p>
          <StarRating rating={agent.rating} reviews={agent.reviews} />
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 bg-gray-soft rounded-lg px-3 py-1.5">
          <Clock size={12} className="text-teal-dark" />
          <span className="text-xs text-muted font-medium">{agent.responseTime}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-gray-soft rounded-lg px-3 py-1.5">
          <LayoutList size={12} className="text-teal-dark" />
          <span className="text-xs text-muted font-medium">{agent.activeListings} listings</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {agent.areas.map((area) => (
          <span
            key={area}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border border-teal/40 text-teal-dark bg-teal/5"
          >
            <MapPin size={9} />
            {area}
          </span>
        ))}
      </div>

      <p className="text-sm text-muted leading-relaxed line-clamp-2">{agent.bio}</p>

      <div className="flex gap-2 mt-auto pt-2">
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-teal text-navy font-semibold text-sm hover:bg-teal-dark transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.858L.057 23.571a.5.5 0 0 0 .617.632l5.938-1.554A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.648-.523-5.153-1.43l-.359-.214-3.723.976.994-3.634-.234-.374A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
          </svg>
          WhatsApp
        </a>
        <Link
          href={`/agents/${agent.id}`}
          className="flex-1 flex items-center justify-center py-2.5 rounded-xl border border-navy/20 text-navy font-semibold text-sm hover:bg-navy hover:text-white transition-colors"
        >
          View Profile
        </Link>
      </div>
    </motion.div>
  );
}

export function AgentCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-white p-6 flex flex-col gap-4">
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-full skeleton flex-shrink-0" />
        <div className="flex flex-col gap-2 flex-1">
          <div className="h-4 w-32 rounded skeleton" />
          <div className="h-3 w-24 rounded skeleton" />
          <div className="h-3 w-20 rounded skeleton" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-7 w-28 rounded-lg skeleton" />
        <div className="h-7 w-24 rounded-lg skeleton" />
      </div>
      <div className="flex gap-1.5">
        <div className="h-6 w-16 rounded-full skeleton" />
        <div className="h-6 w-20 rounded-full skeleton" />
        <div className="h-6 w-14 rounded-full skeleton" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-full rounded skeleton" />
        <div className="h-3 w-4/5 rounded skeleton" />
      </div>
      <div className="flex gap-2 mt-auto pt-2">
        <div className="flex-1 h-10 rounded-xl skeleton" />
        <div className="flex-1 h-10 rounded-xl skeleton" />
      </div>
    </div>
  );
}
