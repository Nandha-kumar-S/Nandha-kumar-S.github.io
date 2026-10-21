import type { Metadata } from "next";
import {
  HackathonsSection,
  OpenSourceSection,
  PersonalProjectsSection,
  PublicationsSection,
  WorkExperienceSection,
} from "@/components/building-sections";
import { SectionNav } from "@/components/section-nav";
import { Container, PageTitle } from "@/components/ui";
import {
  getHackathonWins,
  getOpenSourceContributions,
  getPackages,
  getPersonalProjects,
  getPublications,
  getWorkProjects,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Building",
  description:
    "Professional work, personal projects, open source, hackathons, and published artifacts.",
};

/**
 * All five Building groups on one scrollable page.
 *
 * Previously five routes under /building/*. Each group holds only a handful of
 * entries (3/5/2/2/1), and five tabs holding one or two items each read as
 * sparse — one page of thirteen reads as substantial. The sticky strip gives
 * direct access to any group without scrolling, so nothing was lost by merging.
 *
 * To split a group back out once it outgrows this page: give it a route that
 * renders its section component, and swap that entry's nav `id` for an `href`.
 */
export default async function BuildingPage() {
  const [work, personal, contributions, hackathons, packages, publications] =
    await Promise.all([
      getWorkProjects(),
      getPersonalProjects(),
      getOpenSourceContributions(),
      getHackathonWins(),
      getPackages(),
      getPublications(),
    ]);

  const navItems = [
    { id: "work", label: "Work Experience", count: work.length },
    { id: "personal", label: "Personal Projects", count: personal.length },
    {
      id: "open-source",
      label: "Open Source Contributions",
      count: contributions.length,
    },
    { id: "hackathons", label: "Hackathons", count: hackathons.length },
    {
      // Packages and research papers both count here — they're presented
      // together as published artifacts, distinguished by a badge per card.
      id: "publications",
      label: "Publications",
      count: packages.length + publications.length,
    },
  ];

  return (
    <Container wide>
      <PageTitle
        title="building"
        intro="Professional work, personal projects, open source, hackathons, and published artifacts."
      />

      <SectionNav items={navItems} />

      <div className="pt-10">
        <WorkExperienceSection projects={work} />
        <PersonalProjectsSection projects={personal} />
        <OpenSourceSection contributions={contributions} />
        <HackathonsSection wins={hackathons} />
        <PublicationsSection
          packages={packages}
          publications={publications}
        />
      </div>
    </Container>
  );
}
