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
    additionalServices: Array.isArray(body.additionalServices)
      ? body.additionalServices.filter((item): item is string => typeof item === "string")
      : [],
    saasPlatformType: String(body.saasPlatformType ?? ""),
    saasPlatformOther: String(body.saasPlatformOther ?? ""),
    saasVideoType: String(body.saasVideoType ?? ""),
    saasAssets: Array.isArray(body.saasAssets)
      ? body.saasAssets.filter((item): item is string => typeof item === "string")
      : [],
    editingFootageType: String(body.editingFootageType ?? ""),
    editingFootageOther: String(body.editingFootageOther ?? ""),
    editingServices: Array.isArray(body.editingServices)
      ? body.editingServices.filter((item): item is string => typeof item === "string")
      : [],
    footageDuration: String(body.footageDuration ?? ""),
    podcastType: String(body.podcastType ?? ""),
    podcastTypeOther: String(body.podcastTypeOther ?? ""),
    podcastServices: Array.isArray(body.podcastServices)
      ? body.podcastServices.filter((item): item is string => typeof item === "string")
      : [],
    episodeFrequency: String(body.episodeFrequency ?? ""),
    ugcPlatforms: Array.isArray(body.ugcPlatforms)
      ? body.ugcPlatforms.filter((item): item is string => typeof item === "string")
      : [],
    ugcContentTypes: Array.isArray(body.ugcContentTypes)
      ? body.ugcContentTypes.filter((item): item is string => typeof item === "string")
      : [],
    ugcContentVolume: String(body.ugcContentVolume ?? ""),
    shootType: String(body.shootType ?? ""),
    productionRequirements: Array.isArray(body.productionRequirements)
      ? body.productionRequirements.filter((item): item is string => typeof item === "string")
      : [],
    shootLocation: String(body.shootLocation ?? ""),
    shootDate: String(body.shootDate ?? ""),
    shootDuration: String(body.shootDuration ?? ""),
    customProjectDescription: String(body.customProjectDescription ?? ""),
    expectedDeliverables: Array.isArray(body.expectedDeliverables)
      ? body.expectedDeliverables.filter((item): item is string => typeof item === "string")
      : [],
    customProjectReferences: String(body.customProjectReferences ?? ""),
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
          ...(payload.service === "SaaS & Motion Graphics"
            ? [
                `SaaS animation for: ${payload.saasPlatformType}`,
                `SaaS animation details: ${payload.saasPlatformOther || "Not provided"}`,
                `SaaS video type: ${payload.saasVideoType}`,
                `Current assets: ${payload.saasAssets.join(", ") || "Not provided"}`,
              ]
            : []),
          ...(payload.service === "Video Editing & Post-Production"
            ? [
                `Editing footage: ${payload.editingFootageType}`,
                `Editing footage details: ${payload.editingFootageOther || "Not provided"}`,
                `Editing services: ${payload.editingServices.join(", ") || "Not provided"}`,
                `Footage duration: ${payload.footageDuration}`,
              ]
            : []),
          ...(payload.service === "Podcast Production"
            ? [
                `Podcast type: ${payload.podcastType}`,
                `Podcast type details: ${payload.podcastTypeOther || "Not provided"}`,
                `Production services: ${payload.podcastServices.join(", ") || "Not provided"}`,
                `Episode frequency: ${payload.episodeFrequency}`,
              ]
            : []),
          ...(payload.service === "UGC & Social Media Content"
            ? [
                `UGC platforms: ${payload.ugcPlatforms.join(", ") || "Not provided"}`,
                `UGC content types: ${payload.ugcContentTypes.join(", ") || "Not provided"}`,
                `UGC content volume: ${payload.ugcContentVolume}`,
              ]
            : []),
          ...(payload.service === "Videography & On-Site Shoots"
            ? [
                `Shoot type: ${payload.shootType}`,
                `Production requirements: ${payload.productionRequirements.join(", ") || "Not provided"}`,
                `Shoot location: ${payload.shootLocation}`,
                `Preferred shoot date: ${payload.shootDate}`,
                `Shoot duration: ${payload.shootDuration}`,
              ]
            : []),
          ...(payload.service === "Something Else"
            ? [
                `Custom project description: ${payload.customProjectDescription}`,
                `Expected deliverables: ${payload.expectedDeliverables.join(", ") || "Not provided"}`,
                `Custom project references: ${payload.customProjectReferences || "Not provided"}`,
              ]
            : []),
          `Additional services: ${payload.additionalServices.join(", ") || "Not provided"}`,
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
