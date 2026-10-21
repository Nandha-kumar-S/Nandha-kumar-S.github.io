/**
 * The data-access layer — the ONLY path from pages to content.
 *
 * Why this file exists (design.md D3):
 *
 * Right now content lives in typed files under src/content/. Later, the admin
 * change moves reading notes and the work log into a database. When that
 * happens, ONLY this file changes. Every page keeps calling the same functions
 * and never notices.
 *
 * If a page imported `src/content/data.ts` directly, that page would have to be
 * rewritten when the database arrives. Multiply by every page and the "add an
 * admin" change becomes "rewrite the site". So: pages import from here, never
 * from src/content/.
 *
 * Why every function is `async` even though reading a file is instant:
 * a database call WILL be async. Declaring these async now means the later swap
 * changes this file only. Adding `await` to every call site later would be
 * exactly the churn this design exists to prevent.
 */

import {
  blogPosts,
  hackathonWins,
  openSourceContributions,
  packages,
  personalProjects,
  profile,
  publications,
  readingNotes,
  talks,
  workProjects,
} from "@/content/data";
import type {
  BlogPost,
  HackathonWin,
  OpenSourceContribution,
  Package,
  PersonalProject,
  Profile,
  Publication,
  ReadingNote,
  Talk,
  WorkProject,
} from "@/content/types";

/** Newest first, by any ISO date field. */
function byDateDesc<T>(items: T[], getDate: (item: T) => string): T[] {
  return [...items].sort((a, b) => getDate(b).localeCompare(getDate(a)));
}

/**
 * Featured items first, then padded with the rest (in whatever order `items`
 * arrives in — pass a pre-sorted array if that matters) up to `limit`.
 *
 * The padding matters: marking just 1 item featured out of 3 still fills a
 * 2-card homepage quadrant, so a section never looks sparse because curation
 * hasn't caught up with content yet. Zero featured items falls all the way
 * through to "first `limit` items" — the empty-flag scenario the content
 * model requires.
 */
function featuredOrRecent<T extends { featured?: boolean }>(
  items: T[],
  limit: number,
): T[] {
  const featured = items.filter((item) => item.featured);
  const rest = items.filter((item) => !item.featured);
  return [...featured, ...rest].slice(0, limit);
}

export async function getProfile(): Promise<Profile> {
  return profile;
}

export async function getWorkProjects(): Promise<WorkProject[]> {
  return workProjects;
}

export async function getPersonalProjects(): Promise<PersonalProject[]> {
  return personalProjects;
}

export async function getOpenSourceContributions(): Promise<
  OpenSourceContribution[]
> {
  // `mergedOn` is only set on merged-PR entries; repo-based ones carry `date`
  // instead. Both are real dates, so both sort — the "" fallback only catches
  // an entry with neither, which sorts last rather than throwing.
  return byDateDesc(openSourceContributions, (c) => c.mergedOn ?? c.date ?? "");
}

export async function getPackages(): Promise<Package[]> {
  return byDateDesc(packages, (p) => p.publishedOn);
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  return byDateDesc(blogPosts, (p) => p.publishedOn);
}

export async function getPublications(): Promise<Publication[]> {
  return publications;
}

export async function getTalks(): Promise<Talk[]> {
  return byDateDesc(talks, (t) => t.date);
}

export async function getHackathonWins(): Promise<HackathonWin[]> {
  return byDateDesc(hackathonWins, (h) => h.date);
}

/**
 * Reading notes, newest first.
 *
 * Sorting happens HERE, not in the content file. That's what makes the spec
 * requirement true: a back-dated note added at the end of the array still
 * lands in the right chronological position.
 */
export async function getReadingNotes(): Promise<ReadingNote[]> {
  return byDateDesc(readingNotes, (n) => n.dateRead);
}

/** One note by slug, or null. Used by the note detail route. */
export async function getReadingNote(
  slug: string,
): Promise<ReadingNote | null> {
  return readingNotes.find((note) => note.slug === slug) ?? null;
}

/** Every note slug — feeds generateStaticParams so each note prerenders. */
export async function getReadingNoteSlugs(): Promise<string[]> {
  return readingNotes.map((note) => note.slug);
}

/** Curated homepage selections. */
export async function getFeaturedWorkProjects(limit = 2): Promise<WorkProject[]> {
  return featuredOrRecent(workProjects, limit);
}

export async function getFeaturedPersonalProjects(
  limit = 2,
): Promise<PersonalProject[]> {
  return featuredOrRecent(personalProjects, limit);
}

export async function getFeaturedBlogPosts(limit = 2): Promise<BlogPost[]> {
  return featuredOrRecent(byDateDesc(blogPosts, (p) => p.publishedOn), limit);
}

export async function getRecentReadingNotes(limit = 3): Promise<ReadingNote[]> {
  return (await getReadingNotes()).slice(0, limit);
}

export async function getFeaturedHackathonWins(
  limit = 1,
): Promise<HackathonWin[]> {
  // Source is already byDateDesc-sorted, so the "nothing featured" fallback
  // still shows the most recent win rather than an arbitrary one.
  return featuredOrRecent(await getHackathonWins(), limit);
}

/**
 * A package and a research paper are different shapes, so the homepage's
 * Publications quadrant needs one merged, taggable type to feature across
 * both — the same idea /building/publications already uses with its
 * KindBadge, reused here instead of duplicated.
 */
export type FeaturedPublicationItem =
  | ({ kind: "paper" } & Publication)
  | ({ kind: "package" } & Package);

export async function getFeaturedPublicationItems(
  limit = 1,
): Promise<FeaturedPublicationItem[]> {
  const [pubs, pkgs] = await Promise.all([getPublications(), getPackages()]);
  // Papers first, matching the ordering convention on /building/publications.
  const combined: FeaturedPublicationItem[] = [
    ...pubs.map((item) => ({ kind: "paper" as const, ...item })),
    ...pkgs.map((item) => ({ kind: "package" as const, ...item })),
  ];
  return featuredOrRecent(combined, limit);
}
