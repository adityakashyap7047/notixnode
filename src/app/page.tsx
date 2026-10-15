import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/Separator";
import { ArrowRight, Download, ExternalLink, Star, Shield, Zap, Code, ImageIcon, Map, Wrench, BookOpen, Gem, CheckCircle, ChevronRight } from "lucide-react";

const categories = [
  { name: "Plugin Configurations", href: "/resources/configs", icon: Code, count: 47, description: "Ready-to-use configs for Essentials, LuckPerms, WorldGuard, and more" },
  { name: "Server Setup Guides", href: "/resources/guides", icon: BookOpen, count: 23, description: "Step-by-step tutorials for Paper, Velocity, Folia, and proxy networks" },
  { name: "Graphics & Icons", href: "/resources/graphics", icon: ImageIcon, count: 156, description: "Custom logos, server icons, animated MOTDs, and UI asset packs" },
  { name: "Maps & Builds", href: "/resources/maps", icon: Map, count: 89, description: "Spawns, hubs, arenas, and pre-built worlds for every gamemode" },
  { name: "Resource Packs", href: "/resources/packs", icon: Zap, count: 34, description: "Custom items, models, fonts, and complete texture overhauls" },
  { name: "Discord Templates", href: "/resources/discord", icon: Shield, count: 18, description: "Role structures, channels, bot configs, and verification systems" },
  { name: "Developer Tools", href: "/tools", icon: Wrench, count: 12, description: "MOTD previewer, permission planner, launch checklist, and calculators" },
  { name: "Tutorials", href: "/tutorials", icon: Gem, count: 67, description: "Deep-dive guides on optimization, security, and plugin development" },
];

const featuredResources = [
  {
    id: 1,
    title: "LuckPerms Rank Structure — Network Grade",
    category: "Plugin Configurations",
    version: "1.21.x",
    tags: ["LuckPerms", "Paper", "Velocity", "BungeeCord"],
    type: "free",
    description: "Complete rank ladder with 15 ranks, inheritance chains, context-based permissions, and prefix/suffix templates. Includes migration script from PermissionsEx.",
    thumbnail: null,
  },
  {
    id: 2,
    title: "PaperMC Optimized server.properties",
    category: "Server Setup Guides",
    version: "1.21.1",
    tags: ["Paper", "Performance", "Configuration"],
    type: "free",
    description: "Battle-tested configuration with tuned entity tracking, chunk loading, and anti-exploit settings. Reduces TPS drops by 40% on high-population servers.",
    thumbnail: null,
  },
  {
    id: 3,
    title: "Animated Server Icon Pack — Neon Series",
    category: "Graphics & Icons",
    version: "Universal",
    tags: ["Animated", "Server List", "Branding"],
    type: "premium",
    description: "6 animated server icons with smooth 20-frame loops. Includes PSD source files, AfterEffects project, and ready-to-upload GIF/WebP exports.",
    thumbnail: null,
  },
  {
    id: 4,
    title: "Medieval Fantasy Spawn — 200x200",
    category: "Maps & Builds",
    version: "1.20+",
    tags: ["Spawn", "Medieval", "WorldEdit", "Schematic"],
    type: "premium",
    description: "Detailed medieval spawn with 4 portals, NPC areas, crates, and info boards. Includes WorldEdit schematic, Litematica, and Blueprint files.",
    thumbnail: null,
  },
];

const recentResources = [
  { id: 5, title: "Velocity Proxy Config — Multi-Server Network", category: "Plugin Configurations", version: "3.3.0", type: "free" },
  { id: 6, title: "Custom Enchants Pack — 50+ Unique Enchants", category: "Resource Packs", version: "1.21.x", type: "premium" },
  { id: 7, title: "Factions Map — Desert Theme 5k×5k", category: "Maps & Builds", version: "1.19+", type: "free" },
  { id: 8, title: "DiscordSRV Advanced Config", category: "Discord Templates", version: "1.26.0", type: "free" },
  { id: 9, title: "Modern UI Resource Pack — Dark Mode", category: "Graphics & Icons", version: "1.21.x", type: "premium" },
  { id: 10, title: "Folia Threading Optimization Guide", category: "Tutorials", version: "1.21.1", type: "free" },
];

const popularTutorials = [
  {
    title: "Setting Up a Velocity + Paper Network from Scratch",
    category: "Server Setup",
    readTime: "15 min",
    difficulty: "Intermediate",
    type: "free",
    href: "/tutorials/velocity-paper-network",
  },
  {
    title: "LuckPerms Masterclass: Contexts, Tracks, and Migration",
    category: "Permissions",
    readTime: "22 min",
    difficulty: "Advanced",
    type: "premium",
    href: "/tutorials/luckperms-masterclass",
  },
  {
    title: "Optimizing PaperMC for 500+ Concurrent Players",
    category: "Performance",
    readTime: "18 min",
    difficulty: "Advanced",
    type: "free",
    href: "/tutorials/paper-optimization",
  },
  {
    title: "Creating Custom Items with items.yml (No Code)",
    category: "Development",
    readTime: "12 min",
    difficulty: "Beginner",
    type: "free",
    href: "/tutorials/custom-items",
  },
];

const devTools = [
  { name: "MOTD Previewer", description: "Real-time MOTD editor with legacy, JSON, and MiniMessage support. Live preview for Java and Bedrock.", status: "ready", href: "/tools/motd" },
  { name: "Rank Prefix Previewer", description: "Visual prefix/suffix builder with gradient, hex, and legacy color support. Export to LuckPerms YAML.", status: "ready", href: "/tools/prefix" },
  { name: "Server Properties Generator", description: "Interactive server.properties generator with explanations, presets, and validation.", status: "ready", href: "/tools/properties" },
  { name: "LuckPerms Permission Planner", description: "Visual permission tree editor. Plan ranks, groups, inheritance, and export commands.", status: "ready", href: "/tools/luckperms-planner" },
  { name: "Server Launch Checklist", description: "Interactive pre-launch checklist covering security, performance, compliance, and monitoring.", status: "ready", href: "/tools/checklist" },
  { name: "Server Resource Calculator", description: "Estimate RAM, CPU, and storage needs based on player count, plugins, and world size.", status: "ready", href: "/tools/calculator" },
  { name: "Compatibility Matrix", description: "Cross-compatibility lookup matching Minecraft versions with server engines and Java runtimes.", status: "ready", href: "/tools/compatibility-helper" },
];

const platformCapabilities = [
  { label: "Client-Side Processing", value: "100%", description: "Developer tools execute in-browser with zero telemetry" },
  { label: "Integrity Verified", value: "SHA-256", description: "All resource downloads cryptographically checksummed" },
  { label: "Multi-Engine Support", value: "10+ Cores", description: "Paper, Purpur, Folia, Velocity, Fabric, and Forge" },
  { label: "Open Licensing", value: "MIT / Open", description: "Permissive configurations with clear attribution" },
];

export default function Home() {
  return (
    <div className="hero-gradient min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 sm:pt-40 pb-16 container relative" aria-labelledby="hero-heading">
        {/* Ambient Top Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#FF1E27]/20 blur-[140px] pointer-events-none rounded-full" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Top Pill Badge (Reference Style) */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-semibold text-neutral-200 mb-8 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)]">
            <span className="h-2 w-2 rounded-full bg-[#FF1E27] shadow-[0_0_8px_#FF1E27] animate-pulse" />
            <span>Developer Infrastructure</span>
            <span className="text-neutral-500">•</span>
            <span className="text-[#FF444E]">Version 2.0</span>
          </div>

          <h1 id="hero-heading" className="text-4xl sm:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight text-white animate-slide-up">
            Your Minecraft <br />
            <span>Server Stack </span>
            <span className="gradient-text-red">On Demand</span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-neutral-400 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "100ms" }}>
            From Paper optimization to multi-server Velocity networks.
            Curated configs, developer tools, graphics, and guides built for peak concurrency.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "200ms" }}>
            <Button size="lg" className="rounded-full px-8 py-3.5 text-base shadow-[0_0_25px_rgba(255,30,39,0.55)]" asChild>
              <Link href="/resources">
                Explore Resources
                <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
              </Link>
            </Button>
            <a
              href="https://discord.gg/8NPerTzmKR"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline px-6 py-3 text-base flex items-center gap-2.5 rounded-full hover:border-[#FF1E27] hover:bg-[#FF1E27]/10"
            >
              <svg className="h-4 w-4 fill-currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.675 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.08.08 0 0 0 .031.057 19.9 19.9 0 0 0 5.992 4.785.077.077 0 0 0 .084-.028c.293-.198.551-.537.77-.997a18.385 18.385 0 0 0 1.948-1.813.077.077 0 0 0-.007-.127 12.05 12.05 0 0 1-1.523-4.213.074.074 0 0 1 .148-.042 7.416 7.416 0 0 0 2.742 0 .077.077 0 0 1 .147.043c.7.832 1.456 1.747 2.04 2.543a.077.077 0 0 0 .127.006 18.39 18.39 0 0 0 2.718-3.36.077.077 0 0 0-.007-.128 12.15 12.15 0 0 0 .747-1.018.074.074 0 0 0-.025-.093 19.88 19.88 0 0 0 5.025-4.518.074.074 0 0 0-.029-.083zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
              </svg>
              <span>Join Discord</span>
            </a>
          </div>

          {/* Floating Metric Glass Cards (Reference 3M+, 95%, 88%, 120+) */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
            <div className="glass p-5 rounded-2xl border border-white/10 hover:border-[#FF1E27]/40 transition-colors">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">3M+</div>
              <p className="text-xs text-neutral-400 mt-1">Players Supported</p>
            </div>
            <div className="glass p-5 rounded-2xl border border-white/10 hover:border-[#FF1E27]/40 transition-colors">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#FF1E27]">99.9%</div>
              <p className="text-xs text-neutral-400 mt-1">Crash Resistance</p>
            </div>
            <div className="glass p-5 rounded-2xl border border-white/10 hover:border-[#FF1E27]/40 transition-colors">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">100%</div>
              <p className="text-xs text-neutral-400 mt-1">Open Verified</p>
            </div>
            <div className="glass p-5 rounded-2xl border border-white/10 hover:border-[#FF1E27]/40 transition-colors">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#FF444E]">120+</div>
              <p className="text-xs text-neutral-400 mt-1">Production Assets</p>
            </div>
          </div>
        </div>

        {/* Reference Highlight Manifesto Statement */}
        <div className="pt-24 pb-8 max-w-4xl mx-auto text-center">
          <p className="text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-snug text-white">
            We <span className="text-[#FF1E27]">engineer</span> and publish{" "}
            <span className="text-[#FF1E27]">server resources</span> with performance at the core,
            ensuring every <span className="text-[#FF1E27]">network thrives</span>.
          </p>
        </div>
      </section>

      {/* Resource Categories */}
      <section className="section container" aria-labelledby="categories-heading">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 id="categories-heading" className="text-3xl sm:text-4xl font-bold text-foreground">Resource Categories</h2>
          <p className="mt-3 text-muted-foreground">Browse our curated collection of server development resources</p>
        </div>
        <div className="grid-auto-fit">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="card-interactive p-6 group"
              aria-label={`${cat.name} — ${cat.count} resources`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary/20 transition-colors">
                  <cat.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{cat.name}</h3>
                  <p className="text-sm text-muted-foreground">{cat.count} resources</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{cat.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Browse category</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors group-hover:translate-x-1" aria-hidden="true" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Resources */}
      <section className="section container" aria-labelledby="featured-heading">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <h2 id="featured-heading" className="text-3xl sm:text-4xl font-bold text-foreground">Featured Resources</h2>
            <p className="mt-2 text-muted-foreground">Hand-picked configurations and assets by our team</p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/resources?featured=true">View All Featured <ChevronRight className="h-4 w-4 ml-1" aria-hidden="true" /></Link>
          </Button>
        </div>
        <div className="grid-auto-fit">
          {featuredResources.map((resource) => (
            <article key={resource.id} className="card-interactive p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="flex-shrink-0 h-16 w-16 rounded-xl bg-card border border-border flex items-center justify-center">
                  <Download className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <Badge variant={resource.type === "free" ? "free" : "premium"}>{resource.type === "free" ? "Free" : "Premium"}</Badge>
                    <Badge variant="version">{resource.version}</Badge>
                  </div>
                  <h3 className="font-semibold text-foreground text-lg line-clamp-1">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground">{resource.category}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{resource.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {resource.tags.slice(0, 4).map((tag) => (
                  <Badge key={tag} variant="external" className="text-xs">{tag}</Badge>
                ))}
                {resource.tags.length > 4 && (
                  <Badge variant="external" className="text-xs">+{resource.tags.length - 4} more</Badge>
                )}
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/resources/${resource.id}`}>View Details <ArrowRight className="h-4 w-4 ml-1" aria-hidden="true" /></Link>
              </Button>
            </article>
          ))}
        </div>
      </section>

      {/* Recently Added */}
      <section className="section container" aria-labelledby="recent-heading">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <h2 id="recent-heading" className="text-3xl sm:text-4xl font-bold text-foreground">Recently Added</h2>
            <p className="mt-2 text-muted-foreground">Latest resources published to the library</p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/resources?sort=recent">View All Recent <ChevronRight className="h-4 w-4 ml-1" aria-hidden="true" /></Link>
          </Button>
        </div>
        <div className="grid-auto-fit">
          {recentResources.map((resource) => (
            <article key={resource.id} className="card-interactive p-6">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant={resource.type === "free" ? "free" : "premium"}>{resource.type === "free" ? "Free" : "Premium"}</Badge>
                <Badge variant="version">{resource.version}</Badge>
              </div>
              <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{resource.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{resource.category}</p>
              <Button variant="ghost" size="sm" className="w-full" asChild>
                <Link href={`/resources/${resource.id}`}>View Resource <ArrowRight className="h-3 w-3 ml-1" aria-hidden="true" /></Link>
              </Button>
            </article>
          ))}
        </div>
      </section>

      {/* Popular Tutorials */}
      <section className="section container" aria-labelledby="tutorials-heading">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <h2 id="tutorials-heading" className="text-3xl sm:text-4xl font-bold text-foreground">Popular Tutorials</h2>
            <p className="mt-2 text-muted-foreground">Learn from step-by-step guides by experienced server developers</p>
          </div>
          <Button variant="ghost" asChild>
            <Link href="/tutorials">View All Tutorials <ChevronRight className="h-4 w-4 ml-1" aria-hidden="true" /></Link>
          </Button>
        </div>
        <div className="grid-auto-fit">
          {popularTutorials.map((tutorial) => (
            <article key={tutorial.href} className="card-interactive p-6">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant={tutorial.type === "free" ? "free" : "premium"}>{tutorial.type === "free" ? "Free" : "Premium"}</Badge>
                <Badge variant="version">{tutorial.readTime}</Badge>
                <Badge variant="version">{tutorial.difficulty}</Badge>
              </div>
              <h3 className="font-semibold text-foreground mb-2 line-clamp-1">{tutorial.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{tutorial.category}</p>
              <Button variant="outline" className="w-full" asChild>
                <Link href={tutorial.href}>Read Tutorial <ArrowRight className="h-4 w-4 ml-1" aria-hidden="true" /></Link>
              </Button>
            </article>
          ))}
        </div>
      </section>

      {/* Developer Tools */}
      <section className="section container" aria-labelledby="tools-heading">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 id="tools-heading" className="text-3xl sm:text-4xl font-bold text-foreground">Developer Tools</h2>
          <p className="mt-3 text-muted-foreground">Built-in utilities to streamline your server development workflow</p>
        </div>
        <div className="grid-auto-fit">
          {devTools.map((tool) => (
            <article
              key={tool.name}
              className={tool.status === "planned" ? "card-base p-6 opacity-60" : "card-interactive p-6"}
              aria-label={`${tool.name} — ${tool.status === "ready" ? "Available" : "Coming soon"}`}
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 p-3 bg-primary/10 rounded-xl text-primary">
                  <Wrench className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{tool.name}</h3>
                    {tool.status === "planned" && (
                      <Badge variant="version">Planned</Badge>
                    )}
                    {tool.status === "ready" && (
                      <Badge variant="free">Ready</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{tool.description}</p>
                </div>
              </div>
              {tool.status === "ready" ? (
                <Button variant="primary" className="w-full" asChild>
                  <Link href={tool.href}>Open Tool <ArrowRight className="h-4 w-4 ml-1" aria-hidden="true" /></Link>
                </Button>
              ) : (
                <Button variant="ghost" className="w-full" disabled>
                  Coming Soon
                </Button>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* Free vs Premium */}
      <section className="section container" aria-labelledby="tiers-heading">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 id="tiers-heading" className="text-3xl sm:text-4xl font-bold text-foreground">Free vs Premium</h2>
          <p className="mt-3 text-muted-foreground">Choose the tier that fits your server development needs</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card variant="interactive" padding="lg">
            <CardHeader>
              <div className="p-3 bg-success/10 rounded-xl text-success w-fit mb-4">
                <CheckCircle className="h-6 w-6" aria-hidden="true" />
              </div>
              <CardTitle>Free Tier</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-success flex-shrink-0" aria-hidden="true" /> Access to 300+ free configurations</li>
                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-success flex-shrink-0" aria-hidden="true" /> All developer tools (ready status)</li>
                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-success flex-shrink-0" aria-hidden="true" /> Community tutorials and guides</li>
                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-success flex-shrink-0" aria-hidden="true" /> Basic search and filtering</li>
                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-success flex-shrink-0" aria-hidden="true" /> Direct downloads, no wait times</li>
                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-success flex-shrink-0" aria-hidden="true" /> Version compatibility tags</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/resources?free=true">Browse Free Resources</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card variant="interactive" padding="lg" className="relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge variant="premium">Best Value</Badge>
            </div>
            <CardHeader>
              <div className="p-3 bg-warning/10 rounded-xl text-warning w-fit mb-4">
                <Gem className="h-6 w-6" aria-hidden="true" />
              </div>
              <CardTitle>Premium Tier</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-success flex-shrink-0" aria-hidden="true" /> Everything in Free tier</li>
                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-success flex-shrink-0" aria-hidden="true" /> 100+ premium exclusive resources</li>
                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-success flex-shrink-0" aria-hidden="true" /> Advanced tutorials with source code</li>
                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-success flex-shrink-0" aria-hidden="true" /> Priority support & early access</li>
                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-success flex-shrink-0" aria-hidden="true" /> Bulk download & API access</li>
                <li className="flex items-center gap-3"><CheckCircle className="h-5 w-5 text-success flex-shrink-0" aria-hidden="true" /> Commercial use license included</li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button variant="primary" className="w-full" asChild>
                <Link href="/premium">Upgrade to Premium</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Platform Capabilities & Architecture */}
      <section className="section container" aria-labelledby="capabilities-heading">
        <div className="max-w-4xl mx-auto">
          <h2 id="capabilities-heading" className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-12">Platform Capabilities & Architecture</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {platformCapabilities.map((item) => (
              <div key={item.label} className="card-base p-6 text-center">
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">{item.value}</div>
                <div className="font-semibold text-foreground">{item.label}</div>
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-muted-foreground">
            Engineered for high-reliability Minecraft server networks. Independent developer platform, not affiliated with Mojang Studios or Microsoft.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section container" aria-labelledby="cta-heading">
        <div className="max-w-3xl mx-auto text-center glass-strong p-8 lg:p-12 rounded-2xl">
          <h2 id="cta-heading" className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Ready to Build Better Servers?</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Join thousands of server administrators and developers using NOTIXNODE to ship faster, optimize performance, and create unforgettable player experiences.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/resources">Start Exploring Free Resources</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a
                href="https://discord.gg/8NPerTzmKR"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <svg className="h-5 w-5 fill-currentColor text-[#5865F2]" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.675 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.08.08 0 0 0 .031.057 19.9 19.9 0 0 0 5.992 4.785.077.077 0 0 0 .084-.028c.293-.198.551-.537.77-.997a18.385 18.385 0 0 0 1.948-1.813.077.077 0 0 0-.007-.127 12.05 12.05 0 0 1-1.523-4.213.074.074 0 0 1 .148-.042 7.416 7.416 0 0 0 2.742 0 .077.077 0 0 1 .147.043c.7.832 1.456 1.747 2.04 2.543a.077.077 0 0 0 .127.006 18.39 18.39 0 0 0 2.718-3.36.077.077 0 0 0-.007-.128 12.15 12.15 0 0 0 .747-1.018.074.074 0 0 0-.025-.093 19.88 19.88 0 0 0 5.025-4.518.074.074 0 0 0-.029-.083zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                <span>Join Discord Community</span>
              </a>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <Link href="/premium">View Premium</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}