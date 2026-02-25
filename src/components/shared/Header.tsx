import logo from "../../assets/icons/favicon-32x32.png";
import { Link, useLocation } from "react-router-dom";
import { forwardRef, useEffect, useState } from "react";

const sectionLinks = [
  { label: "Home", href: "/#hero" },
  { label: "Projects", href: "/#projects" },
  { label: "Skills", href: "/#skills" },
  { label: "Languages", href: "/#languages" },
  { label: "Experience", href: "/#experience" },
  { label: "Education", href: "/#education" },
  { label: "Hobbies", href: "/#hobbies" },
  { label: "Travel", href: "/#travel" },
  { label: "Contact", href: "/#contact" },
  { label: "How It Works", href: "/#how-built" },
];

const Header = forwardRef<HTMLDivElement>((_, ref) => {
  const { hash, pathname } = useLocation();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(hash || "#hero");

  // Enable mouse wheel to scroll pills horizontally (desktop-friendly)
  useEffect(() => {
    const el = document.getElementById("section-pills");
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      // Only hijack vertical wheel -> horizontal scroll when it can actually scroll
      if (el.scrollWidth <= el.clientWidth) return;
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;

      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("");
      return;
    }
    if (hash) setActiveSection(hash);
  }, [hash, pathname]);

  useEffect(() => {
    if (pathname !== "/") return;

    const ids = sectionLinks.map((s) => s.href.replace("/#", ""));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;
    const sectionsByPageOrder = [...sections].sort((a, b) => a.offsetTop - b.offsetTop);

    const detectActiveSection = () => {
      const marker = 180; // accounts for fixed header and section spacing
      let current = "#hero";

      for (const section of sectionsByPageOrder) {
        const top = section.getBoundingClientRect().top;
        if (top <= marker) current = `#${section.id}`;
      }

      // When user reaches the bottom, force-highlight the final section pill.
      const nearBottom =
        window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      if (nearBottom) {
        current = `#${sectionsByPageOrder[sectionsByPageOrder.length - 1].id}`;
      }

      setActiveSection(current);
    };

    detectActiveSection();
    window.addEventListener("scroll", detectActiveSection, { passive: true });
    window.addEventListener("resize", detectActiveSection);
    return () => {
      window.removeEventListener("scroll", detectActiveSection);
      window.removeEventListener("resize", detectActiveSection);
    };
  }, [pathname]);

  useEffect(() => {
    const updateProgress = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total <= 0) {
        setScrollProgress(0);
        return;
      }
      setScrollProgress(Math.min(window.scrollY / total, 1));
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-[#0f1722]/95 backdrop-blur-lg"
    >
      {/* Top Row */}
      <div className="navbar container mx-auto px-4 py-3 relative">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <Link to="/#hero" aria-label="Go to Overview" className="flex items-center">
            <img src={logo} alt="Logo" className="h-10 w-10" />
          </Link>
        </div>

        {/* Center: Page Title + underline */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
          <div className="text-white/95 font-exo font-light text-2xl tracking-wide">
            Get To Know Me
          </div>
          <div className="w-24 h-0.5 mt-1 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-90" />
        </div>

        <div className="ml-auto" />
      </div>

      {/* Section Pills Row */}
      <div className="px-4 py-2 border-t border-white/10 bg-[#0f1722]/80">
        <div
          id="section-pills"
          className="container mx-auto flex gap-2 overflow-x-auto whitespace-nowrap justify-start md:justify-center"
        >
          {sectionLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap transition ${
                activeSection === link.href.replace("/", "")
                  ? "bg-cyan-400/25 text-white border border-cyan-300/50"
                  : "bg-white/5 border border-white/10 text-gray-200 hover:bg-cyan-500/20 hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
      <div className="h-[2px] w-full bg-white/5">
        <div
          className="h-full origin-left bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 transition-transform duration-150"
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
      </div>
    </div>
  );
});

Header.displayName = "Header";
export default Header;
