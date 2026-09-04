import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z.object({
  connectionId: z.string().uuid(),
});

// Very small in-memory limiter as a second layer behind the DB-backed one;
// in a multi-instance deployment the login_attempts-style table pattern
// (see schema.sql) should be used here too. This stops a single instance
// from being hammered.
const hits = new Map<string, number[]>();
function rateLimited(key: string, max = 5, windowMs = 60_000) {
  const now = Date.now();
  const arr = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  arr.push(now);
  hits.set(key, arr);
  return arr.length > max;
}

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (rateLimited(user.id)) {
    return NextResponse.json({ error: "Too many requests. Try again shortly." }, { status: 429 });
  }

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const { connectionId } = parsed.data;

  // Confirm the caller is actually a participant in this connection and
  // that it's accepted — enforced again here even though RLS also covers
  // the insert, because defense-in-depth means never trusting one layer.
  const { data: connection, error: connErr } = await supabase
    .from("connections")
    .select("id, requester_id, recipient_id, status")
    .eq("id", connectionId)
    .single();

  if (connErr || !connection) {
    return NextResponse.json({ error: "Connection not found" }, { status: 404 });
  }
  const isParticipant = connection.requester_id === user.id || connection.recipient_id === user.id;
  if (!isParticipant || connection.status !== "accepted") {
    return NextResponse.json({ error: "Not authorized for this connection" }, { status: 403 });
  }

  // meet.google.com/new issues a genuine, unique Meet room on visit —
  // no Google API key needed for this tier. Storing the redirect URL
  // (not a pre-resolved room code) is intentional: Google mints the
  // actual room when the first participant opens the link.
  const meetUrl = "https://meet.google.com/new";

  const { data: meeting, error: insertErr } = await supabase
    .from("meetings")
    .insert({ connection_id: connectionId, created_by: user.id, meet_url: meetUrl })
    .select()
    .single();

  if (insertErr) {
    return NextResponse.json({ error: "Could not create meeting" }, { status: 500 });
  }

  return NextResponse.json({ meeting });
}
