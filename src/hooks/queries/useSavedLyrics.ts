import { useQuery } from '@tanstack/react-query';
import { useSavedStore } from '@/store/savedStore';
import { lyricsRepository } from '@/services';
import type { SavedLyric, Lyrics } from '@/types';

/** Combined saved lyric with full lyrics data */
export interface SavedLyricWithData extends SavedLyric {
  lyrics: Lyrics | undefined;
}

/**
 * Hook that combines saved lyrics from store with full lyric data from repository.
 * Returns saved lyrics with their complete lyrics content.
 */
export const useSavedLyrics = () => {
  const getSavedList = useSavedStore((state) => state.getSavedList);
  const savedLyrics = getSavedList();

  const savedSongIds = savedLyrics.map((lyric) => lyric.songId);

  // Fetch lyrics for all saved songs
  const lyricsQuery = useQuery({
    queryKey: ['lyrics', 'saved', savedSongIds],
    queryFn: async (): Promise<Lyrics[]> => {
      if (savedSongIds.length === 0) return [];
      const lyricsPromises = savedSongIds.map((songId) =>
        lyricsRepository.getLyrics(songId)
      );
      const results = await Promise.all(lyricsPromises);
      return results.filter((lyric): lyric is Lyrics => lyric !== undefined);
    },
    enabled: savedSongIds.length > 0,
  });

  // Combine saved lyrics with their full lyrics data
  const combinedData: SavedLyricWithData[] = savedLyrics.map((saved) => ({
    ...saved,
    lyrics: lyricsQuery.data?.find((l) => l.songId === saved.songId),
  }));

  return {
    data: combinedData,
    isLoading: lyricsQuery.isLoading,
    error: lyricsQuery.error,
    /** Whether the store has finished hydrating from storage */
    isHydrated: useSavedStore((state) => state.hasHydrated),
  };
};
