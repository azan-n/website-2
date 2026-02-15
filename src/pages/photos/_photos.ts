import { getCollection } from "astro:content";

function formatDateForPhotoPost(date: Date): string {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export const PHOTOS_TITLE = "Photos";
export const PHOTOS_DESCRIPTION = "A collection of pictures from my life";

const _photosCollection = await getCollection("photos");
const images = import.meta.glob<{ default: ImageMetadata }>(
    "/src/data/Images/**/*.{jpg,jpeg,png,webp,gif}",
    { eager: true },
);

export const photosCollection = _photosCollection.map((entry) => {
    const slug = entry.id;
    const folderImages = Object.entries(images)
        .filter(([path]) => path.includes(`/${slug}/`))
        .map(([, module]) => module.default);

    return {
        title: formatDateForPhotoPost(entry.data.date),
        slug,
        folderImages,
        thumbnail: folderImages[0],
        ...entry
    };
});