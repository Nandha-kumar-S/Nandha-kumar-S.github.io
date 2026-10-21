/**
 * Shared layout primitives.
 *
 * Pages compose these instead of repeating utility classes, which keeps spacing
 * consistent and means a visual change happens in one place.
 */

import Link from "next/link";
import type { ReactNode } from "react";

export function Container({
  children,
  wide = false,
}: {
  children: ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      className={`mx-auto px-6 ${
        wide ? "max-w-(--container-wide)" : "max-w-(--container-measure)"
      }`}
    >
      {children}
    </div>
  );
}

/**
 * The page <h1>. Set large and lowercase, following the reference's display
 * style. Exactly one per page — the accessibility spec depends on that.
 */
export function PageTitle({
  title,
  intro,
}: {
  title: string;
  intro?: string;
}) {
  return (
    <div className="pt-12 pb-6">
      <h1 className="text-hero font-bold lowercase">{title}</h1>
      {intro ? (
        <p className="mt-4 max-w-[46ch] text-lg text-ink-muted">{intro}</p>
      ) : null}
    </div>
  );
}

/** A group heading inside a page. */
export function SectionTitle({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-7">
      <h2 className="text-2xl font-semibold">{title}</h2>
      {description ? (
        <p className="mt-2 max-w-[52ch] text-sm text-ink-muted">{description}</p>
      ) : null}
    </div>
  );
}

/**
 * The tonal card. This is the single most important visual device on the site:
 * the step from canvas to panel is what makes structure legible at a glance,
 * more than font size does.
 */
export function Card({ children }: { children: ReactNode }) {
  return (
    <article className="rounded-(--radius-panel) bg-panel px-7 py-6 transition-colors hover:bg-panel-hover">
      {children}
    </article>
  );
}

/**
 * Same look as <Card>, but the whole tile IS the link — no separate "view
 * all" text underneath. Used on the homepage: clicking any featured item
 * goes straight to that item's full section (e.g. every card in the Work
 * quadrant links to /building/experience), so there's nothing to click
 * beyond the tile itself.
 */
export function CardLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="block rounded-(--radius-panel) bg-panel px-7 py-6 transition-colors hover:bg-panel-hover"
    >
      {children}
    </Link>
  );
}

/**
 * A card that shows a short summary and reveals its full breakdown on click.
 *
 * Built on the native <details>/<summary> pair rather than React state, which
 * buys three things for free: it works with JavaScript disabled, it's keyboard
 * operable and announced correctly by screen readers without any ARIA, and the
 * collapsed content is still in the HTML so crawlers index it.
 *
 * That last point is why this stays a server component — no "use client".
 */
export function ExpandableCard({
  title,
  meta,
  summary,
  tags,
  links,
  children,
}: {
  title: string;
  meta?: ReactNode;
  summary: string;
  tags?: string[];
  /** Shown on the collapsed tile, always visible. */
  links?: ReactNode;
  children: ReactNode;
}) {
  return (
    /*
      <details> is nested inside this wrapper rather than being the card
      itself, so `links` can sit OUTSIDE it and stay visible when collapsed.
      Putting a link inside <summary> would make clicking it both navigate
      and toggle the disclosure — suppressing that needs JavaScript, which
      would cost the no-JS and free-accessibility benefits of this pattern.
    */
    <article className="group rounded-(--radius-panel) bg-panel transition-colors hover:bg-panel-hover">
      <details className="group/details">
        {/* list-none + the webkit rule hide the default disclosure triangle,
            leaving the custom "Details" affordance as the only indicator. */}
        <summary className="cursor-pointer list-none px-7 pt-6 pb-5 [&::-webkit-details-marker]:hidden">
          {/* Shared with every non-expanding tile, so the two kinds of card
              line up rather than merely resembling each other. */}
          <CardHeader title={title} meta={meta} />

          <p className="mt-2.5 max-w-[62ch] text-sm text-ink-muted">{summary}</p>

          {tags && tags.length > 0 ? <TagList tags={tags} /> : null}

          <span className="mt-4 inline-block text-sm text-ink-muted">
            Details
            {/* group-open/details flips the caret when expanded. */}
            <span
              aria-hidden="true"
              className="ml-1 hidden group-open/details:inline"
            >
              ▴
            </span>
            <span
              aria-hidden="true"
              className="ml-1 inline group-open/details:hidden"
            >
              ▾
            </span>
          </span>
        </summary>

        <div className="px-7 pb-2">{children}</div>
      </details>

      {links ? (
        <div className="mt-1 flex flex-wrap gap-x-5 gap-y-1 border-t border-rule px-7 py-4 text-sm">
          {links}
        </div>
      ) : null}
    </article>
  );
}

/** A labelled block inside an expanded card — Problem, Approach, Outcome. */
export function FieldBlock({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-5 last:mb-0">
      <h4 className="font-mono text-xs uppercase tracking-[0.09em] text-ink-muted">
        {label}
      </h4>
      {/* A long field is split on blank lines, same convention as Profile.bio.
          Without this a multi-paragraph string collapses into one dense block
          — which is exactly the wall of text the expand pattern exists to
          avoid. Non-string children (rare) pass straight through. */}
      {typeof children === "string" ? (
        children.split("\n\n").map((paragraph) => (
          <p key={paragraph.slice(0, 40)} className="mt-1.5 text-sm">
            {paragraph}
          </p>
        ))
      ) : (
        <p className="mt-1.5 text-sm">{children}</p>
      )}
    </section>
  );
}

export function CardGrid({ children }: { children: ReactNode }) {
  return <div className="grid gap-3.5">{children}</div>;
}

/** Small mono metadata line — dates, venues, placements. */
export function Meta({ children }: { children: ReactNode }) {
  return (
    <p className="font-mono text-xs uppercase tracking-[0.09em] text-ink-muted">
      {children}
    </p>
  );
}

/**
 * The uniform tile header: title on the left, metadata on the right.
 *
 * Every tile on the site uses this, which is the point — before it existed,
 * ExpandableCard put its date top-right while the plain Card pages stacked
 * theirs above the title on the left, so scanning two sections meant looking
 * in two different places for the same piece of information.
 *
 * `flex-wrap` plus `ml-auto` is what makes it hold at phone width: when the
 * title and meta can't share a line the meta drops below and stays
 * right-aligned, instead of forcing a horizontal scroll.
 */
export function CardHeader({
  title,
  meta,
}: {
  title: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-5 gap-y-1">
      <h3 className="text-lg font-semibold">{title}</h3>
      {meta ? (
        <div className="ml-auto shrink-0 text-right">{meta}</div>
      ) : null}
    </div>
  );
}

/**
 * A strong type marker for cards that sit alongside a different kind of thing.
 *
 * The Publications page mixes software packages with research papers, so each
 * card has to say which it is at a glance. Inverted fill makes it read as a
 * label rather than as content.
 */
export function KindBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-full bg-inverted px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.08em] text-inverted-ink">
      {children}
    </span>
  );
}

export function TagList({ tags }: { tags: string[] }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-2">
      {tags.map((tag) => (
        <li
          key={tag}
          className="rounded-full border border-rule px-2.5 py-0.5 text-xs text-ink-muted"
        >
          {tag}
        </li>
      ))}
    </ul>
  );
}

/** A link that leaves the site — marked so a visitor knows before clicking. */
export function OutboundLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="underline decoration-rule underline-offset-4 transition-colors hover:decoration-ink"
    >
      {children} <span aria-hidden="true">↗</span>
    </a>
  );
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });
}
