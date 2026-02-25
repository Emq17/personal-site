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
    title: "Chess",
    summary:
      "Strategic thinking and pattern recognition under pressure. Chess sharpens decision-making and long-range planning. I use it to practice discipline, controlled risk-taking, and staying calm in dynamic positions.",
    description: "",
    tags: ["Strategy", "Tactics", "Calculations"],
    stats: [
      { label: "Focus", value: "Rapid + Tactics" },
      { label: "Tracking", value: "Online profile metrics" },
    ],
    links: [{ label: "Chess Profile", href: "#" }],
    media: [],
  },
  {
    slug: "golfing",
    title: "Golfing",
    summary: "Composure and technical precision.",
    description:
      "Golf reinforces process discipline, mental resets, and precision under pressure. Small adjustments and consistency make the difference.",
    tags: ["Precision", "Routine", "Composure"],
  },
  {
    slug: "martial-arts",
    title: "Martial Arts",
    summary: "Discipline, technique, and conditioning.",
    description:
      "Martial arts helps build consistency, self-control, and confidence. It balances physical intensity with technical execution.",
    tags: ["Discipline", "Technique", "Conditioning"],
  },
  {
    slug: "videography",
    title: "Videography",
    summary: "Storytelling through visuals.",
    description:
      "I enjoy creating visual stories through framing, pacing, and editing. It helps me think in narrative structure and creative direction.",
    tags: ["Storytelling", "Editing", "Creativity"],
  },
  {
    slug: "music",
    title: "Music",
    summary: "Creative rhythm and expression.",
    description:
      "Music is a creative outlet that sharpens rhythm, focus, and emotional expression.",
    tags: ["Rhythm", "Expression", "Creativity"],
  },
  {
    slug: "aviation",
    title: "Aviation",
    summary: "Situational awareness and disciplined execution.",
    description:
      "Aviation builds strong checklist habits, risk management, and calm decision-making in fast-changing conditions.",
    tags: ["Awareness", "Safety", "Discipline"],
  },
];

export const hobbyBySlug = new Map(hobbies.map((hobby) => [hobby.slug, hobby]));
