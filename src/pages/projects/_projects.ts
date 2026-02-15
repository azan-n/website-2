import type { CollectionEntry } from "astro:content";
import { readingTime } from "reading-time-estimator";
import { getCollection } from "astro:content";

type Project = CollectionEntry<"projects"> & {
  date: Date;
  title: string;
};
/**
 * Default function to get all posts in the projects content library.
 * Posts are sorted by pubDatetime and drafts are filtered out.
 */
export async function getProjectPosts(): Promise<Project[]> {
  const isDev = import.meta.env.DEV;
  return (
    await getCollection(
      "projects",
      isDev ? undefined : ({ data }) => data.publish === true,
    )
  )
    .map((p) => {
      const _m = getPostMetadata(p.filePath);

      if (!_m) {
        throw Error(
          `${p.filePath} has been defined outside project directory conventions.`,
        );
      }

      const project: Project = {
        date: _m.date,
        title: _m.title,
        ...p,
      };
      return project;
    })
    .sort((a, b) => {
      return b.date.getTime() - a.date.getTime();
    });
}

export function getReadingTime(body: string) {
  // if (!body) {
  // throw Error(`Could not compute reading time for empty body: ${body}.`);
  // }
  const time = readingTime(body);
  return time.text.replace(" read", "");
}

export function getPostMetadata(
  filePath?: string,
): { date: Date; title: string } | null {
  // Match the pattern: date-title before /index.md
  const match = filePath?.match(/\/(\d{8}-)(.+?).mdoc$/);
  return match && match[1] && match[2]
    ? { date: yyyymmddToDate(match[1]), title: match[2] }
    : null;
}

export function yyyymmddToDate(dateString: string): Date {
  // Extract year, month, day
  const year = parseInt(dateString.substring(0, 4));
  const month = parseInt(dateString.substring(4, 6)) - 1; // Month is 0-indexed
  const day = parseInt(dateString.substring(6, 8));

  return new Date(year, month, day);
}

export const PROJECTS_DESCRIPTION =
  "Things I've built, broken, and learned from along the way.";
