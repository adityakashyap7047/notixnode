import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { FileText, Shield, Globe, Link as LinkIcon, AlertTriangle, CheckCircle, Info, ExternalLink } from "lucide-react";

const sections = [
  {
    id: "disclosure",
    title: "Affiliate Disclosure",
    icon: Shield,
    content: `NOTIXNODE participates in affiliate marketing programs. This means we may earn a commission when you click certain links on our site and make a purchase, at no additional cost to you.

This disclosure complies with the Federal Trade Commission (FTC) guidelines on endorsements and testimonials, as well as similar regulations in other jurisdictions.`
  },
  {
    id: "programs",
    title: "Affiliate Programs We Participate In",
    icon: Globe,
    content: `We may participate in the following affiliate programs:

- **Hosting Providers:** Server hosting companies (e.g., BisectHosting, Shockbyte, Apex Hosting, PebbleHost)
- **Domain Registrars:** Domain registration services
- **Software Tools:** Development tools, monitoring services, CDN providers
- **Marketplaces:** Digital asset marketplaces (e.g., BuiltByBit, SpigotMC Premium)
- **Amazon Associates:** For hardware recommendations (networking gear, server hardware)

Specific affiliate relationships are disclosed on relevant pages and in relevant content.`
  },
  {
    id: "how-it-works",
    title: "How Affiliate Links Work",
    icon: LinkIcon,
    content: `When you click an affiliate link:

1. A tracking cookie is placed on your device (typically 30-90 days)
2. If you make a purchase within the cookie window, we may earn a commission
3. The price you pay is the same — commissions come from the vendor's marketing budget
4. We only link to products/services we've evaluated or genuinely recommend

**You can avoid affiliate tracking by:** Opening links in incognito/private browsing, clearing cookies, or navigating directly to the vendor's site.`
  },
  {
    id: "editorial",
    title: "Editorial Independence",
    icon: FileText,
    content: `Our affiliate relationships **do not influence** our content:

- Resources are listed based on quality, relevance, and community demand
- We do not accept payment for placement in the Resource Library
- Premium tier resources are created by our team or vetted contributors
- Negative reviews or critical assessments are published regardless of affiliate status
- We decline partnerships with products that don't meet our standards

If we wouldn't recommend it to a fellow server admin, we don't link it.`
  },
  {
    id: "identification",
    title: "Identifying Affiliate Content",
    icon: Info,
    content: `We clearly mark affiliate content:

- **Affiliate links** in articles: Marked with (affiliate link) or † symbol
- **Sponsored content:** Labeled "Sponsored" or "Partner Content" at the top
- **Resource cards:** External/affiliate resources show an "External" badge
- **Tool recommendations:** Hosting/tool suggestions in tutorials may be affiliate

Non-affiliate external links (documentation, GitHub, official sites) are not marked.`
  },
  {
    id: "compliance",
    title: "Legal Compliance",
    icon: AlertTriangle,
    content: `We comply with:

- **FTC Endorsement Guides (USA):** Clear and conspicuous disclosure
- **CASL (Canada):** Commercial electronic message requirements
- **GDPR/ePrivacy (EU):** Cookie consent for tracking
- **ASA CAP Code (UK):** Marketing disclosure rules
- **ACCC (Australia):** Consumer law on endorsements

If you believe we've missed a disclosure, contact legal@notixnode.com.`
  },
  {
    id: "your-rights",
    title: "Your Rights & Choices",
    icon: CheckCircle,
    content: `You have the right to:

- **Opt out:** Use ad blockers, privacy browsers, or incognito mode
- **Access data:** Request what tracking data affiliates hold (contact them directly)
- **Report concerns:** File complaints with FTC (USA), ICO (UK), or your local regulator
- **Direct navigation:** Visit vendor sites directly instead of using our links

Using our affiliate links is entirely optional. All NOTIXNODE resources (free and premium) are accessible without clicking any affiliate links.`
  },
  {
    id: "contact",
    title: "Contact",
    icon: ExternalLink,
    content: `Questions about our affiliate practices?

Email: legal@notixnode.com
Subject: "Affiliate Disclosure Inquiry"

We respond within 30 days. Last updated: October 15, 2026.`
  },
];

export default function AffiliateDisclosurePage() {
  return (
    <div className="min-h-screen">
      <section className="section container" aria-labelledby="affiliate-heading">
        <div className="max-w-3xl mx-auto">
          <header className="mb-12 text-center">
            <h1 id="affiliate-heading" className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Affiliate Disclosure</h1>
            <p className="text-muted-foreground">Last updated: October 15, 2026</p>
          </header>

          <nav className="mb-12" aria-label="Table of contents">
            <Card variant="glass" padding="md">
              <h3 className="font-semibold text-foreground mb-4">Table of Contents</h3>
              <ul className="space-y-2 columns-1 sm:columns-2">
                {sections.map((section) => (
                  <li key={section.id}>
                    <Link href={`#${section.id}`} className="link-underline text-sm text-muted-foreground hover:text-foreground">
                      {section.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
          </nav>

          <div className="space-y-12">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <article key={section.id} id={section.id} className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
                  </div>
                  <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed">
                    {section.content.split('\n\n').map((paragraph, i) => (
                      <p key={i} className="mb-4">{paragraph}</p>
                    ))}
                  </div>
                </article>
              );
            })}
          </div>

          <Separator className="my-12" />

          <Card variant="glass" padding="lg" className="text-center">
            <h3 className="font-semibold text-foreground mb-3">Summary</h3>
            <p className="text-muted-foreground mb-4">
              We may earn commissions from affiliate links. This supports NOTIXNODE development at no cost to you.
              Our recommendations are independent. <a href="/contact" className="link-underline">Contact us</a> with questions.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/privacy" className="link-underline text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
              <Link href="/terms" className="link-underline text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link>
              <Link href="/licensing" className="link-underline text-sm text-muted-foreground hover:text-foreground">Licensing</Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}