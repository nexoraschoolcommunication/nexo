import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc py-10">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <p className="text-ink-500 text-xs">© {new Date().getFullYear()} Nexo.</p>
        <div className="flex gap-6 text-xs text-ink-400">
          <Link href="/privacy" className="hover:text-ink-100 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-ink-100 transition-colors">Terms &amp; Conditions</Link>
        </div>
      </div>
    </footer>
  );
}
