/**
 * A quiet "back to the map" chip for the placeholder regions that aren't full
 * scenes yet. Scenes use SceneView's own map chip instead.
 */
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';

import { AppFonts } from '@/theme/fonts';
import { getRegion, RegionKey } from '@/theme/regions';

export function MapBack({ region }: { region: RegionKey }) {
  const router = useRouter();
  const t = getRegion(region);

  return (
    <Pressable
      onPress={() => router.back()}
      style={styles.back}
      accessibilityRole="button"
      accessibilityLabel="Back to the map of Arda">
      <MaterialCommunityIcons name="chevron-left" size={20} color={t.accent} />
      <Text style={[styles.text, { color: t.accent }]}>the map</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  back: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 4, marginBottom: 6, alignSelf: 'flex-start' },
  text: { fontFamily: AppFonts.bodyMedium, fontSize: 15 },
});
