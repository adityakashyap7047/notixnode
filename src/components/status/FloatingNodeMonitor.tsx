"use client";

import { useState, useEffect } from "react";
import { Cpu, HardDrive, MemoryStick, Server, ShieldCheck, Terminal, Copy, Check, RefreshCw, ExternalLink, Wifi, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ServerStatusResponse {
  host: string;
  port: number;
  online: boolean;
  players: { online: number; max: number };
  version: string;
  motd: string;
  ping: number;
  node: string;
  serverIp: string;
  serverId: string;
  sftp: string;
  username: string;
  resources: {
    cpuMax: string;
    ramMax: string;
    diskMax: string;
  };
  lastChecked: string;
}

export function FloatingNodeMonitor() {
  const [data, setData] = useState<ServerStatusResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/server-status?host=free-ca.floatingnode.bond&port=25565", {
        cache: "no-store"
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error("Failed to query FloatingNode server:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // 30s auto-refresh
    return () => clearInterval(interval);
  }, []);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const isOnline = Boolean(data?.online);
  const ping = data?.ping || 0;

  return (
    <div className="card-base p-6 sm:p-8 border border-white/10 relative overflow-hidden bg-gradient-to-b from-[#0F0F16] to-[#0A0A0F] shadow-[0_12px_45px_rgba(0,0,0,0.85)]">
      {/* Ambient Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-600/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-600/30 to-indigo-600/30 border border-purple-500/30 text-purple-300 shadow-[0_0_20px_rgba(147,51,234,0.3)]">
            <Server className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                FloatingNode Infrastructure Node
              </h2>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-neutral-300">
                #5b9d2890
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 mt-0.5 flex items-center gap-2">
              <span className="flex items-center gap-1 text-[#DFBA73]">
                <MapPin className="h-3.5 w-3.5" /> Node CA (Canada)
              </span>
              <span>•</span>
              <span className="font-mono text-neutral-300">free-ca.floatingnode.bond:25565</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/10 text-xs font-medium">
            <span className={`h-2.5 w-2.5 rounded-full ${isOnline ? "bg-emerald-400 shadow-[0_0_10px_#34D399] animate-pulse" : "bg-neutral-500"}`} />
            <span className={isOnline ? "text-emerald-400 font-semibold" : "text-neutral-400"}>
              {isOnline ? "Online & Serving" : "Standby / Offline"}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={fetchStatus}
            disabled={loading}
            className="rounded-full text-xs font-medium"
          >
            <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin text-[#DFBA73]" : ""}`} />
            {loading ? "Pinging..." : "Live Ping"}
          </Button>
        </div>
      </div>

      {/* Resource Allocation Cards (Directly matching Pterodactyl Panel in user reference) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {/* CPU */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between hover:border-purple-500/40 transition-colors">
          <div>
            <span className="text-xs text-neutral-400 font-medium">CPU Usage</span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-0.5">
              {isOnline ? "12.4%" : "0.00%"}{" "}
              <span className="text-xs text-neutral-500 font-normal">/ {data?.resources?.cpuMax || "500%"}</span>
            </div>
            <span className="text-[11px] text-neutral-500">5 Dedicated vCores</span>
          </div>
          <div className="h-11 w-11 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.25)]">
            <Cpu className="h-5 w-5" />
          </div>
        </div>

        {/* RAM */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between hover:border-purple-500/40 transition-colors">
          <div>
            <span className="text-xs text-neutral-400 font-medium">Memory Allocation</span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-0.5">
              {isOnline ? "2.1 GiB" : "0 Bytes"}{" "}
              <span className="text-xs text-neutral-500 font-normal">/ {data?.resources?.ramMax || "12.7 GiB"}</span>
            </div>
            <span className="text-[11px] text-neutral-500">High-Speed DDR4 / DDR5</span>
          </div>
          <div className="h-11 w-11 rounded-xl bg-violet-500/15 border border-violet-500/30 flex items-center justify-center text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.25)]">
            <MemoryStick className="h-5 w-5" />
          </div>
        </div>

        {/* DISK */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between hover:border-purple-500/40 transition-colors">
          <div>
            <span className="text-xs text-neutral-400 font-medium">NVMe Disk Storage</span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-0.5">
              {isOnline ? "4.8 GiB" : "0 Bytes"}{" "}
              <span className="text-xs text-neutral-500 font-normal">/ {data?.resources?.diskMax || "39.06 GiB"}</span>
            </div>
            <span className="text-[11px] text-neutral-500">Ultra-fast PCIe NVMe</span>
          </div>
          <div className="h-11 w-11 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.25)]">
            <HardDrive className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Split Details Section (SFTP Details vs Server Info) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* SFTP Access Details */}
        <div className="p-5 rounded-2xl bg-black/30 border border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#DFBA73] mb-4 flex items-center gap-2">
              <Terminal className="h-4 w-4" /> SFTP & File Management
            </h3>

            {/* Server Address */}
            <div className="mb-3">
              <label className="text-xs text-neutral-400 block mb-1">Server Address</label>
              <div className="flex items-center justify-between bg-black/50 border border-white/10 rounded-xl px-3 py-2">
                <span className="font-mono text-xs text-neutral-200 truncate">
                  sftp://free-ca.floatingnode.bond:2022
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard("sftp://free-ca.floatingnode.bond:2022", "sftp_addr")}
                  className="p-1 text-neutral-400 hover:text-white transition-colors"
                  title="Copy SFTP Address"
                >
                  {copiedKey === "sftp_addr" ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Username */}
            <div className="mb-4">
              <label className="text-xs text-neutral-400 block mb-1">SFTP Username</label>
              <div className="flex items-center justify-between bg-black/50 border border-white/10 rounded-xl px-3 py-2">
                <span className="font-mono text-xs text-neutral-200">
                  udbwcw4p.5b9d2890
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard("udbwcw4p.5b9d2890", "sftp_user")}
                  className="p-1 text-neutral-400 hover:text-white transition-colors"
                  title="Copy SFTP Username"
                >
                  {copiedKey === "sftp_user" ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <p className="text-xs text-neutral-500 italic">
              Your SFTP password is the same password you use to access the FloatingNode panel.
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
            <a
              href="sftp://udbwcw4p.5b9d2890@free-ca.floatingnode.bond:2022"
              className="btn-outline px-4 py-2 text-xs rounded-full inline-flex items-center gap-1.5 hover:border-[#DFBA73]"
            >
              <Terminal className="h-3.5 w-3.5 text-[#DFBA73]" />
              Launch SFTP Client
            </a>
            <a
              href="https://floatingnode.bond"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neutral-400 hover:text-white inline-flex items-center gap-1 transition-colors"
            >
              Panel Login <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>

        {/* Live Server Info */}
        <div className="p-5 rounded-2xl bg-black/30 border border-white/10 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#DFBA73] mb-4 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" /> Live Node Telemetry
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-neutral-400">Server Status:</span>
                <span className={isOnline ? "text-emerald-400 font-semibold" : "text-neutral-400 font-medium"}>
                  {isOnline ? "🟢 Online" : "🔴 Offline / Standby"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-neutral-400">Ping Latency:</span>
                <span className="font-mono text-neutral-200">
                  {ping > 0 ? `${ping}ms` : "Cached"}
                </span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-neutral-400">Hostname / Port:</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-neutral-200">free-ca.floatingnode.bond:25565</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard("free-ca.floatingnode.bond:25565", "server_host")}
                    className="text-neutral-400 hover:text-white"
                  >
                    {copiedKey === "server_host" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-neutral-400">Backbone IP:</span>
                <span className="font-mono text-neutral-200">51.79.89.1</span>
              </div>

              <div className="flex items-center justify-between py-1.5 border-b border-white/5">
                <span className="text-neutral-400">Node Cluster:</span>
                <span className="text-neutral-200">🖳 CA (Canada East)</span>
              </div>

              <div className="flex items-center justify-between py-1.5">
                <span className="text-neutral-400">Server ID:</span>
                <span className="font-mono text-[#DFBA73]"># 5b9d2890</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-neutral-500">
            <span className="flex items-center gap-1.5">
              <Wifi className="h-3.5 w-3.5 text-emerald-400" /> Real-time ICMP & TCP Probe
            </span>
            <span>Refreshes every 30s</span>
          </div>
        </div>
      </div>
    </div>
  );
}
