"use client";

import { useRef, useState } from "react";
import { regions } from "@/data/services";
import {
  hasErrors,
  validateContact,
  type ContactPayload,
  type FieldErrors,
} from "@/lib/validation";

type Status = "idle" | "submitting" | "success" | "notConfigured" | "error";

const ERROR_COLOR = "#B23A2E";

const empty: ContactPayload = {
  name: "",
  email: "",
  region: "",
  message: "",
  company: "",
};

export function ContactForm() {
  const [values, setValues] = useState<ContactPayload>(empty);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);

  const update =
    (field: keyof ContactPayload) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >,
    ) => {
      setValues((v) => ({ ...v, [field]: e.target.value }));
      if (errors[field as keyof FieldErrors]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[field as keyof FieldErrors];
          return next;
        });
      }
    };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    const found = validateContact(values);
    if (hasErrors(found)) {
      setErrors(found);
      // move focus to the first invalid field
      const firstKey = Object.keys(found)[0];
      formRef.current
        ?.querySelector<HTMLElement>(`[name="${firstKey}"]`)
        ?.focus();
      return;
    }

    setStatus("submitting");
    setServerMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        configured?: boolean;
        message?: string;
        errors?: FieldErrors;
      };

      if (res.status === 422 && data.errors) {
        setErrors(data.errors);
        setStatus("idle");
        return;
      }

      if (res.ok && data.ok) {
        setStatus("success");
        setValues(empty);
        return;
      }

      if (res.status === 503 || data.configured === false) {
        setStatus("notConfigured");
        setServerMessage(data.message ?? "");
        return;
      }

      setStatus("error");
      setServerMessage(data.message ?? "");
    } catch {
      setStatus("error");
      setServerMessage("Network error — please try again.");
    }
  }

  if (status === "success") {
    return (
      <Notice tone="positive" heading="Thanks — your message is in.">
        We&apos;ll be in touch shortly about your project. If it&apos;s urgent,
        reply to the confirmation and we&apos;ll route you to the right team.
      </Notice>
    );
  }

  if (status === "notConfigured") {
    return (
      <Notice tone="neutral" heading="Your details passed validation.">
        Email delivery isn&apos;t connected on this deployment yet, so nothing
        was sent — we&apos;re not going to pretend otherwise.
        {serverMessage ? ` ${serverMessage}` : ""} See the project README to
        connect a provider (Resend, Formspree or SMTP).
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="ul-link mt-4 block text-[0.9rem] font-medium text-ink"
        >
          Back to the form
        </button>
      </Notice>
    );
  }

  const submitting = status === "submitting";

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="w-full">
      {/* Honeypot — hidden from humans, visible to naive bots */}
      <div aria-hidden="true" className="sr-hp">
        <label htmlFor="company">Company (leave this field empty)</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={update("company")}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Field
          label="Name"
          name="name"
          error={errors.name}
          value={values.name}
          onChange={update("name")}
          autoComplete="name"
          disabled={submitting}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          error={errors.email}
          value={values.email}
          onChange={update("email")}
          autoComplete="email"
          disabled={submitting}
        />
      </div>

      <div className="mt-5">
        <FieldShell label="Region" name="region" error={errors.region}>
          <select
            id="region"
            name="region"
            value={values.region}
            onChange={update("region")}
            disabled={submitting}
            aria-invalid={errors.region ? "true" : undefined}
            aria-describedby={errors.region ? "region-error" : undefined}
            className="w-full rounded-md border bg-surface px-3.5 py-2.5 text-[0.975rem] text-ink"
          >
            <option value="" disabled>
              Select a region…
            </option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </FieldShell>
      </div>

      <div className="mt-5">
        <FieldShell
          label="Project enquiry / message"
          name="message"
          error={errors.message}
        >
          <textarea
            id="message"
            name="message"
            rows={5}
            value={values.message}
            onChange={update("message")}
            disabled={submitting}
            placeholder="What are you making, and what do you need from us?"
            aria-invalid={errors.message ? "true" : undefined}
            aria-describedby={errors.message ? "message-error" : undefined}
            className="w-full resize-y rounded-md border bg-surface px-3.5 py-2.5 text-[0.975rem] text-ink placeholder:text-faint"
          />
        </FieldShell>
      </div>

      {status === "error" && (
        <p
          role="alert"
          className="mt-5 text-[0.9rem]"
          style={{ color: ERROR_COLOR }}
        >
          Something went wrong{serverMessage ? `: ${serverMessage}` : ""}. Please
          try again.
        </p>
      )}

      <div className="mt-7 flex items-center gap-4">
        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          className="inline-flex items-center rounded-full bg-ink px-6 py-3 text-[0.95rem] font-medium text-bg transition-opacity duration-300 hover:opacity-85 disabled:opacity-60"
        >
          {submitting ? "Sending…" : "Send enquiry"}
        </button>
        <p className="text-caption text-faint">
          No phone number needed. We reply by email.
        </p>
      </div>
    </form>
  );
}

/* ---------------------------------------------------------------- */

function Field({
  label,
  name,
  error,
  type = "text",
  ...rest
}: {
  label: string;
  name: string;
  error?: string;
  type?: string;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <FieldShell label={label} name={name} error={error}>
      <input
        id={name}
        name={name}
        type={type}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={error ? `${name}-error` : undefined}
        className="w-full rounded-md border bg-surface px-3.5 py-2.5 text-[0.975rem] text-ink placeholder:text-faint"
        {...rest}
      />
    </FieldShell>
  );
}

function FieldShell({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-[0.85rem] font-medium text-ink"
      >
        {label} <span style={{ color: "#B23A2E" }}>*</span>
      </label>
      {children}
      {error && (
        <p
          id={`${name}-error`}
          role="alert"
          className="mt-1.5 text-[0.8rem]"
          style={{ color: "#B23A2E" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

function Notice({
  tone,
  heading,
  children,
}: {
  tone: "positive" | "neutral";
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role="status"
      className="rounded-xl border bg-surface p-6"
      style={{
        borderColor:
          tone === "positive"
            ? "color-mix(in srgb, #5A6E52 45%, var(--color-hairline))"
            : "var(--color-hairline)",
      }}
    >
      <h3 className="font-display text-[1.3rem] font-medium text-ink">
        {heading}
      </h3>
      <p className="mt-2 text-[0.975rem] text-muted">{children}</p>
    </div>
  );
}
