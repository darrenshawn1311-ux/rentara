"use client";

import { useState, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown, Search } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ListingCard, { ListingCardSkeleton } from "@/components/listings/ListingCard";
import { formatIDR, cn } from "@/lib/utils";
import { SAMPLE_LISTINGS } from "@/lib/seed-data";
import { JAKARTA_AREAS } from "@/types";
import type { FilterState, FurnishedType } from "@/types";

const DEFAULT_FILTERS: FilterState = {
  minPrice: 2000000,
  maxPrice: 60000000,
  areas: [],
  furnished: "all",
  bedrooms: "all",
  verifiedOnly: false,
  petFriendly: false,
  sortBy: "newest",
};

function PillButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-sm font-medium transition-all border",
        active
          ? "bg-[#0b1f5c] text-white border-[#0b1f5c]"
          : "bg-white text-[#6b7a99] border-[#e2e8f0] hover:border-[#0b1f5c]"
      )}
    >
      {children}
    </button>
  );
}

function Toggle({
  active,
  onToggle,
  label,
}: {
  active: boolean;
  onToggle: () => void;
  label: string;
}) {
  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <span className="text-sm text-[#0b1f5c] font-medium">{label}</span>
      <button
        role="switch"
        aria-checked={active}
        onClick={onToggle}
        className={cn(
          "relative w-10 h-5 rounded-full transition-colors",
          active ? "bg-[#19d3c5]" : "bg-[#e2e8f0]"
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform",
            active && "translate-x-5"
          )}
        />
      </button>
    </label>
  );
}

function FilterPanel({
  filters,
  onChange,
  onReset,
}: {
  filters: FilterState;
  onChange: (f: Partial<FilterState>) => void;
  onReset: () => void;
}) {
  const BEDROOM_OPTIONS = ["all", "studio", "1", "2", "3", "4+"];
  const FURNISHED_OPTIONS: Array<{ value: FurnishedType | "all"; label: string }> = [
    { value: "all", label: "Any" },
    { value: "unfurnished", label: "Unfurnished" },
    { value: "semi-furnished", label: "Semi" },
    { value: "fully-furnished", label: "Fully" },
  ];

  return (
    <div className="space-y-6">
      {/* Budget */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#6b7a99] mb-3">Budget / Month</p>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs text-[#6b7a99] mb-1 block">Min</label>
            <select
              className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm text-[#0b1f5c] focus:outline-none focus:border-[#19d3c5]"
              value={filters.minPrice}
              onChange={(e) => onChange({ minPrice: Number(e.target.value) })}
            >
              {[2000000, 4000000, 6000000, 8000000, 10000000, 15000000, 20000000].map((v) => (
                <option key={v} value={v}>{formatIDR(v)}</option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label className="text-xs text-[#6b7a99] mb-1 block">Max</label>
            <select
              className="w-full border border-[#e2e8f0] rounded-lg px-3 py-2 text-sm text-[#0b1f5c] focus:outline-none focus:border-[#19d3c5]"
              value={filters.maxPrice}
              onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
            >
              {[10000000, 15000000, 20000000, 30000000, 40000000, 60000000, 100000000].map((v) => (
                <option key={v} value={v}>{formatIDR(v)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Area */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#6b7a99] mb-3">Area</p>
        <div className="flex flex-wrap gap-2">
          {JAKARTA_AREAS.map((area) => {
            const active = filters.areas.includes(area);
            return (
              <button
                key={area}
                onClick={() =>
                  onChange({
                    areas: active
                      ? filters.areas.filter((a) => a !== area)
                      : [...filters.areas, area],
                  })
                }
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                  active
                    ? "bg-[#0b1f5c] text-white border-[#0b1f5c]"
                    : "bg-white text-[#6b7a99] border-[#e2e8f0] hover:border-[#0b1f5c]"
                )}
              >
                {area}
              </button>
            );
          })}
        </div>
      </div>

      {/* Furnished */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#6b7a99] mb-3">Furnished</p>
        <div className="flex flex-wrap gap-2">
          {FURNISHED_OPTIONS.map((opt) => (
            <PillButton
              key={opt.value}
              active={filters.furnished === opt.value}
              onClick={() => onChange({ furnished: opt.value })}
            >
              {opt.label}
            </PillButton>
          ))}
        </div>
      </div>

      {/* Bedrooms */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#6b7a99] mb-3">Bedrooms</p>
        <div className="flex flex-wrap gap-2">
          {BEDROOM_OPTIONS.map((opt) => (
            <PillButton
              key={opt}
              active={filters.bedrooms === opt}
              onClick={() => onChange({ bedrooms: opt })}
            >
              {opt === "all" ? "Any" : opt === "studio" ? "Studio" : `${opt} BR`}
            </PillButton>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-3">
        <Toggle
          label="Verified listings only"
          active={filters.verifiedOnly}
          onToggle={() => onChange({ verifiedOnly: !filters.verifiedOnly })}
        />
        <Toggle
          label="Pet friendly"
          active={filters.petFriendly}
          onToggle={() => onChange({ petFriendly: !filters.petFriendly })}
        />
      </div>

      {/* Reset */}
      <button
        onClick={onReset}
        className="w-full py-2.5 rounded-xl border border-[#e2e8f0] text-sm text-[#6b7a99] hover:border-red-300 hover:text-red-500 transition-colors"
      >
        Reset filters
      </button>
    </div>
  );
}

function MarketplaceContent() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const applyFilter = useCallback((f: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...f }));
  }, []);

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

  // Filter + sort listings
  const filtered = SAMPLE_LISTINGS.filter((l) => {
    if (l.price_monthly < filters.minPrice || l.price_monthly > filters.maxPrice) return false;
    if (filters.areas.length > 0 && !filters.areas.includes(l.area as never)) return false;
    if (filters.furnished !== "all" && l.furnished !== filters.furnished) return false;
    if (filters.verifiedOnly && !l.is_verified) return false;
    if (filters.petFriendly && !l.is_pet_friendly) return false;
    if (filters.bedrooms !== "all") {
      if (filters.bedrooms === "studio" && l.bedrooms !== 0) return false;
      if (filters.bedrooms === "4+" && (l.bedrooms ?? 0) < 4) return false;
      if (!["studio", "4+", "all"].includes(filters.bedrooms) && l.bedrooms !== Number(filters.bedrooms)) return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!l.title.toLowerCase().includes(q) && !l.area.toLowerCase().includes(q)) return false;
    }
    return true;
  }).sort((a, b) => {
    if (filters.sortBy === "price_asc") return a.price_monthly - b.price_monthly;
    if (filters.sortBy === "price_desc") return b.price_monthly - a.price_monthly;
    if (filters.sortBy === "verified") return (b.is_verified ? 1 : 0) - (a.is_verified ? 1 : 0);
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="bg-white border-b border-[#e2e8f0] px-6 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div>
                <h1
                  className="text-2xl font-black text-[#0b1f5c]"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Jakarta Rentals
                </h1>
                <p className="text-[#6b7a99] text-sm">{filtered.length} properties found</p>
              </div>

              {/* Search */}
              <div className="flex-1 max-w-md relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6b7a99]" />
                <input
                  placeholder="Search by title or area..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm focus:outline-none focus:border-[#19d3c5] bg-[#f5f7fa]"
                />
              </div>

              <div className="flex items-center gap-3 ml-auto">
                {/* Sort */}
                <div className="relative">
                  <select
                    value={filters.sortBy}
                    onChange={(e) => applyFilter({ sortBy: e.target.value as FilterState["sortBy"] })}
                    className="appearance-none pl-4 pr-8 py-2.5 rounded-xl border border-[#e2e8f0] text-sm text-[#0b1f5c] focus:outline-none focus:border-[#19d3c5] bg-white cursor-pointer"
                  >
                    <option value="newest">Newest</option>
                    <option value="price_asc">Price: Low → High</option>
                    <option value="price_desc">Price: High → Low</option>
                    <option value="verified">Verified first</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#6b7a99] pointer-events-none" />
                </div>

                {/* Mobile filter button */}
                <button
                  onClick={() => setDrawerOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#e2e8f0] text-sm font-medium text-[#0b1f5c] bg-white"
                >
                  <SlidersHorizontal size={15} />
                  Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex gap-8">
            {/* Desktop sidebar */}
            <aside className="hidden lg:block w-72 shrink-0">
              <div className="bg-white rounded-2xl border border-[#e2e8f0] p-6 sticky top-24">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-bold text-[#0b1f5c]" style={{ fontFamily: "Poppins, sans-serif" }}>
                    Filters
                  </h2>
                  <SlidersHorizontal size={16} className="text-[#6b7a99]" />
                </div>
                <FilterPanel filters={filters} onChange={applyFilter} onReset={resetFilters} />
              </div>
            </aside>

            {/* Grid */}
            <div className="flex-1 min-w-0">
              {filtered.length === 0 ? (
                <div className="text-center py-24">
                  <p className="text-4xl mb-4">🏠</p>
                  <h3 className="font-bold text-[#0b1f5c] text-xl mb-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                    No listings match
                  </h3>
                  <p className="text-[#6b7a99] text-sm mb-5">Try adjusting your filters or search term.</p>
                  <button
                    onClick={resetFilters}
                    className="px-5 py-2.5 rounded-xl bg-[#0b1f5c] text-white text-sm font-medium"
                  >
                    Reset filters
                  </button>
                </div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                  initial="hidden"
                  animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.06 } }, hidden: {} }}
                >
                  {filtered.map((listing) => (
                    <motion.div
                      key={listing.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                      }}
                    >
                      <ListingCard listing={listing} />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-black/40"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-80 bg-white overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-[#0b1f5c] text-lg" style={{ fontFamily: "Poppins, sans-serif" }}>
                  Filters
                </h2>
                <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-lg hover:bg-[#f5f7fa]">
                  <X size={18} />
                </button>
              </div>
              <FilterPanel filters={filters} onChange={applyFilter} onReset={resetFilters} />
              <button
                onClick={() => setDrawerOpen(false)}
                className="w-full mt-6 py-3.5 rounded-xl bg-[#0b1f5c] text-white font-semibold"
              >
                Show {filtered.length} results
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

export default function MarketplacePage() {
  return (
    <Suspense>
      <MarketplaceContent />
    </Suspense>
  );
}
