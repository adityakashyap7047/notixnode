"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Separator } from "@/components/ui/Separator";
import { Skeleton, SkeletonGrid } from "@/components/ui/Skeleton";
import { Search, Filter, ChevronDown, BookOpen, Clock, Star, ArrowRight, Code, Server, Shield, Zap, Database, Users, Lock, ExternalLink } from "lucide-react";

const tutorialCategories = [
  { id: "all", name: "All Categories" },
  { id: "setup", name: "Server Setup", icon: Server },
  { id: "permissions", name: "Permissions", icon: Shield },
  { id: "performance", name: "Performance", icon: Zap },
  { id: "development", name: "Development", icon: Code },
  { id: "security", name: "Security", icon: Lock },
  { id: "networking", name: "Networking", icon: Database },
  { id: "gameplay", name: "Gameplay", icon: Users },
];

const mockTutorials = [
  {
    id: 1,
    title: "Setting Up a Velocity + Paper Network from Scratch",
    category: "setup",
    categoryLabel: "Server Setup",
    readTime: "15 min",
    difficulty: "Intermediate",
    type: "free",
    description: "Complete guide to setting up a modern Velocity proxy with multiple Paper backend servers. Covers configuration, modern forwarding, and cross-server communication.",
    tags: ["Velocity", "Paper", "Proxy", "Network"],
    href: "/tutorials/velocity-paper-network",
    updated: "2024-12-10",
  },
  {
    id: 2,
    title: "LuckPerms Masterclass: Contexts, Tracks, and Migration",
    category: "permissions",
    categoryLabel: "Permissions",
    readTime: "22 min",
    difficulty: "Advanced",
    type: "premium",
    description: "Deep dive into LuckPerms advanced features. Context-based permissions, track management, migration from PEX/GroupManager, and best practices for large networks.",
    tags: ["LuckPerms", "Permissions", "Migration", "Contexts"],
    href: "/tutorials/luckperms-masterclass",
    updated: "2024-12-05",
  },
  {
    id: 3,
    title: "Optimizing PaperMC for 500+ Concurrent Players",
    category: "performance",
    categoryLabel: "Performance",
    readTime: "18 min",
    difficulty: "Advanced",
    type: "free",
    description: "Advanced Paper configuration tuning, JVM flags, plugin optimization, entity management, and monitoring setup for high-population servers.",
    tags: ["Paper", "Performance", "JVM", "Optimization"],
    href: "/tutorials/paper-optimization",
    updated: "2024-12-01",
  },
  {
    id: 4,
    title: "Creating Custom Items with items.yml (No Code)",
    category: "development",
    categoryLabel: "Development",
    readTime: "12 min",
    difficulty: "Beginner",
    type: "free",
    description: "Create custom items, tools, armor, and furniture using ItemsAdder or Oraxen. No Java knowledge required. Includes model creation basics.",
    tags: ["ItemsAdder", "Oraxen", "Custom Items", "Models"],
    href: "/tutorials/custom-items",
    updated: "2024-11-28",
  },
  {
    id: 5,
    title: "Securing Your Server: Anti-Cheat, Exploits & Hardening",
    category: "security",
    categoryLabel: "Security",
    readTime: "25 min",
    difficulty: "Intermediate",
    type: "premium",
    description: "Comprehensive security hardening guide. Anti-cheat configuration, exploit prevention, permission auditing, and incident response procedures.",
    tags: ["Security", "Anti-Cheat", "Hardening", "Exploits"],
    href: "/tutorials/security-hardening",
    updated: "2024-11-25",
  },
  {
    id: 6,
    title: "Docker & Kubernetes for Minecraft Servers",
    category: "networking",
    categoryLabel: "Networking",
    readTime: "30 min",
    difficulty: "Advanced",
    type: "premium",
    description: "Containerize your Minecraft server with Docker. Orchestrate with Kubernetes for auto-scaling, rolling updates, and high availability.",
    tags: ["Docker", "Kubernetes", "Containers", "DevOps"],
    href: "/tutorials/docker-kubernetes",
    updated: "2024-11-20",
  },
  {
    id: 7,
    title: "Folia Threading Model Explained",
    category: "performance",
    categoryLabel: "Performance",
    readTime: "14 min",
    difficulty: "Advanced",
    type: "free",
    description: "Understanding Folia's regionized threading. How it differs from Paper, plugin compatibility, and when to migrate.",
    tags: ["Folia", "Threading", "Regions", "Paper"],
    href: "/tutorials/folia-threading",
    updated: "2024-11-18",
  },
  {
    id: 8,
    title: "Building Custom GUIs with Chest Commands",
    category: "development",
    categoryLabel: "Development",
    readTime: "10 min",
    difficulty: "Beginner",
    type: "free",
    description: "Create interactive GUI menus using ChestCommands or DeluxeMenus. Pagination, conditions, and placeholder integration.",
    tags: ["ChestCommands", "DeluxeMenus", "GUIs", "Menus"],
    href: "/tutorials/custom-guis",
    updated: "2024-11-15",
  },
  {
    id: 9,
    title: "Database Optimization: MariaDB vs PostgreSQL",
    category: "networking",
    categoryLabel: "Networking",
    readTime: "16 min",
    difficulty: "Intermediate",
    type: "free",
    description: "Choosing and tuning databases for Minecraft plugins. Connection pooling, query optimization, and migration strategies.",
    tags: ["MariaDB", "PostgreSQL", "Database", "Optimization"],
    href: "/tutorials/database-optimization",
    updated: "2024-11-10",
  },
  {
    id: 10,
    title: "Crossplay Setup: Geyser + Floodgate Complete Guide",
    category: "setup",
    categoryLabel: "Server Setup",
    readTime: "20 min",
    difficulty: "Intermediate",
    type: "free",
    description: "Enable Java/Bedrock crossplay with GeyserMC and Floodgate. Configuration, common issues, and platform-specific optimizations.",
    tags: ["Geyser", "Floodgate", "Crossplay", "Bedrock"],
    href: "/tutorials/geyser-floodgate",
    updated: "2024-11-05",
  },
  {
    id: 11,
    title: "WorldEdit & FAWE: Large-Scale Building",
    category: "development",
    categoryLabel: "Development",
    readTime: "12 min",
    difficulty: "Intermediate",
    type: "premium",
    description: "Advanced WorldEdit techniques, FastAsyncWorldEdit optimization, schematic management, and automation for massive builds.",
    tags: ["WorldEdit", "FAWE", "Building", "Schematics"],
    href: "/tutorials/worldedit-fawe",
    updated: "2024-11-01",
  },
  {
    id: 12,
    title: "Plugin Development: Your First Paper Plugin",
    category: "development",
    categoryLabel: "Development",
    readTime: "35 min",
    difficulty: "Beginner",
    type: "free",
    description: "Step-by-step tutorial creating a Paper plugin from scratch. Commands, listeners, config, and deployment.",
    tags: ["Plugin Dev", "Paper", "Java", "Maven"],
    href: "/tutorials/first-plugin",
    updated: "2024-10-28",
  },
];

export default function TutorialsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const itemsPerPage = 9;

  const filteredTutorials = useMemo(() => {
    return mockTutorials.filter((t) => {
      const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || t.category === selectedCategory;
      const matchesType = selectedType === "all" || t.type === selectedType;
      const matchesDifficulty = selectedDifficulty === "all" || t.difficulty === selectedDifficulty;
      return matchesSearch && matchesCategory && matchesType && matchesDifficulty;
    });
  }, [searchQuery, selectedCategory, selectedType, selectedDifficulty]);

  const totalPages = Math.ceil(filteredTutorials.length / itemsPerPage);
  const paginatedTutorials = filteredTutorials.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="min-h-screen">
      <section className="section container" aria-labelledby="tutorials-heading">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 id="tutorials-heading" className="text-3xl sm:text-4xl font-bold text-foreground">Tutorials & Guides</h1>
            <p className="mt-2 text-muted-foreground">Learn from step-by-step guides by experienced server developers</p>
          </div>
          <a
            href="https://youtube.com/@os_notixnode?si=3q3E6MlMjz-j0J2w"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-card border border-border hover:border-red-500/40 hover:bg-red-500/5 transition-all text-sm font-medium w-fit group"
          >
            <div className="h-8 w-8 rounded-lg bg-red-600/10 text-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="h-5 w-5 fill-currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </div>
            <div>
              <div className="text-foreground font-semibold group-hover:text-red-500 transition-colors">Watch Video Tutorials</div>
              <div className="text-xs text-muted-foreground">Subscribe on YouTube @os_notixnode</div>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-red-500 ml-1 transition-colors" />
          </a>
        </div>

        <form onSubmit={handleSearch} className="card-base p-6 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); setPage(1); }}}
                placeholder="Search tutorials, tags, descriptions..."
                className="input-base pl-10"
                aria-label="Search tutorials"
              />
            </div>

            <div className="relative">
              <select
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
                className="input-base appearance-none pr-10 bg-card"
                aria-label="Filter by category"
              >
                {tutorialCategories.map((cat) => (
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
                value={selectedDifficulty}
                onChange={(e) => { setSelectedDifficulty(e.target.value); setPage(1); }}
                className="input-base appearance-none pr-10 bg-card"
                aria-label="Filter by difficulty"
              >
                <option value="all">All Difficulties</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
            </div>

            <Button type="submit" variant="primary" className="h-10">
              <Filter className="h-4 w-4 mr-2" aria-hidden="true" />
              Apply
            </Button>
          </div>
        </form>

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {paginatedTutorials.length} of {filteredTutorials.length} tutorials
          </p>
          {filteredTutorials.length > 0 && (
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
        ) : filteredTutorials.length === 0 ? (
          <div className="card-base p-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No tutorials found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
            <Button variant="outline" onClick={() => { setSearchQuery(""); setSelectedCategory("all"); setSelectedType("all"); setSelectedDifficulty("all"); }}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid-auto-fit" role="list" aria-label="Tutorials">
              {paginatedTutorials.map((tutorial) => (
                <article key={tutorial.id} className="card-interactive p-6" role="listitem">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="flex-shrink-0 h-16 w-16 rounded-xl bg-card border border-border flex items-center justify-center">
                      <BookOpen className="h-8 w-8 text-primary" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <Badge variant={tutorial.type === "free" ? "free" : "premium"}>{tutorial.type === "free" ? "Free" : "Premium"}</Badge>
                        <Badge variant="version">{tutorial.readTime}</Badge>
                        <Badge variant="version">{tutorial.difficulty}</Badge>
                      </div>
                      <Link href={tutorial.href} className="link-underline font-semibold text-foreground text-lg line-clamp-1 block mb-1">
                        {tutorial.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">{tutorial.categoryLabel}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{tutorial.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tutorial.tags.slice(0, 4).map((tag) => (
                      <Badge key={tag} variant="external" className="text-xs">{tag}</Badge>
                    ))}
                    {tutorial.tags.length > 4 && (
                      <Badge variant="external" className="text-xs">+{tutorial.tags.length - 4} more</Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      Updated {new Date(tutorial.updated).toLocaleDateString()}
                    </span>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={tutorial.href}>Read Tutorial <ArrowRight className="h-3 w-3 ml-1" aria-hidden="true" /></Link>
                    </Button>
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