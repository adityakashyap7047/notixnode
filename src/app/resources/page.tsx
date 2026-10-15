"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/Separator";
import { Skeleton, SkeletonGrid } from "@/components/ui/Skeleton";
import { Search, Filter, ChevronDown, Download, ExternalLink, ArrowRight, Tag, FileCode, ImageIcon, Map, Zap, Shield, BookOpen, Gem } from "lucide-react";

const categories = [
  { id: "all", name: "All Categories", icon: null },
  { id: "configs", name: "Plugin Configurations", icon: FileCode },
  { id: "guides", name: "Server Setup Guides", icon: BookOpen },
  { id: "graphics", name: "Graphics & Icons", icon: ImageIcon },
  { id: "maps", name: "Maps & Builds", icon: Map },
  { id: "packs", name: "Resource Packs", icon: Zap },
  { id: "discord", name: "Discord Templates", icon: Shield },
  { id: "tools", name: "Developer Tools", icon: Gem },
];

const mockResources = [
  {
    id: 1,
    title: "LuckPerms Rank Structure — Network Grade",
    category: "configs",
    categoryLabel: "Plugin Configurations",
    version: "1.21.x",
    tags: ["LuckPerms", "Paper", "Velocity", "BungeeCord"],
    type: "free",
    description: "Complete rank ladder with 15 ranks, inheritance chains, context-based permissions, and prefix/suffix templates. Includes migration script from PermissionsEx.",
    thumbnail: null,
    external: false,
    updated: "2024-12-15",
  },
  {
    id: 2,
    title: "PaperMC Optimized server.properties",
    category: "guides",
    categoryLabel: "Server Setup Guides",
    version: "1.21.1",
    tags: ["Paper", "Performance", "Configuration"],
    type: "free",
    description: "Battle-tested configuration with tuned entity tracking, chunk loading, and anti-exploit settings. Reduces TPS drops by 40% on high-population servers.",
    thumbnail: null,
    external: false,
    updated: "2024-12-10",
  },
  {
    id: 3,
    title: "Animated Server Icon Pack — Neon Series",
    category: "graphics",
    categoryLabel: "Graphics & Icons",
    version: "Universal",
    tags: ["Animated", "Server List", "Branding"],
    type: "premium",
    description: "6 animated server icons with smooth 20-frame loops. Includes PSD source files, AfterEffects project, and ready-to-upload GIF/WebP exports.",
    thumbnail: null,
    external: false,
    updated: "2024-12-08",
  },
  {
    id: 4,
    title: "Medieval Fantasy Spawn — 200x200",
    category: "maps",
    categoryLabel: "Maps & Builds",
    version: "1.20+",
    tags: ["Spawn", "Medieval", "WorldEdit", "Schematic"],
    type: "premium",
    description: "Detailed medieval spawn with 4 portals, NPC areas, crates, and info boards. Includes WorldEdit schematic, Litematica, and Blueprint files.",
    thumbnail: null,
    external: false,
    updated: "2024-12-05",
  },
  {
    id: 5,
    title: "Velocity Proxy Config — Multi-Server Network",
    category: "configs",
    categoryLabel: "Plugin Configurations",
    version: "3.3.0",
    tags: ["Velocity", "Proxy", "Network", "Paper"],
    type: "free",
    description: "Production-ready Velocity configuration with modern forwarding, compression, and player handling optimizations.",
    thumbnail: null,
    external: false,
    updated: "2024-12-12",
  },
  {
    id: 6,
    title: "Custom Enchants Pack — 50+ Unique Enchants",
    category: "packs",
    categoryLabel: "Resource Packs",
    version: "1.21.x",
    tags: ["Custom Enchants", "ItemsAdder", "Oraxen", "RP"],
    type: "premium",
    description: "50+ unique custom enchantments with custom models, effects, and balanced progression. Compatible with ItemsAdder and Oraxen.",
    thumbnail: null,
    external: false,
    updated: "2024-12-01",
  },
  {
    id: 7,
    title: "Factions Map — Desert Theme 5k×5k",
    category: "maps",
    categoryLabel: "Maps & Builds",
    version: "1.19+",
    tags: ["Factions", "Desert", "Large", "WorldPainter"],
    type: "free",
    description: "Massive 5000x5000 desert-themed factions map with custom terrain, outposts, KOTH zones, and resource areas.",
    thumbnail: null,
    external: false,
    updated: "2024-11-28",
  },
  {
    id: 8,
    title: "DiscordSRV Advanced Config",
    category: "discord",
    categoryLabel: "Discord Templates",
    version: "1.26.0",
    tags: ["DiscordSRV", "Bridge", "Verification", "Roles"],
    type: "free",
    description: "Advanced DiscordSRV configuration with verification flows, role sync, channel mapping, and custom formatting.",
    thumbnail: null,
    external: false,
    updated: "2024-11-25",
  },
  {
    id: 9,
    title: "Modern UI Resource Pack — Dark Mode",
    category: "graphics",
    categoryLabel: "Graphics & Icons",
    version: "1.21.x",
    tags: ["UI", "Dark Mode", "Custom Fonts", "Models"],
    type: "premium",
    description: "Complete UI overhaul with dark theme, custom fonts, animated textures, and custom item models for modern server aesthetics.",
    thumbnail: null,
    external: false,
    updated: "2024-11-20",
  },
  {
    id: 10,
    title: "Folia Threading Optimization Guide",
    category: "guides",
    categoryLabel: "Server Setup Guides",
    version: "1.21.1",
    tags: ["Folia", "Threading", "Performance", "Regionized"],
    type: "free",
    description: "Deep dive into Folia's regionized threading model. Covers chunk scheduling, entity management, and plugin compatibility.",
    thumbnail: null,
    external: false,
    updated: "2024-11-18",
  },
  {
    id: 11,
    title: "EssentialsX Complete Config Bundle",
    category: "configs",
    categoryLabel: "Plugin Configurations",
    version: "2.20.0",
    tags: ["EssentialsX", "Economy", "Warps", "Kits"],
    type: "free",
    description: "Complete EssentialsX configuration with balanced economy, 50+ kits, warp system, and custom command aliases.",
    thumbnail: null,
    external: false,
    updated: "2024-11-15",
  },
  {
    id: 12,
    title: "Bedrock Edition Compatibility Pack",
    category: "packs",
    categoryLabel: "Resource Packs",
    version: "1.21.x",
    tags: ["Geyser", "Floodgate", "Bedrock", "Crossplay"],
    type: "free",
    description: "Resource pack optimizations and custom items for seamless Java/Bedrock crossplay via Geyser/Floodgate.",
    thumbnail: null,
    external: false,
    updated: "2024-11-10",
  },
];

const sortOptions = [
  { value: "recent", label: "Most Recent" },
  { value: "popular", label: "Most Popular" },
  { value: "name", label: "Name A-Z" },
  { value: "updated", label: "Recently Updated" },
];

export default function ResourcesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const itemsPerPage = 9;

  const filteredResources = useMemo(() => {
    return mockResources.filter((resource) => {
      const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        resource.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
      const matchesType = selectedType === "all" || resource.type === selectedType;
      
      return matchesSearch && matchesCategory && matchesType;
    }).sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.title.localeCompare(b.title);
        case "updated":
          return new Date(b.updated).getTime() - new Date(a.updated).getTime();
        case "recent":
        default:
          return b.id - a.id;
      }
    });
  }, [searchQuery, selectedCategory, selectedType, sortBy]);

  const totalPages = Math.ceil(filteredResources.length / itemsPerPage);
  const paginatedResources = filteredResources.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="min-h-screen">
      <section className="section container" aria-labelledby="resources-heading">
        <div className="mb-8">
          <h1 id="resources-heading" className="text-3xl sm:text-4xl font-bold text-foreground">Resource Library</h1>
          <p className="mt-2 text-muted-foreground">Browse and download plugin configurations, maps, graphics, and developer tools</p>
        </div>

        <form onSubmit={handleSearch} className="card-base p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); setPage(1); }}}
                placeholder="Search resources, tags, descriptions..."
                className="input-base pl-10"
                aria-label="Search resources"
              />
            </div>

            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
                className="input-base appearance-none pr-10 bg-card"
                aria-label="Filter by category"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
            </div>

            <div className="relative">
              <select
                value={selectedType}
                onChange={(e) => { setSelectedType(e.target.value); setPage(1); }}
                className="input-base appearance-none pr-10 bg-card"
                aria-label="Filter by type"
              >
                <option value="all">All Types</option>
                <option value="free">Free</option>
                <option value="premium">Premium</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
            </div>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className="input-base appearance-none pr-10 bg-card"
                aria-label="Sort by"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
            </div>
          </div>
        </form>

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {paginatedResources.length} of {filteredResources.length} resources
          </p>
          {filteredResources.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} aria-label="Previous page">
                <ChevronDown className="h-4 w-4 rotate-180" aria-hidden="true" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="Next page">
                <ChevronDown className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          )}
        </div>

        {isLoading ? (
          <SkeletonGrid count={itemsPerPage} />
        ) : filteredResources.length === 0 ? (
          <div className="card-base p-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No resources found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
            <Button variant="outline" onClick={() => { setSearchQuery(""); setSelectedCategory("all"); setSelectedType("all"); }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid-auto-fit" role="list" aria-label="Resources">
              {paginatedResources.map((resource) => (
                <article key={resource.id} className="card-interactive" role="listitem">
                  <div className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="flex-shrink-0 h-16 w-16 rounded-xl bg-card border border-border flex items-center justify-center">
                        {(() => {
                            const cat = categories.find(c => c.id === resource.category);
                            const Icon = cat?.icon;
                            return Icon ? <Icon className="h-8 w-8 text-primary" aria-hidden="true" /> : null;
                          })()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <Badge variant={resource.type === "free" ? "free" : "premium"}>{resource.type === "free" ? "Free" : "Premium"}</Badge>
                          <Badge variant="version">{resource.version}</Badge>
                          {resource.external && <Badge variant="external">External</Badge>}
                        </div>
                        <Link href={`/resources/${resource.id}`} className="link-underline font-semibold text-foreground text-lg line-clamp-1 block mb-1">
                          {resource.title}
                        </Link>
                        <p className="text-sm text-muted-foreground">{resource.categoryLabel}</p>
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
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-xs text-muted-foreground">Updated {new Date(resource.updated).toLocaleDateString()}</span>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/resources/${resource.id}`}>Details</Link>
                        </Button>
                        <Button variant="primary" size="sm" className="flex items-center gap-1">
                          <Download className="h-3 w-3" aria-hidden="true" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} aria-label="Previous page">
                  Previous
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (page <= 3) pageNum = i + 1;
                  else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = page - 2 + i;
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "primary" : "outline"}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                      aria-label={`Page ${pageNum}`}
                      aria-current={page === pageNum ? "page" : undefined}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
                <Button variant="outline" size="sm" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="Next page">
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}