import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerifiedBadgeProps {
  size?: "sm" | "md";
  className?: string;
}

export default function VerifiedBadge({ size = "md", className }: VerifiedBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 font-semibold rounded-full bg-[#19d3c5]/10 text-[#0fb5a8] border border-[#19d3c5]/20",
        size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-3 py-1",
        className
      )}
      title="Photos and listing verified by Rentara within the last 30 days"
    >
      <ShieldCheck size={size === "sm" ? 11 : 13} />
      Verified
    </span>
  );
}
