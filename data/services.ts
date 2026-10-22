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
  description: string; // ~two lines
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
      "Visual explanations of products, technologies, industrial mechanisms and processes — so complex ideas land fast with the people who matter.",
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
      "Motion graphics and explainers for software, digital tools and technical concepts — focused on clarity and concise storytelling.",
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
      "From focused editing tasks to advanced finishing, built around the footage you supply — at whatever depth your project needs.",
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
      "Recording through editing, publishing and promotion — professional lighting and multiple cameras, handled end to end.",
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
      "Engaging video that helps brands communicate products and connect with audiences through thoughtful, relatable storytelling.",
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
      "The team travels to your location — cafes, sports clubs, dealerships, industrial sites — for professional filming tailored to each environment.",
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
