import rss, { type RSSFeedItem } from "@astrojs/rss";
import { SITE } from "../../site.config";
import { PHOTOS_DESCRIPTION, photosCollection } from "./_photos";


export async function GET() {
    return rss({
        title: "Azan's photos",
        description: PHOTOS_DESCRIPTION,
        site: `${SITE.url}/photos`,
        items: await getPhotosRss(),
    });
}

export async function getPhotosRss(): Promise<RSSFeedItem[]> {
    const sortedPhotos = photosCollection.sort(
        (a, b) => b.data.date.getTime() - a.data.date.getTime(),
    );
    return sortedPhotos.map((entry) => ({
        link: `/photos/${entry.id}`,
        title: entry.title,
        pubDate: entry.data.date,
        description: entry.body || undefined,
        author: SITE.author,
    }))
}