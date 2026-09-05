import { WHATSAPP_URL } from "@/components/site-footer";

export function WhatsappFab() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        aria-label="Escribir por WhatsApp"
        className="grid size-14 place-items-center rounded-full bg-whatsapp text-ink-foreground shadow-panel transition-transform hover:scale-105"
      >
        <svg viewBox="0 0 32 32" fill="currentColor" className="size-7" aria-hidden="true">
          <path d="M16.001 3C9.373 3 4 8.373 4 15c0 2.462.727 4.756 1.978 6.678L4 29l7.522-1.955A11.94 11.94 0 0 0 16 27c6.627 0 12-5.373 12-12S22.627 3 16.001 3zm0 21.75c-1.94 0-3.79-.53-5.39-1.5l-.386-.23-4.46 1.16 1.19-4.34-.25-.4A9.72 9.72 0 0 1 5.25 15c0-5.93 4.82-10.75 10.75-10.75S26.75 9.07 26.75 15 21.93 24.75 16 24.75zm5.9-8.02c-.32-.16-1.9-.94-2.2-1.05-.29-.11-.5-.16-.72.16-.21.32-.82 1.05-1.01 1.26-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.6-.95-.85-1.6-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.53-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.08-1.11 2.63s1.14 3.05 1.3 3.26c.16.21 2.24 3.42 5.43 4.8.76.33 1.35.53 1.81.68.76.24 1.45.21 2 .13.61-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.13-.29-.21-.61-.37z" />
        </svg>
      </a>
    </div>
  );
}
