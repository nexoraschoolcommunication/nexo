"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { buildCatalog, CATEGORIES } from "@/data/skills";

const LEVELS = ["All", "Beginner", "Intermediate", "Advanced"] as const;

export default function CatalogPage() {
  const catalog = useMemo(() => buildCatalog(), []);
  const [category, setCategory] = useState<string>("all");
  const [level, setLevel] = useState<(typeof LEVELS)[number]>("All");
  const [query, setQuery] = useState("");

  const filtered = catalog.filter((row) => {
    if (category !== "all" && row.category.toLowerCase() !== category) return false;
    if (level !== "All" && row.level !== level) return false;
    if (query && !row.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  // De-dupe by skill name for card display; level filter still narrows the count.
  const uniqueByName = Array.from(new Map(filtered.map((r) => [r.name, r])).values());

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="font-display font-semibold text-2xl mb-1">Skill catalog</h1>
        <p className="text-ink-500 text-sm mb-6">
          {catalog.length.toLocaleString()} entries across {CATEGORIES.length} categories and three skill levels.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search skills"
            className="flex-1 bg-obsidian border border-zinc rounded-md px-4 py-2.5 text-sm focus-ring"
          />
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as any)}
            className="bg-obsidian border border-zinc rounded-md px-3 py-2.5 text-sm focus-ring"
          >
            {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        <div className="flex gap-2 flex-wrap mb-8">
          <button
            onClick={() => setCategory("all")}
            className={`text-xs font-medium border rounded-md px-3.5 py-1.5 transition-colors ${
              category === "all" ? "border-cyan text-cyan bg-cyan/10" : "border-zinc text-ink-400"
            }`}
          >
            All categories
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.slug}
              onClick={() => setCategory(c.slug)}
              className={`text-xs font-medium border rounded-md px-3.5 py-1.5 transition-colors ${
                category === c.slug ? "border-cyan text-cyan bg-cyan/10" : "border-zinc text-ink-400"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {uniqueByName.map((row) => (
            <div key={row.slug} className="border border-zinc bg-obsidian rounded-lg p-5 elev-1">
              <div className="text-[11px] font-medium text-cyan mb-2">{row.category}</div>
              <div className="font-display font-medium text-base mb-3">{row.name}</div>
              <span className="text-[11px] font-medium border border-zinc rounded-md px-2.5 py-1 text-ink-400">
                {row.level}
              </span>
            </div>
          ))}
        </div>

        {uniqueByName.length === 0 && (
          <p className="text-ink-500 text-sm mt-10">No skills match those filters.</p>
        )}
      </main>
      <Footer />
    </div>
  );
}
