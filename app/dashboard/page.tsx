import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Navbar from "@/components/Navbar";
import NexoAssistant from "@/components/NexoAssistant";
import { MessageSquare, Video, Users } from "lucide-react";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: skills } = await supabase
    .from("user_skills")
    .select("level, mode, skills(name)")
    .eq("user_id", user.id);

  const { data: connections } = await supabase
    .from("connections")
    .select("id, status, requester_id, recipient_id")
    .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`)
    .eq("status", "accepted");

  return (
    <div className="min-h-screen">
      <Navbar authed />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="font-display font-semibold text-2xl mb-1">
          {profile?.full_name ? `Welcome back, ${profile.full_name.split(" ")[0]}` : "Welcome back"}
        </h1>
        <p className="text-ink-500 text-sm mb-8">Here's what's active on your account.</p>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <div className="border border-zinc bg-obsidian rounded-lg p-5">
            <div className="flex items-center gap-2 text-ink-500 text-xs font-medium mb-3">
              <Users size={14} /> Mentor connections
            </div>
            <div className="font-display text-2xl font-semibold">{connections?.length ?? 0}</div>
          </div>
          <div className="border border-zinc bg-obsidian rounded-lg p-5">
            <div className="flex items-center gap-2 text-ink-500 text-xs font-medium mb-3">
              <Video size={14} /> Sessions this month
            </div>
            <div className="font-display text-2xl font-semibold">—</div>
          </div>
          <div className="border border-zinc bg-obsidian rounded-lg p-5">
            <div className="flex items-center gap-2 text-ink-500 text-xs font-medium mb-3">
              <MessageSquare size={14} /> Unread messages
            </div>
            <div className="font-display text-2xl font-semibold">—</div>
          </div>
        </div>

        <h2 className="font-display font-medium text-lg mb-3">Your skill matrix</h2>
        <div className="flex flex-wrap gap-2 mb-10">
          {skills && skills.length > 0 ? (
            skills.map((s: any, i: number) => (
              <span key={i} className="text-xs font-medium border border-zinc bg-obsidian rounded-md px-3 py-1.5">
                {s.skills?.name} <span className="text-ink-500">· {s.level} · {s.mode}</span>
              </span>
            ))
          ) : (
            <p className="text-ink-500 text-sm">No skills added yet. Visit the catalog to add some.</p>
          )}
        </div>

        <h2 className="font-display font-medium text-lg mb-3">Active connections</h2>
        {connections && connections.length > 0 ? (
          <div className="space-y-2">
            {connections.map((c) => (
              <div key={c.id} className="border border-zinc bg-obsidian rounded-lg p-4 text-sm text-ink-400">
                Connection {c.id.slice(0, 8)} — accepted
              </div>
            ))}
          </div>
        ) : (
          <p className="text-ink-500 text-sm">
            No active connections yet. Browse the catalog to find a mentor or learner.
          </p>
        )}
      </main>

      <NexoAssistant />
    </div>
  );
}
