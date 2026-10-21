/**
 * The five groups that make up /building, one component each.
 *
 * They live together on a single scrollable page today because each holds only
 * a handful of entries. Each is deliberately self-contained and takes its data
 * as props, so promoting one back to its own route later means moving the
 * component, not rewriting it.
 *
 * `scroll-mt-20` on each <section> is what stops an anchor jump from parking
 * the heading underneath the sticky nav strip.
 */

import type {
  HackathonWin,
  OpenSourceContribution,
  Package,
  PersonalProject,
  Publication,
  WorkProject,
} from "@/content/types";
import {
  Card,
  CardGrid,
  CardHeader,
  ExpandableCard,
  FieldBlock,
  KindBadge,
  Meta,
  OutboundLink,
  SectionTitle,
  formatDate,
} from "@/components/ui";

/** Shared wrapper: anchor target, scroll offset, and spacing between groups. */
function Group({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-20 pb-20 last:pb-4">
      <SectionTitle title={title} description={description} />
      {children}
    </section>
  );
}

export function WorkExperienceSection({
  projects,
}: {
  projects: WorkProject[];
}) {
  return (
    <Group
      id="work"
      title="Work experience"
      description="Engineering work delivered in a professional setting."
    >
      <CardGrid>
        {projects.map((project) => (
          <ExpandableCard
            key={project.slug}
            title={project.title}
            /* Employer · period, matching the "qualifier · date" shape every
               other tile on the site already uses. */
            meta={
              <Meta>
                {project.associatedWith ? `${project.associatedWith} · ` : null}
                {project.period}
              </Meta>
            }
            summary={project.summary}
            tags={project.tech}
          >
            {/* Two expanded shapes — see the note on WorkProject.narrative.
                An entry sets one or the other, never both. */}
            {project.narrative ? (
              <NarrativeBlock text={project.narrative} />
            ) : (
              <>
                <FieldBlock label="Problem">{project.problem}</FieldBlock>
                <FieldBlock label="Approach">{project.approach}</FieldBlock>
                {project.outcome ? (
                  <FieldBlock label="Outcome">{project.outcome}</FieldBlock>
                ) : null}
              </>
            )}
          </ExpandableCard>
        ))}
      </CardGrid>
    </Group>
  );
}

export function PersonalProjectsSection({
  projects,
}: {
  projects: PersonalProject[];
}) {
  return (
    <Group
      id="personal"
      title="Personal projects"
      description="Self-directed projects, built outside professional work."
    >
      <CardGrid>
        {projects.map((project) => (
          <ExpandableCard
            key={project.slug}
            title={project.title}
            meta={<Meta>{project.period}</Meta>}
            summary={project.summary}
            tags={project.tech}
            links={
              <>
                {project.repoUrl ? (
                  <OutboundLink href={project.repoUrl}>Source</OutboundLink>
                ) : null}
                {project.demoUrl ? (
                  <OutboundLink href={project.demoUrl}>Demo</OutboundLink>
                ) : null}
              </>
            }
          >
            <FieldBlock label="Problem">{project.problem}</FieldBlock>
            <FieldBlock label="Approach">{project.approach}</FieldBlock>
            {project.outcome ? (
              <FieldBlock label="Outcome">{project.outcome}</FieldBlock>
            ) : null}
          </ExpandableCard>
        ))}
      </CardGrid>
    </Group>
  );
}

/**
 * Two shapes render here (see the OpenSourceContribution type): a merged pull
 * request, and work built for an upstream project that lives in its own repo.
 * The meta line and the link adapt to whichever fields are present.
 */
export function OpenSourceSection({
  contributions,
}: {
  contributions: OpenSourceContribution[];
}) {
  return (
    <Group
      id="open-source"
      title="Open source contributions"
      description="Contributions to projects maintained by others."
    >
      {contributions.length === 0 ? (
        <p className="text-ink-muted">Nothing merged yet.</p>
      ) : (
        <CardGrid>
          {contributions.map((contribution) => (
            <Card key={contribution.slug}>
              <CardHeader
                title={contribution.title}
                meta={
                  <Meta>
                    {contribution.project}
                    {/* "merged" is only true of a PR — a repo-shaped entry
                        shows its date plain, with no claim attached. */}
                    {contribution.mergedOn
                      ? ` · merged ${formatDate(contribution.mergedOn)}`
                      : contribution.date
                        ? ` · ${formatDate(contribution.date)}`
                        : null}
                  </Meta>
                }
              />
              <p className="mt-2.5 text-sm">{contribution.description}</p>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                {contribution.prUrl ? (
                  <OutboundLink href={contribution.prUrl}>
                    View pull request
                  </OutboundLink>
                ) : null}
                {contribution.repoUrl ? (
                  <OutboundLink href={contribution.repoUrl}>
                    View repository
                  </OutboundLink>
                ) : null}
              </div>
            </Card>
          ))}
        </CardGrid>
      )}
    </Group>
  );
}

/**
 * Hackathons sit under Building rather than Speaking — an entry is a built
 * thing, and the placement is its outcome.
 */
export function HackathonsSection({ wins }: { wins: HackathonWin[] }) {
  return (
    <Group
      id="hackathons"
      title="Hackathons"
      description="Competitive builds and their results."
    >
      <CardGrid>
        {wins.map((win) => (
          <ExpandableCard
            key={win.slug}
            title={win.event}
            meta={
              <Meta>
                {win.placement} · {formatDate(win.date)}
              </Meta>
            }
            summary={win.summary}
            /* Both links sit outside the <details> so they stay reachable
               without expanding the tile. Source first: it's the one a
               reviewer is most likely to want. */
            links={
              win.repoUrl || win.link ? (
                <>
                  {win.repoUrl ? (
                    <OutboundLink href={win.repoUrl}>Source</OutboundLink>
                  ) : null}
                  {win.link ? (
                    <OutboundLink href={win.link.url}>
                      {win.link.label}
                    </OutboundLink>
                  ) : null}
                </>
              ) : null
            }
          >
            <FieldBlock label="Problem">{win.problem}</FieldBlock>
            <FieldBlock label="Approach">{win.approach}</FieldBlock>
            {/* `outcome` is extra context beyond `placement`, which the
                collapsed tile already shows. */}
            {win.outcome ? (
              <FieldBlock label="Outcome">{win.outcome}</FieldBlock>
            ) : null}
          </ExpandableCard>
        ))}
      </CardGrid>
    </Group>
  );
}

/** Human-readable label for a paper's review state. */
const STATUS_LABEL: Record<string, string> = {
  published: "Published",
  "under-review": "Under review",
  "in-progress": "In progress",
};

/**
 * Two different kinds of published artifact in one group: software packages and
 * research papers. Each card carries a badge naming its kind, so a reader never
 * has to infer which is which from the surrounding fields.
 */
export function PublicationsSection({
  packages,
  publications,
}: {
  packages: Package[];
  publications: Publication[];
}) {
  const isEmpty = packages.length === 0 && publications.length === 0;

  return (
    <Group
      id="publications"
      title="Publications"
      description="Packages published to a registry, and research papers."
    >
      {isEmpty ? (
        <p className="text-ink-muted">Nothing published yet.</p>
      ) : (
        <CardGrid>
          {/* Research papers first — they carry more weight in this context. */}
          {publications.map((publication) => (
            <Card key={publication.slug}>
              <KindBadge>Research Paper</KindBadge>
              <div className="mt-2.5">
                <CardHeader
                  title={publication.title}
                  meta={
                    <Meta>
                      {publication.venue} · {publication.year} ·{" "}
                      {STATUS_LABEL[publication.status] ?? publication.status}
                    </Meta>
                  }
                />
              </div>
              <p className="mt-2.5 text-sm">{publication.description}</p>
              {publication.url ? (
                <div className="mt-4 text-sm">
                  <OutboundLink href={publication.url}>View paper</OutboundLink>
                </div>
              ) : null}
            </Card>
          ))}

          {packages.map((pkg) => (
            <Card key={pkg.slug}>
              <KindBadge>Package</KindBadge>
              <div className="mt-2.5">
                <CardHeader
                  title={pkg.name}
                  meta={
                    <Meta>
                      {pkg.registry} · {formatDate(pkg.publishedOn)}
                    </Meta>
                  }
                />
              </div>
              <p className="mt-2.5 text-sm">{pkg.description}</p>
              {/* Registry first (that's how you get it), source second. */}
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                <OutboundLink href={pkg.url}>View on {pkg.registry}</OutboundLink>
                {pkg.repoUrl ? (
                  <OutboundLink href={pkg.repoUrl}>Source</OutboundLink>
                ) : null}
              </div>
            </Card>
          ))}
        </CardGrid>
      )}
    </Group>
  );
}

/**
 * The no-labels alternative to Problem/Approach/Outcome — continuous prose,
 * split into paragraphs on blank lines like Profile.bio.
 */
function NarrativeBlock({ text }: { text: string }) {
  return (
    <div className="space-y-3.5 pb-2">
      {text.split("\n\n").map((paragraph) => (
        <p key={paragraph.slice(0, 40)} className="text-sm">
          {paragraph}
        </p>
      ))}
    </div>
  );
}
