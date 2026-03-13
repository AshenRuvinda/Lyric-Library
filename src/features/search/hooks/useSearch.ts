import { useState, useEffect, useMemo } from 'react';
import artistsJson from '@/data/mock/artists.json';
import songsJson   from '@/data/mock/songs.json';
import type { UseSearchParams, UseSearchReturn, SearchResults } from '../types';

// ─── Mock data interfaces ─────────────────────────────────────────────────────
interface MockAlbumItem {
  id: string;
  title: string;
  artistName: string;
  artistId: string;
  songCount: number;
}

interface MockSongItem {
  id: string;
  title: string;
  artistName: string;
  albumTitle: string;
}

interface MockArtistItem {
  id: string;
  name: string;
  songCount: number;
  albums: MockAlbumItem[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function normalize(s: string) {
  return s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().trim();
}

function searchMockData(query: string, type: UseSearchParams['type']): SearchResults {
  const q = normalize(query);

  const songs =
    type === 'artists' || type === 'albums'
      ? []
      : (songsJson as MockSongItem[]).filter(
          (s) =>
            normalize(s.title).includes(q) ||
            normalize(s.artistName).includes(q) ||
            normalize(s.albumTitle).includes(q),
        );

  const artists =
    type === 'songs' || type === 'albums'
      ? []
      : (artistsJson as MockArtistItem[]).filter((a) => normalize(a.name).includes(q));

  const albums =
    type === 'songs' || type === 'artists'
      ? []
      : (artistsJson as MockArtistItem[])
          .flatMap((a) => a.albums)
          .filter(
            (al) =>
              normalize(al.title).includes(q) ||
              normalize(al.artistName).includes(q),
          );

  return { songs, artists, albums };
}

// ─── Hook ────────────────────────────────────────────────────────────────────
const DEBOUNCE_MS = 300;

export function useSearch({ query, type }: UseSearchParams): UseSearchReturn {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    if (query === '') {
      setDebouncedQuery('');
      return;
    }
    const timer = setTimeout(() => setDebouncedQuery(query), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [query]);

  const trimmed = debouncedQuery.trim();

  const results = useMemo<SearchResults>(() => {
    if (!trimmed) return { songs: [], artists: [], albums: [] };
    return searchMockData(trimmed, type);
  }, [trimmed, type]);

  const total = results.songs.length + results.artists.length + results.albums.length;

  return {
    results,
    isLoading:    false,
    isEmpty:      !trimmed,
    hasNoResults: !!trimmed && total === 0,
  };
}