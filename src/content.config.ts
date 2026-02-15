import { glob, type Loader } from "astro/loaders";
import { defineCollection, z } from "astro:content";
import { slug } from "github-slugger";
import fs from "node:fs";
import path from "node:path";

// Custom loader for photos - creates entries for all image folders
const photosLoader: Loader = {
  name: "photos-loader",
  load: async ({ store, parseData, generateDigest }) => {
    const baseDir = "./src/data/Images";
    const folders = fs
      .readdirSync(baseDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name);

    for (const folder of folders) {
      const indexPath = path.join(baseDir, folder, "index.md");
      const hasCaption = fs.existsSync(indexPath);
      const body = hasCaption ? fs.readFileSync(indexPath, "utf-8") : undefined;

      // Parse date from folder name (YYYYMM)
      const year = parseInt(folder.slice(0, 4), 10);
      const month = parseInt(folder.slice(4, 6), 10) - 1;
      const date = new Date(year, month);

      const data = await parseData({
        id: folder,
        data: { date },
      });

      store.set({
        id: folder,
        data,
        body,
        digest: generateDigest(body ?? folder),
      });
    }
  },
};

const ProjectsCollection = defineCollection({
  loader: glob({
    pattern: "**/*.mdoc",
    base: "./src/data/Projects",
    generateId: (o) => {
      // Entry is like "20220202-All the ambigrams in my notebooks/20220202-All the ambigrams in my notebooks.mdoc"
      // Extract just the filename without extension
      const filename =
        o.entry.split("/").pop()?.replace(".mdoc", "") ?? o.entry;
      return slug(filename);
    },
  }),
  schema: ({ image }) =>
    z
      .object({
        description: z.string(),
        publish: z.boolean().optional(),
        image: image(),
        tags: z.optional(z.array(z.string())),
      })
      .strict(),
});

const LibraryCollection = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/data/Clippings",
    generateId: (o) => slug(o.data.source as string),
  }),
  schema: z.object({
    complete: z.date().optional(),
    publish: z.boolean().optional(),
    in_progress: z.boolean().optional(),
    source: z.string().url(),
    tags: z.string().array().optional(),
  }),
});

const NotesCollection = defineCollection({
  loader: glob({
    pattern: "**/*.mdoc",
    base: "./src/data/Notes",
  }),
  schema: z.object({
    publish: z.boolean().optional(),
  }),
});

const ThumbnailSchema = z
  .object({
    url: z.string().url(),
    width: z.number().int().optional(),
    height: z.number().int().optional(),
  })
  .passthrough(); // allow extra fields in a thumbnail if present

const ThumbnailsSchema = z
  .object({
    default: ThumbnailSchema.optional(),
    medium: ThumbnailSchema.optional(),
    high: ThumbnailSchema.optional(),
    standard: ThumbnailSchema.optional(),
    maxres: ThumbnailSchema.optional(),
  })
  .passthrough();

/* snippet for playlist and playlist item */
const PlaylistSnippetSchema = z
  .object({
    publishedAt: z.string().datetime(),
    channelId: z.string(),
    title: z.string(),
    description: z.string().optional(),
    thumbnails: ThumbnailsSchema.optional(),
    channelTitle: z.string().optional(),
    localized: z.object({
      title: z.string(),
      description: z.string().optional(),
    }),
  })
  .passthrough();

const ResourceIdSchema = z
  .object({
    kind: z.literal("youtube#video"),
    videoId: z.string(),
  })
  .passthrough();

const PlaylistItemSnippetSchema = z
  .object({
    publishedAt: z.string().datetime(),
    channelId: z.string().optional(),
    title: z.string(),
    description: z.string().optional(),
    thumbnails: ThumbnailsSchema.optional(),
    channelTitle: z.string().optional(),
    playlistId: z.string().optional(),
    position: z.number().int().optional(),
    resourceId: ResourceIdSchema,
    videoOwnerChannelTitle: z.string().optional(),
    videoOwnerChannelId: z.string().optional(),
  })
  .passthrough();

/* playlist item */
const PlaylistItemSchema = z
  .object({
    kind: z.literal("youtube#playlistItem"),
    etag: z.string().optional(),
    id: z.string().optional(),
    snippet: PlaylistItemSnippetSchema,
  })
  .passthrough();

/* playlist items list response */
const PlaylistItemListResponseSchema = z
  .object({
    kind: z.literal("youtube#playlistItemListResponse"),
    etag: z.string().optional(),
    items: z.array(PlaylistItemSchema).optional(),
    pageInfo: z
      .object({
        totalResults: z.number().int().optional(),
        resultsPerPage: z.number().int().optional(),
      })
      .optional(),
  })
  .passthrough();

/* contentDetails */
const ContentDetailsSchema = z
  .object({
    itemCount: z.number().int().optional(),
  })
  .passthrough();

export const PlaylistSchema = z
  .object({
    kind: z.literal("youtube#playlist"),
    etag: z.string().optional(),
    id: z.string(),
    snippet: PlaylistSnippetSchema,
    contentDetails: ContentDetailsSchema.optional(),
    playlist_items: PlaylistItemListResponseSchema,
  })
  .passthrough(); // passthrough so other YouTube fields don't fail validation

const PlaylistsCollection = defineCollection({
  loader: glob({
    pattern: "**/*.json",
    base: "./src/playlists",
  }),
  schema: PlaylistSchema,
});

const Synthfarm2025Collection = defineCollection({
  loader: glob({
    pattern: "**/*.json",
    base: "./src/data/Synthfarm2025",
  }),
  schema: z.object({
    name: z.string(),
    url: z.string().url(),
  }),
});

const PhotosCollection = defineCollection({
  loader: photosLoader,
  schema: z.object({
    date: z.date(),
  }),
});

export const collections = {
  projects: ProjectsCollection,
  library: LibraryCollection,
  notes: NotesCollection,
  playlists: PlaylistsCollection,
  synthfarm2025: Synthfarm2025Collection,
  photos: PhotosCollection,
};
