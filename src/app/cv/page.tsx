import type { Metadata } from "next";
import type { ReactNode } from "react";
import { formatDate } from "@/components/ui";
import {
  getHackathonWins,
  getOpenSourceContributions,
  getPackages,
  getPersonalProjects,
  getProfile,
  getWorkProjects,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "CV",
  description: "One-page CV — experience, projects, hackathons and skills.",
  // A CV is for a named recipient, not for search results.
  robots: { index: false, follow: false },
};

/**
 * ONE-PAGE CV, built from the same `data.ts` the rest of the site reads.
 *
 * It exists as a route rather than a hand-made PDF so the content can't drift
 * from the site: every project line below is the same `summary` string the
 * /building tiles render. To publish, open /cv and print to PDF
 * (Cmd-P → Save as PDF) into `public/cv.pdf`, which is where the header's CV
 * button already points.
 *
 * SINGLE COLUMN, deliberately. Applicant tracking systems read multi-column
 * layouts in the wrong order or drop a sidebar entirely, so the elegant
 * two-column CV is the one that arrives as nonsense. Everything here is real
 * selectable text in reading order — no tables, no images, no icon fonts.
 *
 * Print rules (`@page`, hiding the site chrome, forcing black on white) live
 * in globals.css next to the `[data-cv]` selector.
 */
export default async function CvPage() {
  const [
    profile,
    workProjects,
    personalProjects,
    packages,
    contributions,
    hackathons,
  ] = await Promise.all([
    getProfile(),
    getWorkProjects(),
    getPersonalProjects(),
    getPackages(),
    getOpenSourceContributions(),
    getHackathonWins(),
  ]);

  const projectBySlug = new Map(workProjects.map((p) => [p.slug, p]));

  // One page means curation. `featured` is the existing mechanism for "this
  // represents me" (D30), so the CV honours it rather than inventing a second
  // flag — which is why only DSPy appears from three personal projects.
  const cvPersonalProjects = personalProjects.filter((p) => p.featured);

  return (
    <div
      data-cv
      className="mx-auto w-full max-w-[52rem] px-5 py-10 print:max-w-none print:px-0 print:py-0"
    >
      {/* Screen-only note: this page is the source the PDF is rendered from. */}
      <p className="mb-6 rounded-(--radius-panel) bg-panel px-5 py-3 text-sm text-ink-muted print:hidden">
        This page is the source for{" "}
        <code className="font-mono text-xs">public/cv.pdf</code>, which the
        header&apos;s CV button downloads. After changing anything below, run{" "}
        <code className="font-mono text-xs">npm run cv</code> to regenerate it
        — otherwise the download goes stale while this page stays correct.
      </p>

      <article className="cv-sheet">
        <header className="border-b border-ink pb-3">
          <h1 className="text-[1.6rem] leading-tight font-bold tracking-[-0.03em]">
            {profile.name}
          </h1>
          <p className="mt-0.5 text-[0.95rem] text-ink-muted">
            {/* The current title, taken from the newest role rather than
                restated — one less string to keep in sync. */}
            {profile.experience[0]?.role} in AI/ML
          </p>

          {/* Links are real anchors so they stay clickable in the PDF. */}
          <p className="mt-2 text-[0.8rem] leading-relaxed">
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <Dot />
            {profile.phone}
            <Dot />
            {/*
              Labels, not URLs. "github.com/Nandha-kumar-S" spells out a
              string nobody retypes from a PDF — the link does the work, and
              the label buys back most of a line.
            */}
            {profile.profiles.map((link) => (
              <span key={link.url}>
                <a href={link.url}>{link.label}</a>
                <Dot />
              </span>
            ))}
            {/*
              Plain text, not an anchor. Every other link here is clickable;
              this one would resolve to nothing, and a dead hyperlink in a CV
              is worse than none. Wrap it in an <a href={`https://${profile.siteUrl}`}>
              the day the site is actually deployed.
            */}
            Portfolio
          </p>
        </header>

        <Section title="Summary">
          <p className="text-[0.85rem] leading-snug">{profile.cvSummary}</p>
        </Section>

        <Section title="Experience">
          {profile.experience.map((role) => (
            <div
              key={`${role.role}-${role.period}`}
              className="mt-2 break-inside-avoid first:mt-0"
            >
              <Row
                left={
                  <>
                    <strong>{role.company}</strong> — {role.role}
                  </>
                }
                right={role.period}
              />

              {/* Projects nested under the role that held them. A single
                  employer reads as narrow; three named systems don't. */}
              {(role.projectSlugs ?? []).map((slug) => {
                const project = projectBySlug.get(slug);
                if (!project) return null;

                return (
                  <div key={slug} className="mt-1.5 break-inside-avoid pl-4">
                    <Row
                      left={<em className="not-italic font-medium">{project.title}</em>}
                      right={project.period}
                    />
                    <p className="mt-0.5 text-[0.82rem] leading-snug">
                      {project.summary}
                    </p>
                    <p className="mt-0.5 text-[0.75rem] text-ink-muted">
                      {project.tech.join(" · ")}
                    </p>
                  </div>
                );
              })}
            </div>
          ))}
        </Section>

        <Section title="Hackathons">
          <ul>
            {hackathons.map((win) => (
              <li key={win.slug} className="mt-1.5 break-inside-avoid first:mt-0">
                <Row
                  left={
                    <>
                      <strong>{win.placement}</strong> — {win.event}
                    </>
                  }
                  right={formatDate(win.date)}
                />
                <p className="mt-0.5 text-[0.82rem] leading-snug">
                  {win.summary}
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Projects & open source">
          <ul className="space-y-1.5">
            {packages.map((pkg) => (
              <li key={pkg.slug} className="text-[0.82rem] leading-snug">
                <strong>{pkg.name}</strong> ({pkg.registry}) — {pkg.highlight}.
                No LLM in the pipeline, so it runs on documents carrying PHI.
              </li>
            ))}

            {cvPersonalProjects.map((project) => (
              <li key={project.slug} className="text-[0.82rem] leading-snug">
                <strong>{project.title}</strong> — {project.summary}
              </li>
            ))}

            {/* Both contributions are to the same project, so they share one
                line rather than repeating "mesa/mesa-examples" twice. */}
            {contributions.length > 0 ? (
              <li className="text-[0.82rem] leading-snug">
                <strong>{contributions[0].project}</strong> —{" "}
                {contributions
                  .map((c) => c.highlight ?? c.description)
                  .join("; ")}
                .
              </li>
            ) : null}
          </ul>
        </Section>


        <Section title="Skills">
          <dl className="space-y-0.5 text-[0.82rem] leading-snug">
            {profile.skills.map((group) => (
              <div key={group.label} className="flex flex-wrap gap-x-2">
                <dt className="font-medium">{group.label}</dt>
                <dd>{group.items.join(" · ")}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section title="Education">
          {profile.education.map((entry) => (
            <Row
              key={entry.institution}
              left={
                <>
                  <strong>{entry.qualification}</strong> — {entry.institution}
                  {entry.detail ? <> · {entry.detail}</> : null}
                </>
              }
              right={entry.period}
            />
          ))}
        </Section>
      </article>
    </div>
  );
}

/**
 * A CV section. The heading is small, spaced capitals over a rule — the
 * cheapest way to make a dense single column scannable without colour, icons
 * or indentation games that confuse a parser.
 */
function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    /*
      No `break-inside-avoid` on the section itself. A tall section that can't
      be split gets pushed wholesale onto the next page, leaving half of the
      previous one blank — which is what turned this into three pages. The
      individual entries carry it instead, so a break can land between two
      projects but never through the middle of one.
    */
    <section className="mt-4">
      <h2 className="mb-1.5 border-b border-rule pb-0.5 font-mono text-[0.68rem] tracking-[0.12em] uppercase break-after-avoid">
        {title}
      </h2>
      {children}
    </section>
  );
}

/** Title on the left, date on the right, on one baseline. */
function Row({ left, right }: { left: ReactNode; right: string }) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 text-[0.85rem]">
      <span>{left}</span>
      <span className="shrink-0 font-mono text-[0.72rem] text-ink-muted">
        {right}
      </span>
    </div>
  );
}

function Dot() {
  return <span className="mx-1.5 text-ink-muted">·</span>;
}

