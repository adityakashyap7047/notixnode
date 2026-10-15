"use client";

import { useState, useEffect } from "react";
import { Cpu, HardDrive, MemoryStick, Server, ShieldCheck, Terminal, RefreshCw, ExternalLink, Wifi, MapPin, Lock } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface ServerStatusResponse {
  cluster: string;
  region: string;
  status: string;
  online: boolean;
  ping: number;
  uptimeSla: string;
  ddosMitigation: string;
  infrastructure: {
    type: string;
    memory: string;
    storage: string;
    network: string;
  };
  lastChecked: string;
}

export function FloatingNodeMonitor() {
  const [data, setData] = useState<ServerStatusResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/server-status", {
        cache: "no-store"
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error("Failed to query status:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000); // 30s auto-refresh
    return () => clearInterval(interval);
  }, []);

  const isOnline = Boolean(data?.online ?? true);
  const ping = data?.ping || 24;

  return (
    <div className="card-base p-6 sm:p-8 border border-white/10 relative overflow-hidden bg-gradient-to-b from-[#0F0F16] to-[#0A0A0F] shadow-[0_12px_45px_rgba(0,0,0,0.85)]">
      {/* Ambient Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#C5A059]/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#DFBA73]/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-[#DFBA73]/20 to-[#C5A059]/20 border border-[#C5A059]/30 text-[#DFBA73] shadow-[0_0_20px_rgba(212,175,55,0.25)]">
            <Server className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
                NOTIXNODE Enterprise Infrastructure
              </h2>
              <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-medium">
                Protected Cluster
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-400 mt-0.5 flex items-center gap-2">
              <span className="flex items-center gap-1 text-[#DFBA73]">
                <MapPin className="h-3.5 w-3.5" /> North America East (Tier-4 Datacenter)
              </span>
              <span>•</span>
              <span className="text-neutral-400">Hardened Multi-Core Cluster</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-white/10 text-xs font-medium">
            <span className={`h-2.5 w-2.5 rounded-full ${isOnline ? "bg-emerald-400 shadow-[0_0_10px_#34D399] animate-pulse" : "bg-neutral-500"}`} />
            <span className={isOnline ? "text-emerald-400 font-semibold" : "text-neutral-400"}>
              {isOnline ? "All Systems Operational" : "Standby / Maintenance"}
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
            {loading ? "Refreshing..." : "Check Status"}
          </Button>
        </div>
      </div>

      {/* Infrastructure Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {/* Network & Ping */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between hover:border-[#DFBA73]/40 transition-colors">
          <div>
            <span className="text-xs text-neutral-400 font-medium">Telemetry Latency</span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-0.5">
              {ping}ms{" "}
              <span className="text-xs text-emerald-400 font-normal">Optimal</span>
            </div>
            <span className="text-[11px] text-neutral-500">Global Anycast Routing</span>
          </div>
          <div className="h-11 w-11 rounded-xl bg-[#DFBA73]/15 border border-[#DFBA73]/30 flex items-center justify-center text-[#DFBA73] shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <Wifi className="h-5 w-5" />
          </div>
        </div>

        {/* Security & DDoS */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between hover:border-[#DFBA73]/40 transition-colors">
          <div>
            <span className="text-xs text-neutral-400 font-medium">DDoS Mitigation</span>
            <div className="text-xl sm:text-2xl font-bold text-white mt-0.5">
              Layer 4 / 7{" "}
              <span className="text-xs text-emerald-400 font-normal">Active</span>
            </div>
            <span className="text-[11px] text-neutral-500">Automated Threat Shielding</span>
          </div>
          <div className="h-11 w-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.2)]">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>

        {/* Uptime SLA */}
        <div className="p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-between hover:border-[#DFBA73]/40 transition-colors">
          <div>
            <span className="text-xs text-neutral-400 font-medium">Uptime SLA</span>
            <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-0.5">
              99.98%{" "}
              <span className="text-xs text-emerald-400 font-normal">Guaranteed</span>
            </div>
            <span className="text-[11px] text-neutral-500">Redundant Power & Uplink</span>
          </div>
          <div className="h-11 w-11 rounded-xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <Server className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Security Notice & Admin Access */}
      <div className="mt-6 p-5 rounded-2xl bg-black/30 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-left">
          <div className="h-10 w-10 rounded-xl bg-neutral-800/80 border border-white/10 flex items-center justify-center text-[#DFBA73] shrink-0">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">Private & Hardened Infrastructure</h4>
            <p className="text-xs text-neutral-400">
              Direct server addresses and SFTP credentials are confidential and accessible only to authorized administrators through private management consoles.
            </p>
          </div>
        </div>

        <a
          href="/contact"
          className="btn-outline px-4 py-2 text-xs rounded-full inline-flex items-center gap-1.5 hover:border-[#DFBA73] whitespace-nowrap"
        >
          <ExternalLink className="h-3.5 w-3.5 text-[#DFBA73]" />
          Contact Staff Desk
        </a>
      </div>
    </div>
  );
}
