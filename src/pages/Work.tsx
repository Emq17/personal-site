import Hero from "../components/work-page/Intro";
import Skills from "../components/work-page/Skills";
import Experience from "../components/work-page/Experience";
import Education from "../components/work-page/Education";
import ContactCTA from "../components/shared/ContactCTA";

export default function Work() {
  return (
    <div className="w-full pb-32 md:pb-40 lg:pb-48">
      <Hero />
      <Skills />
      <Experience />
      <Education />
      <ContactCTA />
    </div>
  );
}
