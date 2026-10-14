"use client";

import { useEffect } from "react";

/**
 * Anchor navigation for the sticky stack.
 *
 * With CSS `position: sticky`, every already-pinned panel sits at the viewport
 * top, so its `getBoundingClientRect()` reads as "in view" and native hash /
 * scrollIntoView navigation refuses to scroll to it. We instead scroll to the
 * target's *flow* position (summed `offsetTop`, which ignores sticky pinning),
 * so nav links, index cards and on-load `#hash` always land on the right panel.
 * This is the only JS the stacking needs; the animation itself is pure CSS.
 */
export function StackAnchors() {
  useEffect(() => {
    const headerH = () =>
      parseInt(
        getComputedStyle(document.documentElement).getPropertyValue("--header-h"),
        10,
      ) || 60;

    // A section's flow top. NOTE: offsetTop / getBoundingClientRect of a *sticky*
    // panel reflect its pinned position (scroll-dependent), so for the sticky
    // case we derive the target from the (stable) container: each panel occupies
    // an equal slot. On mobile the panels are static, so the rect is reliable.
    const targetTop = (el: HTMLElement) => {
      const panels = Array.from(
        document.querySelectorAll<HTMLElement>(".service-panel"),
      );
      const idx = panels.indexOf(el);
      const stack = document.getElementById("services");
      if (idx !== -1 && stack && getComputedStyle(el).position === "sticky") {
        const stackTop = stack.getBoundingClientRect().top + window.scrollY;
        const slot = stack.offsetHeight / panels.length;
        return stackTop + idx * slot;
      }
      return el.getBoundingClientRect().top + window.scrollY;
    };

    // Instant jump: the stack spans many viewports, so a smooth animation would
    // be a long, sluggish crawl. A direct jump to the panel's docked position is
    // the expected "go to section" behaviour.
    const scrollToId = (id: string) => {
      const el = document.getElementById(id);
      if (!el) return false;
      window.scrollTo({
        top: Math.max(0, targetTop(el) - headerH() - 4),
        behavior: "auto",
      });
      return true;
    };

    // Capture phase so we run BEFORE Next.js <Link> (which otherwise intercepts
    // the hash click and scrolls to the sticky element's pinned — wrong —
    // position). stopPropagation prevents its handler from firing.
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;
      const a = (e.target as HTMLElement).closest?.('a[href^="#"]');
      const href = a?.getAttribute("href") ?? "";
      if (href.length < 2) return;
      const id = decodeURIComponent(href.slice(1));
      if (document.getElementById(id)) {
        e.preventDefault();
        e.stopPropagation();
        scrollToId(id);
        history.pushState(null, "", `#${id}`);
      }
    };

    const onHash = () => {
      if (location.hash.length > 1)
        scrollToId(decodeURIComponent(location.hash.slice(1)));
    };

    document.addEventListener("click", onClick, true); // capture
    window.addEventListener("hashchange", onHash);
    // honour an initial #hash once layout has settled
    if (location.hash.length > 1) {
      const id = decodeURIComponent(location.hash.slice(1));
      requestAnimationFrame(() => scrollToId(id));
    }

    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("hashchange", onHash);
    };
  }, []);

  return null;
}
