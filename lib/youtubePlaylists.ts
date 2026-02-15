import 'dotenv/config'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from "node:path";
import { google, youtube_v3 } from "googleapis";

const YOUTUBE_CHANNEL_ID = "UCmsKnHGCovc_WyXXBibVeBA";
const API_KEY = process.env.GOOGLE_API_KEY;

if (!API_KEY) {
    throw Error(`API_KEY missing in process.env: ${JSON.stringify(process.env)}`)
}

const YOUTUBE_API = google.youtube({
    version: "v3",
    auth: API_KEY,
});

const _playlistsResponse = await YOUTUBE_API.playlists.list({
    part: ["contentDetails", "snippet"],
    channelId: YOUTUBE_CHANNEL_ID,
    maxResults: 100,
});

const playlists: youtube_v3.Schema$PlaylistListResponse = _playlistsResponse.data;

export type CompletePlaylist = youtube_v3.Schema$Playlist & {
    playlist_items?: youtube_v3.Schema$PlaylistItemListResponse;
};

async function setPlaylistItems(lists: youtube_v3.Schema$PlaylistListResponse) {
    const newList: CompletePlaylist[] = [];
    for (const l of lists?.items ?? []) {
        const newL: CompletePlaylist = { ...l, playlist_items: {} };

        if (l.id) {
            const playlistItem = await YOUTUBE_API.playlistItems.list({
                playlistId: l.id,
                part: ['snippet'],
                maxResults: 50,
            });

            newL.playlist_items = playlistItem.data;
        }

        newList.push(newL);
    }
    return newList;
}

async function writePerPlaylistFiles(playlistsWithItems: CompletePlaylist[], outDir = path.join('src', 'playlists')) {
    mkdirSync(outDir, { recursive: true });

    for (const pl of playlistsWithItems) {
        const id = pl.id;
        const filename = `${pl.snippet?.localized?.title}-${id}.json`;
        const filepath = path.join(outDir, filename);

        // If file exists: read it, preserve all top-level fields except overwrite playlist_items
        if (existsSync(filepath)) {
            try {
                const existingRaw = readFileSync(filepath, 'utf8');
                const existing = JSON.parse(existingRaw) as CompletePlaylist;

                existing.playlist_items = pl.playlist_items ?? {};
                if (pl.snippet) existing.snippet = pl.snippet;

                writeFileSync(filepath, JSON.stringify(existing, null, 2), { flag: 'w' });
                console.log(`Updated playlist file: ${filename}`);
            } catch (err) {
                console.error(`Failed to update ${filename}, writing fresh file instead.`, err);
                writeFileSync(filepath, JSON.stringify(pl, null, 2), { flag: 'w' });
            }
        } else {
            // New file: write entire playlist object
            writeFileSync(filepath, JSON.stringify(pl, null, 2), { flag: 'w' });
            console.log(`Created playlist file: ${filename}`);
        }
    }
}

const output = await setPlaylistItems(playlists);
await writePerPlaylistFiles(output);
