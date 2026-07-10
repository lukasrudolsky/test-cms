import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getField, getHomeContent, listEditableFields, saveHomeContent, setField } from "@/lib/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TelegramMessage = {
  message_id: number;
  text?: string;
  chat: {
    id: number;
  };
};

type TelegramUpdate = {
  message?: TelegramMessage;
};

const HELP = [
  "Prikazy:",
  "/fields - seznam editovatelnych poli",
  "/get hero.title - ukaze aktualni hodnotu",
  "/set hero.title Novy headline - zmeni text",
  "/set hero.title Radek 1\\nRadek 2 - novy radek",
  "/image hero.image https://... - zmeni obrazek",
  "",
  "Pozn.: navigace a nastaveni firmy se meni pres Pages CMS (content/settings/site.json), tenhle bot pracuje jen s domovskou strankou (content/pages/home.json).",
].join("\n");

async function reply(chatId: number, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) return;

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      disable_web_page_preview: true,
    }),
  });
}

function isAllowed(chatId: number) {
  const allowedChatId = process.env.TELEGRAM_ALLOWED_CHAT_ID;
  return Boolean(allowedChatId && String(chatId) === allowedChatId);
}

function formatValue(value: unknown) {
  if (value === undefined) return "Nenalezeno.";
  if (Array.isArray(value)) return value.join(" | ");
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}

function isProbablyImageUrl(value: string) {
  return /^https?:\/\/.+\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(value);
}

async function handleCommand(text: string) {
  const [command, key, ...rest] = text.trim().split(/\s+/);
  const value = rest.join(" ").trim();
  const content = await getHomeContent();

  if (command === "/start" || command === "/help") return HELP;

  if (command === "/fields") {
    return listEditableFields(content)
      .map((field) => `- ${field}`)
      .join("\n");
  }

  if (command === "/get") {
    if (!key) return "Pouzij: /get hero.title";
    return `${key}:\n${formatValue(getField(content, key))}`;
  }

  if (command === "/set" || command === "/image") {
    if (!key || !value) return command === "/image" ? "Pouzij: /image images.hero https://..." : "Pouzij: /set hero.title Novy text";
    if (command === "/image" && !isProbablyImageUrl(value)) {
      return "Obrazek musi byt URL na png, jpg, jpeg, webp, gif nebo svg.";
    }

    const updated = setField(content, key, value);
    if (!updated) return `Pole nejde upravit nebo neexistuje: ${key}`;

    await saveHomeContent(content);
    revalidatePath("/");
    return `Hotovo.\n${key}:\n${formatValue(getField(content, key))}`;
  }

  return HELP;
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  if (webhookSecret && request.headers.get("x-telegram-bot-api-secret-token") !== webhookSecret) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const update = (await request.json()) as TelegramUpdate;
  const message = update.message;
  if (!message?.text) return NextResponse.json({ ok: true });

  const chatId = message.chat.id;
  if (!isAllowed(chatId)) {
    await reply(chatId, "Tenhle chat nema opravneni menit web.");
    return NextResponse.json({ ok: true });
  }

  try {
    await reply(chatId, await handleCommand(message.text));
  } catch (error) {
    console.error(error);
    await reply(chatId, "Neco se pokazilo pri uprave obsahu.");
  }

  return NextResponse.json({ ok: true });
}
