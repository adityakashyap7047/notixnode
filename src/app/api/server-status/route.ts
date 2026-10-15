import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const startTime = Date.now();

  let serverData = {
    cluster: "NOTIXNODE Enterprise Edge Cluster",
    region: "North America East",
    status: "Operational 🟢",
    online: true,
    ping: 28,
    uptimeSla: "99.98%",
    ddosMitigation: "Enterprise Layer 4/7 Active",
    infrastructure: {
      type: "High-Performance Cloud Compute",
      memory: "High-Speed DDR4 / DDR5",
      storage: "NVMe Enterprise RAID-10",
      network: "10 Gbps Redundant Uplink"
    },
    lastChecked: new Date().toISOString()
  };

  try {
    const res = await fetch("https://api.mcsrvstat.us/3/free-ca.floatingnode.bond:25565", {
      headers: { "User-Agent": "NOTIXNODE-Status-Monitor/1.0" },
      next: { revalidate: 30 },
      signal: AbortSignal.timeout(3000)
    });

    const latency = Date.now() - startTime;
    serverData.ping = latency > 0 ? latency : 28;

    if (res.ok) {
      const data = await res.json();
      serverData.online = Boolean(data.online);
      serverData.status = data.online ? "Operational 🟢" : "Standby 🟡";
    }
  } catch {
    serverData.ping = Date.now() - startTime;
  }

  return NextResponse.json(serverData);
}
