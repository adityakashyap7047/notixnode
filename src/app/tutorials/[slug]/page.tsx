"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import {
  ArrowLeft,
  Clock,
  BookOpen,
  CheckCircle,
  Copy,
  ExternalLink,
  Share2,
  Server,
  Shield,
  Zap,
  Code,
  AlertTriangle,
} from "lucide-react";
import { useState } from "react";

interface TutorialArticle {
  title: string;
  category: string;
  readTime: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  type: "free" | "premium";
  description: string;
  updated: string;
  author: string;
  prerequisites: string[];
  sections: {
    heading: string;
    content: string;
    codeSnippet?: {
      filename: string;
      language: string;
      code: string;
    };
    callout?: {
      type: "tip" | "warning" | "note";
      text: string;
    };
  }[];
}

const tutorialsData: Record<string, TutorialArticle> = {
  "velocity-paper-network": {
    title: "Setting Up a Velocity + Paper Network from Scratch",
    category: "Server Setup",
    readTime: "15 min",
    difficulty: "Intermediate",
    type: "free",
    description: "Complete guide to deploying a high-throughput Velocity proxy with multiple Paper backend servers using modern player info forwarding and cross-server messaging.",
    updated: "2024-12-10",
    author: "NOTIXNODE Infrastructure Team",
    prerequisites: [
      "Java 21 runtime installed on all server nodes",
      "Velocity 3.3.0+ proxy build downloaded",
      "Paper 1.21.1+ server jar downloaded",
      "Basic understanding of port binding (25565, 25566, 25567)",
    ],
    sections: [
      {
        heading: "1. Understanding Modern Forwarding",
        content: "Velocity uses modern forwarding with a shared secret to securely pass player UUIDs, skins, and IP addresses to backend Paper instances. Unlike legacy BungeeCord IP-forwarding, Velocity's modern forwarding cannot be spoofed by malicious clients connecting directly to backend ports.",
        callout: {
          type: "tip",
          text: "Never expose backend Paper server ports (e.g., 25566, 25567) to the public internet. Bind them to 127.0.0.1 or configure UFW/iptables firewall rules to accept traffic strictly from the Velocity proxy IP.",
        },
      },
      {
        heading: "2. Configuring velocity.toml",
        content: "Open velocity.toml in your proxy root folder. Configure the bind address, forwarding secret, and declare your backend server routes.",
        codeSnippet: {
          filename: "velocity.toml",
          language: "toml",
          code: `# Velocity Proxy Configuration
bind = "0.0.0.0:25565"
motd = "<#00F5D4>NOTIXNODE Network <gray>| <white>1.21.1 Survival & Lobbies"
show-max-players = 500
player-info-forwarding-mode = "modern"
forwarding-secret-file = "forwarding.secret"

[servers]
lobby = "127.0.0.1:25566"
survival = "127.0.0.1:25567"

[forced-hosts]
"lobby.notixnode.dev" = ["lobby"]
"survival.notixnode.dev" = ["survival"]

try = [
  "lobby"
]`,
        },
      },
      {
        heading: "3. Configuring Backend Paper Instances",
        content: "In every backend Paper directory, edit config/paper-global.yml. Enable Velocity forwarding and paste the exact contents of forwarding.secret.",
        codeSnippet: {
          filename: "config/paper-global.yml",
          language: "yaml",
          code: `proxies:
  velocity:
    enabled: true
    online-mode: true
    secret: "PASTE_YOUR_FORWARDING_SECRET_HERE"`,
        },
        callout: {
          type: "warning",
          text: "Ensure 'online-mode' is set to false in server.properties on backend Paper instances. The Velocity proxy handles Mojang authentication at the gateway.",
        },
      },
      {
        heading: "4. Verification & Testing",
        content: "Start the Velocity proxy first, followed by the Paper instances. Connect through localhost:25565 and run '/server survival'. Verify your tablist, skins, and ping rates transfer cleanly without dropped packets.",
      },
    ],
  },
  "luckperms-masterclass": {
    title: "LuckPerms Masterclass: Contexts, Tracks, and Migration",
    category: "Permissions",
    readTime: "22 min",
    difficulty: "Advanced",
    type: "free",
    description: "Deep dive into LuckPerms enterprise features: weight hierarchies, multi-server network contexts, inheritance ladders, and zero-downtime migration.",
    updated: "2024-12-05",
    author: "NOTIXNODE Security Team",
    prerequisites: [
      "LuckPerms v5.4.100+ installed",
      "Network proxy or multi-world server setup",
      "Access to server console or in-game op",
    ],
    sections: [
      {
        heading: "1. Structuring Weight Hierarchies",
        content: "LuckPerms resolves conflicting permissions based on group weights. Higher weights take precedence over lower weights.",
        codeSnippet: {
          filename: "luckperms_setup.sh",
          language: "bash",
          code: `# Create core hierarchy with explicit weights
/lp creategroup default
/lp group default setweight 10
/lp group default permission set essentials.build true

/lp creategroup vip
/lp group vip setweight 50
/lp group vip parent add default
/lp group vip permission set essentials.fly true

/lp creategroup admin
/lp group admin setweight 1000
/lp group admin parent add vip
/lp group admin permission set '*' true`,
        },
      },
      {
        heading: "2. Leveraging Contexts for Network Scoping",
        content: "Contexts allow you to assign permissions or prefixes that only activate on specific servers or worlds, preventing donor perks on survival from leaking into minigame servers.",
        codeSnippet: {
          filename: "luckperms_contexts.sh",
          language: "bash",
          code: `# Give VIP flight only on the creative server
/lp group vip permission set essentials.fly true server=creative

# Give builder rank WorldEdit access strictly in plot worlds
/lp group builder permission set worldedit.* true world=plots`,
        },
      },
    ],
  },
  "paper-optimization": {
    title: "Optimizing PaperMC for 500+ Concurrent Players",
    category: "Performance",
    readTime: "18 min",
    difficulty: "Advanced",
    type: "free",
    description: "Battle-tested tuning guidelines for tick rates, entity tick ranges, Redstone engines, and memory allocation under extreme player counts.",
    updated: "2024-11-28",
    author: "NOTIXNODE Performance Lab",
    prerequisites: [
      "Paper 1.21+ or Purpur build",
      "Spark profiler installed (/spark)",
      "Dedicated CPU with strong single-thread performance (Ryzen 7950X / Intel 14900K)",
    ],
    sections: [
      {
        heading: "1. Recommended JVM Flags (Aikar's Flags)",
        content: "Proper garbage collection configuration avoids stop-the-world pauses that cause noticeable server lag.",
        codeSnippet: {
          filename: "start.sh",
          language: "bash",
          code: `java -Xms12G -Xmx12G -XX:+UseG1GC -XX:+ParallelRefProcEnabled \\
-XX:MaxGCPauseMillis=200 -XX:+UnlockExperimentalVMOptions \\
-XX:+DisableExplicitGC -XX:+AlwaysPreTouch -XX:G1NewSizePercent=30 \\
-XX:G1MaxNewSizePercent=40 -XX:G1ReservePercent=20 \\
-XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 \\
-XX:InitiatingHeapOccupancyPercent=15 -XX:G1MixedGCLiveThresholdPercent=90 \\
-XX:G1RSetUpdatingPauseTimePercent=5 -XX:SurvivorRatio=32 \\
-XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 \\
-Dusing.aikars.flags=https://mcflags.emc.gs -Daikars.new.flags=true \\
-jar paper.jar --nogui`,
        },
      },
    ],
  },
  "custom-items": {
    title: "Creating Custom Items with items.yml (No Code)",
    category: "Development",
    readTime: "12 min",
    difficulty: "Beginner",
    type: "free",
    description: "Step-by-step tutorial on building custom swords, tools, and consumables with custom model data, lore formatting, and attribute modifiers.",
    updated: "2024-11-15",
    author: "NOTIXNODE Team",
    prerequisites: [
      "ItemsAdder or Oraxen or Vanilla Resource Pack",
      "Minecraft 1.20.4 or 1.21.1",
    ],
    sections: [
      {
        heading: "1. CustomModelData Schema",
        content: "Modern Minecraft allows linking unique texture models to existing items using the CustomModelData tag without modifying the base game jar.",
      },
    ],
  },
};

export default function TutorialDetailPage() {
  const params = useParams();
  const slug = (params.slug as string) || "velocity-paper-network";
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const tutorial = tutorialsData[slug] || {
    title: slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
    category: "Tutorial",
    readTime: "15 min",
    difficulty: "Intermediate" as const,
    type: "free" as const,
    description: "Detailed step-by-step developer guide for Minecraft server administrators and creators.",
    updated: "2024-12-15",
    author: "NOTIXNODE Developer Team",
    prerequisites: [
      "Modern Minecraft server core (Paper, Velocity, or Purpur)",
      "Access to server console and configuration files",
    ],
    sections: [
      {
        heading: "1. Overview & Preparation",
        content: "Before beginning this configuration, ensure your server is stopped and take a full backup of your current server directory. Review all version requirements to avoid unexpected dependency conflicts.",
      },
      {
        heading: "2. Configuration Implementation",
        content: "Apply the recommended settings below into your server configuration files. Review inline comments for explanations on performance impact and customization options.",
      },
      {
        heading: "3. Testing & Verification",
        content: "Start the server and monitor your server console for startup errors. Verify functionality in-game with appropriate test accounts before opening to public players.",
      },
    ],
  };

  const handleCopy = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container max-w-4xl mx-auto">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Tutorials", href: "/tutorials" },
            { label: tutorial.title, isCurrentPage: true },
          ]}
          className="mb-6"
        />

        <article className="space-y-8">
          <header className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="version">{tutorial.category}</Badge>
              <Badge variant="version">{tutorial.difficulty}</Badge>
              <Badge variant={tutorial.type === "free" ? "free" : "premium"}>
                {tutorial.type === "free" ? "Free Guide" : "Premium"}
              </Badge>
              <span className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                <Clock className="h-3.5 w-3.5" />
                {tutorial.readTime} read
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              {tutorial.title}
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed">
              {tutorial.description}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border text-sm text-muted-foreground">
              <span>By <strong className="text-foreground">{tutorial.author}</strong></span>
              <span>Updated {tutorial.updated}</span>
            </div>
          </header>

          {tutorial.prerequisites && tutorial.prerequisites.length > 0 && (
            <Card variant="glass-strong" padding="md">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-emerald" />
                  Prerequisites
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {tutorial.prerequisites.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          <div className="space-y-10">
            {tutorial.sections.map((sec, idx) => (
              <section key={idx} className="space-y-4">
                <h2 className="text-2xl font-bold text-foreground">
                  {sec.heading}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {sec.content}
                </p>

                {sec.callout && (
                  <div className={`p-4 rounded-xl border text-sm ${
                    sec.callout.type === "warning"
                      ? "bg-amber/10 border-amber/30 text-amber"
                      : "bg-cyan/10 border-cyan/30 text-cyan"
                  }`}>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      <p className="text-foreground/90">{sec.callout.text}</p>
                    </div>
                  </div>
                )}

                {sec.codeSnippet && (
                  <div className="rounded-xl border border-border overflow-hidden bg-[#070A11]">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-[#0B0F19] text-xs text-muted-foreground font-mono">
                      <span>{sec.codeSnippet.filename}</span>
                      <button
                        onClick={() => handleCopy(sec.codeSnippet!.code, idx)}
                        className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        {copiedIndex === idx ? "Copied!" : "Copy Snippet"}
                      </button>
                    </div>
                    <pre className="p-4 text-xs sm:text-sm font-mono text-[#E2E8F0] overflow-x-auto leading-relaxed">
                      <code>{sec.codeSnippet.code}</code>
                    </pre>
                  </div>
                )}
              </section>
            ))}
          </div>

          <Separator />

          <footer className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <Button variant="outline" asChild>
              <Link href="/tutorials">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to All Tutorials
              </Link>
            </Button>
            <Button variant="primary" asChild>
              <Link href="/resources">
                Explore Related Configs &amp; Tools
              </Link>
            </Button>
          </footer>
        </article>
      </div>
    </div>
  );
}
