import { MessageCircle } from "lucide-react";
import { WHATSAPP_URL } from "@/components/site-footer";

export function WhatsappFab() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noreferrer"
      aria-label="Escribir por WhatsApp"
      className="grid size-14 place-items-center rounded-full bg-whatsapp text-ink-foreground shadow-panel transition-transform hover:scale-105"
    >
      <MessageCircle className="size-6" />
    </a>
  );
}
