import { useQuery } from '@tanstack/react-query';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Song {
  id: string;
  title: string;
  album: string;
  year: number;
}

export interface Album {
  id: string;
  name: string;
  year: number;
  songCount: number;
}

export interface Artist {
  id: string;
  name: string;
  songCount: number;
  popularSongs: Song[];
  albums: Album[];
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_ARTISTS: Record<string, Artist> = {
  '1': {
    id: '1',
    name: 'Taylor Swift',
    songCount: 203,
    popularSongs: [
      { id: 'tswift-s1', title: 'Anti-Hero',     album: 'Midnights', year: 2022 },
      { id: 'tswift-s2', title: 'Cruel Summer',  album: 'Lover',     year: 2019 },
      { id: 'tswift-s3', title: 'Blank Space',   album: '1989',      year: 2014 },
      { id: 'tswift-s4', title: 'Shake It Off',  album: '1989',      year: 2014 },
      { id: 'tswift-s5', title: 'Love Story',    album: 'Fearless',  year: 2008 },
    ],
    albums: [
      { id: 'tswift-a1', name: 'Midnights', year: 2022, songCount: 13 },
      { id: 'tswift-a2', name: 'Folklore',  year: 2020, songCount: 16 },
      { id: 'tswift-a3', name: '1989',      year: 2014, songCount: 13 },
      { id: 'tswift-a4', name: 'Lover',     year: 2019, songCount: 18 },
      { id: 'tswift-a5', name: 'Fearless',  year: 2008, songCount: 13 },
    ],
  },
  '2': {
    id: '2',
    name: 'Beyoncé',
    songCount: 187,
    popularSongs: [
      { id: 'beyonce-s1', title: 'Crazy in Love',  album: 'Dangerously in Love', year: 2003 },
      { id: 'beyonce-s2', title: 'Halo',           album: 'I Am... Sasha Fierce', year: 2008 },
      { id: 'beyonce-s3', title: 'Single Ladies',  album: 'I Am... Sasha Fierce', year: 2008 },
    ],
    albums: [
      { id: 'beyonce-a1', name: 'Renaissance',         year: 2022, songCount: 16 },
      { id: 'beyonce-a2', name: 'Lemonade',            year: 2016, songCount: 12 },
      { id: 'beyonce-a3', name: 'I Am... Sasha Fierce', year: 2008, songCount: 13 },
    ],
  },
};

// ─── Repository ───────────────────────────────────────────────────────────────

async function fetchArtistById(artistId: string): Promise<Artist> {
  // Simulate network latency
  await new Promise<void>(resolve => setTimeout(() => resolve(), 600));

  const artist = MOCK_ARTISTS[artistId];
  if (!artist) {
    throw new Error(`Artist with id "${artistId}" not found`);
  }
  return artist;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useArtistById(artistId: string) {
  return useQuery<Artist, Error>({
    queryKey: ['artist', artistId],
    queryFn: () => fetchArtistById(artistId),
    staleTime: 5 * 60 * 1000, // 5 min
  });
}