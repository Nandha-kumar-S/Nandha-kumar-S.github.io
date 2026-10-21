"use client";

/**
 * Primary navigation.
 *
 * The labels form a set of verbs — Building, Writing, Reading, Speaking — so the
 * nav reads as things a person does rather than as content categories.
 *
 * Client component only because the active link depends on the current URL.
 * Keep "use client" this far down the tree; everything above it stays static.
 */

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/building", label: "Building" },
  { href: "/writing", label: "Writing" },
  { href: "/reading", label: "Reading" },
  { href: "/speaking", label: "Speaking" },
  { href: "/about", label: "About" },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary">
      <ul className="flex flex-wrap items-center gap-x-5 gap-y-1">
        {NAV_ITEMS.map((item) => {
          // Nested routes keep their parent highlighted, so
          // /reading/<slug> still marks "Reading" as current.
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={
                  isActive
                    ? "text-ink underline decoration-1 underline-offset-[5px]"
                    : "text-ink-muted transition-colors hover:text-ink"
                }
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
