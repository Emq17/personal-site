import { experiences } from "./content/ExperiencesData";
import ExperienceCard from "./ExperienceCard";

const Experience = () => {
  return (
    <section
      id="experience"
      className="relative scroll-mt-28 py-24 flex flex-col items-center text-center md:text-left bg-[#1d232a] text-white px-4 overflow-hidden"

    >
      {/* Glow Background */}
      <div aria-hidden className="absolute inset-0 flex justify-center">
        <div className="w-96 h-96 bg-blue-500/10 blur-3xl rounded-full" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center w-full">
        <h2 className="text-4xl md:text-5xl font-bebas mb-4">
          Experience
        </h2>
        <div className="w-48 h-0.5 bg-gradient-to-r from-gray-500 to-gray-700 mb-12"></div>

        <div className="w-full max-w-6xl space-y-10 px-4">
          {experiences.map((exp) => (
            <ExperienceCard
              key={`${exp.companyName}-${exp.jobTitle}`}
              {...exp}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
