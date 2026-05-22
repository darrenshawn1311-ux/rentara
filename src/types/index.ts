export type UserRole = "renter" | "agent" | "admin";
export type FurnishedType = "unfurnished" | "semi-furnished" | "fully-furnished";
export type ListingStatus = "pending" | "active" | "rejected" | "archived";
export type InquiryStatus = "pending" | "replied" | "closed";

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone_whatsapp: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_verified: boolean;
  created_at: string;
}

export interface Listing {
  id: string;
  agent_id: string | null;
  title: string;
  description: string | null;
  price_monthly: number;
  area: string;
  address: string | null;
  lat: number | null;
  lng: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  size_sqm: number | null;
  furnished: FurnishedType | null;
  is_pet_friendly: boolean;
  is_verified: boolean;
  status: ListingStatus;
  photos: string[] | null;
  amenities: string[] | null;
  created_at: string;
  updated_at: string;
  agent?: Profile;
}

export interface Waitlist {
  id: string;
  full_name: string;
  email: string;
  whatsapp: string;
  preferred_area: string | null;
  rental_budget: string | null;
  created_at: string;
}

export interface Inquiry {
  id: string;
  listing_id: string | null;
  renter_id: string | null;
  agent_id: string | null;
  message: string | null;
  status: InquiryStatus;
  created_at: string;
  listing?: Listing;
  renter?: Profile;
  agent?: Profile;
}

export interface FilterState {
  minPrice: number;
  maxPrice: number;
  areas: string[];
  furnished: FurnishedType | "all";
  bedrooms: string;
  verifiedOnly: boolean;
  petFriendly: boolean;
  sortBy: "newest" | "price_asc" | "price_desc" | "verified";
}

export const JAKARTA_AREAS = [
  "SCBD",
  "Kemang",
  "Menteng",
  "Pondok Indah",
  "Kelapa Gading",
  "BSD",
  "PIK",
  "Senayan",
  "Kuningan",
  "Sudirman",
  "Jaksel",
  "Gading Serpong",
] as const;

export type JakartaArea = (typeof JAKARTA_AREAS)[number];

export const AMENITIES = [
  "AC",
  "WiFi",
  "Parking",
  "Security 24/7",
  "Pool",
  "Gym",
  "Garden",
  "Water Heater",
  "Washing Machine",
  "Refrigerator",
  "TV",
  "Balcony",
  "Elevator",
  "CCTV",
  "Intercom",
] as const;

export type Amenity = (typeof AMENITIES)[number];
