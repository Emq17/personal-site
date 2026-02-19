import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Header from "./components/shared/Header";
import Showcase from "./pages/Showcase";
import HobbyDetail from "./pages/HobbyDetail";

function App() {
  const location = useLocation();
  const headerRef = useRef<HTMLDivElement | null>(null);
  const [displayLocation, setDisplayLocation] = useState(location);
  const [headerOffset, setHeaderOffset] = useState(96);
  const [isRouteAnimating, setIsRouteAnimating] = useState(false);
  const [transitionStage, setTransitionStage] = useState<"fade-in" | "fade-out">(
    "fade-in"
  );

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const setOffset = () => {
      const h = el.getBoundingClientRect().height;
      setHeaderOffset(h);
      document.documentElement.style.setProperty("--header-offset", `${h}px`);
    };

    setOffset();

    const ro = new ResizeObserver(() => setOffset());
    ro.observe(el);

    window.addEventListener("resize", setOffset);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setOffset);
    };
  }, []);

  useEffect(() => {
    // Only animate between top-level pages; keep in-page hash navigation instant.
    if (location.pathname !== displayLocation.pathname) {
      // Fast path: when returning to a section on the main page, skip route animation lag.
      if (location.pathname === "/" && Boolean(location.hash)) {
        setDisplayLocation(location);
        setTransitionStage("fade-in");
        setIsRouteAnimating(false);
        return;
      }
      setIsRouteAnimating(true);
      setTransitionStage("fade-out");
      return;
    }
    setDisplayLocation(location);
  }, [location, displayLocation.pathname]);

  const onRouteAnimationEnd = () => {
    if (transitionStage === "fade-out") {
      setDisplayLocation(location);
      setTransitionStage("fade-in");
      const hasSectionTarget = location.pathname === "/" && Boolean(location.hash);
      if (!hasSectionTarget) {
        window.scrollTo({ top: 0, behavior: "auto" });
      }
      return;
    }

    // fade-in completed
    setIsRouteAnimating(false);
  };

  useEffect(() => {
    if (location.pathname !== "/") return;
    if (!location.hash) return;
    if (isRouteAnimating) return;

    const id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;

    // Retry briefly so cross-page transitions can finish mounting sections first.
    let raf = 0;
    let attempts = 0;
    const tryScroll = () => {
      attempts += 1;
      const target = document.getElementById(id);
      if (target) {
        // Let CSS scroll-margin-top handle the fixed-header offset uniformly.
        target.scrollIntoView({ behavior: "auto", block: "start" });
        return;
      }
      if (attempts < 12) raf = requestAnimationFrame(tryScroll);
    };

    raf = requestAnimationFrame(tryScroll);
    return () => cancelAnimationFrame(raf);
  }, [location.pathname, location.hash, displayLocation.pathname, transitionStage, headerOffset, isRouteAnimating]);

  return (
    <>
      <Header ref={headerRef} />

      <main className="app-main">
        <div
          className={`route-shell ${transitionStage}`}
          onAnimationEnd={onRouteAnimationEnd}
        >
          <Routes location={displayLocation}>
            <Route path="/" element={<Showcase />} />
            <Route path="/hobby/:slug" element={<HobbyDetail />} />
            <Route
              path="/work"
              element={<Navigate to={{ pathname: "/", hash: "#experience" }} replace />}
            />
            <Route
              path="/home"
              element={<Navigate to={{ pathname: "/", hash: "#hero" }} replace />}
            />
            <Route
              path="/more-projects"
              element={<Navigate to={{ pathname: "/", hash: "#projects" }} replace />}
            />
            <Route
              path="/hobbies"
              element={<Navigate to={{ pathname: "/", hash: "#hobbies" }} replace />}
            />
            <Route
              path="/contact"
              element={<Navigate to={{ pathname: "/", hash: "#contact" }} replace />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </>
  );
}

export default App;
