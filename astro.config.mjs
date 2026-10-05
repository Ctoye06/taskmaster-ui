// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: "https://callum-mohan.github.io",
  base: "/taskmaster-ui",
  vite: {
    plugins: [tailwindcss()],
  },
});
