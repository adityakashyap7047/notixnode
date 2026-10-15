"use client";

import { useState, useMemo } from 'react';

type MCVersion = 
  | '1.12.2' | '1.13.2' | '1.14.4' | '1.15.2' | '1.16.5' 
  | '1.17.1' | '1.18.2' | '1.19.4' | '1.20.1' | '1.20.4' | '1.21.1' | 'latest';

type ServerSoftware = 
  | 'paper' | 'spigot' | 'purpur' | 'fabric' | 'forge' | 'neoforge' 
  | 'velocity' | 'bungeecord' | 'waterfall' | 'folia';

interface CompatibilityEntry {
  version: MCVersion;
  software: ServerSoftware;
  status: 'verified' | 'unverified' | 'unsupported' | 'eol';
  notes?: string;
  lastVerified?: string;
}

const VERSIONS: MCVersion[] = [
  '1.12.2', '1.13.2', '1.14.4', '1.15.2', '1.16.5',
  '1.17.1', '1.18.2', '1.19.4', '1.20.1', '1.20.4', '1.21.1', 'latest',
];

const SOFTWARE: { value: ServerSoftware; label: string; type: 'bukkit' | 'modded' | 'proxy' }[] = [
  { value: 'paper', label: 'Paper', type: 'bukkit' },
  { value: 'spigot', label: 'Spigot', type: 'bukkit' },
  { value: 'purpur', label: 'Purpur', type: 'bukkit' },
  { value: 'folia', label: 'Folia', type: 'bukkit' },
  { value: 'fabric', label: 'Fabric', type: 'modded' },
  { value: 'forge', label: 'Forge', type: 'modded' },
  { value: 'neoforge', label: 'NeoForge', type: 'modded' },
  { value: 'velocity', label: 'Velocity', type: 'proxy' },
  { value: 'bungeecord', label: 'BungeeCord', type: 'proxy' },
  { value: 'waterfall', label: 'Waterfall', type: 'proxy' },
];

// Compatibility matrix - based on public knowledge as of 2024
// status: 'verified' = actively maintained and tested
// 'unverified' = likely works but not officially confirmed
// 'unsupported' = known not to work
// 'eol' = end of life, no updates
const COMPATIBILITY_DATA: CompatibilityEntry[] = [
  // Paper
  { version: '1.21.1', software: 'paper', status: 'verified', lastVerified: '2024-08' },
  { version: '1.20.4', software: 'paper', status: 'verified', lastVerified: '2024-03' },
  { version: '1.19.4', software: 'paper', status: 'verified', lastVerified: '2023-12' },
  { version: '1.18.2', software: 'paper', status: 'verified', lastVerified: '2023-06' },
  { version: '1.17.1', software: 'paper', status: 'verified', lastVerified: '2022-12' },
  { version: '1.16.5', software: 'paper', status: 'verified', lastVerified: '2022-06' },
  { version: '1.15.2', software: 'paper', status: 'eol', notes: 'No longer updated' },
  { version: '1.14.4', software: 'paper', status: 'eol', notes: 'No longer updated' },
  { version: '1.13.2', software: 'paper', status: 'eol', notes: 'No longer updated' },
  { version: '1.12.2', software: 'paper', status: 'eol', notes: 'No longer updated' },

  // Spigot
  { version: '1.21.1', software: 'spigot', status: 'verified', lastVerified: '2024-08' },
  { version: '1.20.4', software: 'spigot', status: 'verified', lastVerified: '2024-03' },
  { version: '1.19.4', software: 'spigot', status: 'verified', lastVerified: '2023-12' },
  { version: '1.18.2', software: 'spigot', status: 'verified', lastVerified: '2023-06' },
  { version: '1.17.1', software: 'spigot', status: 'verified', lastVerified: '2022-12' },
  { version: '1.16.5', software: 'spigot', status: 'verified', lastVerified: '2022-06' },
  { version: '1.15.2', software: 'spigot', status: 'eol' },
  { version: '1.14.4', software: 'spigot', status: 'eol' },
  { version: '1.13.2', software: 'spigot', status: 'eol' },
  { version: '1.12.2', software: 'spigot', status: 'eol' },

  // Purpur
  { version: '1.21.1', software: 'purpur', status: 'verified', lastVerified: '2024-08' },
  { version: '1.20.4', software: 'purpur', status: 'verified', lastVerified: '2024-03' },
  { version: '1.19.4', software: 'purpur', status: 'verified', lastVerified: '2023-12' },
  { version: '1.18.2', software: 'purpur', status: 'verified', lastVerified: '2023-06' },
  { version: '1.17.1', software: 'purpur', status: 'verified', lastVerified: '2022-12' },
  { version: '1.16.5', software: 'purpur', status: 'verified', lastVerified: '2022-06' },
  { version: '1.15.2', software: 'purpur', status: 'unsupported' },
  { version: '1.14.4', software: 'purpur', status: 'unsupported' },
  { version: '1.13.2', software: 'purpur', status: 'unsupported' },
  { version: '1.12.2', software: 'purpur', status: 'unsupported' },

  // Folia
  { version: '1.21.1', software: 'folia', status: 'verified', lastVerified: '2024-08' },
  { version: '1.20.4', software: 'folia', status: 'verified', lastVerified: '2024-03' },
  { version: '1.19.4', software: 'folia', status: 'verified', lastVerified: '2023-12' },
  { version: '1.18.2', software: 'folia', status: 'unverified', notes: 'Early support' },
  { version: '1.17.1', software: 'folia', status: 'unsupported' },
  { version: '1.16.5', software: 'folia', status: 'unsupported' },

  // Fabric
  { version: '1.21.1', software: 'fabric', status: 'verified', lastVerified: '2024-08' },
  { version: '1.20.4', software: 'fabric', status: 'verified', lastVerified: '2024-03' },
  { version: '1.19.4', software: 'fabric', status: 'verified', lastVerified: '2023-12' },
  { version: '1.18.2', software: 'fabric', status: 'verified', lastVerified: '2022-06' },
  { version: '1.17.1', software: 'fabric', status: 'verified', lastVerified: '2021-12' },
  { version: '1.16.5', software: 'fabric', status: 'verified', lastVerified: '2021-06' },
  { version: '1.15.2', software: 'fabric', status: 'eol' },
  { version: '1.14.4', software: 'fabric', status: 'eol' },

  // Forge
  { version: '1.21.1', software: 'forge', status: 'verified', lastVerified: '2024-08', notes: 'Use NeoForge for 1.20.5+' },
  { version: '1.20.4', software: 'forge', status: 'verified', lastVerified: '2024-03' },
  { version: '1.19.4', software: 'forge', status: 'verified', lastVerified: '2023-12' },
  { version: '1.18.2', software: 'forge', status: 'verified', lastVerified: '2022-06' },
  { version: '1.17.1', software: 'forge', status: 'verified', lastVerified: '2021-12' },
  { version: '1.16.5', software: 'forge', status: 'verified', lastVerified: '2021-06' },
  { version: '1.15.2', software: 'forge', status: 'eol' },
  { version: '1.14.4', software: 'forge', status: 'eol' },
  { version: '1.12.2', software: 'forge', status: 'eol', notes: 'Legacy, community maintained' },

  // NeoForge
  { version: '1.21.1', software: 'neoforge', status: 'verified', lastVerified: '2024-08' },
  { version: '1.20.4', software: 'neoforge', status: 'verified', lastVerified: '2024-03' },
  { version: '1.20.1', software: 'neoforge', status: 'verified', lastVerified: '2023-09', notes: 'First NeoForge version' },
  { version: '1.19.4', software: 'neoforge', status: 'unsupported' },
  { version: '1.18.2', software: 'neoforge', status: 'unsupported' },

  // Velocity
  { version: '1.21.1', software: 'velocity', status: 'verified', lastVerified: '2024-08', notes: 'Supports 1.13+' },
  { version: '1.20.4', software: 'velocity', status: 'verified', lastVerified: '2024-03' },
  { version: '1.19.4', software: 'velocity', status: 'verified', lastVerified: '2023-12' },
  { version: '1.18.2', software: 'velocity', status: 'verified', lastVerified: '2022-06' },
  { version: '1.17.1', software: 'velocity', status: 'verified', lastVerified: '2021-12' },
  { version: '1.16.5', software: 'velocity', status: 'verified', lastVerified: '2021-06' },
  { version: '1.13.2', software: 'velocity', status: 'verified', lastVerified: '2020-06', notes: 'Minimum version 1.13' },
  { version: '1.12.2', software: 'velocity', status: 'unsupported', notes: 'Use Waterfall or BungeeCord' },

  // BungeeCord
  { version: '1.21.1', software: 'bungeecord', status: 'unverified', notes: 'Community builds only' },
  { version: '1.20.4', software: 'bungeecord', status: 'unverified', notes: 'Community builds only' },
  { version: '1.19.4', software: 'bungeecord', status: 'verified', lastVerified: '2023-12' },
  { version: '1.18.2', software: 'bungeecord', status: 'verified', lastVerified: '2022-06' },
  { version: '1.17.1', software: 'bungeecord', status: 'verified', lastVerified: '2021-12' },
  { version: '1.16.5', software: 'bungeecord', status: 'verified', lastVerified: '2021-06' },
  { version: '1.12.2', software: 'bungeecord', status: 'verified', lastVerified: '2020-06' },

  // Waterfall
  { version: '1.21.1', software: 'waterfall', status: 'verified', lastVerified: '2024-08' },
  { version: '1.20.4', software: 'waterfall', status: 'verified', lastVerified: '2024-03' },
  { version: '1.19.4', software: 'waterfall', status: 'verified', lastVerified: '2023-12' },
  { version: '1.18.2', software: 'waterfall', status: 'verified', lastVerified: '2022-06' },
  { version: '1.17.1', software: 'waterfall', status: 'verified', lastVerified: '2021-12' },
  { version: '1.16.5', software: 'waterfall', status: 'verified', lastVerified: '2021-06' },
  { version: '1.13.2', software: 'waterfall', status: 'verified', lastVerified: '2020-06' },
  { version: '1.12.2', software: 'waterfall', status: 'verified', lastVerified: '2020-06' },
];

const STATUS_CONFIG = {
  verified: { label: 'Verified', color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-300 dark:border-green-700', icon: '✅' },
  unverified: { label: 'Unverified', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700', icon: '⚠️' },
  unsupported: { label: 'Unsupported', color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 border-red-300 dark:border-red-700', icon: '❌' },
  eol: { label: 'End of Life', color: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border-zinc-300 dark:border-zinc-600', icon: '🛑' },
} as const;

function getStatusConfig(status: CompatibilityEntry['status']) {
  return STATUS_CONFIG[status];
}

export default function CompatibilityHelper() {
  const [selectedVersion, setSelectedVersion] = useState<MCVersion>('1.21.1');
  const [selectedSoftware, setSelectedSoftware] = useState<ServerSoftware[]>(['paper', 'purpur', 'velocity']);

  const results = useMemo(() => {
    return selectedSoftware.map(software => {
      const entry = COMPATIBILITY_DATA.find(
        e => e.version === selectedVersion && e.software === software
      );
      return {
        software,
        label: SOFTWARE.find(s => s.value === software)?.label || software,
        type: SOFTWARE.find(s => s.value === software)?.type || 'bukkit',
        status: entry?.status || 'unverified',
        notes: entry?.notes,
        lastVerified: entry?.lastVerified,
      };
    });
  }, [selectedVersion, selectedSoftware]);

  const versionHistory = useMemo(() => {
    return SOFTWARE.map(s => {
      const entries = COMPATIBILITY_DATA.filter(e => e.software === s.value).sort((a, b) => 
        VERSIONS.indexOf(b.version) - VERSIONS.indexOf(a.version)
      );
      return { software: s.value, label: s.label, type: s.type, entries };
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Compatibility Helper</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Check Minecraft version compatibility with server software. 
          <strong className="text-amber-600">Data is based on public releases — not live queries.</strong>
          Always verify with official sources before deploying.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Minecraft Version</label>
          <select
            value={selectedVersion}
            onChange={e => setSelectedVersion(e.target.value as MCVersion)}
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-800"
          >
            {VERSIONS.map(v => <option key={v} value={v}>{v === 'latest' ? 'Latest (1.21.1)' : v}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Server Software (multiple)</label>
          <div className="max-h-40 overflow-y-auto border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-800 p-2 space-y-1">
            {SOFTWARE.map(s => (
              <label key={s.value} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedSoftware.includes(s.value)}
                  onChange={e => setSelectedSoftware(
                    e.target.checked 
                      ? [...selectedSoftware, s.value] 
                      : selectedSoftware.filter(v => v !== s.value)
                  )}
                  className="w-4 h-4 text-blue-600 border-zinc-300 rounded focus:ring-blue-500"
                />
                <span>{s.label}</span>
                <span className="text-xs text-zinc-400 ml-auto">{s.type}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="flex items-end">
          <button 
            onClick={() => setSelectedSoftware(SOFTWARE.map(s => s.value))}
            className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-sm"
          >
            Select All
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-medium">Compatibility Results for {selectedVersion}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700">
                <th className="text-left p-3 font-medium">Software</th>
                <th className="text-left p-3 font-medium">Type</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Last Verified</th>
                <th className="text-left p-3 font-medium">Notes</th>
              </tr>
            </thead>
            <tbody>
              {results.map(r => (
                <tr key={r.software} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="p-3 font-mono font-medium">{r.label}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 text-xs bg-zinc-100 dark:bg-zinc-800 rounded">{r.type}</span>
                  </td>
                  <td className="p-3">
                    {(() => {
                      const config = getStatusConfig(r.status);
                      return <span className={`px-2 py-0.5 text-xs rounded border ${config.color}`}>
                        {config.icon} {config.label}
                      </span>;
                    })()}
                  </td>
                  <td className="p-3 font-mono text-xs text-zinc-500">{r.lastVerified || '—'}</td>
                  <td className="p-3 text-zinc-600 dark:text-zinc-400">{r.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="border-t border-zinc-200 dark:border-zinc-700 pt-6">
        <h3 className="font-medium mb-4">Full Compatibility Matrix</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700 sticky top-0 bg-white dark:bg-zinc-900">
                <th className="text-left p-2 font-medium">Software</th>
                {VERSIONS.map(v => (
                  <th key={v} className="text-center p-2 font-medium w-20">{v === 'latest' ? 'Latest' : v}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {versionHistory.map(({ software, label, type, entries }) => (
                <tr key={software} className="border-b border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                  <td className="p-2 font-medium font-mono">{label} <span className="text-zinc-400 text-xs">({type})</span></td>
                  {VERSIONS.map(version => {
                    const entry = entries.find(e => e.version === version);
                    const status = entry?.status || 'unverified';
                    const config = STATUS_CONFIG[status];
                    return (
                      <td key={version} className="text-center p-1">
                        <span 
                          className={`px-1.5 py-0.5 text-[10px] rounded ${config.color}`}
                          title={`${config.label}${entry?.notes ? ': ' + entry.notes : ''}${entry?.lastVerified ? ' (verified ' + entry.lastVerified + ')' : ''}`}
                        >
                          {config.icon}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-lg text-sm text-zinc-600 dark:text-zinc-400 space-y-2">
          <h4 className="font-medium">Legend & Notes</h4>
          <div className="flex flex-wrap gap-4">
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <span key={key} className={`px-2 py-0.5 text-xs rounded border ${config.color}`}>
                {config.icon} {config.label}
              </span>
            ))}
          </div>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Verified:</strong> Actively maintained, recent releases confirmed working</li>
            <li><strong>Unverified:</strong> Likely compatible but no recent official confirmation — test before production</li>
            <li><strong>Unsupported:</strong> Known not to work or no build exists for this version</li>
            <li><strong>End of Life:</strong> No longer receiving updates or security patches</li>
            <li>Proxy software (Velocity, Waterfall, BungeeCord) connects multiple backend versions</li>
            <li>Folia requires 1.18.2+ for regionized multithreading support</li>
            <li>NeoForge replaced Forge for 1.20.5+ — use Forge for 1.20.4 and below</li>
            <li>Data current as of 2024 — check official sites for latest status</li>
          </ul>
          <p className="text-red-600 dark:text-red-400"><strong>Disclaimer:</strong> This tool does not query live APIs. Data is static and may be outdated. Always verify with official project websites.</p>
        </div>
      </div>
    </div>
  );
}