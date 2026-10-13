import { NextResponse } from "next/server";
import { hasErrors, validateContact } from "@/lib/validation";

// This handler reads the request (body, headers) at call time, so it is always
// dynamic — no route-segment config needed (and none is allowed under
// nextConfig.cacheComponents).

/**
 * Best-effort, in-memory rate limit. NOTE: this resets on redeploy and is
 * per-instance only — it is NOT a substitute for a real limiter in production.
 * See README for durable options (Upstash Ratelimit, platform WAF, etc.).
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_HITS;
}

function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return fwd?.split(",")[0]?.trim() || "unknown";
}

export async function POST(req: Request) {
  if (isRateLimited(clientIp(req))) {
    return NextResponse.json(
      { ok: false, message: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid request body." },
      { status: 400 },
    );
  }

  // Honeypot: real users never see or fill `company`. Silently accept + drop
  // so bots don't learn they were caught.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const payload = {
    name: String(body.name ?? ""),
    email: String(body.email ?? ""),
    region: String(body.region ?? ""),
    message: String(body.message ?? ""),
  };

  const errors = validateContact(payload);
  if (hasErrors(errors)) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  // --- Delivery -----------------------------------------------------------
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    // Honest: validated, but we will NOT claim it was sent.
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        message:
          "The server received and validated your enquiry, but no email provider is configured, so it was not delivered.",
      },
      { status: 503 },
    );
  }

  // Zero-dependency Resend call — works as soon as the env vars above are set.
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: payload.email,
        subject: `New project enquiry — ${payload.name} (${payload.region})`,
        text: [
          `Name: ${payload.name}`,
          `Email: ${payload.email}`,
          `Region: ${payload.region}`,
          "",
          payload.message,
        ].join("\n"),
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error("Resend delivery failed:", res.status, detail);
      return NextResponse.json(
        { ok: false, message: "Delivery failed. Please try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error("Contact delivery error:", err);
    return NextResponse.json(
      { ok: false, message: "Delivery failed. Please try again." },
      { status: 502 },
    );
  }
}

export function GET() {
  return NextResponse.json(
    { ok: false, message: "Use POST to submit the contact form." },
    { status: 405 },
  );
}
