export default function DashboardsSection() {
  return (
    <section
  id="dashboards"
  className="relative scroll-mt-28 py-24 bg-[#1d232a] text-white px-4 overflow-hidden"
>
  {/* Content wrapper (this is the key) */}
  <div className="w-full max-w-6xl mx-auto">
    {/* Header */}
    <h2 className="text-4xl md:text-5xl font-bebas mb-4 text-center">
      Dashboards
    </h2>
    <div className="w-48 h-0.5 bg-gradient-to-r from-gray-500 to-gray-700 mb-12 mx-auto" />
        {/* Overview */}
        <div className="w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 mb-8 text-left">
          <h3 className="text-xl font-semibold mb-2">Overview</h3>
          <p className="text-gray-300">
            Coming soon: real dashboard examples, screenshots, and case studies.
          </p>
        </div>

        {/* KPI Cards */}
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Automations Built", value: "40+" },
            { label: "Dashboards Delivered", value: "10+" },
            { label: "Data Checks", value: "QA Layer" },
            { label: "Tools", value: "SQL • Python • Sheets" },
          ].map((kpi) => (
            <div
              key={kpi.label}
              className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 text-left"
            >
              <div className="text-sm text-white/60">{kpi.label}</div>
              <div className="text-2xl font-semibold mt-1">{kpi.value}</div>
            </div>
          ))}
        </div>

        {/* Charts placeholder */}
        <div className="w-full rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 text-left">
          <h3 className="text-xl font-semibold mb-2">Charts</h3>
          <p className="text-gray-300">
            Next: add real charts (Recharts) + filters.
          </p>
        </div>
      </div>
    </section>
  );
}
