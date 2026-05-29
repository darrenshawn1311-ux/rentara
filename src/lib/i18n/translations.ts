export type Lang = "en" | "id";

export const translations: Record<string, Record<Lang, string>> = {
  /* ── User Segment Modal ─────────────────────────────── */
  "segment.title": {
    en: "What brings you to Rentara?",
    id: "Apa yang membawa Anda ke Rentara?",
  },
  "segment.subtitle": {
    en: "We'll tailor your experience accordingly.",
    id: "Kami akan menyesuaikan pengalaman Anda.",
  },
  "segment.renter.label": {
    en: "I'm looking for a rental",
    id: "Saya mencari hunian sewaan",
  },
  "segment.renter.desc": {
    en: "Browse verified listings across Jakarta",
    id: "Temukan listing terverifikasi di seluruh Jakarta",
  },
  "segment.renter.cta": {
    en: "Browse listings",
    id: "Jelajahi listing",
  },
  "segment.agent.label": {
    en: "I'm a property agent",
    id: "Saya agen properti",
  },
  "segment.agent.desc": {
    en: "List properties and get qualified leads",
    id: "Pasang properti dan dapatkan prospek berkualitas",
  },
  "segment.agent.cta": {
    en: "Join agent program",
    id: "Bergabung program agen",
  },
  "segment.skip": {
    en: "Just browsing",
    id: "Hanya melihat-lihat",
  },

  /* ── Agent Onboarding ───────────────────────────────── */
  "onboarding.title": {
    en: "Join the Rentara Agent Program",
    id: "Bergabung Program Agen Rentara",
  },
  "onboarding.step1": {
    en: "Personal Information",
    id: "Informasi Pribadi",
  },
  "onboarding.step2": {
    en: "Professional Details",
    id: "Detail Profesional",
  },
  "onboarding.step3": {
    en: "Verification Documents",
    id: "Dokumen Verifikasi",
  },
  "onboarding.step4": {
    en: "Commitment & Agreement",
    id: "Komitmen & Persetujuan",
  },
  "onboarding.success.title": {
    en: "Application Submitted!",
    id: "Pendaftaran Terkirim!",
  },
  "onboarding.success.body": {
    en: "Our team will review your application within 2 business days. We'll contact you on WhatsApp.",
    id: "Tim kami akan meninjau pendaftaran Anda dalam 2 hari kerja. Kami akan menghubungi Anda via WhatsApp.",
  },

  /* ── Nav / General ──────────────────────────────────── */
  "nav.marketplace": { en: "Marketplace", id: "Marketplace" },
  "nav.agents": { en: "Find Agents", id: "Cari Agen" },
  "nav.howItWorks": { en: "How It Works", id: "Cara Kerja" },
  "nav.forAgents": { en: "For Agents", id: "Untuk Agen" },
  "common.continue": { en: "Continue", id: "Lanjutkan" },
  "common.back": { en: "Back", id: "Kembali" },
  "common.submit": { en: "Submit Application", id: "Kirim Pendaftaran" },

  /* ── Listing Detail ─────────────────────────────────── */
  "listing.viewAgentProfile": { en: "View Profile", id: "Lihat Profil" },
};

export function translate(key: string, lang: Lang): string {
  return translations[key]?.[lang] ?? translations[key]?.["en"] ?? key;
}
