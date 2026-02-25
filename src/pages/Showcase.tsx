import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";
import profilePic from "../assets/profile.jpg";
import { skillsets } from "../components/work-page/content/SkillsData";
import { experiences } from "../components/work-page/content/ExperiencesData";
import {
  certifications,
  certificationTraining,
  certificationTrainingLinks,
  education,
} from "../components/work-page/content/EducationData";
import ErrorBoundary from "../components/shared/ErrorBoundary";
import TravelMap from "../components/hobbies/TravelMap";
import { hobbies } from "../components/hobbies/content/HobbiesData";

export default function Showcase() {
  const resolvePublicAsset = (path: string) => {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;
    const cleanPath = path.replace(/^\/+/, "");
    return `${import.meta.env.BASE_URL}${cleanPath}`;
  };

  const [expandedProof, setExpandedProof] = useState<{ items: Array<{ src: string; label: string; kind?: "image" | "video" }>; index: number } | null>(null);
  const hiddenExperienceCompanies = new Set([
    "Reunion & Westgate Resorts",
    "Market Street Cafe",
    "General Nutrition Centers (GNC)",
    "Ascendant Holidays (Carnival)",
  ]);

  const visibleExperiences = experiences.filter(
    (exp) => !hiddenExperienceCompanies.has(exp.companyName)
  );
  const bsProgram = education.find((item) => item.program === "Computer Science - B.S.");
  const bsProofGallery =
    bsProgram && "proofGallery" in bsProgram && Array.isArray(bsProgram.proofGallery)
      ? bsProgram.proofGallery
      : [];
  const jpProofGallery = ["/projects/jp1.png", "/projects/jp2.png", "/projects/jp3.png", "/projects/jp4.png"];
  const activeProof = expandedProof ? expandedProof.items[expandedProof.index] : null;

  const projectVisuals = [
    {
      title: "Performance Analysis Deck (Stakeholder Reporting)",
      summary: "Data-driven presentation designed for clear insights and decision-making.",
      src: "/projects/outreach-analysis.png",
    },
    {
      title: "Coffee Shop Website (Design, Build, Deployment)",
      summary:
        "Responsive website for a local pop-up, built to showcase menu, brand, and location.",
      src: "/projects/coffee-shop-site.png",
      projectUrl: "http://preandpostcoffee.vercel.app/",
      codeUrl: "https://github.com/Emq17/coffee-shop",
    },
    {
      title: "Analytics Dashboard (KPI Tracking & Trends)",
      summary: "Interactive dashboard for monitoring performance, growth trends, and key metrics.",
      src: "/projects/analytics-dashboard.png",
    },
  ];

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
    if (targets.length === 0) return;

    // Deep-linking to a section (e.g. from hobby detail) should not animate
    // section containers, otherwise the target shifts after scroll settles.
    if (window.location.hash) {
      targets.forEach((target) => target.classList.add("show"));
      return;
    }

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      targets.forEach((target) => target.classList.add("show"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="showcase-shell px-4 pb-20 md:pb-28">
      <div className="mx-auto max-w-6xl">
        <section
          id="hero"
          className="reveal showcase-card min-h-[52vh] md:min-h-[64vh] p-6 md:p-10 grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-8 items-center text-center lg:text-left"
        >
          <div className="space-y-5">
            <p className="section-kicker">Portfolio</p>
            <h1 className="text-4xl md:text-6xl font-bebas leading-[0.95]">
              Emmette Quiambao
            </h1>
            <div className="max-w-3xl">
              <p className="section-kicker">Who I Am</p>
              <p className="text-white/70 mt-2">
                I build reliable systems from messy ideas and real-world constraints. My work
                lives at the intersection of data, software, and operations, focused on building
                things that move the needle.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 pt-2 justify-center lg:justify-start">
              <a href="#experience" className="showcase-cta-primary">
                Explore Work
              </a>
              <a href="#contact" className="showcase-cta-secondary">
                Contact Me
              </a>
            </div>
          </div>

          <div className="mx-auto w-64 h-64 md:w-[28rem] md:h-[28rem] rounded-full p-[3px] bg-gradient-to-br from-cyan-300/80 via-blue-500/70 to-indigo-500/60">
            <img
              src={profilePic}
              alt="Emmette Quiambao"
              className="h-full w-full rounded-full object-cover"
            />
          </div>
        </section>

        <section id="projects" className="reveal showcase-card p-6 md:p-8 mt-20 md:mt-28 text-center md:text-left">
          <p className="section-kicker">Builds</p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="section-title">Projects</h2>
            <a
              href="https://github.com/Emq17"
              target="_blank"
              rel="noopener noreferrer"
              className="showcase-cta-primary self-center sm:self-auto mb-2 sm:mb-0"
            >
              View My GitHub Projects
            </a>
          </div>
          <div className="mt-1 space-y-2">
            <p className="text-sm text-white/75">
              Websites · Tools · Dashboards · Automations
            </p>
            <p className="text-sm text-white/75">
              <span className="text-white/55 uppercase tracking-wider text-[11px] mr-2">
                Focus
              </span>
              Impact-Driven Engineering
            </p>
          </div>
          <div className="project-visual-grid mt-6">
            {projectVisuals.map((visual) => (
              <article key={visual.title} className="project-visual-card">
                <img
                  src={visual.src}
                  alt={visual.title}
                  loading="lazy"
                  className="project-visual-img"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                    if (fallback) fallback.style.display = "grid";
                  }}
                />
                <div className="project-visual-fallback">
                  Add image at
                  <span className="block text-[11px] mt-1 text-white/65">{visual.src}</span>
                </div>
                {visual.projectUrl || visual.codeUrl ? (
                  <div className="project-visual-overlay">
                    {visual.projectUrl ? (
                      <a
                        href={visual.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-visual-btn"
                      >
                        View Project
                      </a>
                    ) : null}
                    {visual.codeUrl ? (
                      <a
                        href={visual.codeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-visual-btn project-visual-btn-secondary"
                      >
                        View Code
                      </a>
                    ) : null}
                  </div>
                ) : null}
                <p className="project-visual-caption">{visual.title}</p>
                <p className="project-visual-summary">{visual.summary}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="skills" className="reveal showcase-card p-6 md:p-8 mt-20 md:mt-28 text-center md:text-left">
          <p className="section-kicker">Expertise</p>
          <h2 className="section-title">Skills</h2>
          <p className="text-white/65 max-w-3xl">
            The foundations behind my work:
          </p>
          <div className="skills-grid mt-6">
            {skillsets.map((group) => (
              <article key={group.title} className="skills-panel">
                <div className="skills-panel-head">
                  <span className="skills-panel-dot" />
                  <div>
                    <p className="skills-panel-title">
                      {group.title}
                    </p>
                  </div>
                </div>
                <div className="skills-token-wrap">
                  {group.items.map((item) => (
                    <span key={`${group.title}-${item}`} className="skills-token">
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

                <section id="languages" className="reveal showcase-card p-6 md:p-8 mt-20 md:mt-28 text-center md:text-left">
          <p className="section-kicker">Communication</p>
          <h2 className="section-title">Languages</h2>
          <div className="mt-4 grid grid-cols-6 gap-2 justify-items-center md:flex md:flex-wrap md:gap-2">
            {["English", "Tagalog", "Spanish", "Japanese"].map((language, idx) => (
              <span
                key={language}
                className={`showcase-chip col-span-2 ${
                  idx === 3 ? "col-start-2" : idx === 4 ? "col-start-4" : ""
                } md:col-auto md:col-start-auto`}
              >
                {language}
              </span>
            ))}
          </div>
          <div className="mt-5">
            <p className="text-xs uppercase tracking-[0.14em] text-white/55 mb-2">Learning Progress</p>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {jpProofGallery.map((proofSrc, idx) => (
                <button
                  key={`jp-proof-${proofSrc}`}
                  type="button"
                  onClick={() =>
                    setExpandedProof({
                      items: jpProofGallery.map((src, i) => ({
                        src: resolvePublicAsset(src),
                        label: `Japanese learning snapshot ${i + 1}`,
                      })),
                      index: idx,
                    })
                  }
                  className="overflow-hidden rounded-md border border-cyan-300/40 bg-[#0b1320] hover:border-cyan-300/65 transition shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
                  aria-label={`Open Japanese learning snapshot ${idx + 1}`}
                >
                  <img
                    src={resolvePublicAsset(proofSrc)}
                    alt={`Japanese learning snapshot ${idx + 1}`}
                    loading="lazy"
                    className="h-20 w-24 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement | null;
                      if (fallback) fallback.style.display = "grid";
                    }}
                  />
                  <span className="hidden h-20 w-24 place-items-center px-2 text-[11px] text-white/65">
                    Add {proofSrc}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section id="experience" className="reveal showcase-card p-6 md:p-8 mt-20 md:mt-28 text-center md:text-left">
          <p className="section-kicker">Career</p>
          <h2 className="section-title">Experience</h2>
          <div className="mt-5 space-y-4">
            {visibleExperiences.map((exp) => (
              <article key={`${exp.companyName}-${exp.jobTitle}`} className="showcase-inner-card">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                  <div>
                    {exp.jobTitle ? <p className="text-xl font-semibold">{exp.jobTitle}</p> : null}
                    <p className="text-white/65 text-sm mt-1">
                      {exp.jobLocation ? `${exp.companyName} · ${exp.jobLocation}` : exp.companyName}
                    </p>
                  </div>
                  {exp.dateStarted || exp.dateEnded ? (
                    <p className="text-sm text-white/55 whitespace-nowrap">
                      {[exp.dateStarted, exp.dateEnded].filter(Boolean).join(" - ")}
                    </p>
                  ) : null}
                </div>
                <p className="text-white/70 mt-3 text-sm md:text-base">{exp.jobSummary}</p>
                <ul className="mt-3 space-y-1 text-white/72 list-disc list-inside text-sm">
                  {exp.keyAchievements.map((point) => (
                    <li key={`${exp.jobTitle}-${point}`}>{point}</li>
                  ))}
                </ul>
                {exp.companyName === "Independent Collaboration" ? (
                  <div className="mt-3">
                    <p className="inline-flex items-center rounded-md border border-cyan-300/40 bg-cyan-300/10 px-3 py-1.5 text-xs text-cyan-100">
                      Work Samples
                    </p>
                  </div>
                ) : null}
              </article>
            ))}
          </div>
        </section>


        <section id="education" className="reveal showcase-card p-6 md:p-8 mt-20 md:mt-28 text-center md:text-left">
          <p className="section-kicker">Background</p>
          <h2 className="section-title">Education</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            {education.map((item) => (
              <article
                key={`${item.institution}-${item.program}`}
                className="showcase-inner-card relative"
              >
                <p className="text-white/95 font-semibold whitespace-pre-line">{item.program}</p>
                <p className="text-white/65 mt-1">{item.institution}</p>
                <div className="mt-3 flex gap-2 flex-wrap justify-center md:justify-start">
                  <span className="showcase-chip">{item.status}</span>
                  {item.timeframe ? <span className="showcase-chip">{item.timeframe}</span> : null}
                </div>
                {"skills" in item && Array.isArray(item.skills) && item.skills.length > 0 ? (
                  <div className="mt-3">
                    <ul className="text-sm text-white/80 space-y-1 list-disc list-inside">
                      {item.skills.map((skill: string) => (
                        <li key={`${item.program}-skill-${skill}`}>{skill}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                <p className="text-sm text-white/50 mt-3">{item.location}</p>
              </article>
            ))}
            <article className="showcase-inner-card">
              <p className="text-white/95 font-semibold">Progress Snapshots</p>
              {bsProofGallery.length > 0 ? (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {bsProofGallery.map((proofSrc: string, idx: number) => (
                    <button
                      key={`bs-proof-${proofSrc}-${idx}`}
                      type="button"
                      onClick={() =>
                        setExpandedProof({
                          items: bsProofGallery.map((src, i) => ({
                            src: resolvePublicAsset(src),
                            label: i === 0 ? "Remaining classes snapshot" : "Full course load snapshot",
                          })),
                          index: idx,
                        })
                      }
                      className="overflow-hidden rounded-md border border-cyan-300/40 bg-[#0b1320] hover:border-cyan-300/65 transition shadow-[0_4px_16px_rgba(0,0,0,0.35)]"
                      aria-label={idx === 0 ? "Open remaining classes snapshot" : "Open full course load snapshot"}
                    >
                      <img
                        src={resolvePublicAsset(proofSrc)}
                        alt={idx === 0 ? "Remaining classes snapshot" : "Full course load snapshot"}
                        loading="lazy"
                        className="h-24 w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-white/60 mt-3">Add proof images to show coursework progress snapshots.</p>
              )}
            </article>
          </div>
          <div className="showcase-inner-card mt-4">
            <p className="font-semibold">Certifications / Additional Training</p>
            <div className="mt-3 rounded-lg border border-white/10 bg-white/[0.03] p-3">
              <ul className="text-sm text-white/80 space-y-1 list-disc list-inside">
                {[...certificationTraining, ...certifications.map((cert) => cert.name)].map((item) => (
                  <li key={`training-${item}`}>{item}</li>
                ))}
                {certificationTrainingLinks.map((item) => (
                  <li key={`training-link-${item.url}`}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-200/90 underline underline-offset-4 hover:text-cyan-100"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
              </div>
            </div>
        </section>

        <section id="hobbies" className="reveal showcase-card p-6 md:p-8 mt-20 md:mt-28 text-center md:text-left">
          <p className="section-kicker">Life Outside Work</p>
          <h2 className="section-title">Hobbies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">
            {hobbies.map((hobby, index) => {
              const isTwoCardLastRow = hobbies.length % 3 === 2 && index >= hobbies.length - 2;
              const placementClass =
                isTwoCardLastRow && index === hobbies.length - 1 ? "lg:col-start-3" : "";

              return (
              <Link
                key={hobby.slug}
                to={`/hobby/${hobby.slug}`}
                onClick={(event) => {
                  if (hobby.slug !== "chess") event.preventDefault();
                }}
                className={`group showcase-inner-card block hover:border-cyan-300/55 hover:bg-cyan-400/5 transition ${placementClass}`}
              >
                <p className="text-lg font-semibold">{hobby.title}</p>
                <p className="text-white/65 text-sm mt-1">{hobby.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
                  {hobby.tags.map((tag) => (
                    <span key={`${hobby.title}-${tag}`} className="showcase-chip">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="mt-4 inline-flex items-center gap-1.5 text-sm tracking-wide text-cyan-200/85 transition-all duration-200 group-hover:text-cyan-100 group-hover:translate-x-0.5">
                  {hobby.slug === "chess"
                    ? "Dashboards, AI Coach, & Statistics"
                    : "More insights coming soon"}
                  {hobby.slug === "chess" ? (
                    <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                  ) : null}
                </p>
              </Link>
              );
            })}
          </div>
        </section>

        <section id="travel" className="reveal showcase-card p-4 md:p-6 mt-20 md:mt-28 text-center md:text-left">
          <p className="section-kicker px-2 pt-2">Travel</p>
          <h2 className="section-title px-2">Travel Explorer</h2>
          <div className="mt-4">
            <ErrorBoundary
              fallback={
                <div className="showcase-inner-card p-6 text-white/70 min-h-[220px] flex items-center">
                  Travel map is temporarily unavailable.
                </div>
              }
            >
              <TravelMap />
            </ErrorBoundary>
          </div>
        </section>

        <section id="contact" className="reveal showcase-card p-6 md:p-8 mt-20 md:mt-28 text-center md:text-left">
          <p className="section-kicker">Get in touch</p>
          <h2 className="section-title">Contact</h2>
          <p className="text-white/70">Reach out for collaborations, opportunities, or a quick intro.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
            <a href="mailto:emmetteq17@gmail.com" className="showcase-contact-link justify-center">
              <FaEnvelope /> <span>Email</span>
            </a>
            <a
              href="https://linkedin.com/in/emmetteq"
              target="_blank"
              rel="noopener noreferrer"
              className="showcase-contact-link justify-center"
            >
              <FaLinkedin /> <span>LinkedIn</span>
            </a>
            <a
              href="https://github.com/Emq17"
              target="_blank"
              rel="noopener noreferrer"
              className="showcase-contact-link justify-center"
            >
              <FaGithub /> <span>GitHub</span>
            </a>
          </div>
        </section>

        <section id="how-built" className="reveal showcase-card p-6 md:p-8 mt-20 md:mt-28 text-center md:text-left">
          <p className="section-kicker">Build Notes</p>
          <h2 className="section-title">How This Site Was Built</h2>
          <p className="text-white/70 max-w-4xl">
            This portfolio is a React + TypeScript application with a data pipeline for chess analytics.
            It combines live API pulls, persisted snapshots, and a coach layer that turns game data into
            actionable feedback.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
            <article className="showcase-inner-card">
              <p className="text-white/95 font-semibold">Frontend + Routing</p>
              <ul className="mt-2 text-sm text-white/75 list-disc list-inside space-y-1">
                <li>Built with React, TypeScript, Vite, and React Router.</li>
                <li>Section-based SPA for core content plus dynamic hobby subpages.</li>
                <li>Reusable components and typed models for maintainability.</li>
              </ul>
            </article>
            <article className="showcase-inner-card">
              <p className="text-white/95 font-semibold">API Integration Layer</p>
              <ul className="mt-2 text-sm text-white/75 list-disc list-inside space-y-1">
                <li>Platform APIs integrated for Lichess and Chess.com data pulls.</li>
                <li>Server routes normalize PGN responses for consistent parsing.</li>
                <li>Supports source-specific behavior while preserving one dashboard UI.</li>
              </ul>
            </article>
            <article className="showcase-inner-card">
              <p className="text-white/95 font-semibold">Data Storage + SQL</p>
              <ul className="mt-2 text-sm text-white/75 list-disc list-inside space-y-1">
                <li>Snapshots are persisted in Supabase on PostgreSQL.</li>
                <li>Stored records are queryable via SQL for analytics and exports.</li>
                <li>Enables historical tracking beyond one-time live API responses.</li>
              </ul>
            </article>
            <article className="showcase-inner-card">
              <p className="text-white/95 font-semibold">AI Coach + Analytics</p>
              <ul className="mt-2 text-sm text-white/75 list-disc list-inside space-y-1">
                <li>AI Coach computes guidance from recent game windows or single games.</li>
                <li>Signal parsing maps move quality labels/evals into trend metrics.</li>
                <li>Dashboards expose filters, game selectors, and chart-based diagnostics.</li>
              </ul>
            </article>
          </div>
        </section>
      </div>

      {expandedProof && typeof document !== "undefined"
        ? createPortal(
            <div
              className="fixed inset-0 z-[120] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setExpandedProof(null)}
            >
              <div
                className="relative w-full max-w-3xl rounded-xl border border-white/20 bg-[#0b1320] p-3"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={() => setExpandedProof(null)}
                  className="absolute right-2 top-2 h-8 w-8 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 transition"
                  aria-label="Close proof preview"
                >
                  ×
                </button>
                <p className="text-sm text-cyan-100/85 mb-2 pr-10">{activeProof?.label}</p>
                {expandedProof.items.length > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedProof((prev) =>
                          prev
                            ? {
                                ...prev,
                                index: (prev.index - 1 + prev.items.length) % prev.items.length,
                              }
                            : prev
                        )
                      }
                      className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 transition"
                      aria-label="Previous image"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedProof((prev) =>
                          prev
                            ? {
                                ...prev,
                                index: (prev.index + 1) % prev.items.length,
                              }
                            : prev
                        )
                      }
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full border border-white/20 bg-white/10 text-white hover:bg-white/20 transition"
                      aria-label="Next image"
                    >
                      ›
                    </button>
                  </>
                ) : null}
                {activeProof?.kind === "video" ? (
                  <video
                    src={activeProof.src}
                    className="w-full max-h-[75vh] rounded-lg bg-[#050b16]"
                    controls
                    playsInline
                  />
                ) : (
                  <img
                    src={activeProof?.src}
                    alt={activeProof?.label}
                    className="w-full max-h-[75vh] object-contain rounded-lg bg-[#050b16]"
                  />
                )}
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
