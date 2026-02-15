import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import { SITE } from "./src/site.config";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";
import markdoc from "@astrojs/markdoc";

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  integrations: [
    icon(),
    sitemap(),
    markdoc({
      allowHTML: true,
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
