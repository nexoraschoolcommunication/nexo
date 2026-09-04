import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="font-display font-semibold text-2xl mb-6">Privacy Policy</h1>
        <div className="space-y-5 text-sm text-ink-400 leading-relaxed">
          <p>This placeholder text should be replaced with your reviewed legal copy before launch — templated privacy language creates real liability. At minimum, it should cover:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>What data is collected (profile info, skill matrix, messages, session metadata).</li>
            <li>That messages and meeting records are protected by row-level security and visible only to session participants.</li>
            <li>Third parties involved: Supabase (hosting/auth), Google (OAuth, Meet), Cloudflare (bot protection).</li>
            <li>How users can request data export or deletion.</li>
            <li>Retention periods for login_attempts and session_reflections records.</li>
          </ul>
          <p>Have this reviewed by counsel familiar with your jurisdiction before going live, particularly given the presence of minors as users.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
