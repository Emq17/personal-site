export type Hobby = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  tags: string[];
  stats?: Array<{ label: string; value: string }>;
  links?: Array<{ label: string; href: string }>;
  media?: Array<{ type: "image" | "video"; src: string; caption?: string }>;
};

export const hobbies: Hobby[] = [
  {
    slug: "chess",
    title: "♟ Chess",
    summary:
      "Strategic thinking under pressure. Chess sharpens my decision-making, pattern recognition, and long-range planning. I use it to train discipline, calculated risk-taking, and staying calm in complex, shifting positions.",
    description: "",
    tags: ["Strategy", "Tactics", "Calculation"],
    stats: [
      { label: "Focus", value: "Rapid + Tactics" },
      { label: "Tracking", value: "Online profile metrics" },
    ],
    links: [{ label: "Chess Profile", href: "#" }],
    media: [],
  },
  {
    slug: "golfing",
    title: "⛳ Golfing",
    summary: "A pursuit of precision and composure. I track my swing form, distances, and overall performance using Trackman data to continuously refine technique and consistency, focusing on the small details that create big improvements.",
    description:
      "Golf reinforces process discipline, mental resets, and precision under pressure. Small adjustments and consistency make the difference.",
    tags: ["Precision", "Routine", "Composure"],
  },
  {
    slug: "martial-arts",
    title: "🥋 Martial Arts",
    summary: "Built on discipline, technique, and conditioning. This includes competition experience, medals, and match footage, highlighting a state championship in Brazilian Jiu-Jitsu and a top-5 finish in Florida for wrestling.",
    description:
      "Martial arts helps build consistency, self-control, and confidence. It balances physical intensity with technical execution.",
    tags: ["Discipline", "Technique", "Conditioning"],
  },
  {
    slug: "aviation",
    title: "✈️ Aviation",
    summary: "Situational awareness meets disciplined execution. This section features flight clips, Piper time, and airshow moments, focused on precision, safety, and decision-making in dynamic environments.",
    description:
      "Aviation builds strong checklist habits, risk management, and calm decision-making in fast-changing conditions.",
    tags: ["Awareness", "Safety", "Discipline"],
  },
  {
    slug: "music",
    title: "🎵 Music",
    summary: "Creative rhythm and expression. Showcasing the instruments I play and original tracks I have recorded and produced, exploring sound, structure, and emotion through music.",
    description:
      "Music is a creative outlet that sharpens rhythm, focus, and emotional expression.",
    tags: ["Rhythm", "Expression", "Creativity"],
  },
  {
    slug: "videography",
    title: "🎥 Videography",
    summary: "Storytelling through motion and light. This section features travel visuals and cinematic moments, capturing atmosphere, emotion, and perspective through thoughtful composition and editing.",
    description:
      "I enjoy creating visual stories through framing, pacing, and editing. It helps me think in narrative structure and creative direction.",
    tags: ["Storytelling", "Editing", "Creativity"],
  },
];

export const hobbyBySlug = new Map(hobbies.map((hobby) => [hobby.slug, hobby]));
