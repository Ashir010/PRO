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
  name: string;
  email: string;
  whatsapp: string;
  /** Honeypot: this must remain empty for a real visitor. */
  company?: string;
};

export type FieldErrors = Partial<
  Record<"service" | "projectSize" | "budget" | "projectDetails" | "country" | "city" | "visualizationType" | "visualizationOther" | "videoType" | "videoTypeOther" | "referenceMaterials" | "name" | "email" | "whatsapp", string>
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
