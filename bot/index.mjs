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
  ActivityType 
} from "discord.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.local or process.env
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
const BRAND_COLOR = 0xFF1E27; // NOTIXNODE Pure Crimson Red

if (!TOKEN) {
  console.error("❌ ERROR: DISCORD_BOT_TOKEN is not defined in environment or .env.local");
  process.exit(1);
}

// Fallback resources from local JSON
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

// Fetch resources live from website API, falling back to local JSON
async function fetchResources(search = "", category = "") {
  try {
    const url = new URL(`${WEBSITE_URL}/api/resources`);
    if (search) url.searchParams.set("search", search);
    if (category) url.searchParams.set("category", category);
    url.searchParams.set("pageSize", "10");

    const res = await fetch(url.toString(), {
      headers: { "User-Agent": "NOTIXNODE-Discord-Bot/1.0" },
      signal: AbortSignal.timeout(4000)
    });

    if (res.ok) {
      const data = await res.json();
      return { resources: data.resources || [], source: "Live API" };
    }
  } catch (err) {
    // Failover silently to local store
  }

  // Local fallback filter
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

// Slash Commands Definition
const commands = [
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
    console.log("⚡ Registering global slash commands with Discord API...");
    await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands.map(c => c.toJSON()) }
    );
    console.log("✅ Successfully registered slash commands globally!");
  } catch (err) {
    console.error("❌ Failed to register slash commands:", err);
  }
}

// Ready Handler
client.once("ready", async () => {
  console.log(`🤖 Logged in as ${client.user.tag} (ID: ${client.user.id})`);
  
  // Set Discord presence
  client.user.setPresence({
    activities: [{
      name: "Minecraft Server Resources | /help",
      type: ActivityType.Watching,
      url: WEBSITE_URL
    }],
    status: "online"
  });

  // Register commands with client ID
  await registerSlashCommands(client.user.id);
});

// Command Logic Handlers
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  // 1. /resources
  if (commandName === "resources" || commandName === "latest") {
    await interaction.deferReply();
    const query = commandName === "latest" ? "" : (interaction.options.getString("search") || "");
    const category = commandName === "latest" ? "" : (interaction.options.getString("category") || "");

    const { resources, source } = await fetchResources(query, category);

    if (resources.length === 0) {
      const emptyEmbed = new EmbedBuilder()
        .setColor(BRAND_COLOR)
        .setTitle("🔍 No Resources Found")
        .setDescription(`No resources matched \`${query || category || "all"}\`.\n\nBrowse all 12+ verified configurations and tools directly on the website.`)
        .setFooter({ text: `NOTIXNODE • ${source}`, iconURL: client.user.displayAvatarURL() });

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setLabel("Browse on Website").setStyle(ButtonStyle.Link).setURL(`${WEBSITE_URL}/resources`),
        new ButtonBuilder().setLabel("Join Discord").setStyle(ButtonStyle.Link).setURL(DISCORD_INVITE)
      );

      return interaction.editReply({ embeds: [emptyEmbed], components: [row] });
    }

    const embed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle(commandName === "latest" ? "🔥 Latest Published Resources" : "📦 NOTIXNODE Resource Library")
      .setDescription(`Displaying **${resources.length}** resources${query ? ` matching **"${query}"**` : ""}:`)
      .setFooter({ text: `NOTIXNODE Platform • Synced via ${source}`, iconURL: client.user.displayAvatarURL() })
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

    return interaction.editReply({ embeds: [embed], components: [row] });
  }

  // 2. /status
  if (commandName === "status") {
    await interaction.deferReply();
    const start = Date.now();
    let apiStatus = "Offline";
    let apiLatency = 0;
    let resourceCount = 12;

    try {
      const res = await fetch(`${WEBSITE_URL}/api/resources?pageSize=1`, {
        signal: AbortSignal.timeout(3500)
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
      apiStatus = "Unreachable 🔴";
    }

    const embed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle("⚡ NOTIXNODE System Status")
      .setDescription("Real-time telemetry and infrastructure health metrics:")
      .addFields(
        { name: "🌐 Website URL", value: `[notixnode.vercel.app](${WEBSITE_URL})`, inline: true },
        { name: "📡 API Endpoint", value: apiStatus, inline: true },
        { name: "⏱️ Latency", value: `${apiLatency}ms`, inline: true },
        { name: "🤖 Bot WebSocket", value: `${client.ws.ping}ms`, inline: true },
        { name: "📦 Indexed Resources", value: `${resourceCount} Resources`, inline: true },
        { name: "🔒 Security Tier", value: "Verified & Hardened", inline: true }
      )
      .setFooter({ text: "NOTIXNODE Telemetry System", iconURL: client.user.displayAvatarURL() })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel("Live Status Dashboard").setStyle(ButtonStyle.Link).setURL(`${WEBSITE_URL}/status`),
      new ButtonBuilder().setLabel("Visit Website").setStyle(ButtonStyle.Link).setURL(WEBSITE_URL)
    );

    return interaction.editReply({ embeds: [embed], components: [row] });
  }

  // 3. /tools
  if (commandName === "tools") {
    const embed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle("🛠️ NOTIXNODE Developer Tools")
      .setDescription("Interactive Minecraft server development tools running directly in your browser with zero latency:")
      .addFields(
        { name: "🎨 MOTD Previewer", value: "Real-time MOTD editor with MiniMessage gradient, hex, and legacy color support.\n🔗 [Launch Tool](${WEBSITE_URL}/tools/motd)", inline: false },
        { name: "🏷️ Rank Prefix Generator", value: "Visual LuckPerms & Essentials prefix editor with live gradient preview and YAML export.\n🔗 [Launch Tool](${WEBSITE_URL}/tools/prefix)", inline: false },
        { name: "⚙️ Server Properties Generator", value: "Tune `server.properties` with explanations and recommended production presets.\n🔗 [Launch Tool](${WEBSITE_URL}/tools/properties)", inline: false },
        { name: "🚀 Pre-Launch Checklist", value: "Interactive 25-point audit covering network security, TPS optimization, and backups.\n🔗 [Launch Tool](${WEBSITE_URL}/tools/checklist)", inline: false },
        { name: "🧮 Hardware Resource Calculator", value: "Estimate RAM, CPU cores, and storage needed based on player count and plugins.\n🔗 [Launch Tool](${WEBSITE_URL}/tools/calculator)", inline: false }
      )
      .setFooter({ text: "NOTIXNODE • High Performance Infrastructure", iconURL: client.user.displayAvatarURL() });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel("Open Developer Suite").setStyle(ButtonStyle.Link).setURL(`${WEBSITE_URL}/tools`),
      new ButtonBuilder().setLabel("Join Discord Community").setStyle(ButtonStyle.Link).setURL(DISCORD_INVITE)
    );

    return interaction.reply({ embeds: [embed], components: [row] });
  }

  // 4. /website
  if (commandName === "website") {
    const embed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle("🌐 NOTIXNODE — Minecraft Developer Resource Platform")
      .setDescription(
        "**NOTIXNODE** is a high-performance developer resource marketplace and server administration toolkit.\n\n" +
        "• **Plugin Configurations:** Paper, Folia, Velocity, LuckPerms\n" +
        "• **Asset Packs:** Animated icons, 3D models, graphics\n" +
        "• **In-Browser Tools:** MOTD, Prefixes, Checklists\n" +
        "• **Guides & Masterclasses:** Network setup, anti-cheat, optimization"
      )
      .addFields(
        { name: "🔗 Website URL", value: `[https://notixnode.vercel.app](${WEBSITE_URL})`, inline: true },
        { name: "💬 Discord Server", value: `[discord.gg/8NPerTzmKR](${DISCORD_INVITE})`, inline: true }
      )
      .setFooter({ text: "Engineered for high-scale Minecraft networks" });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel("Visit NOTIXNODE").setStyle(ButtonStyle.Link).setURL(WEBSITE_URL),
      new ButtonBuilder().setLabel("Browse Resources").setStyle(ButtonStyle.Link).setURL(`${WEBSITE_URL}/resources`)
    );

    return interaction.reply({ embeds: [embed], components: [row] });
  }

  // 5. /help
  if (commandName === "help") {
    const embed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle("🤖 NOTIXNODE Discord Bot Commands")
      .setDescription("Connected directly to the **NOTIXNODE** platform API.\nUse the slash commands below or message prefixes (`!notix`, `!resources`):")
      .addFields(
        { name: "`/resources [search] [category]`", value: "Search and view verified configurations, guides, and packs with download links." },
        { name: "`/latest`", value: "View the newest resources published to the marketplace." },
        { name: "`/status`", value: "Check live website and API operational uptime, ping, and indexed resources." },
        { name: "`/tools`", value: "Quick links to MOTD generator, Prefix builder, and Launch checklist." },
        { name: "`/website`", value: "Get official platform links and overview." },
        { name: "`/help`", value: "Show this help and documentation menu." }
      )
      .setFooter({ text: "NOTIXNODE • High Performance Server Stack", iconURL: client.user.displayAvatarURL() });

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel("Website").setStyle(ButtonStyle.Link).setURL(WEBSITE_URL),
      new ButtonBuilder().setLabel("Join Discord").setStyle(ButtonStyle.Link).setURL(DISCORD_INVITE)
    );

    return interaction.reply({ embeds: [embed], components: [row] });
  }
});

// Legacy text message prefix support (!notix, !resources, !status, !help)
client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const content = message.content.trim().toLowerCase();
  if (content === "!notix" || content === "!help") {
    const embed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle("🤖 NOTIXNODE Bot Connected")
      .setDescription(
        "I am connected to [NOTIXNODE](https://notixnode.vercel.app)!\n\n" +
        "Try using slash commands:\n" +
        "• `/resources [query]` — Search configs and packs\n" +
        "• `/status` — Live website & API uptime\n" +
        "• `/tools` — MOTD, Prefix, and checklist tools\n" +
        "• `/latest` — See newest published resources"
      );
    return message.reply({ embeds: [embed] });
  }

  if (content.startsWith("!resources")) {
    const query = message.content.slice(10).trim();
    const { resources } = await fetchResources(query);
    const embed = new EmbedBuilder()
      .setColor(BRAND_COLOR)
      .setTitle(`📦 NOTIXNODE Resources${query ? ` for "${query}"` : ""}`)
      .setDescription(resources.slice(0, 4).map(r => `• **[${r.title}](${WEBSITE_URL}/resources/${r.id})** — ${r.shortDescription}`).join("\n\n") || "No resources found.");
    return message.reply({ embeds: [embed] });
  }

  if (content === "!status") {
    return message.reply(`⚡ **NOTIXNODE Status:** Live at ${WEBSITE_URL} | Ping: ${client.ws.ping}ms`);
  }
});

// Login
client.login(TOKEN).catch((err) => {
  console.error("❌ Discord Login Failed:", err.message);
  process.exit(1);
});
