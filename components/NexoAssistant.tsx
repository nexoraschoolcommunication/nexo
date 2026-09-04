"use client";

import { useState } from "react";
import { Sparkles, X, ArrowUp } from "lucide-react";

type Msg = { role: "user" | "assistant"; text: string };

export default function NexoAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", text: "I'm Nexo Assistant. Ask me to break down a concept from a recent session, or find you a mentor for a specific skill." },
  ]);

  function send() {
    const val = input.trim();
    if (!val) return;
    setMessages((m) => [...m, { role: "user", text: val }]);
    setInput("");
    // Wire this to your actual model endpoint (e.g. /api/assistant calling
    // your LLM provider server-side, so the API key never reaches the client).
    setTimeout(() => {
      setMessages((m) => [...m, { role: "assistant", text: "Connect this response to your assistant backend at /api/assistant." }]);
    }, 500);
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open Nexo Assistant"
        className={`fixed bottom-6 right-6 z-40 w-14 h-14 rounded-lg bg-blue text-white flex items-center justify-center elev-3 hover:bg-blue/90 transition-colors focus-ring ${open ? "hidden" : ""}`}
      >
        <Sparkles size={22} />
      </button>

      <div
        className={`fixed bottom-0 right-0 z-50 w-full sm:w-[380px] sm:bottom-6 sm:right-6 bg-obsidian border border-zinc rounded-t-lg sm:rounded-lg elev-3 flex flex-col transition-all duration-200 ${
          open ? "h-[520px] opacity-100" : "h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc shrink-0">
          <div className="w-8 h-8 rounded-md bg-blue/15 border border-blue/30 flex items-center justify-center text-cyan">
            <Sparkles size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium">Nexo Assistant</div>
            <div className="text-[11px] text-cyan">Active</div>
          </div>
          <button onClick={() => setOpen(false)} className="text-ink-400 hover:text-ink-100 transition-colors focus-ring rounded-md p-1">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] text-sm leading-relaxed px-3.5 py-2.5 rounded-lg ${
                m.role === "assistant"
                  ? "bg-slate border border-zinc self-start"
                  : "bg-blue text-white ml-auto"
              }`}
            >
              {m.text}
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-zinc flex gap-2 shrink-0">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Ask Nexo Assistant..."
            className="flex-1 bg-slate border border-zinc rounded-md px-3 py-2 text-sm focus-ring"
          />
          <button onClick={send} className="w-10 h-10 rounded-md bg-blue text-white flex items-center justify-center shrink-0 hover:bg-blue/90 transition-colors focus-ring">
            <ArrowUp size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
