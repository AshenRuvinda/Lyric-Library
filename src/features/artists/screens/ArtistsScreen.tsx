import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { ArtistsStackParamList } from '@/app/navigationTypes';
import { AppScreen, AppText } from '@/components';

type Props = Readonly<NativeStackScreenProps<ArtistsStackParamList, 'ArtistsList'>>;

/**
 * Artists Browse Screen — stub.
 *
 * Sprint 2 Tasks:
 *  - S2-01: Render artist grid using FlashList + ArtistCard
 *  - S2-02: Add alphabetical section headers
 *  - S2-03: Wire navigation to ArtistDetailScreen
 */
export default function ArtistsScreen({ navigation }: Props) {
  const handleViewArtistDetails = () => {
    navigation.navigate('ArtistDetail', {
      artistId: '1',
      artistName: 'Taylor Swift',
    });
  };

  return (
    <AppScreen>
      <AppText variant="pageTitle">Artists</AppText>
      <View style={styles.placeholder}>
        <AppText variant="pageSubtitle">
          🎤  Artist grid will be implemented here (Sprint 2)
        </AppText>
        <TouchableOpacity
          style={styles.button}
          onPress={handleViewArtistDetails}
        >
          <AppText style={styles.buttonText}>View Artist Details</AppText>
        </TouchableOpacity>
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
  button: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#9B7FE8',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
