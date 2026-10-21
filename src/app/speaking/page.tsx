import type { Metadata } from "next";
import {
  Card,
  CardGrid,
  CardHeader,
  Container,
  Meta,
  OutboundLink,
  PageTitle,
  formatDate,
} from "@/components/ui";
import { getTalks } from "@/lib/content";

export const metadata: Metadata = {
  title: "Speaking",
  description: "Talks, lectures, and presentations.",
};

/**
 * Talks and lectures only. Hackathon wins live under /building/hackathons —
 * they're built things, not speaking engagements.
 */
export default async function SpeakingPage() {
  const talks = await getTalks();

  return (
    <Container wide>
      <PageTitle
        title="speaking"
        intro="Talks, lectures, and presentations."
      />

      {talks.length === 0 ? (
        <p className="text-ink-muted">Nothing published yet.</p>
      ) : (
        <div className="pt-4">
          <CardGrid>
            {talks.map((talk) => (
              <Card key={talk.slug}>
                <CardHeader
                  title={talk.title}
                  meta={
                    <Meta>
                      {talk.venue} · {formatDate(talk.date)}
                    </Meta>
                  }
                />
                <p className="mt-2.5 text-sm">{talk.summary}</p>
                {talk.audience ? (
                  <p className="mt-2.5 text-sm text-ink-muted">{talk.audience}</p>
                ) : null}
                {talk.link ? (
                  <div className="mt-4 text-sm">
                    <OutboundLink href={talk.link.url}>
                      {talk.link.label}
                    </OutboundLink>
                  </div>
                ) : null}
              </Card>
            ))}
          </CardGrid>
        </div>
      )}
    </Container>
  );
}
