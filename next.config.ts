import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The repo root holds planning docs; the app lives in web/.
  // Pin Turbopack's root here so it stops looking for a lockfile above us.
  turbopack: {
    root: __dirname,
  },

  /**
   * The five /building groups used to be five routes. They're now anchors on a
   * single page, so the old URLs are redirected to their section rather than
   * 404ing — anything already linked or bookmarked still lands correctly.
   *
   * Permanent (308) because this is a settled move, not a trial. If a group is
   * split back out to its own route later, delete its entry here.
   */
  async redirects() {
    return [
      { source: "/building/experience", destination: "/building#work", permanent: true },
      { source: "/building/personal", destination: "/building#personal", permanent: true },
      { source: "/building/open-source", destination: "/building#open-source", permanent: true },
      { source: "/building/hackathons", destination: "/building#hackathons", permanent: true },
      { source: "/building/publications", destination: "/building#publications", permanent: true },
    ];
  },
};

export default nextConfig;
