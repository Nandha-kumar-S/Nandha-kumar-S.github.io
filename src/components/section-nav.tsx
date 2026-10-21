"use client";

/**
 * Sticky in-page section navigation.
 *
 * Previously this switched between five real routes. The five /building groups
 * now live on ONE scrollable page (3/5/2/2/1 entries each — five tabs holding
 * one or two items read as sparse), so these are in-page anchors and the active
 * entry is decided by scroll position rather than by URL.
 *
 * Deliberately unchanged in appearance: same quiet text strip, same mono
 * counts. A returning visitor shouldn't be able to tell the mechanism moved.
 *
 * Client component because IntersectionObserver is browser-only. The page
 * itself stays fully static — only this strip hydrates.
 */

import { useEffect, useState } from "react";

export type SectionNavItem = {
  /** DOM id of the section this links to — without the leading '#'. */
  id: string;
  label: string;
  /** Shown as a small count beside the label. */
  count?: number;
};

export function SectionNav({ items }: { items: SectionNavItem[] }) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    /*
      rootMargin's large negative bottom (-65%) means a section only counts as
      "current" once it reaches the upper band of the viewport. Without it the
      bottom-most section — Publications, with one entry — can never win,
      because a short final section never occupies the middle of the screen.
      The -80px top clears the sticky strip itself.
    */
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-80px 0px -65% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  return (
    <div className="sticky top-0 z-10 -mx-6 border-b border-rule bg-canvas px-6">
      <nav aria-label="Section">
        <ul className="flex flex-wrap items-center gap-x-7 gap-y-1 py-3.5">
          {items.map((item) => {
            const isActive = activeId === item.id;

            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  /* aria-current="true" rather than "page" — every entry is
                     this same page, so "page" would be inaccurate. */
                  aria-current={isActive ? "true" : undefined}
                  className={
                    isActive
                      ? "text-ink"
                      : "text-ink-muted transition-colors hover:text-ink"
                  }
                >
                  {item.label}
                  {typeof item.count === "number" ? (
                    <span className="ml-1.5 font-mono text-xs opacity-60">
                      {item.count}
                    </span>
                  ) : null}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
