import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { Marker } from 'react-native-maps';
import { StyleSheet } from 'react-native-unistyles';
import { ActiveTrain } from '@/types';

interface Props {
  train: ActiveTrain;
}

export const TrainMarker = memo(function TrainMarker({ train }: Props) {
  const isHalkali = train.direction === 'toHalkali';
  const isFull = train.routeType === 'full';

  return (
    <Marker
      coordinate={{ latitude: train.latitude, longitude: train.longitude }}
      tracksViewChanges={false}
      anchor={{ x: 0.5, y: 0.5 }}
    >
      <View style={styles.container}>
        <View style={styles.dot(isHalkali)}>
          <View style={styles.innerDot(isFull)} />
        </View>
        <View style={styles.labelBg(isHalkali)}>
          <Text style={styles.labelText(isHalkali)}>
            {train.departureTime}
          </Text>
        </View>
      </View>
    </Marker>
  );
});

const styles = StyleSheet.create((theme) => ({
  container: {
    alignItems: 'center',
  },
  dot: (isHalkali: boolean) => ({
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: theme.colors.white,
    borderWidth: 2,
    borderColor: isHalkali ? theme.colors.halkaliBadge : theme.colors.gebzeBadge,
    shadowColor: isHalkali ? theme.colors.halkaliBadge : theme.colors.gebzeBadge,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 5,
  }),
  innerDot: (isFull: boolean) => ({
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: isFull ? theme.colors.fullRoute : theme.colors.shortRoute,
  }),
  labelBg: (isHalkali: boolean) => ({
    marginTop: 2,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    backgroundColor: isHalkali
      ? theme.colors.halkaliBadge + 'CC'
      : theme.colors.gebzeBadge + 'CC',
  }),
  labelText: (_isHalkali: boolean) => ({
    fontSize: 8,
    fontWeight: '700' as const,
    fontVariant: ['tabular-nums'] as const,
    color: theme.colors.white,
  }),
}));
