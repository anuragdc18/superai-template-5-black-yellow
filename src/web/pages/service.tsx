import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "wouter";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  Headphones,
  Phone,
  ShieldCheck,
  Users,
} from "lucide-react";
import { findService, serviceUrl, slugify, waLink } from "../lib/site";
import { LeadForm } from "../components/lead-form";
import { WaIcon } from "../components/header";
import { telHref, useSite } from "../queries/site";
import { CtaBand } from "./index";
import { PackageCards, usePackagesFor } from "../components/content-ui";
import { useContent } from "../queries/content";

const STEPS = [
  { title: "Free Call", text: "Tell us what you need. We explain everything simply." },
  { title: "Share Details", text: "Send documents or details on WhatsApp. No office visit." },
  { title: "We Do the Work", text: "Our expert handles it and updates you on every step." },
  { title: "Done", text: "You get the final certificate / files on WhatsApp and email." },
];

function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="divide-y divide-line rounded-[22px] bg-white ring-1 ring-line">
      {items.map((f, i) => (
        <div key={f.q}>
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-navy"
          >
            {f.q}
            <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full transition ${open === i ? "rotate-180 bg-ink text-brand" : "bg-surface text-ink"}`}><ChevronDown className="h-4 w-4" /></span>
          </button>
          {open === i && <p className="px-5 pb-5 text-[15px] leading-relaxed">{f.a}</p>}
        </div>
      ))}
    </div>
  );
}

function Block({ icon: Icon, title, children }: { icon: typeof Users; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[24px] bg-white p-6 ring-1 ring-line sm:p-7">
      <h2 className="flex items-center gap-3 text-[22px] font-extrabold">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand text-ink">
          <Icon className="h-5 w-5" />
        </span>
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function Ticks({ items, cols = false }: { items: string[]; cols?: boolean }) {
  return (
    <ul className={`grid gap-3 ${cols ? "sm:grid-cols-2" : ""}`}>
      {items.map((t) => (
        <li key={t} className="flex items-start gap-2.5 text-[15.5px] text-navy">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 fill-brand text-ink" />
          {t}
        </li>
      ))}
    </ul>
  );
}

export default function ServicePage() {
  const { cat: catSlug, service: serviceSlug } = useParams<{ cat: string; service: string }>();
  const { cat, service } = findService(catSlug, serviceSlug);
  const site = useSite();
  const waMsg = useContent().whatsapp;
  const pkgs = usePackagesFor(catSlug, service?.name);
  const edits = useContent().services;
  const [, navigate] = useLocation();
  const moved = !service ? edits.find((e) => e.cat === catSlug && e.original && slugify(e.original) === serviceSlug && !e.hidden && e.name !== e.original) : undefined;
  useEffect(() => {
    if (moved) navigate(serviceUrl(moved.cat, moved.name), { replace: true });
  }, [moved, navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [catSlug, serviceSlug]);

  if (!cat || !service) {
    return (
      <div className="container-x py-32 text-center">
        <h1 className="text-3xl font-bold">Service not found</h1>
        <Link to={cat ? `/services/${cat.slug}` : "/"} className="btn-brand mt-6">
          {cat ? `See all ${cat.title}` : "Go Home"}
        </Link>
      </div>
    );
  }

  const who = service.who ?? cat.who;
  const includes = service.includes ?? cat.includes;
  const docs = service.docs ?? cat.docs;
  const related = cat.services.filter((s) => s.name !== service.name).slice(0, 4);
  const isCert = cat.slug === "microsoft-certifications";
  const faqs = [
    ...(isCert ? [] : [{
      q: `How long does ${service.name} take?`,
      a: service.days
        ? `Usually ${service.days}. We tell you the exact timeline on the free call.`
        : "It depends on your needs. We give you a clear timeline on the free call.",
    }]),
    { q: "How much does it cost?", a: "The price depends on your needs. Our expert shares a clear price on the free call — no hidden charges." },
    { q: "Do I need to visit your office?", a: "No. Everything is done online — on phone and WhatsApp — from anywhere in India." },
    { q: "Will you help after the work is done?", a: "Yes. You can call or WhatsApp us any time if you have questions later." },
  ];

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink">
        <img src={cat.image} alt="" className="photo absolute inset-0 -z-10 h-full w-full object-cover object-right opacity-80" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#0e0e10_0%,rgba(14,14,16,0.93)_48%,rgba(14,14,16,0.4)_100%)]" />
        <div className="container-x py-14 sm:py-20">
          <nav className="flex flex-wrap items-center gap-1.5 text-[13px] text-white/60">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to={`/services/${cat.slug}`} className="hover:text-white">{cat.title}</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-semibold text-brand">{service.name}</span>
          </nav>
          <h1 className="rise mt-4 max-w-3xl text-[38px] font-extrabold leading-[1.06] tracking-[-0.03em] !text-white sm:text-[54px]">{service.name}<span className="text-brand">.</span></h1>
          <p className="rise mt-4 max-w-xl text-[18px] leading-relaxed text-white/75" style={{ animationDelay: "100ms" }}>
            {service.text}
          </p>
          <div className="rise mt-6 flex flex-wrap gap-2.5 text-[13.5px] text-white" style={{ animationDelay: "160ms" }}>
            {service.days && (
              <span className="flex items-center gap-1.5 rounded-full bg-white/12 px-3.5 py-1.5 ring-1 ring-white/20">
                <Clock className="h-4 w-4 text-brand" /> {service.days}
              </span>
            )}
            <span className="flex items-center gap-1.5 rounded-full bg-white/12 px-3.5 py-1.5 ring-1 ring-white/20">
              <ShieldCheck className="h-4 w-4 text-brand" /> 100% online
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-white/12 px-3.5 py-1.5 ring-1 ring-white/20">
              <Headphones className="h-4 w-4 text-brand" /> Free expert call
            </span>
          </div>
          <div className="rise mt-8 flex flex-wrap gap-3 lg:hidden" style={{ animationDelay: "220ms" }}>
            <a href="#get-started" className="btn-brand">Get Free Consultation <ArrowRight className="h-4 w-4" /></a>
          </div>
        </div>
      </section>

      <section className="bg-surface py-12 sm:py-16">
        <div className="container-x grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start">
          <div className="space-y-6">
            <Block icon={Users} title="Who Is This For?">
              <Ticks items={who} />
            </Block>

            <Block icon={BadgeCheck} title="What You Get">
              <Ticks items={includes} cols />
            </Block>

            {docs && docs.length > 0 && (
              <Block icon={FileText} title="Documents Needed">
                <ul className="grid gap-2.5 sm:grid-cols-2">
                  {docs.map((d) => (
                    <li key={d} className="flex items-start gap-2.5 rounded-2xl bg-surface px-4 py-3 text-[15px] text-ink">
                      <FileText className="mt-0.5 h-4 w-4 shrink-0 text-ink" /> {d}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-[14px]">Not sure about a document? Don't worry — we'll guide you on the call.</p>
              </Block>
            )}

            <Block icon={Clock} title="How It Works">
              <ol className="grid gap-4 sm:grid-cols-2">
                {STEPS.map((st, i) => (
                  <li key={st.title} className="flex gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink text-[15px] font-extrabold text-brand">{i + 1}</span>
                    <span>
                      <span className="block font-semibold text-navy">{st.title}</span>
                      <span className="block text-[14.5px] leading-relaxed">{st.text}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </Block>

            {pkgs.length > 0 && (
              <div>
                <h2 className="mb-4 text-[22px] font-extrabold">Packages & Pricing</h2>
                <PackageCards packages={pkgs} compact />
              </div>
            )}

            <div>
              <h2 className="mb-4 text-[22px] font-extrabold">Common Questions</h2>
              <Faq items={faqs} />
            </div>

            {related.length > 0 && (
              <div>
                <h2 className="mb-4 text-[22px] font-extrabold">Related Services</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {related.map((r) => (
                    <Link
                      key={r.name}
                      to={serviceUrl(cat.slug, r.name)}
                      className="group flex items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3.5 ring-1 ring-line transition hover:bg-ink hover:ring-ink"
                    >
                      <span>
                        <span className="block font-semibold text-ink group-hover:text-white">{r.name}</span>
                        {r.days && <span className="block text-[13px] text-body group-hover:text-white/60">{r.days}</span>}
                      </span>
                      <ArrowRight className="h-4 w-4 text-ink transition group-hover:translate-x-1 group-hover:text-brand" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside id="get-started" className="scroll-mt-28 space-y-4 lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-[24px] bg-white shadow-[0_34px_70px_-38px_rgba(0,0,0,0.55)] ring-1 ring-line">
              <div className="bg-ink px-6 py-5">
                <span className="pill">Get started</span>
                <h3 className="mt-3 text-[22px] font-extrabold !text-white">Talk to an Expert — Free</h3>
                <p className="mt-1 text-[14px] text-white/75">We'll call you back within 30 minutes.</p>
              </div>
              <div className="p-6">
                <LeadForm key={service.name} layout="stack" source={`service:${serviceSlug}`} defaultService={service.name} cta="Get Free Call" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <a href={telHref(site.phone)} className="flex items-center justify-center gap-2 rounded-full bg-brand py-3 font-semibold text-ink hover:bg-brand-dark">
                <Phone className="h-4 w-4" /> Call Us
              </a>
              <a
                href={waLink(site.whatsapp, waMsg.serviceMessages[service.name] || waMsg.serviceMessage.replace("{service}", service.name))}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-wa py-3 font-semibold text-white hover:brightness-95"
              >
                <WaIcon /> WhatsApp
              </a>
            </div>
          </aside>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
