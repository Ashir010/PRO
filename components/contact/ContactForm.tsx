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

type FlowStep = "service" | "visualization" | "videoType" | "references" | "saasPlatform" | "saasVideoType" | "saasAssets" | "projectSize" | "budget" | "projectDetails" | "region" | "contact";

const baseSteps: FlowStep[] = ["service", "projectSize", "budget", "projectDetails", "region", "contact"];
const visualizationSteps: FlowStep[] = ["service", "visualization", "videoType", "references", "projectSize", "budget", "projectDetails", "region", "contact"];
const saasSteps: FlowStep[] = ["service", "saasPlatform", "saasVideoType", "saasAssets", "projectSize", "budget", "projectDetails", "region", "contact"];

const empty: ContactPayload = {
  service: "",
  projectSize: "",
  budget: "",
  projectDetails: "",
  country: "",
  city: "",
  visualizationType: "",
  visualizationOther: "",
  videoType: "",
  videoTypeOther: "",
  referenceMaterials: [],
  additionalServices: [],
  saasPlatformType: "",
  saasPlatformOther: "",
  saasVideoType: "",
  saasAssets: [],
  name: "",
  email: "",
  whatsapp: "",
  company: "",
};

export function ContactForm() {
  const [values, setValues] = useState<ContactPayload>(empty);
  const [selectedService, setSelectedService] = useState("");
  const [addingService, setAddingService] = useState(false);
  const [step, setStep] = useState<FlowStep>("service");
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => { headingRef.current?.focus(); }, [step, status]);

  const update = (field: keyof ContactPayload, value: string) => {
    if (field === "service") setSelectedService(value);
    setValues((current) => {
      if (field === "service" && addingService) {
        if (value === "3D Videos") return current;
        const additionalServices = current.additionalServices.includes(value)
          ? current.additionalServices
          : [...current.additionalServices, value];
        return { ...current, additionalServices };
      }
      if (field === "service") {
        return {
          ...current,
          service: value,
          visualizationType: "",
          visualizationOther: "",
          videoType: "",
          videoTypeOther: "",
          referenceMaterials: [],
          saasPlatformType: "",
          saasPlatformOther: "",
          saasVideoType: "",
          saasAssets: [],
        };
      }
      if (field === "visualizationType" && value !== "Other") {
        return { ...current, visualizationType: value, visualizationOther: "" };
      }
      if (field === "videoType" && value !== "Other") {
        return { ...current, videoType: value, videoTypeOther: "" };
      }
      if (field === "saasPlatformType" && value !== "Other") {
        return { ...current, saasPlatformType: value, saasPlatformOther: "" };
      }
      return { ...current, [field]: value };
    });
    if (errors[field as keyof FieldErrors]) {
      setErrors((current) => {
        const next = { ...current };
        delete next[field as keyof FieldErrors];
        return next;
      });
    }
  };

  const flowSteps = selectedService === "3D Videos"
    ? visualizationSteps
    : selectedService === "SaaS & Motion Graphics"
      ? saasSteps
      : baseSteps;
  const stepIndex = flowSteps.indexOf(step);

  const next = () => {
    if (step === "service") {
      if (!selectedService) return;
      setDirection("forward");
      if (addingService) {
        setAddingService(false);
        setStep("projectSize");
        return;
      }
      setStep(
        selectedService === "3D Videos"
          ? "visualization"
          : selectedService === "SaaS & Motion Graphics"
            ? "saasPlatform"
            : "projectSize",
      );
      return;
    }
    if (step === "projectSize" && !values.projectSize) return;
    if (step === "budget" && !values.budget) return;
    if (step === "visualization") {
      if (!values.visualizationType) return;
      if (values.visualizationType === "Other" && !values.visualizationOther.trim()) return;
    }
    if (step === "videoType") {
      if (!values.videoType) return;
      if (values.videoType === "Other" && !values.videoTypeOther.trim()) return;
    }
    if (step === "references" && values.referenceMaterials.length === 0) return;
    if (step === "saasPlatform") {
      if (!values.saasPlatformType) return;
      if (values.saasPlatformType === "Other" && !values.saasPlatformOther.trim()) return;
    }
    if (step === "saasVideoType" && !values.saasVideoType) return;
    if (step === "saasAssets" && values.saasAssets.length === 0) return;
    if (step === "region" && !values.country) {
      setErrors((current) => ({ ...current, country: "Please select your country." }));
      return;
    }
    if (stepIndex >= 0 && stepIndex < flowSteps.length - 1) {
      setDirection("forward");
      setStep(flowSteps[stepIndex + 1]);
    }
  };

  const back = () => {
    if (step === "service" && addingService) {
      setDirection("back");
      setAddingService(false);
      setSelectedService("3D Videos");
      setStep("references");
      return;
    }
    if (stepIndex > 0) {
      setDirection("back");
      setStep(flowSteps[stepIndex - 1]);
    }
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

  const progress = ((stepIndex + 1) / flowSteps.length) * 100;

  return (
    <div className="mx-auto w-full max-w-4xl" aria-live="polite">
      <div className="mb-9 flex items-center justify-between gap-5">
        <SpinningLogo />
        <div className="w-full max-w-[17rem]">
          <p className="mb-2 text-right text-caption text-muted">Step {stepIndex + 1} of {flowSteps.length}</p>
          <div className="h-1 overflow-hidden rounded-full bg-hairline" role="progressbar" aria-label="Enquiry progress" aria-valuemin={1} aria-valuemax={flowSteps.length} aria-valuenow={stepIndex + 1}>
            <div className="h-full rounded-full bg-[#E66B4B] transition-[width] duration-500 [transition-timing-function:var(--ease-signature)]" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div key={`${step}-${direction}-${status}`} className={direction === "forward" ? "contact-step-in" : "contact-step-in contact-step-in--back"}>
        {step === "service" ? (
          <ChoiceStep headingRef={headingRef} heading={steps[0].heading} description={steps[0].description} options={steps[0].options} selected={addingService ? selectedService : values.service} onSelect={(value) => update("service", value)} onBack={addingService ? back : undefined} onContinue={next} />
        ) : step === "visualization" ? (
          <VisualizationStep headingRef={headingRef} values={values} onChange={update} onBack={back} onContinue={next} />
        ) : step === "videoType" ? (
          <VideoTypeStep headingRef={headingRef} values={values} onChange={update} onBack={back} onContinue={next} />
        ) : step === "references" ? (
          <ReferenceMaterialsStep headingRef={headingRef} values={values} onToggle={(material) => setValues((current) => ({
            ...current,
            referenceMaterials: current.referenceMaterials.includes(material)
              ? current.referenceMaterials.filter((item) => item !== material)
              : [...current.referenceMaterials, material],
          }))} onBack={back} onContinue={() => {
            setDirection("forward");
            setStep("region");
          }} onAddService={() => {
            setDirection("back");
            setAddingService(true);
            setSelectedService("");
            setStep("service");
          }} />
        ) : step === "saasPlatform" ? (
          <SaasPlatformStep headingRef={headingRef} values={values} onChange={update} onBack={back} onContinue={next} />
        ) : step === "saasVideoType" ? (
          <SaasVideoTypeStep headingRef={headingRef} values={values} onChange={update} onBack={back} onContinue={next} />
        ) : step === "saasAssets" ? (
          <SaasAssetsStep headingRef={headingRef} values={values} onToggle={(asset) => setValues((current) => {
            if (asset === "Nothing yet") {
              return {
                ...current,
                saasAssets: current.saasAssets.includes("Nothing yet") ? [] : ["Nothing yet"],
              };
            }
            const withoutNothing = current.saasAssets.filter((item) => item !== "Nothing yet");
            return {
              ...current,
              saasAssets: withoutNothing.includes(asset)
                ? withoutNothing.filter((item) => item !== asset)
                : [...withoutNothing, asset],
            };
          })} onBack={back} onContinue={next} />
        ) : step === "projectSize" ? (
          <ChoiceStep headingRef={headingRef} heading={steps[1].heading} description={steps[1].description} options={steps[1].options} selected={values.projectSize} onSelect={(value) => update("projectSize", value)} onBack={back} onContinue={next} />
        ) : step === "budget" ? (
          <ChoiceStep headingRef={headingRef} heading={steps[2].heading} description={steps[2].description} options={steps[2].options} selected={values.budget} onSelect={(value) => update("budget", value)} onBack={back} onContinue={next} />
        ) : step === "projectDetails" ? (
          <DetailsStep headingRef={headingRef} value={values.projectDetails} onChange={(value) => update("projectDetails", value)} onBack={back} onContinue={next} />
        ) : step === "region" ? (
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

const visualizationOptions = [
  "Industrial machinery & equipment",
  "Manufacturing / production processes",
  "Products & components",
  "Factories & industrial facilities",
  "Buildings & infrastructure",
  "Automotive & mechanical systems",
  "Other",
] as const;

const videoTypeOptions = [
  "Product demonstration",
  "Technical / functional animation",
  "Exploded-view animation",
  "Manufacturing process animation",
  "Photorealistic product visualization",
  "Full-scale industrial walkthrough",
  "Other",
] as const;

const referenceOptions = [
  "CAD / 3D files",
  "Technical drawings / blueprints",
  "Product photographs",
  "Existing videos",
  "Reference links",
  "Starting from scratch",
] as const;

function VisualizationStep({ headingRef, values, onChange, onBack, onContinue }: { headingRef: React.RefObject<HTMLHeadingElement | null>; values: ContactPayload; onChange: (field: keyof ContactPayload, value: string) => void; onBack: () => void; onContinue: () => void }) {
  const valid = Boolean(values.visualizationType) && (values.visualizationType !== "Other" || Boolean(values.visualizationOther.trim()));
  return <StepFrame headingRef={headingRef} heading="What would you like us to visualize?" description="" onBack={onBack}>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {visualizationOptions.map((option) => {
        const selected = values.visualizationType === option;
        return <button key={option} type="button" aria-pressed={selected} onClick={() => onChange("visualizationType", option)} className={`min-h-16 rounded-md border px-5 py-4 text-left text-[0.975rem] font-semibold transition-all duration-200 active:translate-y-px ${selected ? "border-[#171827] bg-[#171827] text-white" : "border-hairline bg-white text-ink hover:border-[#E66B4B] hover:bg-[#F7F5F0]"}`}>{option}</button>;
      })}
    </div>
    {values.visualizationType === "Other" ? (
      <div className="mt-5">
        <label htmlFor="visualizationOther" className="sr-only">Other visualization</label>
        <input id="visualizationOther" name="visualizationOther" value={values.visualizationOther} onChange={(event) => onChange("visualizationOther", event.target.value)} placeholder="Tell us what you'd like to visualize..." className={INPUT} />
      </div>
    ) : null}
    <StepActions onBack={onBack} onContinue={onContinue} disabled={!valid} />
  </StepFrame>;
}

function VideoTypeStep({ headingRef, values, onChange, onBack, onContinue }: { headingRef: React.RefObject<HTMLHeadingElement | null>; values: ContactPayload; onChange: (field: keyof ContactPayload, value: string) => void; onBack: () => void; onContinue: () => void }) {
  const valid = Boolean(values.videoType) && (values.videoType !== "Other" || Boolean(values.videoTypeOther.trim()));
  return <StepFrame headingRef={headingRef} heading="What type of 3D video are you looking for?" description="" onBack={onBack}>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {videoTypeOptions.map((option) => {
        const selected = values.videoType === option;
        return <button key={option} type="button" aria-pressed={selected} onClick={() => onChange("videoType", option)} className={`min-h-16 rounded-md border px-5 py-4 text-left text-[0.975rem] font-semibold transition-all duration-200 active:translate-y-px ${selected ? "border-[#171827] bg-[#171827] text-white" : "border-hairline bg-white text-ink hover:border-[#E66B4B] hover:bg-[#F7F5F0]"}`}>{option}</button>;
      })}
    </div>
    {values.videoType === "Other" ? (
      <div className="mt-5">
        <label htmlFor="videoTypeOther" className="sr-only">Other 3D video type</label>
        <input id="videoTypeOther" name="videoTypeOther" value={values.videoTypeOther} onChange={(event) => onChange("videoTypeOther", event.target.value)} placeholder="Describe the type of 3D video you need..." className={INPUT} />
      </div>
    ) : null}
    <StepActions onBack={onBack} onContinue={onContinue} disabled={!valid} />
  </StepFrame>;
}

function ReferenceMaterialsStep({ headingRef, values, onToggle, onBack, onContinue, onAddService }: { headingRef: React.RefObject<HTMLHeadingElement | null>; values: ContactPayload; onToggle: (material: string) => void; onBack: () => void; onContinue: () => void; onAddService: () => void }) {
  return <StepFrame headingRef={headingRef} heading="What reference materials can you provide?" description="" onBack={onBack}>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {referenceOptions.map((option) => {
        const selected = values.referenceMaterials.includes(option);
        return <button key={option} type="button" aria-pressed={selected} onClick={() => onToggle(option)} className={`min-h-16 rounded-md border px-5 py-4 text-left text-[0.975rem] font-semibold transition-all duration-200 active:translate-y-px ${selected ? "border-[#171827] bg-[#171827] text-white" : "border-hairline bg-white text-ink hover:border-[#E66B4B] hover:bg-[#F7F5F0]"}`}>{option}</button>;
      })}
    </div>
    <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
      <button type="button" onClick={onBack} className="ul-link text-[0.9rem] font-semibold text-ink">Back</button>
      <div className="flex items-center gap-5">
        <button type="button" onClick={onAddService} className="ul-link text-[0.9rem] font-semibold text-ink">Add another service</button>
        <button type="button" onClick={onContinue} disabled={values.referenceMaterials.length === 0} className="primary-button">Continue</button>
      </div>
    </div>
  </StepFrame>;
}

const saasPlatformOptions = [
  "SaaS platform",
  "Mobile application",
  "Website",
  "Technology product",
  "Software dashboard",
  "Other",
] as const;

const saasVideoOptions = [
  "SaaS product explainer",
  "UI / UX animation",
  "Product walkthrough",
  "Feature demonstration",
  "Motion graphics advertisement",
  "Logo animation",
] as const;

const saasAssetOptions = [
  "Product screenshots / screen recordings",
  "Figma designs",
  "Brand guidelines",
  "Script / storyboard",
  "Existing video references",
  "Nothing yet",
] as const;

function SaasPlatformStep({ headingRef, values, onChange, onBack, onContinue }: { headingRef: React.RefObject<HTMLHeadingElement | null>; values: ContactPayload; onChange: (field: keyof ContactPayload, value: string) => void; onBack: () => void; onContinue: () => void }) {
  const valid = Boolean(values.saasPlatformType) && (values.saasPlatformType !== "Other" || Boolean(values.saasPlatformOther.trim()));
  return <StepFrame headingRef={headingRef} heading="What are we creating animations for?" description="" onBack={onBack}>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {saasPlatformOptions.map((option) => {
        const selected = values.saasPlatformType === option;
        return <button key={option} type="button" aria-pressed={selected} onClick={() => onChange("saasPlatformType", option)} className={`min-h-16 rounded-md border px-5 py-4 text-left text-[0.975rem] font-semibold transition-all duration-200 active:translate-y-px ${selected ? "border-[#171827] bg-[#171827] text-white" : "border-hairline bg-white text-ink hover:border-[#E66B4B] hover:bg-[#F7F5F0]"}`}>{option}</button>;
      })}
    </div>
    {values.saasPlatformType === "Other" ? (
      <div className="mt-5">
        <label htmlFor="saasPlatformOther" className="sr-only">Other SaaS platform</label>
        <input id="saasPlatformOther" name="saasPlatformOther" value={values.saasPlatformOther} onChange={(event) => onChange("saasPlatformOther", event.target.value)} placeholder="Tell us what we're creating animations for..." className={INPUT} />
      </div>
    ) : null}
    <StepActions onBack={onBack} onContinue={onContinue} disabled={!valid} />
  </StepFrame>;
}

function SaasVideoTypeStep({ headingRef, values, onChange, onBack, onContinue }: { headingRef: React.RefObject<HTMLHeadingElement | null>; values: ContactPayload; onChange: (field: keyof ContactPayload, value: string) => void; onBack: () => void; onContinue: () => void }) {
  return <StepFrame headingRef={headingRef} heading="What type of video do you need?" description="" onBack={onBack}>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {saasVideoOptions.map((option) => {
        const selected = values.saasVideoType === option;
        return <button key={option} type="button" aria-pressed={selected} onClick={() => onChange("saasVideoType", option)} className={`min-h-16 rounded-md border px-5 py-4 text-left text-[0.975rem] font-semibold transition-all duration-200 active:translate-y-px ${selected ? "border-[#171827] bg-[#171827] text-white" : "border-hairline bg-white text-ink hover:border-[#E66B4B] hover:bg-[#F7F5F0]"}`}>{option}</button>;
      })}
    </div>
    <StepActions onBack={onBack} onContinue={onContinue} disabled={!values.saasVideoType} />
  </StepFrame>;
}

function SaasAssetsStep({ headingRef, values, onToggle, onBack, onContinue }: { headingRef: React.RefObject<HTMLHeadingElement | null>; values: ContactPayload; onToggle: (asset: string) => void; onBack: () => void; onContinue: () => void }) {
  return <StepFrame headingRef={headingRef} heading="What assets do you currently have?" description="" onBack={onBack}>
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {saasAssetOptions.map((option) => {
        const selected = values.saasAssets.includes(option);
        return <button key={option} type="button" aria-pressed={selected} onClick={() => onToggle(option)} className={`min-h-16 rounded-md border px-5 py-4 text-left text-[0.975rem] font-semibold transition-all duration-200 active:translate-y-px ${selected ? "border-[#171827] bg-[#171827] text-white" : "border-hairline bg-white text-ink hover:border-[#E66B4B] hover:bg-[#F7F5F0]"}`}>{option}</button>;
      })}
    </div>
    <StepActions onBack={onBack} onContinue={onContinue} disabled={values.saasAssets.length === 0} />
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
    {description ? <p className="mt-4 max-w-[46ch] text-[length:var(--text-body-lg)] text-muted">{description}</p> : null}
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
