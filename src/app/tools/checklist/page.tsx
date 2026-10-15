"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/Separator";
import { CheckCircle, AlertCircle, Info, ChevronDown, ChevronUp, Download, Copy, Check, AlertTriangle, Shield, Zap, Database, Network, Users, Code, Lock, Cloud, Monitor, Wrench } from "lucide-react";

const checklistCategories = [
  {
    id: "security",
    name: "Security & Access Control",
    icon: Shield,
    items: [
      { id: "online-mode", title: "Online Mode Enforced", description: "verify online-mode=true in server.properties", critical: true },
      { id: "whitelist", title: "Whitelist Configured", description: "Enable whitelist for private/beta servers", critical: false },
      { id: "rcon", title: "RCON Secured", description: "Strong password, non-default port, firewall restricted", critical: true },
      { id: "proxy", title: "Proxy Protection", description: "Velocity/BungeeCord with modern forwarding, prevent-proxy-connections", critical: true },
      { id: "op-list", title: "OP List Reviewed", description: "Minimal OPs, no default OP permission", critical: true },
      { id: "permissions", title: "Permission Plugin Configured", description: "LuckPerms with principle of least privilege", critical: true },
      { id: "console", title: "Console Access Restricted", description: "Panel/SSH keys only, no password auth", critical: true },
    ],
  },
  {
    id: "performance",
    name: "Performance & Optimization",
    icon: Zap,
    items: [
      { id: "view-distance", title: "View Distance Optimized", description: "6-8 for Paper, 5-6 for Folia, 10 for vanilla", critical: true },
      { id: "sim-distance", title: "Simulation Distance Set", description: "Match or lower than view distance", critical: true },
      { id: "entity-range", title: "Entity Broadcast Range", description: "70-80% to reduce packet spam", critical: true },
      { id: "spawn-limits", title: "Mob Spawn Limits Tuned", description: "Lower for high-pop servers (monsters: 30-50)", critical: true },
      { id: "tick-time", title: "Max Tick Time Disabled", description: "max-tick-time=-1 for Paper/Folia", critical: true },
      { id: "compression", title: "Network Compression", description: "256-512 bytes threshold", critical: false },
      { id: "timings", title: "Timings/Reports Enabled", description: "Paper timings, Spark profiler ready", critical: false },
      { id: "gc", title: "JVM GC Tuned", description: "G1GC/ZGC with appropriate heap flags", critical: true },
      { id: "ram", title: "RAM Allocation Correct", description: "-Xms = -Xms, leave 1-2GB for OS", critical: true },
    ],
  },
  {
    id: "world",
    name: "World & Data Management",
    icon: Database,
    items: [
      { id: "backups", title: "Automated Backups", description: "Daily world backups, 7+ day retention, off-site copy", critical: true },
      { id: "backup-test", title: "Backup Restore Tested", description: "Verify restore procedure works quarterly", critical: true },
      { id: "world-border", title: "World Border Set", description: "Prevent chunk generation runaway", critical: false },
      { id: "pregen", title: "Chunks Pre-generated", description: "Use Chunky or similar for 5k-10k radius", critical: false },
      { id: "logs", title: "Log Rotation Configured", description: "Daily rotation, 30-day retention, structured logging", critical: false },
      { id: "database", title: "External Database", description: "MariaDB/PostgreSQL for plugins (not SQLite)", critical: true },
      { id: "db-backups", title: "Database Backups", description: "Separate from world backups, point-in-time recovery", critical: true },
    ],
  },
  {
    id: "network",
    name: "Network & Infrastructure",
    icon: Network,
    items: [
      { id: "ddos", title: "DDoS Protection Active", description: "Cloudflare Spectrum, TCPShield, or host-level", critical: true },
      { id: "firewall", title: "Firewall Rules", description: "Only required ports open (25565, 25575, 80/443 for web)", critical: true },
      { id: "srv-record", title: "SRV Record Configured", description: "For non-standard ports or proxy setups", critical: false },
      { id: "domain", title: "Domain & SSL", description: "Valid TLS for website/panel, HSTS enabled", critical: false },
      { id: "monitoring", title: "Uptime Monitoring", description: "External checks (UptimeRobot, BetterStack, etc.)", critical: true },
      { id: "alerts", title: "Alert Channels Configured", description: "Discord/email/pager for critical events", critical: true },
    ],
  },
  {
    id: "gameplay",
    name: "Gameplay & Configuration",
    icon: Users,
    items: [
      { id: "rules", title: "Rules Published", description: "Clear, accessible, enforced consistently", critical: true },
      { id: "anti-cheat", title: "Anti-Cheat Installed", description: "Vulcan, AAC, or Paper built-in with tuning", critical: true },
      { id: "chat-filter", title: "Chat Filter/Moderation", description: "DiscordSRV sync, word filter, report system", critical: false },
      { id: "economy", title: "Economy Balanced", description: "No inflation exploits, shop prices reviewed", critical: false },
      { id: "plugins", title: "Plugin Versions Current", description: "All plugins updated, incompatible removed", critical: true },
      { id: "config-audit", title: "Config Audit Complete", description: "No default configs exposing admin features", critical: true },
    ],
  },
  {
    id: "compliance",
    name: "Legal & Compliance",
    icon: Lock,
    items: [
      { id: "eula", title: "EULA Accepted", description: "eula.txt = true, Mojang EULA compliance", critical: true },
      { id: "privacy", title: "Privacy Policy", description: "GDPR/CCPA compliant if collecting data", critical: true },
      { id: "tos", title: "Terms of Service", description: "Clear rules, ban appeal process, liability limits", critical: false },
      { id: "age-rating", title: "Age Rating Displayed", description: "ESRB/PEGI or custom rating visible", critical: false },
      { id: "data-request", title: "Data Request Process", description: "30-day response for GDPR Article 15", critical: true },
      { id: "brand", title: "Mojang Brand Guidelines", description: "No 'Official' claims, proper attribution", critical: true },
    ],
  },
  {
    id: "launch",
    name: "Pre-Launch Validation",
    icon: Cloud,
    items: [
      { id: "test-join", title: "Test Join Successful", description: "Local and external connections work", critical: true },
      { id: "test-perms", title: "Permissions Verified", description: "Default group, ranks, commands tested", critical: true },
      { id: "test-econ", title: "Economy Functional", description: "Balance, pay, shop, withdraw/deposit", critical: false },
      { id: "test-chat", title: "Chat & Discord Sync", description: "Formatting, channels, verification flow", critical: false },
      { id: "test-world", title: "World Loads Cleanly", description: "No chunk errors, spawn safe, structures generate", critical: true },
      { id: "test-backup", title: "Backup Runs Successfully", description: "Manual trigger completes without errors", critical: true },
      { id: "staff-brief", title: "Staff Briefed", description: "Launch timeline, escalation contacts, procedures", critical: true },
      { id: "rollout", title: "Rollout Plan Ready", description: "Soft launch → beta → public with checkpoints", critical: false },
    ],
  },
];

export default function ChecklistPage() {
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    security: true, performance: true, world: true, network: true, gameplay: true, compliance: true, launch: true,
  });

  const toggleItem = (id: string) => {
    setCompleted(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleCategory = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const totalItems = checklistCategories.reduce((sum, cat) => sum + cat.items.length, 0);
  const completedCount = Object.values(completed).filter(Boolean).length;
  const criticalItems = checklistCategories.flatMap(c => c.items.filter(i => i.critical).map(i => i.id));
  const criticalCompleted = criticalItems.filter(id => completed[id]).length;

  const exportChecklist = () => {
    let output = "# Server Launch Checklist\n";
    output += `# Generated: ${new Date().toISOString()}\n`;
    output += `# Progress: ${completedCount}/${totalItems} (${Math.round(completedCount/totalItems*100)}%)\n`;
    output += `# Critical: ${criticalCompleted}/${criticalItems.length}\n\n`;

    checklistCategories.forEach(cat => {
      output += `## ${cat.name}\n`;
      cat.items.forEach(item => {
        const done = completed[item.id] ? "[x]" : "[ ]";
        const crit = item.critical ? " ⚠️ CRITICAL" : "";
        output += `- ${done} ${item.title}${crit}\n  ${item.description}\n`;
      });
      output += "\n";
    });

    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "server-launch-checklist.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyProgress = async () => {
    const text = `Server Launch Checklist: ${completedCount}/${totalItems} complete (${Math.round(completedCount/totalItems*100)}%). Critical: ${criticalCompleted}/${criticalItems.length}.`;
    await navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen">
      <section className="section container" aria-labelledby="checklist-heading">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 id="checklist-heading" className="text-3xl sm:text-4xl font-bold text-foreground">Server Launch Checklist</h1>
              <p className="mt-2 text-muted-foreground">Interactive pre-launch checklist covering security, performance, compliance, and monitoring.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={copyProgress} aria-label="Copy progress">
                <Copy className="h-4 w-4 mr-2" aria-hidden="true" />
                Copy Progress
              </Button>
              <Button variant="secondary" onClick={exportChecklist} aria-label="Download checklist">
                <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                Download Markdown
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-8">
            <Card variant="glass-strong" padding="md" className="text-center">
              <div className="text-3xl font-bold text-foreground">{completedCount}/{totalItems}</div>
              <div className="text-sm text-muted-foreground">Tasks Complete</div>
              <div className="mt-2 h-2 bg-card rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-300" style={{ width: `${Math.max(1, completedCount/totalItems*100)}%` }} />
              </div>
            </Card>
            <Card variant="glass-strong" padding="md" className="text-center">
              <div className="text-3xl font-bold text-success">{criticalCompleted}/{criticalItems.length}</div>
              <div className="text-sm text-muted-foreground">Critical Items Done</div>
              <div className="mt-2 h-2 bg-card rounded-full overflow-hidden">
                <div className="h-full bg-success transition-all duration-300" style={{ width: `${Math.max(1, criticalCompleted/criticalItems.length*100)}%` }} />
              </div>
            </Card>
            <Card variant="glass-strong" padding="md" className="text-center">
              <div className="text-3xl font-bold text-primary">{Math.round(completedCount/totalItems*100)}%</div>
              <div className="text-sm text-muted-foreground">Overall Progress</div>
              <div className="mt-2 h-2 bg-card rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-300" style={{ width: `${Math.max(1, completedCount/totalItems*100)}%` }} />
              </div>
            </Card>
          </div>

          <div className="space-y-4" role="list" aria-label="Checklist categories">
            {checklistCategories.map(cat => {
              const Icon = cat.icon;
              const catCompleted = cat.items.filter(i => completed[i.id]).length;
              const catTotal = cat.items.length;
              const catCritical = cat.items.filter(i => i.critical).length;
              const catCriticalDone = cat.items.filter(i => i.critical && completed[i.id]).length;

              return (
                <Card key={cat.id} variant="glass-strong" padding="lg" role="listitem">
                  <CardHeader className="flex flex-row items-center justify-between cursor-pointer" onClick={() => toggleCategory(cat.id)}>
                    <div className="flex items-center gap-3">
                      <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                      <div>
                        <CardTitle>{cat.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{catCompleted}/{catTotal} • {catCriticalDone}/{catCritical} critical</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={catCriticalDone === catCritical && catCritical > 0 ? "free" : "version"}>
                        {catCriticalDone}/{catCritical} Critical
                      </Badge>
                      {expanded[cat.id] ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                    </div>
                  </CardHeader>

                  {expanded[cat.id] && (
                    <CardContent className="space-y-3 pt-4 border-t border-border">
                      {cat.items.map(item => (
                        <div key={item.id} className="flex items-start gap-4 p-4 bg-card/50 rounded-xl hover:bg-card transition-colors">
                          <button
                            onClick={() => toggleItem(item.id)}
                            className={`flex-shrink-0 mt-1 ${
                              completed[item.id]
                                ? "text-success"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                            aria-pressed={completed[item.id]}
                            aria-label={item.title}
                          >
                            {completed[item.id] ? (
                              <CheckCircle className="h-6 w-6" aria-hidden="true" />
                            ) : item.critical ? (
                              <AlertCircle className="h-6 w-6 text-destructive" aria-hidden="true" />
                            ) : (
                              <AlertCircle className="h-6 w-6" aria-hidden="true" />
                            )}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-foreground">{item.title}</h4>
                              {item.critical && <Badge variant="version" className="text-xs">Critical</Badge>}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  )}
                </Card>
              );
            })}
          </div>

          <Card variant="glass" padding="lg" className="mt-8">
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>• Complete all critical items before public launch</p>
              <p>• Schedule a soft launch with trusted players for final validation</p>
              <p>• Document any deferred items with target completion dates</p>
              <p>• Set up recurring checklist reviews (monthly recommended)</p>
              <p>• Share this checklist with your admin team</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}