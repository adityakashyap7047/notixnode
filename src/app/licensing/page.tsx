import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/Separator";
import { FileText, CheckCircle, XCircle, Shield, Code, Globe, Download, Lock, AlertTriangle, Info } from "lucide-react";

const licenseTypes = [
  {
    id: "mit",
    name: "MIT License",
    badge: "Permissive",
    color: "text-success",
    description: "Short, permissive license. Allows commercial use, modification, distribution, and private use. Requires license and copyright notice preservation.",
    permissions: ["Commercial Use", "Modification", "Distribution", "Private Use"],
    limitations: ["No Liability", "No Warranty"],
    conditions: ["Include License", "Include Copyright"],
    commonFor: "Code libraries, plugins, configurations, developer tools",
  },
  {
    id: "apache-2",
    name: "Apache License 2.0",
    badge: "Permissive",
    color: "text-success",
    description: "Permissive license with patent grant. Similar to MIT but includes explicit patent protection and requires change notices.",
    permissions: ["Commercial Use", "Modification", "Distribution", "Private Use", "Patent Use"],
    limitations: ["No Liability", "No Warranty", "No Trademark Use"],
    conditions: ["Include License", "Include Copyright", "State Changes", "Include NOTICE"],
    commonFor: "Larger projects, plugin frameworks, server software",
  },
  {
    id: "gpl-3",
    name: "GNU GPL v3.0",
    badge: "Copyleft",
    color: "text-warning",
    description: "Strong copyleft. Derivative works must be licensed under GPL. Source code must be made available. Not compatible with proprietary plugins.",
    permissions: ["Commercial Use", "Modification", "Distribution", "Private Use"],
    limitations: ["No Liability", "No Warranty"],
    conditions: ["Include License", "Include Copyright", "State Changes", "Disclose Source", "Same License (Viral)"],
    commonFor: "Standalone applications, some server software",
  },
  {
    id: "lgpl-3",
    name: "GNU LGPL v3.0",
    badge: "Weak Copyleft",
    color: "text-warning",
    description: "Allows linking from proprietary code. Library itself must remain open source. Used for libraries that can be used by closed-source plugins.",
    permissions: ["Commercial Use", "Modification", "Distribution", "Private Use", "Link from Proprietary"],
    limitations: ["No Liability", "No Warranty"],
    conditions: ["Include License", "Include Copyright", "State Changes", "Disclose Source (Library)", "Same License (Library)"],
    commonFor: "API libraries, wrapper libraries, shared utilities",
  },
  {
    id: "cc-by-4",
    name: "Creative Commons BY 4.0",
    badge: "Attribution",
    color: "text-primary",
    description: "For creative works (maps, textures, graphics, documents). Requires attribution. Allows commercial use and adaptation.",
    permissions: ["Commercial Use", "Modification", "Distribution", "Private Use"],
    limitations: ["No Liability", "No Warranty"],
    conditions: ["Include License", "Give Attribution", "Indicate Changes"],
    commonFor: "Maps, builds, resource packs, graphics, tutorials, documentation",
  },
  {
    id: "cc-by-sa-4",
    name: "Creative Commons BY-SA 4.0",
    badge: "ShareAlike",
    color: "text-warning",
    description: "Like CC-BY but adaptations must share the same license. Viral for creative works.",
    permissions: ["Commercial Use", "Modification", "Distribution", "Private Use"],
    limitations: ["No Liability", "No Warranty"],
    conditions: ["Include License", "Give Attribution", "Indicate Changes", "Same License (Adaptations)"],
    commonFor: "Collaborative maps, community resource packs",
  },
  {
    id: "cc0",
    name: "CC0 (Public Domain)",
    badge: "Public Domain",
    color: "text-muted-foreground",
    description: "No rights reserved. Dedicated to public domain. No attribution required. Maximum freedom.",
    permissions: ["Commercial Use", "Modification", "Distribution", "Private Use", "No Attribution Required"],
    limitations: ["No Liability", "No Warranty"],
    conditions: ["None"],
    commonFor: "Small snippets, example configs, placeholder assets",
  },
  {
    id: "notixnode-premium",
    name: "NOTIXNODE Premium License",
    badge: "Commercial",
    color: "text-primary",
    description: "Custom license for Premium tier resources. Grants commercial use on your servers. No redistribution as standalone products.",
    permissions: ["Commercial Use (Your Servers)", "Modification", "Private Use", "Team Use (Per Seat)"],
    limitations: ["No Redistribution", "No Resale", "No Standalone Products", "No Attribution Required"],
    conditions: ["Active Subscription", "Per Server/Network"],
    commonFor: "Premium-exclusive configs, maps, graphics, tutorials with source",
  },
];

const freeTierRights = [
  { right: "Use on personal/non-commercial servers", allowed: true },
  { right: "Modify configurations for your use", allowed: true },
  { right: "Share with your server staff team", allowed: true },
  { right: "Use on commercial/revenue servers", allowed: false, note: "Requires Premium or resource-specific license" },
  { right: "Redistribute as part of a pack", allowed: false, note: "Link to NOTIXNODE instead" },
  { right: "Sell or resell resources", allowed: false },
  { right: "Remove license/copyright notices", allowed: false },
  { right: "Claim as your own work", allowed: false },
];

const premiumTierRights = [
  { right: "All Free tier rights", allowed: true },
  { right: "Use on commercial/revenue servers", allowed: true },
  { right: "Use source code in your projects", allowed: true },
  { right: "Team access (per seat limits)", allowed: true },
  { right: "No attribution required", allowed: true },
  { right: "Redistribute as standalone product", allowed: false },
  { right: "Resell resources", allowed: false },
  { right: "Remove license files", allowed: false },
  { right: "Claim as your own work", allowed: false },
];

export default function LicensingPage() {
  return (
    <div className="min-h-screen">
      <section className="section container" aria-labelledby="licensing-heading">
        <div className="max-w-5xl mx-auto">
          <header className="mb-12 text-center">
            <h1 id="licensing-heading" className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Licensing Guide</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Understand how you can use NOTIXNODE resources. Each resource includes its specific license file — this page explains the common licenses we use.
            </p>
          </header>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Free vs Premium Rights</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card variant="glass-strong" padding="lg">
                <CardHeader>
                  <CardTitle>Free Tier</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {freeTierRights.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      {item.allowed ? (
                        <CheckCircle className="h-5 w-5 text-success flex-shrink-0" aria-hidden="true" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive flex-shrink-0" aria-hidden="true" />
                      )}
                      <span className="text-sm text-muted-foreground">{item.right}</span>
                      {item.note && <span className="text-xs text-primary ml-auto">{item.note}</span>}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card variant="glass-strong" padding="lg" className="ring-2 ring-primary/30">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Premium Tier</CardTitle>
                    <Badge variant="premium">Included</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {premiumTierRights.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      {item.allowed ? (
                        <CheckCircle className="h-5 w-5 text-success flex-shrink-0" aria-hidden="true" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive flex-shrink-0" aria-hidden="true" />
                      )}
                      <span className="text-sm text-muted-foreground">{item.right}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>

          <Separator className="mb-12" />

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Common Licenses Used</h2>
            <p className="text-muted-foreground mb-8">Each resource on NOTIXNODE includes a LICENSE file. Here are the licenses you'll encounter most often:</p>

            <div className="space-y-6">
              {licenseTypes.map((license, i) => (
                <Card key={license.id} variant="interactive" padding="lg">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex-shrink-0 p-3 bg-primary/10 rounded-xl text-primary">
                      <FileText className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-foreground">{license.name}</h3>
                        <Badge variant="version" className={license.color}>{license.badge}</Badge>
                      </div>
                      <p className="text-muted-foreground">{license.description}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 text-sm">
                    <div>
                      <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" aria-hidden="true" />
                        Permissions
                      </h4>
                      <ul className="space-y-1 text-muted-foreground">
                        {license.permissions.map((p, pi) => <li key={pi} className="flex items-center gap-1">• {p}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-destructive" aria-hidden="true" />
                        Limitations
                      </h4>
                      <ul className="space-y-1 text-muted-foreground">
                        {license.limitations.map((l, li) => <li key={li} className="flex items-center gap-1">• {l}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                        <Info className="h-4 w-4 text-primary" aria-hidden="true" />
                        Conditions
                      </h4>
                      <ul className="space-y-1 text-muted-foreground">
                        {license.conditions.map((c, ci) => <li key={ci} className="flex items-center gap-1">• {c}</li>)}
                      </ul>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-card rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground"><strong>Common for:</strong> {license.commonFor}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Separator className="mb-12" />

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Quick Reference</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Card variant="glass" padding="md">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="h-5 w-5 text-success" aria-hidden="true" />
                  <h3 className="font-semibold text-foreground">Always Allowed</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Personal/educational use</li>
                  <li>• Modification for your server</li>
                  <li>• Sharing with your staff</li>
                  <li>• Learning from source code</li>
                </ul>
              </Card>
              <Card variant="glass" padding="md">
                <div className="flex items-center gap-3 mb-3">
                  <AlertTriangle className="h-5 w-5 text-warning" aria-hidden="true" />
                  <h3 className="font-semibold text-foreground">Check First</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Commercial server use</li>
                  <li>• Including in modpacks</li>
                  <li>• Public redistribution</li>
                  <li>• Attribution requirements</li>
                </ul>
              </Card>
              <Card variant="glass" padding="md">
                <div className="flex items-center gap-3 mb-3">
                  <XCircle className="h-5 w-5 text-destructive" aria-hidden="true" />
                  <h3 className="font-semibold text-foreground">Never Allowed</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Selling resources as-is</li>
                  <li>• Claiming authorship</li>
                  <li>• Removing license files</li>
                  <li>• Using for illegal purposes</li>
                </ul>
              </Card>
            </div>
          </div>

          <Separator className="mb-12" />

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Third-Party Resources</h2>
            <Card variant="glass" padding="lg">
              <div className="prose prose-invert max-w-none text-muted-foreground">
                <p>Some NOTIXNODE resources link to external projects (SpigotMC, BuiltByBit, Modrinth, etc.). These resources are governed by their own licenses, which may differ from NOTIXNODE's standard licenses.</p>
                <p><strong>Always check the source repository's LICENSE file before use.</strong> NOTIXNODE does not control or modify third-party licenses.</p>
                <ul>
                  <li>External links are marked with an "External" badge</li>
                  <li>We verify licenses at time of listing but cannot guarantee future compliance</li>
                  <li>Report licensing concerns to <a href="mailto:legal@notixnode.com" className="link-underline">legal@notixnode.com</a></li>
                </ul>
              </div>
            </Card>
          </div>

          <Separator className="mb-12" />

          <Card variant="glass-strong" padding="lg" className="text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Need Clarification?</h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              Licensing can be complex. If you're unsure about how a license applies to your use case, reach out to our legal team.
            </p>
            <a href="mailto:legal@notixnode.com" className="btn-primary inline-flex">
              Email legal@notixnode.com
            </a>
            <p className="mt-4 text-sm text-muted-foreground">
              This page is for informational purposes only and does not constitute legal advice.
              Consult an attorney for advice on your specific situation.
            </p>
          </Card>
        </div>
      </section>
    </div>
  );
}