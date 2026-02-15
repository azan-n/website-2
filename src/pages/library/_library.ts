import { getCollection } from "astro:content";

export const LIBRARY_DESCRIPTION = "A digital library of media I've consumed and recommend.";

export async function getLibrary() {
    return (await getCollection("library"))
        .filter((d) => d.data.publish && d.data.complete)
        // @ts-expect-error y u like this TS
        .sort((a, b) => b.data.complete - a.data.complete);
}

// TODO, make this generic???
export function getFilenameFromPath(path?: string): string {
    if (!path) {
        throw Error('No path found for file.')
    }
    return path.replace(/src\/data\/Clippings\/(.+)\.md/g, "$1");
}