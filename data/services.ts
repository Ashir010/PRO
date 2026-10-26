/**
 * ProMotion — single source of truth for all service content.
 *
 * Nav, index cards, the stacked panels and the anchor markers all derive from
 * this array. Edit copy here. Keep every service to the SAME shape (one 4:5
 * media slot, exactly three deliverables, one highlight line) so no team
 * dominates and the deck stays uniform.
 *
 * Media files live at:  public/media/<slug>/primary.(webp|mp4)
 * See README.md → "Replacing placeholder assets".
 */

import type { IconName } from "@/components/ui/Icon";

export type Deliverable = {
  icon: IconName;
  label: string;
  caption: string;
};

export type ServiceColors = {
  /** panel fill */
  bg: string;
  /** primary text on the panel */
  text: string;
  /** muted text on the panel (solid, AA-safe — not low opacity) */
  muted: string;
  /** single accent used for the highlight phrase + details */
  highlight: string;
  /** hairline/icon border on the panel */
  line: string;
  /** true when the panel is dark (CTA becomes light) */
  dark: boolean;
};

export type Service = {
  id: string;
  slug: string;
  number: string; // "01".."06"
  title: string;
  teamLabel: string;
  description: string; // ~two lines — card teaser
  /** Longer copy for the detail / "Read more" view; one entry per paragraph.
   *  Falls back to `description` when omitted. */
  longDescription?: string[];
  deliverables: [Deliverable, Deliverable, Deliverable];
  highlight: { text: string; accent: string }; // accent is a substring of text
  colors: ServiceColors;
  mediaSide: "left" | "right";
  media: {
    aspect: "4 / 5";
    alt: string;
    caption: string; // placeholder caption chip
    path: string; // replaceable, without extension
  };
};

export const services: Service[] = [
  {
    id: "svc-3d",
    slug: "3d-videos",
    number: "01",
    title: "3D Videos",
    teamLabel: "3D Video Team",
    description:
      "We create high-quality 3D animations that bring products, spaces, and complex ideas to life, helping brands showcase their innovations with clarity and visual impact.",
    longDescription: [
      "At ProMotion, we produce 3D visual content for industries including manufacturing, real estate, automotive, energy, technology, and consumer products. From industrial machinery and product demonstrations to architectural visualisations and technical explainers, we transform concepts into compelling visuals.",
      "Whether you're introducing a new product, demonstrating a complex process, or presenting a project before it's built, our 3D production helps communicate your vision effectively.",
    ],
    deliverables: [
      { icon: "cube", label: "Exploded views", caption: "See every component" },
      { icon: "gears", label: "Mechanism demos", caption: "How it moves and works" },
      { icon: "layers", label: "Process explainers", caption: "Step-by-step clarity" },
    ],
    highlight: { text: "Built to make the complex obvious.", accent: "obvious" },
    colors: {
      bg: "#FFFFFF",
      text: "#0A0A0A",
      muted: "#5A5450",
      highlight: "#D4502A",
      line: "#E7DED6",
      dark: false,
    },
    mediaSide: "left",
    media: {
      aspect: "4 / 5",
      alt: "Placeholder: exploded-view 3D render of a product's internal components",
      caption: "Placeholder · exploded view",
      path: "/media/3d-videos/primary",
    },
  },
  {
    id: "svc-saas",
    slug: "saas-motion-graphics",
    number: "02",
    title: "SaaS & Motion Graphics",
    teamLabel: "SaaS & Tech Video Team",
    description:
      "We turn complex software, digital products, and technical concepts into engaging motion graphics and explainer videos that make your technology easier to understand.",
    longDescription: [
      "We work with SaaS companies, tech startups, and digital businesses to create product explainers, animated UI demonstrations, feature walkthroughs, launch videos, and promotional content.",
      "Through clean animation, thoughtful storytelling, and engaging visual design, we help businesses showcase how their products work, communicate key features, and present technical solutions in a way their audience can easily understand.",
    ],
    deliverables: [
      { icon: "window", label: "Product walkthroughs", caption: "Show the software working" },
      { icon: "spark", label: "Concept explainers", caption: "Make the abstract clear" },
      { icon: "play", label: "Launch visuals", caption: "For demos, ads and sites" },
    ],
    highlight: { text: "Clear stories for complex software.", accent: "Clear stories" },
    colors: {
      bg: "#C2451E",
      text: "#FFFFFF",
      muted: "#F6DDD2",
      highlight: "#0A0A0A",
      line: "rgba(255,255,255,0.28)",
      dark: true,
    },
    mediaSide: "right",
    media: {
      aspect: "4 / 5",
      alt: "Placeholder: animated software interface walkthrough frame",
      caption: "Placeholder · UI walkthrough",
      path: "/media/saas-motion-graphics/primary",
    },
  },
  {
    id: "svc-editing",
    slug: "editing-post-production",
    number: "03",
    title: "Editing & Post-Production",
    teamLabel: "Post-Production Team",
    description:
      "From clean, professional edits to advanced visual storytelling, we transform raw footage into polished videos tailored to your brand, audience, and creative vision.",
    longDescription: [
      "Our post-production services cover everything from short-form social content and promotional videos to high-end commercial edits.",
      "We offer professional colour grading, motion graphics, speed ramping, visual effects, tracking, masking, sound design, and advanced transitions. Whether you need straightforward editing or complex, effects-driven production, we adapt our approach to your creative requirements.",
    ],
    deliverables: [
      { icon: "scissors", label: "Editing & pacing", caption: "Shape the narrative" },
      { icon: "captions", label: "Captions & grading", caption: "Subtitles and colour" },
      { icon: "motion", label: "Motion graphics", caption: "Titles and polish" },
    ],
    highlight: { text: "Your footage, finished properly.", accent: "finished properly" },
    colors: {
      bg: "#0A0A0A",
      text: "#FFFFFF",
      muted: "#B9B4AF",
      highlight: "#E8643C",
      line: "rgba(255,255,255,0.22)",
      dark: true,
    },
    mediaSide: "left",
    media: {
      aspect: "4 / 5",
      alt: "Placeholder: editing timeline with clips, captions and audio track",
      caption: "Placeholder · edit timeline",
      path: "/media/editing-post-production/primary",
    },
  },
  {
    id: "svc-podcast",
    slug: "podcast-production",
    number: "04",
    title: "Podcast Production",
    teamLabel: "Podcast Production Team",
    description:
      "From recording to the final edit, we handle every stage of podcast production, delivering professional, engaging content ready for YouTube and social media.",
    longDescription: [
      "We provide complete podcast production solutions for businesses, creators, industry professionals, and personal brands.",
      "Our services include multi-camera filming, professional audio recording, lighting, editing, sound enhancement, and colour grading. We also repurpose long-form episodes into engaging short clips, reels, and promotional content, helping you reach audiences across multiple platforms.",
    ],
    deliverables: [
      { icon: "mic", label: "Multi-cam capture", caption: "Lit, multiple cameras" },
      { icon: "scissors", label: "Editing & delivery", caption: "Episodes, ready to ship" },
      { icon: "upload", label: "Upload & promotion", caption: "Publishing support" },
    ],
    highlight: {
      text: "You bring the conversation. We handle the production.",
      accent: "We handle the production.",
    },
    colors: {
      bg: "#4A1D2E",
      text: "#FFFFFF",
      muted: "#E4C3CC",
      highlight: "#F2A99A",
      line: "rgba(255,255,255,0.24)",
      dark: true,
    },
    mediaSide: "right",
    media: {
      aspect: "4 / 5",
      alt: "Placeholder: lit multi-camera podcast recording setup",
      caption: "Placeholder · recording setup",
      path: "/media/podcast-production/primary",
    },
  },
  {
    id: "svc-ugc",
    slug: "ugc-social",
    number: "05",
    title: "UGC & Social Media",
    teamLabel: "UGC & Social Team",
    description:
      "We create engaging, platform-ready content that helps brands showcase their products, connect with audiences, and build a stronger social media presence.",
    longDescription: [
      "We produce user-generated-style videos, product showcases, branded reels, promotional content, and short-form videos for Instagram, TikTok, YouTube Shorts, and other digital platforms.",
      "From concept development and creative direction to editing and final delivery, we focus on creating content that feels authentic, captures attention, and communicates your brand's message effectively.",
    ],
    deliverables: [
      { icon: "mobile", label: "Short-form content", caption: "Made for the feed" },
      { icon: "heart", label: "Brand stories", caption: "Relatable and specific" },
      { icon: "tag", label: "Product presentations", caption: "Clear product value" },
    ],
    highlight: { text: "Content that actually feels human.", accent: "feels human" },
    colors: {
      bg: "#F3C9B8",
      text: "#0A0A0A",
      muted: "#6B4A3C",
      highlight: "#C2412B",
      line: "rgba(10,10,10,0.14)",
      dark: false,
    },
    mediaSide: "left",
    media: {
      aspect: "4 / 5",
      alt: "Placeholder: short-form social video framed for mobile",
      caption: "Placeholder · short-form",
      path: "/media/ugc-social/primary",
    },
  },
  {
    id: "svc-videography",
    slug: "videography-on-site",
    number: "06",
    title: "Videography & On-Site Shoots",
    teamLabel: "Videography Team",
    description:
      "We provide professional on-location video production for brands and businesses, capturing everything from commercial projects and corporate films to events and promotional content.",
    longDescription: [
      "Our production team handles on-site filming for businesses across industries including manufacturing, automotive, healthcare, hospitality, sports, and real estate.",
      "From corporate films and facility walkthroughs to product shoots, events, interviews, and promotional campaigns, we provide professional camera work, creative direction, and post-production to deliver content that represents your brand at its best.",
    ],
    deliverables: [
      { icon: "camera", label: "On-location shoots", caption: "We travel to you" },
      { icon: "pin", label: "Tailored to the space", caption: "Built for each site" },
      { icon: "frame", label: "Considered composition", caption: "Professional framing" },
    ],
    highlight: { text: "We come to your location.", accent: "your location" },
    colors: {
      bg: "#1F3A2E",
      text: "#FFFFFF",
      muted: "#BFD6C6",
      highlight: "#9FD3B0",
      line: "rgba(255,255,255,0.22)",
      dark: true,
    },
    mediaSide: "right",
    media: {
      aspect: "4 / 5",
      alt: "Placeholder: on-site shoot framed through a camera viewfinder",
      caption: "Placeholder · on location",
      path: "/media/videography-on-site/primary",
    },
  },
];

/** Regions for the contact form — order per brief. */
export const regions = [
  "Asia",
  "Australia / Oceania",
  "Europe",
  "North America",
  "South America",
  "Africa",
] as const;

export type Region = (typeof regions)[number];

/** Site-wide copy that isn't service-specific. */
export const site = {
  name: "ProMotion",
  hero: {
    headline: "Six specialist video teams, one production partner.",
    support:
      "ProMotion plans, shoots, animates and edits — from 3D product explainers and SaaS motion graphics to podcasts, UGC and on-site shoots — each handled by a team that does only that.",
  },
  teamsIntro: {
    heading: "One team per discipline.",
    support:
      "Every service below is owned end to end by a dedicated team — specialist depth, a single point of contact.",
  },
  contact: {
    kicker: "Start a project",
    heading: "Tell us what you're making.",
    support:
      "Share the project and where you are in the world — we work with teams across the US, UK, Europe, Australia and beyond, and we'll route you to the right specialist team.",
  },
};
