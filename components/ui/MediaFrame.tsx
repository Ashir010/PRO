import type { MediaSlot, MotifKind } from "@/data/services";
import { ServicePlaceholder } from "@/components/media/ServicePlaceholder";

/**
 * Fixed aspect-ratio media frame. Today it renders an intentional placeholder
 * composition; to use real media, replace the <ServicePlaceholder> with
 * <Image src={slot.path + ".webp"} fill ... /> (next/image) — the aspect box
 * already prevents layout shift. See README → "Replacing placeholder assets".
 */
export function MediaFrame({
  slot,
  motif,
  index = 0,
}: {
  slot: MediaSlot;
  motif: MotifKind;
  index?: number;
}) {
  return (
    <figure className="m-0">
      <div
        className="relative overflow-hidden rounded-lg border"
        style={{
          aspectRatio: slot.aspect,
          background:
            "color-mix(in srgb, var(--accent) 6%, var(--color-surface))",
          borderColor: "color-mix(in srgb, var(--accent) 18%, var(--color-hairline))",
        }}
      >
        {/* descriptive alt lives on the labelled region for assistive tech */}
        <div
          role="img"
          aria-label={slot.alt}
          className="absolute inset-0 flex items-center justify-center p-[12%]"
        >
          <ServicePlaceholder motif={motif} index={index} />
        </div>
        <span className="eyebrow absolute left-3 top-3 text-[0.625rem] text-muted/80">
          Placeholder
        </span>
      </div>
      <figcaption className="mt-2 text-caption text-muted">
        {slot.caption}
      </figcaption>
    </figure>
  );
}
