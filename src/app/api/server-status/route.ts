import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const host = searchParams.get("host") || "free-ca.floatingnode.bond";
  const port = searchParams.get("port") || "25565";

  const startTime = Date.now();
  let serverData = {
    host,
    port: parseInt(port, 10),
    online: false,
    players: { online: 0, max: 0 },
    version: "Paper / Purpur (Java)",
    motd: "Offline / Standby",
    ping: 0,
    node: "CA (Canada)",
    serverIp: "51.79.89.1",
    serverId: "5b9d2890",
    sftp: "sftp://free-ca.floatingnode.bond:2022",
    username: "udbwcw4p.5b9d2890",
    resources: {
      cpuMax: "500%",
      ramMax: "12.7 GiB",
      diskMax: "39.06 GiB"
    },
    lastChecked: new Date().toISOString()
  };

  try {
    const res = await fetch(`https://api.mcsrvstat.us/3/${host}:${port}`, {
      headers: { "User-Agent": "NOTIXNODE-Status-Monitor/1.0" },
      next: { revalidate: 15 },
      signal: AbortSignal.timeout(4000)
    });

    const latency = Date.now() - startTime;
    serverData.ping = latency;

    if (res.ok) {
      const data = await res.json();
      serverData.online = Boolean(data.online);
      if (data.ip) serverData.serverIp = data.ip;
      if (data.players) {
        serverData.players = {
          online: data.players.online || 0,
          max: data.players.max || 0
        };
      }
      if (data.version) serverData.version = data.version;
      if (data.motd?.clean && data.motd.clean.length > 0) {
        serverData.motd = data.motd.clean.join(" ");
      }
    }
  } catch {
    serverData.ping = Date.now() - startTime;
    // Fallback retains offline state safely
  }

  return NextResponse.json(serverData);
}
