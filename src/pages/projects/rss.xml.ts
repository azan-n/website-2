import rss, { type RSSFeedItem } from "@astrojs/rss";
import { SITE } from "../../site.config";
import { getProjectPosts, PROJECTS_DESCRIPTION } from "./_projects";

export async function GET() {
  return rss({
    title: "Azan's projects",
    description: PROJECTS_DESCRIPTION,
    site: `${SITE.url}/projects`,
    items: await getProjectRss(),
  });

}
export async function getProjectRss(): Promise<RSSFeedItem[]> {
  return (await getProjectPosts()).map((p) => {
    return {
      link: `${SITE.url}/projects/${p.id}`,
      title: p.title,
      pubDate: p.date,
      author: SITE.author,
      description: p.data.description,
      categories: p.data.tags,
    };
  });
}
