/**
 * Content types for the public portfolio site.
 *
 * These are the shapes the whole site is built on. Because they're typed,
 * a missing `title` or a malformed date fails `npm run build` instead of
 * rendering a blank card in production. That build-time check is doing the
 * job a database schema would normally do.
 *
 * UNIFORM COLUMNS (docs/items_column.md): every content type below carries
 * the same conceptual set of fields — `title`, a description, a date,
 * `highlight`, `featured`, and (where relevant) a `tags` array and a link.
 * "Uniform" means every type HAS the concept and the field is named
 * consistently for its purpose (`featured`, `highlight`) — it does not mean
 * every type is forced into one identical shape. A description, for
 * instance, is 2–3 labeled parts whose names are class-specific (see the
 * note on WorkProject.problem below) — that's more useful to a reader than
 * one undifferentiated paragraph would be, and TypeScript already gives you
 * "configurable per class" for free: each type just declares its own named
 * fields. `item_class` similarly needs no stored field — the TS type itself
 * (and which array it lives in) already is the class.
 */

/** Anything that links out to an external page (GitHub, Medium, LinkedIn...). */
export type ExternalLink = {
  label: string;
  url: string;
};

/**
 * One labelled row of the CV's skills block.
 *
 * Grouped rather than one flat list so every entry sits at the same level of
 * abstraction within its row — a reviewer scanning for "does this person
 * fine-tune models" finds the answer in one place instead of parsing forty
 * comma-separated words.
 */
export type SkillGroup = {
  label: string;
  items: string[];
};

/**
 * Work done at an employer. Deliberately sanitized: technique and problem
 * class only. No client names, no business metrics, no internal codenames.
 */
export type WorkProject = {
  slug: string;
  title: string;
  /**
   * The employer this was built at. Only WorkProject carries it — a personal
   * project has no one to be associated with, and a hackathon entry names its
   * event instead. Shown on the tile alongside the period.
   */
  associatedWith?: string;
  /** e.g. "2025" or "2024 – 2025" */
  period: string;
  /**
   * One or two lines answering "what is this?", shown on the collapsed tile.
   *
   * The 3-part breakdown below is too long for a listing — five projects of
   * it is a wall of text nobody scans. The tile shows this; the breakdown
   * lives behind a disclosure toggle.
   */
  summary: string;
  /**
   * Two ways to tell the expanded story — exactly one should be set.
   *
   * The default is the labelled breakdown every other content type uses:
   * `problem` (the "description" column, docs/items_column.md — the work
   * addressed), `approach` (what was actually built or tried) and `outcome`
   * (result or learning, safe to omit if nothing publishable).
   *
   * `narrative` is the alternative: free-form paragraphs with no field
   * labels, for a story that reads better as continuous prose than as three
   * dissected parts. Reserved for entries where that's true — most should
   * still use problem/approach/outcome, since that's what the rest of the
   * site is built on.
   */
  problem?: string;
  approach?: string;
  outcome?: string;
  /** See the note above `problem`. Paragraphs separated by a blank line. */
  narrative?: string;
  tech: string[];
  /**
   * Marks this for the homepage's curated strip. `getFeatured*` in
   * lib/content.ts shows featured items first, then pads with the most
   * recent non-featured ones — a quadrant never looks sparse just because
   * curation hasn't caught up with content. Same field name and meaning on
   * every content type below — see the TODO in docs/PLANNING.md about
   * keeping that uniform once this moves to a database.
   */
  featured?: boolean;
  /**
   * One short standout line for the tile — a headline metric or the single
   * most important fact (e.g. "Cut manual review time by half"). Distinct
   * from `featured`: this is display text, `featured` is the boolean that
   * decides what's shown. Optional, and the UI decides per content type
   * whether/where to render it.
   */
  highlight?: string;
  /** Extended narrative. When absent, renders as a normal tile. */
  caseStudy?: CaseStudy;
};

/**
 * Self-directed work. Unlike WorkProject, these can link to source.
 *
 * Same problem/approach/outcome breakdown as WorkProject (docs/items_column.csv)
 * — structurally identical now, differing only in repoUrl/demoUrl vs. the
 * sanitized, unlinked shape a work project needs.
 */
export type PersonalProject = {
  slug: string;
  title: string;
  period: string;
  /** See the note on WorkProject.summary — shown on the collapsed tile. */
  summary: string;
  /** See the note on WorkProject.problem — this type's 3-part description. */
  problem: string;
  approach: string;
  outcome?: string;
  tech: string[];
  repoUrl?: string;
  demoUrl?: string;
  featured?: boolean;
  /** See the note on WorkProject.highlight. */
  highlight?: string;
  caseStudy?: CaseStudy;
};

/** The long-form writeup attached to a featured project. */
export type CaseStudy = {
  problem: string;
  approach: string;
  outcome: string;
};

/** A merged PR into someone else's project. */
/**
 * Work done on, or for, someone else's project.
 *
 * Covers two shapes: a change merged upstream (has `prUrl` + `mergedOn`), and
 * work built *for* an upstream project that lives in its own repo (has
 * `repoUrl`, no merge date). Both are optional so either shape type-checks;
 * an entry should carry at least one URL.
 */
export type OpenSourceContribution = {
  slug: string;
  /** The upstream project this relates to. */
  project: string;
  title: string;
  /** What the change actually did. */
  description: string;
  /** Set when this is a merged pull request. */
  prUrl?: string;
  /** ISO date the PR was merged. Pairs with `prUrl`. */
  mergedOn?: string;
  /** Set when the work lives in its own repository instead. */
  repoUrl?: string;
  /**
   * ISO date for the repo-shaped entries, which have no merge to date from.
   * Kept separate from `mergedOn` rather than overloading it, because the two
   * mean different things — "a maintainer accepted this on date X" is a
   * stronger claim than "I built this around date X", and the card labels
   * them differently. Sorting falls back to this when `mergedOn` is absent.
   */
  date?: string;
  /** See the note on WorkProject.featured. */
  featured?: boolean;
  /** See the note on WorkProject.highlight. */
  highlight?: string;
};

/** Something published to a registry under your own name. */
export type Package = {
  slug: string;
  name: string;
  registry: "PyPI" | "npm" | "GitHub";
  description: string;
  /** The registry listing — where someone installs it from. */
  url: string;
  /**
   * Source, when it's public. Separate from `url` for the same reason
   * HackathonWin splits `repoUrl` from `link`: a registry page answers
   * "how do I install this", a repository answers "let me read it" — and
   * a reviewer almost always wants the second.
   */
  repoUrl?: string;
  publishedOn: string;
  /** See the note on WorkProject.featured. */
  featured?: boolean;
  /** See the note on WorkProject.highlight. */
  highlight?: string;
};

/** A blog post that lives on Medium. We store the summary, not the body. */
export type BlogPost = {
  slug: string;
  title: string;
  publishedOn: string;
  summary: string;
  url: string;
  /**
   * The Medium publication that ran it, when it wasn't self-published.
   * Optional because most posts are self-published — but a post an editor
   * accepted is a different claim from one you posted to your own profile,
   * and the URL alone (/ai-in-plain-english/ vs /@handle/) makes that
   * distinction too quietly for a reader to notice.
   */
  publication?: string;
  featured?: boolean;
  /** See the note on WorkProject.highlight. */
  highlight?: string;
};

/** Reserved for the in-progress paper. Empty array renders nothing. */
export type Publication = {
  slug: string;
  title: string;
  venue: string;
  year: string;
  /** Single-part description — no 3-way breakdown for this type. */
  description: string;
  url?: string;
  status: "published" | "under-review" | "in-progress";
  /** See the note on WorkProject.featured. */
  featured?: boolean;
  /** See the note on WorkProject.highlight. */
  highlight?: string;
};

/** A guest lecture or poster presentation. */
export type Talk = {
  slug: string;
  title: string;
  venue: string;
  date: string;
  /** Single-part description — no 3-way breakdown for this type. */
  summary: string;
  /** Who was in the room. */
  audience?: string;
  link?: ExternalLink;
  /** See the note on WorkProject.featured. */
  featured?: boolean;
  /** See the note on WorkProject.highlight. */
  highlight?: string;
};

export type HackathonWin = {
  slug: string;
  event: string;
  /** e.g. "1st place of 120 teams" */
  placement: string;
  date: string;
  /** See the note on WorkProject.summary — shown on the collapsed tile. */
  summary: string;
  /**
   * See the note on WorkProject.problem — this type's 3-part description
   * (the challenge/theme, what was built, and the result — distinct from
   * `placement`, which is the competitive outcome specifically).
   */
  problem: string;
  approach: string;
  outcome?: string;
  /** Source for the build, when it's public. */
  repoUrl?: string;
  /**
   * A secondary link — usually the write-up or announcement post. Separate
   * from `repoUrl` because a hackathon entry often has both, and they answer
   * different questions: `repoUrl` is "show me the code", `link` is "show me
   * that this happened".
   */
  link?: ExternalLink;
  /** See the note on WorkProject.featured. */
  featured?: boolean;
  /** See the note on WorkProject.highlight. */
  highlight?: string;
};

/**
 * One entry in the reading log. Mirrors the fields from the existing
 * Google Doc, minus the serial number (the slug identifies it now).
 */
export type ReadingNote = {
  slug: string;
  /** ISO date (YYYY-MM-DD). Sorting depends on this, not on array order. */
  dateRead: string;
  paperTitle: string;
  paperUrl: string;
  /** See the note on WorkProject.problem — this type's 3-part description. */
  problem: string;
  solution: string;
  /** Personal understanding, in your own words. Optional by design. */
  takeaway?: string;
  tags?: string[];
  /** See the note on WorkProject.featured. Unused today — not homepage-featured — but present for uniformity, per docs/items_column.md. */
  featured?: boolean;
  /** See the note on WorkProject.highlight. */
  highlight?: string;
};

export type ExperienceEntry = {
  company: string;
  role: string;
  period: string;
  summary: string;
  /**
   * Which WorkProjects were built in this role, by slug. The CV nests each
   * project under the title that held it, which is what turns one employer
   * into a visible progression.
   *
   * An explicit list rather than derived from dates: `ExperienceEntry.period`
   * ("Sep 2024 — Present") and `WorkProject.period` ("2024 — 2025") are
   * free-form strings in different formats, so any matching would be string
   * parsing that breaks the first time one is edited.
   */
  projectSlugs?: string[];
};

export type EducationEntry = {
  institution: string;
  qualification: string;
  period: string;
  detail?: string;
};

/** Single record: identity, bio, contact, and external profiles. */
export type Profile = {
  name: string;
  /** The one-line positioning statement, shown under the name on the homepage. */
  positioning: string;
  /**
   * The About page's opening. Paragraphs are separated by a blank line and
   * split at render time, so this stays plain editable text rather than an
   * array or a markup string.
   */
  bio: string;
  /**
   * Two short paragraphs for the homepage, which fits one screen and so has
   * room for far less than the full `bio`. A separate field rather than a
   * slice of `bio`, so editing one never silently rewrites the other.
   * Paragraphs separated by a blank line, same as `bio`.
   */
  heroIntro: string;
  /**
   * "What I do" on the homepage — claims about how the work gets done, in the
   * order it actually happens, not a list of technologies.
   *
   * Plain strings on purpose. These carry no date, link or evidence, and
   * giving them a richer shape would invite turning the homepage back into
   * another listing page. Order is array order; the list is bulleted rather
   * than numbered, so reordering needs no renumbering.
   */
  capabilities: string[];
  email: string;
  cvUrl: string;
  /**
   * CV-only fields. The CV is one page for a named recipient, so it carries
   * things the public site deliberately doesn't (a phone number) and says
   * them at a different length (`cvSummary` vs `bio`).
   */
  phone: string;
  /** Printed on the CV so a PDF on someone's desktop can find its way back. */
  siteUrl: string;
  /**
   * Three sentences at the top of the CV, condensed from `bio`. Not derived
   * from it at runtime: a CV opener has to stand alone in a way a slice of
   * four paragraphs wouldn't.
   */
  cvSummary: string;
  skills: SkillGroup[];
  profiles: ExternalLink[];
  experience: ExperienceEntry[];
  education: EducationEntry[];
};
