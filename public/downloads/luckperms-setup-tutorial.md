# Complete LuckPerms Setup & Inheritance Tutorial
*Authored by NOTIXNODE Technical Resource Team*
*License: CC-BY-SA-4.0*

## 1. Introduction
LuckPerms is the industry-standard permission management plugin for Bukkit, Spigot, Paper, BungeeCord, and Velocity networks.

---

## 2. Recommended Group Ladder Structure

```text
owner (weight 100)
  └── admin (weight 80)
        └── mod (weight 60)
              └── helper (weight 40)
                    └── mvp (weight 30)
                          └── vip (weight 20)
                                └── default (weight 10)
```

---

## 3. Core Console Commands

### Creating Groups & Setting Weights
```bash
/lp creategroup default
/lp group default setweight 10

/lp creategroup vip
/lp group vip setweight 20
/lp group vip setparent default

/lp creategroup admin
/lp group admin setweight 80
/lp group admin setparent default
```

### Setting Prefixes with Color Codes
```bash
/lp group default meta setprefix 10 "&7[Member] "
/lp group vip meta setprefix 20 "&a[VIP] "
/lp group admin meta setprefix 80 "&c[Admin] "
```

---

## 4. Web Editor Usage
Generate a temporary, encrypted web editor session from console:
```bash
/lp editor
```
Apply your node changes in the web interface, click **Save**, and execute the returned `/lp applyedits <code>` command.
