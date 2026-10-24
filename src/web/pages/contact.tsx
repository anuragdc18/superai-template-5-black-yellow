import { useEffect } from "react";
import { Clock, Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { waLink } from "../lib/site";
import { telHref, useSite } from "../queries/site";
import { LeadForm } from "../components/lead-form";
import { WaIcon } from "../components/header";
import { HandArrow } from "./index";

export default function ContactPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const site = useSite();
  const items: { icon: typeof Phone; label: string; value: string; href?: string }[] = [
    { icon: Phone, label: "Call us", value: site.phone, href: telHref(site.phone) },
    { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
    { icon: Clock, label: "Working hours", value: site.hours },
    ...site.phones.map((p) => ({ icon: Phone, label: p.label || "Phone", value: p.number, href: telHref(p.number) })),
    ...site.emails.map((m) => ({ icon: Mail, label: m.label || "Email", value: m.email, href: `mailto:${m.email}` })),
    ...(site.addresses.length
      ? site.addresses.map((a) => ({ icon: MapPin, label: a.label || "Office", value: a.line, href: a.mapUrl || undefined }))
      : [{ icon: MapPin, label: "Office", value: site.city, href: undefined }]),
  ];
  const socials = (
    [
      ["facebook", Facebook],
      ["instagram", Instagram],
      ["linkedin", Linkedin],
      ["youtube", Youtube],
    ] as const
  ).filter(([k]) => site.socials[k]);
  return (
    <section className="relative overflow-hidden bg-surface py-14 sm:py-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[320px] bg-ink" />
      <div className="container-x relative grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <div>
          <span className="pill">Contact us</span>
          <h1 className="mt-4 text-[40px] font-extrabold leading-[1.06] tracking-[-0.03em] !text-white sm:text-[54px]">Let's talk about your <span className="text-brand">business.</span></h1>
          <p className="mt-4 max-w-md text-[17px] text-white/70">Fill the form and our expert will call you within 30 minutes. The first consultation is free.</p>
          <div className="mt-12 grid gap-4 sm:grid-cols-2">
            {items.map((it) => {
              const inner = (
                <>
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand text-ink"><it.icon className="h-5 w-5" /></span>
                  <span>
                    <span className="block text-[13px]">{it.label}</span>
                    <span className="block whitespace-pre-line font-semibold text-ink">{it.value}</span>
                  </span>
                </>
              );
              return it.href ? (
                <a key={it.label + it.value} href={it.href} target={it.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="flex items-center gap-3 rounded-[20px] bg-white p-4 ring-1 ring-line transition hover:ring-ink">{inner}</a>
              ) : (
                <div key={it.label + it.value} className="flex items-center gap-3 rounded-[20px] bg-white p-4 ring-1 ring-line">{inner}</div>
              );
            })}
          </div>
          <a href={waLink(site.whatsapp, site.bot.whatsappMessage)} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-wa px-6 py-3 font-semibold text-white hover:brightness-95">
            <WaIcon /> Chat on WhatsApp
          </a>
          {socials.length > 0 && (
            <div className="mt-6 flex gap-2">
              {socials.map(([k, Icon]) => (
                <a key={k} href={site.socials[k]} target="_blank" rel="noreferrer" aria-label={k} className="grid h-11 w-11 place-items-center rounded-full bg-white text-ink ring-1 ring-line hover:bg-brand">
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          )}
        </div>
        <div className="relative rounded-[28px] bg-white p-6 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.6)] ring-1 ring-line sm:p-8">
          <div className="pointer-events-none absolute -top-16 right-6 hidden rotate-[-6deg] text-brand sm:block">
            <p className="hand text-[26px]">Reply in 30 minutes!</p>
            <HandArrow className="ml-10 h-10 w-14 rotate-[200deg]" />
          </div>
          <h2 className="text-[26px] font-extrabold">Request a Free Call</h2>
          <p className="mt-1 text-[14px]">Takes less than a minute.</p>
          <div className="mt-6">
            <LeadForm layout="stack" source="contact" cta="Get Free Consultation" withEmail withMessage />
          </div>
        </div>
      </div>
    </section>
  );
}
