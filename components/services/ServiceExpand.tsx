"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import { services, type Service } from "@/data/services";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { ServiceDetailContent } from "@/components/services/ServiceDetailContent";

/* ---- Tunables -------------------------------------------------------------
   DURATION    : open/close animation length (seconds)
   EASE        : easing for open/close
   CLOSE_PX    : scroll distance (px) past the bottom that maps to a full close
   CLOSE_COMMIT: fraction of CLOSE_PX after which the close finishes on its own
--------------------------------------------------------------------------- */
const DURATION = 0.7;
const EASE = [0.65, 0, 0.35, 1] as const;
const CLOSE_PX = 420;
const CLOSE_COMMIT = 0.35;

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
  const progress = useMotionValue(0); // 0 = card, 1 = full screen
  const scrollRef = useRef<HTMLDivElement>(null);
  const closing = useRef(false);

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
  const radius = useTransform(progress, [0, 1], [noFlip ? 26 : 26, 0]);
  const bgOpacity = useTransform(progress, [0, 0.2, 1], noFlip ? [0, 1, 1] : [1, 1, 1]);
  const backdropOpacity = useTransform(progress, [0, 1], [0, 0.55]);
  const contentOpacity = useTransform(progress, [0.45, 1], [0, 1]);
  const contentY = useTransform(progress, [0.45, 1], [34, 0]);
  const contentScale = useTransform(progress, [0.45, 1], [0.985, 1]);

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
      animate(progress, 0, tween).then(onClosed);
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

  // Scroll-to-close: at the bottom, extra downward scroll shrinks the page.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let accum = 0;
    let resetTimer: ReturnType<typeof setTimeout>;
    const atBottom = () => el.scrollTop + el.clientHeight >= el.scrollHeight - 2;
    const apply = () => {
      const f = Math.min(1, accum / CLOSE_PX);
      progress.set(1 - f * (reduced ? 1 : 1));
      if (f >= CLOSE_COMMIT) beginClose();
    };
    const springBack = () => {
      if (closing.current) return;
      accum = 0;
      animate(progress, 1, { duration: 0.3, ease: [0.22, 1, 0.36, 1] });
    };
    const onWheel = (e: WheelEvent) => {
      if (closing.current) return;
      if (e.deltaY > 0 && atBottom()) {
        accum += e.deltaY;
        e.preventDefault();
        apply();
        clearTimeout(resetTimer);
        resetTimer = setTimeout(springBack, 150);
      } else if (e.deltaY < 0 && accum > 0) {
        accum = Math.max(0, accum + e.deltaY);
        apply();
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
        accum = dy;
        apply();
      }
    };
    const onTouchEnd = () => springBack();
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
  }, [beginClose, progress, reduced]);

  return (
    <div className="fixed inset-0 z-[100]">
      <motion.div
        aria-hidden="true"
        onClick={() => beginClose()}
        className="absolute inset-0 bg-black backdrop-blur-[3px]"
        style={{ opacity: backdropOpacity }}
      />

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
        className="absolute inset-0"
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
    </div>
  );
}
