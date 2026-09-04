import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="font-display font-semibold text-2xl mb-6">Terms &amp; Conditions</h1>
        <div className="space-y-5 text-sm text-ink-400 leading-relaxed">
          <p>Placeholder — replace with reviewed legal copy before launch. At minimum, cover:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Acceptable use of the peer-matching and messaging system.</li>
            <li>That Nexo facilitates introductions but is not a party to any teaching arrangement.</li>
            <li>Age requirements and, if minors are permitted, required guardian consent and any additional safety provisions.</li>
            <li>Content rules for messages and profile fields.</li>
            <li>Account suspension and termination conditions.</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
