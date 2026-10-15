"use client";

import { useState, Fragment } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Menu, X, Search } from "lucide-react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Resources", href: "/resources" },
  { name: "Configs", href: "/resources/configs" },
  { name: "Graphics", href: "/resources/graphics" },
  { name: "Dev Tools", href: "/tools" },
  { name: "Tutorials", href: "/tutorials" },
  { name: "Status", href: "/status" },
  { name: "Premium", href: "/premium" },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="fixed top-3 left-0 right-0 z-50 px-3 sm:px-6 pointer-events-none">
      <nav
        className="pointer-events-auto max-w-7xl mx-auto glass-strong rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between border border-white/10 shadow-[0_12px_35px_rgba(0,0,0,0.85)]"
        aria-label="Main navigation"
      >
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group" aria-label="NOTIXNODE Home">
          <div className="h-8 w-8 rounded-full bg-[#FF1E27] flex items-center justify-center shadow-[0_0_18px_rgba(255,30,39,0.6)] group-hover:scale-105 transition-transform">
            <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <span className="font-extrabold text-lg tracking-wider text-white">
            NOTIX<span className="text-[#FF1E27]">NODE</span>
          </span>
        </Link>

        {/* Center Pill Navigation Container */}
        <div className="hidden lg:flex items-center bg-black/50 p-1 rounded-full border border-white/10">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "px-3.5 py-1 text-xs font-semibold rounded-full transition-all duration-200",
                  isActive
                    ? "bg-[#FF1E27] text-white shadow-[0_0_15px_rgba(255,30,39,0.6)]"
                    : "text-neutral-300 hover:text-white hover:bg-white/5"
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Right Action Icons & Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Trigger */}
          <div className="relative">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="h-8 w-8 rounded-full bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
              aria-label="Search resources"
              aria-expanded={searchOpen}
            >
              <Search className="h-4 w-4" />
            </button>
            {searchOpen && (
              <div className="absolute right-0 top-full mt-3 w-72 sm:w-80 glass-strong p-2.5 shadow-2xl rounded-2xl border border-white/15 animate-slide-down">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (searchQuery.trim()) {
                      router.push(`/resources?search=${encodeURIComponent(searchQuery.trim())}`);
                      setSearchOpen(false);
                    }
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search resources, configs, tools..."
                    className="input-base flex-1 bg-black/80 text-sm py-1.5 px-3 rounded-full border border-white/10"
                    autoFocus
                    aria-label="Search resources"
                  />
                  <Button type="submit" variant="primary" size="sm" className="rounded-full text-xs px-3">
                    Search
                  </Button>
                </form>
              </div>
            )}
          </div>

          {/* Discord Pill */}
          <a
            href="https://discord.gg/8NPerTzmKR"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 bg-[#FF1E27] hover:bg-[#E50914] text-white text-xs px-3.5 py-1.5 rounded-full font-semibold shadow-[0_0_20px_rgba(255,30,39,0.45)] transition-all hover:scale-105"
            aria-label="Join Discord Community"
          >
            <svg className="h-3.5 w-3.5 fill-currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.675 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.08.08 0 0 0 .031.057 19.9 19.9 0 0 0 5.992 4.785.077.077 0 0 0 .084-.028c.293-.198.551-.537.77-.997a18.385 18.385 0 0 0 1.948-1.813.077.077 0 0 0-.007-.127 12.05 12.05 0 0 1-1.523-4.213.074.074 0 0 1 .148-.042 7.416 7.416 0 0 0 2.742 0 .077.077 0 0 1 .147.043c.7.832 1.456 1.747 2.04 2.543a.077.077 0 0 0 .127.006 18.39 18.39 0 0 0 2.718-3.36.077.077 0 0 0-.007-.128 12.15 12.15 0 0 0 .747-1.018.074.074 0 0 0-.025-.093 19.88 19.88 0 0 0 5.025-4.518.074.074 0 0 0-.029-.083zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            <span>Discord</span>
          </a>

          {/* Explore Button */}
          <Link
            href="/resources"
            className="hidden md:inline-flex btn-outline text-xs px-4 py-1.5 rounded-full font-medium"
          >
            Explore
          </Link>

          {/* Mobile Menu Hamburger */}
          <button
            className="h-8 w-8 rounded-full bg-white/5 border border-white/10 text-neutral-300 hover:text-white flex items-center justify-center lg:hidden transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          className="pointer-events-auto max-w-lg mx-auto mt-2 glass-strong rounded-3xl p-5 border border-white/10 shadow-2xl animate-slide-down space-y-4"
        >
          <div className="grid grid-cols-2 gap-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 text-sm font-semibold rounded-xl transition-colors text-center",
                    isActive
                      ? "bg-[#FF1E27] text-white shadow-[0_0_12px_rgba(255,30,39,0.5)]"
                      : "text-neutral-300 hover:text-white hover:bg-white/5"
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          <hr className="divider" aria-hidden="true" />

          <div className="flex flex-col gap-2.5">
            <a
              href="https://discord.gg/8NPerTzmKR"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#FF1E27] text-white py-2.5 rounded-full font-semibold text-sm shadow-[0_0_20px_rgba(255,30,39,0.4)]"
              onClick={() => setMobileMenuOpen(false)}
            >
              <svg className="h-4 w-4 fill-currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.675 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.08.08 0 0 0 .031.057 19.9 19.9 0 0 0 5.992 4.785.077.077 0 0 0 .084-.028c.293-.198.551-.537.77-.997a18.385 18.385 0 0 0 1.948-1.813.077.077 0 0 0-.007-.127 12.05 12.05 0 0 1-1.523-4.213.074.074 0 0 1 .148-.042 7.416 7.416 0 0 0 2.742 0 .077.077 0 0 1 .147.043c.7.832 1.456 1.747 2.04 2.543a.077.077 0 0 0 .127.006 18.39 18.39 0 0 0 2.718-3.36.077.077 0 0 0-.007-.128 12.15 12.15 0 0 0 .747-1.018.074.074 0 0 0-.025-.093 19.88 19.88 0 0 0 5.025-4.518.074.074 0 0 0-.029-.083zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              <span>Join Discord Server</span>
            </a>
            <Button variant="outline" className="w-full justify-center rounded-full" asChild>
              <Link href="/tools" onClick={() => setMobileMenuOpen(false)}>Developer Tools</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}