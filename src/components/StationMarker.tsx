import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { Marker, Callout } from 'react-native-maps';
import { StyleSheet } from 'react-native-unistyles';
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
  return (
    <Marker
      coordinate={{ latitude: station.latitude, longitude: station.longitude }}
      tracksViewChanges={false}
      onCalloutPress={onCalloutPress}
    >
      <View style={styles.markerOuter}>
        <View style={styles.markerInner} />
      </View>
      <Callout tooltip>
        <View style={styles.callout}>
          <Text style={styles.calloutTitle}>{station.name}</Text>
          <View style={styles.calloutRow}>
            {station.schedule.toHalkali && (
              <View style={styles.calloutDir}>
                <Text style={styles.calloutLabelHalkali}>← Halkalı</Text>
                <Text style={styles.calloutTime}>
                  {formatCalloutTime(toHalkali)}
                </Text>
              </View>
            )}
            {station.schedule.toGebze && (
              <View style={styles.calloutDir}>
                <Text style={styles.calloutLabelGebze}>Gebze →</Text>
                <Text style={styles.calloutTime}>
                  {formatCalloutTime(toGebze)}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.calloutHint}>Detay için dokun</Text>
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

const styles = StyleSheet.create((theme) => ({
  markerOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white,
    ...theme.shadows.card,
  },
  markerInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: theme.colors.marmaray,
  },
  callout: {
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    minWidth: 180,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.elevated,
  },
  calloutTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
    color: theme.colors.text,
  },
  calloutRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: theme.spacing.md,
  },
  calloutDir: {
    alignItems: 'center',
  },
  calloutLabelHalkali: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
    color: theme.colors.halkaliBadge,
  },
  calloutLabelGebze: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
    color: theme.colors.gebzeBadge,
  },
  calloutTime: {
    fontSize: 18,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    color: theme.colors.text,
  },
  calloutHint: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    color: theme.colors.textMuted,
  },
}));
