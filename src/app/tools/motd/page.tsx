"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Separator } from "@/components/ui/Separator";
import { Copy, Download, ChevronRight, ChevronLeft, Check, AlertTriangle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

const presets = [
  { name: "Default Vanilla", format: "legacy", content: "A Minecraft Server" },
  { name: "Paper Optimized", format: "legacy", content: "&6&lPaperMC &7| &fOptimized for Performance" },
  { name: "MiniMessage Gradient", format: "minimessage", content: "<gradient:#FF1E27:#FFFFFF>NOTIXNODE</gradient> <gray>|</gray> <white>Premium Resources</white>" },
  { name: "JSON Legacy", format: "json", content: '{"text":"Welcome to ","color":"white","extra":[{"text":"My Server","color":"gold","bold":true}]}' },
  { name: "Bedrock Compatible", format: "legacy", content: "&b&lBedrock &7& &9&lJava &7| &fCrossplay Enabled" },
];

function Code({ children, className }: { children: React.ReactNode; className?: string }) {
  return <code className={cn("bg-card px-1.5 py-0.5 rounded text-xs font-mono", className)}>{children}</code>;
}

const LEGACY_MAP: Record<string, string> = {
  '0': 'color:#000000', '1': 'color:#0000AA', '2': 'color:#00AA00', '3': 'color:#00AAAA',
  '4': 'color:#AA0000', '5': 'color:#AA00AA', '6': 'color:#FFAA00', '7': 'color:#AAAAAA',
  '8': 'color:#555555', '9': 'color:#5555FF', 'a': 'color:#55FF55', 'b': 'color:#55FFFF',
  'c': 'color:#FF5555', 'd': 'color:#FF55FF', 'e': 'color:#FFFF55', 'f': 'color:#FFFFFF',
  'l': 'font-weight:bold', 'o': 'font-style:italic', 'n': 'text-decoration:underline',
  'm': 'text-decoration:line-through', 'k': 'filter:blur(1px)', 'r': 'reset',
};

const MM_STYLES: Record<string, string> = {
  'red': 'color:#FF5555', 'green': 'color:#55FF55', 'blue': 'color:#5555FF',
  'yellow': 'color:#FFFF55', 'gold': 'color:#FFAA00', 'aqua': 'color:#55FFFF',
  'white': 'color:#FFFFFF', 'gray': 'color:#AAAAAA', 'dark_gray': 'color:#555555',
  'black': 'color:#000000', 'bold': 'font-weight:bold', 'italic': 'font-style:italic',
  'underlined': 'text-decoration:underline', 'strikethrough': 'text-decoration:line-through',
};

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseLegacy(text: string): string {
  let counter = 0;
  const tokens: string[] = [];
  const tokenized = text.replace(/[&§]([0-9a-fk-or])/gi, (_, code) => {
    const style = LEGACY_MAP[code.toLowerCase()];
    const tag = style ? (style === 'reset' ? '</span>' : `<span style="${style}">`) : '';
    tokens.push(tag);
    return `___FMT_${counter++}___`;
  });

  const escaped = escapeHtml(tokenized);
  return escaped.replace(/___FMT_(\d+)___/g, (_, idx) => tokens[parseInt(idx, 10)] || '');
}

function parseMiniMessage(text: string): string {
  let counter = 0;
  const tokens: string[] = [];

  let processed = text.replace(/<gradient:(#[0-9a-fA-F]{6}):(#[0-9a-fA-F]{6})>([^<]+)<\/gradient>/g, 
    (_, c1, c2, content) => {
      const escaped = escapeHtml(content);
      tokens.push(`<span style="background:linear-gradient(90deg,${c1},${c2});-webkit-background-clip:text;-webkit-text-fill-color:transparent">${escaped}</span>`);
      return `___MM_${counter++}___`;
    }
  );

  processed = processed.replace(/<(\w+)>([^<]+)<\/\1>/g, (_, tag, content) => {
    const style = MM_STYLES[tag.toLowerCase()];
    if (style) {
      const escaped = escapeHtml(content);
      tokens.push(`<span style="${style}">${escaped}</span>`);
      return `___MM_${counter++}___`;
    }
    return content;
  });

  const escaped = escapeHtml(processed);
  return escaped.replace(/___MM_(\d+)___/g, (_, idx) => tokens[parseInt(idx, 10)] || '');
}

function renderJSON(obj: unknown): string {
  if (typeof obj === "string") return escapeHtml(obj);
  if (!obj) return "";
  if (Array.isArray(obj)) return obj.map(renderJSON).join("");
  
  const o = obj as Record<string, unknown>;
  let style = "";
  if (typeof o.color === "string") {
    const colorVal = o.color.startsWith("#") ? o.color : "#" + o.color;
    if (/^#[0-9a-fA-F]{3,8}$/.test(colorVal)) {
      style += `color:${colorVal};`;
    }
  }
  if (o.bold === true) style += "font-weight:bold;";
  if (o.italic === true) style += "font-style:italic;";
  if (o.underlined === true) style += "text-decoration:underline;";
  if (o.strikethrough === true) style += "text-decoration:line-through;";
  if (o.obfuscated === true) style += "font-family:monospace;";
  
  const textContent = typeof o.text === "string" ? escapeHtml(o.text) : "";
  const extra = o.extra ? (Array.isArray(o.extra) ? o.extra.map(renderJSON).join("") : "") : "";
  return style ? `<span style="${style}">${textContent}${extra}</span>` : `${textContent}${extra}`;
}

function parseJSON(text: string): string {
  try {
    const obj = JSON.parse(text);
    return renderJSON(obj);
  } catch {
    throw new Error("Invalid JSON");
  }
}

export default function MOTDPreviewer() {
  const [format, setFormat] = useState<"legacy" | "minimessage" | "json">("legacy");
  const [input, setInput] = useState(presets[1].content);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const preview = useMemo(() => {
    try {
      if (format === "legacy") {
        return parseLegacy(input);
      } else if (format === "minimessage") {
        return parseMiniMessage(input);
      } else if (format === "json") {
        return parseJSON(input);
      }
      return "";
    } catch (e) {
      return "";
    }
  }, [input, format]);

  const parseError = useMemo(() => {
    try {
      if (format === "legacy") {
        parseLegacy(input);
      } else if (format === "minimessage") {
        parseMiniMessage(input);
      } else if (format === "json") {
        parseJSON(input);
      }
      return "";
    } catch (e) {
      return e instanceof Error ? e.message : "Invalid format";
    }
  }, [input, format]);

  const copyToClipboard = useCallback(async () => {
    await navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [input]);

  const downloadConfig = useCallback(() => {
    const blob = new Blob([input], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "motd.txt";
    a.click();
    URL.revokeObjectURL(url);
  }, [input]);

  return (
    <div className="min-h-screen">
      <section className="section container" aria-labelledby="motd-heading">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 id="motd-heading" className="text-3xl sm:text-4xl font-bold text-foreground">MOTD Previewer</h1>
              <p className="mt-2 text-muted-foreground">Real-time MOTD editor with legacy, JSON, and MiniMessage support. Live preview for Java and Bedrock editions.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={copyToClipboard} aria-label="Copy to clipboard">
                <Copy className="h-4 w-4 mr-2" aria-hidden="true" />
                {copied ? <Check className="h-4 w-4" /> : "Copy"}
              </Button>
              <Button variant="secondary" onClick={downloadConfig} aria-label="Download MOTD">
                <Download className="h-4 w-4 mr-2" aria-hidden="true" />
                Download
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <Card variant="glass-strong" padding="lg">
              <CardHeader>
                <CardTitle>Editor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="label-base">Format</label>
                  <div className="flex gap-2 mt-2" role="radiogroup" aria-label="MOTD format">
                    {["legacy", "minimessage", "json"].map((fmt) => (
                      <button
                        key={fmt}
                        role="radio"
                        aria-checked={format === fmt}
                        onClick={() => setFormat(fmt as any)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          format === fmt
                            ? "bg-primary text-background"
                            : "bg-card text-muted-foreground hover:text-foreground hover:bg-border"
                        }`}
                      >
                        {fmt.charAt(0).toUpperCase() + fmt.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label-base">MOTD Input</label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="input-base min-h-[200px] font-mono text-sm resize-y"
                    placeholder="Enter your MOTD here..."
                    aria-label="MOTD input"
                    spellCheck={false}
                  />
                  {parseError && (
                    <p className="mt-2 text-sm text-destructive flex items-center gap-2" role="alert">
                      <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                      {parseError}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label-base">Presets</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {presets.map((preset, i) => (
                      <button
                        key={i}
                        onClick={() => { setFormat(preset.format as "legacy" | "minimessage" | "json"); setInput(preset.content); }}
                        className="btn-secondary btn-sm"
                      >
                        {preset.name}
                      </button>
                    ))}
                  </div>
                </div>

                <Card variant="glass" padding="md">
                  <h4 className="font-medium text-foreground mb-3">Format Guide</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2"><code className="bg-card px-1.5 py-0.5 rounded text-xs font-mono">Legacy: &cRed &lBold &rReset</code></div>
                    <div className="flex items-center gap-2"><code className="bg-card px-1.5 py-0.5 rounded text-xs font-mono">{'MiniMessage: <red>Red</red> <gradient:#ff0000:#00ff00>Gradient</gradient>'}</code></div>
                    <div className="flex items-center gap-2"><code className="bg-card px-1.5 py-0.5 rounded text-xs font-mono">{'JSON: {"text":"Hello","color":"gold","bold":true}'}</code></div>
                  </div>
                </Card>
              </CardContent>
            </Card>

            <Card variant="glass-strong" padding="lg">
              <CardHeader>
                <CardTitle>Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <label className="label-base">Java Edition Preview</label>
                    <div className="mt-2 p-6 bg-card border border-border rounded-xl font-mono text-lg min-h-[80px] flex items-center">
                      <div dangerouslySetInnerHTML={{ __html: preview || "<span class='text-muted-foreground'>Preview appears here...</span>" }} />
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <label className="label-base">Bedrock Edition Preview</label>
                    <div className="mt-2 p-6 bg-card border border-border rounded-xl font-mono text-lg min-h-[80px] flex items-center">
                      <div dangerouslySetInnerHTML={{ __html: preview.replace(/&([0-9a-fk-or])/gi, "§$1") || "<span class='text-muted-foreground'>Preview appears here...</span>" }} />
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">Bedrock uses § instead of & for formatting codes</p>
                  </div>

                  <Separator />

                  <div>
                    <label className="label-base">Raw Output</label>
                    <div className="mt-2 p-4 bg-card border border-border rounded-xl font-mono text-sm overflow-x-auto max-h-40">
                      <pre>{input}</pre>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card variant="glass" padding="lg" className="mt-8">
            <CardHeader>
              <CardTitle>server.properties Entry</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-sm bg-card p-4 rounded-lg border border-border overflow-x-auto">
                motd={input.replace(/&/g, "\\u0026")}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">Copy the value above into your server.properties file. Legacy codes are escaped for properties file format.</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}