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
 * Two blocks, name then card, the card tucked under the name's lower-left
 * edge. This used to be three (name, intro card, "What I do" card) staggered
 * diagonally, each overlapping the next; dropping "What I do" left one card
 * with nothing to its right, so it's sized to its own content (8 of 12
 * columns) rather than stretched to the full row — stretching it would just
 * leave the freed-up space empty inside the panel instead of outside it.
 *
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
        Still one 12-column grid, even with a single card — that's what keeps
        the -mt-10 overlap and the pb-12 clearance it eats into working
        exactly as before. z-20/z-10 (name over card) is belt-and-braces: the
        overlap is sized to land in empty space, never on the surname, but
        keeping the name on top means a rounding difference can never hide it.

        Below `md` the offset is dropped and the two simply stack.
      */}
      <div className="mx-auto grid w-full max-w-(--container-wide) gap-4 md:grid-cols-12 md:gap-0">
        {/*
          pb-12 is load-bearing, not decoration: it's the clearance the card's
          -mt-10 eats into, so the overlap consumes empty space instead of the
          surname.
        */}
        <div className="relative z-20 px-2 md:col-start-1 md:col-end-9 md:row-start-1 md:pb-12">
          <p className="mb-1 text-[clamp(1.1rem,2.4vw,1.7rem)] text-ink-muted">
            Hey, I&apos;m
          </p>
          <h1 className="text-[clamp(2.1rem,min(9vw,12vh),5.5rem)] leading-[0.9] font-bold tracking-[-0.045em]">
            <span className="block">{firstName}</span>
            <span className="block">{lastName}</span>
          </h1>
        </div>

        {/*
          Sized to its content (8 of 12 columns) rather than stretched to the
          full row — a card spanning every column but a paragraph still
          capped at a readable measure just leaves dead space on the right.
          No box-shadow ring here: that ring existed only to keep this card
          visually separate from a second, same-coloured card beside it. With
          nothing beside it, the ring has nothing to separate.
        */}
        <div className="relative z-10 rounded-(--radius-panel) bg-panel px-7 py-9 sm:px-10 sm:py-10 md:col-start-1 md:col-end-9 md:row-start-2 md:-mt-10">
          {/* Paragraphs split on render — see the note on Profile.heroIntro. */}
          <div className="max-w-[48ch] space-y-3 text-[clamp(0.95rem,1.5vw,1.0625rem)]">
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
            the homepage would have no route to the code — which is the one
            job this site exists to do.
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
      </div>
    </div>
  );
}
