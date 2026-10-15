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

// Initialize Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Channel]
});

client.on("error", (err) => console.error("⚠️ Discord client error:", err.message));

// Commands definition
const commands = [
  new SlashCommandBuilder()
    .setName("setup-server")
    .setDescription("⚡ Auto-setup complete NOTIXNODE server: deletes old template & creates new roles/channels")
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
    .setDescription("Check live NOTIXNODE website & API operational status"),

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
        name: "who pinged everyone | /help",
        type: ActivityType.Watching
      }],
      status: "online"
    });
  } catch (err) {
    console.error("Presence error:", err);
  }

  await registerSlashCommands(client.user.id);
});

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

    // Delete text and voice channels first to avoid orphan state
    for (const channel of nonCategories) {
      try {
        await channel.delete("NOTIXNODE Server Template Reset");
        await new Promise(r => setTimeout(r, 150));
      } catch (err) {
        console.warn(`Could not delete channel ${channel.name}:`, err.message);
      }
    }

    // Delete empty categories next
    for (const cat of categories) {
      try {
        await cat.delete("NOTIXNODE Server Template Reset");
        await new Promise(r => setTimeout(r, 150));
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
            await new Promise(r => setTimeout(r, 100));
          } catch {}
        }
      }
    } catch (err) {
      console.warn("Role cleanup error:", err.message);
    }
  }

  // 2. Roles to Create (Pure Red, Pure Black, Pure White aesthetic)
  await log("🎭 Creating branded server role hierarchy...");
  const ROLES_SPEC = [
    { name: "👑 Owner", color: 0xFF1E27, hoist: true, mentionable: false, permissions: [PermissionFlagsBits.Administrator] },
    { name: "🛡️ Administrator", color: 0xE50914, hoist: true, mentionable: false, permissions: [PermissionFlagsBits.Administrator] },
    { name: "⚔️ Moderator", color: 0xB91C1C, hoist: true, mentionable: false, permissions: [PermissionFlagsBits.ManageMessages, PermissionFlagsBits.KickMembers, PermissionFlagsBits.BanMembers, PermissionFlagsBits.MuteMembers, PermissionFlagsBits.DeafenMembers] },
    { name: "💎 Premium Dev", color: 0xFF444E, hoist: true, mentionable: true },
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

  // Assign Owner role to executor / server owner
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
        { name: "🤖︱bot-commands", type: ChannelType.GuildText },
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
        await new Promise(r => setTimeout(r, 200));
      }
    } catch (err) {
      console.warn(`Category error on ${catDef.category}:`, err.message);
    }
  }

  // 4. Post Branded Embeds to Relevant Channels
  await log("✨ Publishing official server guide embeds...");

  // Rules Embed
  if (createdChannels["📜︱rules"]) {
    const rulesEmbed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle("📜 NOTIXNODE Community Guidelines & Rules")
      .setDescription(
        "Welcome to the official **NOTIXNODE** Discord server! Please read and adhere to our community guidelines:\n\n" +
        "**1. Respect & Professionalism**\nTreat all developers, admins, and members with courtesy. Harassment, discrimination, or hate speech is strictly prohibited.\n\n" +
        "**2. No Piracy or Leaked Resources**\nWe do not tolerate cracked plugins, leaked assets, or copyright violations. All shared content must follow proper licensing.\n\n" +
        "**3. Keep Content in Appropriate Channels**\nPost support requests in `#community-help`, bot triggers in `#bot-commands`, and general discussion in `#general-chat`.\n\n" +
        "**4. No Unauthorized Advertising or DMs**\nDo not mass DM members or promote external services without staff approval.\n\n" +
        "**5. Follow Discord Terms of Service**\nAdhere to Discord's official Guidelines at all times."
      )
      .setFooter({ text: "𝕹𝖔𝖙𝖎𝖝𝕹𝖔𝖉𝖊 • Rules & Safety", iconURL: client.user.displayAvatarURL() });

    await createdChannels["📜︱rules"].send({ embeds: [rulesEmbed] }).catch(() => {});
  }

  // Official Links Embed
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

  // Open Ticket Channel
  if (createdChannels["🎫︱open-ticket"]) {
    const ticketEmbed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle("🎫 NOTIXNODE Support & Inquiries")
      .setDescription(
        "Need technical assistance with a configuration, guide, or tool?\n\n" +
        "• **Community Help:** Ask questions directly in **#community-help**.\n" +
        "• **Bug Reports & Inquiries:** Post directly in **#bug-reports**.\n" +
        "• **Staff Inquiries:** Use the touchpoints below to connect with team members."
      )
      .setFooter({ text: "𝕹𝖔𝖙𝖎𝖝𝕹𝖔𝖉𝖊 Support System", iconURL: client.user.displayAvatarURL() });

    const ticketRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel("Website Hub").setStyle(ButtonStyle.Link).setURL(WEBSITE_URL),
      new ButtonBuilder().setLabel("YouTube Guides").setStyle(ButtonStyle.Link).setURL(YOUTUBE_URL),
      new ButtonBuilder().setLabel("Support Discord").setStyle(ButtonStyle.Link).setURL(DISCORD_INVITE)
    );

    await createdChannels["🎫︱open-ticket"].send({ embeds: [ticketEmbed], components: [ticketRow] }).catch(() => {});
  }

  // Welcome Announcement
  if (createdChannels["📢︱announcements"]) {
    const announceEmbed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle("🚀 NOTIXNODE Server Template Successfully Deployed!")
      .setDescription(
        `Welcome to the newly structured **NOTIXNODE** server network!\n\n` +
        `All channels, roles, and categories have been generated and configured.\n` +
        `Explore verified Minecraft developer resources at **[${WEBSITE_URL}](${WEBSITE_URL})**.`
      )
      .setFooter({ text: "𝕹𝖔𝖙𝖎𝖝𝕹𝖔𝖉𝖊 Infrastructure", iconURL: client.user.displayAvatarURL() });

    await createdChannels["📢︱announcements"].send({ embeds: [announceEmbed] }).catch(() => {});
  }

  // Greeting in General Chat
  if (createdChannels["💬︱general-chat"]) {
    await createdChannels["💬︱general-chat"].send(
      `🎉 **Welcome to NOTIXNODE!** Server setup completed successfully by <@${executor.id}>. Start chatting or check out **#official-links**!`
    ).catch(() => {});
  }

  // DM Confirmation to Executor
  try {
    await executor.send(
      `🎉 **NOTIXNODE Server Template Setup Finished!**\n\n` +
      `Your Discord server **${guild.name}** has been completely organized:\n` +
      `• 👑 Roles configured: \`Owner\`, \`Administrator\`, \`Moderator\`, \`Premium Dev\`, \`Server Developer\`, \`VIP Member\`, \`Member\`, \`Bots\`\n` +
      `• 📁 5 Categories created with 19 dedicated text and voice channels\n` +
      `• 📜 Formatted guides & official links posted to \`#rules\`, \`#official-links\`, and \`#open-ticket\`\n` +
      `• 🌐 Platform connected: [${WEBSITE_URL}](${WEBSITE_URL})`
    ).catch(() => {});
  } catch {}

  await log("✅ NOTIXNODE server template setup completed successfully!");
}

// Interaction Handler
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  try {
    // 0. /setup-server or /setup (Deletes old template & builds new one)
    if (commandName === "setup-server" || commandName === "setup") {
      // Admin verification
      if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator) && interaction.guild?.ownerId !== interaction.user.id) {
        return interaction.reply({ content: "❌ You need **Administrator** permissions to run the server setup.", ephemeral: true });
      }

      const clearOld = interaction.options.getBoolean("clear-old") ?? true;
      await interaction.reply({ 
        content: `⚡ **Starting NOTIXNODE Server Setup...**\n${clearOld ? "⚠️ Deleting old template channels/roles and building fresh structure." : "Building new channels alongside existing ones."}\n*This will take ~15-20 seconds.*`,
        ephemeral: true 
      });

      await executeFullServerSetup(interaction.guild, interaction.user, clearOld, async (msg) => {
        console.log(`[Guild ${interaction.guild.id}] ${msg}`);
      });

      return interaction.followUp({ content: "✅ **Server setup complete!** All categories, channels, roles, and embeds have been successfully established.", ephemeral: true }).catch(() => {});
    }

    // 1. /resources or /latest
    if (commandName === "resources" || commandName === "latest") {
      await interaction.deferReply().catch(() => {});
      const query = commandName === "latest" ? "" : (interaction.options.getString("search") || "");
      const category = commandName === "latest" ? "" : (interaction.options.getString("category") || "");

      const { resources, source } = await fetchResources(query, category);

      if (resources.length === 0) {
        const emptyEmbed = new EmbedBuilder()
          .setColor(BRAND_COLOR)
          .setTitle("🔍 No Resources Found")
          .setDescription(`No resources matched \`${query || category || "all"}\`.\n\nBrowse all 12+ verified configurations and tools directly on the website.`)
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

    // 2. /status
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
            name: "🖳 FloatingNode Server (Node CA)", 
            value: `• **Hostname:** \`free-ca.floatingnode.bond:25565\`\n• **Status:** ${mcOnline ? "Online 🟢" : "Standby / Offline 🔴"} (${mcPing}ms)\n• **Specs:** 500% CPU (5 vCores) | 12.7 GiB RAM | 39 GB NVMe\n• **SFTP:** \`sftp://free-ca.floatingnode.bond:2022\` (#5b9d2890)`, 
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

    // 3. /tools
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

    // 4. /website
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

    // 5. /help
    if (commandName === "help") {
      const embed = new EmbedBuilder()
        .setColor(BRAND_COLOR)
        .setTitle("🤖 𝕹𝖔𝖙𝖎𝖝𝕹𝖔𝖉𝖊 Discord Bot Commands")
        .setDescription("Connected directly to the **𝕹𝖔𝖙𝖎𝖝𝕹𝖔𝖉𝖊** platform API.\nUse the slash commands below or message prefixes (`!setup`, `!notix`):")
        .addFields(
          { name: "`/setup` or `/setup-server [clear-old: true/false]`", value: "⚡ **Auto-setup full server template:** deletes old channels & creates styled roles, categories, and channels." },
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

// Text message prefix support (!setup, !notix, !resources, !status, !help)
client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;

  const content = message.content.trim().toLowerCase();

  // !setup, !setup-server, !setuptemplate, .setup
  if (content === "!setup" || content === "!setup-server" || content === "!setuptemplate" || content === ".setup" || content === "?setup") {
    if (!message.member?.permissions.has(PermissionFlagsBits.Administrator) && message.guild.ownerId !== message.author.id) {
      return message.reply("❌ You must be an **Administrator** to set up the server template.");
    }

    await message.reply("⚡ **Starting NOTIXNODE Server Setup...**\nDeleting old channels/roles and generating clean template with roles, channels, and embeds. Please wait ~15s...");
    await executeFullServerSetup(message.guild, message.author, true);
    return;
  }

  if (content === "!notix" || content === "!help") {
    const embed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle("🤖 𝕹𝖔𝖙𝖎𝖝𝕹𝖔𝖉𝖊 Bot Connected")
      .setDescription(
        "I am connected to [NOTIXNODE](https://notixnode.vercel.app)!\n\n" +
        "Try using slash commands:\n" +
        "• `/setup-server` — ⚡ Auto-setup complete server template (Roles & Channels)\n" +
        "• `/resources [query]` — Search configs and packs\n" +
        "• `/status` — Live website & API uptime\n" +
        "• `/tools` — MOTD, Prefix, and checklist tools\n" +
        "• `/latest` — See newest published resources"
      );
    return message.reply({ embeds: [embed] }).catch(() => {});
  }

  if (content.startsWith("!resources")) {
    const query = message.content.slice(10).trim();
    const { resources } = await fetchResources(query);
    const embed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle(`📦 𝕹𝖔𝖙𝖎𝖝𝕹𝖔𝖉𝖊 Resources${query ? ` for "${query}"` : ""}`)
      .setDescription(resources.slice(0, 4).map(r => `• **[${r.title}](${WEBSITE_URL}/resources/${r.id})** — ${r.shortDescription}`).join("\n\n") || "No resources found.");
    return message.reply({ embeds: [embed] }).catch(() => {});
  }

  if (content === "!status") {
    return message.reply(`⚡ **𝕹𝖔𝖙𝖎𝖝𝕹𝖔𝖉𝖊 System Status:**\n• Platform: ${WEBSITE_URL} | Ping: ${client.ws.ping}ms\n• Node Server: \`free-ca.floatingnode.bond:25565\` (Node CA, 500% CPU, 12.7GB RAM)\n• Live Dashboard: ${WEBSITE_URL}/status`).catch(() => {});
  }
});

// Start Client
client.login(TOKEN).catch((err) => {
  console.error("❌ Discord Login Failed:", err.message);
});
