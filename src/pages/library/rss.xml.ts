import rss from "@astrojs/rss";
import { SITE } from "../../site.config";
import {
  getFilenameFromPath,
  getLibrary,
  LIBRARY_DESCRIPTION,
} from "./_library";

export async function GET() {
  return rss({
    title: "Azan's library",
    description: LIBRARY_DESCRIPTION,
    site: `${SITE.url}/library`,
    items: await getLibraryRss(),
  });
}
export async function getLibraryRss() {
  return (await getLibrary()).map((p) => ({
    link: p.data.source,
    title: getFilenameFromPath(p.filePath),
    pubDate: p.data.complete,
    author: SITE.author,
  }));
}

