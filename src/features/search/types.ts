export type { Artist, Song, Album, SearchFilterType } from '@/types';

export interface SearchResults {
  songs:   import('@/types').Song[];
  artists: import('@/types').Artist[];
  albums:  import('@/types').Album[];
}

export interface UseSearchParams {
  query: string;
  type:  'all' | 'song' | 'artist' | 'album';
}

export interface UseSearchReturn {
  results:      SearchResults;
  isLoading:    boolean;
  isEmpty:      boolean;
  hasNoResults: boolean;
}