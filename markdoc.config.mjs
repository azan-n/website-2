import { component, defineMarkdocConfig, nodes } from "@astrojs/markdoc/config";
import shiki from "@astrojs/markdoc/shiki";
import Markdoc from "@markdoc/markdoc";

export default defineMarkdocConfig({
  extends: [
    shiki({
      theme: "catppuccin-macchiato",
      wrap: true,
      excludeLangs: ["mermaid", "math"],
    }),
  ],
  tags: {
    figure: {
      attributes: {
        src: { type: String, required: true },
        alt: { type: String },
        caption: { type: String },
      },
      render: component("./src/components/MarkdocFigure.astro"),
    },
    d2: {
      attributes: {
        sketch: { type: Boolean, default: false },
        theme: { type: Number, default: 200 },
      },
      render: component("./src/components/D2.astro"),
    },
    crosslink: {
      attributes: {
        collection: { type: String, required: true },
        id: { type: String, required: true },
      },
      render: component("./src/components/MarkdocLink.astro"),
    },
    pie: {
      attributes: {
        data: { type: Object, required: true },
        title: { type: String },
      },
      render: component("./src/components/PieChart.astro"),
    },
  },
  // No wrapping in article again
  nodes: {
    document: {
      ...nodes.document, // Apply defaults for other options
      render: null,
    },
  },
});
