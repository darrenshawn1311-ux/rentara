"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useIntent } from "@/lib/IntentContext";
import { useLang } from "@/lib/i18n/LanguageContext";

export function UserSegmentModal() {
  const [open, setOpen] = useState(false);
  const { intent, setIntent } = useIntent();
  const { t } = useLang();
  const router = useRouter();

  useEffect(() => {
    // Only show if no intent stored and not dismissed this session
    if (!intent && !sessionStorage.getItem("rentara-modal-dismissed")) {
      const timer = setTimeout(() => setOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, [intent]);

  const handleRenter = () => {
    setIntent("renter");
    setOpen(false);
    router.push("/marketplace");
  };

  const handleAgent = () => {
    setIntent("agent");
    setOpen(false);
    router.push("/agents/onboarding");
  };

  const handleDismiss = () => {
    setOpen(false);
    sessionStorage.setItem("rentara-modal-dismissed", "true");
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none"
          >
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden pointer-events-auto">
              {/* Header */}
              <div className="bg-[#0b1f5c] px-8 pt-8 pb-6">
                <p className="text-[#19d3c5] text-xs font-bold uppercase tracking-widest mb-2">
                  Welcome to Rentara
                </p>
                <h2 className="text-white text-2xl font-bold leading-snug" style={{ fontFamily: "Poppins, sans-serif" }}>
                  {t("segment.title")}
                </h2>
                <p className="text-blue-200/70 text-sm mt-2">
                  {t("segment.subtitle")}
                </p>
              </div>

              {/* Options */}
              <div className="p-6 grid grid-cols-2 gap-4">
                {/* Renter card */}
                <button
                  onClick={handleRenter}
                  className="group flex flex-col items-center gap-3 p-5 rounded-2xl border-2 border-gray-100 hover:border-[#19d3c5] hover:bg-[#19d3c5]/5 transition-all duration-200 text-center"
                >
                  <span className="text-3xl">🏠</span>
                  <div>
                    <p className="font-bold text-[#0b1f5c] text-sm">
                      {t("segment.renter.label")}
                    </p>
                    <p className="text-gray-500 text-xs mt-1 leading-snug">
                      {t("segment.renter.desc")}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#0fb5a8] group-hover:text-[#19d3c5] transition-colors">
                    {t("segment.renter.cta")} →
                  </span>
                </button>

                {/* Agent card */}
                <button
                  onClick={handleAgent}
                  className="group flex flex-col items-center gap-3 p-5 rounded-2xl border-2 border-gray-100 hover:border-[#0b1f5c] hover:bg-[#0b1f5c]/5 transition-all duration-200 text-center"
                >
                  <span className="text-3xl">🏢</span>
                  <div>
                    <p className="font-bold text-[#0b1f5c] text-sm">
                      {t("segment.agent.label")}
                    </p>
                    <p className="text-gray-500 text-xs mt-1 leading-snug">
                      {t("segment.agent.desc")}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-[#0b1f5c] group-hover:text-[#122470] transition-colors">
                    {t("segment.agent.cta")} →
                  </span>
                </button>
              </div>

              <div className="px-6 pb-6 text-center">
                <button
                  onClick={handleDismiss}
                  className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {t("segment.skip")}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
