import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Bot,
  Briefcase,
  Check,
  ClipboardList,
  Clock,
  Coffee,
  FileText,
  GraduationCap,
  Headphones,
  IndianRupee,
  Landmark,
  Lock,
  MapPin,
  MessageCircle,
  Minus,
  Palette,
  PenTool,
  Plus,
  Printer,
  Rocket,
  RotateCcw,
  Share2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Store,
  Upload,
  Users,
  Zap,
  Globe2,
  Instagram,
  Monitor,
} from "lucide-react";
import { CATEGORIES, POPULAR, SLIDES, serviceUrl, waLink } from "../lib/site";
import { asset } from "../lib/demo";
import { useSite } from "../queries/site";
import { LeadForm } from "../components/lead-form";
import { WaIcon } from "../components/header";

/* ───────────── small shared bits ───────────── */

/** Hand-drawn curved arrow used next to handwritten notes. */
export function HandArrow({ className = "", flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 80 60" fill="none" className={className} style={flip ? { transform: "scaleX(-1)" } : undefined} aria-hidden>
      <path d="M74 6C58 6 30 10 14 46" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M6 36l8 12 12-7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Stars({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <span className="flex text-[#f5b400]">
      {[0, 1, 2, 3, 4].map((k) => (
        <Star key={k} className={`${className} fill-current`} />
      ))}
    </span>
  );
}

function GoogleG() {
  return (
    <svg viewBox="0 0 48 48" className="h-8 w-8" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

function Head({ pill, title, text, center = true, note, light = false }: { pill: string; title: React.ReactNode; text?: string; center?: boolean; note?: string; light?: boolean }) {
  return (
    <div className={`relative mb-10 ${center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}`}>
      <span className={`pill ${center ? "mx-auto" : ""}`}>{pill}</span>
      <h2 className={`mt-4 text-[32px] font-extrabold leading-[1.12] tracking-[-0.02em] sm:text-[42px] ${light ? "!text-white" : ""}`}>{title}</h2>
      {text && <p className={`mt-3 text-[16px] ${light ? "text-white/70" : ""}`}>{text}</p>}
      {note && (
        <div className="pointer-events-none absolute -right-48 top-0 hidden w-44 rotate-[-8deg] text-ink/80 xl:block">
          <p className="hand text-[24px]">{note}</p>
          <HandArrow className="mt-1 h-10 w-14 -translate-x-6" />
        </div>
      )}
    </div>
  );
}

/** Find a service by its exact name and return its page link. */
function svc(name: string) {
  for (const c of CATEGORIES) {
    const s = c.services.find((x) => x.name === name);
    if (s) return { name: s.name, text: s.text, days: s.days, href: serviceUrl(c.slug, s.name), cat: c };
  }
  throw new Error(`Unknown service: ${name}`);
}
const short = (n: string) => n.replace(/\s*\(.*?\)/, "").replace(/:.*$/, "");
/** Readable label: "AZ-900: Azure Fundamentals" -> "AZ-900 · Azure Fundamentals" */
const label = (n: string) => n.replace(/:\s*/, " · ").replace(/ Fundamentals$/, "");

/* ───────────── 2. hero ───────────── */

const HIGHLIGHT: Record<string, string> = {
  "Start Your Business the Right Way": "Right Way",
  "Get Microsoft Certified": "Certified",
  "Look Professional From Day One": "Day One",
  "Get More Customers Online": "Online",
};

function Headline({ title }: { title: string }) {
  const hi = HIGHLIGHT[title];
  if (!hi || !title.endsWith(hi)) return <>{title}.</>;
  return (
    <>
      {title.slice(0, -hi.length)}
      <span className="text-brand">{hi}.</span>
    </>
  );
}

const CHIPS = [
  { icon: Headphones, title: "Expert Team", text: "CA, CS & certified trainers" },
  { icon: Smartphone, title: "100% Online", text: "No office visit needed" },
  { icon: Zap, title: "Fast Updates", text: "On WhatsApp, every step" },
];

function Hero() {
  const [i, setI] = useState(0);
  const n = SLIDES.length;
  useEffect(() => {
    const t = setTimeout(() => setI((v) => (v + 1) % n), 5000);
    return () => clearTimeout(t);
  }, [i, n]);
  const s = SLIDES[i];
  return (
    <section className="relative isolate overflow-hidden bg-ink">
      <img src={asset("/images/hero.jpg")} alt="" className="photo kenburns absolute inset-0 -z-20 h-full w-full object-cover object-[70%_center]" />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#0e0e10_0%,rgba(14,14,16,0.94)_34%,rgba(14,14,16,0.55)_58%,rgba(14,14,16,0.15)_100%)] max-lg:bg-[linear-gradient(180deg,rgba(14,14,16,0.6)_0%,#0e0e10_75%)]" />

      {/* handwritten notes */}
      <div className="pointer-events-none absolute right-[5%] top-10 hidden rotate-[6deg] lg:block">
        <div className="relative rounded-[28px] bg-brand px-6 py-4 text-ink shadow-[0_20px_40px_-18px_rgba(0,0,0,0.6)]">
          <p className="hand text-[30px]">Better ideas,<br />bigger opportunities</p>
          <span className="absolute -bottom-3 left-8 h-6 w-6 rotate-45 bg-brand" />
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-52 right-[7%] hidden -rotate-6 text-white lg:block">
        <HandArrow className="ml-auto h-12 w-16 rotate-[150deg] text-brand" />
        <p className="hand text-right text-[28px]">Your growth,<br />our support</p>
      </div>

      <div className="container-x relative pb-36 pt-16 sm:pt-20 lg:pb-44 lg:pt-24">
        <div key={i} className="max-w-[640px]">
          <span className="pill fade-up">{s.tag}</span>
          <h1 className="fade-up mt-5 text-[42px] font-extrabold leading-[1.04] tracking-[-0.03em] !text-white sm:text-[58px] lg:text-[66px]" style={{ animationDelay: "60ms" }}>
            <Headline title={s.title} />
          </h1>
          <p className="fade-up mt-5 max-w-[520px] text-[17px] leading-relaxed text-white/80" style={{ animationDelay: "120ms" }}>
            {s.text}
          </p>
        </div>
        <div className="mt-7 grid max-w-[640px] gap-4 sm:grid-cols-3">
          {CHIPS.map((c) => (
            <div key={c.title} className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand text-ink">
                <c.icon className="h-[18px] w-[18px]" />
              </span>
              <span className="leading-tight">
                <span className="block text-[14px] font-semibold text-white">{c.title}</span>
                <span className="text-[12.5px] text-white/60">{c.text}</span>
              </span>
            </div>
          ))}
        </div>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link to={s.link} className="btn-brand !px-7 !py-3.5">
            {s.cta || s.linkText} <ArrowRight className="h-4 w-4" />
          </Link>
          <a href="#callback" className="btn-ghost !py-3.5">Talk to an expert</a>
        </div>
        <div className="mt-10 flex flex-wrap gap-2" role="tablist" aria-label="Topics">
          {SLIDES.map((x, idx) => (
            <button
              key={x.tag}
              role="tab"
              aria-selected={idx === i}
              onClick={() => setI(idx)}
              className={`rounded-full px-3.5 py-1.5 text-[12.5px] font-semibold transition ${idx === i ? "bg-white text-ink" : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"}`}
            >
              {x.tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── 3 + 4. callback form + stats ───────────── */

function Callback() {
  return (
    <section id="callback" className="relative z-10 scroll-mt-28 bg-surface pb-12">
      <div className="container-x -mt-24">
        <div className="rounded-[26px] bg-white p-5 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.55)] ring-1 ring-black/5 sm:p-7">
          <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <p className="text-[18px] font-bold text-ink">Get a free call from our expert</p>
            <p className="text-[14px]">Tell us what you need and we'll guide you.</p>
          </div>
          <LeadForm />
        </div>
        <div className="mt-10 grid grid-cols-2 gap-y-7 md:grid-cols-4">
          <div className="flex items-center gap-3 md:justify-center">
            <GoogleG />
            <div>
              <p className="text-[22px] font-extrabold leading-none text-ink">4.8<span className="text-[14px] font-semibold text-body">/5</span></p>
              <p className="mt-1 text-[13px]">Google Rating</p>
              <Stars className="h-3.5 w-3.5" />
            </div>
          </div>
          {[
            { icon: Users, big: "1,000+", small: "Happy Clients" },
            { icon: MapPin, big: "Pan-India", small: "Service" },
            { icon: ShieldCheck, big: "100%", small: "Online Process" },
          ].map((t) => (
            <div key={t.small} className="flex items-center gap-3 md:justify-center md:border-l md:border-line">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-brand text-ink">
                <t.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-[22px] font-extrabold leading-none text-ink">{t.big}</p>
                <p className="mt-1 text-[13px]">{t.small}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── 5. bento grid ───────────── */

const CAT_ICON: Record<string, typeof Landmark> = {
  registration: Landmark,
  branding: PenTool,
  design: Printer,
  "social-media": Share2,
  website: Monitor,
  "ai-tools": Bot,
  "microsoft-certifications": GraduationCap,
};

// grid placement for each tile (desktop)
const BENTO: Record<string, string> = {
  registration: "lg:col-span-2 lg:row-span-2",
  branding: "",
  design: "",
  "social-media": "",
  website: "",
  "ai-tools": "",
  "microsoft-certifications": "lg:col-span-3",
};

function Bento() {
  const ms = CATEGORIES.find((c) => c.slug === "microsoft-certifications")!;
  const rest = CATEGORIES.filter((c) => c.slug !== "microsoft-certifications");
  return (
    <section className="bg-surface pb-20 pt-8 sm:pb-24">
      <div className="container-x">
        <Head
          pill="Our Services"
          title={<>Everything your business needs, <span className="mark">in one place</span></>}
          text="Pick a category. Each one has a clear list of services with expert support."
          note="All business services under one roof"
        />
        <div className="grid auto-rows-[250px] gap-4 sm:grid-cols-2 lg:auto-rows-[230px] lg:grid-cols-4">
          {rest.map((c) => {
            const Icon = CAT_ICON[c.slug];
            const big = c.slug === "registration";
            return (
              <Link
                key={c.slug}
                to={`/services/${c.slug}`}
                className={`${BENTO[c.slug]} ${big ? "row-span-2" : ""} group relative isolate flex flex-col justify-end overflow-hidden rounded-[24px] p-5 sm:p-6`}
              >
                <img src={c.image} alt="" loading="lazy" className="photo absolute inset-0 -z-20 h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]" />
                <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/90 via-black/45 to-black/0" />
                <span className="absolute left-5 top-5 grid h-11 w-11 place-items-center rounded-2xl bg-brand text-ink shadow-lg sm:left-6 sm:top-6">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="absolute right-5 top-5 rounded-full bg-black/45 px-2.5 py-1 text-[11.5px] font-semibold text-white ring-1 ring-white/20 backdrop-blur sm:right-6 sm:top-6">
                  {c.services.length} services
                </span>
                <h3 className={`${big ? "text-[30px]" : "text-[21px]"} pr-12 font-extrabold leading-tight !text-white`}>{c.title}</h3>
                <p className={`mt-1.5 pr-12 text-white/75 ${big ? "max-w-sm text-[15px]" : "text-[13.5px] leading-snug"}`}>{c.short}</p>
                {big && (
                  <div className="mt-4 flex flex-wrap gap-1.5 pr-12">
                    {c.menuItems.slice(0, 5).map((m) => (
                      <span key={m} className="rounded-full bg-white/12 px-2.5 py-1 text-[12px] font-medium text-white ring-1 ring-white/20">{short(m)}</span>
                    ))}
                  </div>
                )}
                <span className="absolute bottom-5 right-5 grid h-10 w-10 place-items-center rounded-full bg-white text-ink transition group-hover:rotate-[-45deg] group-hover:bg-brand sm:bottom-6 sm:right-6">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
          <Link
            to={`/services/${ms.slug}`}
            className={`${BENTO[ms.slug]} group relative isolate flex overflow-hidden rounded-[24px] bg-ink sm:col-span-2`}
          >
            <img src={ms.image} alt="" loading="lazy" className="photo absolute inset-y-0 right-0 -z-20 h-full w-full object-cover object-[70%_30%] opacity-90 transition duration-700 group-hover:scale-[1.04] lg:w-[62%]" />
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#0e0e10_0%,#0e0e10_40%,rgba(14,14,16,0.6)_62%,rgba(14,14,16,0.05)_100%)] max-lg:bg-[linear-gradient(90deg,#0e0e10_10%,rgba(14,14,16,0.55)_100%)]" />
            <div className="flex flex-col justify-center p-6 sm:p-8">
              <span className="flex items-center gap-2.5">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand text-ink"><GraduationCap className="h-5 w-5" /></span>
                <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11.5px] font-semibold text-white ring-1 ring-white/20">{ms.services.length} exams</span>
              </span>
              <h3 className="mt-4 text-[26px] font-extrabold !text-white">{ms.title}</h3>
              <p className="mt-1.5 max-w-[340px] text-[14px] text-white/70">{ms.short}</p>
              <span className="btn-brand mt-5 w-fit !py-2.5 text-[14px]">View Exams <ArrowRight className="h-4 w-4" /></span>
            </div>
            <p className="hand pointer-events-none absolute left-[46%] top-1/2 hidden -translate-y-1/2 -rotate-6 text-[26px] leading-[1.1] text-white lg:block">
              Learn<br />&nbsp;&nbsp;Practice<br />&nbsp;&nbsp;&nbsp;&nbsp;Get Certified<br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-brand">Grow ↗</span>
            </p>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ───────────── 6. who we help ───────────── */

const INDUSTRIES = [
  {
    image: "/images/industry-shop.jpg",
    tag: "Shops & Traders",
    icon: Store,
    title: "Shop owners",
    text: "Get legal, look trusted and reply to customers faster.",
    services: ["GST Registration", "Shop & Establishment", "Logo Design", "WhatsApp Auto-Reply"],
  },
  {
    image: "/images/industry-cafe.jpg",
    tag: "Food Business",
    icon: Coffee,
    title: "Cafés & restaurants",
    text: "Licences, menus and a buzzing Instagram page.",
    services: ["FSSAI (Food License)", "Menu Card", "Instagram & Facebook Handling", "Google Ranking (SEO)"],
  },
  {
    image: "/images/industry-startup.jpg",
    tag: "New Companies",
    icon: Rocket,
    title: "Startups",
    text: "Start right, protect your name and launch online.",
    services: ["Company Registration (Pvt Ltd)", "Trademark", "Full Brand Kit", "Business Website"],
  },
  {
    image: "/images/industry-student.jpg",
    tag: "Careers",
    icon: GraduationCap,
    title: "Students & professionals",
    text: "Job-ready Microsoft certificates with guided training.",
    services: ["AZ-900: Azure Fundamentals", "AI-901: Azure AI Fundamentals", "PL-900: Power Platform Fundamentals", "SC-900: Security, Compliance & Identity Fundamentals"],
  },
];

function WhoWeHelp() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="container-x">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <span className="pill">Who We Help</span>
            <h2 className="mt-4 text-[32px] font-extrabold leading-[1.12] tracking-[-0.02em] sm:text-[42px]">
              Built for <span className="mark">people like you</span>
            </h2>
            <p className="mt-3 text-[16px]">Pick what describes you best — here's where most people like you start.</p>
          </div>
          <p className="hand max-w-[230px] -rotate-3 text-[26px] text-ink/80">Not listed? We still help — just ask! 🙂</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {INDUSTRIES.map((it) => (
            <article key={it.title} className="group flex flex-col overflow-hidden rounded-[24px] bg-surface ring-1 ring-line transition hover:-translate-y-1 hover:shadow-[0_30px_60px_-34px_rgba(0,0,0,0.5)]">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={asset(it.image)} alt="" loading="lazy" className="photo h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 text-[12px] font-bold text-ink">
                  <it.icon className="h-3.5 w-3.5" /> {it.tag}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-[20px] font-extrabold">{it.title}</h3>
                <p className="mt-1 text-[14px] leading-snug">{it.text}</p>
                <ul className="mt-4 space-y-1.5">
                  {it.services.map((name) => {
                    const s = svc(name);
                    return (
                      <li key={name}>
                        <Link to={s.href} className="flex items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 text-[13px] font-semibold leading-snug text-ink ring-1 ring-line transition hover:bg-ink hover:text-white">
                          <span>{label(name)}</span>
                          <ArrowUpRight className="h-4 w-4 shrink-0 text-ink/40 group-hover:text-current" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── 7. popular services ───────────── */

const POP_ICONS = [FileText, Landmark, BadgeCheck, Store, Palette, Globe2, Instagram, MessageCircle];

function Popular() {
  const ticker = [...POPULAR, ...POPULAR];
  return (
    <section className="overflow-hidden bg-surface pb-20 pt-3 sm:pb-24">
      <div className="-mx-4 -rotate-1 overflow-hidden bg-brand py-4 shadow-[0_12px_30px_-18px_rgba(0,0,0,0.5)]" aria-hidden>
        <div className="marquee flex w-max gap-8 whitespace-nowrap">
          {ticker.map((p, k) => (
            <span key={k} className="flex items-center gap-8 text-[19px] font-extrabold uppercase tracking-tight text-ink">
              {p.name} <Sparkles className="h-5 w-5" />
            </span>
          ))}
        </div>
      </div>
      <div className="container-x pt-16">
        <Head pill="Most Asked" title="Most Popular Services" text="These are what most of our customers start with." note="Most people start here!" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {POPULAR.map((p, idx) => {
            const Icon = POP_ICONS[idx];
            return (
              <Link
                key={p.name}
                to={serviceUrl(p.cat, p.name)}
                className="group relative flex flex-col rounded-[22px] bg-white p-5 ring-1 ring-line transition hover:-translate-y-1 hover:bg-ink hover:ring-ink"
              >
                <span className="absolute right-5 top-5 text-[13px] font-bold text-ink/25 group-hover:text-white/30">0{idx + 1}</span>
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand/25 text-ink transition group-hover:bg-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-[17px] font-bold leading-snug transition group-hover:!text-white">{p.name}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-[13.5px] text-body group-hover:text-white/60">
                  <Clock className="h-3.5 w-3.5" /> {p.days}
                </p>
                <span className="mt-5 inline-flex w-fit items-center gap-1 text-[14px] font-semibold text-ink underline decoration-brand decoration-[3px] underline-offset-[5px] transition group-hover:gap-2 group-hover:text-brand">
                  Know More <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ───────────── 8. "which service do I need?" quiz ───────────── */

type QNode = { q: string; options: { label: string; next?: QNode; result?: string[] }[] };

const QUIZ: QNode = {
  q: "What are you working on right now?",
  options: [
    {
      label: "Starting a new business",
      next: {
        q: "Who is starting it?",
        options: [
          {
            label: "Just me",
            next: {
              q: "Will you sell online or to other states?",
              options: [
                { label: "Yes", result: ["Proprietorship / Firm Registration", "GST Registration"] },
                { label: "No, only locally", result: ["Proprietorship / Firm Registration", "MSME / Udyam"] },
              ],
            },
          },
          {
            label: "With partners",
            next: {
              q: "Do you plan to raise investment later?",
              options: [
                { label: "Yes", result: ["Company Registration (Pvt Ltd)", "Trademark"] },
                { label: "No", result: ["LLP Registration", "GST Registration"] },
              ],
            },
          },
        ],
      },
    },
    {
      label: "Growing my business",
      next: {
        q: "What do you need most?",
        options: [
          {
            label: "More customers online",
            next: {
              q: "Do you already have a website?",
              options: [
                { label: "Yes", result: ["Google Ranking (SEO)", "Instagram & Facebook Handling"] },
                { label: "Not yet", result: ["Business Website", "Instagram & Facebook Handling"] },
              ],
            },
          },
          {
            label: "A better brand look",
            next: {
              q: "Do you have a logo already?",
              options: [
                { label: "Yes", result: ["Full Brand Kit", "Rebranding"] },
                { label: "No", result: ["Logo Design", "Business Card"] },
              ],
            },
          },
          {
            label: "Legal & tax work",
            next: {
              q: "Do you have a GST number?",
              options: [
                { label: "Yes", result: ["GST & Income Tax Filing", "Trademark"] },
                { label: "No", result: ["GST Registration", "MSME / Udyam"] },
              ],
            },
          },
        ],
      },
    },
    {
      label: "Learning a new skill",
      next: {
        q: "Which area interests you?",
        options: [
          {
            label: "Cloud",
            next: {
              q: "Have you worked in IT before?",
              options: [
                { label: "Yes", result: ["AZ-900: Azure Fundamentals", "SC-900: Security, Compliance & Identity Fundamentals"] },
                { label: "No, I'm new", result: ["AZ-900: Azure Fundamentals", "MS-900: Microsoft 365 Fundamentals"] },
              ],
            },
          },
          {
            label: "AI",
            next: {
              q: "Do you use Microsoft 365 or Copilot at work?",
              options: [
                { label: "Yes", result: ["AB-900: Copilot & Agent Administration Fundamentals", "AI-901: Azure AI Fundamentals"] },
                { label: "No", result: ["AI-901: Azure AI Fundamentals", "AZ-900: Azure Fundamentals"] },
              ],
            },
          },
          {
            label: "Data & reports",
            next: {
              q: "Do you prefer no-code tools?",
              options: [
                { label: "Yes", result: ["PL-900: Power Platform Fundamentals", "DP-900: Azure Data Fundamentals"] },
                { label: "No", result: ["DP-900: Azure Data Fundamentals", "AZ-900: Azure Fundamentals"] },
              ],
            },
          },
        ],
      },
    },
  ],
};

function Quiz() {
  const site = useSite();
  const [path, setPath] = useState<number[]>([]);
  const { node, result } = useMemo(() => {
    let n: QNode = QUIZ;
    let r: string[] | undefined;
    for (const idx of path) {
      const o = n.options[idx];
      if (o.result) r = o.result;
      else if (o.next) n = o.next;
    }
    return { node: n, result: r };
  }, [path]);
  const step = Math.min(path.length + 1, 3);
  const picks = result?.map(svc) ?? [];
  const wa = waLink(site.whatsapp, `Hi ${site.siteName}, the website suggested ${picks.map((p) => p.name).join(" + ")} for me. Can you help?`);

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="container-x">
        <div className="grid overflow-hidden rounded-[30px] bg-ink lg:grid-cols-[1fr_1.25fr]">
          <div className="relative p-8 sm:p-12">
            <span className="pill">20-second quiz</span>
            <h2 className="mt-5 text-[34px] font-extrabold leading-[1.08] tracking-[-0.02em] !text-white sm:text-[46px]">
              Not sure which service <span className="text-brand">you need?</span>
            </h2>
            <p className="mt-4 max-w-sm text-[16px] text-white/65">Answer 3 quick questions and we'll point you to the right place. No sign-up.</p>
            <div className="mt-8 hidden -rotate-3 items-end gap-2 text-brand lg:flex">
              <p className="hand text-[28px]">Try it — it's fun!</p>
              <HandArrow className="h-12 w-16 rotate-[200deg]" />
            </div>
          </div>
          <div className="m-3 rounded-[24px] bg-white p-6 sm:m-4 sm:p-9" aria-live="polite">
            {!result ? (
              <div key={path.join("-")} className="fade-up">
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-bold uppercase tracking-[0.12em] text-body">Question {step} of 3</p>
                  <div className="flex gap-1.5">
                    {[1, 2, 3].map((k) => (
                      <span key={k} className={`h-2 rounded-full transition-all ${k <= step ? "w-8 bg-brand" : "w-2 bg-line"}`} />
                    ))}
                  </div>
                </div>
                <h3 className="mt-4 text-[24px] font-extrabold leading-snug sm:text-[28px]">{node.q}</h3>
                <div className="mt-6 grid gap-3">
                  {node.options.map((o, idx) => (
                    <button
                      key={o.label}
                      onClick={() => setPath([...path, idx])}
                      className="group flex items-center justify-between rounded-2xl border-2 border-line px-5 py-4 text-left text-[16px] font-semibold text-ink transition hover:border-ink hover:bg-brand"
                    >
                      {o.label}
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-surface transition group-hover:bg-ink group-hover:text-brand">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </button>
                  ))}
                </div>
                {path.length > 0 && (
                  <button onClick={() => setPath(path.slice(0, -1))} className="mt-5 text-[14px] font-semibold text-body hover:text-ink">
                    ← Back
                  </button>
                )}
              </div>
            ) : (
              <div className="fade-up">
                <p className="flex items-center gap-2 text-[13px] font-bold uppercase tracking-[0.12em] text-body">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-wa text-white"><Check className="h-3.5 w-3.5" /></span>
                  Our suggestion for you
                </p>
                <div className="mt-5 grid gap-3">
                  {picks.map((p, k) => (
                    <Link key={p.name} to={p.href} className="group flex items-start gap-4 rounded-2xl bg-surface p-4 ring-1 ring-line transition hover:bg-brand hover:ring-brand">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-[15px] font-extrabold text-brand">{k + 1}</span>
                      <span className="flex-1">
                        <span className="block text-[17px] font-bold text-ink">{p.name}</span>
                        <span className="mt-0.5 block text-[14px] leading-snug">{p.text}</span>
                        {p.days && <span className="mt-1.5 flex items-center gap-1 text-[12.5px] font-medium text-ink/60"><Clock className="h-3.5 w-3.5" /> {p.days}</span>}
                      </span>
                      <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-ink/40 group-hover:text-ink" />
                    </Link>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <a href={wa} target="_blank" rel="noreferrer" className="btn-dark !py-3">
                    <WaIcon className="h-4 w-4 text-wa" /> Ask an expert on WhatsApp
                  </a>
                  <a href="#callback" className="btn-brand !py-3">Get a free call</a>
                </div>
                <button onClick={() => setPath([])} className="mt-5 flex items-center gap-1.5 text-[14px] font-semibold text-body hover:text-ink">
                  <RotateCcw className="h-4 w-4" /> Start again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── 9. how it works ───────────── */

const STEPS = [
  { icon: ClipboardList, title: "Tell Us What You Need", text: "Fill the form or call us. It takes 1 minute." },
  { icon: Upload, title: "Share Your Documents", text: "Send them on WhatsApp or email. No office visit." },
  { icon: BadgeCheck, title: "We Get It Done", text: "You get updates at every step until it's complete." },
];

function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-ink py-20 sm:py-24">
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-brand/10 blur-3xl" />
      <div className="container-x relative">
        <Head pill="How It Works" title="Simple 3-Step Process" text="From talking to completion — we make it easy." light />
        <div className="grid gap-6 md:grid-cols-3 md:gap-10">
          {STEPS.map((s, idx) => (
            <div key={s.title} className="relative">
              <p className="relative z-10 pl-2 text-[96px] font-extrabold leading-none tracking-[-0.05em] text-transparent [-webkit-text-stroke:2px_var(--color-brand)] sm:text-[120px]">
                0{idx + 1}
              </p>
              <div className="-mt-7 rounded-[22px] bg-[#1b1b1f] p-6 pt-9 ring-1 ring-white/10">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-brand text-ink">
                  <s.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-[20px] font-bold !text-white">{s.title}</h3>
                <p className="mt-1.5 text-[15px] text-white/65">{s.text}</p>
              </div>
              {idx < STEPS.length - 1 && (
                <svg viewBox="0 0 60 20" className="absolute -right-9 top-[150px] hidden h-6 w-12 text-brand md:block" fill="none" aria-hidden>
                  <path d="M2 10h50M44 3l8 7-8 7" stroke="currentColor" strokeWidth="2.5" strokeDasharray="5 5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────── 10. trust + reviews (masonry) ───────────── */

const WHY = [
  { icon: Sparkles, title: "One place for everything", text: "Registration, branding, website and marketing — no running around." },
  { icon: IndianRupee, title: "Clear pricing", text: "You know the full cost before we start. No hidden charges." },
  { icon: Smartphone, title: "Fully online", text: "Do everything from your phone, from anywhere in India." },
  { icon: Headphones, title: "Real experts", text: "CA, CS and design experts guide you at every step." },
];

const REVIEWS = [
  { name: "Ravi K.", city: "Hyderabad", text: "My GST and company registration were done in a week. Very smooth, and they explained everything simply.", tone: "bg-brand text-ink" },
  { name: "Priya S.", city: "Bengaluru", text: "They designed our logo and website together. Looks very professional and customers notice it.", tone: "bg-ink text-brand" },
  { name: "Arjun M.", city: "Pune", text: "Our Instagram enquiries doubled in 2 months. The team posts on time every week.", tone: "bg-[#e7e3d6] text-ink" },
];

function Trust() {
  const site = useSite();
  return (
    <section className="bg-surface py-20 sm:py-24">
      <div className="container-x grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <span className="pill">Why {site.siteName}?</span>
          <h2 className="mt-4 text-[32px] font-extrabold leading-[1.12] tracking-[-0.02em] sm:text-[42px]">
            Why businesses<br /><span className="mark">trust us</span>
          </h2>
          <div className="mt-8 divide-y divide-line rounded-[24px] bg-white ring-1 ring-line">
            {WHY.map((w) => (
              <div key={w.title} className="flex gap-4 p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-brand text-ink">
                  <w.icon className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="text-[16.5px] font-bold">{w.title}</h3>
                  <p className="text-[14.5px]">{w.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-[22px] font-extrabold">What Our Clients Say</h3>
            <span className="flex items-center gap-2 text-[14px] font-semibold text-ink">
              <Stars /> 4.8 on Google
            </span>
          </div>
          <div className="columns-1 gap-4 sm:columns-2 [&>*]:mb-4 [&>*]:break-inside-avoid">
            <div className="rounded-[24px] bg-ink p-7 text-white">
              <p className="text-[56px] font-extrabold leading-none text-brand">4.8<span className="text-[26px]">★</span></p>
              <p className="mt-2 text-[15px] text-white/70">Average rating from 1,000+ happy clients across India.</p>
              <p className="hand mt-4 rotate-[-3deg] text-[24px] text-brand">Thank you for trusting us! 💛</p>
            </div>
            {REVIEWS.map((r, k) => (
              <figure key={r.name} className={`rounded-[24px] bg-white p-6 ring-1 ring-line ${k === 1 ? "pb-8" : ""}`}>
                <Stars />
                <blockquote className="mt-3 text-[15.5px] leading-relaxed text-ink">“{r.text}”</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className={`grid h-11 w-11 place-items-center rounded-full text-[15px] font-extrabold ${r.tone}`}>
                    {r.name.split(" ").map((x) => x[0]).join("")}
                  </span>
                  <span>
                    <span className="block font-bold text-ink">{r.name}</span>
                    <span className="text-[13px]">{r.city}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
            <div className="rounded-[24px] border-2 border-dashed border-ink/20 p-6">
              <p className="text-[15px] font-semibold text-ink">Join 1,000+ businesses growing with us.</p>
              <a href="#callback" className="mt-3 inline-flex items-center gap-1 text-[14px] font-bold text-ink underline decoration-brand decoration-[3px] underline-offset-4">
                Start with a free call <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────── 11. FAQ + WhatsApp person ───────────── */

const FAQS = [
  { q: "Do I need to visit your office?", a: "No. Everything is done online. You can share documents on WhatsApp or email." },
  { q: "How long does GST registration take?", a: "Usually 3 to 7 working days, once we have all your documents." },
  { q: "Can you do registration and the website together?", a: "Yes. Many clients start with registration and logo, then add a website. We offer combo prices." },
  { q: "How do I pay?", a: "You can pay by UPI, debit/credit card or bank transfer. You get a proper GST invoice." },
  { q: "I'm not sure which registration I need. Can you help?", a: "Yes — that's what the free consultation is for. Our expert will suggest the right option for you." },
];

function Faq() {
  const site = useSite();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="container-x grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <span className="pill">FAQ</span>
          <h2 className="mt-4 text-[32px] font-extrabold leading-[1.12] tracking-[-0.02em] sm:text-[42px]">Common Questions</h2>
          <div className="mt-8 space-y-3">
            {FAQS.map((f, idx) => {
              const isOpen = open === idx;
              return (
                <div key={f.q} className={`rounded-[20px] transition ${isOpen ? "bg-brand/20 ring-1 ring-brand" : "bg-surface ring-1 ring-line"}`}>
                  <button
                    onClick={() => setOpen(isOpen ? null : idx)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-[16px] font-bold text-ink"
                    aria-expanded={isOpen}
                  >
                    {f.q}
                    <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${isOpen ? "bg-ink text-brand" : "bg-white text-ink ring-1 ring-line"}`}>
                      {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                    </span>
                  </button>
                  <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                    <div className="overflow-hidden">
                      <p className="px-5 pb-5 text-[15px]">{f.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[400px]">
          <div className="relative z-10 -rotate-6 text-ink">
            <p className="hand text-[28px] leading-tight">Still have a question?<br />Chat with us on WhatsApp</p>
            <HandArrow className="ml-24 mt-1 h-12 w-16 rotate-[190deg]" />
          </div>
          <div className="relative -mt-4 aspect-square overflow-hidden rounded-full bg-brand ring-[10px] ring-brand/25">
            <img src={asset("/images/faq-whatsapp.png")} alt="" className="h-full w-full object-cover object-top mix-blend-multiply" />
          </div>
          <div className="absolute -right-2 bottom-6 space-y-2 sm:-right-8">
            {[
              { icon: Zap, t: "Quick replies" },
              { icon: Briefcase, t: "Expert guidance" },
              { icon: Lock, t: "100% safe & secure" },
            ].map((b) => (
              <span key={b.t} className="flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[13px] font-semibold text-ink shadow-[0_14px_30px_-16px_rgba(0,0,0,0.55)] ring-1 ring-line">
                <b.icon className="h-4 w-4 text-ink" /> {b.t}
              </span>
            ))}
          </div>
          <a
            href={waLink(site.whatsapp, site.bot.whatsappMessage)}
            target="_blank"
            rel="noreferrer"
            className="absolute bottom-8 left-0 flex items-center gap-2 rounded-full bg-wa px-5 py-3 font-semibold text-white shadow-[0_16px_34px_-14px_rgba(37,211,102,0.8)] sm:-left-4"
          >
            <WaIcon className="h-5 w-5" /> Chat now
          </a>
        </div>
      </div>
    </section>
  );
}

/* ───────────── 12. CTA band (also used on inner pages) ───────────── */

export function CtaBand() {
  const site = useSite();
  return (
    <section className="bg-white py-14">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[30px] bg-ink p-8 ring-[3px] ring-brand sm:p-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border-[18px] border-brand/15" />
          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <span className="pill">Let's get started</span>
              <h2 className="mt-4 text-[32px] font-extrabold leading-tight !text-white sm:text-[42px]">
                Ready to grow your <span className="text-brand">business?</span>
              </h2>
              <p className="mt-2 text-[16px] text-white/65">Talk to our expert today. The first consultation is free.</p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <Link to="/contact" className="btn-brand !py-3.5">
                Get Free Consultation <ArrowRight className="h-4 w-4" />
              </Link>
              <a href={waLink(site.whatsapp, site.bot.whatsappMessage)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-wa px-6 py-3.5 font-semibold text-white transition hover:-translate-y-0.5">
                <WaIcon /> WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Index() {
  return (
    <>
      <Hero />
      <Callback />
      <Bento />
      <WhoWeHelp />
      <Popular />
      <Quiz />
      <HowItWorks />
      <Trust />
      <Faq />
      <CtaBand />
    </>
  );
}
