/**
 * ProMotion — single source of truth for all service content.
 *
 * Nav links, service cards, section IDs and the stacked panels are ALL driven
 * from this array. To edit copy, change it here. To add/remove a media slot,
 * change the `media` array (keep the slot set identical across services so the
 * layout stays balanced and every team gets equal weight).
 *
 * Media files live at:  public/media/<slug>/<slotKey>.<ext>
 * See README.md → "Replacing placeholder assets".
 */

export type MotifKind =
  | "exploded" // 3D
  | "interface" // SaaS & motion graphics
  | "timeline" // editing & post
  | "podcast" // podcast
  | "shortform" // UGC & social
  | "onsite"; // videography

export type MediaSlot = {
  /** stable key, also the placeholder/real filename stem */
  key: "primary" | "detailA" | "detailB";
  /** CSS aspect-ratio string */
  aspect: "16 / 9" | "4 / 3" | "1 / 1";
  /** descriptive alt text (placeholder today, keep when swapping in real media) */
  alt: string;
  /** short editable caption shown under the media */
  caption: string;
  /** replaceable public path (without extension) */
  path: string;
};

export type Accent = {
  /** human label for the accent (documentation only) */
  name: string;
  /** hex used for labels, fine lines, numerals and interactive states */
  hex: string;
};

export type Service = {
  id: string;
  slug: string;
  /** "01".."06" — understated section numeral */
  number: string;
  title: string;
  teamLabel: string;
  /** one line, used on the service card */
  shortDesc: string;
  /** 1–2 sentences, used in the detailed section */
  longDesc: string;
  /** short list of use-cases / deliverables */
  useCases: string[];
  /** heading above the use-case list, so each section reads correctly */
  useCasesLabel: string;
  accent: Accent;
  motif: MotifKind;
  media: MediaSlot[];
};

function media(slug: string, items: Omit<MediaSlot, "path">[]): MediaSlot[] {
  return items.map((m) => ({ ...m, path: `/media/${slug}/${m.key}` }));
}

export const services: Service[] = [
  {
    id: "svc-3d",
    slug: "3d-videos",
    number: "01",
    title: "3D Videos",
    teamLabel: "3D Video Team",
    shortDesc:
      "Visual explanations of products, technologies and the mechanisms behind how things work.",
    longDesc:
      "Visual explanations of products, technologies, industrial mechanisms and processes — built to make complex ideas easy to grasp and easy to sell.",
    useCasesLabel: "Where it's used",
    useCases: [
      "Show how a product or mechanism works",
      "Explain complex ideas simply",
      "Support sales pitches and product pages",
      "Exploded views and component demos",
      "Trade-show and presentation visuals",
    ],
    accent: { name: "Steel / mineral", hex: "#5B6B7A" },
    motif: "exploded",
    media: media("3d-videos", [
      {
        key: "primary",
        aspect: "16 / 9",
        alt: "Placeholder: exploded-view 3D render of a product's internal components",
        caption: "Exploded view — product component breakdown",
      },
      {
        key: "detailA",
        aspect: "4 / 3",
        alt: "Placeholder: 3D visualization of an industrial mechanism in motion",
        caption: "Mechanism visualization",
      },
      {
        key: "detailB",
        aspect: "1 / 1",
        alt: "Placeholder: close-up 3D render of a machined component",
        caption: "Technical explainer still",
      },
    ]),
  },
  {
    id: "svc-saas",
    slug: "saas-motion-graphics",
    number: "02",
    title: "SaaS & Motion Graphics",
    teamLabel: "Motion & SaaS Team",
    shortDesc:
      "Motion graphics and explainers for software products, digital tools and technical concepts.",
    longDesc:
      "Motion graphics and explainers for software products, digital tools and technical concepts — focused on clarity and concise storytelling that lands quickly.",
    useCasesLabel: "Where it's used",
    useCases: [
      "Product launches and software demos",
      "Website and in-app explainers",
      "Ads and campaign motion graphics",
      "Customer and sales presentations",
      "Trade-show visuals",
    ],
    accent: { name: "Cool technical blue", hex: "#2F6DB0" },
    motif: "interface",
    media: media("saas-motion-graphics", [
      {
        key: "primary",
        aspect: "16 / 9",
        alt: "Placeholder: animated software interface walkthrough frame",
        caption: "Animated product walkthrough",
      },
      {
        key: "detailA",
        aspect: "4 / 3",
        alt: "Placeholder: motion-graphics explainer of a technical concept",
        caption: "Concept explainer",
      },
      {
        key: "detailB",
        aspect: "1 / 1",
        alt: "Placeholder: launch visual for a software product",
        caption: "Launch visual",
      },
    ]),
  },
  {
    id: "svc-editing",
    slug: "editing-post-production",
    number: "03",
    title: "Editing & Post-Production",
    teamLabel: "Post-Production Team",
    shortDesc:
      "From focused editing tasks to advanced finishing, shaped around the footage you supply.",
    longDesc:
      "From focused editing tasks to advanced finishing — a flexible post-production workflow shaped around the footage you supply, at whatever depth your project needs.",
    useCasesLabel: "Deliverables",
    useCases: [
      "Editing and pacing",
      "Captions and subtitles",
      "Color grading",
      "Motion graphics",
      "Refinement of supplied footage",
    ],
    accent: { name: "Restrained amber", hex: "#B07A2E" },
    motif: "timeline",
    media: media("editing-post-production", [
      {
        key: "primary",
        aspect: "16 / 9",
        alt: "Placeholder: editing timeline with clips, captions and audio track",
        caption: "Edit timeline and pacing",
      },
      {
        key: "detailA",
        aspect: "4 / 3",
        alt: "Placeholder: before and after color-grading comparison",
        caption: "Color grading",
      },
      {
        key: "detailB",
        aspect: "1 / 1",
        alt: "Placeholder: captioned social cut of a longer edit",
        caption: "Captions and subtitles",
      },
    ]),
  },
  {
    id: "svc-podcast",
    slug: "podcast-production",
    number: "04",
    title: "Podcast Production",
    teamLabel: "Podcast Team",
    shortDesc:
      "Recording through editing, publishing and promotion. You bring the conversation; we handle the production.",
    longDesc:
      "End-to-end podcast production, from recording through editing, publishing and promotion. You bring the conversation — we handle the production.",
    useCasesLabel: "What's included",
    useCases: [
      "Professional lighting setups",
      "Multiple Sony cameras",
      "Podcast editing",
      "Upload and publishing support",
      "Promotion support",
    ],
    accent: { name: "Muted burgundy", hex: "#7A3B52" },
    motif: "podcast",
    media: media("podcast-production", [
      {
        key: "primary",
        aspect: "16 / 9",
        alt: "Placeholder: lit multi-camera podcast recording setup",
        caption: "Lit, multi-camera recording setup",
      },
      {
        key: "detailA",
        aspect: "4 / 3",
        alt: "Placeholder: podcast episode being edited",
        caption: "Editing the episode",
      },
      {
        key: "detailB",
        aspect: "1 / 1",
        alt: "Placeholder: published episode and promo clip",
        caption: "Published episode and promo clip",
      },
    ]),
  },
  {
    id: "svc-ugc",
    slug: "ugc-social",
    number: "05",
    title: "UGC & Social Media",
    teamLabel: "UGC & Social Team",
    shortDesc:
      "Engaging video content that helps brands communicate products and connect with audiences.",
    longDesc:
      "Engaging, relatable video content that helps brands communicate products and connect with audiences — through thoughtful storytelling, careful composition and clear product value.",
    useCasesLabel: "What we make",
    useCases: [
      "Short-form product content",
      "Social-first brand stories",
      "Lifestyle product presentations",
      "Short-form promo edits",
      "Relatable, clearly composed storytelling",
    ],
    accent: { name: "Restrained coral", hex: "#C45B4A" },
    motif: "shortform",
    media: media("ugc-social", [
      {
        key: "primary",
        aspect: "16 / 9",
        alt: "Placeholder: short-form social video framed for mobile",
        caption: "Short-form, social-first content",
      },
      {
        key: "detailA",
        aspect: "4 / 3",
        alt: "Placeholder: lifestyle product presentation still",
        caption: "Lifestyle product story",
      },
      {
        key: "detailB",
        aspect: "1 / 1",
        alt: "Placeholder: vertical product promo edit",
        caption: "Short-form promo edit",
      },
    ]),
  },
  {
    id: "svc-videography",
    slug: "videography-on-site",
    number: "06",
    title: "Videography & On-Site Shoots",
    teamLabel: "On-Site Video Team",
    shortDesc:
      "We travel to your location for professional filming, composed and tailored to the environment.",
    longDesc:
      "The team travels to client locations — cafes, sports clubs, car dealerships, industrial facilities and other commercial sites — for professional filming and thoughtful composition tailored to each environment.",
    useCasesLabel: "How it works",
    useCases: [
      "Filming on location at your site",
      "Shoots tailored to each environment",
      "Professional, considered composition",
      "Flexible setups for commercial spaces",
      "Cafes, clubs, dealerships, facilities and more",
    ],
    accent: { name: "Muted green / earthy", hex: "#5A6E52" },
    motif: "onsite",
    media: media("videography-on-site", [
      {
        key: "primary",
        aspect: "16 / 9",
        alt: "Placeholder: on-site shoot framed through a camera viewfinder",
        caption: "On location, framed to the space",
      },
      {
        key: "detailA",
        aspect: "4 / 3",
        alt: "Placeholder: professional filming at a commercial site",
        caption: "Professional on-site filming",
      },
      {
        key: "detailB",
        aspect: "1 / 1",
        alt: "Placeholder: composed detail shot from a location shoot",
        caption: "Composed detail shot",
      },
    ]),
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
    headline: "Video production, handled by specialists — not generalists.",
    support:
      "ProMotion runs six dedicated teams — 3D, SaaS motion graphics, editing, podcasts, social content and on-site videography — so every project goes to people who do that work every day.",
  },
  teamsIntro: {
    heading: "Six specialist teams. One production partner.",
    support:
      "Each discipline below is owned end-to-end by a team that focuses on nothing else — so you get specialist depth with a single point of contact.",
  },
  contact: {
    heading: "Let's talk about your project.",
    support:
      "Tell us what you're making and where you are in the world. We work with teams across the US, UK, Europe, Australia and beyond, and we'll point you to the right specialist team.",
  },
};
