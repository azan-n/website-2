import rss, { type RSSFeedItem } from "@astrojs/rss";
import { SITE } from "../../site.config";
import {
  getPlaylistLastUpdate,
  getPlaylists,
  getPlaylistUrl,
  PLAYLISTS_DESCRIPTION,
} from "./_playlists";

export async function GET() {
  
  return rss({
    title: "Azan's playlists",
    description: PLAYLISTS_DESCRIPTION,
    site: `${SITE.url}/playlists`,
    items: await getPlaylistsRss(),
  });
}

export async function getPlaylistsRss(): Promise<RSSFeedItem[]> {
  return (await getPlaylists()).map((p) => ({
    link: getPlaylistUrl(p.data.id),
    title: p.data.snippet.localized.title,
    pubDate: new Date(p.data.snippet.publishedAt),
    author: SITE.author,
    description: p.data.snippet.description,
    "atom:updated": new Date(getPlaylistLastUpdate(p)),
  }));
}

