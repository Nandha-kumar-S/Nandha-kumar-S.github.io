import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The repo root holds planning docs; the app lives in web/.
  // Pin Turbopack's root here so it stops looking for a lockfile above us.
  turbopack: {
    root: __dirname,
  },

  /**
   * Static export — `next build` writes plain HTML/CSS/JS to `out/`, which is
   * what GitHub Pages serves. Nothing here needed a server: every route was
   * already prerendered at build time, there are no route handlers, no
   * middleware, and no dynamic functions.
   *
   * The trade this locks in: an API route, a contact form, ISR or image
   * optimisation would all require moving to a host that runs Node.
   */
  output: "export",

  /**
   * Emit `out/about/index.html` rather than `out/about.html`.
   *
   * GitHub Pages resolves a bare `/about` either way, but a directory with an
   * index is the shape every static host agrees on — it needs no
   * extension-guessing, so the site behaves identically if it ever moves to
   * S3, Cloudflare or a plain nginx.
   */
  trailingSlash: true,

  /*
   * The five /building/* redirects that used to live here are gone: static
   * export can't honour `redirects()`, and those URLs never existed publicly
   * — the site had not been deployed when the five routes were merged into
   * one page, so nothing outside localhost ever linked to them.
   *
   * If a real URL ever needs redirecting on Pages, the only mechanism is an
   * HTML stub in `public/` with a <meta http-equiv="refresh">.
   */
};

export default nextConfig;
