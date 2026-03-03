import React, { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { AppScreen, AppText } from '@/components';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ArtistsStackParamList } from '@/app/navigationTypes';
import { useArtistById, type Song, type Album } from '../hooks/useArtistById';
// `useTheme` removed because it's not used in this screen

type Props = Readonly<NativeStackScreenProps<ArtistsStackParamList, 'ArtistDetail'>>;

// ─── Avatar ───────────────────────────────────────────────────────────────────

function ArtistAvatar({ name }: Readonly<{ name: string }>) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <View style={styles.avatarWrapper}>
      {/* Outer glow ring */}
      <View style={styles.avatarGlow} />
      {/* Gradient circle — simulated via layered Views */}
      <View style={styles.avatarCircle}>
        <AppText variant="pageTitle" style={styles.avatarInitial}>
          {initial}
        </AppText>
      </View>
    </View>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ label }: Readonly<{ label: string }>) {
  return (
    <View style={styles.sectionHeaderRow}>
      <AppText variant="sectionHeader" style={styles.sectionHeaderText}>
        {label}
      </AppText>
    </View>
  );
}

// ─── Song Row ─────────────────────────────────────────────────────────────────

interface SongRowProps {
  readonly song: Song;
  readonly onPress: () => void;
}

function SongRow({ song, onPress }: SongRowProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <AppText variant="itemTitle" style={styles.songTitle}>
          {song.title}
        </AppText>
        <AppText variant="itemMeta" style={styles.songMeta}>
          {song.album} • {song.year}
        </AppText>
      </View>
      <TouchableOpacity style={styles.pillButton} onPress={onPress} activeOpacity={0.75}>
        <AppText variant="actionLabel" style={styles.pillButtonText}>
          View
        </AppText>
      </TouchableOpacity>
    </View>
  );
}

// ─── Album Row ────────────────────────────────────────────────────────────────

interface AlbumRowProps {
  readonly album: Album;
  readonly onPress: () => void;
}

function AlbumRow({ album, onPress }: AlbumRowProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <AppText variant="itemTitle" style={styles.songTitle}>
          {album.name}
        </AppText>
        <AppText variant="itemMeta" style={styles.songMeta}>
          {album.songCount} songs • {album.year}
        </AppText>
      </View>
      <TouchableOpacity style={styles.pillButton} onPress={onPress} activeOpacity={0.75}>
        <AppText variant="actionLabel" style={styles.pillButtonText}>
          Browse
        </AppText>
      </TouchableOpacity>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

export default function ArtistDetailScreen({ route, navigation }: Props) {
  const { artistId, artistName } = route.params;
  const { data: artist, isLoading, isError } = useArtistById(artistId);

  // Hide bottom tab bar while this screen is focused (restore on blur)
  useFocusEffect(
    useCallback(() => {
      const parent = navigation.getParent();
      parent?.setOptions({ tabBarStyle: { display: 'none' } });
      return () => parent?.setOptions({ tabBarStyle: undefined });
    }, [navigation])
  );

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handleSongPress(song: Song) {
    navigation.navigate('Lyrics', {
      songId: song.id,
      songTitle: song.title,
      artistName: artist?.name ?? artistName,
    });
  }

  function handleAlbumPress(album: Album) {
    navigation.navigate('AlbumDetail', {
      albumId: album.id,
      albumName: album.name,
      artistId,
      artistName: artist?.name ?? artistName,
    });
  }

  // ── Loading ───────────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <AppScreen>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#9B7FE8" />
        </View>
      </AppScreen>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────

  if (isError || !artist) {
    return (
      <AppScreen>
        <View style={styles.centered}>
          <AppText variant="pageSubtitle" style={styles.errorText}>
            Could not load artist. Please try again.
          </AppText>
        </View>
      </AppScreen>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <AppScreen style={styles.screen}>
      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <AppText variant="pageSubtitle" style={styles.backChevron}>‹</AppText>
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
        {/* ── Profile header ── */}
        <View style={styles.profileHeader}>
          <ArtistAvatar name={artist.name} />
          <AppText variant="pageTitle" style={styles.artistName}>
            {artist.name}
          </AppText>
          <AppText variant="pageSubtitle" style={styles.songCount}>
            {artist.songCount} songs available
          </AppText>
        </View>

        {/* ── Popular Songs ── */}
        <SectionHeader label="POPULAR SONGS" />
        {artist.popularSongs.map(song => (
          <SongRow
            key={song.id}
            song={song}
            onPress={() => handleSongPress(song)}
          />
        ))}

        {/* ── Albums ── */}
        <SectionHeader label="ALBUMS" />
        {artist.albums.map(album => (
          <AlbumRow
            key={album.id}
            album={album}
            onPress={() => handleAlbumPress(album)}
          />
        ))}

        {/* Bottom padding */}
        <View style={styles.bottomPad} />
      </ScrollView>
    </AppScreen>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const PURPLE = '#9B7FE8';
const PURPLE_LIGHT = '#EDE8FA';
const AVATAR_SIZE = 96;

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#F7F5F0',
  },

  // Back button
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backChevron: {
    fontSize: 28,
    color: '#333',
    lineHeight: 32,
    marginTop: -2,
  },

  // Scroll
  scrollContent: {
    paddingTop: 24,
    paddingHorizontal: 20,
  },
  bottomPad: {
    height: 40,
  },

  // ── Profile Header ──────────────────────────────────────────────────────────
  profileHeader: {
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 32,
  },

  // Avatar
  avatarWrapper: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarGlow: {
    position: 'absolute',
    width: AVATAR_SIZE + 16,
    height: AVATAR_SIZE + 16,
    borderRadius: (AVATAR_SIZE + 16) / 2,
    backgroundColor: PURPLE_LIGHT,
    opacity: 0.7,
  },
  avatarCircle: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    // Simulate gradient: deep purple → pink-purple
    backgroundColor: '#8B5CF6',
    // React Native doesn't support linear-gradient without expo-linear-gradient.
    // Using backgroundColor as the primary visual style.
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarInitial: {
    fontSize: 40,
    color: '#fff',
    fontWeight: '700',
    lineHeight: 48,
  },

  artistName: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  songCount: {
    fontSize: 14,
    color: '#888',
    fontWeight: '400',
  },

  // ── Section Header ──────────────────────────────────────────────────────────
  sectionHeaderRow: {
    marginTop: 8,
    marginBottom: 10,
  },
  sectionHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#999',
    textTransform: 'uppercase',
  },

  // ── Cards ───────────────────────────────────────────────────────────────────
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardContent: {
    flex: 1,
    marginRight: 12,
  },
  songTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 3,
  },
  songMeta: {
    fontSize: 12,
    color: '#999',
    fontWeight: '400',
  },

  // Pill button
  pillButton: {
    backgroundColor: PURPLE_LIGHT,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
  },
  pillButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: PURPLE,
    letterSpacing: 0.2,
  },

  // ── States ──────────────────────────────────────────────────────────────────
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#999',
    textAlign: 'center',
  },
});