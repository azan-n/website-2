import { getCollection } from "astro:content";

// export const NOTES_DESCRIPTION = "Notes from things I have done.";
export function getNoteMetadata(filePath?: string) {
  if (!filePath) {
    throw Error("Filepath empty for note.");
  }
  const match = filePath?.match(/\d{8}\s(.+)\.mdoc$/);

  return match && match[1] ? { title: match[1] } : null;
}

export async function getNotes() {
  return (await getCollection("notes", (n) => n.data.publish))
    .map((n) => ({
      ...n,
      ...getNoteMetadata(n.filePath),
    }))
    .filter((n) => n.title)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}
