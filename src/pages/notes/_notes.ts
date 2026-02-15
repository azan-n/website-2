import { getCollection } from "astro:content";
import { yyyymmddToDate } from "../projects/_projects";

// export const NOTES_DESCRIPTION = "Notes from things I have done.";
function getNoteMetadata(filePath?: string) {
  if (!filePath) {
    throw Error("Filepath empty for note.");
  }

  const match = filePath?.match(/\/(\d{8})\s(.+?).mdoc$/);

  return match && match[1] && match[2]
    ? { date: yyyymmddToDate(match[1]), title: match[2] }
    : null;
}

export async function getNotes() {
  return (await getCollection("notes", (n) => n.data.publish))
    .map((n) => ({
      ...n,
      ...getNoteMetadata(n.filePath),
    }))
    .filter((n) => n.title && n.date)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}
