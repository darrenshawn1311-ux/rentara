"use client";

import type { VerificationChecklist as ChecklistType, VerificationStatus } from "@/types";
import { useLang } from "@/lib/i18n/LanguageContext";

interface Props {
  checklist: ChecklistType;
  status: VerificationStatus;
  showProgress?: boolean;
  onToggle?: (key: keyof ChecklistType) => void;
}

export const CHECKLIST_KEYS: (keyof ChecklistType)[] = [
  "identityVerified",
  "whatsappActive",
  "agencyConfirmed",
  "licenseUploaded",
  "ownershipConfirmed",
  "photosReviewed",
  "priceConfirmed",
  "availabilityConfirmed",
  "depositFeesConfirmed",
  "locationConfirmed",
  "responseTimeCollected",
];

const CHECKLIST_LABELS: Record<keyof ChecklistType, { en: string; id: string }> = {
  identityVerified:      { en: "Identity verified (KTP/Passport)",              id: "Identitas diverifikasi (KTP/Paspor)" },
  whatsappActive:        { en: "WhatsApp number active",                         id: "Nomor WhatsApp aktif" },
  agencyConfirmed:       { en: "Agency/company confirmed",                       id: "Agensi/perusahaan dikonfirmasi" },
  licenseUploaded:       { en: "License document uploaded",                      id: "Dokumen lisensi diunggah" },
  ownershipConfirmed:    { en: "Listing ownership/authorization confirmed",       id: "Kepemilikan/otorisasi listing dikonfirmasi" },
  photosReviewed:        { en: "Photos reviewed (current, accurate)",            id: "Foto ditinjau (terkini, akurat)" },
  priceConfirmed:        { en: "Rental price confirmed with owner",              id: "Harga sewa dikonfirmasi dengan pemilik" },
  availabilityConfirmed: { en: "Availability date confirmed",                    id: "Tanggal ketersediaan dikonfirmasi" },
  depositFeesConfirmed:  { en: "Deposit & fees fully disclosed",                 id: "Deposit & biaya diungkap sepenuhnya" },
  locationConfirmed:     { en: "Location/address verified",                      id: "Lokasi/alamat diverifikasi" },
  responseTimeCollected: { en: "Response time estimate collected",               id: "Estimasi waktu respons dikumpulkan" },
};

const STATUS_COLORS: Record<VerificationStatus, string> = {
  pending:    "bg-gray-100 text-gray-600 border-gray-200",
  in_review:  "bg-amber-50 text-amber-700 border-amber-200",
  verified:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  rejected:   "bg-red-50 text-red-700 border-red-200",
  suspended:  "bg-orange-50 text-orange-700 border-orange-200",
};

const STATUS_LABELS: Record<VerificationStatus, string> = {
  pending:   "Pending",
  in_review: "In Review",
  verified:  "Verified",
  rejected:  "Rejected",
  suspended: "Suspended",
};

export function VerificationChecklistUI({ checklist, status, showProgress = true, onToggle }: Props) {
  const { lang } = useLang();
  const completed = CHECKLIST_KEYS.filter((k) => checklist[k]).length;
  const total = CHECKLIST_KEYS.length;
  const pct = Math.round((completed / total) * 100);

  return (
    <div className="space-y-4">
      {/* Status badge + count */}
      <div className="flex items-center justify-between">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${STATUS_COLORS[status]}`}>
          {status === "verified" && "✓ "}
          {STATUS_LABELS[status]}
        </span>
        {showProgress && (
          <span className="text-sm text-gray-500">{completed}/{total} checks complete</span>
        )}
      </div>

      {/* Progress bar */}
      {showProgress && (
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#19d3c5] rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}

      {/* Items */}
      <ul className="space-y-2">
        {CHECKLIST_KEYS.map((key) => (
          <li key={key} className="flex items-center gap-3">
            {onToggle ? (
              <input
                type="checkbox"
                checked={checklist[key]}
                onChange={() => onToggle(key)}
                className="w-4 h-4 rounded accent-[#19d3c5] cursor-pointer flex-shrink-0"
              />
            ) : (
              <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                checklist[key] ? "bg-[#19d3c5] text-white" : "bg-gray-100 text-gray-300"
              }`}>
                {checklist[key] ? "✓" : ""}
              </span>
            )}
            <span className={`text-sm ${checklist[key] ? "text-gray-800" : "text-gray-400"}`}>
              {CHECKLIST_LABELS[key][lang as "en" | "id"] ?? CHECKLIST_LABELS[key]["en"]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
