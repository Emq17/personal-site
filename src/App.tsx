import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import Header from "./components/shared/Header";

import Work from "./pages/Work";
import Home from "./pages/Home";
import ContactPage from "./pages/ContactPage";
import MoreProjects from "./pages/MoreProjects";
import Hobbies from "./pages/Hobbies";

function App() {
  const headerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const setOffset = () => {
      const h = el.getBoundingClientRect().height;
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

  return (
    <>
      <Header ref={headerRef} />

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to="/work" replace />} />
          <Route path="/work" element={<Work />} />
          <Route path="/home" element={<Home />} />
          <Route path="/more-projects" element={<MoreProjects />} />
          <Route path="/hobbies" element={<Hobbies />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
