import { getCollection, type CollectionEntry } from "astro:content";

export function getPlaylistUrl(id: string) {
  return `https://youtube.com/playlist?list=${id}`;
}

export const PLAYLISTS_DESCRIPTION = "Music that soundtracks my life.";

export function formatSongTitle(title: string) {
  return title
    .replace(/\(Official(\s*\w+)+\)/gi, "")
    .replace(/\|\s*Prod.(\s*.+)/gi, "")
    .trim();
}

export function getPlaylistLastUpdate(p: CollectionEntry<"playlists">) {
  const lastAddedTrackDate = p.data.playlist_items.items
    ?.map((i) => i.snippet.publishedAt)
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())[0];
  return lastAddedTrackDate ?? p.data.snippet.publishedAt;
}

export async function getPlaylists() {
  return (await getCollection("playlists")).sort(
    (a, b) =>
      new Date(b.data.snippet.publishedAt).getTime() -
      new Date(a.data.snippet.publishedAt).getTime(),
  );
}
