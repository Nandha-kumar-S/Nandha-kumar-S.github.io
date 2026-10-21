/**
 * Server component — renders to plain HTML, ships no JavaScript.
 * Only <SiteNav /> inside it is a client component.
 *
 * Styled as a floating rounded panel, following the reference's header treatment.
 */

import Link from "next/link";
import { SiteNav } from "./site-nav";

export function SiteHeader({ name, cvUrl }: { name: string; cvUrl: string }) {
  return (
    /*
      The panel box is the SAME width as <Container>: max-w-(--container-wide)
      with px-6 inside. So the bar's edges sit flush with the content column,
      and the name inside it lines up exactly with the page title below.

      Previously the panel was nested inside a padded wrapper, which inset it
      twice — hence the gaps on either side and the text sitting 24px right of
      the content. The outer px-4 exists only to keep a gutter on phones.
    */
    <div className="px-4 pt-5 sm:px-0">
      <header className="mx-auto flex max-w-(--container-wide) flex-wrap items-center justify-between gap-x-6 gap-y-3 rounded-(--radius-panel) bg-panel px-6 py-4">
        {/*
          "NK" monogram, not the full name — the home link, matching the
          reference's "Y.S." treatment. A nav item called "Home" reads as a
          template (D24), so the mark itself carries that job instead.

          Unlike Building/Writing/Reading/Speaking/About, the mark has no
          underline to signal it's clickable, so `monogram-shimmer` (see
          globals.css) stands in for that: a soft sweep every 10s, still the
          rest of the time. `aria-label` carries the full name for screen
          readers, since "NK" alone doesn't describe the destination.
        */}
        <Link
          href="/"
          aria-label={`${name} — Home`}
          className="monogram-shimmer text-lg font-bold tracking-tight transition-opacity hover:opacity-70"
        >
          NK
        </Link>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          <SiteNav />
          {/*
            CV sits outside the five nav slots deliberately: it's the single
            thing a recruiter is most likely to want, so it shouldn't be
            buried inside a section.

            A plain <a download>, not next/link: this points at a static file
            in public/, so there's no route to prefetch, and `download` is
            what makes the browser save it rather than open the PDF viewer.
            The filename is set here too — "cv.pdf" on someone's desktop is
            anonymous; a name is what makes it findable later.
          */}
          <a
            href={cvUrl}
            download={`${name.replace(/\s+/g, "-")}-CV.pdf`}
            className="rounded-full bg-inverted px-4 py-1.5 text-inverted-ink transition-opacity hover:opacity-85"
          >
            CV
          </a>
        </div>
      </header>
    </div>
  );
}
