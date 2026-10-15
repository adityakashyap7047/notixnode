import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Separator } from "@/components/ui/Separator";
import { Shield, FileText, Clock, Mail, Database, Globe, Lock, User, ExternalLink } from "lucide-react";

const sections = [
  {
    id: "introduction",
    title: "Introduction",
    icon: Shield,
    content: `NOTIXNODE ("we," "our," "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website notixnode.com and use our services.

Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site or use our services.`
  },
  {
    id: "information-collected",
    title: "Information We Collect",
    icon: Database,
    content: `We collect information you provide directly to us:

**Account Information:** When you create an account, we collect your name, email address, and password (securely hashed).

**Payment Information:** For premium subscriptions, we process payments through Stripe. We do not store full credit card numbers on our servers.

**Usage Data:** We automatically collect information about your device and how you use our site, including IP address, browser type, pages visited, and timestamps.

**Communications:** If you contact us, we collect your name, email, and message content.`
  },
  {
    id: "how-we-use",
    title: "How We Use Your Information",
    icon: FileText,
    content: `We use your information to:

- Provide, maintain, and improve our services
- Process transactions and manage subscriptions
- Send technical notices, updates, and promotional emails (with consent)
- Respond to your comments, questions, and support requests
- Monitor and analyze trends, usage, and activities
- Detect, investigate, and prevent fraudulent transactions and illegal activities
- Personalize your experience on our site`
  },
  {
    id: "cookies",
    title: "Cookies & Tracking",
    icon: Clock,
    content: `We use cookies and similar tracking technologies:

**Essential Cookies:** Required for the site to function (authentication, cart, preferences).

**Analytics Cookies:** Help us understand how visitors interact with our site (Google Analytics, self-hosted plausible).

**Marketing Cookies:** Used to deliver relevant ads (only with consent).

You can control cookies through your browser settings. Disabling essential cookies may break site functionality.`
  },
  {
    id: "sharing",
    title: "Information Sharing",
    icon: Globe,
    content: `We do not sell your personal information. We may share information with:

**Service Providers:** Stripe (payments), Vercel (hosting), email providers. They process data on our behalf under strict contracts.

**Legal Requirements:** When required by law, court order, or to protect our rights and safety.

**Business Transfers:** In case of merger, acquisition, or sale of assets, your information may be transferred.

**Aggregated Data:** We may share anonymized, aggregated statistics publicly.`
  },
  {
    id: "data-rights",
    title: "Your Data Rights",
    icon: User,
    content: `Depending on your location, you may have rights under GDPR, CCPA, or other regulations:

- **Access:** Request a copy of your personal data
- **Rectification:** Correct inaccurate data
- **Erasure:** Request deletion of your data
- **Portability:** Receive your data in a structured format
- **Restriction:** Limit processing of your data
- **Objection:** Object to certain processing
- **Withdraw Consent:** Withdraw consent at any time

To exercise these rights, email privacy@notixnode.com. We respond within 30 days.`
  },
  {
    id: "security",
    title: "Data Security",
    icon: Lock,
    content: `We implement appropriate technical and organizational measures:

- HTTPS/TLS encryption for all traffic
- Passwords hashed with bcrypt (cost factor 12)
- Regular security audits and penetration testing
- Principle of least privilege for internal access
- Incident response plan for data breaches

No method of transmission over the Internet is 100% secure. We cannot guarantee absolute security.`
  },
  {
    id: "retention",
    title: "Data Retention",
    icon: Clock,
    content: `We retain your data only as long as necessary:

- Account data: Until account deletion + 30 days
- Payment records: 7 years (tax compliance)
- Support tickets: 2 years after resolution
- Analytics data: 26 months (aggregated after)
- Marketing emails: Until unsubscribe

You can request account deletion from Account Settings or by emailing us.`
  },
  {
    id: "children",
    title: "Children's Privacy",
    icon: User,
    content: `Our services are not directed to children under 13 (or 16 in EU). We do not knowingly collect personal information from children. If you believe we have collected data from a child, contact us immediately and we will delete it.`
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    icon: FileText,
    content: `We may update this policy. Material changes will be notified via email or prominent site notice. Continued use after changes constitutes acceptance. Last updated: October 15, 2026.`
  },
  {
    id: "contact",
    title: "Contact Us",
    icon: Mail,
    content: `Questions about this policy or your data?

Email: privacy@notixnode.com
Address: NOTIXNODE Privacy Team, [Company Address]
Response time: Within 30 days (GDPR) or 45 days (CCPA)`
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <section className="section container" aria-labelledby="privacy-heading">
        <div className="max-w-3xl mx-auto">
          <header className="mb-12 text-center">
            <h1 id="privacy-heading" className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Privacy Policy</h1>
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
            <p className="text-muted-foreground mb-4">Contact our privacy team at <a href="mailto:privacy@notixnode.com" className="link-underline">privacy@notixnode.com</a></p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/terms" className="link-underline text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link>
              <Link href="/licensing" className="link-underline text-sm text-muted-foreground hover:text-foreground">Licensing</Link>
              <Link href="/contact" className="link-underline text-sm text-muted-foreground hover:text-foreground">Contact</Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}