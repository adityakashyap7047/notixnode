"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/Separator";
import { Heart, Code, Shield, Users, Zap, Star, Target, Globe, Mail, Terminal, Sparkles } from "lucide-react";

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.675 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.08.08 0 0 0 .031.057 19.9 19.9 0 0 0 5.992 4.785.077.077 0 0 0 .084-.028c.293-.198.551-.537.77-.997a18.385 18.385 0 0 0 1.948-1.813.077.077 0 0 0-.007-.127 12.05 12.05 0 0 1-1.523-4.213.074.074 0 0 1 .148-.042 7.416 7.416 0 0 0 2.742 0 .077.077 0 0 1 .147.043c.7.832 1.456 1.747 2.04 2.543a.077.077 0 0 0 .127.006 18.39 18.39 0 0 0 2.718-3.36.077.077 0 0 0-.007-.128 12.15 12.15 0 0 0 .747-1.018.074.074 0 0 0-.025-.093 19.88 19.88 0 0 0 5.025-4.518.074.074 0 0 0-.029-.083zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 9.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 1.75h2.6v3.5h-2.6v-3.5zm-11.1 0h2.6v3.5h-2.6v-3.5zm15.3 16.25h-2.6v-3.5h2.6v3.5z"/>
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

const team = [
  { name: "Alex Chen", role: "Founder & Lead Developer", bio: "10+ years Minecraft server development. PaperMC contributor. Former network admin for 50k+ player network.", avatar: "AC" },
  { name: "Sarah Mitchell", role: "Senior Systems Engineer", bio: "Infrastructure specialist. Kubernetes, Docker, and high-availability Minecraft architectures. Folia core contributor.", avatar: "SM" },
  { name: "Marcus Rodriguez", role: "Content Lead", bio: "Professional map builder and resource pack artist. Created spawns for 20+ major networks. WorldEdit/FAWE expert.", avatar: "MR" },
  { name: "Priya Patel", role: "Community Manager", bio: "Discord community builder. Former moderator for largest Minecraft admin Discord. Tutorial author and plugin reviewer.", avatar: "PP" },
];

const values = [
  { icon: Code, title: "Developer First", description: "Built by server admins, for server admins. Every resource solves a real problem we've faced." },
  { icon: Shield, title: "Quality Over Quantity", description: "Every resource is tested, versioned, and maintained. No abandoned configs or broken downloads." },
  { icon: Users, title: "Community Driven", description: "Feature requests and community feedback shape our roadmap. Direct collaboration on Discord." },
  { icon: Zap, title: "Performance Focused", description: "Resources optimized for Paper, Folia, and Velocity. We document performance impact." },
  { icon: Heart, title: "Creator Friendly", description: "Free tier is generous. Premium supports development. No paywalls on essential tools." },
  { icon: Target, title: "No Vendor Lock-in", description: "Standard formats (YAML, JSON, schematic). Export anywhere. Migrate away anytime." },
];

const stats = [
  { label: "Resources Published", value: "400+" },
  { label: "Active Developers", value: "12K+" },
  { label: "Downloads This Month", value: "48K+" },
  { label: "Uptime Guarantee", value: "99.9%" },
  { label: "Community Verified Guides", value: "200+" },
  { label: "Countries Served", value: "80+" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <section className="section container" aria-labelledby="about-heading">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 id="about-heading" className="text-4xl sm:text-5xl font-bold text-foreground mb-6">About NOTIXNODE</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We're a team of Minecraft server developers, administrators, and builders who got tired of hunting through
            outdated forums, broken links, and abandoned downloads. So we built the resource platform we wanted.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          {stats.map((stat, i) => (
            <Card key={i} variant="glass-strong" padding="lg" className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </Card>
          ))}
        </div>

        <Separator className="mb-12" />

        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Our Values</h2>
          <p className="text-muted-foreground">The principles that guide everything we build</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          {values.map((value, i) => {
            const Icon = value.icon;
            return (
              <Card key={i} variant="interactive" padding="lg">
                <div className="p-3 bg-primary/10 rounded-xl text-primary w-fit mb-4">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.description}</p>
              </Card>
            );
          })}
        </div>

        <Separator className="mb-12" />

        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">The Team</h2>
          <p className="text-muted-foreground">Real developers behind the resources</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-16">
          {team.map((member, i) => (
            <Card key={i} variant="interactive" padding="lg">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 h-16 w-16 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                  {member.avatar}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{member.name}</h3>
                  <p className="text-sm text-primary mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Separator className="mb-12" />

        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Community & Support</h2>
          <p className="text-muted-foreground mb-8">
            Connect directly with the NOTIXNODE team, submit server questions, and join thousands of Minecraft developers.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="https://discord.gg/8NPerTzmKR" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 btn-primary shadow-lg shadow-primary/20">
              <DiscordIcon className="h-5 w-5" aria-hidden="true" />
              Join Discord Server
            </a>
            <a href="https://youtube.com/@os_notixnode?si=3q3E6MlMjz-j0J2w" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 btn-outline hover:text-red-500 hover:border-red-500/50">
              <YoutubeIcon className="h-5 w-5 text-red-500" aria-hidden="true" />
              YouTube Channel
            </a>
            <a href="https://twitter.com/notixnode" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 btn-outline">
              <TwitterIcon className="h-5 w-5" aria-hidden="true" />
              Follow on X
            </a>
          </div>
          <p className="mt-6 text-sm text-muted-foreground">
            NOTIXNODE is not affiliated with Mojang Studios, Microsoft, or any Minecraft server software project.
            All trademarks belong to their respective owners.
          </p>
        </div>
      </section>
    </div>
  );
}