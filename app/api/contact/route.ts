import { NextResponse } from "next/server";
import { hasErrors, validateContact } from "@/lib/validation";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_HITS;
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "unknown";
}

export async function POST(request: Request) {
  if (isRateLimited(clientIp(request))) {
    return NextResponse.json({ ok: false, message: "Too many requests. Please try again later." }, { status: 429 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }

  // Real visitors never see this honeypot. Silently accept bots so they do not
  // learn that their submission was discarded.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const payload = {
    service: String(body.service ?? ""),
    projectSize: String(body.projectSize ?? ""),
    budget: String(body.budget ?? ""),
    projectDetails: String(body.projectDetails ?? ""),
    country: String(body.country ?? ""),
    city: String(body.city ?? ""),
    visualizationType: String(body.visualizationType ?? ""),
    visualizationOther: String(body.visualizationOther ?? ""),
    videoType: String(body.videoType ?? ""),
    videoTypeOther: String(body.videoTypeOther ?? ""),
    referenceMaterials: Array.isArray(body.referenceMaterials)
      ? body.referenceMaterials.filter((item): item is string => typeof item === "string")
      : [],
    name: String(body.name ?? ""),
    email: String(body.email ?? ""),
    whatsapp: String(body.whatsapp ?? ""),
  };

  const errors = validateContact(payload);
  if (hasErrors(errors)) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        message: "The server validated your enquiry, but no email provider is configured, so it was not delivered.",
      },
      { status: 503 },
    );
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: payload.email,
        subject: `New project enquiry: ${payload.name} (${payload.service})`,
        text: [
          `Name: ${payload.name}`,
          `Email: ${payload.email}`,
          `WhatsApp: ${payload.whatsapp || "Not provided"}`,
          `Service: ${payload.service}`,
          `Project size: ${payload.projectSize}`,
          `Budget: ${payload.budget}`,
          `Country: ${payload.country}`,
          `City: ${payload.city || "Not provided"}`,
          ...(payload.service === "3D Videos"
            ? [
                `Visualization: ${payload.visualizationType}`,
                `Visualization details: ${payload.visualizationOther || "Not provided"}`,
                `3D video type: ${payload.videoType}`,
                `3D video type details: ${payload.videoTypeOther || "Not provided"}`,
                `Reference materials: ${payload.referenceMaterials.join(", ") || "Not provided"}`,
              ]
            : []),
          "",
          "Project details:",
          payload.projectDetails || "Not provided",
        ].join("\n"),
      }),
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      console.error("Resend delivery failed:", response.status, detail);
      return NextResponse.json({ ok: false, message: "Delivery failed. Please try again." }, { status: 502 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("Contact delivery error:", error);
    return NextResponse.json({ ok: false, message: "Delivery failed. Please try again." }, { status: 502 });
  }
}

export function GET() {
  return NextResponse.json({ ok: false, message: "Use POST to submit the contact form." }, { status: 405 });
}
