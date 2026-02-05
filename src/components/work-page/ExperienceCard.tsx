interface ExperienceProps {
  jobTitle: string;
  companyName: string;
  companyUrl: string;
  jobLocation: string;
  dateStarted: string;
  dateEnded: string;
  companyDescription: string;
  jobSummary: string;
  keyAchievements: string[];
}

const ExperienceCard: React.FC<ExperienceProps> = ({
  jobTitle,
  companyName,
  companyUrl,
  jobLocation,
  dateStarted,
  dateEnded,
  companyDescription,
  jobSummary,
  keyAchievements,
}) => {
  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-lg overflow-hidden">
      {/* Glow behind the card */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-2xl"
      />
      {/* Card content */}
      <div className="relative bg-[#252c34] p-8 rounded-lg shadow-lg border border-gray-700 text-left">
        {/* Top Row: Job Title and Dates */}
        <div className="flex flex-col md:flex-row justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-100">{jobTitle}</h3>
          <p className="text-gray-400 mt-1 md:mt-0 text-sm">
            {dateStarted} - {dateEnded}
          </p>
        </div>

        {/* Company Name as Link + Description */}
        <p className="text-gray-400 mb-1 text-sm">
          <a
            href={companyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-gray-200 transition"
          >
            {companyName}
          </a>{" "}
          — {companyDescription}
        </p>

        {/* Location */}
        <p className="text-gray-500 mb-4 text-sm">{jobLocation}</p>

        {/* Job Summary */}
        <div className="mb-4">
          <span className="block text-xs text-gray-500 uppercase tracking-wider mb-1">
            Summary
          </span>
          <p className="text-gray-300">{jobSummary}</p>
        </div>

        {/* Achievements */}
        <div>
          <span className="block text-xs text-gray-500 uppercase tracking-wider mb-2">
            Job Responsbilities
          </span>
          <ul className="list-disc pl-4 text-gray-300 space-y-2 leading-relaxed">
            {keyAchievements.map((achievement, index) => (
              <li key={index}>{achievement}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
