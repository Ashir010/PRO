import { site } from "@/data/services";

export function TeamsIntro() {
  return (
    <div className="shell max-w-[52rem] pb-10">
      <h2 className="font-display text-[length:var(--text-h2)] font-medium leading-[1.08] tracking-[-0.015em] text-ink">
        {site.teamsIntro.heading}
      </h2>
      <p className="mt-5 text-[length:var(--text-body-lg)] text-muted">
        {site.teamsIntro.support}
      </p>
    </div>
  );
}
