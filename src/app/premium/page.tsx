import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Separator } from "@/components/ui/Separator";
import { CheckCircle, Gem, Download, Shield, Zap, Code, BookOpen, Globe, Users, Crown, Star, Lock, ArrowRight, ExternalLink } from "lucide-react";

const premiumFeatures = [
  { icon: Crown, title: "Exclusive Resources", description: "100+ premium-only configurations, maps, graphics, and resource packs not available anywhere else" },
  { icon: Download, title: "Bulk Downloads", description: "Download entire categories or collections as single archives. Save time with one-click downloads" },
  { icon: Zap, title: "Early Access", description: "Get new resources 2 weeks before public release. Beta access to developer tools" },
  { icon: Code, title: "Source Code Access", description: "Full source code for premium tutorials. Modify and adapt for your specific needs" },
  { icon: Shield, title: "Priority Support", description: "Direct Discord access to our team. Configuration help and troubleshooting within 24 hours" },
  { icon: BookOpen, title: "Advanced Tutorials", description: "Deep-dive guides with complete source code. Plugin development, optimization, and architecture" },
  { icon: Globe, title: "Commercial License", description: "Use premium resources on commercial servers. No attribution required for paid tier" },
  { icon: Users, title: "Team Access", description: "Add up to 5 team members to your account. Shared downloads and collaboration" },
];

const tiers: Array<{ name: string; price: string; period: string; description: string; features: string[]; cta: string; href: string; variant: "primary" | "secondary" | "ghost" | "outline" | "destructive"; popular: boolean }> = [
  {
    name: "Free",
    price: "$0",
    period: "/forever",
    description: "Perfect for getting started",
    features: [
      "300+ free configurations",
      "All developer tools (ready)",
      "Community tutorials",
      "Basic search & filtering",
      "Direct downloads",
      "Version compatibility tags",
    ],
    cta: "Continue Free",
    href: "/resources?free=true",
    variant: "outline",
    popular: false,
  },
  {
    name: "Premium",
    price: "$12",
    period: "/month",
    description: "For serious server developers",
    features: [
      "Everything in Free",
      "100+ premium resources",
      "Advanced tutorials + source",
      "Bulk downloads & API access",
      "Priority support (24h)",
      "Commercial use license",
      "Team access (5 seats)",
      "Early access (2 weeks)",
      "No ads ever",
    ],
    cta: "Request Beta Access",
    href: "/contact",
    variant: "primary",
    popular: true,
  },
  {
    name: "Lifetime",
    price: "$199",
    period: "/one-time",
    description: "Best value for long-term projects",
    features: [
      "Everything in Premium",
      "Lifetime access, no renewal",
      "All future resources included",
      "Team access (10 seats)",
      "Custom resource requests",
      "Direct developer contact",
      "Lifetime commercial license",
      "Early access (4 weeks)",
    ],
    cta: "Contact Sales",
    href: "/contact",
    variant: "secondary",
    popular: false,
  },
];

const premiumResources = [
  { title: "Advanced LuckPerms Network Config", category: "Configurations", type: "premium" },
  { title: "Medieval Fantasy Spawn 200x200", category: "Maps & Builds", type: "premium" },
  { title: "Animated Server Icon Pack - Neon", category: "Graphics & Icons", type: "premium" },
  { title: "Custom Enchants Pack 50+", category: "Resource Packs", type: "premium" },
  { title: "Folia Optimization Masterclass", category: "Tutorials", type: "premium" },
  { title: "Security Hardening Complete Guide", category: "Tutorials", type: "premium" },
  { title: "Docker/Kubernetes for MC Servers", category: "Tutorials", type: "premium" },
  { title: "WorldEdit/FAWE Advanced Techniques", category: "Tutorials", type: "premium" },
];

export default function PremiumPage() {
  return (
    <div className="min-h-screen">
      <section className="section container" aria-labelledby="premium-heading">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <Badge variant="premium" className="mb-6">Premium Tier</Badge>
          <h1 id="premium-heading" className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-foreground mb-6">
            Unlock Everything with
            <br />
            <span className="gradient-text">NOTIXNODE Premium</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Access exclusive resources, advanced tutorials with source code, priority support, and commercial licensing.
            Built for professional server administrators and developers.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              variant={tier.popular ? "interactive" : "base"}
              padding="lg"
              className={`relative ${tier.popular ? "ring-2 ring-primary/30" : ""}`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="premium">Most Popular</Badge>
                </div>
              )}
              <CardHeader className="text-center mb-6">
                <h3 className="text-2xl font-bold text-foreground">{tier.name}</h3>
                <div className="mt-2 flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-foreground">{tier.price}</span>
                  <span className="text-muted-foreground">{tier.period}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{tier.description}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <ul className="space-y-3" role="list">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-success flex-shrink-0 mt-0.5" aria-hidden="true" />
                      <span className="text-sm text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button variant={tier.variant} className="w-full mt-4" size="lg" asChild>
                  <Link href={tier.cta}>
                    {tier.cta}
                    <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Separator className="mb-12" />

        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Premium Features</h2>
          <p className="text-muted-foreground">What you get when you upgrade</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-16">
          {premiumFeatures.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Card key={i} variant="interactive" padding="md" className="text-center">
                <div className="p-3 bg-primary/10 rounded-xl text-primary w-fit mx-auto mb-4">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            );
          })}
        </div>

        <Separator className="mb-12" />

        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Premium Resource Preview</h2>
          <p className="text-muted-foreground">A sample of what's exclusive to Premium members</p>
        </div>

        <div className="grid-auto-fit max-w-5xl mx-auto mb-16">
          {premiumResources.map((resource, i) => (
            <article key={i} className="card-interactive p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Gem className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{resource.title}</h3>
                  <p className="text-sm text-muted-foreground">{resource.category}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="premium">Premium Exclusive</Badge>
                <Button variant="ghost" size="sm" disabled>Locked</Button>
              </div>
            </article>
          ))}
        </div>

        <Card variant="glass-strong" padding="lg" className="max-w-3xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Ready to Go Premium?</h2>
            <p className="text-muted-foreground mb-8">
              Start your 7-day free trial. Cancel anytime. No questions asked.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/register?plan=premium">Start Free Trial</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/resources?free=true">Browse Free Resources</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              By upgrading, you agree to our <Link href="/terms" className="link-underline">Terms of Service</Link> and
              <Link href="/privacy" className="link-underline">Privacy Policy</Link>.
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
}