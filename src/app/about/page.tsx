import type { Metadata } from "next";
import {
  Card,
  CardGrid,
  CardHeader,
  Container,
  Meta,
  OutboundLink,
  PageTitle,
  SectionTitle,
} from "@/components/ui";
import { getProfile } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: "Background, experience, education, and contact details.",
};

export default async function AboutPage() {
  const profile = await getProfile();

  return (
    <Container wide>
      <PageTitle
        title="about"
        intro="Background, experience, education, and contact details."
      />

      {/* The bio is stored as one string with blank lines between paragraphs
          (see the note on Profile.bio). Splitting on render keeps the content
          file plain text — no markup to escape, no array for the type to
          model — while still giving each paragraph its own <p>. */}
      <div className="max-w-[52ch] space-y-4 pb-14">
        {profile.bio.split("\n\n").map((paragraph) => (
          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
        ))}
      </div>

      <div className="mb-14">
        <SectionTitle title="Experience" />
        <CardGrid>
          {profile.experience.map((entry) => (
            <Card key={`${entry.company}-${entry.period}`}>
              <CardHeader
                title={entry.role}
                meta={<Meta>{entry.period}</Meta>}
              />
              <p className="text-sm text-ink-muted">{entry.company}</p>
              {/* Guarded: an entry with nothing publishable to say should
                  render no paragraph, not an empty one. */}
              {entry.summary ? (
                <p className="mt-2.5 text-sm">{entry.summary}</p>
              ) : null}
            </Card>
          ))}
        </CardGrid>
      </div>

      {/* B.Tech only — school-level results read as padding on a technical CV. */}
      <div className="mb-14">
        <SectionTitle title="Education" />
        <CardGrid>
          {profile.education.map((entry) => (
            <Card key={entry.institution}>
              <CardHeader
                title={entry.qualification}
                meta={<Meta>{entry.period}</Meta>}
              />
              <p className="text-sm text-ink-muted">{entry.institution}</p>
              {entry.detail ? (
                <p className="mt-2.5 text-sm">{entry.detail}</p>
              ) : null}
            </Card>
          ))}
        </CardGrid>
      </div>

      <div>
        <SectionTitle title="Contact" />
        <p>
          <a
            href={`mailto:${profile.email}`}
            className="underline decoration-rule underline-offset-4 transition-colors hover:decoration-ink"
          >
            {profile.email}
          </a>
        </p>
        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {profile.profiles.map((link) => (
            <li key={link.url}>
              <OutboundLink href={link.url}>{link.label}</OutboundLink>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
