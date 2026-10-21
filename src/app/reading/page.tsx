import type { Metadata } from "next";
import Link from "next/link";
import {
  Card,
  CardGrid,
  CardHeader,
  Container,
  Meta,
  PageTitle,
  formatDate,
} from "@/components/ui";
import { getReadingNotes } from "@/lib/content";

export const metadata: Metadata = {
  title: "Reading Notes",
  description: "Research papers, with notes on each.",
};

export default async function ReadingPage() {
  const notes = await getReadingNotes();

  return (
    <Container wide>
      <PageTitle
        title="reading"
        intro="Research papers, with notes on each."
      />

      {notes.length === 0 ? (
        <p className="text-ink-muted">No notes published yet.</p>
      ) : (
        <div className="pt-4">
          <CardGrid>
            {notes.map((note) => (
              <Card key={note.slug}>
                <CardHeader
                  title={
                    <Link
                      href={`/reading/${note.slug}`}
                      className="underline decoration-rule underline-offset-4 transition-colors hover:decoration-ink"
                    >
                      {note.paperTitle}
                    </Link>
                  }
                  meta={<Meta>{formatDate(note.dateRead)}</Meta>}
                />
                <p className="mt-2.5 text-sm text-ink-muted">{note.problem}</p>
              </Card>
            ))}
          </CardGrid>
        </div>
      )}
    </Container>
  );
}
