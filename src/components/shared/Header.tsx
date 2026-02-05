import logo from "../../assets/icons/favicon-32x32.png";
import { useLocation, Link } from "react-router-dom";
import { forwardRef, useEffect } from "react";

const Header = forwardRef<HTMLDivElement>((_, ref) => {
  const { pathname } = useLocation();

  const pageTitleMap: Record<string, string> = {
    "/work": "Work",
    "/home": "Home",
    "/more-projects": "More Projects",
    "/hobbies": "Hobbies",
    "/contact": "Contact",
  };

  const pageTitle = pageTitleMap[pathname] ?? "Work";

  // Section pills (centered bar) — changes by page
  const sectionLinks =
    pathname === "/work"
      ? [
          { label: "Skills", href: "/work#skills" },
          { label: "Dashboards", href: "/work#dashboards" },
          { label: "Experience", href: "/work#experience" },
          { label: "Contact", href: "/work#contact" },
        ]
      : pathname === "/home"
      ? [
          { label: "Overview", href: "/home#home-overview" },
          { label: "About Me", href: "/home#home-about" },
          { label: "Values", href: "/home#home-values" },
        ]
      : pathname === "/more-projects"
      ? [
          { label: "Software", href: "/more-projects#mp-software" },
          { label: "Financial Markets", href: "/more-projects#mp-markets" },
          { label: "Analytics", href: "/more-projects#mp-analytics" },
        ]
      : pathname === "/hobbies"
      ? [
          { label: "Chess", href: "/hobbies#hob-chess" },
          { label: "Billiards", href: "/hobbies#hob-billiards" },
          { label: "Ping Pong", href: "/hobbies#hob-pingpong" },
          { label: "Golfing", href: "/hobbies#hob-golfing" },
          { label: "Martial Arts", href: "/hobbies#hob-martialarts" },
          { label: "Dancing", href: "/hobbies#hob-dancing" },
          { label: "Flipping", href: "/hobbies#hob-flipping" },
          { label: "Working Out", href: "/hobbies#hob-workingout" },
          { label: "Videography", href: "/hobbies#hob-videography" },
          { label: "Music", href: "/hobbies#hob-music" },
          { label: "Travel", href: "/hobbies#hob-travel" },
        ]
      : [];

  // Dropdown pages list (hamburger)
  const pages = [
    { label: "Home", href: "/home" },
    { label: "Work", href: "/work" },
    { label: "More Projects", href: "/more-projects" },
    { label: "Hobbies", href: "/hobbies" },
    { label: "Contact", href: "/contact" },
  ];

  const isActivePage = (href: string) => pathname === href;

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
  }, [pathname]); // re-bind when pills content changes

  return (
    <div
      ref={ref}
      className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-[#252c34]"
    >
      {/* Top Row */}
      <div className="navbar container mx-auto px-4 py-3 relative">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <Link to="/home" aria-label="Go to Home" className="flex items-center">
            <img src={logo} alt="Logo" className="h-10 w-10" />
          </Link>
        </div>

        {/* Center: Page Title + underline */}
        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
          <div className="text-white/95 font-exo font-light text-2xl tracking-wide">
            {pageTitle}
          </div>
          <div className="w-16 h-0.5 mt-1 bg-gradient-to-r from-purple-500 to-blue-500 opacity-90" />
        </div>

        {/* Right: Hamburger */}
        <div className="ml-auto">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-square text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>

            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-56"
            >
              {pages.map((p) => (
                <li key={p.href}>
                  <a
                    href={p.href}
                    className={
                      isActivePage(p.href)
                        ? "bg-purple-600 text-white font-semibold"
                        : ""
                    }
                  >
                    {p.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Section Pills Row */}
      {sectionLinks.length > 0 && (
        <div className="px-4 py-2 border-t border-white/10 bg-[#252c34]">
          <div
            id="section-pills"
            className="container mx-auto flex gap-2 overflow-x-auto whitespace-nowrap justify-start md:justify-center"
          >
            {sectionLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-3 py-1 rounded-full bg-[#2f3741] text-gray-200 text-sm whitespace-nowrap hover:bg-purple-600 hover:text-white transition"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

Header.displayName = "Header";
export default Header;
