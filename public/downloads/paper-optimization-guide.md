# PaperMC Server Optimization & Tuning Guide
*Authored by NOTIXNODE Technical Resource Team*
*License: CC-BY-4.0*

## 1. Overview
This guide contains field-tested optimization guidelines for Minecraft servers running on **PaperMC**, **Purpur**, or compatible forks (1.20 - 1.21.x).

---

## 2. Aikar's Recommended JVM Garbage Collection Flags
Always launch Java 17 / Java 21 with optimized G1GC flags to minimize garbage collection latency spikes:

```bash
java -Xms8G -Xmx8G -XX:+UseG1GC -XX:+ParallelRefProcEnabled -XX:MaxGCPauseMillis=200 \
-XX:+UnlockExperimentalVMOptions -XX:+DisableExplicitGC -XX:+AlwaysPreTouch \
-XX:G1NewSizePercent=30 -XX:G1MaxNewSizePercent=40 -XX:G1ReservePercent=20 \
-XX:G1HeapWastePercent=5 -XX:G1MixedGCCountTarget=4 -XX:InitiatingHeapOccupancyPercent=15 \
-XX:G1MixedGCLiveThresholdPercent=90 -XX:G1RSetUpdatingPauseTimePercent=5 \
-XX:SurvivorRatio=32 -XX:+PerfDisableSharedMem -XX:MaxTenuringThreshold=1 \
-Dusing.aikars.flags=https://mcflags.emc.gs -Daikars.new.flags=true -jar paper.jar --nogui
```

---

## 3. Key Configuration Settings

### `config/paper-world-defaults.yml`
```yaml
chunks:
  auto-save-interval: 6000 # 5 minutes instead of default 1 minute
  max-auto-save-chunks-per-tick: 18

entities:
  spawning:
    all-chunks-are-slime-chunks: false
  behavior:
    disable-chest-cat-detection: true
    spawner-nerfed-mobs-should-jump: false

tick-rates:
  sensor:
    villager:
      secondarypoisensor: 80
      nearestbedsensor: 80
```

### `spigot.yml`
```yaml
world-settings:
  default:
    entity-activation-range:
      animals: 16
      monsters: 24
      raiders: 32
      misc: 8
      water: 12
      villagers: 16
      flying-monsters: 24
    entity-tracking-range:
      players: 48
      animals: 32
      monsters: 40
      misc: 24
      other: 48
```

---

## 4. Diagnostics & Continuous Profiling
Install the **Spark** profiler plugin (`/spark profiler start`) to capture actionable TPS reports and async tick traces when investigating performance bottlenecks.
