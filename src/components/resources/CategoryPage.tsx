"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton, SkeletonGrid } from "@/components/ui/Skeleton";
import { Search, Filter, ChevronDown, Download, ExternalLink, ArrowRight, BookOpen, FileCode, ImageIcon, Map, Zap, Shield, Gem } from "lucide-react";

import type { Resource, ResourceCategory, ResourceSortOption, ResourceType } from "@/types/resource";

const CATEGORY_CONFIG: Record<ResourceCategory, { label: string; icon: typeof FileCode; description: string }> = {
  "plugin-configurations": { label: "Plugin Configurations", icon: FileCode, description: "Ready-to-use configurations for popular Minecraft plugins." },
  "server-setup-guides": { label: "Server Setup Guides", icon: BookOpen, description: "Step-by-step guides for server installation and configuration." },
  "graphics-icons": { label: "Graphics & Icons", icon: ImageIcon, description: "Custom logos, server icons, animated MOTDs, and UI asset packs." },
  "maps-builds": { label: "Maps & Builds", icon: Map, description: "Custom maps, spawn builds, and schematic files." },
  "resource-packs": { label: "Resource Packs", icon: Zap, description: "Texture packs, models, and client-side resource packs." },
  "discord-templates": { label: "Discord Templates", icon: Shield, description: "Discord server templates, bot configs, and role setups." },
  "developer-tools": { label: "Developer Tools", icon: Gem, description: "Utilities, scripts, and tools for server developers." },
  "tutorials": { label: "Tutorials", icon: BookOpen, description: "Educational content for server administration and development." },
  "premium-downloads": { label: "Premium Downloads", icon: Gem, description: "Curated premium resources with external checkout." },
};

interface CategoryPageProps {
  category: ResourceCategory;
}

export function CategoryPage({ category }: CategoryPageProps) {
  const config = CATEGORY_CONFIG[category];
  const Icon = config.icon;
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | "configuration" | "guide" | "template" | "pack" | "tool" | "tutorial" | "other">("all");
  const [sortBy, setSortBy] = useState<ResourceSortOption>("newest");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [resources, setResources] = useState<Resource[]>([]);

  const itemsPerPage = 12;

  const fetchResources = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: itemsPerPage.toString(),
        sort: sortBy,
        category: category,
      });
      if (selectedType !== "all") params.set("resourceType", selectedType);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const response = await fetch(`/api/resources?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to load resources");
      const data = await response.json();
      setResources(data.resources || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalItems(data.pagination?.totalItems || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load resources");
      setResources([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [page, selectedType, sortBy, searchQuery, category, itemsPerPage]);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedType("all");
    setSortBy("newest");
    setPage(1);
  };

  return (
    <div className="min-h-screen">
      <section className="section container">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-primary/10 rounded-xl text-primary">
              <Icon className="h-8 w-8" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">{config.label}</h1>
              <p className="text-muted-foreground">{config.description}</p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="card-base p-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); setPage(1); }}}
                  placeholder={`Search ${config.label.toLowerCase()}...`}
                  className="input-base pl-10"
                  aria-label={`Search ${config.label.toLowerCase()}`}
                />
              </div>
              <select
                value={selectedType}
                onChange={(e) => { setSelectedType(e.target.value as ResourceType | "all"); setPage(1); }}
                className="input-base appearance-none pr-10 bg-card"
                aria-label="Filter by type"
              >
                <option value="all">All Types</option>
                <option value="configuration">Configuration</option>
                <option value="guide">Guide</option>
                <option value="template">Template</option>
                <option value="pack">Pack</option>
                <option value="tool">Tool</option>
                <option value="tutorial">Tutorial</option>
                <option value="other">Other</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value as ResourceSortOption); setPage(1); }}
                className="input-base appearance-none pr-10 bg-card"
                aria-label="Sort by"
              >
                <option value="newest">Most Recent</option>
                <option value="popular">Most Popular</option>
                <option value="alphabetical">Name A-Z</option>
                <option value="updated">Recently Updated</option>
                <option value="oldest">Oldest First</option>
              </select>
              <Button type="button" variant="outline" onClick={handleClearFilters} className="h-10">
                <Filter className="h-4 w-4 mr-2" aria-hidden="true" />
                Clear
              </Button>
            </div>
          </form>
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {resources.length} of {totalItems} resources
          </p>
          {totalItems > 0 && (
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

        {error ? (
          <div className="card-base p-12 text-center">
            <svg className="h-12 w-12 text-destructive mx-auto mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            <h3 className="text-lg font-semibold text-foreground mb-2">Failed to load resources</h3>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button variant="primary" onClick={fetchResources}>Retry</Button>
          </div>
        ) : isLoading ? (
          <SkeletonGrid count={itemsPerPage} />
        ) : resources.length === 0 ? (
          <div className="card-base p-12 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No resources found</h3>
            <p className="text-muted-foreground mb-6">Try adjusting your search or filters</p>
            <Button variant="outline" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <>
            <div className="grid-auto-fit" role="list" aria-label={config.label}>
              {resources.map((resource) => (
                <article key={resource.id} className="card-interactive" role="listitem">
                  <div className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="flex-shrink-0 h-16 w-16 rounded-xl bg-card border border-border flex items-center justify-center">
                        <Icon className="h-8 w-8 text-primary" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <Badge variant={resource.isPremium ? "premium" : "free"}>
                            {resource.isPremium ? "Premium" : "Free"}
                          </Badge>
                          <Badge variant="version">{resource.minecraftVersions[0] || "Latest"}</Badge>
                          {resource.externalCheckoutUrl && (
                            <Badge variant="external">
                              <ExternalLink className="h-3 w-3 mr-1" aria-hidden="true" />
                              External
                            </Badge>
                          )}
                          {resource.isFeatured && <Badge variant="new">Featured</Badge>}
                        </div>
                        <Link href={`/resources/${resource.slug}`} className="link-underline font-semibold text-foreground text-lg line-clamp-1 block mb-1">
                          {resource.title}
                        </Link>
                        <p className="text-sm text-muted-foreground">{config.label}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{resource.shortDescription}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {resource.tags.slice(0, 4).map((tag) => (
                        <Badge key={tag} variant="external" className="text-xs">{tag}</Badge>
                      ))}
                      {resource.tags.length > 4 && (
                        <Badge variant="external" className="text-xs">+{resource.tags.length - 4} more</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <span className="text-xs text-muted-foreground">Updated {new Date(resource.updatedAt).toLocaleDateString()}</span>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/resources/${resource.slug}`}>View Details</Link>
                        </Button>
                        {resource.externalCheckoutUrl ? (
                          <Button variant="primary" size="sm" className="flex items-center gap-1" asChild>
                            <a href={resource.externalCheckoutUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-3 w-3" aria-hidden="true" />
                              View
                            </a>
                          </Button>
                        ) : (
                          <Button variant="primary" size="sm" className="flex items-center gap-1">
                            <Download className="h-3 w-3" aria-hidden="true" />
                            Download
                          </Button>
                        )}
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