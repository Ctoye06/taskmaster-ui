// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://callum-mohan.github.io",
  base: "/taskmaster-ui",
  integrations: [
    sitemap({
      // The head-to-head pages are every ordered pair of players (~600 URLs).
      // Keep them crawlable but out of the sitemap so it stays focused on the
      // canonical pages; the /compare/ landing page is retained.
      filter: (page) => !/\/compare\/[^/]+\/[^/]+\//.test(page),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
