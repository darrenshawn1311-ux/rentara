import type { VerificationRecord } from "@/types";

export interface Agent {
  id: string;
  name: string;
  agency: string;
  avatar: string;
  verified: boolean;
  rating: number;
  reviews: number;
  responseTime: string;
  activeListings: number;
  leads: number;
  responseRate: number;
  areas: string[];
  bio: string;
  whatsapp: string;
  joinedYear: number;
  totalDeals: number;
  verification: VerificationRecord;
}

const FULL_CHECKLIST = {
  identityVerified: true,
  whatsappActive: true,
  agencyConfirmed: true,
  licenseUploaded: true,
  ownershipConfirmed: true,
  photosReviewed: true,
  priceConfirmed: true,
  availabilityConfirmed: true,
  depositFeesConfirmed: true,
  locationConfirmed: true,
  responseTimeCollected: true,
};

export const AGENTS: Agent[] = [
  {
    id: "agent-001",
    name: "Nadia Kusuma",
    agency: "Prestige Property Group",
    avatar: "https://randomuser.me/api/portraits/women/51.jpg",
    verified: true,
    rating: 4.9,
    reviews: 127,
    responseTime: "< 2 hours",
    activeListings: 14,
    leads: 342,
    responseRate: 98,
    areas: ["SCBD", "Kuningan", "Sudirman"],
    bio: "Jakarta's top-rated agent for SCBD and Kuningan. 6 years specializing in expat relocations and corporate rentals. I pre-verify every listing I take on — no surprises on signing day.",
    whatsapp: "628111234001",
    joinedYear: 2018,
    totalDeals: 280,
    verification: {
      status: "verified",
      checklist: FULL_CHECKLIST,
      verifiedAt: "2024-01-15",
      reviewedBy: "Rentara Admin",
    },
  },
  {
    id: "agent-002",
    name: "Rizky Pratama",
    agency: "Urban Nest Realty",
    avatar: "https://randomuser.me/api/portraits/men/4.jpg",
    verified: true,
    rating: 4.8,
    reviews: 94,
    responseTime: "< 4 hours",
    activeListings: 11,
    leads: 278,
    responseRate: 95,
    areas: ["Kemang", "Bangka", "Cipete"],
    bio: "South Jakarta specialist. Kemang and surrounding areas are my backyard — I know every landlord personally. Fluent in English and Japanese.",
    whatsapp: "628111234002",
    joinedYear: 2019,
    totalDeals: 195,
    verification: {
      status: "verified",
      checklist: FULL_CHECKLIST,
      verifiedAt: "2024-03-20",
      reviewedBy: "Rentara Admin",
    },
  },
  {
    id: "agent-003",
    name: "Sari Dewi",
    agency: "Golden Keys Jakarta",
    avatar: "https://randomuser.me/api/portraits/women/85.jpg",
    verified: true,
    rating: 4.9,
    reviews: 203,
    responseTime: "< 1 hour",
    activeListings: 19,
    leads: 510,
    responseRate: 99,
    areas: ["Menteng", "Gondangdia", "Cikini"],
    bio: "Menteng heritage specialist with 8 years of experience. I focus on authentic Jakarta living — classic Dutch-era townhouses to modern serviced apartments.",
    whatsapp: "628111234003",
    joinedYear: 2016,
    totalDeals: 412,
    verification: {
      status: "verified",
      checklist: FULL_CHECKLIST,
      verifiedAt: "2023-11-05",
      reviewedBy: "Rentara Admin",
    },
  },
  {
    id: "agent-004",
    name: "Budi Santoso",
    agency: "BSD Realty Network",
    avatar: "https://randomuser.me/api/portraits/men/90.jpg",
    verified: true,
    rating: 4.7,
    reviews: 68,
    responseTime: "< 6 hours",
    activeListings: 22,
    leads: 189,
    responseRate: 91,
    areas: ["BSD", "Alam Sutera", "Serpong"],
    bio: "Greater Tangerang and BSD specialist. Best choice for families relocating from central Jakarta — I know which clusters have the best schools and access.",
    whatsapp: "628111234004",
    joinedYear: 2020,
    totalDeals: 143,
    verification: {
      status: "verified",
      checklist: FULL_CHECKLIST,
      verifiedAt: "2024-02-10",
      reviewedBy: "Rentara Admin",
    },
  },
  {
    id: "agent-005",
    name: "Citra Maharani",
    agency: "Platinum Living Indonesia",
    avatar: "https://randomuser.me/api/portraits/women/90.jpg",
    verified: true,
    rating: 5.0,
    reviews: 41,
    responseTime: "< 3 hours",
    activeListings: 8,
    leads: 156,
    responseRate: 100,
    areas: ["Pondok Indah", "Kebayoran Baru", "Senayan"],
    bio: "Ultra-premium rentals in South Jakarta. My listings are always professionally photographed and independently verified. I only take on properties I'd live in myself.",
    whatsapp: "628111234005",
    joinedYear: 2021,
    totalDeals: 87,
    verification: {
      status: "verified",
      checklist: FULL_CHECKLIST,
      verifiedAt: "2024-04-01",
      reviewedBy: "Rentara Admin",
    },
  },
  {
    id: "agent-006",
    name: "Hendra Wijaya",
    agency: "North Jakarta Premium",
    avatar: "https://randomuser.me/api/portraits/men/92.jpg",
    verified: false,
    rating: 4.5,
    reviews: 29,
    responseTime: "< 8 hours",
    activeListings: 16,
    leads: 98,
    responseRate: 88,
    areas: ["PIK", "Kelapa Gading", "Sunter"],
    bio: "North Jakarta's rising agent. Specializing in PIK and Kelapa Gading — great value for families who want space without the South Jakarta price tag.",
    whatsapp: "628111234006",
    joinedYear: 2022,
    totalDeals: 62,
    verification: {
      status: "in_review",
      checklist: {
        identityVerified: true,
        whatsappActive: true,
        agencyConfirmed: true,
        licenseUploaded: false,
        ownershipConfirmed: true,
        photosReviewed: false,
        priceConfirmed: true,
        availabilityConfirmed: true,
        depositFeesConfirmed: false,
        locationConfirmed: true,
        responseTimeCollected: true,
      },
      notes: "Awaiting license document upload and photo review.",
    },
  },
];

export function getAgentById(id: string): Agent | undefined {
  return AGENTS.find((a) => a.id === id);
}

export function getAgentsByArea(area: string): Agent[] {
  return AGENTS.filter((a) => a.areas.includes(area));
}
