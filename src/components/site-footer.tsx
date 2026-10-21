/**
 * Deliberately just the copyright line.
 *
 * It used to repeat GitHub / LinkedIn / Medium / Email on every page. Contact
 * now lives in exactly one place — the About page — so the links aren't
 * duplicated into the furniture of nine other pages, where a reader who has
 * finished a reading note has no reason to be offered an email address.
 */
export function SiteFooter({ name }: { name: string }) {
  return (
    <footer className="mt-24 border-t border-rule">
      <div className="mx-auto max-w-(--container-wide) px-6 py-8 text-sm text-ink-muted">
        <p>
          © {new Date().getFullYear()} {name}
        </p>
      </div>
    </footer>
  );
}
