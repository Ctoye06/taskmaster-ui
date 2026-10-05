// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  // When deploying to GitHub Pages at a project URL
  // (e.g. https://callum-mohan.github.io/taskmaster-ui), uncomment and set:
  //   site: "https://callum-mohan.github.io",
  //   base: "/taskmaster-ui",
  // and make internal links base-aware (prefix with import.meta.env.BASE_URL)
  // so navigation resolves correctly under the sub-path.
  vite: {
    plugins: [tailwindcss()],
  },
});
