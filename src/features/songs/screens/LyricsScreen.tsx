import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppScreen, AppText } from '@/components';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SongsStackParamList } from '@/app/navigationTypes';

type Props = NativeStackScreenProps<SongsStackParamList, 'Lyrics'>;

/**
 * Lyrics Display Screen — stub.
 *
 * Sprint 2 / Sprint 3 Tasks:
 *  - S2-10: Display verses & chorus with styled sections
 *  - S2-11: Text size toggle (small / medium / large)
 *  - S2-12: Save / unsave lyrics (heart button)
 *  - S3-01: Share lyrics via expo-sharing
 */
export default function LyricsScreen({ route }: Readonly<Props>) {
  const { songId, songTitle } = route.params;

  return (
    <AppScreen>
      <AppText variant="pageTitle">{songTitle}</AppText>
      <View style={styles.placeholder}>
        <AppText variant="pageSubtitle">
          📜  Lyrics for &quot;{songTitle}&quot; (ID: {songId}) — Sprint 2
        </AppText>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
