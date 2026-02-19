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
    summary: "Strategic thinking and pattern recognition under pressure.",
    description:
      "Chess sharpens decision-making and long-range planning. I use it to practice discipline, controlled risk-taking, and staying calm in dynamic positions.",
    tags: ["Strategy", "Tactics", "Study"],
    stats: [
      { label: "Focus", value: "Rapid + Tactics" },
      { label: "Tracking", value: "Online profile metrics" },
    ],
    links: [{ label: "Chess Profile", href: "#" }],
    media: [],
  },
  {
    slug: "billiards",
    title: "Billiards",
    summary: "Precision, angles, and always thinking about the next move.",
    description:
      "Billiards keeps me sharp on geometry, patience, and execution quality. I am always thinking about the next move, not just the current shot.",
    tags: ["Angles", "Control", "Consistency"],
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
    slug: "dancing",
    title: "Dancing",
    summary: "Rhythm, flow, and expression.",
    description:
      "Dancing is where creativity and movement connect. It keeps me present, expressive, and adaptive.",
    tags: ["Rhythm", "Flow", "Expression"],
  },
  {
    slug: "flipping",
    title: "Flipping",
    summary: "Body control and progression.",
    description:
      "Flipping requires confidence, balance, and technique progression. It is one of my favorite ways to push movement skills.",
    tags: ["Balance", "Body Control", "Progressions"],
  },
  {
    slug: "working-out",
    title: "Working Out",
    summary: "Consistency, strength, and recovery.",
    description:
      "Training keeps me physically and mentally consistent. I focus on progressive overload, mobility, and recovery quality.",
    tags: ["Strength", "Mobility", "Consistency"],
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
];

export const hobbyBySlug = new Map(hobbies.map((hobby) => [hobby.slug, hobby]));
