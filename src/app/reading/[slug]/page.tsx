import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Container,
  Meta,
  OutboundLink,
  TagList,
  formatDate,
} from "@/components/ui";
import { getReadingNote, getReadingNoteSlugs } from "@/lib/content";

/**
 * Tells Next.js every slug that exists, so each note becomes its own static
 * HTML file at build time rather than being rendered on demand.
 */
export async function generateStaticParams() {
  const slugs = await getReadingNoteSlugs();
  return slugs.map((slug) => ({ slug }));
}

/**
 * Per-note metadata, so sharing one note previews THAT paper rather than the
 * section title.
 *
 * Note `await params` — in Next.js 16 route params arrive as a Promise.
 * That's a breaking change from what older tutorials show.
 */
export async function generateMetadata({
  params,
}: PageProps<"/reading/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const note = await getReadingNote(slug);

  if (!note) return {};

  return {
    title: note.paperTitle,
    description: note.problem,
  };
}

export default async function ReadingNotePage({
  params,
}: PageProps<"/reading/[slug]">) {
  const { slug } = await params;
  const note = await getReadingNote(slug);

  if (!note) notFound();

  return (
    <Container>
      <article className="pt-12">
        <Meta>Read {formatDate(note.dateRead)}</Meta>
        <h1 className="mt-3 text-2xl font-semibold">{note.paperTitle}</h1>

        <div className="mt-4 text-sm">
          <OutboundLink href={note.paperUrl}>Read the paper</OutboundLink>
        </div>

        {/*
          One heading over both fields, because both ARE the takeaway: these
          notes are a reading of the paper, not a neutral abstract of it.
          Problem and Solution are subheadings under it rather than peers of
          it — labelling Solution separately would imply the surrounding text
          was objective reporting, which it deliberately isn't.
        */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold">My takeaway</h2>
          <div className="mt-5 space-y-7">
            <NoteField label="Problem" body={note.problem} />
            <NoteField label="Solution" body={note.solution} />
          </div>
        </section>

        {note.tags && note.tags.length > 0 ? <TagList tags={note.tags} /> : null}
      </article>

      <p className="mt-14 text-sm">
        <Link
          href="/reading"
          className="underline decoration-rule underline-offset-4 transition-colors hover:decoration-ink"
        >
          <span aria-hidden="true">←</span> All reading notes
        </Link>
      </p>
    </Container>
  );
}

/** A subheading under "My takeaway" — h3, since h2 is the section above. */
function NoteField({ label, body }: { label: string; body: string }) {
  return (
    <section>
      <h3 className="font-mono text-xs uppercase tracking-[0.09em] text-ink-muted">
        {label}
      </h3>
      {body.split("\n\n").map((paragraph) => (
        <p key={paragraph.slice(0, 40)} className="mt-2.5">
          {paragraph}
        </p>
      ))}
    </section>
  );
}
