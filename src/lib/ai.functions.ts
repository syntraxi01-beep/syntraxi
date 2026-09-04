import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const schema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(2000),
      }),
    )
    .min(1)
    .max(20),
});

const SYSTEM_PROMPT = `Eres SyntraAI, el asistente comercial de Syntraxi, una empresa colombiana que importa productos desde China, vende instrumentación industrial y ofrece dropshipping.
Responde siempre en español, breve (máximo 4 frases), cordial y concreto.
Servicios: búsqueda y validación de proveedores en China, negociación, control de calidad, logística y aduanas, entrega en Colombia, instrumentación y automatización industrial (Endress+Hauser, PLC Siemens S7-1200, tableros), y dropshipping.
El precio de cada servicio depende de qué va a importar el cliente o del servicio técnico que necesite, así que nunca inventes tarifas ni planes con precio fijo: siempre invita a escribir por WhatsApp para recibir una cotización personalizada.
Si quieren hablar con una persona, ofrece WhatsApp. Nunca inventes tiempos exactos: usa rangos.`;

// Respuestas de reglas (sin costo, sin API externa) que se usan si no hay
// ninguna clave de IA configurada. Cubren las preguntas más frecuentes.
// Para respuestas generadas por IA, define OPENAI_API_KEY en tus variables
// de entorno (ver .env.example) — OpenAI tiene un nivel gratuito de prueba
// limitado; revisa su pricing antes de activarlo en producción.
const RULES: { keywords: string[]; reply: string }[] = [
  {
    keywords: ["precio", "cotiza", "cotización", "cuanto cuesta", "cuánto cuesta", "vale"],
    reply:
      "El costo depende de qué vas a importar y del modo de envío, así que lo definimos contigo por WhatsApp con una cotización personalizada, sin compromiso.",
  },
  {
    keywords: ["tiempo", "demora", "tarda", "cuanto tarda", "cuánto tarda", "eta"],
    reply:
      "El aéreo exprés tarda entre 6 y 9 días, el aéreo estándar entre 12 y 18 días, y el marítimo consolidado entre 35 y 45 días, según aduanas.",
  },
  {
    keywords: ["dropshipping", "sin inventario", "vender sin stock"],
    reply:
      "Con nuestro servicio de dropshipping conectamos tu tienda con proveedores que despachan directo a tu cliente final en Colombia. Escríbenos por WhatsApp para una cotización personalizada.",
  },
  {
    keywords: ["plan", "paquete", "servicio", "precio mensual"],
    reply:
      "Tenemos servicios de importación, instrumentación industrial y dropshipping. Cada uno se cotiza según lo que necesites — cuéntanos por WhatsApp y te asesoramos con un precio a la medida.",
  },
  {
    keywords: ["instrumentacion", "instrumentación", "sensor", "plc", "tablero", "automatizacion", "automatización"],
    reply:
      "Trabajamos instrumentación y automatización industrial: sensores, PLC Siemens S7-1200, tableros de control y equipos Endress+Hauser, con más de 8 años de experiencia. Escríbenos por WhatsApp para un diagnóstico técnico.",
  },
  {
    keywords: ["hola", "buenas", "buenos dias", "buenos días", "hey"],
    reply: "¡Hola! Soy SyntraAI. ¿Qué producto quieres traer desde China o qué servicio necesitas?",
  },
  {
    keywords: ["gracias"],
    reply: "¡Con gusto! Si necesitas algo más, aquí estoy. También puedes escribirnos por WhatsApp.",
  },
  {
    keywords: ["persona", "asesor", "humano", "hablar con alguien"],
    reply: "Claro, escríbenos por WhatsApp con el botón verde y un asesor te atiende enseguida.",
  },
];

function ruleBasedReply(userMessage: string): string {
  const normalized = userMessage
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  for (const rule of RULES) {
    if (rule.keywords.some((k) => normalized.includes(k.normalize("NFD").replace(/[\u0300-\u036f]/g, "")))) {
      return rule.reply;
    }
  }

  return "Puedo ayudarte con importaciones desde China, instrumentación industrial y dropshipping. Cuéntame qué necesitas y te doy más información, o escríbenos por WhatsApp para una cotización personalizada.";
}

async function callOpenAi(apiKey: string, messages: { role: "user" | "assistant"; content: string }[]) {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    }),
  });

  if (!response.ok) return null;
  const json = (await response.json()) as { choices?: { message?: { content?: string } }[] };
  return json.choices?.[0]?.message?.content?.trim() ?? null;
}

export const chatWithAssistant = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => schema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env["OPENAI_API_KEY"];
    const lastUserMessage = [...data.messages].reverse().find((m) => m.role === "user")?.content ?? "";

    if (apiKey) {
      try {
        const reply = await callOpenAi(apiKey, data.messages);
        if (reply) return { reply };
      } catch {
        // cae al asistente de reglas si la llamada a la IA falla
      }
    }

    return { reply: ruleBasedReply(lastUserMessage) };
  });
