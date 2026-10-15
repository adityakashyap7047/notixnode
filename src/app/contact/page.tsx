"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Separator } from "@/components/ui/Separator";
import { Mail, MessageSquare, GitBranch, X, MapPin, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const contactMethods = [
  { icon: Mail, title: "Email", value: "support@notixnode.com", description: "General inquiries, billing, partnerships", action: "mailto:support@notixnode.com" },
  { icon: MessageSquare, title: "Discord", value: "discord.gg/notixnode", description: "Community support, feature requests, chat", action: "https://discord.gg/notixnode" },
  { icon: GitBranch, title: "GitHub", value: "github.com/notixnode", description: "Bug reports, feature requests, contributions", action: "https://github.com/notixnode" },
  { icon: X, title: "Twitter/X", value: "@notixnode", description: "Announcements, updates, quick questions", action: "https://twitter.com/notixnode" },
];

const faqs = [
  {
    q: "How do I download free resources?",
    a: "Browse the Resource Library, click on any free resource, and hit the Download button. No account required for free resources."
  },
  {
    q: "Can I use resources on commercial servers?",
    a: "Free resources: check individual licenses (most are MIT). Premium resources include a commercial license. Always verify the license file included with each download."
  },
  {
    q: "How do I request a new resource?",
    a: "Join our Discord and post in #resource-requests, or open a GitHub issue with the 'resource-request' label. We prioritize based on community votes."
  },
  {
    q: "What payment methods do you accept?",
    a: "Credit/debit cards via Stripe. We don't store payment details. Lifetime purchases are one-time; subscriptions auto-renew monthly."
  },
  {
    q: "How do I cancel my Premium subscription?",
    a: "Go to Account Settings → Subscription → Cancel. Access continues until the billing period ends. No partial refunds for unused time."
  },
  {
    q: "Are resources compatible with my server version?",
    a: "Each resource lists supported versions. We test on Paper, Folia, and Velocity latest builds. Check the version badge on each resource page."
  },
];

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "", email: "", subject: "", message: "", submitting: false, submitted: false, error: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState(prev => ({ ...prev, submitting: true, error: "" }));
    
    // Simulate API call
    await new Promise(r => setTimeout(r, 1500));
    
    setFormState(prev => ({ ...prev, submitting: false, submitted: true }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen">
      <section className="section container" aria-labelledby="contact-heading">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 id="contact-heading" className="text-4xl sm:text-5xl font-bold text-foreground mb-4">Contact Us</h1>
            <p className="text-lg text-muted-foreground">Have questions? We'd love to hear from you.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Quick Contact</h2>
              <div className="space-y-4">
                {contactMethods.map((method, i) => {
                  const Icon = method.icon;
                  return (
                    <Card key={i} variant="interactive" padding="md">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg text-primary">
                          <Icon className="h-5 w-5" aria-hidden="true" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-foreground">{method.title}</h3>
                          <p className="text-sm text-muted-foreground">{method.description}</p>
                          <a href={method.action} target="_blank" rel="noopener noreferrer" className="link-underline text-sm text-primary mt-1 inline-block">
                            {method.value}
                          </a>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              <Card variant="glass" padding="md">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
                  <div>
                    <h3 className="font-medium text-foreground">Response Times</h3>
                    <p className="text-sm text-muted-foreground">
                      Free tier: 48-72 hours • Premium: {'<24'} hours • Critical security: {'<4'} hours
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <Card variant="glass-strong" padding="lg">
              <CardHeader>
                <CardTitle>Send a Message</CardTitle>
              </CardHeader>
              <CardContent>
                {formState.submitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" aria-hidden="true" />
                    <h3 className="text-xl font-semibold text-foreground mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground mb-6">We'll get back to you within 24-48 hours.</p>
                    <Button variant="outline" onClick={() => setFormState({...formState, submitted: false, name: "", email: "", subject: "", message: ""})}>
                      Send Another
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" value={formState.name} onChange={handleChange} required placeholder="Your name" disabled={formState.submitting} />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" value={formState.email} onChange={handleChange} required placeholder="you@example.com" disabled={formState.submitting} />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <select id="subject" name="subject" value={formState.subject} onChange={handleChange} className="input-base" required disabled={formState.submitting}>
                        <option value="">Select a topic</option>
                        <option value="general">General Inquiry</option>
                        <option value="billing">Billing & Subscriptions</option>
                        <option value="technical">Technical Support</option>
                        <option value="partnership">Partnership & Business</option>
                        <option value="legal">Legal & Compliance</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="message">Message</Label>
                      <textarea id="message" name="message" value={formState.message} onChange={handleChange} rows={5} className="input-base font-mono text-sm resize-y" required placeholder="Describe your question or issue..." disabled={formState.submitting} />
                    </div>
                    {formState.error && (
                      <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                        <AlertCircle className="h-4 w-4" aria-hidden="true" />
                        {formState.error}
                      </div>
                    )}
                    <Button type="submit" className="w-full" disabled={formState.submitting}>
                      {formState.submitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          <Separator className="mb-8" />

          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {faqs.map((faq, i) => (
                <Card key={i} variant="glass-strong" padding="md">
                  <h3 className="font-medium text-foreground mb-2">{faq.q}</h3>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}