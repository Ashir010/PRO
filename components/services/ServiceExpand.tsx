"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
} from "motion/react";
import { services, type Service } from "@/data/services";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { ServiceDetailContent } from "@/components/services/ServiceDetailContent";

/* ---- Tunables -------------------------------------------------------------
   DURATION    : open/close animation length (seconds)
   EASE        : easing for open/close
   CLOSE_PX    : overscroll distance (px) that maps to the view fully slid away
   CLOSE_COMMIT: pull fraction needed on release to finish the dismiss (else it
                 slides back into place) — drag-to-dismiss, not an instant snap
--------------------------------------------------------------------------- */
const DURATION = 0.56;
// easeOutExpo-style: responds instantly, then glides to rest (no sluggish start)
const EASE = [0.16, 1, 0.3, 1] as const;
const CLOSE_PX = 360; // overscroll px that fully slides the view away
const CLOSE_COMMIT = 0.4; // release past this finishes; below slides back

const CARD_BG = "linear-gradient(155deg,#FFFFFF 0%,#FBF3EC 52%,#F3E6DB 100%)";

type Rect = { top: number; left: number; width: number; height: number };

type ExpandApi = { open: (slug: string, rect: Rect | null) => void };
const Ctx = createContext<ExpandApi | null>(null);

export function useServiceExpand(): ExpandApi {
  const c = useContext(Ctx);
  if (!c)
    throw new Error("useServiceExpand must be used within <ServiceExpandProvider>");
  return c;
}

export function ServiceExpandProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [slug, setSlug] = useState<string | null>(null);
  const [rect, setRect] = useState<Rect | null>(null);
  const openGuard = useRef(false);

  const open = useCallback(
    (s: string, r: Rect | null) => {
      if (slug || openGuard.current) return; // ignore double-clicks / while open
      if (!services.some((x) => x.slug === s)) return;
      openGuard.current = true;
      setRect(r);
      setSlug(s);
      history.pushState({ expand: s }, "", `#view-${s}`);
    },
    [slug],
  );

  // open directly / via forward navigation when the URL already carries the hash
  useEffect(() => {
    const syncFromHash = () => {
      const h = location.hash;
      if (h.startsWith("#view-")) {
        const s = h.slice(6);
        if (!slug && services.some((x) => x.slug === s)) {
          setRect(null);
          setSlug(s);
        }
      }
    };
    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [slug]);

  const service: Service | null = slug
    ? services.find((s) => s.slug === slug) ?? null
    : null;

  const handleClosed = useCallback(() => {
    setSlug(null);
    setRect(null);
    openGuard.current = false;
  }, []);

  return (
    <Ctx.Provider value={{ open }}>
      {children}
      {service && (
        <ExpandOverlay
          key={service.slug}
          service={service}
          rect={rect}
          onClosed={handleClosed}
        />
      )}
    </Ctx.Provider>
  );
}

function ExpandOverlay({
  service,
  rect,
  onClosed,
}: {
  service: Service;
  rect: Rect | null;
  onClosed: () => void;
}) {
  const reduced = usePrefersReducedMotion();
  // Single motion value drives every transform directly (0 = card, 1 = full
  // screen). The open/close tween and the scroll gesture both write to it, so
  // there's no second spring lagging behind — the motion tracks intent exactly.
  const progress = useMotionValue(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closing = useRef(false);

  // Dismiss slide: 0 = in place, 1 = slid fully off the bottom and faded out.
  const exit = useMotionValue(0);
  const [vh] = useState(() =>
    typeof window !== "undefined" ? window.innerHeight : 800,
  );

  // FLIP geometry captured once at open time (ignore resize mid-animation)
  const [from] = useState(() =>
    rect
      ? {
          sx: rect.width / Math.max(1, window.innerWidth),
          sy: rect.height / Math.max(1, window.innerHeight),
          x: rect.left,
          y: rect.top,
        }
      : { sx: 1, sy: 1, x: 0, y: 0 },
  );

  // Animate the grow even under reduced motion (explicitly requested); only a
  // direct deep-link (no source card) skips the FLIP and just fades in.
  const noFlip = !rect;

  const scaleX = useTransform(progress, [0, 1], [noFlip ? 1 : from.sx, 1]);
  const scaleY = useTransform(progress, [0, 1], [noFlip ? 1 : from.sy, 1]);
  const x = useTransform(progress, [0, 1], [noFlip ? 0 : from.x, 0]);
  const y = useTransform(progress, [0, 1], [noFlip ? 0 : from.y, 0]);
  const radius = useTransform(progress, [0, 1], [26, 0]);
  const bgOpacity = useTransform(
    progress,
    [0, 0.2, 1],
    noFlip ? [0, 1, 1] : [1, 1, 1],
  );
  // Backdrop fades in with the open, then back out as the view slides away.
  const backdropOpacity = useTransform(
    () => Math.min(1, progress.get()) * 0.5 * (1 - exit.get()),
  );
  // Dismiss: the whole view slides down and fades (no card-shrink distortion).
  const exitY = useTransform(exit, [0, 1], [0, vh]);
  const exitOpacity = useTransform(exit, [0, 0.85], [1, 0]);
  const contentOpacity = useTransform(progress, [0.4, 0.95], [0, 1]);
  const contentY = useTransform(progress, [0.4, 0.95], [28, 0]);
  const contentScale = useTransform(progress, [0.4, 0.95], [0.99, 1]);

  const tween = { duration: reduced ? 0.5 : DURATION, ease: EASE };

  // Open + scroll lock
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const controls = animate(progress, 1, tween);
    return () => {
      document.body.style.overflow = prev;
      controls.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Close: reverse animation, then unmount. `fromHistory` avoids popping twice.
  const beginClose = useCallback(
    (fromHistory = false) => {
      if (closing.current) return;
      closing.current = true;
      if (!fromHistory && location.hash.startsWith("#view-")) history.back();
      // Slide the whole view down and fade it out, then unmount. Starts from the
      // current `exit` value, so a scroll-dismiss finishes smoothly from where
      // the gesture left off.
      animate(exit, 1, { duration: 0.42, ease: [0.4, 0, 0.2, 1] }).then(onClosed);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [onClosed],
  );

  // Esc + Back button
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") beginClose();
    };
    const onPop = () => beginClose(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("popstate", onPop);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("popstate", onPop);
    };
  }, [beginClose]);

  // Scroll-to-dismiss: overscrolling past EITHER edge slides the view away —
  // pull down at the bottom, or pull up at the top.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let accum = 0;
    let resetTimer: ReturnType<typeof setTimeout>;
    const atTop = () => el.scrollTop <= 2;
    const atBottom = () => el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
    // Slide the view with the gesture. A full pull (f >= 1) finishes mid-scroll;
    // anything short waits for the gesture to settle before deciding.
    const apply = () => {
      const f = Math.min(1, accum / CLOSE_PX);
      exit.set(f);
      if (f >= 1) {
        clearTimeout(resetTimer);
        beginClose();
      }
    };
    // Gesture ended: finish the dismiss only if pulled past CLOSE_COMMIT,
    // otherwise slide the view back into place.
    const settle = () => {
      if (closing.current) return;
      const f = Math.min(1, accum / CLOSE_PX);
      if (f >= CLOSE_COMMIT) {
        beginClose();
        return;
      }
      accum = 0;
      animate(exit, 0, { duration: 0.35, ease: [0.22, 1, 0.36, 1] });
    };
    const onWheel = (e: WheelEvent) => {
      if (closing.current) return;
      const pastEdge =
        (e.deltaY > 0 && atBottom()) || (e.deltaY < 0 && atTop());
      if (pastEdge) {
        accum += Math.abs(e.deltaY);
        e.preventDefault();
        apply();
        clearTimeout(resetTimer);
        resetTimer = setTimeout(settle, 170); // settle when scrolling pauses
      } else if (accum > 0) {
        // scrolling back toward the content re-expands the view
        accum = Math.max(0, accum - Math.abs(e.deltaY));
        e.preventDefault();
        apply();
        clearTimeout(resetTimer);
        resetTimer = setTimeout(settle, 170);
      }
    };
    let startY = 0;
    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (closing.current) return;
      const dy = startY - e.touches[0].clientY; // finger up (scroll down) => positive
      if (dy > 0 && atBottom()) {
        accum = dy; // pulled up past the bottom
        apply();
      } else if (dy < 0 && atTop()) {
        accum = -dy; // pulled down past the top
        apply();
      }
    };
    const onTouchEnd = () => settle();
    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      clearTimeout(resetTimer);
    };
  }, [beginClose, exit]);

  return (
    <div className="fixed inset-0 z-[100]">
      <motion.div
        aria-hidden="true"
        onClick={() => beginClose()}
        className="absolute inset-0 bg-black"
        style={{ opacity: backdropOpacity }}
      />

      {/* Sliding group — card + content move and fade together on dismiss */}
      <motion.div
        className="absolute inset-0 will-change-[transform,opacity]"
        style={{ y: exitY, opacity: exitOpacity }}
      >
        {/* Growing card background (transform + opacity only) */}
        <motion.div
          aria-hidden="true"
          className="absolute inset-0 will-change-transform"
          style={{
            transformOrigin: "0 0",
            x,
            y,
            scaleX,
            scaleY,
            borderRadius: radius,
            opacity: bgOpacity,
            background: CARD_BG,
            boxShadow: "0 50px 140px -40px rgba(40,24,12,0.55)",
          }}
        />

        {/* Content (fades + slides + settles in) */}
        <motion.div
          className="absolute inset-0 will-change-[transform,opacity]"
          style={{ opacity: contentOpacity, y: contentY, scale: contentScale }}
        >
          <div
            ref={scrollRef}
            role="dialog"
            aria-modal="true"
            aria-label={`${service.title} details`}
            className="h-full overflow-y-auto overscroll-contain"
          >
            <div className="sticky top-0 z-10 flex justify-end px-4 pt-[calc(var(--header-h)+0.75rem)]">
              <button
                type="button"
                onClick={() => beginClose()}
                aria-label="Close"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink text-peach shadow-lg transition-opacity duration-200 hover:opacity-85"
              >
                <span aria-hidden="true" className="text-[1.1rem] leading-none">
                  ✕
                </span>
              </button>
            </div>
            <ServiceDetailContent
              service={service}
              onDiscuss={() => beginClose()}
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
