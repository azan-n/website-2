import rss from "@astrojs/rss";
import { SITE } from "../site.config";
import { getLibraryRss } from "./library/rss.xml";
import { getPlaylistsRss } from "./playlists/rss.xml";
import { getProjectRss } from "./projects/rss.xml";
import { getNotesRss } from "./notes/rss.xml";
import { getPhotosRss } from "./photos/rss.xml";

export async function GET() {
  // Fetch all collections
  const [library, playlists, projects, notes, photos] = await Promise.all([
    getLibraryRss(),
    getPlaylistsRss(),
    getProjectRss(),
    getNotesRss(),
    getPhotosRss()
  ]);

  // Combine and sort all items by date
  const allItems = [...library, ...playlists, ...projects, ...notes, ...photos].sort(
    (a, b) => (b.pubDate?.getTime() ?? 0) - (a.pubDate?.getTime() ?? 0),
  );

  return rss({
    title: "Azan's feed",
    description: "Everything from Azan's website.",
    site: SITE.url,
    items: allItems,
  });
}
