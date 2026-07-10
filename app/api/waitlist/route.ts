import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function notifyTelegram(email: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ALLOWED_CHAT_ID;
  if (!token || !chatId) return;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: `Nový zápis do waitlistu: ${email}`,
      }),
    });
  } catch (error) {
    console.error("Waitlist Telegram notify failed", error);
  }
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const email = typeof body === "object" && body !== null ? (body as Record<string, unknown>).email : undefined;

  if (typeof email !== "string" || !EMAIL_PATTERN.test(email) || email.length > 254) {
    return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
  }

  await notifyTelegram(email.trim());

  return NextResponse.json({ ok: true });
}
