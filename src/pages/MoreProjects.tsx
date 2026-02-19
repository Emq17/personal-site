import DashboardsSection from "../components/work-page/DashboardsSection";

const MoreProjects = () => {
  return (
    <div className="w-full bg-[#1d232a] text-white px-4">
      {/* Page wrapper */}
      <div className="w-full max-w-6xl mx-auto pt-10 pb-24">
        {/* Intro */}
        <div
          id="mp-overview"
          className="mb-14 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6"
        >
          <h1 className="text-4xl md:text-5xl font-bebas mb-2">Projects</h1>
          <p className="text-white/70">
            A categorized space to show my broader build range — software systems, analytics,
            and financial markets work.
          </p>
        </div>

        <DashboardsSection />

        {/* SOFTWARE */}
        <section id="mp-software" className="py-12">
          <h2 className="text-3xl md:text-4xl font-bebas mb-4">Software</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <p className="text-white/80 font-semibold">Internal Tools & Automation</p>
              <p className="text-white/60 mt-2">
                Examples: workflow tooling, validation layers, scripts, and systems that reduce manual ops.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["React", "TypeScript", "Apps Script", "SQL", "Python"].map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full bg-[#2f3741] text-sm text-white/80"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <p className="text-white/80 font-semibold">Web App Practice</p>
              <p className="text-white/60 mt-2">
                Routing, state, components, UI polish, and “product-like” behavior.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["React Router", "UI Components", "Search/Filter", "Charts"].map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full bg-[#2f3741] text-sm text-white/80"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FINANCIAL MARKETS */}
        <section id="mp-markets" className="py-12">
          <h2 className="text-3xl md:text-4xl font-bebas mb-4">Financial Markets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <p className="text-white/80 font-semibold">Systems & Execution Thinking</p>
              <p className="text-white/60 mt-2">
                Rule-based setups, risk sizing, and repeatable decision frameworks.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Futures", "Risk", "Backtesting", "Journaling"].map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full bg-[#2f3741] text-sm text-white/80"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <p className="text-white/80 font-semibold">Data + Markets</p>
              <p className="text-white/60 mt-2">
                Turning price/behavior patterns into measurable rules you can test.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Python", "Spreadsheets", "Statistics", "Process"].map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full bg-[#2f3741] text-sm text-white/80"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ANALYTICS & OPS SYSTEMS */}
        <section id="mp-analytics" className="py-12">
          <h2 className="text-3xl md:text-4xl font-bebas mb-4">Analytics & Ops Systems</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <p className="text-white/80 font-semibold">Dashboards & KPI Layers</p>
              <p className="text-white/60 mt-2">
                Reporting systems that leaders can trust + definitions that don’t drift.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["KPI Design", "QA Checks", "Data Integrity", "Reporting"].map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full bg-[#2f3741] text-sm text-white/80"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-6">
              <p className="text-white/80 font-semibold">Stakeholders & Execution</p>
              <p className="text-white/60 mt-2">
                Translating messy ops problems into clean systems, automation, and decisions.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["Requirements", "Process", "Automation", "Documentation"].map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full bg-[#2f3741] text-sm text-white/80"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MoreProjects;
