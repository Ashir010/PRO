"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { hasErrors, validateContact, type ContactPayload, type FieldErrors } from "@/lib/validation";
import { SpinningLogo } from "@/components/contact/SpinningLogo";
import { CornerLabel } from "@/components/ui/CornerLabel";
import { COUNTRIES } from "@/lib/countries";

type Status = "idle" | "submitting" | "success" | "notConfigured" | "error";
const ERROR_COLOR = "#B83E00";
const INPUT = "w-full rounded-md border border-hairline bg-white px-3.5 py-3 text-[0.975rem] text-ink placeholder:text-muted/70 transition-colors duration-200 focus:border-[#E66B4B]";

const steps = [
  { key: "service", heading: "What do you need done?", description: "Let's start with the kind of work you have in mind.", options: ["3D Videos", "SaaS & Motion Graphics", "Video Editing & Post-Production", "Podcast Production", "UGC & Social Media Content", "Videography & On-Site Shoots", "Something Else"] },
  { key: "projectSize", heading: "How big is the project, roughly?", description: "A rough idea is all we need to get started.", options: ["Just one video", "A few videos (2–5)", "Multiple videos (5–10)", "Ongoing monthly content", "Large-scale production", "Not sure yet"] },
  { key: "budget", heading: "What's your approximate budget?", description: "This helps us understand the scale of your project.", options: ["Under $500", "$500 – $1,000", "$1,000 – $3,000", "$3,000 – $5,000", "$5,000+", "Let's discuss"] },
] as const;

const empty: ContactPayload = { service: "", projectSize: "", budget: "", projectDetails: "", country: "", city: "", name: "", email: "", whatsapp: "", company: "" };

export function ContactForm() {
  const [values, setValues] = useState<ContactPayload>(empty);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => { headingRef.current?.focus(); }, [step, status]);

  const update = (field: keyof ContactPayload, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field as keyof FieldErrors]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field as keyof FieldErrors];
        return next;
      });
    }
  };

  const next = () => {
    if (step < 3 && !values[steps[step].key]) return;
    if (step === 4 && !values.country) {
      setErrors((current) => ({ ...current, country: "Please select your country." }));
      return;
    }
    setDirection("forward");
    setStep((current) => current + 1);
  };

  const back = () => {
    if (step === 0) return;
    setDirection("back");
    setStep((current) => current - 1);
  };

  async function submit() {
    if (status === "submitting") return;
    const found = validateContact(values);
    if (hasErrors(found)) { setErrors(found); return; }

    setStatus("submitting");
    setServerMessage("");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const data = (await response.json().catch(() => ({}))) as { ok?: boolean; configured?: boolean; message?: string; errors?: FieldErrors };
      if (response.status === 422 && data.errors) { setErrors(data.errors); setStatus("idle"); return; }
      if (response.ok && data.ok) { setStatus("success"); return; }
      if (response.status === 503 || data.configured === false) { setStatus("notConfigured"); setServerMessage(data.message ?? ""); return; }
      setStatus("error");
      setServerMessage(data.message ?? "");
    } catch {
      setStatus("error");
      setServerMessage("Network error. Please try again.");
    }
  }

  if (status === "success") return <SuccessScreen />;
  if (status === "notConfigured") return <StatusScreen heading="Delivery isn't connected yet." message={serverMessage || "This form is ready, but email delivery still needs to be configured before enquiries can be sent."} action="Back to contact details" onAction={() => setStatus("idle")} />;

  const activeStep = steps[step];
  const progress = ((step + 1) / 6) * 100;

  return (
    <div className="mx-auto w-full max-w-4xl" aria-live="polite">
      <div className="mb-9 flex items-center justify-between gap-5">
        <SpinningLogo />
        <div className="w-full max-w-[17rem]">
          <p className="mb-2 text-right text-caption text-muted">Step {step + 1} of 6</p>
          <div className="h-1 overflow-hidden rounded-full bg-hairline" role="progressbar" aria-label="Enquiry progress" aria-valuemin={1} aria-valuemax={6} aria-valuenow={step + 1}>
            <div className="h-full rounded-full bg-[#E66B4B] transition-[width] duration-500 [transition-timing-function:var(--ease-signature)]" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div key={`${step}-${direction}-${status}`} className={direction === "forward" ? "contact-step-in" : "contact-step-in contact-step-in--back"}>
        {step < 3 && activeStep ? (
          <ChoiceStep headingRef={headingRef} heading={activeStep.heading} description={activeStep.description} options={activeStep.options} selected={values[activeStep.key]} onSelect={(value) => update(activeStep.key, value)} onBack={step > 0 ? back : undefined} onContinue={next} />
        ) : step === 3 ? (
          <DetailsStep headingRef={headingRef} value={values.projectDetails} onChange={(value) => update("projectDetails", value)} onBack={back} onContinue={next} />
        ) : step === 4 ? (
          <RegionStep headingRef={headingRef} values={values} error={errors.country} onChange={update} onBack={back} onContinue={next} />
        ) : (
          <ContactDetailsStep headingRef={headingRef} values={values} errors={errors} status={status} serverMessage={serverMessage} onChange={update} onBack={back} onSubmit={submit} />
        )}
      </div>
    </div>
  );
}

function ChoiceStep({ headingRef, heading, description, options, selected, onSelect, onBack, onContinue }: { headingRef: React.RefObject<HTMLHeadingElement | null>; heading: string; description: string; options: readonly string[]; selected: string; onSelect: (value: string) => void; onBack?: () => void; onContinue: () => void }) {
  return <StepFrame headingRef={headingRef} heading={heading} description={description} onBack={onBack}>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {options.map((option) => {
        const isSelected = selected === option;
        return <button key={option} type="button" aria-pressed={isSelected} onClick={() => onSelect(option)} className={`min-h-16 rounded-md border px-5 py-4 text-left text-[0.975rem] font-semibold transition-all duration-200 active:translate-y-px ${isSelected ? "border-[#171827] bg-[#171827] text-white" : "border-hairline bg-white text-ink hover:border-[#E66B4B] hover:bg-[#F7F5F0]"}`}>{option}</button>;
      })}
    </div>
    <StepActions onBack={onBack} onContinue={onContinue} disabled={!selected} />
  </StepFrame>;
}

function DetailsStep({ headingRef, value, onChange, onBack, onContinue }: { headingRef: React.RefObject<HTMLHeadingElement | null>; value: string; onChange: (value: string) => void; onBack: () => void; onContinue: () => void }) {
  return <StepFrame headingRef={headingRef} heading="Anything else we should know?" description="Tell us a little about your idea, goals or vision." onBack={onBack}>
    <label htmlFor="projectDetails" className="sr-only">Project details</label>
    <textarea id="projectDetails" name="projectDetails" rows={7} maxLength={4000} value={value} onChange={(event) => onChange(event.target.value)} placeholder="Tell us about your project..." className={`${INPUT} resize-y`} />
    <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
      <button type="button" onClick={onBack} className="ul-link text-[0.9rem] font-semibold text-ink">Back</button>
      <div className="flex items-center gap-5">
        <button type="button" onClick={onContinue} className="ul-link text-[0.9rem] font-semibold text-muted">Skip</button>
        <button type="button" onClick={onContinue} className="primary-button">Continue</button>
      </div>
    </div>
  </StepFrame>;
}

function RegionStep({ headingRef, values, error, onChange, onBack, onContinue }: { headingRef: React.RefObject<HTMLHeadingElement | null>; values: ContactPayload; error?: string; onChange: (field: keyof ContactPayload, value: string) => void; onBack: () => void; onContinue: () => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const selected = COUNTRIES.find((country) => country.name === values.country);
  const matches = COUNTRIES.filter((country) => country.name.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    if (!open) return;
    searchRef.current?.focus();
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [open]);

  const choose = (countryName: string) => {
    onChange("country", countryName);
    setQuery("");
    setOpen(false);
  };

  return <StepFrame headingRef={headingRef} heading="Where are you joining us from?" description="We'd love to know where you're based." onBack={onBack}>
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div ref={dropdownRef}>
        <label id="country-label" className="mb-1.5 block text-[0.85rem] font-medium text-ink">Country <span style={{ color: ERROR_COLOR }}>*</span></label>
        <div className="relative">
          <button
            type="button"
            aria-labelledby="country-label"
            aria-haspopup="listbox"
            aria-expanded={open}
            aria-describedby={error ? "country-error" : undefined}
            onClick={() => setOpen((current) => !current)}
            onKeyDown={(event) => {
              if (event.key === "Escape") setOpen(false);
            }}
            className={`${INPUT} flex min-h-[3.1rem] items-center justify-between gap-3 text-left ${selected ? "text-ink" : "text-muted/70"}`}
          >
            <span className="flex min-w-0 items-center gap-2.5">
              {selected ? <span aria-hidden="true" className="text-[1.15rem] leading-none">{selected.flag}</span> : null}
              <span className="truncate">{selected?.name ?? "Select your country"}</span>
            </span>
            <span aria-hidden="true" className={`h-2 w-2 shrink-0 border-b border-r border-muted transition-transform duration-200 ${open ? "rotate-[225deg] translate-y-0.5" : "rotate-45 -translate-y-0.5"}`} />
          </button>
          {open ? (
            <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-md border border-hairline bg-white">
              <div className="border-b border-hairline p-2">
                <label htmlFor="country-search" className="sr-only">Search countries</label>
                <input
                  ref={searchRef}
                  id="country-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Escape") setOpen(false);
                    if (event.key === "Enter" && matches[0]) {
                      event.preventDefault();
                      choose(matches[0].name);
                    }
                  }}
                  placeholder="Search countries..."
                  className={INPUT}
                  autoComplete="off"
                />
              </div>
              <div role="listbox" aria-labelledby="country-label" className="max-h-64 overflow-y-auto p-1.5">
                {matches.length ? matches.map((country) => (
                  <button
                    key={country.code}
                    type="button"
                    role="option"
                    aria-selected={values.country === country.name}
                    onClick={() => choose(country.name)}
                    className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-[0.975rem] transition-colors duration-150 ${values.country === country.name ? "bg-[#171827] text-white" : "text-ink hover:bg-[#F7F5F0]"}`}
                  >
                    <span aria-hidden="true" className="text-[1.15rem] leading-none">{country.flag}</span>
                    <span>{country.name}</span>
                  </button>
                )) : <p className="px-3 py-4 text-[0.9rem] text-muted">No countries found.</p>}
              </div>
            </div>
          ) : null}
        </div>
        {error && <p id="country-error" role="alert" className="mt-1.5 text-[0.8rem]" style={{ color: ERROR_COLOR }}>{error}</p>}
      </div>
      <div>
        <label htmlFor="city" className="mb-1.5 block text-[0.85rem] font-medium text-ink">City <span className="text-muted">(optional)</span></label>
        <input id="city" name="city" value={values.city} onChange={(event) => onChange("city", event.target.value)} placeholder="Your city (optional)" className={INPUT} autoComplete="address-level2" />
      </div>
    </div>
    <StepActions onBack={onBack} onContinue={onContinue} disabled={!values.country} />
  </StepFrame>;
}

function ContactDetailsStep({ headingRef, values, errors, status, serverMessage, onChange, onBack, onSubmit }: { headingRef: React.RefObject<HTMLHeadingElement | null>; values: ContactPayload; errors: FieldErrors; status: Status; serverMessage: string; onChange: (field: keyof ContactPayload, value: string) => void; onBack: () => void; onSubmit: () => void }) {
  const submitting = status === "submitting";
  return <StepFrame headingRef={headingRef} heading="Where should we text you?" description="Just a few details so we can get back to you." onBack={onBack}>
    <div aria-hidden="true" className="sr-hp"><label htmlFor="company">Company (leave this field empty)</label><input id="company" name="company" tabIndex={-1} autoComplete="off" value={values.company} onChange={(event) => onChange("company", event.target.value)} /></div>
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <InputField label="Your name" name="name" value={values.name} error={errors.name} autoComplete="name" disabled={submitting} onChange={(value) => onChange("name", value)} />
      <InputField label="Work email" name="email" type="email" value={values.email} error={errors.email} autoComplete="email" disabled={submitting} onChange={(value) => onChange("email", value)} />
    </div>
    <div className="mt-5 max-w-none sm:max-w-[calc(50%-0.625rem)]"><InputField label="WhatsApp number" name="whatsapp" type="tel" value={values.whatsapp} error={errors.whatsapp} autoComplete="tel" disabled={submitting} optional onChange={(value) => onChange("whatsapp", value)} /></div>
    {status === "error" && <p role="alert" className="mt-5 text-[0.9rem]" style={{ color: ERROR_COLOR }}>Something went wrong{serverMessage ? `: ${serverMessage}` : ". Please try again."}</p>}
    <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
      <button type="button" onClick={onBack} disabled={submitting} className="ul-link text-[0.9rem] font-semibold text-ink disabled:opacity-50">Back</button>
      <button type="button" onClick={onSubmit} disabled={submitting} aria-busy={submitting} className="primary-button">{submitting ? "Sending..." : "Send project enquiry"}</button>
    </div>
  </StepFrame>;
}

function StepFrame({ headingRef, heading, description, onBack, children }: { headingRef: React.RefObject<HTMLHeadingElement | null>; heading: string; description: string; onBack?: () => void; children: React.ReactNode }) {
  return <section aria-label={heading} data-has-back={onBack ? "true" : undefined} className="min-h-[28rem]">
    <CornerLabel>Start a project</CornerLabel>
    <h2 ref={headingRef} tabIndex={-1} className="font-display mt-5 text-[length:var(--text-title)] font-semibold leading-[1.06] tracking-[-0.02em] text-ink focus:outline-none">{heading}</h2>
    <p className="mt-4 max-w-[46ch] text-[length:var(--text-body-lg)] text-muted">{description}</p>
    <div className="mt-8">{children}</div>
  </section>;
}

function StepActions({ onBack, onContinue, disabled }: { onBack?: () => void; onContinue: () => void; disabled: boolean }) {
  return <div className="mt-7 flex items-center justify-between gap-4">
    {onBack ? <button type="button" onClick={onBack} className="ul-link text-[0.9rem] font-semibold text-ink">Back</button> : <span />}
    <button type="button" onClick={onContinue} disabled={disabled} className="primary-button">Continue</button>
  </div>;
}

function InputField({ label, name, value, error, optional = false, onChange, ...rest }: { label: string; name: "name" | "email" | "whatsapp"; value: string; error?: string; optional?: boolean; onChange: (value: string) => void } & Omit<React.InputHTMLAttributes<HTMLInputElement>, "name" | "value" | "onChange">) {
  return <div>
    <label htmlFor={name} className="mb-1.5 block text-[0.85rem] font-medium text-ink">{label} {optional ? <span className="text-muted">(optional)</span> : <span style={{ color: ERROR_COLOR }}>*</span>}</label>
    <input id={name} name={name} value={value} onChange={(event) => onChange(event.target.value)} aria-invalid={error ? "true" : undefined} aria-describedby={error ? `${name}-error` : undefined} className={INPUT} {...rest} />
    {error && <p id={`${name}-error`} role="alert" className="mt-1.5 text-[0.8rem]" style={{ color: ERROR_COLOR }}>{error}</p>}
  </div>;
}

function StatusScreen({ heading, message, action, onAction }: { heading: string; message: string; action: string; onAction: () => void }) {
  return <div className="mx-auto max-w-2xl py-8"><CornerLabel>Start a project</CornerLabel><h2 className="font-display mt-5 text-[length:var(--text-title)] font-semibold leading-[1.06] tracking-[-0.02em] text-ink">{heading}</h2><p className="mt-4 max-w-[52ch] text-[length:var(--text-body-lg)] text-muted">{message}</p><button type="button" onClick={onAction} className="primary-button mt-8">{action}</button></div>;
}

function SuccessScreen() {
  return <div className="mx-auto max-w-2xl py-8 text-center"><div className="contact-checkmark mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#171827] text-3xl font-semibold text-white" aria-hidden="true">✓</div><h2 className="font-display mt-7 text-[length:var(--text-title)] font-semibold leading-[1.06] tracking-[-0.02em] text-ink">You&apos;re all set.</h2><p className="mx-auto mt-4 max-w-[48ch] text-[length:var(--text-body-lg)] text-muted">Your project details are in. We&apos;ll review your enquiry and get back to you soon.</p><Link href="/" className="primary-button mt-8">Back to homepage</Link></div>;
}
