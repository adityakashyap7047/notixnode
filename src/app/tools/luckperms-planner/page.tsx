"use client";

import { useState } from 'react';

interface Group {
  id: string;
  name: string;
  displayName: string;
  prefix: string;
  suffix: string;
  weight: number;
  parents: string[];
  permissions: string[];
  worlds: Record<string, string[]>; // world -> permissions
}

const DEFAULT_PERMISSIONS = [
  'minecraft.command.help',
  'minecraft.command.me',
  'minecraft.command.msg',
  'minecraft.command.tell',
  'minecraft.command.spawn',
  'minecraft.command.home',
  'minecraft.command.tpa',
  'minecraft.command.tpaccept',
  'minecraft.command.tpdeny',
  'minecraft.command.back',
  'minecraft.command.kit',
  'minecraft.command.warp',
  'essentials.spawn',
  'essentials.home',
  'essentials.sethome',
  'essentials.tpa',
  'essentials.tpaccept',
  'essentials.tpdeny',
  'essentials.back',
  'essentials.kit',
  'essentials.warp',
  'essentials.heal',
  'essentials.feed',
  'essentials.gamemode',
  'essentials.gamemode.survival',
  'essentials.gamemode.creative',
  'essentials.fly',
  'essentials.speed',
  'essentials.god',
  'essentials.vanish',
  'essentials.kick',
  'essentials.ban',
  'essentials.mute',
  'essentials.warn',
  'luckperms.user.info',
  'luckperms.user.editor',
  'luckperms.group.info',
  'luckperms.group.editor',
  'worldedit.*',
  'worldguard.region.*',
];

const WEIGHTS = [
  { value: 0, label: 'Default (0)' },
  { value: 100, label: 'Member (100)' },
  { value: 500, label: 'Donator (500)' },
  { value: 1000, label: 'Moderator (1000)' },
  { value: 2000, label: 'Admin (2000)' },
  { value: 3000, label: 'Owner (3000)' },
];

export default function LuckPermsPlanner() {
  const [groups, setGroups] = useState<Group[]>([
    {
      id: 'default',
      name: 'default',
      displayName: 'Default',
      prefix: '&7',
      suffix: '',
      weight: 0,
      parents: [],
      permissions: [
        'minecraft.command.help',
        'minecraft.command.me',
        'minecraft.command.msg',
        'essentials.spawn',
        'essentials.home',
        'essentials.tpa',
        'essentials.kit.starter',
      ],
      worlds: {},
    },
    {
      id: 'vip',
      name: 'vip',
      displayName: 'VIP',
      prefix: '&6[VIP] &r',
      suffix: '',
      weight: 500,
      parents: ['default'],
      permissions: [
        'essentials.fly',
        'essentials.speed',
        'essentials.heal',
        'essentials.feed',
        'essentials.gamemode',
        'essentials.gamemode.creative',
        'essentials.kit.vip',
        'worldedit.*',
      ],
      worlds: {},
    },
    {
      id: 'moderator',
      name: 'moderator',
      displayName: 'Moderator',
      prefix: '&c[Mod] &r',
      suffix: '',
      weight: 1000,
      parents: ['vip'],
      permissions: [
        'essentials.kick',
        'essentials.ban',
        'essentials.mute',
        'essentials.warn',
        'essentials.vanish',
        'essentials.god',
        'luckperms.user.info',
        'luckperms.user.editor',
        'worldguard.region.*',
      ],
      worlds: {},
    },
    {
      id: 'admin',
      name: 'admin',
      displayName: 'Admin',
      prefix: '&4[Admin] &r',
      suffix: '',
      weight: 2000,
      parents: ['moderator'],
      permissions: ['*'],
      worlds: {},
    },
  ]);

  const [exportFormat, setExportFormat] = useState<'commands' | 'yaml' | 'json'>('commands');

  const addGroup = () => {
    const newGroup: Group = {
      id: `group-${Date.now()}`,
      name: `group${groups.length + 1}`,
      displayName: `Group ${groups.length + 1}`,
      prefix: '',
      suffix: '',
      weight: groups.length * 500,
      parents: [],
      permissions: [],
      worlds: {},
    };
    setGroups([...groups, newGroup]);
  };

  const removeGroup = (id: string) => {
    if (groups.length <= 1) return;
    setGroups(groups.filter(g => g.id !== id));
    // Remove from parents
    setGroups(groups.map(g => ({
      ...g,
      parents: g.parents.filter(p => p !== id),
    })));
  };

  const updateGroup = (id: string, updates: Partial<Group>) => {
    setGroups(groups.map(g => g.id === id ? { ...g, ...updates } : g));
  };

  const addPermission = (groupId: string, permission: string) => {
    setGroups(groups.map(g => {
      if (g.id !== groupId) return g;
      if (g.permissions.includes(permission)) return g;
      return { ...g, permissions: [...g.permissions, permission].sort() };
    }));
  };

  const removePermission = (groupId: string, permission: string) => {
    setGroups(groups.map(g => g.id === groupId ? { ...g, permissions: g.permissions.filter(p => p !== permission) } : g));
  };

  const addParent = (groupId: string, parent: string) => {
    if (parent === groupId) return;
    setGroups(groups.map(g => {
      if (g.id !== groupId) return g;
      if (g.parents.includes(parent)) return g;
      // Check for circular dependency
      const visited = new Set<string>();
      let current = parent;
      while (current) {
        if (current === groupId) return g; // Circular!
        visited.add(current);
        const parentGroup = groups.find(pg => pg.name === current);
        current = parentGroup?.parents[0] || '';
      }
      return { ...g, parents: [...g.parents, parent] };
    }));
  };

  const removeParent = (groupId: string, parent: string) => {
    setGroups(groups.map(g => g.id === groupId ? { ...g, parents: g.parents.filter(p => p !== parent) } : g));
  };

  const generateCommands = (): string => {
    const lines = [
      '# LuckPerms Setup Commands',
      '# Generated by NOTIXNODE LuckPerms Planner',
      `# Date: ${new Date().toISOString()}`,
      '# Run these commands in-game or console',
      '# Note: Group names are case-sensitive',
      '',
    ];

    // Create groups in weight order
    const sortedGroups = [...groups].sort((a, b) => a.weight - b.weight);

    sortedGroups.forEach(group => {
      lines.push(`# --- ${group.displayName} (${group.name}) ---`);
      lines.push(`/lp creategroup ${group.name}`);
      if (group.displayName !== group.name) {
        lines.push(`/lp group ${group.name} meta setprefix 100 "${group.prefix}"`);
        lines.push(`/lp group ${group.name} meta setsuffix 100 "${group.suffix}"`);
      }
      lines.push(`/lp group ${group.name} weight ${group.weight}`);

      group.parents.forEach(parent => {
        lines.push(`/lp group ${group.name} parent add ${parent}`);
      });

      group.permissions.forEach(perm => {
        lines.push(`/lp group ${group.name} permission set ${perm} true`);
      });

      // World-specific permissions
      Object.entries(group.worlds).forEach(([world, perms]) => {
        perms.forEach(perm => {
          lines.push(`/lp group ${group.name} permission set ${perm} true ${world}`);
        });
      });

      lines.push('');
    });

    lines.push('# --- Assign users to groups ---');
    lines.push('# /lp user <username> parent add <group>');
    lines.push('# Example: /lp user Notch parent add admin');

    return lines.join('\n');
  };

  const generateYaml = (): string => {
    const data = groups.map(g => ({
      name: g.name,
      display_name: g.displayName,
      prefix: g.prefix,
      suffix: g.suffix,
      weight: g.weight,
      parents: g.parents,
      permissions: g.permissions,
      worlds: g.worlds,
    }));
    return '# LuckPerms YAML Export\n' + JSON.stringify(data, null, 2).replace(/"/g, '').replace(/,/g, '\n');
  };

  const generateJson = (): string => {
    return JSON.stringify(groups, null, 2);
  };

  const copyExport = async () => {
    let content = '';
    switch (exportFormat) {
      case 'commands': content = generateCommands(); break;
      case 'yaml': content = generateYaml(); break;
      case 'json': content = generateJson(); break;
    }
    await navigator.clipboard.writeText(content);
  };

  const downloadExport = () => {
    let content = '';
    let filename = '';
    switch (exportFormat) {
      case 'commands': content = generateCommands(); filename = 'luckperms-setup.txt'; break;
      case 'yaml': content = generateYaml(); filename = 'luckperms-groups.yml'; break;
      case 'json': content = generateJson(); filename = 'luckperms-groups.json'; break;
    }
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">LuckPerms Permission Planner</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Plan group hierarchy, inheritance, and permissions. Export as LuckPerms commands, YAML, or JSON.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <div className="flex gap-2">
            <button onClick={addGroup} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">+ Add Group</button>
          </div>

          <div className="space-y-3">
            {groups.map((group, index) => (
              <div key={group.id} className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-3 bg-white dark:bg-zinc-900">
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="text"
                    value={group.name}
                    onChange={e => updateGroup(group.id, { name: e.target.value })}
                    className="flex-1 text-sm font-mono p-1 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-800"
                    placeholder="groupname"
                  />
                  <input
                    type="text"
                    value={group.displayName}
                    onChange={e => updateGroup(group.id, { displayName: e.target.value })}
                    className="flex-1 text-sm p-1 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-800"
                    placeholder="Display Name"
                  />
                  {groups.length > 1 && (
                    <button onClick={() => removeGroup(group.id)} className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded" title="Remove group">✕</button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Weight</label>
                    <select
                      value={group.weight}
                      onChange={e => updateGroup(group.id, { weight: parseInt(e.target.value) })}
                      className="w-full text-sm p-1 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-800"
                    >
                      {WEIGHTS.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-500 mb-1">Prefix</label>
                    <input
                      type="text"
                      value={group.prefix}
                      onChange={e => updateGroup(group.id, { prefix: e.target.value })}
                      className="w-full text-sm font-mono p-1 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-800"
                      placeholder="&6[VIP] &r"
                    />
                  </div>
                </div>

                <div className="mb-2">
                  <label className="block text-xs text-zinc-500 mb-1">Suffix</label>
                  <input
                    type="text"
                    value={group.suffix}
                    onChange={e => updateGroup(group.id, { suffix: e.target.value })}
                    className="w-full text-sm font-mono p-1 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-800"
                    placeholder="&7✦"
                  />
                </div>

                <div className="mb-2">
                  <label className="block text-xs text-zinc-500 mb-1">Inherits From</label>
                  <div className="flex gap-1 flex-wrap">
                    {groups.filter(g => g.id !== group.id).map(g => (
                      <span key={g.id} className={`px-2 py-0.5 text-xs rounded border ${group.parents.includes(g.name) ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-400' : 'border-zinc-300 dark:border-zinc-600'}`}>
                        {g.displayName} ({g.name})
                        <button onClick={() => group.parents.includes(g.name) ? removeParent(group.id, g.name) : addParent(group.id, g.name)} className="ml-1">{group.parents.includes(g.name) ? '✕' : '+'}</button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-2">
                  <label className="block text-xs text-zinc-500 mb-1">Permissions</label>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {group.permissions.map(perm => (
                      <span key={perm} className="inline-block px-2 py-0.5 text-xs font-mono bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-200 dark:border-zinc-700">
                        {perm}
                        <button onClick={() => removePermission(group.id, perm)} className="ml-1 text-red-500 hover:text-red-700">✕</button>
                      </span>
                    ))}
                    {group.permissions.length === 0 && <span className="text-xs text-zinc-400">No permissions</span>}
                  </div>
                  <div className="mt-1">
                    <input
                      type="text"
                      placeholder="Add permission (e.g., essentials.fly)"
                      onKeyDown={e => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          addPermission(group.id, e.currentTarget.value.trim());
                          (e.currentTarget as HTMLInputElement).value = '';
                        }
                      }}
                      className="w-full text-sm p-1 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-800"
                    />
                  </div>
                </div>

                <details className="text-sm">
                  <summary className="text-zinc-500 cursor-pointer">World-specific permissions</summary>
                  <div className="mt-1 space-y-1">
                    {/* Simplified - would add world permission UI */}
                    <p className="text-xs text-zinc-400">Configure per-world permissions in exported commands</p>
                  </div>
                </details>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-2 items-center">
            <label className="text-sm">Export Format:</label>
            <select value={exportFormat} onChange={e => setExportFormat(e.target.value as any)} className="px-3 py-1 border border-zinc-300 dark:border-zinc-600 rounded bg-white dark:bg-zinc-800 text-sm">
              <option value="commands">LuckPerms Commands (.txt)</option>
              <option value="yaml">YAML (.yml)</option>
              <option value="json">JSON (.json)</option>
            </select>
            <button onClick={copyExport} className="px-4 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm">Copy</button>
            <button onClick={downloadExport} className="px-4 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-sm">Download</button>
          </div>

          <div className="h-[500px] overflow-auto">
            <pre className="w-full p-4 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-black/95 text-green-300 text-sm font-mono whitespace-pre-wrap">
              {exportFormat === 'commands' ? generateCommands() : exportFormat === 'yaml' ? generateYaml() : generateJson()}
            </pre>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm space-y-2">
            <h4 className="font-medium">Usage Notes</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Groups are created in weight order (lowest first)</li>
              <li>Inheritance: child groups inherit permissions from parents</li>
              <li>Prefix/suffix use & formatting codes (same as Rank Prefix Previewer)</li>
              <li>Weight determines group priority for display and inheritance resolution</li>
              <li><strong>Never run commands blindly</strong> — review each line first</li>
              <li>Use <code>/lp log recent</code> to debug permission issues</li>
              <li>For production, use <code>/lp editor</code> or web editor for validation</li>
            </ul>
            <p className="text-red-600 dark:text-red-400"><strong>Warning:</strong> This tool generates commands only. It does NOT connect to or modify any live server.</p>
          </div>
        </div>
      </div>
    </div>
  );
}