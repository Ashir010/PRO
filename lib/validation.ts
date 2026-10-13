/**
 * Shared, dependency-free validation for the contact form.
 * Imported by both the client form and the server route handler so the rules
 * can never drift apart.
 */

import { regions } from "@/data/services";

export type ContactPayload = {
  name: string;
  email: string;
  region: string;
  message: string;
  /** honeypot — must be empty for a real human */
  company?: string;
};

export type FieldErrors = Partial<
  Record<"name" | "email" | "region" | "message", string>
>;

// Pragmatic email check — intentionally permissive, server does the same.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(input: Partial<ContactPayload>): FieldErrors {
  const errors: FieldErrors = {};

  const name = (input.name ?? "").trim();
  if (name.length < 2) errors.name = "Please enter your name.";
  else if (name.length > 100) errors.name = "That name is too long.";

  const email = (input.email ?? "").trim();
  if (!email) errors.email = "Please enter your email.";
  else if (!EMAIL_RE.test(email) || email.length > 254)
    errors.email = "Please enter a valid email address.";

  const region = (input.region ?? "").trim();
  if (!region) errors.region = "Please choose a region.";
  else if (!regions.includes(region as (typeof regions)[number]))
    errors.region = "Please choose a region from the list.";

  const message = (input.message ?? "").trim();
  if (message.length < 10)
    errors.message = "Please add a little more detail (10+ characters).";
  else if (message.length > 4000) errors.message = "That message is too long.";

  return errors;
}

export function hasErrors(errors: FieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
