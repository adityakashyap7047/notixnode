"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/Separator";
import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";
import { Download, ExternalLink, ArrowLeft, Tag, FileCode, ImageIcon, Map, Zap, Shield, BookOpen, Gem, Clock, CheckCircle, FileText, AlertTriangle } from "lucide-react";

import type { Resource } from "@/types/resource";

const CATEGORY_ICONS: Record<string, typeof FileCode> = {
  "plugin-configurations": FileCode,
  "server-setup-guides": BookOpen,
  "graphics-icons": ImageIcon,
  "maps-builds": Map,
  "resource-packs": Zap,
  "discord-templates": Shield,
  "developer-tools": Gem,
  "tutorials": BookOpen,
  "premium-downloads": Gem,
};

const CATEGORY_LABELS: Record<string, string> = {
  "plugin-configurations": "Plugin Configurations",
  "server-setup-guides": "Server Setup Guides",
  "graphics-icons": "Graphics & Icons",
  "maps-builds": "Maps & Builds",
  "resource-packs": "Resource Packs",
  "discord-templates": "Discord Templates",
  "developer-tools": "Developer Tools",
  "tutorials": "Tutorials",
  "premium-downloads": "Premium Downloads",
};

function ResourceSkeleton() {
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <aside className="space-y-6">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </aside>
    </div>
  );
}

export default function ResourceDetailPage() {
  const params = useParams();
  const slug = params.id as string;
  const [resource, setResource] = useState<Resource | null>(null);
  const [related, setRelated] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResource = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/resources/${encodeURIComponent(slug)}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError("not_found");
          } else {
            throw new Error("Failed to fetch resource");
          }
          return;
        }
        
        const data = await response.json();
        setResource(data.resource);
        setRelated(data.related || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load resource");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResource();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <section className="section container">
          <ResourceSkeleton />
        </section>
      </div>
    );
  }

  if (error === "not_found" || !resource) {
    return (
      <div className="min-h-screen">
        <section className="section container text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Resource Not Found</h1>
          <p className="text-muted-foreground mb-6">The resource you're looking for doesn't exist or has been removed.</p>
          <Button asChild>
            <Link href="/resources">Browse All Resources</Link>
          </Button>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <section className="section container text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Failed to Load Resource</h1>
          <p className="text-muted-foreground mb-6">{error}</p>
          <Button asChild onClick={() => window.location.reload()}>
            <Link href={window.location.href}>Retry</Link>
          </Button>
        </section>
      </div>
    );
  }

  const Icon = CATEGORY_ICONS[resource.category] || FileCode;
  const categoryLabel = CATEGORY_LABELS[resource.category] || resource.category;

  return (
    <div className="min-h-screen">
      <section className="section container">
        <Button variant="ghost" size="sm" className="mb-6" asChild>
          <Link href="/resources">
            <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
            Back to Resources
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <article>
              <header className="mb-6">
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <Badge variant={resource.isPremium ? "premium" : "free"}>
                    {resource.isPremium ? "Premium" : "Free"}
                  </Badge>
                  <Badge variant="version">{resource.minecraftVersions[0] || "Latest"}</Badge>
                  {resource.isFeatured && <Badge variant="new">Featured</Badge>}
                  {resource.externalCheckoutUrl && (
                    <Badge variant="external">
                      <ExternalLink className="h-3 w-3 mr-1" aria-hidden="true" />
                      External Checkout
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">{resource.title}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                  <span className="flex items-center gap-1">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {categoryLabel}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" aria-hidden="true" />
                    Updated {new Date(resource.updatedAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag className="h-4 w-4" aria-hidden="true" />
                    {resource.tags.length} tags
                  </span>
                  {resource.downloadCount && resource.downloadCount > 0 && (
                    <span className="flex items-center gap-1">
                      <Download className="h-4 w-4" aria-hidden="true" />
                      {resource.downloadCount.toLocaleString()} downloads
                    </span>
                  )}
                </div>
              </header>

              <div className="prose prose-invert max-w-none">
                <p className="text-muted-foreground mb-6 text-lg">{resource.shortDescription}</p>
                <div className="text-foreground whitespace-pre-wrap">{resource.description}</div>
              </div>

              {resource.dependencies && resource.dependencies.length > 0 && (
                <section className="pt-6 border-t border-border">
                  <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <FileCode className="h-5 w-5 text-primary" aria-hidden="true" />
                    Dependencies
                  </h2>
                  <ul className="space-y-2">
                    {resource.dependencies.map((dep, i) => (
                      <li key={i} className="flex items-center gap-2 text-muted-foreground">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" aria-hidden="true" />
                        <span className="font-medium">{dep.name}</span>
                        {dep.version && <span className="text-xs text-muted-foreground">({dep.version})</span>}
                        {dep.required && <Badge variant="version" className="text-xs">Required</Badge>}
                        {!dep.required && <Badge variant="external" className="text-xs">Optional</Badge>}
                        {dep.url && (
                          <a href={dep.url} target="_blank" rel="noopener noreferrer" className="link-underline text-xs">
                            <ExternalLink className="h-3 w-3 ml-1" aria-hidden="true" />
                          </a>
                        )}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {resource.serverSoftware && resource.serverSoftware.length > 0 && (
                <section className="pt-6 border-t border-border">
                  <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <FileCode className="h-5 w-5 text-primary" aria-hidden="true" />
                    Supported Server Software
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {resource.serverSoftware.map((s, i) => (
                      <Badge key={i} variant="version">{s}</Badge>
                    ))}
                  </div>
                </section>
              )}

              {resource.changelog && resource.changelog.length > 0 && (
                <section className="pt-6 border-t border-border">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Changelog</h2>
                  <div className="space-y-4">
                    {resource.changelog.map((entry, i) => (
                      <div key={i} className="card-base p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0">
                            <Badge variant="version">{entry.version}</Badge>
                            <span className="text-xs text-muted-foreground ml-2">{new Date(entry.date).toLocaleDateString()}</span>
                          </div>
                          <ul className="space-y-1 text-sm text-muted-foreground">
                            {entry.changes.map((change, ci) => (
                              <li key={ci} className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" aria-hidden="true" />
                                {change}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <section className="pt-6 border-t border-border">
                <h2 className="text-xl font-semibold text-foreground mb-4">License</h2>
                <p className="text-muted-foreground">{resource.license}</p>
                {resource.attribution && (
                  <p className="text-xs text-muted-foreground mt-2">Attribution: {resource.attribution}</p>
                )}
              </section>

              {resource.installationInstructions && (
                <section className="pt-6 border-t border-border">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Installation</h2>
                  <div className="prose prose-invert max-w-none text-muted-foreground whitespace-pre-wrap">
                    {resource.installationInstructions}
                  </div>
                </section>
              )}

              {related.length > 0 && (
                <section className="pt-6 border-t border-border">
                  <h2 className="text-xl font-semibold text-foreground mb-4">Related Resources</h2>
                  <div className="grid-auto-fit">
                    {related.slice(0, 4).map((rel) => (
                      <article key={rel.id} className="card-interactive p-4">
                        <Link href={`/resources/${rel.slug}`} className="link-underline font-medium text-foreground line-clamp-1 block mb-1">
                          {rel.title}
                        </Link>
                        <p className="text-sm text-muted-foreground">{CATEGORY_LABELS[rel.category] || rel.category}</p>
                      </article>
                    ))}
                  </div>
                </section>
              )}
            </article>
          </div>

          <aside className="space-y-6">
            <Card variant="glass-strong" padding="lg">
              <CardHeader>
                <CardTitle>Download</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {resource.files.map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                        <div>
                          <p className="font-medium text-foreground">{file.filename}</p>
                          <p className="text-xs text-muted-foreground">{file.contentType} • {(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      {file.externalUrl ? (
                        <Button variant="primary" size="sm" asChild>
                          <a href={file.externalUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" aria-hidden="true" />
                            Download
                          </a>
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm">
                          <Download className="h-3 w-3 mr-1" aria-hidden="true" />
                          Download
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Separator />
                <Button variant="primary" className="w-full" size="lg" disabled={resource.files.every(f => f.externalUrl)}>
                  <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                  Download All
                </Button>
              </CardContent>
            </Card>

            <Card variant="glass-strong" padding="lg">
              <CardHeader>
                <CardTitle>Resource Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <dl className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Category</dt>
                    <dd className="text-foreground font-medium">{categoryLabel}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Type</dt>
                    <dd className="text-foreground font-medium capitalize">{resource.resourceType}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Minecraft Versions</dt>
                    <dd className="text-foreground font-medium">{resource.minecraftVersions.join(", ")}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Author</dt>
                    <dd className="text-foreground font-medium">{resource.author.name}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Last Updated</dt>
                    <dd className="text-foreground font-medium">{new Date(resource.updatedAt).toLocaleDateString()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Files</dt>
                    <dd className="text-foreground font-medium">{resource.files.length} files</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Size</dt>
                    <dd className="text-foreground font-medium">
                      {(resource.files.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(2)} MB
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card variant="glass-strong" padding="lg">
              <CardHeader>
                <CardTitle>Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {resource.tags.map((tag, i) => (
                    <Link key={i} href={`/resources?search=${encodeURIComponent(tag)}`} className="badge-external text-xs hover:bg-primary/10 hover:text-primary transition-colors">
                      {tag}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {resource.externalCheckoutUrl && (
              <Card variant="glass-strong" padding="lg">
                <CardHeader>
                  <CardTitle>External Checkout</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">This is a premium resource hosted externally. Complete your purchase on the vendor's site.</p>
                  <Button variant="primary" className="w-full" asChild>
                    <a href={resource.externalCheckoutUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" aria-hidden="true" />
                      Purchase on {new URL(resource.externalCheckoutUrl).hostname}
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </aside>
        </div>
      </section>
    </div>
  );
}