import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { FileText, Shield, Clock, Gavel, Download, Code, Globe, AlertTriangle, CheckCircle, User, Mail } from "lucide-react";

const sections = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    icon: FileText,
    content: `By accessing notixnode.com and using our services, you agree to be bound by these Terms of Service. If you disagree with any part, you may not access the site or use our services.

These terms apply to all visitors, users, and customers ("You"). "We," "Our," and "Us" refer to NOTIXNODE.`
  },
  {
    id: "services",
    title: "Services Description",
    icon: Shield,
    content: `NOTIXNODE provides:

- **Free Resources:** Plugin configurations, maps, graphics, tutorials, and developer tools accessible without payment.
- **Premium Resources:** Exclusive content, advanced tutorials with source code, bulk downloads, API access, and priority support.
- **Developer Tools:** Browser-based utilities (MOTD previewer, prefix builder, properties generator, etc.) running client-side.
- **Community Features:** Discord access, GitHub discussions, resource requests, and voting.

We reserve the right to modify, suspend, or discontinue any service at any time.`
  },
  {
    id: "accounts",
    title: "User Accounts",
    icon: User,
    content: `**Registration:** You must provide accurate information. You are responsible for maintaining password confidentiality.

**Premium Subscriptions:** Billed monthly or as a one-time lifetime payment via Stripe. Auto-renews unless cancelled. No refunds for partial periods.

**Account Termination:** We may suspend or terminate accounts for violations. You may delete your account anytime. Premium access continues until the billing period ends.

**License:** Free tier grants personal, non-commercial use. Premium tier grants commercial use license per the Licensing page.`
  },
  {
    id: "resources",
    title: "Resource Usage & Licensing",
    icon: Download,
    content: `**Free Resources:** Licensed per individual resource (typically MIT, Apache 2.0, or CC-BY). Check the LICENSE file in each download.

**Premium Resources:** Include a commercial license allowing use on revenue-generating servers. No attribution required. May not be redistributed as standalone products.

**Third-Party Resources:** Some resources link to external sites. Their licenses apply. We do not control or endorse third-party content.

**Prohibited:** Reselling resources as-is, removing license files, claiming authorship, using for illegal activities.`
  },
  {
    id: "tools",
    title: "Developer Tools",
    icon: Code,
    content: `Our browser-based tools run entirely client-side. No configuration data leaves your browser.

**No Warranty:** Tools are provided "as is" without warranty. Output should be tested before production use.

**No Liability:** We are not responsible for server issues, data loss, or misconfigurations resulting from tool usage.

**Open Source:** Tool logic is open source on GitHub. Contributions welcome.`
  },
  {
    id: "conduct",
    title: "User Conduct",
    icon: Gavel,
    content: `You agree not to:

- Violate any law or regulation
- Infringe intellectual property rights
- Distribute malware, exploits, or harmful code
- Impersonate others or misrepresent affiliation
- Scrape, crawl, or automate access excessively
- Reverse engineer proprietary systems
- Harass, abuse, or threaten other users

Violations may result in immediate account termination without refund.`
  },
  {
    id: "ip",
    title: "Intellectual Property",
    icon: Shield,
    content: `**Our Content:** All NOTIXNODE branding, design, tools, and original resources are our property or licensed to us.

**Your Content:** You retain ownership of content you submit (resource requests, forum posts, contributions). By submitting, you grant us a perpetual, royalty-free license to use, display, and distribute.

**Minecraft Assets:** Minecraft is a trademark of Mojang Synergies AB / Microsoft. NOTIXNODE is not affiliated with or endorsed by Mojang or Microsoft.`
  },
  {
    id: "disclaimer",
    title: "Disclaimers",
    icon: AlertTriangle,
    content: `**No Warranty:** Services provided "as is" and "as available." No warranties of merchantability, fitness, or non-infringement.

**Compatibility:** We test resources but cannot guarantee compatibility with all server versions, plugins, or configurations.

**Third-Party Links:** We are not responsible for content on linked sites.

**Uptime:** We strive for 99.9% uptime but do not guarantee continuous availability.`
  },
  {
    id: "limitation",
    title: "Limitation of Liability",
    icon: Gavel,
    content: `To the maximum extent permitted by law:

- NOTIXNODE is not liable for indirect, incidental, special, or consequential damages
- Total liability limited to fees paid in the 12 months prior to the claim
- This applies regardless of legal theory (contract, tort, negligence)

Some jurisdictions don't allow these limitations; they may not apply to you.`
  },
  {
    id: "indemnification",
    title: "Indemnification",
    icon: Shield,
    content: `You agree to indemnify and hold NOTIXNODE harmless from claims, damages, and expenses (including legal fees) arising from your use of the services, violation of these terms, or infringement of third-party rights.`
  },
  {
    id: "termination",
    title: "Termination",
    icon: Clock,
    content: `We may terminate or suspend access immediately for violations. Upon termination, your right to use services ceases. Provisions that should survive (licensing, liability, indemnification) survive.

You may terminate by deleting your account or cancelling subscription.`
  },
  {
    id: "governing-law",
    title: "Governing Law",
    icon: Globe,
    content: `These terms governed by the laws of [State/Country], without regard to conflict of laws. Disputes resolved in [City/County] courts. You consent to personal jurisdiction there.`
  },
  {
    id: "changes",
    title: "Changes to Terms",
    icon: FileText,
    content: `We may modify terms. Material changes notified 30 days in advance via email or site notice. Continued use constitutes acceptance. Last updated: October 15, 2026.`
  },
  {
    id: "contact",
    title: "Contact",
    icon: Mail,
    content: `Questions about these terms?

Email: legal@notixnode.com
Response: Within 30 days`
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <section className="section container" aria-labelledby="terms-heading">
        <div className="max-w-3xl mx-auto">
          <header className="mb-12 text-center">
            <h1 id="terms-heading" className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Terms of Service</h1>
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
            <h3 className="font-semibold text-foreground mb-3">Questions?</h3>
            <p className="text-muted-foreground mb-4">Contact our legal team at <a href="mailto:legal@notixnode.com" className="link-underline">legal@notixnode.com</a></p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/privacy" className="link-underline text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
              <Link href="/licensing" className="link-underline text-sm text-muted-foreground hover:text-foreground">Licensing</Link>
              <Link href="/contact" className="link-underline text-sm text-muted-foreground hover:text-foreground">Contact</Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}