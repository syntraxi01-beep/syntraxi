import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Bot, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { chatWithAssistant } from "@/lib/ai.functions";
import { WhatsappFab } from "@/components/whatsapp-fab";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const GREETING: Message = {
  role: "assistant",
  content: "Hola, soy SyntraAI. ¿Qué producto quieres traer desde China o qué servicio necesitas?",
};

export function AiChat() {
  const send = useServerFn(chatWithAssistant);
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, open]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text || pending) return;

    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setPending(true);
    try {
      const result = await send({ data: { messages: next.slice(-10) } });
      setMessages([...next, { role: "assistant", content: result.reply }]);
    } catch {
      setMessages([
        ...next,
        { role: "assistant", content: "No pude conectarme. Escríbenos por WhatsApp y te respondemos enseguida." },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
      {open && (
        <div className="flex h-[26rem] w-[min(22rem,calc(100vw-3rem))] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-panel">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-full bg-primary/10 text-primary">
                <Bot className="size-4" />
              </span>
              <div>
                <p className="text-sm font-semibold">SyntraAI</p>
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Asistente 24/7</p>
              </div>
            </div>
            <button aria-label="Cerrar chat" onClick={() => setOpen(false)}>
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={
                  message.role === "user"
                    ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3 py-2 text-sm text-primary-foreground"
                    : "mr-auto max-w-[85%] rounded-2xl rounded-bl-sm bg-secondary px-3 py-2 text-sm text-secondary-foreground"
                }
              >
                {message.content}
              </div>
            ))}
            {pending && <p className="text-xs text-muted-foreground">SyntraAI está escribiendo…</p>}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border p-3">
            <Input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Escribe tu pregunta…"
              className="rounded-xl"
            />
            <Button type="submit" size="icon" className="rounded-xl" disabled={pending} aria-label="Enviar">
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      )}

      <div className="flex items-center gap-3">
        <WhatsappFab />
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir chat con SyntraAI"
          className="grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-glow transition-transform hover:scale-105"
        >
          {open ? <X className="size-6" /> : <Bot className="size-6" />}
        </button>
      </div>
    </div>
  );
}
