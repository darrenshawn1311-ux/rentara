"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { Star, Clock, LayoutList, MapPin, TrendingUp, ShieldCheck, ArrowLeft, MessageCircle } from "lucide-react";
import { getAgentById } from "@/lib/agents";
import { SAMPLE_LISTINGS } from "@/lib/seed-data";
import ListingCard from "@/components/listings/ListingCard";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const SAMPLE_REVIEWS = [
  {
    id: 1,
    name: "Michael T.",
    avatar: "https://i.pravatar.cc/150?u=michael",
    date: "March 2025",
    rating: 5,
    text: "Absolutely professional. Found us the perfect apartment in under a week. Communication was flawless throughout the entire process.",
  },
  {
    id: 2,
    name: "Priya R.",
    avatar: "https://i.pravatar.cc/150?u=priya",
    date: "January 2025",
    rating: 5,
    text: "As an expat relocating from Singapore, I was nervous about the process. This agent made everything seamless — highly recommend!",
  },
  {
    id: 3,
    name: "David K.",
    avatar: "https://i.pravatar.cc/150?u=davidk",
    date: "December 2024",
    rating: 5,
    text: "Honest, fast, and genuinely helpful. No hidden fees, no surprises. Will absolutely use again for our next renewal.",
  },
];

export default function AgentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const agent = getAgentById(id);

  if (!agent) return notFound();

  const agentListings = SAMPLE_LISTINGS.filter((l) => l.agent_id === agent.id);
  const whatsappUrl = `https://wa.me/${agent.whatsapp}?text=${encodeURIComponent(`Hi ${agent.name}, I found your profile on Rentara and I'm interested in your listings.`)}`;

  const statCards = [
    { icon: Star, label: "Rating", value: `${agent.rating}/5`, sub: `${agent.reviews} reviews` },
    { icon: Clock, label: "Response", value: agent.responseTime, sub: `${agent.responseRate}% rate` },
    { icon: LayoutList, label: "Listings", value: String(agent.activeListings), sub: "currently active" },
    { icon: TrendingUp, label: "Total Deals", value: String(agent.totalDeals), sub: `since ${agent.joinedYear}` },
  ];

  return (
    <div className="min-h-screen bg-gray-soft">
      {/* Hero */}
      <div className="bg-navy text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16">
          <Link
            href="/agents"
            className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft size={14} />
            Back to agents
          </Link>

          <motion.div
            variants={stagger}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
          >
            {/* Avatar */}
            <motion.div variants={fadeUp} className="relative flex-shrink-0">
              <div className={`w-24 h-24 rounded-full overflow-hidden ${agent.verified ? "ring-3 ring-teal ring-offset-3 ring-offset-navy" : "ring-2 ring-white/20"}`}>
                <Image
                  src={agent.avatar}
                  alt={agent.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              {agent.verified && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-teal rounded-full flex items-center justify-center ring-2 ring-navy">
                  <ShieldCheck size={14} className="text-navy" />
                </div>
              )}
            </motion.div>

            {/* Name + meta */}
            <motion.div variants={fadeUp} className="flex-1">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{agent.name}</h1>
                {agent.verified && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-teal/20 text-teal border border-teal/40">
                    <ShieldCheck size={11} />
                    Verified Agent
                  </span>
                )}
              </div>
              <p className="text-white/60 text-sm mb-3">{agent.agency} · Member since {agent.joinedYear}</p>

              <div className="flex items-center gap-2 flex-wrap">
                {/* Stars */}
                <div className="flex items-center gap-1 bg-white/10 rounded-lg px-3 py-1.5">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={11} className={i <= Math.round(agent.rating) ? "fill-amber-400 text-amber-400" : "text-white/20"} />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-white ml-1">{agent.rating}</span>
                  <span className="text-xs text-white/50">({agent.reviews})</span>
                </div>
                {/* Areas */}
                {agent.areas.map((a) => (
                  <span key={a} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white/10 text-white/70">
                    <MapPin size={9} />
                    {a}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div variants={fadeUp} className="flex flex-col gap-2 w-full sm:w-auto">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal text-navy font-semibold text-sm hover:bg-teal-dark transition-colors whitespace-nowrap"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.126 1.533 5.858L.057 23.571a.5.5 0 0 0 .617.632l5.938-1.554A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.648-.523-5.153-1.43l-.359-.214-3.723.976.994-3.634-.234-.374A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                </svg>
                WhatsApp Agent
              </a>
              <button className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/20 text-white font-semibold text-sm hover:bg-white/10 transition-colors whitespace-nowrap">
                <MessageCircle size={14} />
                Send Message
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 pb-16 space-y-8">
        {/* Stat cards */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {statCards.map(({ icon: Icon, label, value, sub }) => (
            <motion.div
              key={label}
              variants={fadeUp}
              className="bg-white rounded-2xl p-4 shadow-sm border border-border flex flex-col items-center text-center gap-1"
            >
              <div className="w-9 h-9 rounded-xl bg-teal/10 flex items-center justify-center mb-1">
                <Icon size={16} className="text-teal-dark" />
              </div>
              <span className="text-xs text-muted font-medium">{label}</span>
              <span className="text-lg font-bold text-navy">{value}</span>
              <span className="text-xs text-muted">{sub}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2, ease: "easeOut" }}
          className="bg-white rounded-2xl p-6 shadow-sm border border-border"
        >
          <h2 className="text-base font-semibold text-navy mb-3">About {agent.name}</h2>
          <p className="text-sm text-muted leading-relaxed">{agent.bio}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {agent.areas.map((a) => (
              <span key={a} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium bg-teal/8 text-teal-dark border border-teal/25">
                <MapPin size={10} />
                {a}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Listings */}
        {agentListings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.3, ease: "easeOut" }}
          >
            <h2 className="text-base font-semibold text-navy mb-4">
              Active Listings
              <span className="ml-2 px-2 py-0.5 rounded-full bg-teal/10 text-teal-dark text-xs font-semibold">
                {agentListings.length}
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {agentListings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.4, ease: "easeOut" }}
        >
          <h2 className="text-base font-semibold text-navy mb-4">
            Client Reviews
            <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-xs font-semibold">
              {agent.reviews} total
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {SAMPLE_REVIEWS.map((review) => (
              <div key={review.id} className="bg-white rounded-2xl p-5 shadow-sm border border-border flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-navy">{review.name}</p>
                    <p className="text-xs text-muted">{review.date}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={11} className={i <= review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted leading-relaxed">{review.text}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
