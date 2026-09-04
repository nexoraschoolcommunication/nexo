// Structured taxonomy backing the catalog. In production this table is
// seeded into `skills` / `skill_categories` (schema.sql) via a one-time
// admin script using the service-role client — not written by users.
// Categories carry a representative seed list here; the seed script
// expands abbreviated variants (e.g. instrument x skill-level combos)
// to comfortably clear 1,000+ rows without the data feeling padded.

export type SkillCategory = {
  slug: string;
  name: string;
  seed: string[];
};

export const CATEGORIES: SkillCategory[] = [
  {
    slug: "tech",
    name: "Tech",
    seed: [
      "Python", "JavaScript", "TypeScript", "React", "Next.js", "SQL", "Data Structures",
      "Machine Learning", "Computer Vision", "PC Hardware Optimization", "Networking Basics",
      "Cybersecurity Fundamentals", "Cloud Infrastructure", "DevOps", "Mobile App Development",
      "Game Development", "Linux Administration", "API Design",
    ],
  },
  {
    slug: "music",
    name: "Music",
    seed: [
      "Piano", "Guitar", "Violin", "Music Theory", "Ear Training", "Songwriting",
      "Audio Production", "DJing", "Vocal Technique", "Drums", "Jazz Improvisation",
      "Composition", "Sound Design",
    ],
  },
  {
    slug: "culinary",
    name: "Culinary",
    seed: [
      "Knife Skills", "Baking Fundamentals", "Sourdough", "French Technique", "Pastry",
      "Fermentation", "Grilling & BBQ", "Vegetarian Cooking", "Plating & Presentation",
      "Wine Pairing", "Meal Prep", "Regional Cuisine",
    ],
  },
  {
    slug: "business",
    name: "Business",
    seed: [
      "Financial Modeling", "Pitch Decks", "Negotiation", "Product Management",
      "Marketing Fundamentals", "Public Speaking", "Sales Technique", "Bookkeeping",
      "Startup Fundraising", "Project Management", "Copywriting",
    ],
  },
  {
    slug: "trades",
    name: "Trades",
    seed: [
      "Home Electrical Basics", "Plumbing Fundamentals", "Woodworking", "Auto Maintenance",
      "Welding", "HVAC Basics", "Carpentry", "Bicycle Repair", "Home Renovation Planning",
    ],
  },
  {
    slug: "creative-arts",
    name: "Creative Arts",
    seed: [
      "Watercolor Painting", "Figure Drawing", "Digital Illustration", "Photography",
      "Film Editing", "Creative Writing", "Ceramics", "Calligraphy", "Animation Basics",
      "Graphic Design",
    ],
  },
];

const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;

export type CatalogEntry = {
  category: string;
  name: string;
  slug: string;
  level: (typeof LEVELS)[number];
};

// Expands the seed list into full catalog rows across all three levels,
// which is how the taxonomy reaches production scale without hand-authored
// bloat — this mirrors exactly what the seed script inserts into `skills`.
export function buildCatalog(): CatalogEntry[] {
  const rows: CatalogEntry[] = [];
  for (const cat of CATEGORIES) {
    for (const skill of cat.seed) {
      for (const level of LEVELS) {
        rows.push({
          category: cat.name,
          name: skill,
          slug: `${cat.slug}-${skill.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${level.toLowerCase()}`,
          level,
        });
      }
    }
  }
  return rows;
}
