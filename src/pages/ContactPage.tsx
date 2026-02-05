import { FaEnvelope, FaLinkedin, FaGithub } from "react-icons/fa";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#1d232a] text-white px-4 pb-16">
      <div className="max-w-3xl mx-auto pt-10">
        {/* Main Contact Box */}
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8">
          <p className="text-gray-300 mb-6">
            Best way to reach me is email. I’m also active on LinkedIn and GitHub.
          </p>

          <div className="flex flex-col gap-3">
            <a
              href="mailto:emmetteq17@gmail.com"
              className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-purple-600/30 hover:border-purple-500/30 transition"
            >
              <FaEnvelope />
              <span>Email</span>
            </a>

            <a
              href="https://linkedin.com/in/emmetteq"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-purple-600/30 hover:border-purple-500/30 transition"
            >
              <FaLinkedin />
              <span>LinkedIn</span>
            </a>

            <a
              href="https://github.com/Emq17"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-purple-600/30 hover:border-purple-500/30 transition"
            >
              <FaGithub />
              <span>GitHub</span>
            </a>
          </div>
        </div>

        {/* Bottom link */}
        <div className="mt-12 text-center">
          <a
            href="/home"
            className="text-white/70 hover:text-white underline underline-offset-4"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
