"use client";

import { useState, useEffect } from "react";
import { CheckCircle, AlertCircle, AlertTriangle, XCircle, Server, Database, Globe, Activity, Clock, RefreshCw, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Separator } from "@/components/ui/Separator";
import { FloatingNodeMonitor } from "@/components/status/FloatingNodeMonitor";

const services = [
  {
    id: "website",
    name: "Website",
    description: "Main marketing website and documentation",
    status: "operational",
    uptime: "99.98%",
    responseTime: "124ms",
    url: "/",
    icon: Globe,
  },
  {
    id: "api",
    name: "API",
    description: "REST API for resources and search",
    status: "operational",
    uptime: "99.95%",
    responseTime: "89ms",
    url: "/api",
    icon: Database,
  },
  {
    id: "cdn",
    name: "CDN & Assets",
    description: "Static assets, downloads, and media delivery",
    status: "operational",
    uptime: "99.99%",
    responseTime: "23ms",
    url: "https://cdn.notixnode.dev",
    icon: Server,
  },
  {
    id: "auth",
    name: "Authentication",
    description: "User accounts, login, and premium access",
    status: "operational",
    uptime: "99.97%",
    responseTime: "156ms",
    url: "/auth",
    icon: Activity,
  },
  {
    id: "search",
    name: "Search",
    description: "Resource search and filtering engine",
    status: "degraded",
    uptime: "99.92%",
    responseTime: "312ms",
    url: "/resources",
    icon: Globe,
  },
  {
    id: "tools",
    name: "Developer Tools",
    description: "MOTD previewer, prefix builder, and calculators",
    status: "operational",
    uptime: "99.96%",
    responseTime: "67ms",
    url: "/tools",
    icon: Server,
  },
];

const incidents = [
  {
    id: "inc-001",
    title: "Search Index Rebuild",
    status: "investigating",
    createdAt: "2026-10-15T08:30:00Z",
    updatedAt: "2026-10-15T08:45:00Z",
    impact: "Search results may be incomplete or slow",
    services: ["search"],
    updates: [
      { timestamp: "2026-10-15T08:45:00Z", message: "Identified root cause: index corruption during scheduled rebuild. Initiating full re-index." },
      { timestamp: "2026-10-15T08:30:00Z", message: "Users reporting slow search responses. Investigation started." },
    ],
  },
  {
    id: "inc-002",
    title: "CDN Cache Purge - Completed",
    status: "resolved",
    createdAt: "2026-10-14T14:20:00Z",
    updatedAt: "2026-10-14T14:35:00Z",
    impact: "Temporary 404s on some asset downloads",
    services: ["cdn"],
    updates: [
      { timestamp: "2026-10-14T14:35:00Z", message: "Cache fully propagated. All assets serving correctly." },
      { timestamp: "2026-10-14T14:25:00Z", message: "Purge completed. Monitoring cache hit ratios." },
      { timestamp: "2026-10-14T14:20:00Z", message: "Emergency cache purge initiated for stale assets." },
    ],
  },
  {
    id: "inc-003",
    title: "API Rate Limiter Misconfiguration - Resolved",
    status: "resolved",
    createdAt: "2026-10-13T22:10:00Z",
    updatedAt: "2026-10-13T22:45:00Z",
    impact: "Legitimate API requests incorrectly rate limited",
    services: ["api"],
    updates: [
      { timestamp: "2026-10-13T22:45:00Z", message: "Rate limiter configuration rolled back. Monitoring for stability." },
      { timestamp: "2026-10-13T22:30:00Z", message: "Root cause identified: overly aggressive burst limit on new deployment." },
      { timestamp: "2026-10-13T22:10:00Z", message: "Reports of 429 errors from API consumers. Investigating." },
    ],
  },
];

const statusColors = {
  operational: { bg: "bg-success/15", text: "text-success-glow", border: "border-success/30", icon: CheckCircle, label: "Operational" },
  degraded: { bg: "bg-warning/15", text: "text-warning", border: "border-warning/30", icon: AlertTriangle, label: "Degraded Performance" },
  partial_outage: { bg: "bg-warning/15", text: "text-warning", border: "border-warning/30", icon: AlertCircle, label: "Partial Outage" },
  major_outage: { bg: "bg-destructive/15", text: "text-destructive", border: "border-destructive/30", icon: XCircle, label: "Major Outage" },
  maintenance: { bg: "bg-primary/15", text: "text-primary-glow", border: "border-primary/30", icon: RefreshCw, label: "Under Maintenance" },
};

const incidentStatusColors = {
  investigating: { bg: "bg-warning/15", text: "text-warning", border: "border-warning/30", label: "Investigating" },
  identified: { bg: "bg-warning/15", text: "text-warning", border: "border-warning/30", label: "Identified" },
  monitoring: { bg: "bg-primary/15", text: "text-primary-glow", border: "border-primary/30", label: "Monitoring" },
  resolved: { bg: "bg-success/15", text: "text-success-glow", border: "border-success/30", label: "Resolved" },
};

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

function getOverallStatus() {
  const statuses = services.map(s => s.status);
  if (statuses.includes("major_outage")) return "major_outage";
  if (statuses.includes("partial_outage")) return "partial_outage";
  if (statuses.includes("degraded")) return "degraded";
  if (statuses.includes("maintenance")) return "maintenance";
  return "operational";
}

export default function StatusPage() {
  const [now, setNow] = useState<Date | null>(null);

  // Legitimate pattern: initialize state and set up interval
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    setNow(new Date());
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const overallStatus = getOverallStatus();
  const overallColors = statusColors[overallStatus as keyof typeof statusColors];

  const formatRelativeTimeClient = (dateString: string) => {
    if (!now) return "...";
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="hero-gradient min-h-screen">
      <section className="section container" aria-labelledby="status-heading">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Activity className={`h-8 w-8 ${overallColors.text}`} aria-hidden="true" />
                <h1 id="status-heading" className="text-3xl sm:text-4xl font-bold text-foreground">
                  System Status
                </h1>
              </div>
              <div className="flex items-center gap-4">
                <Badge
                  variant="default"
                  className={`px-4 py-2 text-base ${overallColors.bg} ${overallColors.text} ${overallColors.border}`}
                >
                  <overallColors.icon className="h-4 w-4 mr-2" aria-hidden="true" />
                  All Systems {overallColors.label}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Last updated: <span id="last-updated" className="font-mono">Just now</span>
                </span>
              </div>
            </div>
            <Button variant="outline" size="lg" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
              Refresh
            </Button>
          </div>

          {/* Live Infrastructure Node Monitor */}
          <div className="mb-12">
            <FloatingNodeMonitor />
          </div>

          {/* Services Grid */}
          <section aria-labelledby="services-heading" className="mb-12">
            <h2 id="services-heading" className="text-2xl font-bold text-foreground mb-6">Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => {
                const colors = statusColors[service.status as keyof typeof statusColors];
                const Icon = service.icon;
                const StatusIcon = colors.icon;
                return (
                  <Card key={service.id} variant="base" padding="md" className={`${colors.border} transition-all duration-200 hover:${colors.border.replace("border-", "border-2 ")}`}>
                    <div className="flex items-start gap-4">
                      <div className={`flex-shrink-0 p-2 rounded-xl ${colors.bg}`}>
                        <Icon className={`h-5 w-5 ${colors.text}`} aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-foreground">{service.name}</h3>
                            <p className="text-sm text-muted-foreground mt-0.5">{service.description}</p>
                          </div>
                          <Badge
                            variant="default"
                            className={`${colors.bg} ${colors.text} ${colors.border}`}
                          >
                            <StatusIcon className="h-3 w-3 mr-1.5" aria-hidden="true" />
                            {colors.label}
                          </Badge>
                        </div>
                        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Uptime: <span className="text-foreground font-mono font-medium">{service.uptime}</span></span>
                          </div>
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Activity className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Latency: <span className="text-foreground font-mono font-medium">{service.responseTime}</span></span>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-border">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start gap-2"
                            asChild
                          >
                            <a href={service.url} target="_blank" rel="noopener noreferrer">
                              View Service
                              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>

          <Separator className="mb-12" />

          {/* Incident History */}
          <section aria-labelledby="incidents-heading">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6">
              <div>
                <h2 id="incidents-heading" className="text-2xl font-bold text-foreground">Incident History</h2>
                <p className="mt-1 text-muted-foreground">Recent incidents and maintenance events</p>
              </div>
            </div>
            <div className="space-y-4">
              {incidents.map((incident) => {
                const colors = incidentStatusColors[incident.status as keyof typeof incidentStatusColors];
                return (
                  <Card key={incident.id} variant="base" padding="md" className={`${colors.border}`}>
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground">{incident.title}</h3>
                            <Badge
                              variant="default"
                              className={`${colors.bg} ${colors.text} ${colors.border}`}
                            >
                              {colors.label}
                            </Badge>
                          </div>
                          <div className="flex-shrink-0 ml-auto text-sm text-muted-foreground whitespace-nowrap">
                            Started {formatRelativeTimeClient(incident.createdAt)}
                            {incident.status !== "resolved" && (
                              <>
                                <span className="mx-2">·</span>
                                Updated {formatRelativeTimeClient(incident.updatedAt)}
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-3">
                          <span>Affected: {incident.services.map(s => services.find(svc => svc.id === s)?.name || s).join(", ")}</span>
                          <span className="text-foreground">{incident.impact}</span>
                        </div>
                        <details className="group">
                          <summary className="flex items-center gap-2 text-sm text-primary cursor-pointer hover:text-primary-glow transition-colors">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                            View timeline ({incident.updates.length} updates)
                          </summary>
                          <div className="mt-4 ml-6 border-l-2 border-border pl-4 space-y-3">
                            {incident.updates.map((update, index) => (
                              <div key={index} className="relative">
                                <div className="absolute left-[-8px] top-1 w-2 h-2 rounded-full bg-primary" />
                                <p className="text-sm text-muted-foreground">{update.message}</p>
                                <time className="text-xs text-muted-foreground/60 block mt-0.5">{formatDate(update.timestamp)}</time>
                              </div>
                            ))}
                          </div>
                        </details>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>

          <Separator className="my-12" />

          {/* Uptime Summary */}
          <section aria-labelledby="uptime-heading" className="mb-12">
            <h2 id="uptime-heading" className="text-2xl font-bold text-foreground mb-6">Uptime Summary (Last 90 Days)</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((service) => (
                <Card key={`uptime-${service.id}`} variant="base" padding="md" className="text-center">
                  <div className="text-4xl font-bold text-primary mb-1">{service.uptime}</div>
                  <div className="text-sm text-muted-foreground mb-3">{service.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Avg response: <span className="text-foreground font-mono font-medium">{service.responseTime}</span>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Footer Links */}
          <div className="glass rounded-2xl p-6 text-center">
            <p className="text-muted-foreground mb-4">
              Subscribe to status updates via
              <a href="/api/status/feed" className="text-primary hover:text-primary-glow underline ml-1">RSS</a>
              or
              <a href="/api/status/json" className="text-primary hover:text-primary-glow underline ml-1">JSON API</a>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <span>Not experiencing an issue listed here?</span>
              <Button variant="ghost" size="sm" asChild>
                <a href="https://github.com/adityakashyap7047/notixnode/issues/new" target="_blank" rel="noopener noreferrer">
                  Report an Issue
                  <ExternalLink className="h-3.5 w-3.5 ml-1" aria-hidden="true" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="https://discord.gg/8NPerTzmKR" target="_blank" rel="noopener noreferrer">
                  Join Discord
                  <ExternalLink className="h-3.5 w-3.5 ml-1" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}