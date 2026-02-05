import { skillsets } from "./content/SkillsData";
import {
  FaCode,
  FaDatabase,
  FaLayerGroup,
} from "react-icons/fa";

const getIcon = (title: string) => {
  switch (title) {
    case "Languages":
      return <FaCode className="text-purple-400" />;
    case "Analytics":
      return <FaLayerGroup className="text-purple-400" />;
    case "Practices":
      return <FaDatabase className="text-purple-400" />;
  }
};

const Skills = () => {
  return (
    <section
      id="skills"
      className="relative scroll-mt-28 py-24 flex flex-col items-center text-center md:text-left bg-[#1d232a] text-white px-4 overflow-hidden"

    >
      {/* Section Header */}
      <h2 className="text-4xl md:text-5xl font-bebas mb-4">
        Skills & Expertise
      </h2>
      <div className="w-48 h-0.5 bg-gradient-to-r from-gray-500 to-gray-700 mb-12"></div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {skillsets.map((category) => (
          <div
            key={category.title}
            className="relative rounded-lg overflow-hidden w-full"
          >
            {/* Glow */}
            <div
              aria-hidden
              className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-2xl"
            />
            {/* Card */}
            <div className="relative bg-[#252c34] p-6 rounded-lg shadow-lg border border-gray-700 h-full flex flex-col">
              {/* Icon and Title */}
              <div className="flex items-center justify-center gap-2 mb-4">
                {getIcon(category.title)}
                <h3 className="text-xl font-semibold">{category.title}</h3>
              </div>
              {/* Items */}
              <div className="flex flex-wrap justify-center gap-2">
                {category.items.map((item) => (
                  <span
                    key={item}
                    className="inline-block px-3 py-1 bg-[#2f3741] rounded-full text-sm text-gray-200 hover:bg-purple-600 hover:text-white transition"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
