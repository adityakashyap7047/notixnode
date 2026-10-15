"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Wrench, ChevronRight, CheckCircle, Clock, AlertTriangle, ExternalLink } from "lucide-react";

const tools = [
  {
    name: "MOTD Previewer",
    description: "Real-time MOTD editor with legacy, JSON, and MiniMessage support. Live preview for Java and Bedrock editions.",
    status: "ready",
    href: "/tools/motd",
    features: ["Legacy & MiniMessage", "JSON Format Support", "Bedrock Preview", "Export Ready"],
  },
  {
    name: "Rank Prefix Previewer",
    description: "Visual prefix/suffix builder with gradient, hex, and legacy color support. Export directly to LuckPerms YAML.",
    status: "ready",
    href: "/tools/prefix",
    features: ["Gradient Builder", "Hex & Legacy Colors", "LuckPerms Export", "Live Preview"],
  },
  {
    name: "Server Properties Generator",
    description: "Interactive server.properties generator with explanations, presets for Paper/Spigot/Folia, and validation.",
    status: "ready",
    href: "/tools/properties",
    features: ["Paper/Folia Presets", "Setting Explanations", "Validation", "One-Click Copy"],
  },
  {
    name: "LuckPerms Permission Planner",
    description: "Visual permission tree editor. Plan ranks, groups, inheritance, and export commands before applying to your server.",
    status: "ready",
    href: "/tools/luckperms-planner",
    features: ["Visual Tree Editor", "Context Planning", "Group Management", "Export to YAML"],
  },
  {
    name: "Server Launch Checklist",
    description: "Interactive pre-launch checklist covering security, performance, compliance, and monitoring setup.",
    status: "ready",
    href: "/tools/checklist",
    features: ["Security Audit", "Performance Tuning", "Compliance Checks", "Progress Tracking"],
  },
  {
    name: "Server Resource Calculator",
    description: "Estimate RAM, CPU, and storage needs based on player count, plugins, world size, and modpacks.",
    status: "ready",
    href: "/tools/calculator",
    features: ["RAM Estimation", "CPU Planning", "Storage Calculation", "Plugin Impact"],
  },
  {
    name: "Compatibility Matrix",
    description: "Cross-compatibility lookup matching Minecraft updates with server software (Paper, Purpur, Folia, Velocity) and Java versions.",
    status: "ready",
    href: "/tools/compatibility-helper",
    features: ["Java Compatibility", "Server Software", "Version History", "EOL Guidance"],
  },
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen">
      <section className="section container" aria-labelledby="tools-heading">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 id="tools-heading" className="text-3xl sm:text-4xl font-bold text-foreground">Developer Tools</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Built-in utilities to streamline your server development workflow. All tools run entirely in your browser — no data leaves your device.
          </p>
        </div>

        <div className="grid-auto-fit" role="list" aria-label="Developer tools">
          {tools.map((tool) => (
            <article key={tool.name} className={tool.status === "planned" ? "card-base p-6 opacity-60" : "card-interactive p-6"} role="listitem">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 p-3 bg-primary/10 rounded-xl text-primary">
                  <Wrench className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground">{tool.name}</h3>
                    {tool.status === "planned" && <Badge variant="version">Planned</Badge>}
                    {tool.status === "ready" && <Badge variant="free">Ready</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{tool.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {tool.features.map((feature, i) => (
                      <Badge key={i} variant="external" className="text-xs">{feature}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              {tool.status === "ready" ? (
                <Button variant="primary" className="w-full" asChild>
                  <Link href={tool.href}>Open Tool <ChevronRight className="h-4 w-4 ml-1" aria-hidden="true" /></Link>
                </Button>
              ) : (
                <Button variant="ghost" className="w-full" disabled>
                  Coming Soon
                </Button>
              )}
            </article>
          ))}
        </div>

        <section className="mt-16" aria-labelledby="tools-note-heading">
          <h2 id="tools-note-heading" className="text-xl font-semibold text-foreground mb-4">About These Tools</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card variant="glass" padding="md">
              <CheckCircle className="h-6 w-6 text-success mb-3" aria-hidden="true" />
              <h3 className="font-semibold text-foreground mb-2">Client-Side Only</h3>
              <p className="text-sm text-muted-foreground">All tools run in your browser. No configuration data is sent to our servers.</p>
            </Card>
            <Card variant="glass" padding="md">
              <Clock className="h-6 w-6 text-primary mb-3" aria-hidden="true" />
              <h3 className="font-semibold text-foreground mb-2">No Installation</h3>
              <p className="text-sm text-muted-foreground">Use immediately without downloads, accounts, or setup. Works offline after first load.</p>
            </Card>
            <Card variant="glass" padding="md">
              <ExternalLink className="h-6 w-6 text-warning mb-3" aria-hidden="true" />
              <h3 className="font-semibold text-foreground mb-2">Open Source</h3>
              <p className="text-sm text-muted-foreground">Tool logic is open source. Contribute or audit on our GitHub repository.</p>
            </Card>
          </div>
        </section>
      </section>
    </div>
  );
}