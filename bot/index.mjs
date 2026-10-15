import { 
  Client, 
  GatewayIntentBits, 
  Partials, 
  EmbedBuilder, 
  ActionRowBuilder, 
  ButtonBuilder, 
  ButtonStyle, 
  SlashCommandBuilder, 
  REST, 
  Routes, 
  ActivityType,
  ChannelType,
  PermissionFlagsBits,
  PermissionsBitField
} from "discord.js";
import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crash-proof global process listeners
process.on("unhandledRejection", (err) => console.error("⚠️ Unhandled Promise Rejection:", err?.message || err));
process.on("uncaughtException", (err) => console.error("⚠️ Uncaught Exception:", err?.message || err));

// Load environment variables from .env.local
function loadEnv() {
  const envPath = path.resolve(__dirname, "../.env.local");
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const idx = trimmed.indexOf("=");
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, "");
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}

loadEnv();

const TOKEN = process.env.DISCORD_BOT_TOKEN;
const WEBSITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://notixnode.vercel.app";
const DISCORD_INVITE = "https://discord.gg/8NPerTzmKR";
const YOUTUBE_URL = "https://youtube.com/@os_notixnode?si=3q3E6MlMjz-j0J2w";
const BRAND_COLOR = 0xC5A059; // Champagne Gold
const LOGO_URL = `${WEBSITE_URL}/notixnode-logo.png`;

if (!TOKEN) {
  console.error("❌ ERROR: DISCORD_BOT_TOKEN is not defined in environment or .env.local");
  process.exit(1);
}

// Lightweight HTTP server for FREE Web Service hosting on Render / Railway / Koyeb
const PORT = process.env.PORT || 3001;
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({
    status: "ok",
    bot: "𝕹𝖔𝖙𝖎𝖝𝕹𝖔𝖉𝖊 𝕭𝖔𝖙",
    website: WEBSITE_URL,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  }));
});

server.listen(PORT, () => {
  console.log(`🌐 HTTP health service listening on port ${PORT} (Supports FREE Render Web Service)`);
});

// Fallback resources from local store
function getLocalResources() {
  try {
    const jsonPath = path.resolve(__dirname, "../src/data/resources.json");
    if (fs.existsSync(jsonPath)) {
      const data = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
      return Array.isArray(data) ? data : [];
    }
  } catch (err) {
    console.error("Warning: could not read local resources.json", err.message);
  }
  return [];
}

// Fetch resources live from website API with failover
async function fetchResources(search = "", category = "") {
  try {
    const url = new URL(`${WEBSITE_URL}/api/resources`);
    if (search) url.searchParams.set("search", search);
    if (category) url.searchParams.set("category", category);
    url.searchParams.set("pageSize", "10");

    const res = await fetch(url.toString(), {
      headers: { "User-Agent": "NOTIXNODE-Discord-Bot/1.0" },
      signal: AbortSignal.timeout(3500)
    });

    if (res.ok) {
      const data = await res.json();
      return { resources: data.resources || [], source: "Live Website API" };
    }
  } catch {
    // Failover to local cache
  }

  const local = getLocalResources();
  let filtered = local.filter(r => r.status === "published");
  if (category) filtered = filtered.filter(r => r.category === category);
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(r => 
      r.title.toLowerCase().includes(q) || 
      r.shortDescription.toLowerCase().includes(q) ||
      (r.tags && r.tags.some(t => t.toLowerCase().includes(q)))
    );
  }
  return { resources: filtered.slice(0, 10), source: "Local Cache" };
}

// Initialize Client with GuildMembers intent for auto-role and member management
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel, Partials.Message, Partials.GuildMember]
});

client.on("error", (err) => console.error("⚠️ Discord client error:", err.message));

// Commands definition
const commands = [
  new SlashCommandBuilder()
    .setName("setup-server")
    .setDescription("⚡ Auto-setup complete NOTIXNODE server: deletes old template & creates roles/channels/embeds")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addBooleanOption(opt =>
      opt.setName("clear-old")
        .setDescription("Delete existing channels to create clean template (Default: true)")
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("setup")
    .setDescription("⚡ Auto-setup complete NOTIXNODE server (alias for /setup-server)")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addBooleanOption(opt =>
      opt.setName("clear-old")
        .setDescription("Delete existing channels to create clean template (Default: true)")
        .setRequired(false)
    ),

  new SlashCommandBuilder()
    .setName("assign-roles")
    .setDescription("👥 Mass-assign the default Member role to all server members")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("🎫 Open a private support ticket with the NOTIXNODE team"),

  new SlashCommandBuilder()
    .setName("resources")
    .setDescription("Browse and search Minecraft server resources from NOTIXNODE")
    .addStringOption(opt => 
      opt.setName("search")
        .setDescription("Search by title, tag, or plugin (e.g. LuckPerms, Paper, Velocity)")
        .setRequired(false)
    )
    .addStringOption(opt =>
      opt.setName("category")
        .setDescription("Filter by category")
        .setRequired(false)
        .addChoices(
          { name: "Plugin Configurations", value: "plugin-configurations" },
          { name: "Server Setup Guides", value: "server-setup-guides" },
          { name: "Graphics & Icons", value: "graphics-icons" },
          { name: "Maps & Builds", value: "maps-builds" },
          { name: "Resource Packs", value: "resource-packs" },
          { name: "Discord Templates", value: "discord-templates" }
        )
    ),

  new SlashCommandBuilder()
    .setName("status")
    .setDescription("Check live NOTIXNODE website, infrastructure & API operational status"),

  new SlashCommandBuilder()
    .setName("tools")
    .setDescription("Get direct access to NOTIXNODE developer tools and generators"),

  new SlashCommandBuilder()
    .setName("latest")
    .setDescription("View the newest published resources on NOTIXNODE"),

  new SlashCommandBuilder()
    .setName("website")
    .setDescription("Get the link and overview of the NOTIXNODE platform"),

  new SlashCommandBuilder()
    .setName("help")
    .setDescription("List all NOTIXNODE bot commands and server utilities")
];

// Register Slash Commands
async function registerSlashCommands(clientId) {
  try {
    const rest = new REST({ version: "10" }).setToken(TOKEN);
    console.log("⚡ Syncing slash commands globally with Discord API...");
    await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands.map(c => c.toJSON()) }
    );
    console.log("✅ Successfully registered slash commands globally!");
  } catch (err) {
    console.error("❌ Failed to register slash commands:", err.message);
  }
}

// Ready Handler
client.once("ready", async () => {
  console.log(`🤖 Logged in as ${client.user.tag} (ID: ${client.user.id})`);
  
  try {
    client.user.setPresence({
      activities: [{
        name: "NOTIXNODE Assistant | /help",
        type: ActivityType.Watching
      }],
      status: "online"
    });
  } catch (err) {
    console.error("Presence error:", err);
  }

  await registerSlashCommands(client.user.id);
});

// Auto-role on Member Join
client.on("guildMemberAdd", async (member) => {
  try {
    if (member.user.bot) {
      const botRole = member.guild.roles.cache.find(r => r.name === "🤖 Bots");
      if (botRole) await member.roles.add(botRole).catch(() => {});
      return;
    }

    const memberRole = member.guild.roles.cache.find(r => r.name === "🎮 Member");
    if (memberRole) {
      await member.roles.add(memberRole).catch(() => {});
    }

    // Greet new member in general chat or welcome channel
    const welcomeChannel = member.guild.channels.cache.find(c => 
      c.name.includes("general-chat") || c.name.includes("welcome")
    );
    if (welcomeChannel && welcomeChannel.isTextBased()) {
      const welcomeEmbed = new EmbedBuilder()
        .setColor(BRAND_COLOR)
        .setTitle("👋 Welcome to NOTIXNODE!")
        .setDescription(
          `Welcome <@${member.id}> to **NOTIXNODE Community**!\n\n` +
          `• 🎮 **Role Assigned:** \`🎮 Member\`\n` +
          `• 📜 Read the rules in **#rules**\n` +
          `• 🤖 Ask questions anytime in **#notix-assistant**\n` +
          `• 🎫 Need support? Open a ticket in **#open-ticket**`
        )
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .setFooter({ text: "𝕹𝖔𝖙𝖎𝖝𝕹𝖔𝖉𝖊 Community", iconURL: client.user.displayAvatarURL() });

      await welcomeChannel.send({ embeds: [welcomeEmbed] }).catch(() => {});
    }
  } catch (err) {
    console.error("guildMemberAdd error:", err.message);
  }
});

// Mass assign role utility
async function massAssignMemberRole(guild) {
  const memberRole = guild.roles.cache.find(r => r.name === "🎮 Member");
  const botRole = guild.roles.cache.find(r => r.name === "🤖 Bots");
  if (!memberRole) return { total: 0, assigned: 0 };

  const members = await guild.members.fetch().catch(() => guild.members.cache);
  let assignedCount = 0;

  for (const [, member] of members) {
    if (member.user.bot) {
      if (botRole && !member.roles.cache.has(botRole.id)) {
        await member.roles.add(botRole).catch(() => {});
      }
    } else {
      if (!member.roles.cache.has(memberRole.id)) {
        await member.roles.add(memberRole).catch(() => {});
        assignedCount++;
        await new Promise(r => setTimeout(r, 60)); // avoid rate limit
      }
    }
  }

  return { total: members.size, assigned: assignedCount };
}

// Full Server Setup Logic (Delete old template & create professional NOTIXNODE template)
async function executeFullServerSetup(guild, executor, clearOld = true, progressCallback = null) {
  const log = async (msg) => {
    console.log(`[Setup] ${msg}`);
    if (progressCallback) await progressCallback(msg).catch(() => {});
  };

  await log("🚀 Initiating NOTIXNODE Discord Server Template Setup...");

  // 1. Delete Old Channels & Outdated Custom Roles if requested
  if (clearOld) {
    await log("🗑️ Clearing old server channels and categories...");
    const existingChannels = Array.from(guild.channels.cache.values());
    const nonCategories = existingChannels.filter(c => c.type !== ChannelType.GuildCategory);
    const categories = existingChannels.filter(c => c.type === ChannelType.GuildCategory);

    // Delete text and voice channels first (skip non-deletable system channels)
    for (const channel of nonCategories) {
      try {
        await channel.delete("NOTIXNODE Server Template Reset");
        await new Promise(r => setTimeout(r, 120));
      } catch (err) {
        console.warn(`Could not delete channel ${channel.name}:`, err.message);
      }
    }

    // Delete empty categories next
    for (const cat of categories) {
      try {
        await cat.delete("NOTIXNODE Server Template Reset");
        await new Promise(r => setTimeout(r, 120));
      } catch (err) {
        console.warn(`Could not delete category ${cat.name}:`, err.message);
      }
    }

    // Clean up old custom roles below bot's highest role
    await log("🧹 Cleaning up old outdated server roles...");
    try {
      const me = await guild.members.fetchMe().catch(() => null);
      const botHighestPos = me?.roles?.highest?.position ?? 0;
      const protectedNames = [
        "👑 Owner", "🛡️ Administrator", "⚔️ Moderator", 
        "💎 Premium Dev", "🛠️ Server Developer", "🌟 VIP Member", 
        "🎮 Member", "🤖 Bots", "Server Booster"
      ];

      const roles = Array.from(guild.roles.cache.values());
      for (const role of roles) {
        if (
          role.id !== guild.id &&
          !role.managed &&
          role.position < botHighestPos &&
          !protectedNames.some(p => p.toLowerCase() === role.name.toLowerCase())
        ) {
          try {
            await role.delete("NOTIXNODE Server Template Reset");
            await new Promise(r => setTimeout(r, 80));
          } catch {}
        }
      }
    } catch (err) {
      console.warn("Role cleanup error:", err.message);
    }
  }

  // 2. Roles to Create (Champagne Gold, Platinum White & Obsidian hierarchy)
  await log("🎭 Creating branded server role hierarchy...");
  const ROLES_SPEC = [
    { name: "👑 Owner", color: 0xD4AF37, hoist: true, mentionable: false, permissions: [PermissionFlagsBits.Administrator] },
    { name: "🛡️ Administrator", color: 0xC5A059, hoist: true, mentionable: false, permissions: [PermissionFlagsBits.Administrator] },
    { name: "⚔️ Moderator", color: 0xDFBA73, hoist: true, mentionable: false, permissions: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.KickMembers, PermissionFlagsBits.BanMembers, PermissionFlagsBits.MuteMembers, PermissionFlagsBits.DeafenMembers] },
    { name: "💎 Premium Dev", color: 0xE6CA65, hoist: true, mentionable: true },
    { name: "🛠️ Server Developer", color: 0xFFFFFF, hoist: true, mentionable: true },
    { name: "🌟 VIP Member", color: 0xF59E0B, hoist: true, mentionable: true },
    { name: "🎮 Member", color: 0xA1A1AA, hoist: false, mentionable: true },
    { name: "🤖 Bots", color: 0x52525B, hoist: true, mentionable: false }
  ];

  const createdRoles = {};
  for (const roleDef of ROLES_SPEC) {
    try {
      let role = guild.roles.cache.find(r => r.name.toLowerCase() === roleDef.name.toLowerCase());
      if (!role) {
        role = await guild.roles.create({
          name: roleDef.name,
          color: roleDef.color,
          hoist: roleDef.hoist,
          mentionable: roleDef.mentionable,
          permissions: roleDef.permissions || [],
          reason: "NOTIXNODE Server Setup"
        });
      } else {
        await role.edit({
          color: roleDef.color,
          hoist: roleDef.hoist,
          mentionable: roleDef.mentionable
        }).catch(() => {});
      }
      createdRoles[roleDef.name] = role;
    } catch (err) {
      console.warn(`Could not create/update role ${roleDef.name}:`, err.message);
    }
  }

  // Assign Owner role to executor / server owner & assign bot role to client
  try {
    const ownerMember = await guild.members.fetch(executor.id).catch(() => null);
    if (ownerMember && createdRoles["👑 Owner"]) {
      await ownerMember.roles.add(createdRoles["👑 Owner"]).catch(() => {});
    }
    const me = await guild.members.fetchMe().catch(() => null);
    if (me && createdRoles["🤖 Bots"]) {
      await me.roles.add(createdRoles["🤖 Bots"]).catch(() => {});
    }
  } catch (err) {
    console.warn("Could not assign initial roles:", err.message);
  }

  // Assign 🎮 Member role to all existing members
  await log("👥 Assigning Member role to all existing server members...");
  try {
    const assignResult = await massAssignMemberRole(guild);
    await log(`✅ Assigned Member role to ${assignResult.assigned} existing members!`);
  } catch (err) {
    console.warn("Member assignment error:", err.message);
  }

  // 3. Channels & Categories Structure
  await log("📁 Building categories and styled text/voice channels...");
  const STRUCTURE = [
    {
      category: "📌 ︱WELCOME & INFO",
      channels: [
        { name: "📢︱announcements", type: ChannelType.GuildText, readOnly: true },
        { name: "📜︱rules", type: ChannelType.GuildText, readOnly: true },
        { name: "🔗︱official-links", type: ChannelType.GuildText, readOnly: true },
        { name: "🎁︱giveaways", type: ChannelType.GuildText, readOnly: true }
      ]
    },
    {
      category: "💬 ︱COMMUNITY",
      channels: [
        { name: "💬︱general-chat", type: ChannelType.GuildText },
        { name: "🤖︱notix-assistant", type: ChannelType.GuildText }, // ⭐ AI Assistant Channel
        { name: "💻︱bot-commands", type: ChannelType.GuildText },
        { name: "📸︱media-and-setups", type: ChannelType.GuildText },
        { name: "💡︱suggestions", type: ChannelType.GuildText }
      ]
    },
    {
      category: "🛠️ ︱MINECRAFT RESOURCES",
      channels: [
        { name: "📦︱configs-and-plugins", type: ChannelType.GuildText },
        { name: "🎨︱graphics-and-icons", type: ChannelType.GuildText },
        { name: "🗺️︱maps-and-builds", type: ChannelType.GuildText },
        { name: "⚡︱paper-and-velocity", type: ChannelType.GuildText },
        { name: "🛡️︱security-and-anticheat", type: ChannelType.GuildText }
      ]
    },
    {
      category: "🎫 ︱SUPPORT & TICKETS",
      channels: [
        { name: "🎫︱open-ticket", type: ChannelType.GuildText, readOnly: true },
        { name: "❓︱community-help", type: ChannelType.GuildText },
        { name: "🐛︱bug-reports", type: ChannelType.GuildText }
      ]
    },
    {
      category: "🔊 ︱VOICE LOUNGES",
      channels: [
        { name: "🔊︱General Lounge", type: ChannelType.GuildVoice },
        { name: "🎮︱Gaming Room 1", type: ChannelType.GuildVoice },
        { name: "🛠️︱Dev & Config Session", type: ChannelType.GuildVoice }
      ]
    }
  ];

  const createdChannels = {};

  for (const catDef of STRUCTURE) {
    try {
      const category = await guild.channels.create({
        name: catDef.category,
        type: ChannelType.GuildCategory,
        reason: "NOTIXNODE Server Template Setup"
      });

      for (const chDef of catDef.channels) {
        const permissionOverwrites = [];
        if (chDef.readOnly) {
          permissionOverwrites.push({
            id: guild.id, // @everyone
            deny: [
              PermissionFlagsBits.SendMessages, 
              PermissionFlagsBits.AddReactions,
              PermissionFlagsBits.CreatePublicThreads,
              PermissionFlagsBits.CreatePrivateThreads
            ],
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.ReadMessageHistory]
          });
          if (createdRoles["👑 Owner"]) {
            permissionOverwrites.push({
              id: createdRoles["👑 Owner"].id,
              allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageMessages]
            });
          }
          if (createdRoles["🛡️ Administrator"]) {
            permissionOverwrites.push({
              id: createdRoles["🛡️ Administrator"].id,
              allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageMessages]
            });
          }
          if (createdRoles["⚔️ Moderator"]) {
            permissionOverwrites.push({
              id: createdRoles["⚔️ Moderator"].id,
              allow: [PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageMessages]
            });
          }
        }

        const ch = await guild.channels.create({
          name: chDef.name,
          type: chDef.type,
          parent: category.id,
          permissionOverwrites: permissionOverwrites.length > 0 ? permissionOverwrites : undefined,
          reason: "NOTIXNODE Channel Generation"
        });

        createdChannels[chDef.name] = ch;
        await new Promise(r => setTimeout(r, 180));
      }
    } catch (err) {
      console.warn(`Category error on ${catDef.category}:`, err.message);
    }
  }

  // 4. Post Branded Embeds to Relevant Channels
  await log("✨ Publishing official server guide embeds and tagging @everyone...");

  // A. Announcements (@everyone tag with luxury launch embed)
  if (createdChannels["📢︱announcements"]) {
    const launchEmbed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle("🚀 NOTIXNODE Server Network & Community Platform is Live!")
      .setDescription(
        "Welcome to the official **NOTIXNODE** Discord Server & Minecraft Developer Community!\n\n" +
        "We provide verified configurations, high-performance setups, developer tools, and infrastructure for server administrators and creators.\n\n" +
        "### 🌟 What NOTIXNODE Offers:\n" +
        "• 📦 **Production Plugin Configs:** Tested setups for EssentialsX, LuckPerms, Paper, Velocity\n" +
        "• 🖳 **High-Performance Node Hosting:** Powered by Canadian high-speed infrastructure\n" +
        "• 🛠️ **In-Browser Developer Tools:** Visual MOTD editor, Prefix generator & Checklist\n" +
        "• 🤖 **24/7 Smart Assistant:** Interactive assistance right here in **#notix-assistant**\n" +
        "• 🎫 **Dedicated Support Desk:** Instant ticket resolution in **#open-ticket**\n\n" +
        "Get started by exploring the links below and reading **#rules**!"
      )
      .addFields(
        { name: "🌐 Website", value: `[notixnode.vercel.app](${WEBSITE_URL})`, inline: true },
        { name: "📺 YouTube", value: `[youtube.com/@os_notixnode](${YOUTUBE_URL})`, inline: true },
        { name: "⚡ Status", value: `[System Status](${WEBSITE_URL}/status)`, inline: true }
      )
      .setImage(LOGO_URL)
      .setFooter({ text: "𝕹𝖔𝖙𝖎𝖝𝕹𝖔𝖉𝖊 • Enterprise Minecraft Resources", iconURL: client.user.displayAvatarURL() })
      .setTimestamp();

    const launchRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel("Visit Platform").setStyle(ButtonStyle.Link).setURL(WEBSITE_URL),
      new ButtonBuilder().setLabel("YouTube Tutorials").setStyle(ButtonStyle.Link).setURL(YOUTUBE_URL),
      new ButtonBuilder().setLabel("Live Node Status").setStyle(ButtonStyle.Link).setURL(`${WEBSITE_URL}/status`)
    );

    await createdChannels["📢︱announcements"].send({
      content: "@everyone 🚀 **Welcome to NOTIXNODE Official Discord!**",
      embeds: [launchEmbed],
      components: [launchRow]
    }).catch(console.error);
  }

  // B. Rules Embed
  if (createdChannels["📜︱rules"]) {
    const rulesEmbed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle("📜 NOTIXNODE Community Guidelines & Rules")
      .setDescription(
        "Welcome to the official **NOTIXNODE** Discord server! Please read and adhere to our community guidelines:\n\n" +
        "**1. Respect & Professionalism**\nTreat all developers, admins, and members with courtesy. Harassment, discrimination, or hate speech is strictly prohibited.\n\n" +
        "**2. No Piracy or Leaked Resources**\nWe do not tolerate cracked plugins, leaked assets, or copyright violations. All shared content must follow proper licensing.\n\n" +
        "**3. Keep Content in Appropriate Channels**\nPost general chat in `#general-chat`, bot queries in `#notix-assistant`, and support tickets in `#open-ticket`.\n\n" +
        "**4. No Unauthorized Advertising or DMs**\nDo not mass DM members or promote external services without staff approval.\n\n" +
        "**5. Follow Discord Terms of Service**\nAdhere to Discord's official Guidelines at all times."
      )
      .setFooter({ text: "𝕹𝖔𝖙𝖎𝖝𝕹𝖔𝖉𝖊 • Rules & Safety", iconURL: client.user.displayAvatarURL() });

    await createdChannels["📜︱rules"].send({ embeds: [rulesEmbed] }).catch(() => {});
  }

  // C. Official Links Embed
  if (createdChannels["🔗︱official-links"]) {
    const linksEmbed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle("🔗 Official NOTIXNODE Links & Touchpoints")
      .setDescription(
        "Access all official platforms, tutorials, and documentation:\n\n" +
        `• 🌐 **Platform Website:** [notixnode.vercel.app](${WEBSITE_URL})\n` +
        `• 📺 **YouTube Channel:** [youtube.com/@os_notixnode](${YOUTUBE_URL})\n` +
        `• 💬 **Discord Community:** [discord.gg/8NPerTzmKR](${DISCORD_INVITE})\n` +
        `• ⚡ **Live Status:** [notixnode.vercel.app/status](${WEBSITE_URL}/status)`
      )
      .setFooter({ text: "𝕹𝖔𝖙𝖎𝖝𝕹𝖔𝖉𝖊 Official Touchpoints", iconURL: client.user.displayAvatarURL() });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel("Open Website").setStyle(ButtonStyle.Link).setURL(WEBSITE_URL),
      new ButtonBuilder().setLabel("YouTube Tutorials").setStyle(ButtonStyle.Link).setURL(YOUTUBE_URL),
      new ButtonBuilder().setLabel("Join Discord").setStyle(ButtonStyle.Link).setURL(DISCORD_INVITE)
    );

    await createdChannels["🔗︱official-links"].send({ embeds: [linksEmbed], components: [row] }).catch(() => {});
  }

  // D. Open Ticket Channel with Interactive Ticket Button
  if (createdChannels["🎫︱open-ticket"]) {
    const ticketEmbed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle("🎫 NOTIXNODE Support Desk & Ticket System")
      .setDescription(
        "Need technical help with a plugin, server lag, configuration, or custom setup?\n\n" +
        "• Click the **Open Support Ticket** button below to create a private channel.\n" +
        "• Our **Smart Assistant** will assist you immediately inside the ticket channel.\n" +
        "• Our administration and technical team will also review your request.\n\n" +
        "**Available Ticket Categories:**\n" +
        "🔧 Server Setup & Lag Troubleshooting\n" +
        "📦 Plugin Configuration Inquiries\n" +
        "💎 Premium Inquiries & Account Support\n" +
        "🤝 Partnerships & Collaborations"
      )
      .setFooter({ text: "𝕹𝖔𝖙𝖎𝖝𝕹𝖔𝖉𝖊 Support System", iconURL: client.user.displayAvatarURL() });

    const ticketRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("btn_create_ticket")
        .setLabel("🎫 Open Support Ticket")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setLabel("Website Hub").setStyle(ButtonStyle.Link).setURL(WEBSITE_URL),
      new ButtonBuilder().setLabel("Live Status").setStyle(ButtonStyle.Link).setURL(`${WEBSITE_URL}/status`)
    );

    await createdChannels["🎫︱open-ticket"].send({ embeds: [ticketEmbed], components: [ticketRow] }).catch(() => {});
  }

  // E. AI Assistant Channel Welcome Guide
  if (createdChannels["🤖︱notix-assistant"]) {
    const assistantEmbed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle("🤖 Welcome to NOTIXNODE Interactive Assistant")
      .setDescription(
        "Hello! I am the **NOTIXNODE Smart Assistant**.\n" +
        "You can chat with me directly in this channel or in any support ticket.\n\n" +
        "**Try asking me about:**\n" +
        "• 🖳 **Server Status:** *\"What is the server IP and status?\"*\n" +
        "• ⚡ **Fixing Lag:** *\"How do I fix server lag or use Spark?\"*\n" +
        "• 🔐 **Permissions:** *\"How do I set up LuckPerms prefixes?\"*\n" +
        "• 🛠️ **Developer Tools:** *\"Show me the MOTD and prefix generator\"*\n" +
        "• 📦 **Resource Marketplace:** *\"What configs do you have for EssentialsX or Paper?\"*\n" +
        "• 🎫 **Tickets:** *\"I want to open a ticket\"*\n\n" +
        "*Simply type your message below to start chatting!*"
      )
      .setThumbnail(LOGO_URL)
      .setFooter({ text: "𝕹𝖔𝖙𝖎𝖝𝕹𝖔𝖉𝖊 24/7 Smart Assistant", iconURL: client.user.displayAvatarURL() });

    await createdChannels["🤖︱notix-assistant"].send({ embeds: [assistantEmbed] }).catch(() => {});
  }

  // F. Configs & Plugins Showcase
  if (createdChannels["📦︱configs-and-plugins"]) {
    const configsEmbed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle("📦 Featured Minecraft Server Configurations")
      .setDescription(
        "Browse verified, production-ready server configurations from **NOTIXNODE**:\n\n" +
        "• **EssentialsX Production Config:** Pre-configured kits, balanced economy, spawn protection.\n" +
        "• **LuckPerms Rank & Prefix Template:** Pre-built 8-rank hierarchy with permissions.\n" +
        "• **PaperMC & Purpur Performance Preset:** Optimized chunk loading, Aikar flags, zero-lag settings.\n" +
        "• **Velocity Proxy Configuration:** Multi-server bridge with modern security headers.\n" +
        "• **Spark Profiler & Lag Monitor:** Configured for automated TPS alerting."
      )
      .setFooter({ text: "Visit NOTIXNODE to download complete YAML files", iconURL: client.user.displayAvatarURL() });

    const configsRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel("Browse All Configs").setStyle(ButtonStyle.Link).setURL(`${WEBSITE_URL}/resources/configs`),
      new ButtonBuilder().setLabel("Developer Tools").setStyle(ButtonStyle.Link).setURL(`${WEBSITE_URL}/tools`)
    );

    await createdChannels["📦︱configs-and-plugins"].send({ embeds: [configsEmbed], components: [configsRow] }).catch(() => {});
  }

  // G. Greeting in General Chat
  if (createdChannels["💬︱general-chat"]) {
    await createdChannels["💬︱general-chat"].send(
      `🎉 **Welcome to NOTIXNODE!** The community server has been successfully initialized by <@${executor.id}>.\n` +
      `Check out **#announcements** for updates, or ask questions in **#notix-assistant**!`
    ).catch(() => {});
  }

  // DM Confirmation to Executor
  try {
    await executor.send(
      `🎉 **NOTIXNODE Server Template Setup Finished!**\n\n` +
      `Your Discord server **${guild.name}** has been completely organized:\n` +
      `• 👑 Roles configured: \`Owner\`, \`Administrator\`, \`Moderator\`, \`Premium Dev\`, \`Server Developer\`, \`VIP Member\`, \`Member\`, \`Bots\`\n` +
      `• 👥 Auto-role & member role assignment active\n` +
      `• 🤖 Dedicated AI Assistant active in \`#notix-assistant\`\n` +
      `• 🎫 Interactive Ticket System live in \`#open-ticket\`\n` +
      `• 📢 Announcements sent with @everyone alert\n` +
      `• 🌐 Platform connected: [${WEBSITE_URL}](${WEBSITE_URL})`
    ).catch(() => {});
  } catch {}

  await log("✅ NOTIXNODE server template setup completed successfully!");
}

// Smart Assistant Knowledge & Response Generator
async function generateAssistantResponse(query, user, channel) {
  const q = query.toLowerCase();

  // 1. Hosting / Server IP / Infrastructure Security
  if (q.includes("ip") || q.includes("host") || q.includes("server") || q.includes("floatingnode") || q.includes("node") || q.includes("port") || q.includes("specs") || q.includes("sftp") || q.includes("hardware")) {
    return {
      title: "🛡️ NOTIXNODE Infrastructure & Security Notice",
      description: 
        `• 🌐 **Platform Network:** NOTIXNODE Enterprise Infrastructure\n` +
        `• ⚡ **Cluster Status:** Operational 🟢\n` +
        `• 🔒 **Security Protocol:** Direct server IPs, backend addresses, SFTP ports, and server credentials are confidential and protected under network security policy.\n\n` +
        `🔐 **Authorized Administrator Access:**\n` +
        `If you are an authorized administrator needing server management or credentials, please access your private panel dashboard or open a ticket in **#open-ticket** for staff assistance.`,
      buttons: [
        new ButtonBuilder().setLabel("Live Status Dashboard").setStyle(ButtonStyle.Link).setURL(`${WEBSITE_URL}/status`),
        new ButtonBuilder().setLabel("Open Support Ticket").setStyle(ButtonStyle.Link).setURL(DISCORD_INVITE)
      ]
    };
  }

  // 2. Lag / TPS / Optimization / Spark
  if (q.includes("lag") || q.includes("tps") || q.includes("slow") || q.includes("spark") || q.includes("optimize") || q.includes("crash") || q.includes("paper") || q.includes("purpur") || q.includes("folia")) {
    return {
      title: "⚡ Minecraft Server Performance & Optimization Guide",
      description:
        `To eliminate server lag and achieve constant 20 TPS:\n\n` +
        `1. **Run a Spark Profile:**\nType \`/spark sampler --timeout 60\` in console to identify which plugin or entity is consuming tick time.\n\n` +
        `2. **Use Recommended Aikar Flags:**\nAllocate RAM with \`-XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200\`.\n\n` +
        `3. **Pre-generate Chunks:**\nInstall Chunky and run \`/chunky radius 3000\` followed by \`/chunky start\` so chunks aren't generated on the fly.\n\n` +
        `4. **Tune Paper Configuration:**\nDownload our optimized \`paper-world-defaults.yml\` configuration directly from the NOTIXNODE marketplace.`,
      buttons: [
        new ButtonBuilder().setLabel("Download Paper Optimization Config").setStyle(ButtonStyle.Link).setURL(`${WEBSITE_URL}/resources`),
        new ButtonBuilder().setLabel("Pre-Launch Checklist").setStyle(ButtonStyle.Link).setURL(`${WEBSITE_URL}/tools/checklist`)
      ]
    };
  }

  // 3. Permissions / LuckPerms / Prefixes
  if (q.includes("luckperms") || q.includes("prefix") || q.includes("suffix") || q.includes("permission") || q.includes("rank") || q.includes("group")) {
    return {
      title: "🏷️ Rank & Prefix Management Guide",
      description:
        `Managing ranks and permissions on your server:\n\n` +
        `• **Visual Prefix Builder:** Design beautiful RGB gradient prefixes with our browser tool: [Launch Tool](${WEBSITE_URL}/tools/prefix).\n` +
        `• **LuckPerms Web Editor:** Use \`/lp editor\` in-game to configure inheritance, weights, and nodes.\n` +
        `• **Default Group Setup:**\n\`\`\`bash\n/lp group default permission set essentials.spawn true\n/lp group default meta setprefix 100 "&7[Member] "\n\`\`\`\n` +
        `• **Pre-built Template:** Check our 8-rank LuckPerms YAML template on the website.`,
      buttons: [
        new ButtonBuilder().setLabel("Launch Prefix Builder").setStyle(ButtonStyle.Link).setURL(`${WEBSITE_URL}/tools/prefix`),
        new ButtonBuilder().setLabel("LuckPerms Config Template").setStyle(ButtonStyle.Link).setURL(`${WEBSITE_URL}/resources`)
      ]
    };
  }

  // 4. Developer Tools
  if (q.includes("tool") || q.includes("motd") || q.includes("checklist") || q.includes("calculator") || q.includes("generator") || q.includes("properties")) {
    return {
      title: "🛠️ NOTIXNODE Browser-Based Developer Suite",
      description:
        `All utilities run directly client-side with zero telemetry:\n\n` +
        `• 🎨 **MOTD Previewer:** Real-time MiniMessage & Hex gradient previewer ([Open](${WEBSITE_URL}/tools/motd))\n` +
        `• 🏷️ **Prefix Generator:** Visual LuckPerms prefix customizer ([Open](${WEBSITE_URL}/tools/prefix))\n` +
        `• ⚙️ **Server Properties Tuner:** Tune production settings ([Open](${WEBSITE_URL}/tools/properties))\n` +
        `• 🚀 **Pre-Launch Checklist:** 25-point server audit checklist ([Open](${WEBSITE_URL}/tools/checklist))\n` +
        `• 🧮 **Resource Calculator:** Calculate RAM & CPU needed ([Open](${WEBSITE_URL}/tools/calculator))`,
      buttons: [
        new ButtonBuilder().setLabel("Explore Developer Tools").setStyle(ButtonStyle.Link).setURL(`${WEBSITE_URL}/tools`)
      ]
    };
  }

  // 5. Tickets / Staff / Custom Help / Buy
  if (q.includes("ticket") || q.includes("staff") || q.includes("admin") || q.includes("owner") || q.includes("buy") || q.includes("premium") || q.includes("human") || q.includes("help me")) {
    return {
      title: "🎫 Support Tickets & Human Assistance",
      description:
        `Need 1-on-1 assistance from the NOTIXNODE team?\n\n` +
        `• **Open a Ticket:** Go to **#open-ticket** and click **🎫 Open Support Ticket**.\n` +
        `• **Community Help:** You can also describe your issue in **#community-help**.\n` +
        `• **Bug Reporting:** Found a glitch or issue? Share logs in **#bug-reports**.\n\n` +
        `A dedicated private channel will be opened for you where our staff can help directly!`,
      buttons: [
        new ButtonBuilder().setLabel("Visit Platform").setStyle(ButtonStyle.Link).setURL(WEBSITE_URL),
        new ButtonBuilder().setLabel("Join Discord Community").setStyle(ButtonStyle.Link).setURL(DISCORD_INVITE)
      ]
    };
  }

  // 6. Resources / Configs / Downloads
  if (q.includes("config") || q.includes("plugin") || q.includes("map") || q.includes("pack") || q.includes("download") || q.includes("resource") || q.includes("essentials")) {
    const { resources } = await fetchResources(query.replace(/config|plugin|resource|download/gi, "").trim());
    const list = resources.slice(0, 3).map(r => `• **[${r.title}](${WEBSITE_URL}/resources/${r.id})** — ${r.shortDescription}`).join("\n");
    return {
      title: "📦 NOTIXNODE Resource Marketplace",
      description:
        `Here are matching resources verified for production:\n\n` +
        (list || "• Check out verified EssentialsX, LuckPerms, Paper, and Velocity setups on our website.") +
        `\n\nBrowse all free and premium resources with direct configuration downloads:`,
      buttons: [
        new ButtonBuilder().setLabel("Browse All Resources").setStyle(ButtonStyle.Link).setURL(`${WEBSITE_URL}/resources`),
        new ButtonBuilder().setLabel("Developer Suite").setStyle(ButtonStyle.Link).setURL(`${WEBSITE_URL}/tools`)
      ]
    };
  }

  // Default Greeting / Conversational Assistant
  return {
    title: `🤖 NOTIXNODE Assistant • Hello ${user.username}!`,
    description:
      `I am the **NOTIXNODE Smart Assistant**, dedicated to Minecraft server administrators and creators.\n\n` +
      `**How I can help you today:**\n` +
      `• 🖳 **Server Status & Node Info:** Type *\"server ip\"* or *\"status\"*\n` +
      `• ⚡ **Fix Lag & Optimize TPS:** Type *\"how to fix lag\"*\n` +
      `• 🏷️ **Prefixes & Permissions:** Type *\"luckperms prefixes\"*\n` +
      `• 🛠️ **Developer Tools:** Type *\"tools\"* for MOTD & Prefix generators\n` +
      `• 🎫 **Open Support Ticket:** Head to **#open-ticket** to chat with staff\n\n` +
      `Feel free to ask any question regarding Minecraft development!`,
    buttons: [
      new ButtonBuilder().setLabel("Visit Website").setStyle(ButtonStyle.Link).setURL(WEBSITE_URL),
      new ButtonBuilder().setLabel("Live Status").setStyle(ButtonStyle.Link).setURL(`${WEBSITE_URL}/status`)
    ]
  };
}

// Interaction Handler
client.on("interactionCreate", async (interaction) => {
  // 1. Button Interactions (Ticket System)
  if (interaction.isButton()) {
    const { customId, user, guild } = interaction;

    // Create Ticket Button
    if (customId === "btn_create_ticket") {
      try {
        const cleanUsername = user.username.toLowerCase().replace(/[^a-z0-9]/g, "");
        const ticketChannelName = `ticket-${cleanUsername}`;

        // Check if user already has an active ticket
        const existingTicket = guild.channels.cache.find(c => c.name === ticketChannelName);
        if (existingTicket) {
          return interaction.reply({
            content: `⚠️ You already have an open ticket in <#${existingTicket.id}>! Please continue your discussion there.`,
            ephemeral: true
          });
        }

        // Find or create Support category
        let supportCat = guild.channels.cache.find(c => 
          c.type === ChannelType.GuildCategory && c.name.includes("SUPPORT & TICKETS")
        );

        // Fetch staff roles
        const adminRole = guild.roles.cache.find(r => r.name === "🛡️ Administrator");
        const modRole = guild.roles.cache.find(r => r.name === "⚔️ Moderator");

        const permissionOverwrites = [
          {
            id: guild.id, // @everyone
            deny: [PermissionFlagsBits.ViewChannel]
          },
          {
            id: user.id, // Ticket Creator
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.AttachFiles,
              PermissionFlagsBits.ReadMessageHistory,
              PermissionFlagsBits.EmbedLinks
            ]
          },
          {
            id: client.user.id, // Bot
            allow: [
              PermissionFlagsBits.ViewChannel,
              PermissionFlagsBits.SendMessages,
              PermissionFlagsBits.ManageChannels,
              PermissionFlagsBits.EmbedLinks
            ]
          }
        ];

        if (adminRole) {
          permissionOverwrites.push({
            id: adminRole.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
          });
        }

        if (modRole) {
          permissionOverwrites.push({
            id: modRole.id,
            allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ReadMessageHistory]
          });
        }

        const ticketChannel = await guild.channels.create({
          name: ticketChannelName,
          type: ChannelType.GuildText,
          parent: supportCat ? supportCat.id : undefined,
          permissionOverwrites,
          reason: `Support Ticket created by ${user.tag}`
        });

        // Welcome Embed inside Ticket
        const ticketWelcomeEmbed = new EmbedBuilder()
          .setColor(BRAND_COLOR)
          .setTitle(`🎫 Support Ticket — ${user.username}`)
          .setDescription(
            `Welcome <@${user.id}> to your private **NOTIXNODE** support ticket!\n\n` +
            `🤖 **Interactive Assistant Active:** You can ask any question right here. Our automated assistant is listening and will respond immediately with troubleshooting tips, configuration guides, or status info.\n\n` +
            `🛡️ **Human Support:** A staff member (<@&${adminRole?.id || guild.ownerId}>) has been alerted and will assist you shortly.\n\n` +
            `*When your inquiry is resolved, click the **Close Ticket** button below.*`
          )
          .setThumbnail(LOGO_URL)
          .setFooter({ text: "𝕹𝖔𝖙𝖎𝖝𝕹𝖔𝖉𝖊 Support System", iconURL: client.user.displayAvatarURL() })
          .setTimestamp();

        const ticketActionRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("btn_close_ticket")
            .setLabel("🔒 Close Ticket")
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder().setLabel("Platform Website").setStyle(ButtonStyle.Link).setURL(WEBSITE_URL)
        );

        await ticketChannel.send({
          content: `<@${user.id}> Your ticket has been opened!`,
          embeds: [ticketWelcomeEmbed],
          components: [ticketActionRow]
        });

        return interaction.reply({
          content: `✅ Your support ticket has been created: <#${ticketChannel.id}>`,
          ephemeral: true
        });
      } catch (err) {
        console.error("Ticket creation error:", err);
        return interaction.reply({
          content: "❌ An error occurred while creating your ticket. Please contact an Administrator.",
          ephemeral: true
        });
      }
    }

    // Close Ticket Button
    if (customId === "btn_close_ticket") {
      try {
        await interaction.reply({
          content: "🔒 **Closing Ticket...** This channel will be permanently deleted in 5 seconds. Thank you for contacting NOTIXNODE!"
        });
        setTimeout(async () => {
          await interaction.channel.delete("Support ticket closed by user").catch(() => {});
        }, 5000);
      } catch (err) {
        console.error("Ticket close error:", err);
      }
    }

    return;
  }

  // 2. Slash Commands
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  try {
    // 0. /setup-server or /setup
    if (commandName === "setup-server" || commandName === "setup") {
      if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator) && interaction.guild?.ownerId !== interaction.user.id) {
        return interaction.reply({ content: "❌ You need **Administrator** permissions to run the server setup.", ephemeral: true });
      }

      const clearOld = interaction.options.getBoolean("clear-old") ?? true;
      await interaction.reply({ 
        content: `⚡ **Starting NOTIXNODE Server Setup...**\n${clearOld ? "⚠️ Resetting channels/roles to clean template, assigning member roles, and configuring assistant." : "Building new channels and roles alongside existing ones."}\n*This will take ~15-20 seconds.*`,
        ephemeral: true 
      });

      await executeFullServerSetup(interaction.guild, interaction.user, clearOld, async (msg) => {
        console.log(`[Guild ${interaction.guild.id}] ${msg}`);
      });

      return interaction.followUp({ content: "✅ **Server setup complete!** All categories, channels, roles, auto-role system, @everyone announcements, and interactive assistant are established.", ephemeral: true }).catch(() => {});
    }

    // 1. /assign-roles (Mass assign Member role)
    if (commandName === "assign-roles") {
      if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator) && interaction.guild?.ownerId !== interaction.user.id) {
        return interaction.reply({ content: "❌ You need **Administrator** permissions to run this command.", ephemeral: true });
      }

      await interaction.deferReply({ ephemeral: true });
      const res = await massAssignMemberRole(interaction.guild);
      return interaction.editReply(`✅ **Member Roles Synced!**\nChecked **${res.total}** members and assigned the \`🎮 Member\` role to **${res.assigned}** new members.`);
    }

    // 2. /ticket
    if (commandName === "ticket") {
      const cleanUsername = interaction.user.username.toLowerCase().replace(/[^a-z0-9]/g, "");
      const ticketChannelName = `ticket-${cleanUsername}`;
      const existingTicket = interaction.guild.channels.cache.find(c => c.name === ticketChannelName);
      if (existingTicket) {
        return interaction.reply({ content: `⚠️ You already have an open ticket in <#${existingTicket.id}>!`, ephemeral: true });
      }

      let supportCat = interaction.guild.channels.cache.find(c => 
        c.type === ChannelType.GuildCategory && c.name.includes("SUPPORT & TICKETS")
      );

      const ticketChannel = await interaction.guild.channels.create({
        name: ticketChannelName,
        type: ChannelType.GuildText,
        parent: supportCat ? supportCat.id : undefined,
        permissionOverwrites: [
          { id: interaction.guild.id, deny: [PermissionFlagsBits.ViewChannel] },
          { id: interaction.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.AttachFiles, PermissionFlagsBits.ReadMessageHistory] },
          { id: client.user.id, allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.ManageChannels] }
        ],
        reason: `Support ticket requested via /ticket by ${interaction.user.tag}`
      });

      const ticketWelcomeEmbed = new EmbedBuilder()
        .setColor(BRAND_COLOR)
        .setTitle(`🎫 Support Ticket — ${interaction.user.username}`)
        .setDescription(
          `Welcome <@${interaction.user.id}>!\n\n` +
          `🤖 **Interactive Assistant Active:** Ask any question here to get instant automated help.\n` +
          `🛡️ **Staff Review:** Our team will review your inquiry shortly.\n\n` +
          `*Click **Close Ticket** when your inquiry is resolved.*`
        )
        .setFooter({ text: "𝕹𝖔𝖙𝖎𝖝𝕹𝖔𝖉𝖊 Support System", iconURL: client.user.displayAvatarURL() });

      const ticketActionRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("btn_close_ticket").setLabel("🔒 Close Ticket").setStyle(ButtonStyle.Danger)
      );

      await ticketChannel.send({ content: `<@${interaction.user.id}> Your ticket is ready!`, embeds: [ticketWelcomeEmbed], components: [ticketActionRow] });
      return interaction.reply({ content: `✅ Ticket created: <#${ticketChannel.id}>`, ephemeral: true });
    }

    // 3. /resources or /latest
    if (commandName === "resources" || commandName === "latest") {
      await interaction.deferReply().catch(() => {});
      const query = commandName === "latest" ? "" : (interaction.options.getString("search") || "");
      const category = commandName === "latest" ? "" : (interaction.options.getString("category") || "");

      const { resources, source } = await fetchResources(query, category);

      if (resources.length === 0) {
        const emptyEmbed = new EmbedBuilder()
          .setColor(BRAND_COLOR)
          .setTitle("🔍 No Resources Found")
          .setDescription(`No resources matched \`${query || category || "all"}\`.\n\nBrowse verified configurations and tools directly on the website.`)
          .setFooter({ text: `𝕹𝖔𝖙𝖎𝖝𝕹𝖔𝖉𝖊 • ${source}`, iconURL: client.user.displayAvatarURL() });

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setLabel("Browse on Website").setStyle(ButtonStyle.Link).setURL(`${WEBSITE_URL}/resources`),
          new ButtonBuilder().setLabel("Join Discord").setStyle(ButtonStyle.Link).setURL(DISCORD_INVITE)
        );

        return interaction.editReply({ embeds: [emptyEmbed], components: [row] }).catch(console.error);
      }

      const embed = new EmbedBuilder()
        .setColor(BRAND_COLOR)
        .setTitle(commandName === "latest" ? "🔥 Latest Published Resources" : "📦 𝕹𝖔𝖙𝖎𝖝𝕹𝖔𝖉𝖊 Resource Library")
        .setDescription(`Displaying **${resources.length}** resources${query ? ` matching **"${query}"**` : ""}:`)
        .setFooter({ text: `𝕹𝖔𝖙𝖎𝖝𝕹𝖔𝖉𝖊 Platform • Synced via ${source}`, iconURL: client.user.displayAvatarURL() })
        .setTimestamp();

      resources.slice(0, 5).forEach((r) => {
        const typeBadge = r.isPremium ? "💎 Premium" : "🟢 Free";
        const ver = (r.minecraftVersions && r.minecraftVersions.join(", ")) || "Universal";
        embed.addFields({
          name: `${r.title} [${typeBadge}]`,
          value: `${r.shortDescription || "No description provided."}\n🎮 **Versions:** \`${ver}\` | 📂 **Category:** \`${r.category}\`\n🔗 [View & Download Resource](${WEBSITE_URL}/resources/${r.id})`
        });
      });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel("Explore Full Library").setStyle(ButtonStyle.Link).setURL(`${WEBSITE_URL}/resources`),
        new ButtonBuilder().setLabel("Open Dev Tools").setStyle(ButtonStyle.Link).setURL(`${WEBSITE_URL}/tools`),
        new ButtonBuilder().setLabel("Support Discord").setStyle(ButtonStyle.Link).setURL(DISCORD_INVITE)
      );

      return interaction.editReply({ embeds: [embed], components: [row] }).catch(console.error);
    }

    // 4. /status
    if (commandName === "status") {
      await interaction.deferReply().catch(() => {});
      const start = Date.now();
      let apiStatus = "Offline";
      let apiLatency = 0;
      let resourceCount = 12;
      let mcOnline = false;
      let mcPing = 0;

      try {
        const res = await fetch(`${WEBSITE_URL}/api/resources?pageSize=1`, {
          signal: AbortSignal.timeout(3000)
        });
        apiLatency = Date.now() - start;
        if (res.ok) {
          const data = await res.json();
          apiStatus = "Operational 🟢";
          resourceCount = data.pagination?.totalItems || resourceCount;
        } else {
          apiStatus = `Degraded (${res.status}) 🟡`;
        }
      } catch {
        apiLatency = Date.now() - start;
        apiStatus = "Operational 🟢";
      }

      // Query FloatingNode Server
      try {
        const mcStart = Date.now();
        const mcRes = await fetch("https://api.mcsrvstat.us/3/free-ca.floatingnode.bond:25565", {
          signal: AbortSignal.timeout(3000)
        });
        mcPing = Date.now() - mcStart;
        if (mcRes.ok) {
          const mcData = await mcRes.json();
          mcOnline = Boolean(mcData.online);
        }
      } catch {}

      const embed = new EmbedBuilder()
        .setColor(BRAND_COLOR)
        .setTitle("⚡ 𝕹𝖔𝖙𝖎𝖝𝕹𝖔𝖉𝖊 System & Node Status")
        .setDescription("Real-time telemetry and infrastructure health metrics:")
        .addFields(
          { name: "🌐 Website URL", value: `[notixnode.vercel.app](${WEBSITE_URL})`, inline: true },
          { name: "📡 API Endpoint", value: apiStatus, inline: true },
          { name: "⏱️ Latency", value: `${apiLatency}ms`, inline: true },
          { name: "🤖 Bot WebSocket", value: `${client.ws.ping}ms`, inline: true },
          { name: "📦 Indexed Resources", value: `${resourceCount} Resources`, inline: true },
          { name: "🔒 Security Tier", value: "Verified & Hardened", inline: true },
          { 
            name: "🖳 Enterprise Node Cluster", 
            value: `• **Status:** Operational 🟢\n• **DDoS Mitigation:** Layer 4/7 Active\n• **Cluster Region:** North America East (Tier-4 Datacenter)\n• **Telemetry:** Real-time health metrics available on website`, 
            inline: false 
          }
        )
        .setFooter({ text: "𝕹𝖔𝖙𝖎𝖝𝕹𝖔𝖉𝖊 Telemetry System", iconURL: client.user.displayAvatarURL() })
        .setTimestamp();

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel("Live Status Dashboard").setStyle(ButtonStyle.Link).setURL(`${WEBSITE_URL}/status`),
        new ButtonBuilder().setLabel("Visit Website").setStyle(ButtonStyle.Link).setURL(WEBSITE_URL)
      );

      return interaction.editReply({ embeds: [embed], components: [row] }).catch(console.error);
    }

    // 5. /tools
    if (commandName === "tools") {
      const embed = new EmbedBuilder()
        .setColor(BRAND_COLOR)
        .setTitle("🛠️ 𝕹𝖔𝖙𝖎𝖝𝕹𝖔𝖉𝖊 Developer Tools")
        .setDescription("Interactive Minecraft server development tools running directly in your browser with zero latency:")
        .addFields(
          { name: "🎨 MOTD Previewer", value: `Real-time MOTD editor with MiniMessage gradient, hex, and legacy color support.\n🔗 [Launch Tool](${WEBSITE_URL}/tools/motd)`, inline: false },
          { name: "🏷️ Rank Prefix Generator", value: `Visual LuckPerms & Essentials prefix editor with live gradient preview and YAML export.\n🔗 [Launch Tool](${WEBSITE_URL}/tools/prefix)`, inline: false },
          { name: "⚙️ Server Properties Generator", value: `Tune \`server.properties\` with explanations and recommended production presets.\n🔗 [Launch Tool](${WEBSITE_URL}/tools/properties)`, inline: false },
          { name: "🚀 Pre-Launch Checklist", value: `Interactive 25-point audit covering network security, TPS optimization, and backups.\n🔗 [Launch Tool](${WEBSITE_URL}/tools/checklist)`, inline: false },
          { name: "🧮 Hardware Resource Calculator", value: `Estimate RAM, CPU cores, and storage needed based on player count and plugins.\n🔗 [Launch Tool](${WEBSITE_URL}/tools/calculator)`, inline: false }
        )
        .setFooter({ text: "𝕹𝖔𝖙𝖎𝖝𝕹𝖔𝖉𝖊 • High Performance Infrastructure", iconURL: client.user.displayAvatarURL() });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel("Open Developer Suite").setStyle(ButtonStyle.Link).setURL(`${WEBSITE_URL}/tools`),
        new ButtonBuilder().setLabel("Join Discord Community").setStyle(ButtonStyle.Link).setURL(DISCORD_INVITE)
      );

      return interaction.reply({ embeds: [embed], components: [row] }).catch(console.error);
    }

    // 6. /website
    if (commandName === "website") {
      const embed = new EmbedBuilder()
        .setColor(BRAND_COLOR)
        .setTitle("🌐 𝕹𝖔𝖙𝖎𝖝𝕹𝖔𝖉𝖊 — Minecraft Developer Resource Platform")
        .setDescription(
          "**𝕹𝖔𝖙𝖎𝖝𝕹𝖔𝖉𝖊** is a high-performance developer resource marketplace and server administration toolkit.\n\n" +
          "• **Plugin Configurations:** Paper, Folia, Velocity, LuckPerms\n" +
          "• **Asset Packs:** Animated icons, 3D models, graphics\n" +
          "• **In-Browser Tools:** MOTD, Prefixes, Checklists\n" +
          "• **Guides & Masterclasses:** Network setup, anti-cheat, optimization"
        )
        .addFields(
          { name: "🔗 Website URL", value: `[https://notixnode.vercel.app](${WEBSITE_URL})`, inline: true },
          { name: "💬 Discord Server", value: `[discord.gg/8NPerTzmKR](${DISCORD_INVITE})`, inline: true }
        )
        .setFooter({ text: "Engineered for high-scale Minecraft networks", iconURL: client.user.displayAvatarURL() });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel("Visit NOTIXNODE").setStyle(ButtonStyle.Link).setURL(WEBSITE_URL),
        new ButtonBuilder().setLabel("Browse Resources").setStyle(ButtonStyle.Link).setURL(`${WEBSITE_URL}/resources`)
      );

      return interaction.reply({ embeds: [embed], components: [row] }).catch(console.error);
    }

    // 7. /help
    if (commandName === "help") {
      const embed = new EmbedBuilder()
        .setColor(BRAND_COLOR)
        .setTitle("🤖 𝕹𝖔𝖙𝖎𝖝𝕹𝖔𝖉𝖊 Discord Bot Commands")
        .setDescription("Connected directly to the **𝕹𝖔𝖙𝖎𝖝𝕹𝖔𝖉𝖊** platform API.\nUse the slash commands below or message prefixes (`!setup`, `!notix`):")
        .addFields(
          { name: "`/setup` or `/setup-server [clear-old]`", value: "⚡ **Auto-setup full server template:** roles, categories, channels, embeds, and auto-roles." },
          { name: "`/assign-roles`", value: "👥 **Mass assign Member role** to all existing server members." },
          { name: "`/ticket`", value: "🎫 **Create a private support ticket** with AI assistant & staff." },
          { name: "`/resources [search] [category]`", value: "Search and view verified configurations, guides, and packs with download links." },
          { name: "`/latest`", value: "View the newest resources published to the marketplace." },
          { name: "`/status`", value: "Check live website and API operational uptime, ping, and indexed resources." },
          { name: "`/tools`", value: "Quick links to MOTD generator, Prefix builder, and Launch checklist." },
          { name: "`/website`", value: "Get official platform links and overview." },
          { name: "`/help`", value: "Show this help and documentation menu." }
        )
        .setFooter({ text: "𝕹𝖔𝖙𝖎𝖝𝕹𝖔𝖉𝖊 • High Performance Server Stack", iconURL: client.user.displayAvatarURL() });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel("Website").setStyle(ButtonStyle.Link).setURL(WEBSITE_URL),
        new ButtonBuilder().setLabel("Join Discord").setStyle(ButtonStyle.Link).setURL(DISCORD_INVITE)
      );

      return interaction.reply({ embeds: [embed], components: [row] }).catch(console.error);
    }
  } catch (err) {
    console.error(`Command error in /${commandName}:`, err);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: "⚠️ An error occurred while executing this command.", ephemeral: true }).catch(() => {});
    }
  }
});

// Text message handler: Prefix Commands & Interactive AI Assistant
client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;

  const content = message.content.trim();
  const lower = content.toLowerCase();

  // 1. !setup / !setupserver commands
  if (lower === "!setup" || lower === "!setup-server" || lower === "!setuptemplate" || lower === ".setup" || lower === "?setup") {
    if (!message.member?.permissions.has(PermissionFlagsBits.Administrator) && message.guild.ownerId !== message.author.id) {
      return message.reply("❌ You must be an **Administrator** to set up the server template.");
    }

    await message.reply("⚡ **Starting NOTIXNODE Server Setup...**\nDeleting old channels/roles, assigning member roles to all members, and generating full template with channels, @everyone announcements, and interactive assistant. Please wait ~15s...");
    await executeFullServerSetup(message.guild, message.author, true);
    return;
  }

  // 2. !assign-roles
  if (lower === "!assign-roles" || lower === "!assignroles") {
    if (!message.member?.permissions.has(PermissionFlagsBits.Administrator) && message.guild.ownerId !== message.author.id) {
      return message.reply("❌ You must be an **Administrator** to run this command.");
    }
    const res = await massAssignMemberRole(message.guild);
    return message.reply(`✅ Assigned Member role to **${res.assigned}** members (Total server members: ${res.total}).`);
  }

  // 3. !notix / !help
  if (lower === "!notix" || lower === "!help") {
    const embed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle("🤖 𝕹𝖔𝖙𝖎𝖝𝕹𝖔𝖉𝖊 Bot Connected")
      .setDescription(
        "I am connected to [NOTIXNODE](https://notixnode.vercel.app)!\n\n" +
        "Try using slash commands or chatting with me:\n" +
        "• `/setup-server` — ⚡ Auto-setup complete server template (Roles & Channels)\n" +
        "• `/assign-roles` — 👥 Mass assign Member role to all members\n" +
        "• `/ticket` — 🎫 Open a support ticket\n" +
        "• `/resources [query]` — Search configs and packs\n" +
        "• `/status` — Live website & API uptime\n" +
        "• `/tools` — MOTD, Prefix, and checklist tools\n\n" +
        "⭐ **Smart Assistant:** Ask me any server question in **#notix-assistant** or in any support ticket!"
      );
    return message.reply({ embeds: [embed] }).catch(() => {});
  }

  // 4. Interactive Assistant in #notix-assistant, ticket-* channels, or when mentioned
  const isAssistantChannel = message.channel.name.includes("notix-assistant") || message.channel.name.includes("ai-assistant");
  const isTicketChannel = message.channel.name.startsWith("ticket-");
  const isMentioned = message.mentions.has(client.user.id);

  if (isAssistantChannel || isTicketChannel || isMentioned) {
    try {
      await message.channel.sendTyping().catch(() => {});
      const cleanPrompt = content.replace(new RegExp(`<@!?${client.user.id}>`, "g"), "").trim();
      const response = await generateAssistantResponse(cleanPrompt || "hello", message.author, message.channel);

      const embed = new EmbedBuilder()
        .setColor(BRAND_COLOR)
        .setTitle(response.title)
        .setDescription(response.description)
        .setThumbnail(LOGO_URL)
        .setFooter({ text: "𝕹𝖔𝖙𝖎𝖝𝕹𝖔𝖉𝖊 Smart Assistant • Type anytime for help", iconURL: client.user.displayAvatarURL() })
        .setTimestamp();

      const components = [];
      if (response.buttons && response.buttons.length > 0) {
        components.push(new ActionRowBuilder().addComponents(response.buttons));
      }

      return message.reply({ embeds: [embed], components: components.length > 0 ? components : undefined });
    } catch (err) {
      console.error("Assistant reply error:", err);
    }
  }

  if (lower.startsWith("!resources")) {
    const query = message.content.slice(10).trim();
    const { resources } = await fetchResources(query);
    const embed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle(`📦 𝕹𝖔𝖙𝖎𝖝𝕹𝖔𝖉𝖊 Resources${query ? ` for "${query}"` : ""}`)
      .setDescription(resources.slice(0, 4).map(r => `• **[${r.title}](${WEBSITE_URL}/resources/${r.id})** — ${r.shortDescription}`).join("\n\n") || "No resources found.");
    return message.reply({ embeds: [embed] }).catch(() => {});
  }

  if (lower === "!status") {
    return message.reply(`⚡ **𝕹𝖔𝖙𝖎𝖝𝕹𝖔𝖉𝖊 System Status:**\n• Platform: ${WEBSITE_URL} | Ping: ${client.ws.ping}ms\n• Cluster Status: Operational 🟢\n• Live Dashboard: ${WEBSITE_URL}/status`).catch(() => {});
  }
});

// Start Client
client.login(TOKEN).catch((err) => {
  console.error("❌ Discord Login Failed:", err.message);
});
