"use client";

import { useState } from 'react';

interface CalculatorInput {
  playerCount: number;
  pluginCount: number;
  gameMode: 'survival' | 'creative' | 'minigames' | 'modded' | 'proxy';
  activityLevel: 'low' | 'medium' | 'high';
  worldSize: 'small' | 'medium' | 'large' | 'huge';
  useDatabase: boolean;
  useProxy: boolean;
}

interface CalculatorResult {
  ramMin: number;
  ramRecommended: number;
  ramOptimal: number;
  cpuCores: number;
  cpuThreads: number;
  storageGB: number;
  bandwidthMbps: number;
  notes: string[];
  warnings: string[];
}

const GAME_MODE_BASE = {
  survival: { ram: 1.5, cpu: 1.0, description: 'Standard survival with moderate entities' },
  creative: { ram: 1.0, cpu: 0.8, description: 'Lower entity count, more building' },
  minigames: { ram: 2.0, cpu: 1.5, description: 'High player density, frequent world resets' },
  modded: { ram: 3.0, cpu: 1.3, description: 'Mods add significant overhead' },
  proxy: { ram: 0.5, cpu: 0.5, description: 'Velocity/BungeeCord - minimal per player' },
};

const ACTIVITY_MULTIPLIER = {
  low: 0.8,
  medium: 1.0,
  high: 1.4,
};

const WORLD_SIZE_MULTIPLIER = {
  small: 0.8,    // < 5k blocks
  medium: 1.0,   // 5k-15k
  large: 1.3,    // 15k-30k
  huge: 1.6,     // 30k+
};

const PLUGIN_OVERHEAD = {
  low: 0.1,      // < 20 plugins
  medium: 0.25,  // 20-50
  high: 0.5,     // 50-100
  veryHigh: 0.8, // 100+
};

export default function ResourceCalculator() {
  const [input, setInput] = useState<CalculatorInput>({
    playerCount: 20,
    pluginCount: 30,
    gameMode: 'survival',
    activityLevel: 'medium',
    worldSize: 'medium',
    useDatabase: true,
    useProxy: false,
  });

  const [result, setResult] = useState<CalculatorResult | null>(null);

  const calculate = () => {
    const base = GAME_MODE_BASE[input.gameMode];
    const activity = ACTIVITY_MULTIPLIER[input.activityLevel];
    const world = WORLD_SIZE_MULTIPLIER[input.worldSize];

    // Base RAM per player
    let ramPerPlayer = base.ram * activity * world;

    // Plugin overhead
    let pluginFactor = PLUGIN_OVERHEAD.low;
    if (input.pluginCount >= 100) pluginFactor = PLUGIN_OVERHEAD.veryHigh;
    else if (input.pluginCount >= 50) pluginFactor = PLUGIN_OVERHEAD.high;
    else if (input.pluginCount >= 20) pluginFactor = PLUGIN_OVERHEAD.medium;

    ramPerPlayer *= (1 + pluginFactor);

    // Database overhead
    if (input.useDatabase) {
      ramPerPlayer *= 1.15;
    }

    // Proxy overhead (if not proxy mode)
    if (input.useProxy && input.gameMode !== 'proxy') {
      ramPerPlayer *= 1.05;
    }

    // Calculate totals
    const baseRam = Math.max(2, Math.ceil(input.playerCount * ramPerPlayer));
    const minRam = Math.max(2, Math.ceil(baseRam * 0.7));
    const recommendedRam = baseRam;
    const optimalRam = Math.ceil(baseRam * 1.3);

    // CPU
    const cpuBase = base.cpu * activity;
    const cpuCores = Math.max(2, Math.ceil(input.playerCount / 50 * cpuBase));
    const cpuThreads = cpuCores * 2;

    // Storage
    let storagePerPlayer = 0.1; // GB per player
    if (input.worldSize === 'large') storagePerPlayer = 0.2;
    if (input.worldSize === 'huge') storagePerPlayer = 0.4;
    const storageGB = Math.ceil(2 + input.playerCount * storagePerPlayer + (input.useDatabase ? 2 : 0));

    // Bandwidth (Mbps)
    const bandwidthPerPlayer = input.gameMode === 'minigames' ? 0.5 : 0.2;
    const bandwidthMbps = Math.ceil(input.playerCount * bandwidthPerPlayer * 1.5);

    // Notes and warnings
    const notes: string[] = [
      `Base mode: ${input.gameMode} (${base.description})`,
      `Activity multiplier: ${activity}x`,
      `World size multiplier: ${world}x`,
      `Plugin overhead: ${Math.round(pluginFactor * 100)}%`,
      input.useDatabase ? 'MySQL/MariaDB included in estimate' : 'No external database',
      input.useProxy && input.gameMode !== 'proxy' ? 'Proxy (Velocity/BungeeCord) overhead included' : '',
      'Estimates assume Paper/Purpur with Aikars flags',
      'Actual requirements vary — always test with your specific setup',
    ].filter(Boolean);

    const warnings: string[] = [];
    if (input.playerCount > 100 && input.gameMode === 'survival') {
      warnings.push('Large survival servers may need multiple worlds or sharding');
    }
    if (input.pluginCount > 80) {
      warnings.push('High plugin count — consider plugin audit and optimization');
    }
    if (input.gameMode === 'modded' && input.playerCount > 30) {
      warnings.push('Modded servers with many players need significantly more RAM');
    }
    if (recommendedRam > 32) {
      warnings.push('RAM > 32GB — consider multiple instances or dedicated hardware');
    }
    if (input.useDatabase && input.playerCount > 200) {
      warnings.push('High player count with database — consider dedicated DB server');
    }

    setResult({
      ramMin: minRam,
      ramRecommended: recommendedRam,
      ramOptimal: optimalRam,
      cpuCores,
      cpuThreads,
      storageGB,
      bandwidthMbps,
      notes,
      warnings,
    });
  };

  const copyResult = async () => {
    if (!result) return;
    const text = `NOTIXNODE Server Resource Calculator Results
===============================
Players: ${input.playerCount}
Plugins: ${input.pluginCount}
Game Mode: ${input.gameMode}
Activity: ${input.activityLevel}
World Size: ${input.worldSize}
Database: ${input.useDatabase ? 'Yes' : 'No'}
Proxy: ${input.useProxy ? 'Yes' : 'No'}

RAM:
  Minimum: ${result.ramMin} GB
  Recommended: ${result.ramRecommended} GB
  Optimal: ${result.ramOptimal} GB

CPU: ${result.cpuCores} cores / ${result.cpuThreads} threads
Storage: ${result.storageGB} GB SSD
Bandwidth: ${result.bandwidthMbps} Mbps

Notes:
${result.notes.map(n => '  - ' + n).join('\n')}

Warnings:
${result.warnings.map(w => '  ⚠ ' + w).join('\n')}

Generated: ${new Date().toISOString()}
Disclaimer: These are rough estimates. Actual requirements depend on workload, plugins, and testing.
`;
    await navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Server Resource Calculator</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Estimate RAM, CPU, storage, and bandwidth needs. <strong className="text-red-600">These are rough planning estimates — not guarantees.</strong> Always test with your actual workload.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg space-y-4">
            <h3 className="font-medium text-lg">Server Configuration</h3>

            <div>
              <label className="block text-sm font-medium mb-1">Expected Peak Players</label>
              <input
                type="number"
                value={input.playerCount}
                onChange={e => setInput({ ...input, playerCount: Math.max(1, parseInt(e.target.value) || 1) })}
                min={1}
                max={1000}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Plugin Count</label>
              <input
                type="number"
                value={input.pluginCount}
                onChange={e => setInput({ ...input, pluginCount: Math.max(0, parseInt(e.target.value) || 0) })}
                min={0}
                max={200}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Game Mode</label>
              <select
                value={input.gameMode}
                onChange={e => setInput({ ...input, gameMode: e.target.value as CalculatorInput['gameMode'] })}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-800"
              >
                <option value="survival">Survival / SMP</option>
                <option value="creative">Creative</option>
                <option value="minigames">Minigames / Lobby</option>
                <option value="modded">Modded (Forge/Fabric/NeoForge)</option>
                <option value="proxy">Proxy (Velocity/BungeeCord)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Player Activity Level</label>
              <select
                value={input.activityLevel}
                onChange={e => setInput({ ...input, activityLevel: e.target.value as CalculatorInput['activityLevel'] })}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-800"
              >
                <option value="low">Low (casual, AFK-heavy)</option>
                <option value="medium">Medium (standard gameplay)</option>
                <option value="high">High (competitive, redstone, farms)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">World Size</label>
              <select
                value={input.worldSize}
                onChange={e => setInput({ ...input, worldSize: e.target.value as CalculatorInput['worldSize'] })}
                className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-800"
              >
                <option value="small">{'Small (< 5k blocks radius)'}</option>
                <option value="medium">Medium (5k-15k blocks)</option>
                <option value="large">Large (15k-30k blocks)</option>
                <option value="huge">{'Huge (> 30k blocks)'}</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={input.useDatabase}
                  onChange={e => setInput({ ...input, useDatabase: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-zinc-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm">External Database (MySQL/MariaDB)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={input.useProxy}
                  onChange={e => setInput({ ...input, useProxy: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-zinc-300 rounded focus:ring-blue-500"
                  disabled={input.gameMode === 'proxy'}
                />
                <span className="text-sm">Using Proxy (Velocity/BungeeCord)</span>
              </label>
            </div>

            <button onClick={calculate} className="w-full px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium text-lg">
              Calculate Requirements
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {result ? (
            <>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-lg">
                  <div className="text-3xl font-bold">{result.ramRecommended} GB</div>
                  <div className="text-sm opacity-90">Recommended RAM</div>
                  <div className="text-xs opacity-75 mt-1">Min: {result.ramMin} GB | Optimal: {result.ramOptimal} GB</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-500 to-green-700 text-white rounded-lg">
                  <div className="text-3xl font-bold">{result.cpuCores} Cores</div>
                  <div className="text-sm opacity-90">CPU Cores</div>
                  <div className="text-xs opacity-75 mt-1">{result.cpuThreads} Threads</div>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-lg">
                  <div className="text-3xl font-bold">{result.storageGB} GB</div>
                  <div className="text-sm opacity-90">Storage (SSD)</div>
                  <div className="text-xs opacity-75 mt-1">{result.bandwidthMbps} Mbps Bandwidth</div>
                </div>
              </div>

              <div className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg space-y-3">
                <h4 className="font-medium">Calculation Details</h4>
                <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1 list-disc list-inside">
                  {result.notes.map((note, i) => <li key={i}>{note}</li>)}
                </ul>
              </div>

              {result.warnings.length > 0 && (
                <div className="p-4 border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 rounded-lg space-y-2">
                  <h4 className="font-medium text-amber-800 dark:text-amber-200">⚠️ Warnings</h4>
                  <ul className="text-sm text-amber-700 dark:text-amber-300 space-y-1 list-disc list-inside">
                    {result.warnings.map((w, i) => <li key={i}>{w}</li>)}
                  </ul>
                </div>
              )}

              <div className="flex gap-2">
                <button onClick={copyResult} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors">Copy Results</button>
              </div>

            </>
          ) : (
            <div className="p-8 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg text-center text-zinc-500">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-lg">Configure your server and click Calculate</p>
              <p className="text-sm mt-2">Results will appear here with detailed breakdown</p>
            </div>
          )}

          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm space-y-2">
            <h4 className="font-medium text-red-800 dark:text-red-200">⚠️ Important Disclaimers</h4>
            <ul className="list-disc list-inside text-red-700 dark:text-red-300 space-y-1">
              <li>These are <strong>rough estimates</strong> based on typical Paper/Purpur workloads</li>
              <li>Actual RAM usage depends on: specific plugins, chunk loading, entity counts, redstone, database queries</li>
              <li>CPU needs vary wildly — single-thread performance matters more than core count</li>
              <li>Always benchmark with <code>/spark profiler</code> or <code>/timings</code> on a test server</li>
              <li>Add 20-30% headroom for traffic spikes and updates</li>
              <li>Modded servers (Forge/Fabric) often need 2-3x more RAM than vanilla</li>
              <li>Network bandwidth depends on view distance, entity density, and packet size</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}