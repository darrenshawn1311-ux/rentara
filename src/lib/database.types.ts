export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string | null;
          phone_whatsapp: string | null;
          avatar_url: string | null;
          role: "renter" | "agent" | "admin";
          is_verified: boolean;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email?: string | null;
          phone_whatsapp?: string | null;
          avatar_url?: string | null;
          role?: "renter" | "agent" | "admin";
          is_verified?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          email?: string | null;
          phone_whatsapp?: string | null;
          avatar_url?: string | null;
          role?: "renter" | "agent" | "admin";
          is_verified?: boolean;
          created_at?: string;
        };
      };
      listings: {
        Row: {
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
          furnished: "unfurnished" | "semi-furnished" | "fully-furnished" | null;
          is_pet_friendly: boolean;
          is_verified: boolean;
          status: "pending" | "active" | "rejected" | "archived";
          photos: string[] | null;
          amenities: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          agent_id?: string | null;
          title: string;
          description?: string | null;
          price_monthly: number;
          area: string;
          address?: string | null;
          lat?: number | null;
          lng?: number | null;
          bedrooms?: number | null;
          bathrooms?: number | null;
          size_sqm?: number | null;
          furnished?: "unfurnished" | "semi-furnished" | "fully-furnished" | null;
          is_pet_friendly?: boolean;
          is_verified?: boolean;
          status?: "pending" | "active" | "rejected" | "archived";
          photos?: string[] | null;
          amenities?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          agent_id?: string | null;
          title?: string;
          description?: string | null;
          price_monthly?: number;
          area?: string;
          address?: string | null;
          lat?: number | null;
          lng?: number | null;
          bedrooms?: number | null;
          bathrooms?: number | null;
          size_sqm?: number | null;
          furnished?: "unfurnished" | "semi-furnished" | "fully-furnished" | null;
          is_pet_friendly?: boolean;
          is_verified?: boolean;
          status?: "pending" | "active" | "rejected" | "archived";
          photos?: string[] | null;
          amenities?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      waitlist: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          whatsapp: string;
          preferred_area: string | null;
          rental_budget: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          email: string;
          whatsapp: string;
          preferred_area?: string | null;
          rental_budget?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          whatsapp?: string;
          preferred_area?: string | null;
          rental_budget?: string | null;
          created_at?: string;
        };
      };
      inquiries: {
        Row: {
          id: string;
          listing_id: string | null;
          renter_id: string | null;
          agent_id: string | null;
          message: string | null;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          listing_id?: string | null;
          renter_id?: string | null;
          agent_id?: string | null;
          message?: string | null;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          listing_id?: string | null;
          renter_id?: string | null;
          agent_id?: string | null;
          message?: string | null;
          status?: string;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
