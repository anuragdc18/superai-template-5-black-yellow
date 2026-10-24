import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { ArrowRight, CheckCircle2, Clock, ChevronRight } from "lucide-react";
import { CATEGORIES, serviceUrl, slugify } from "../lib/site";
import { LeadForm } from "../components/lead-form";
import { CtaBand, HandArrow } from "./index";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const cat = CATEGORIES.find((c) => c.slug === slug);

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) {
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "center" }), 60);
        el.classList.add("ring-2", "ring-brand");
        setTimeout(() => el.classList.remove("ring-2", "ring-brand"), 2200);
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [slug]);

  if (!cat) {
    return (
      <div className="container-x py-32 text-center">
        <h1 className="text-3xl font-bold">Page not found</h1>
        <Link to="/" className="btn-brand mt-6">Go Home</Link>
      </div>
    );
  }

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink">
        <img src={cat.image} alt="" className="photo absolute inset-0 -z-10 h-full w-full object-cover object-right" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#0e0e10_0%,rgba(14,14,16,0.92)_45%,rgba(14,14,16,0.35)_100%)]" />
        <div className="pointer-events-none absolute bottom-10 right-[8%] hidden -rotate-6 text-white lg:block">
          <HandArrow className="ml-auto h-12 w-16 rotate-[150deg] text-brand" />
          <p className="hand text-right text-[28px]">{cat.services.length} {cat.slug === "microsoft-certifications" ? "exams" : "services"},<br />one expert team</p>
        </div>
        <div className="container-x py-16 sm:py-24">
          <nav className="flex items-center gap-1.5 text-[13px] text-white/60">
            <Link to="/" className="hover:text-white">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-semibold text-brand">{cat.title}</span>
          </nav>
          <h1 className="rise mt-4 max-w-2xl text-[42px] font-extrabold leading-[1.05] tracking-[-0.03em] !text-white sm:text-[60px]">{cat.title}<span className="text-brand">.</span></h1>
          <p className="rise mt-4 max-w-xl text-[17px] leading-relaxed text-white/75" style={{ animationDelay: "100ms" }}>{cat.intro}</p>
          <a href="#enquire" className="btn-brand rise mt-7" style={{ animationDelay: "180ms" }}>
            Get Free Consultation <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </section>

      <div className="border-b border-line bg-surface">
        <div className="container-x flex gap-2 overflow-x-auto py-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              to={`/services/${c.slug}`}
              className={`whitespace-nowrap rounded-full px-4 py-2 text-[14px] font-semibold transition ${
                c.slug === cat.slug ? "bg-brand text-ink" : "bg-white text-ink/70 ring-1 ring-line hover:text-ink hover:ring-ink"
              }`}
            >
              {c.title}
            </Link>
          ))}
        </div>
      </div>

      <section className="bg-surface py-14">
        <div className="container-x grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <div>
            <span className="pill">{cat.services.length} {cat.slug === "microsoft-certifications" ? "exams" : "services"}</span>
            <h2 className="mt-3 text-[28px] font-extrabold tracking-[-0.02em] sm:text-[34px]">{cat.slug === "microsoft-certifications" ? "All Microsoft Certifications" : `All ${cat.title} Services`}</h2>
            <p className="mt-2">{cat.slug === "microsoft-certifications" ? 'Tap "Learn More" to see who it is for and what you get.' : 'Tap "Learn More" to see details, documents and time taken.'}</p>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              {cat.services.map((s) => (
                <div
                  key={s.name}
                  id={slugify(s.name)}
                  className="group scroll-mt-32 flex flex-col rounded-[22px] bg-white p-5 ring-1 ring-line transition hover:-translate-y-0.5 hover:ring-ink hover:shadow-[0_24px_44px_-28px_rgba(0,0,0,0.5)]"
                >
                  <div className="flex items-start gap-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand text-ink"><CheckCircle2 className="h-4 w-4" /></span>
                    <div>
                      <h3 className="text-[16.5px] font-bold leading-snug">{s.name}</h3>
                      <p className="mt-1.5 text-[14.5px] leading-relaxed">{s.text}</p>
                    </div>
                  </div>
                  <div className="mt-auto flex items-center justify-between pt-4 pl-10">
                    <Link
                      to={serviceUrl(cat.slug, s.name)}
                      className="inline-flex items-center gap-1 text-[14px] font-semibold text-ink underline decoration-brand decoration-[3px] underline-offset-[5px] hover:gap-2"
                    >
                      Learn More <ArrowRight className="h-4 w-4" />
                    </Link>
                    {s.days ? (
                      <span className="flex items-center gap-1.5 rounded-full bg-surface px-2.5 py-1 text-[12.5px] font-medium text-ink/70"><Clock className="h-3.5 w-3.5" /> {s.days}</span>
                    ) : <span />}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <aside id="enquire" className="scroll-mt-28 overflow-hidden rounded-[24px] bg-white shadow-[0_34px_70px_-38px_rgba(0,0,0,0.55)] ring-1 ring-line lg:sticky lg:top-28">
            <div className="bg-ink px-6 py-5">
              <span className="pill">Free call</span>
              <h3 className="mt-3 text-[22px] font-extrabold !text-white">Talk to an expert</h3>
              <p className="mt-1 text-[14px] text-white/65">We'll call you back within 30 minutes.</p>
            </div>
            <div className="p-6 pt-1">
            <div className="mt-5">
              <LeadForm layout="stack" source={`category:${cat.slug}`} defaultService={cat.services[0].name} />
            </div>
            </div>
          </aside>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
