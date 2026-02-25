import { Suspense, lazy } from "react";

const TravelMap = lazy(() => import("../components/hobbies/TravelMap"));

const Hobbies = () => {
  const Card = ({
    title,
    desc,
    tags,
  }: {
    title: string;
    desc: string;
    tags: string[];
  }) => (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
      <p className="text-white/90 font-semibold text-xl">{title}</p>
      <p className="text-white/60 mt-2">{desc}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tags.map((t) => (
          <span
            key={t}
            className="px-3 py-1 rounded-full bg-[#2f3741] text-sm text-white/80"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full bg-[#1d232a] text-white px-4">
      <div className="w-full max-w-6xl mx-auto pt-10 pb-24">
        {/* Intro */}
        <div
          id="hob-overview"
          className="mb-14 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6"
        >
          <h1 className="text-4xl md:text-5xl font-bebas mb-2">Hobbies</h1>
          <p className="text-white/70">
            Skill-based interests that keep me sharp—strategy, precision, movement,
            creativity, and discipline.
          </p>
        </div>

        {/* Each hobby is its own section */}
        <section id="hob-chess" className="py-12">
          <Card
            title="Chess"
            desc="Strategy, pattern recognition, and staying calm under pressure."
            tags={["Tactics", "Endgames", "Blitz", "Study"]}
          />
        </section>

        <section id="hob-billiards" className="py-12">
          <Card
            title="Billiards"
            desc="Angles, speed control, and decision-making with imperfect setups."
            tags={["Positioning", "Consistency", "Shot Selection"]}
          />
        </section>

        <section id="hob-pingpong" className="py-12">
          <Card
            title="Ping Pong"
            desc="Fast reaction time, rhythm, and micro-adjustments."
            tags={["Footwork", "Spin", "Timing", "Control"]}
          />
        </section>

        <section id="hob-golfing" className="py-12">
          <Card
            title="Golfing"
            desc="Routine, precision, and mental focus—small changes, big results."
            tags={["Putting", "Short Game", "Course Management"]}
          />
        </section>

        <section id="hob-martialarts" className="py-12">
          <Card
            title="Martial Arts"
            desc="Discipline, technique, conditioning, and mindset."
            tags={["Basics", "Technique", "Control", "Conditioning"]}
          />
        </section>

        <section id="hob-dancing" className="py-12">
          <Card
            title="Dancing"
            desc="Rhythm, coordination, and confidence—being present in movement."
            tags={["Timing", "Flow", "Expression"]}
          />
        </section>

        <section id="hob-flipping" className="py-12">
          <Card
            title="Flipping"
            desc="Body control and progressive skill-building through reps."
            tags={["Balance", "Core", "Progressions"]}
          />
        </section>

        <section id="hob-videography" className="py-12">
          <Card
            title="Videography"
            desc="Capturing moments with clean composition and cinematic pacing."
            tags={["Storytelling", "Editing", "Cinematography"]}
          />
        </section>

        <section id="hob-music" className="py-12">
          <Card
            title="Music"
            desc="Expression and craft—practice, rhythm, and creativity."
            tags={["Guitar", "Drums", "Production", "Songwriting"]}
          />
        </section>

        <section id="hob-travel" className="py-12">
          <Suspense
            fallback={
              <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-6">
                <p className="text-white/90 font-semibold text-xl">Travel Globe</p>
                <p className="text-white/60 mt-2">Loading globe...</p>
              </div>
            }
          >
            <TravelMap />
          </Suspense>
        </section>
      </div>
    </div>
  );
};

export default Hobbies;
