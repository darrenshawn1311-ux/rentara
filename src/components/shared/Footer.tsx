import Link from "next/link";

const footerLinks = {
  Product: [
    { label: "Marketplace", href: "/marketplace" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "Verified Listings", href: "/marketplace?verified=true" },
    { label: "Area Guides", href: "#" },
  ],
  Agents: [
    { label: "List a Property", href: "/signup?role=agent" },
    { label: "Agent Dashboard", href: "/agent" },
    { label: "Pricing", href: "#" },
    { label: "Verification", href: "#" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
  ],
  Support: [
    { label: "Help Center", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-[#070f2e] text-white/70">
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
          {/* Brand column */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-flex items-center mb-4">
              <span
                className="text-2xl font-black text-white tracking-tight"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Rent
              </span>
              <span
                className="text-2xl font-black text-[#19d3c5] tracking-tight"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                ara
              </span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed mb-6">
              Jakarta rental market.<br />Finally fixed.
            </p>
            <div className="flex gap-3">
              {[
                {
                  label: "Instagram",
                  svg: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                    </svg>
                  ),
                },
                {
                  label: "LinkedIn",
                  svg: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
                    </svg>
                  ),
                },
                {
                  label: "X (Twitter)",
                  svg: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  ),
                },
              ].map(({ label, svg }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-[#19d3c5]/20 flex items-center justify-center transition-colors text-white/60 hover:text-[#19d3c5]"
                >
                  {svg}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4
                className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4"
              >
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-[#19d3c5] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} Rentara. All rights reserved.
          </p>
          <p className="text-xs text-white/30">
            Made with ❤️ for Jakarta renters
          </p>
        </div>
      </div>
    </footer>
  );
}
