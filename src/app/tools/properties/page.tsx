"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Separator } from "@/components/ui/Separator";
import { Copy, Download, Check, AlertTriangle, Info, Search, ChevronDown, ChevronUp, SlidersHorizontal, Server, Database, Network, Users, Shield, Zap } from "lucide-react";

type PropertyType = "text" | "number" | "boolean" | "select" | "password" | "object";

interface Property {
  key: string;
  category: string;
  label: string;
  type: PropertyType;
  default: string | number | boolean | Record<string, number>;
  min?: number;
  max?: number;
  description?: string;
  options?: string[];
}

const propertyCategories = [
  { id: "server", name: "Server Settings", icon: Server, description: "Basic server identification and connection settings" },
  { id: "performance", name: "Performance", icon: Zap, description: "Tick rate, chunk loading, and entity processing" },
  { id: "network", name: "Network", icon: Network, description: "Port, compression, and connection handling" },
  { id: "gameplay", name: "Gameplay", icon: Users, description: "Game rules, difficulty, and player limits" },
  { id: "security", name: "Security", icon: Shield, description: "Authentication, anti-cheat, and exploit prevention" },
  { id: "world", name: "World Generation", icon: Database, description: "World type, structures, and generation settings" },
];

const allProperties: Property[] = [
  // Server Settings
  { key: "server-name", category: "server", label: "Server Name", type: "text", default: "A Minecraft Server", description: "Displayed in server list" },
  { key: "motd", category: "server", label: "MOTD", type: "text", default: "", description: "Message of the day (supports formatting codes)" },
  { key: "server-ip", category: "server", label: "Server IP", type: "text", default: "", description: "Bind to specific IP (leave empty for all)" },
  { key: "server-port", category: "server", label: "Server Port", type: "number", default: 25565, description: "Port to listen on" },
  { key: "online-mode", category: "server", label: "Online Mode", type: "boolean", default: true, description: "Validate accounts with Mojang" },
  { key: "enable-status", category: "server", label: "Enable Status", type: "boolean", default: true, description: "Respond to server list ping" },
  { key: "enable-query", category: "server", label: "Enable Query", type: "boolean", default: false, description: "Enable GameSpy4 protocol listener" },
  { key: "query-port", category: "server", label: "Query Port", type: "number", default: 25565, description: "Port for query listener" },

  // Performance
  { key: "view-distance", category: "performance", label: "View Distance", type: "number", default: 10, min: 3, max: 32, description: "Chunks sent to client (Paper: 6-10 recommended)" },
  { key: "simulation-distance", category: "performance", label: "Simulation Distance", type: "number", default: 10, min: 3, max: 32, description: "Chunks where entities are processed" },
  { key: "entity-broadcast-range-percentage", category: "performance", label: "Entity Broadcast %", type: "number", default: 100, min: 10, max: 100, description: "Percentage of view distance for entity updates" },
  { key: "max-tick-time", category: "performance", label: "Max Tick Time (ms)", type: "number", default: 60000, description: "Watchdog timeout (Paper: -1 to disable)" },
  { key: "ticks-per-second", category: "performance", label: "Target TPS", type: "number", default: 20, min: 10, max: 20, description: "Target ticks per second" },
  { key: "spawn-limits", category: "performance", label: "Mob Spawn Limits", type: "object", default: { monsters: 70, animals: 10, water_animals: 15, ambient: 15 }, description: "Per-player mob caps" },

  // Network
  { key: "network-compression-threshold", category: "network", label: "Compression Threshold", type: "number", default: 256, description: "Packet size threshold for compression (-1 to disable)" },
  { key: "max-players", category: "network", label: "Max Players", type: "number", default: 20, min: 1, max: 1000, description: "Maximum concurrent players" },
  { key: "player-idle-timeout", category: "network", label: "Idle Timeout (min)", type: "number", default: 0, description: "Kick idle players (0 = disabled)" },
  { key: "rate-limit", category: "network", label: "Packet Rate Limit", type: "number", default: 0, description: "Packets per second per player (0 = unlimited)" },
  { key: "enable-rcon", category: "network", label: "Enable RCON", type: "boolean", default: false, description: "Enable remote console access" },
  { key: "rcon-port", category: "network", label: "RCON Port", type: "number", default: 25575, description: "RCON listener port" },
  { key: "rcon-password", category: "network", label: "RCON Password", type: "password", default: "", description: "RCON authentication password" },

  // Gameplay
  { key: "gamemode", category: "gameplay", label: "Default Gamemode", type: "select", default: "survival", options: ["survival", "creative", "adventure", "spectator"], description: "Default game mode for new players" },
  { key: "difficulty", category: "gameplay", label: "Difficulty", type: "select", default: "normal", options: ["peaceful", "easy", "normal", "hard"], description: "Server difficulty level" },
  { key: "hardcore", category: "gameplay", label: "Hardcore Mode", type: "boolean", default: false, description: "Single life, spectate on death" },
  { key: "pvp", category: "gameplay", label: "PvP Enabled", type: "boolean", default: true, description: "Allow player vs player combat" },
  { key: "spawn-protection", category: "gameplay", label: "Spawn Protection", type: "number", default: 16, description: "Blocks around spawn where only ops can build" },
  { key: "max-build-height", category: "gameplay", label: "Max Build Height", type: "number", default: 256, min: 64, max: 384, description: "Maximum Y level for building" },
  { key: "force-gamemode", category: "gameplay", label: "Force Gamemode", type: "boolean", default: false, description: "Force default gamemode on join" },

  // Security
  { key: "white-list", category: "security", label: "Whitelist", type: "boolean", default: false, description: "Only allow whitelisted players" },
  { key: "enforce-whitelist", category: "security", label: "Enforce Whitelist", type: "boolean", default: false, description: "Kick non-whitelisted players on reload" },
  { key: "prevent-proxy-connections", category: "security", label: "Prevent Proxy Connections", type: "boolean", default: false, description: "Block VPN/proxy connections (Paper)" },
  { key: "hide-online-players", category: "security", label: "Hide Online Players", type: "boolean", default: false, description: "Hide player list in server ping" },

  // World
  { key: "level-name", category: "world", label: "World Name", type: "text", default: "world", description: "World folder name" },
  { key: "level-type", category: "world", label: "World Type", type: "select", default: "minecraft:normal", options: ["minecraft:normal", "minecraft:flat", "minecraft:large_biomes", "minecraft:amplified", "minecraft:single_biome_surface"], description: "World generation type" },
  { key: "generator-settings", category: "world", label: "Generator Settings", type: "text", default: "", description: "Custom world generation JSON" },
  { key: "generate-structures", category: "world", label: "Generate Structures", type: "boolean", default: true, description: "Villages, temples, etc." },
  { key: "spawn-npcs", category: "world", label: "Spawn NPCs", type: "boolean", default: true, description: "Villagers and wandering traders" },
  { key: "spawn-animals", category: "world", label: "Spawn Animals", type: "boolean", default: true, description: "Passive mobs" },
  { key: "spawn-monsters", category: "world", label: "Spawn Monsters", type: "boolean", default: true, description: "Hostile mobs" },
];

type PresetKey = "paper" | "folia" | "vanilla" | "highpop";
type PresetPropertyValue = string | number | boolean | Record<string, number>;
interface PresetConfig {
  name: string;
  values: Record<string, PresetPropertyValue>;
}

const presets: Record<PresetKey, PresetConfig> = {
  paper: {
    name: "PaperMC Optimized",
    values: {
      "view-distance": 8,
      "simulation-distance": 8,
      "entity-broadcast-range-percentage": 80,
      "max-tick-time": -1,
      "network-compression-threshold": 256,
      "prevent-proxy-connections": true,
      "spawn-limits": { monsters: 50, animals: 8, water_animals: 10, ambient: 10 },
    }
  },
  folia: {
    name: "Folia Regionized",
    values: {
      "view-distance": 6,
      "simulation-distance": 6,
      "entity-broadcast-range-percentage": 70,
      "max-tick-time": -1,
      "network-compression-threshold": 256,
      "prevent-proxy-connections": true,
    }
  },
  vanilla: {
    name: "Vanilla Default",
    values: {}
  },
  highpop: {
    name: "High Population (100+)",
    values: {
      "view-distance": 6,
      "simulation-distance": 5,
      "entity-broadcast-range-percentage": 60,
      "max-tick-time": -1,
      "network-compression-threshold": 512,
      "max-players": 200,
      "player-idle-timeout": 15,
      "rate-limit": 300,
      "spawn-limits": { monsters: 30, animals: 5, water_animals: 5, ambient: 5 },
    }
  },
};

export default function PropertiesGenerator() {
  const [activeCategory, setActiveCategory] = useState("server");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<PresetKey>("paper");
  const [copied, setCopied] = useState(false);

  const initialValues = useMemo(() => {
    const initial: Record<string, string | number | boolean | Record<string, number>> = {};
    allProperties.forEach(p => {
      initial[p.key] = p.default;
    });
    // Apply preset
    const preset = presets[selectedPreset];
    if (preset && preset.values) {
      Object.entries(preset.values).forEach(([key, value]) => {
        if (initial[key] !== undefined) initial[key] = value;
      });
    }
    return initial;
  }, [selectedPreset]);

  const [values, setValues] = useState<Record<string, string | number | boolean | Record<string, number>>>(initialValues);

  // Sync values when preset changes - legitimate derived state sync
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const filteredProperties = useMemo(() => {
    return allProperties.filter(p => 
      p.category === activeCategory &&
      (p.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
       (p.description?.toLowerCase() ?? '').includes(searchQuery.toLowerCase()) ||
       p.key.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [activeCategory, searchQuery]);

  const handleChange = useCallback((key: string, value: string | number | boolean | Record<string, number>) => {
    setValues(prev => ({ ...prev, [key]: value }));
  }, []);

  const generateOutput = useCallback(() => {
    let output = "# Minecraft server.properties\n";
    output += `# Generated by NOTIXNODE Server Properties Generator\n`;
    output += `# Preset: ${presets[selectedPreset].name}\n`;
    output += `# Date: ${new Date().toISOString()}\n\n`;

    propertyCategories.forEach(cat => {
      const props = allProperties.filter(p => p.category === cat.id);
      if (props.length === 0) return;
      output += `# ${cat.name}\n`;
      props.forEach(p => {
        const value = values[p.key];
        if (value === undefined || value === "") return;
        if (typeof value === "object") {
          output += `${p.key}=${JSON.stringify(value)}\n`;
        } else if (typeof value === "boolean") {
          output += `${p.key}=${value}\n`;
        } else {
          output += `${p.key}=${value}\n`;
        }
      });
      output += "\n";
    });
    return output;
  }, [selectedPreset, values]);

  const copyToClipboard = useCallback(async () => {
    await navigator.clipboard.writeText(generateOutput());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [generateOutput]);

  const downloadConfig = useCallback(() => {
    const blob = new Blob([generateOutput()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "server.properties";
    a.click();
    URL.revokeObjectURL(url);
  }, [generateOutput]);

  const renderInput = useCallback((prop: Property) => {
    const value = values[prop.key];
    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      let val: string | number | boolean | Record<string, number> = e.target.value;
      if (prop.type === "number") {
        val = val === "" ? 0 : Number(val);
      }
      if (prop.type === "boolean" && e.target instanceof HTMLInputElement) {
        val = e.target.checked;
      }
      handleChange(prop.key, val);
    };

    const valueStr = typeof value === "string" ? value : String(value ?? "");

    switch (prop.type) {
      case "boolean":
        return (
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={value === true}
              onChange={onChange}
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary/20"
            />
            <span className="text-sm">{prop.label}</span>
          </label>
        );
      case "number":
        return (
          <div>
            <label className="label-base">{prop.label}</label>
            <input
              type="number"
              value={valueStr}
              onChange={onChange}
              min={prop.min}
              max={prop.max}
              className="input-base font-mono text-sm mt-1"
              aria-describedby={`${prop.key}-desc`}
            />
            <p id={`${prop.key}-desc`} className="mt-1 text-xs text-muted-foreground">{prop.description}</p>
          </div>
        );
      case "select":
        return (
          <div>
            <label className="label-base">{prop.label}</label>
            <select value={valueStr} onChange={onChange} className="input-base mt-1" aria-describedby={`${prop.key}-desc`}>
              {prop.options!.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <p id={`${prop.key}-desc`} className="mt-1 text-xs text-muted-foreground">{prop.description}</p>
          </div>
        );
      case "password":
        return (
          <div>
            <label className="label-base">{prop.label}</label>
            <input
              type="password"
              value={valueStr}
              onChange={onChange}
              className="input-base font-mono text-sm mt-1"
              aria-describedby={`${prop.key}-desc`}
            />
            <p id={`${prop.key}-desc`} className="mt-1 text-xs text-muted-foreground">{prop.description}</p>
          </div>
        );
      case "object":
        return (
          <div>
            <label className="label-base">{prop.label}</label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {Object.entries((value as Record<string, number>) || {}).map(([k, v]) => (
                <input
                  key={k}
                  type="number"
                  value={v}
                  onChange={(e) => handleChange(prop.key, { ...((value as Record<string, number>) || {}), [k]: Number(e.target.value) || 0 })}
                  className="input-base font-mono text-sm"
                  placeholder={k}
                  aria-label={`${prop.label} ${k}`}
                />
              ))}
            </div>
            <p className="mt-1 text-xs text-muted-foreground">{prop.description}</p>
          </div>
        );
      default:
        return (
          <div>
            <label className="label-base">{prop.label}</label>
            <input
              type="text"
              value={valueStr}
              onChange={onChange}
              className="input-base font-mono text-sm mt-1"
              aria-describedby={`${prop.key}-desc`}
            />
            <p id={`${prop.key}-desc`} className="mt-1 text-xs text-muted-foreground">{prop.description}</p>
          </div>
        );
    }
  }, [values, handleChange]);

  return (
    <div className="min-h-screen">
      <section className="section container" aria-labelledby="props-heading">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 id="props-heading" className="text-3xl sm:text-4xl font-bold text-foreground">Server Properties Generator</h1>
              <p className="mt-2 text-muted-foreground">Interactive server.properties generator with explanations, presets for Paper/Folia, and validation.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={copyToClipboard} aria-label="Copy to clipboard">
                <Copy className="h-4 w-4 mr-2" aria-hidden="true" />
                {copied ? <Check className="h-4 w-4" /> : "Copy All"}
              </Button>
              <Button variant="secondary" onClick={downloadConfig} aria-label="Download config">
                <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                Download .properties
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-[280px_1fr] gap-8">
            <aside className="lg:sticky lg:top-24 space-y-4">
              <Card variant="glass-strong" padding="md">
                <CardHeader>
                  <CardTitle className="text-lg">Presets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {(Object.entries(presets) as [PresetKey, PresetConfig][]).map(([key, preset]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedPreset(key as PresetKey)}
                      className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                        selectedPreset === key
                          ? "bg-primary/10 border border-primary text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-card"
                      }`}
                    >
                      <div className="font-medium">{preset.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {Object.keys(preset.values).length} settings overridden
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              <Card variant="glass-strong" padding="md">
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {propertyCategories.map(cat => {
                    const Icon = cat.icon;
                    const count = filteredProperties.filter(p => p.category === cat.id).length;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`w-full text-left p-3 rounded-lg flex items-center gap-3 transition-colors ${
                          activeCategory === cat.id
                            ? "bg-primary/10 text-primary border border-primary"
                            : "text-muted-foreground hover:text-foreground hover:bg-card"
                        }`}
                      >
                        <Icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{cat.name}</p>
                          <p className="text-xs truncate">{cat.description}</p>
                        </div>
                        <Badge variant="version" className="text-xs">{count}</Badge>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>

              <Card variant="glass" padding="md">
                <h4 className="font-medium text-foreground mb-3">Quick Actions</h4>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-2" aria-hidden="true" />
                    Copy Full Config
                  </Button>
                  <Button variant="secondary" className="w-full justify-start" onClick={downloadConfig}>
                    <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                    Download File
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => setSelectedPreset("vanilla")}>
                    Reset to Vanilla Defaults
                  </Button>
                </div>
              </Card>
            </aside>

            <main className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search properties..."
                    className="input-base pl-10"
                    aria-label="Search properties"
                  />
                </div>
                <Badge variant={selectedPreset === "paper" ? "free" : selectedPreset === "vanilla" ? "version" : "premium"}>
                  Active: {presets[selectedPreset].name}
                </Badge>
              </div>

              {propertyCategories.map(cat => {
                const props = filteredProperties.filter(p => p.category === cat.id);
                if (props.length === 0) return null;
                const Icon = cat.icon;
                return (
                  <Card key={cat.id} variant="glass-strong" padding="lg">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
                        <div>
                          <CardTitle>{cat.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">{cat.description}</p>
                        </div>
                      </div>
                      <Badge variant="version">{props.length} properties</Badge>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid sm:grid-cols-2 gap-6">
                        {props.map(prop => (
                          <div key={prop.key}>{renderInput(prop)}</div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              <Card variant="glass" padding="lg">
                <CardHeader>
                  <CardTitle>Generated Output</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="font-mono text-sm bg-card p-4 rounded-lg border border-border overflow-x-auto max-h-96">
                    <pre>{generateOutput()}</pre>
                  </div>
                </CardContent>
              </Card>
            </main>
          </div>
        </div>
      </section>
    </div>
  );
}