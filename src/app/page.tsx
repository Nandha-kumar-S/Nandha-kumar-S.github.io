import Link from "next/link";
import { getProfile } from "@/lib/content";

/**
 * The homepage is ONE SCREEN, and it is also the introduction.
 *
 * It replaced a 2×2 grid of "featured" cards. That grid had a quiet lie in it:
 * `featuredOrRecent()` padded each quadrant with whatever was newest when not
 * enough items were marked featured, so half the page looked curated and
 * wasn't. Rather than curate harder, the page stopped showing items at all —
 * what a visitor needs first is who this is and what he can do, and the nav
 * already reaches every listing.
 *
 * The three blocks cascade diagonally, each overlapping the one before it.
 * See `data-home` in globals.css for the rule that lets the footer sit flush.
 */
export default async function HomePage() {
  const profile = await getProfile();

  // Split for the two-line display treatment. `rest` rejoined rather than
  // indexed, so a middle name would stay on the second line instead of
  // vanishing.
  const [firstName, ...rest] = profile.name.split(" ");
  const lastName = rest.join(" ");

  return (
    <div
      data-home
      className="flex flex-1 flex-col justify-center px-4 py-6 sm:px-0"
    >
      {/*
        A diagonal staircase: name, then About tucked under its lower edge and
        shifted right, then What I do overlapping About's lower right.

        All three live in ONE 12-column grid so the horizontal offsets are
        column spans rather than hand-tuned percentages. Both cards are
        deliberately the SAME width — 7 columns each, About on 1–7 and What I
        do on 6–12 — which is the only split of a 12-column grid that makes two
        equal cards meet in the middle: 2 × 7 − 2 overlapped = 12. About
        therefore starts flush with the name's left edge rather than indented,
        so the cascade has no gap down its left side. The vertical overlap is
        the negative top margin on each following row. z-index rises down the
        cascade so a later block sits in front, and the name keeps the highest
        so its text can never end up behind a card.

        Below `md` every offset is dropped and the three simply stack — an
        overlap at phone width would hide content rather than frame it.
      */}
      <div className="mx-auto grid w-full max-w-(--container-wide) gap-4 md:grid-cols-12 md:gap-0">
        {/*
          pb-12 is load-bearing, not decoration: it's the clearance the About
          card's -mt-10 eats into, so the overlap consumes empty space instead
          of the surname.
        */}
        <div className="relative z-30 px-2 md:col-start-1 md:col-end-7 md:row-start-1 md:pb-12">
          <p className="mb-1 text-[clamp(1.1rem,2.4vw,1.7rem)] text-ink-muted">
            Hey, I&apos;m
          </p>
          <h1 className="text-[clamp(2.1rem,min(9vw,12vh),5.5rem)] leading-[0.9] font-bold tracking-[-0.045em]">
            <span className="block">{firstName}</span>
            <span className="block">{lastName}</span>
          </h1>
        </div>

        {/*
          Every card in the cascade carries a canvas-coloured box-shadow. All
          three are the same tone, so without that band an overlap would read
          as one irregular blob rather than two distinct shapes — it's the gap
          between the outlines in the sketch, drawn as a ring instead of a line.
        */}
        <div className="relative z-10 rounded-(--radius-panel) bg-panel px-7 py-7 sm:px-9 md:col-start-1 md:col-end-8 md:row-start-2 md:-mt-10 md:pr-12 md:shadow-[0_0_0_7px_var(--color-canvas)]">
          {/* Paragraphs split on render — see the note on Profile.heroIntro. */}
          <div className="max-w-[44ch] space-y-3 text-[clamp(0.95rem,1.5vw,1.0625rem)]">
            {profile.heroIntro.split("\n\n").map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </div>

          <div className="mt-5">
            <Link
              href="/building"
              className="inline-flex items-center gap-2 rounded-full bg-inverted px-5 py-2.5 text-sm text-inverted-ink transition-opacity hover:opacity-85"
            >
              See the work <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/*
            The only profile links on the site outside /about. They were cut
            from the global footer, and without them here a visitor landing on
            the homepage would have no route to the code — which is the one job
            this site exists to do.
          */}
          <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-1.5 border-t border-rule pt-4 text-sm">
            {profile.profiles.map((link) => (
              <li key={link.url}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-muted underline decoration-rule underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={`mailto:${profile.email}`}
                className="text-ink-muted underline decoration-rule underline-offset-4 transition-colors hover:text-ink hover:decoration-ink"
              >
                Email
              </a>
            </li>
          </ul>
        </div>

        <div className="relative z-20 rounded-(--radius-panel) bg-panel px-7 py-7 sm:px-9 md:col-start-6 md:col-end-13 md:row-start-3 md:-mt-14 md:pl-12 md:shadow-[0_0_0_7px_var(--color-canvas)]">
          <h2 className="mb-3.5 font-mono text-xs tracking-[0.09em] text-ink-muted uppercase">
            What I do
          </h2>
          <ul>
            {profile.capabilities.map((capability) => (
              <li
                key={capability}
                className="grid grid-cols-[auto_1fr] gap-x-3.5 border-t border-rule py-2.5 text-[clamp(0.95rem,1.5vw,1.0625rem)] leading-snug last:border-b"
              >
                {/*
                  A drawn square rather than a text bullet: it can't be swapped
                  for a different glyph by the font, and `em` units keep it
                  proportional to the line it marks as the clamped type scales.
                  Decorative — the <ul>/<li> already carry the list semantics a
                  screen reader announces.
                */}
                <span
                  aria-hidden="true"
                  className="mt-[0.62em] size-[0.4em] shrink-0 bg-ink-muted"
                />
                <span>{capability}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
