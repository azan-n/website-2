import rss, { type RSSFeedItem } from "@astrojs/rss";
import { SITE } from "../../site.config";
import { getNotes } from "./_notes";

export async function GET() {
  return rss({
    title: "Azan's notes",
    description: "",
    site: `${SITE.url}/notes`,
    items: await getNotesRss(),
  });
}

export async function getNotesRss(): Promise<RSSFeedItem[]> {
  return (await getNotes()).map((n) => {
    return {
      link: `${SITE.url}/notes/${n.id}`,
      title: n.title,
      pubDate: n.date,
      author: SITE.author,
    };
  });
}

