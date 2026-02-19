import { certifications, education } from "./content/EducationData";

const Education = () => {
  return (
    <section id="education" className="scroll-mt-28 py-24 bg-[#1d232a] text-white px-4">
      <div className="w-full max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bebas mb-4 text-center">Education</h2>
        <div className="w-48 h-0.5 bg-gradient-to-r from-gray-500 to-gray-700 mb-12 mx-auto" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {education.map((item) => (
            <article
              key={`${item.institution}-${item.program}`}
              className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6"
            >
              <p className="text-white/90 font-semibold text-lg">{item.program}</p>
              <p className="text-white/70 mt-1">{item.institution}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="px-2 py-1 rounded-full border border-cyan-300/35 bg-cyan-300/10 text-cyan-100/90 uppercase tracking-wider">
                  {item.status}
                </span>
                {item.timeframe ? (
                  <span className="px-2 py-1 rounded-full border border-white/20 bg-white/5 text-white/75 uppercase tracking-wider">
                    {item.timeframe}
                  </span>
                ) : null}
              </div>
              <p className="text-white/50 mt-3 text-sm">{item.location}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
          <p className="text-white/85 font-semibold mb-4 text-lg">Certifications</p>
          <div className="flex flex-wrap gap-3">
            {certifications.map((cert) => (
              <span
                key={`${cert.provider}-${cert.name}`}
                className="px-3 py-2 rounded-full border border-white/15 bg-white/5 text-white/80 text-sm"
              >
                {cert.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;
