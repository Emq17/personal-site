import { FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import profilePic from "../../assets/profile.jpg";

const Hero = () => {
  return (
    <section
      id="home"
      className="flex flex-col md:flex-row justify-center items-center text-center md:text-left bg-[#1d232a] text-white px-4 pt-8"
      style={{ minHeight: "calc(100vh - var(--header-offset))" }}
      > 
      {/* Profile Image + Name + Title */}
      <div className="flex flex-col items-center md:items-start mb-6 md:mb-0 md:mr-12">
        <div className="w-64 h-64 md:w-80 md:h-80 relative mb-4">
          <img
            src={profilePic}
            alt="Emmette Quiambao"
            className="rounded-full object-cover w-full h-full border-4 border-white shadow-2xl"
          />
          <div
            className="absolute inset-0 rounded-full border-4 border-transparent animate-pulse"
            style={{
              boxShadow: "0 0 50px rgba(59,130,246,0.6)",
            }}
          />
        </div>

        <h1 className="text-5xl md:text-3xl font-bebas bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          Emmette Quiambao
        </h1>
        <h2 className="text-xl md:text-base font-ubuntu text-gray-200">
          Operations • Internal Systems • Analytics
        </h2>
      </div>

      {/* Text Content */}
      <div className="max-w-3xl">
        <p className="text-gray-400 text-lg leading-relaxed">
          Hello! I’m a Data Analyst with 4+ years of experience within Operations, Finance, and Healthcare.
          I focus on building and validating data-driven models, automating processes, and translating complex
          information into actionable insights.
        </p>

        <h3 className="mt-6 font-semibold text-white">Highlights of my work include:</h3>

        <ul className="list-disc list-inside mt-2 space-y-1 text-gray-300">
          <li>
            Owned development of internal reporting and data products from requirements through deployment, enabling decision-making across departments.
          </li>
          <li>
            Improved data accuracy and scalability by resolving recurring integrity issues, eliminating manual failure points, and implementing validation checks using Python, SQL, and AWS.
          </li>
          <li>
            Delivered a source-of-truth KPI layer used by leadership and multiple departments for planning and performance tracking.
          </li>
          <li>
            Analyzed operational trends and data anomalies to identify root causes, document findings, and drove workflow and reporting improvements with stakeholders.
          </li>
        </ul>

        <p className="mt-6 text-gray-400">
          Career Wins:{" "}
          <span className="text-white">
            Automated 40+ spreadsheet workflows, built systems that turn messy operational data into dashboards leaders can trust, designed QA checks for reporting reliability, bridged Ops ↔ Analytics.
          </span>
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-6 mt-6">
          <a
            href="/work#experience"
            className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-gray-700 to-gray-600 text-white font-semibold hover:brightness-110 transition duration-200"
          >
            View My Work
          </a>
          <a
            href="/work#contact"
            className="inline-block px-6 py-3 rounded-lg border border-gray-500 text-gray-300 font-semibold hover:bg-gray-600 hover:text-white transition duration-200"
          >
            Get in Touch
          </a>
        </div>

        {/* Social Icons */}
        <div className="flex gap-4 justify-center md:justify-start">
          <a
            href="https://github.com/Emq17"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white text-2xl transition-colors duration-200"
          >
            <FaGithub />
          </a>
          <a
            href="https://linkedin.com/in/emmetteq"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white text-2xl transition-colors duration-200"
          >
            <FaLinkedin />
          </a>
          <a
            href="mailto:emmetteq17@gmail.com"
            className="text-gray-400 hover:text-white text-2xl transition-colors duration-200"
          >
            <FaEnvelope />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
