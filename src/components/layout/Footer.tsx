"use client";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("h-5 w-5", className)} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.675 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.08.08 0 0 0 .031.057 19.9 19.9 0 0 0 5.992 4.785.077.077 0 0 0 .084-.028c.293-.198.551-.537.77-.997a18.385 18.385 0 0 0 1.948-1.813.077.077 0 0 0-.007-.127 12.05 12.05 0 0 1-1.523-4.213.074.074 0 0 1 .148-.042 7.416 7.416 0 0 0 2.742 0 .077.077 0 0 1 .147.043c.7.832 1.456 1.747 2.04 2.543a.077.077 0 0 0 .127.006 18.39 18.39 0 0 0 2.718-3.36.077.077 0 0 0-.007-.128 12.15 12.15 0 0 0 .747-1.018.074.074 0 0 0-.025-.093 19.88 19.88 0 0 0 5.025-4.518.074.074 0 0 0-.029-.083zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("h-5 w-5", className)} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 9.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 1.75h2.6v3.5h-2.6v-3.5zm-11.1 0h2.6v3.5h-2.6v-3.5zm15.3 16.25h-2.6v-3.5h2.6v3.5z"/>
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={cn("h-5 w-5", className)} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

const footerLinks = {
  product: [
    { name: "Resources", href: "/resources" },
    { name: "Plugin Configs", href: "/resources/configs" },
    { name: "Graphics & Icons", href: "/resources/graphics" },
    { name: "Maps & Builds", href: "/resources/maps" },
    { name: "Resource Packs", href: "/resources/packs" },
    { name: "Developer Tools", href: "/tools" },
    { name: "Tutorials", href: "/tutorials" },
    { name: "System Status", href: "/status" },
    { name: "Premium", href: "/premium" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Contact & Support", href: "/contact" },
    { name: "Tutorials & Guides", href: "/tutorials" },
    { name: "System Status", href: "/status" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Licensing Guidelines", href: "/licensing" },
    { name: "Affiliate Disclosure", href: "/affiliate-disclosure" },
  ],
  community: [
    { name: "Discord", href: "https://discord.gg/8NPerTzmKR", external: true },
    { name: "YouTube", href: "https://youtube.com/@os_notixnode?si=3q3E6MlMjz-j0J2w", external: true },
    { name: "Twitter", href: "https://twitter.com/notixnode", external: true },
  ],
};

const socialLinks = [
  { name: "Discord", icon: DiscordIcon, href: "https://discord.gg/8NPerTzmKR" },
  { name: "YouTube", icon: YoutubeIcon, href: "https://youtube.com/@os_notixnode?si=3q3E6MlMjz-j0J2w" },
  { name: "Twitter", icon: TwitterIcon, href: "https://twitter.com/notixnode" },
];

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black" role="contentinfo">
      <div className="container py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-4 group" aria-label="NOTIXNODE Home">
              <Image
                src="/notixnode-logo.png"
                alt="NOTIXNODE"
                width={150}
                height={60}
                className="h-10 w-auto object-contain drop-shadow-[0_0_16px_rgba(255,30,39,0.35)] group-hover:scale-105 transition-transform duration-200"
              />
            </Link>
            <p className="text-sm text-neutral-400 mb-4 max-w-xs">
              Premium Minecraft server development resources, configurations, graphics, maps, and tools for professional server administrators and developers.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-400 hover:text-[#C5A059] transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                  <span className="sr-only">{social.name}</span>
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Product">
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Company">
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Legal">
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Community">
            <h3 className="font-semibold text-foreground mb-4">Community</h3>
            <ul className="space-y-3">
              {footerLinks.community.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                  >
                    {link.name}
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 NOTIXNODE. All rights reserved. Not affiliated with Mojang Studios or Microsoft.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>Built for the Minecraft server community</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}