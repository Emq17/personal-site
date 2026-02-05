export default function Home() {
  return (
    <div className="min-h-screen bg-[#1d232a] text-white px-4 pb-16">
      <div className="max-w-6xl mx-auto pt-10">
        {/* Overview */}
        <section id="home-overview">
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>

          <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
            <p className="text-gray-300">
              This page will be your story: where you’re from, what shaped you,
              and what you’re building toward.
            </p>
          </div>
        </section>

        {/* Story */}
        <section id="home-about" className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">About Me</h2>

          <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6 space-y-3 text-gray-300">
            <p>Placeholder: born in ______, moved to ______, learned ______.</p>
            <p>
              Placeholder: how you got into tech, what you taught yourself, and
              the moments that changed your direction.
            </p>
          </div>
        </section>

        {/* Values */}
        <section id="home-values" className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Values</h2>

          <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              <li>Craft over noise</li>
              <li>Systems thinking</li>
              <li>Consistency & execution</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
