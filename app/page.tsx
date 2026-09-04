import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CATEGORIES } from "@/data/skills";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 pt-24 pb-20">
        <div className="max-w-2xl">
          <h1 className="font-display font-semibold text-5xl leading-[1.1] tracking-tight mb-6">
            Structured peer learning, without the tuition.
          </h1>
          <p className="text-ink-400 text-lg leading-relaxed mb-8 max-w-xl">
            Nexo matches people who want to learn a skill with people who can teach it,
            using a structured catalog instead of an unstructured feed. Set your level,
            find your match, meet directly.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/login?mode=signup"
              className="inline-flex items-center gap-2 bg-blue text-white font-medium px-6 py-3 rounded-md hover:bg-blue/90 transition-colors"
            >
              Create an account <ArrowRight size={16} />
            </Link>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 border border-zinc text-ink-100 font-medium px-6 py-3 rounded-md hover:border-cyan/40 transition-colors"
            >
              Browse the skill catalog
            </Link>
          </div>
        </div>
      </section>

      {/* Public catalog preview */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-semibold text-2xl">Skill catalog</h2>
          <Link href="/catalog" className="text-sm text-cyan hover:text-cyan/80 transition-colors flex items-center gap-1">
            View all categories <ArrowRight size={14} />
          </Link>
        </div>

        <div className="relative mb-8 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500" />
          <input
            type="text"
            placeholder="Search the catalog"
            className="w-full bg-obsidian border border-zinc rounded-md pl-10 pr-4 py-2.5 text-sm focus-ring"
          />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/catalog?category=${cat.slug}`}
              className="border border-zinc bg-obsidian rounded-lg p-5 hover:border-cyan/40 transition-colors elev-1"
            >
              <div className="font-display font-medium text-base mb-2">{cat.name}</div>
              <p className="text-ink-500 text-xs leading-relaxed">
                {cat.seed.slice(0, 4).join(", ")}
                {cat.seed.length > 4 ? ", and more" : ""}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Custom domain setup hook */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="border border-zinc bg-obsidian rounded-lg p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="font-display font-medium text-lg mb-1">Running Nexo on your own domain</h3>
            <p className="text-ink-500 text-sm max-w-md">
              Point your domain's DNS to your hosting provider and set NEXT_PUBLIC_SITE_URL
              in your environment. Auth redirect URLs must be updated in Supabase to match.
            </p>
          </div>
          <a
            href="https://nextjs.org/docs/app/building-your-application/deploying"
            className="shrink-0 text-sm font-medium border border-zinc px-5 py-2.5 rounded-md hover:border-cyan/40 transition-colors"
          >
            Deployment docs
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
