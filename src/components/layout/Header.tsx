"use client";

import { useState, Fragment } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Menu, X, Search, ChevronDown } from "lucide-react";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Resources", href: "/resources" },
  { name: "Configs", href: "/resources/configs" },
  { name: "Graphics", href: "/resources/graphics" },
  { name: "Maps & Builds", href: "/resources/maps" },
  { name: "Dev Tools", href: "/tools" },
  { name: "Tutorials", href: "/tutorials" },
  { name: "Status", href: "/status" },
  { name: "Premium", href: "/premium" },
];

export function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="fixed top-0 left-0 right-0 z-40 glass-strong border-b border-border">
      <nav className="container" aria-label="Main navigation">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2" aria-label="NOTIXNODE Home">
              <svg className="h-8 w-8 text-primary" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <rect width="32" height="32" rx="8" fill="currentColor" />
                <path d="M8 16L14 22L24 10" stroke="#0B0F19" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="font-bold text-xl text-foreground">NOTIXNODE</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors rounded-md"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="btn-ghost btn-icon relative"
                aria-label="Search resources"
                aria-expanded={searchOpen}
              >
                <Search className="h-5 w-5" />
              </button>
              {searchOpen && (
                <div className="absolute right-0 top-full mt-2 w-72 glass-strong p-2 shadow-xl animate-slide-down rounded-xl border border-border">
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
                      className="input-base flex-1 bg-card/80 text-sm"
                      autoFocus
                      aria-label="Search resources"
                    />
                    <Button type="submit" variant="primary" size="sm">
                      Search
                    </Button>
                  </form>
                </div>
              )}
            </div>

            <div className="hidden lg:flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/tools">Dev Tools</Link>
              </Button>
              <Button variant="primary" size="sm" asChild>
                <Link href="/resources">Explore</Link>
              </Button>
            </div>

            <button
              className="btn-ghost btn-icon md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <Fragment key="mobile-menu">
            <Separator className="mx-4" />
            <div id="mobile-menu" className="md:hidden py-4 px-4 space-y-3 animate-slide-down">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (searchQuery.trim()) {
                    router.push(`/resources?search=${encodeURIComponent(searchQuery.trim())}`);
                    setMobileMenuOpen(false);
                  }
                }}
                className="relative"
              >
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search resources..."
                  className="input-base pl-10 w-full"
                  aria-label="Search"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </form>
              <div className="space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-foreground hover:bg-card/50 rounded-md transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <Separator className="my-2" />
              <div className="flex flex-col gap-2 pt-1">
                <Button variant="outline" className="w-full justify-center" asChild>
                  <Link href="/tools" onClick={() => setMobileMenuOpen(false)}>Developer Tools</Link>
                </Button>
                <Button variant="primary" className="w-full justify-center" asChild>
                  <Link href="/resources" onClick={() => setMobileMenuOpen(false)}>Explore All Resources</Link>
                </Button>
              </div>
            </div>
          </Fragment>
        )}
      </nav>
    </header>
  );
}

function Separator({ className }: { className?: string }) {
  return <hr className={cn("divider", className)} aria-hidden="true" />;
}