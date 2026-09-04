import Link from "next/link";

export default function Navbar({ authed = false }: { authed?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-zinc bg-slate/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <img src="/logo.png" alt="Nexo Logo" className="h-8 w-auto" />
          <span className="font-display font-semibold text-lg tracking-tight">Nexo</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-ink-400">
          <Link href="/catalog" className="hover:text-ink-100 transition-colors">Skill Catalog</Link>
          {authed && (
            <Link href="/dashboard" className="hover:text-ink-100 transition-colors">Dashboard</Link>
          )}
        </nav>

        <div className="flex items-center gap-3">
          {authed ? (
            <Link
              href="/dashboard"
              className="text-sm font-medium bg-obsidian border border-zinc text-ink-100 px-4 py-2 rounded-md hover:border-cyan/50 transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-ink-400 hover:text-ink-100 transition-colors px-3 py-2">
                Sign In
              </Link>
              <Link
                href="/login?mode=signup"
                className="text-sm font-medium bg-blue text-white px-4 py-2 rounded-md hover:bg-blue/90 transition-colors"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
