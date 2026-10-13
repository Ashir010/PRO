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

const ERROR_COLOR = "#F6A592";
const INPUT =
  "w-full rounded-md border border-white/20 bg-white/5 px-3.5 py-2.5 text-[0.975rem] text-white placeholder:text-white/40 focus:border-white/40";

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
  const [serverMessage, setServerMessage] = useState("");
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
      const firstKey = Object.keys(found)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${firstKey}"]`)?.focus();
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
      <Notice heading="Thanks — your message is in.">
        We&apos;ll be in touch shortly about your project and route you to the
        right specialist team.
      </Notice>
    );
  }

  if (status === "notConfigured") {
    return (
      <Notice heading="Your details passed validation.">
        Email delivery isn&apos;t connected on this deployment yet, so nothing
        was sent — we won&apos;t pretend otherwise.
        {serverMessage ? ` ${serverMessage}` : ""} See the README to connect a
        provider.
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="ul-link mt-4 block text-[0.9rem] font-semibold text-white"
        >
          Back to the form
        </button>
      </Notice>
    );
  }

  const submitting = status === "submitting";

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="w-full">
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
            className={INPUT}
          >
            <option value="" disabled>
              Select a region…
            </option>
            {regions.map((r) => (
              <option key={r} value={r} className="text-black">
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
            className={`${INPUT} resize-y`}
          />
        </FieldShell>
      </div>

      {status === "error" && (
        <p role="alert" className="mt-5 text-[0.9rem]" style={{ color: ERROR_COLOR }}>
          Something went wrong{serverMessage ? `: ${serverMessage}` : ""}. Please
          try again.
        </p>
      )}

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          className="inline-flex items-center rounded-full bg-[#F4EEE8] px-6 py-3 text-[0.95rem] font-semibold text-ink transition-opacity duration-300 hover:opacity-85 disabled:opacity-60"
        >
          {submitting ? "Sending…" : "Send enquiry"}
        </button>
        <p className="text-caption text-white/50">
          No phone number needed. We reply by email.
        </p>
      </div>
    </form>
  );
}

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
        className={INPUT}
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
      <label htmlFor={name} className="mb-1.5 block text-[0.85rem] font-medium text-white/90">
        {label} <span style={{ color: ERROR_COLOR }}>*</span>
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} role="alert" className="mt-1.5 text-[0.8rem]" style={{ color: ERROR_COLOR }}>
          {error}
        </p>
      )}
    </div>
  );
}

function Notice({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div role="status" className="rounded-xl border border-white/15 bg-white/5 p-6">
      <h3 className="font-display text-[1.3rem] font-semibold text-white">{heading}</h3>
      <p className="mt-2 text-[0.975rem] text-white/70">{children}</p>
    </div>
  );
}
