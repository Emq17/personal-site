export default function ContactCTA() {
  return (
    <section
      id="contact"
      className="scroll-mt-24 md:scroll-mt-28 pb-40 lg:scroll-mt-24 bg-[#1d232a] text-white px-4 pt-16 pb-20"
    >
      <div className="max-w-6xl mx-auto">
        <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bebas mb-3">
            Want to connect?
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            If you want to collaborate, talk analytics, or just reach out — hit
            me here.
          </p>

          <a
            href="/contact"
            className="inline-block mt-6 px-6 py-3 rounded-lg bg-gradient-to-r from-gray-700 to-gray-600 text-white font-semibold hover:brightness-110 transition duration-200"
          >
            Contact Me
          </a>
        </div>
      </div>
    </section>
  );
}
