/** Shared contact-form validation for the client and contact route. */

export type ContactPayload = {
  service: string;
  projectSize: string;
  budget: string;
  projectDetails: string;
  country: string;
  city: string;
  visualizationType: string;
  visualizationOther: string;
  videoType: string;
  videoTypeOther: string;
  referenceMaterials: string[];
  additionalServices: string[];
  saasPlatformType: string;
  saasPlatformOther: string;
  saasVideoType: string;
  saasAssets: string[];
  editingFootageType: string;
  editingFootageOther: string;
  editingServices: string[];
  footageDuration: string;
  podcastType: string;
  podcastTypeOther: string;
  podcastServices: string[];
  episodeFrequency: string;
  ugcPlatforms: string[];
  ugcContentTypes: string[];
  ugcContentVolume: string;
  shootType: string;
  productionRequirements: string[];
  shootLocation: string;
  shootDate: string;
  shootDuration: string;
  customProjectDescription: string;
  expectedDeliverables: string[];
  customProjectReferences: string;
  name: string;
  email: string;
  whatsapp: string;
  /** Honeypot: this must remain empty for a real visitor. */
  company?: string;
};

export type FieldErrors = Partial<
  Record<"service" | "projectSize" | "budget" | "projectDetails" | "country" | "city" | "visualizationType" | "visualizationOther" | "videoType" | "videoTypeOther" | "referenceMaterials" | "saasPlatformType" | "saasPlatformOther" | "saasVideoType" | "saasAssets" | "editingFootageType" | "editingFootageOther" | "editingServices" | "footageDuration" | "podcastType" | "podcastTypeOther" | "podcastServices" | "episodeFrequency" | "ugcPlatforms" | "ugcContentTypes" | "ugcContentVolume" | "shootType" | "productionRequirements" | "shootLocation" | "shootDate" | "shootDuration" | "customProjectDescription" | "expectedDeliverables" | "customProjectReferences" | "name" | "email" | "whatsapp", string>
>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+()\-\s\d]{7,24}$/;

export function validateContact(input: Partial<ContactPayload>): FieldErrors {
  const errors: FieldErrors = {};

  if (!(input.service ?? "").trim()) errors.service = "Please choose the work you need.";
  if (!(input.projectSize ?? "").trim()) errors.projectSize = "Please choose a project size.";
  if (!(input.budget ?? "").trim()) errors.budget = "Please choose a budget range.";

  if ((input.service ?? "") === "3D Videos") {
    if (!(input.visualizationType ?? "").trim()) errors.visualizationType = "Please choose what you'd like us to visualize.";
    if (input.visualizationType === "Other" && !(input.visualizationOther ?? "").trim()) {
      errors.visualizationOther = "Please tell us what you'd like us to visualize.";
    }
    if (!(input.videoType ?? "").trim()) errors.videoType = "Please choose the type of 3D video.";
    if (input.videoType === "Other" && !(input.videoTypeOther ?? "").trim()) {
      errors.videoTypeOther = "Please describe the type of 3D video you need.";
    }
    if (!(input.referenceMaterials ?? []).length) errors.referenceMaterials = "Please choose at least one reference material.";
  }

  if ((input.service ?? "") === "SaaS & Motion Graphics") {
    if (!(input.saasPlatformType ?? "").trim()) errors.saasPlatformType = "Please choose what we're creating animations for.";
    if (input.saasPlatformType === "Other" && !(input.saasPlatformOther ?? "").trim()) {
      errors.saasPlatformOther = "Please tell us what we're creating animations for.";
    }
    if (!(input.saasVideoType ?? "").trim()) errors.saasVideoType = "Please choose the type of video.";
    if (!(input.saasAssets ?? []).length) errors.saasAssets = "Please choose at least one asset.";
  }

  if ((input.service ?? "") === "Video Editing & Post-Production") {
    if (!(input.editingFootageType ?? "").trim()) errors.editingFootageType = "Please choose the type of footage.";
    if (input.editingFootageType === "Other" && !(input.editingFootageOther ?? "").trim()) {
      errors.editingFootageOther = "Please tell us what type of footage you have.";
    }
    if (!(input.editingServices ?? []).length) errors.editingServices = "Please choose at least one editing service.";
    if (!(input.footageDuration ?? "").trim()) errors.footageDuration = "Please choose how much footage you have.";
  }

  if ((input.service ?? "") === "Podcast Production") {
    if (!(input.podcastType ?? "").trim()) errors.podcastType = "Please choose the type of podcast.";
    if (input.podcastType === "Other" && !(input.podcastTypeOther ?? "").trim()) {
      errors.podcastTypeOther = "Please tell us what type of podcast you're planning.";
    }
    if (!(input.podcastServices ?? []).length) errors.podcastServices = "Please choose at least one production service.";
    if (!(input.episodeFrequency ?? "").trim()) errors.episodeFrequency = "Please choose your episode release frequency.";
  }

  if ((input.service ?? "") === "UGC & Social Media Content") {
    if (!(input.ugcPlatforms ?? []).length) errors.ugcPlatforms = "Please choose at least one platform.";
    if (!(input.ugcContentTypes ?? []).length) errors.ugcContentTypes = "Please choose at least one content type.";
    if (!(input.ugcContentVolume ?? "").trim()) errors.ugcContentVolume = "Please choose how much content you need.";
  }

  if ((input.service ?? "") === "Videography & On-Site Shoots") {
    if (!(input.shootType ?? "").trim()) errors.shootType = "Please choose the type of shoot.";
    if (!(input.productionRequirements ?? []).length) errors.productionRequirements = "Please choose at least one production requirement.";
    if (!(input.shootLocation ?? "").trim()) errors.shootLocation = "Please enter the shoot location.";
    if (!(input.shootDate ?? "").trim()) errors.shootDate = "Please select a preferred shoot date.";
    else {
      const selectedDate = new Date(`${input.shootDate}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (!Number.isNaN(selectedDate.getTime()) && selectedDate < today) {
        errors.shootDate = "Please choose today or a future shoot date.";
      }
    }
    if (!(input.shootDuration ?? "").trim()) errors.shootDuration = "Please choose the shoot duration.";
  }

  if ((input.service ?? "") === "Something Else") {
    if (!(input.customProjectDescription ?? "").trim()) {
      errors.customProjectDescription = "Please describe the service or project you have in mind.";
    }
  }

  const details = (input.projectDetails ?? "").trim();
  if (details.length > 4000) errors.projectDetails = "That project description is too long.";

  if (!(input.country ?? "").trim()) errors.country = "Please select your country.";

  const name = (input.name ?? "").trim();
  if (name.length < 2) errors.name = "Please enter your name.";
  else if (name.length > 100) errors.name = "That name is too long.";

  const email = (input.email ?? "").trim();
  if (!email) errors.email = "Please enter your email.";
  else if (!EMAIL_RE.test(email) || email.length > 254) errors.email = "Please enter a valid email address.";

  const whatsapp = (input.whatsapp ?? "").trim();
  if (whatsapp && !PHONE_RE.test(whatsapp)) errors.whatsapp = "Please enter a valid WhatsApp number.";

  return errors;
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
