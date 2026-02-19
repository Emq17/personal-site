import { useEffect } from "react";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import { Link } from "react-router-dom";
import profilePic from "../assets/profile.jpg";
import { skillsets } from "../components/work-page/content/SkillsData";
import { experiences } from "../components/work-page/content/ExperiencesData";
import { certifications, education } from "../components/work-page/content/EducationData";
import ErrorBoundary from "../components/shared/ErrorBoundary";
import TravelMap from "../components/hobbies/TravelMap";
import { hobbies } from "../components/hobbies/content/HobbiesData";

export default function Showcase() {
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
          className="reveal showcase-card min-h-[52vh] md:min-h-[64vh] p-6 md:p-10 grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-8 items-center"
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
            <div className="flex flex-wrap gap-3 pt-2">
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

        <section id="projects" className="reveal showcase-card p-6 md:p-8 mt-20 md:mt-28">
          <p className="section-kicker">Builds</p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h2 className="section-title">Projects</h2>
            <a
              href="https://github.com/Emq17"
              target="_blank"
              rel="noopener noreferrer"
              className="showcase-cta-primary self-start sm:self-auto"
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

        <section id="skills" className="reveal showcase-card p-6 md:p-8 mt-20 md:mt-28">
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

        <section id="experience" className="reveal showcase-card p-6 md:p-8 mt-20 md:mt-28">
          <p className="section-kicker">Career</p>
          <h2 className="section-title">Experience</h2>
          <div className="mt-5 space-y-4">
            {experiences.map((exp) => (
              <article key={`${exp.companyName}-${exp.jobTitle}`} className="showcase-inner-card">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                  <div>
                    <p className="text-xl font-semibold">{exp.jobTitle}</p>
                    <p className="text-white/65 text-sm mt-1">
                      {exp.companyName} · {exp.jobLocation}
                    </p>
                  </div>
                  {exp.dateStarted || exp.dateEnded ? (
                    <p className="text-sm text-white/55 whitespace-nowrap">
                      {[exp.dateStarted, exp.dateEnded].filter(Boolean).join(" - ")}
                    </p>
                  ) : null}
                </div>
                <p className="text-white/70 mt-3">{exp.jobSummary}</p>
                <ul className="mt-3 space-y-1 text-white/72 list-disc list-inside">
                  {exp.keyAchievements.slice(0, 3).map((point) => (
                    <li key={`${exp.jobTitle}-${point}`}>{point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="education" className="reveal showcase-card p-6 md:p-8 mt-20 md:mt-28">
          <p className="section-kicker">Background</p>
          <h2 className="section-title">Education</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            {education.map((item) => (
              <article key={`${item.institution}-${item.program}`} className="showcase-inner-card">
                <p className="text-white/95 font-semibold">{item.program}</p>
                <p className="text-white/65 mt-1">{item.institution}</p>
                <div className="mt-3 flex gap-2 flex-wrap">
                  <span className="showcase-chip">{item.status}</span>
                  {item.timeframe ? <span className="showcase-chip">{item.timeframe}</span> : null}
                </div>
                <p className="text-sm text-white/50 mt-3">{item.location}</p>
              </article>
            ))}
          </div>
          <div className="showcase-inner-card mt-4">
            <p className="font-semibold">Certifications</p>
            <div className="flex flex-wrap gap-2 mt-3">
              {certifications.map((cert) => (
                <span key={`${cert.provider}-${cert.name}`} className="showcase-chip">
                  {cert.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="hobbies" className="reveal showcase-card p-6 md:p-8 mt-20 md:mt-28">
          <p className="section-kicker">Life Outside Work</p>
          <h2 className="section-title">Hobbies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-5">
            {hobbies.map((hobby) => (
              <Link
                key={hobby.slug}
                to={`/hobby/${hobby.slug}`}
                className="showcase-inner-card block hover:border-cyan-300/55 hover:bg-cyan-400/5 transition"
              >
                <p className="text-lg font-semibold">{hobby.title}</p>
                <p className="text-white/65 text-sm mt-1">{hobby.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {hobby.tags.map((tag) => (
                    <span key={`${hobby.title}-${tag}`} className="showcase-chip">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-cyan-200/80 text-xs uppercase tracking-wider mt-4">
                  Open details
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section id="travel" className="reveal showcase-card p-4 md:p-6 mt-20 md:mt-28">
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

        <section id="contact" className="reveal showcase-card p-6 md:p-8 mt-20 md:mt-28">
          <p className="section-kicker">Connect</p>
          <h2 className="section-title">Contact</h2>
          <p className="text-white/70">Reach out for collaborations, opportunities, or a quick intro.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-5">
            <a href="mailto:emmetteq17@gmail.com" className="showcase-contact-link">
              <FaEnvelope /> <span>Email</span>
            </a>
            <a
              href="https://linkedin.com/in/emmetteq"
              target="_blank"
              rel="noopener noreferrer"
              className="showcase-contact-link"
            >
              <FaLinkedin /> <span>LinkedIn</span>
            </a>
            <a
              href="https://github.com/Emq17"
              target="_blank"
              rel="noopener noreferrer"
              className="showcase-contact-link"
            >
              <FaGithub /> <span>GitHub</span>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
