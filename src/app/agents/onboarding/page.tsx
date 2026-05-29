"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { CheckCircle2, ChevronRight, ChevronLeft, Upload, MapPin } from "lucide-react";
import { useLang } from "@/lib/i18n/LanguageContext";
import { JAKARTA_AREAS } from "@/types";

const TOTAL_STEPS = 4;

const slideVariants: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40, transition: { duration: 0.2, ease: "easeIn" } }),
};

interface FormData {
  // Step 1 – Personal
  fullName: string;
  email: string;
  whatsapp: string;
  // Step 2 – Professional
  agencyName: string;
  licenseNumber: string;
  yearsExperience: string;
  specialtyAreas: string[];
  // Step 3 – Documents (placeholders)
  ktpFile: string;
  licenseFile: string;
  // Step 4 – Agreement
  agreeTerms: boolean;
  agreeResponseTime: boolean;
  preferredResponseTime: string;
}

const INITIAL_FORM: FormData = {
  fullName: "", email: "", whatsapp: "",
  agencyName: "", licenseNumber: "", yearsExperience: "", specialtyAreas: [],
  ktpFile: "", licenseFile: "",
  agreeTerms: false, agreeResponseTime: false, preferredResponseTime: "< 2 hours",
};

function ProgressBar({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div key={i} className="flex items-center gap-1">
          <div className={`h-1.5 rounded-full transition-all duration-300 ${
            i < step ? "bg-[#19d3c5] w-8" : i === step ? "bg-[#19d3c5]/60 w-8" : "bg-white/20 w-8"
          }`} />
        </div>
      ))}
    </div>
  );
}

function StepLabel({ step, t }: { step: number; t: (k: string) => string }) {
  const labels = [
    t("onboarding.step1"),
    t("onboarding.step2"),
    t("onboarding.step3"),
    t("onboarding.step4"),
  ];
  return (
    <p className="text-[#19d3c5] text-xs font-semibold uppercase tracking-widest">
      Step {step + 1} of {TOTAL_STEPS} — {labels[step]}
    </p>
  );
}

export default function AgentOnboarding() {
  const { t } = useLang();
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  const goNext = () => { setDirection(1); setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1)); };
  const goBack = () => { setDirection(-1); setStep((s) => Math.max(s - 1, 0)); };
  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const toggleArea = (area: string) => {
    set("specialtyAreas",
      form.specialtyAreas.includes(area)
        ? form.specialtyAreas.filter((a) => a !== area)
        : [...form.specialtyAreas, area]
    );
  };

  const handleSubmit = () => {
    console.log("Rentara agent application:", form);
    setSubmitted(true);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#19d3c5]/40 focus:border-[#19d3c5] bg-white placeholder:text-gray-400 transition-colors";
  const labelClass = "block text-sm font-medium text-[#0b1f5c] mb-1.5";

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f7f3ee] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-[#19d3c5]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={32} className="text-[#19d3c5]" />
          </div>
          <h2 className="text-2xl font-black text-[#0b1f5c] mb-3" style={{ fontFamily: "Poppins, sans-serif" }}>
            {t("onboarding.success.title")}
          </h2>
          <p className="text-[#6b7a99] text-sm leading-relaxed mb-8">
            {t("onboarding.success.body")}
          </p>
          <Link
            href="/agents"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0b1f5c] text-white font-semibold text-sm hover:bg-[#122470] transition-colors"
          >
            Browse Agents →
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f3ee]">
      {/* Header */}
      <div className="bg-[#0b1f5c] text-white">
        <div className="max-w-2xl mx-auto px-6 pt-8 pb-10">
          <Link href="/" className="flex items-center gap-0.5 mb-8">
            <span className="text-xl font-black" style={{ fontFamily: "Poppins, sans-serif" }}>Rent</span>
            <span className="text-xl font-black text-[#19d3c5]" style={{ fontFamily: "Poppins, sans-serif" }}>ara</span>
          </Link>
          <StepLabel step={step} t={t} />
          <h1 className="text-2xl font-bold mt-2 mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>
            {t("onboarding.title")}
          </h1>
          <ProgressBar step={step} />
        </div>
      </div>

      {/* Form card */}
      <div className="max-w-2xl mx-auto px-6 -mt-4 pb-16">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="p-8 space-y-5"
            >
              {/* ── STEP 1 — Personal ───────────────────────────── */}
              {step === 0 && (
                <>
                  <div>
                    <label className={labelClass}>Full name</label>
                    <input className={inputClass} placeholder="Budi Santoso" value={form.fullName} onChange={(e) => set("fullName", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Email address</label>
                    <input type="email" className={inputClass} placeholder="budi@agency.co.id" value={form.email} onChange={(e) => set("email", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>WhatsApp number</label>
                    <input className={inputClass} placeholder="628XXXXXXXXX" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
                    <p className="text-xs text-gray-400 mt-1.5">Include country code. Leads will be sent here.</p>
                  </div>
                  <div>
                    <label className={labelClass}>Profile photo</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[#19d3c5]/50 transition-colors cursor-pointer">
                      <Upload size={20} className="mx-auto text-gray-300 mb-2" />
                      <p className="text-sm text-gray-400">Click to upload a professional headshot</p>
                      <p className="text-xs text-gray-300 mt-1">JPG or PNG, max 5MB</p>
                    </div>
                  </div>
                </>
              )}

              {/* ── STEP 2 — Professional ───────────────────────── */}
              {step === 1 && (
                <>
                  <div>
                    <label className={labelClass}>Agency / Company name</label>
                    <input className={inputClass} placeholder="Prestige Property Group" value={form.agencyName} onChange={(e) => set("agencyName", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>License number (SBN/PPJB)</label>
                    <input className={inputClass} placeholder="SBN-2024-XXXXX" value={form.licenseNumber} onChange={(e) => set("licenseNumber", e.target.value)} />
                  </div>
                  <div>
                    <label className={labelClass}>Years of experience</label>
                    <select className={inputClass} value={form.yearsExperience} onChange={(e) => set("yearsExperience", e.target.value)}>
                      <option value="">Select range</option>
                      <option value="0-1">Less than 1 year</option>
                      <option value="1-3">1–3 years</option>
                      <option value="3-5">3–5 years</option>
                      <option value="5-10">5–10 years</option>
                      <option value="10+">10+ years</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Specialty areas</label>
                    <div className="flex flex-wrap gap-2">
                      {JAKARTA_AREAS.map((area) => (
                        <button
                          key={area}
                          type="button"
                          onClick={() => toggleArea(area)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                            form.specialtyAreas.includes(area)
                              ? "bg-[#19d3c5] text-[#0b1f5c] border-[#19d3c5]"
                              : "bg-white text-gray-500 border-gray-200 hover:border-[#19d3c5]/40"
                          }`}
                        >
                          <MapPin size={9} />
                          {area}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ── STEP 3 — Documents ──────────────────────────── */}
              {step === 2 && (
                <div className="space-y-5">
                  <p className="text-sm text-gray-500 leading-relaxed bg-amber-50 border border-amber-200 rounded-xl p-4">
                    <strong className="text-amber-700">Identity verification required.</strong> Documents are reviewed privately by the Rentara compliance team and never shared publicly.
                  </p>
                  <div>
                    <label className={labelClass}>KTP / Passport (identity document)</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[#19d3c5]/50 transition-colors cursor-pointer">
                      <Upload size={20} className="mx-auto text-gray-300 mb-2" />
                      <p className="text-sm text-gray-400">Upload KTP or Passport scan</p>
                      <p className="text-xs text-gray-300 mt-1">PDF, JPG or PNG, max 10MB</p>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Agent license document (SBN/SKM)</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-[#19d3c5]/50 transition-colors cursor-pointer">
                      <Upload size={20} className="mx-auto text-gray-300 mb-2" />
                      <p className="text-sm text-gray-400">Upload your agent license</p>
                      <p className="text-xs text-gray-300 mt-1">PDF, JPG or PNG, max 10MB</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ── STEP 4 — Agreement ──────────────────────────── */}
              {step === 3 && (
                <div className="space-y-5">
                  <div>
                    <label className={labelClass}>Committed response time</label>
                    <select className={inputClass} value={form.preferredResponseTime} onChange={(e) => set("preferredResponseTime", e.target.value)}>
                      <option value="< 1 hour">Under 1 hour</option>
                      <option value="< 2 hours">Under 2 hours</option>
                      <option value="< 4 hours">Under 4 hours</option>
                      <option value="< 8 hours">Under 8 hours</option>
                      <option value="< 24 hours">Under 24 hours</option>
                    </select>
                    <p className="text-xs text-gray-400 mt-1.5">Agents who miss their SLA 3× are suspended pending review.</p>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={form.agreeResponseTime}
                      onChange={(e) => set("agreeResponseTime", e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded accent-[#19d3c5]"
                    />
                    <span className="text-sm text-gray-600 leading-relaxed">
                      I commit to responding to all inquiries within my stated response time. I understand that consistent non-compliance may result in account suspension.
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={form.agreeTerms}
                      onChange={(e) => set("agreeTerms", e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded accent-[#19d3c5]"
                    />
                    <span className="text-sm text-gray-600 leading-relaxed">
                      I agree to Rentara&apos;s{" "}
                      <span className="text-[#19d3c5] underline cursor-pointer">Agent Terms of Service</span>
                      {" "}and{" "}
                      <span className="text-[#19d3c5] underline cursor-pointer">Code of Conduct</span>.
                      I confirm all submitted information is accurate and complete.
                    </span>
                  </label>

                  <div className="bg-[#f5f7fa] rounded-xl p-4 text-xs text-gray-500 leading-relaxed">
                    <strong className="text-[#0b1f5c]">What happens next?</strong> Our team reviews your application within 2 business days. You&apos;ll receive a WhatsApp message with the outcome. Approved agents get their verified badge and can start listing immediately.
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="px-8 pb-8 flex items-center justify-between">
            <button
              onClick={goBack}
              disabled={step === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={15} />
              {t("common.back")}
            </button>

            {step < TOTAL_STEPS - 1 ? (
              <button
                onClick={goNext}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0b1f5c] text-white font-semibold text-sm hover:bg-[#122470] transition-colors"
              >
                {t("common.continue")}
                <ChevronRight size={15} />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!form.agreeTerms || !form.agreeResponseTime}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#19d3c5] text-[#0b1f5c] font-bold text-sm hover:bg-[#0fb5a8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <CheckCircle2 size={15} />
                {t("common.submit")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
