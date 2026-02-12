import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import { BorderRadius, Spacing, Shadows } from '../constants/theme';
import { useColors } from '../contexts/ThemeContext';
import { Station, NextTrainInfo } from '../types';

interface Props {
  station: Station;
  toHalkali: NextTrainInfo;
  toGebze: NextTrainInfo;
  onCalloutPress: () => void;
}

export const StationMarker = memo(function StationMarker({
  station,
  toHalkali,
  toGebze,
  onCalloutPress,
}: Props) {
  const colors = useColors();

  return (
    <Marker
      coordinate={{ latitude: station.latitude, longitude: station.longitude }}
      tracksViewChanges={false}
      onCalloutPress={onCalloutPress}
    >
      <View style={[styles.markerOuter, { backgroundColor: colors.white }, Shadows.card]}>
        <View style={[styles.markerInner, { backgroundColor: colors.marmaray }]} />
      </View>
      <Callout tooltip>
        <View style={[styles.callout, { backgroundColor: colors.surface }, Shadows.elevated]}>
          <Text style={[styles.calloutTitle, { color: colors.text }]}>{station.name}</Text>
          <View style={styles.calloutRow}>
            {station.schedule.toHalkali && (
              <View style={styles.calloutDir}>
                <Text style={[styles.calloutLabel, { color: colors.halkaliBadge }]}>
                  ← Halkalı
                </Text>
                <Text style={[styles.calloutTime, { color: colors.text }]}>
                  {formatCalloutTime(toHalkali)}
                </Text>
              </View>
            )}
            {station.schedule.toGebze && (
              <View style={styles.calloutDir}>
                <Text style={[styles.calloutLabel, { color: colors.gebzeBadge }]}>
                  Gebze →
                </Text>
                <Text style={[styles.calloutTime, { color: colors.text }]}>
                  {formatCalloutTime(toGebze)}
                </Text>
              </View>
            )}
          </View>
          <Text style={[styles.calloutHint, { color: colors.textMuted }]}>Detay icin dokun</Text>
        </View>
      </Callout>
    </Marker>
  );
});

function formatCalloutTime(info: NextTrainInfo): string {
  if (info.isServiceOver && !info.firstTrain) return 'Son Durak';
  if (info.isServiceOver) return 'Bitti';
  if (info.isBeforeService) return info.nextTrainTime;
  return `${info.remainingMinutes} dk`;
}

const styles = StyleSheet.create({
  markerOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  markerInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  callout: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    minWidth: 180,
  },
  calloutTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  calloutRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: Spacing.md,
  },
  calloutDir: {
    alignItems: 'center',
  },
  calloutLabel: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  calloutTime: {
    fontSize: 18,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
  },
  calloutHint: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
});
