import React, { useCallback, useRef } from 'react';
import { View } from 'react-native';
import MapView, { Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet } from 'react-native-unistyles';
import { useIsDark, useNow } from '@/stores';
import { useStationNavigation } from '@/features/stations/hooks/useStationNavigation';
import { useAllActiveTrains, TrainMarker } from '@/features/live-tracking';
import { stations, marmarayPolyline } from '@/data/stations';
import { SCHEDULE_CONFIG } from '@/data/scheduleConfig';
import { MapLightStyle, MapDarkStyle } from '@/theme/mapStyles';
import { getStationCountdowns } from '@/utils/scheduleCalculator';
import { StationMarker } from '@/components/StationMarker';

export default function MapScreen() {
  const isDark = useIsDark();
  const now = useNow();
  const { navigateToStation } = useStationNavigation();
  const activeTrains = useAllActiveTrains();
  const mapRef = useRef<MapView>(null);

  const handleCalloutPress = useCallback(
    (stationId: string) => {
      navigateToStation(stationId);
    },
    [navigateToStation]
  );

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={SCHEDULE_CONFIG.mapRegion}
        customMapStyle={isDark ? MapDarkStyle : MapLightStyle}
        showsUserLocation
        showsMyLocationButton
      >
        <Polyline
          coordinates={marmarayPolyline}
          strokeColor={SCHEDULE_CONFIG.lineColor}
          strokeWidth={3}
        />
        {stations.map((station) => {
          const countdowns = getStationCountdowns(station, now);
          return (
            <StationMarker
              key={station.id}
              station={station}
              toHalkali={countdowns.toHalkali}
              toGebze={countdowns.toGebze}
              onCalloutPress={() => handleCalloutPress(station.id)}
            />
          );
        })}
        {activeTrains.map((train) => (
          <TrainMarker key={train.trainId} train={train} />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: { flex: 1, backgroundColor: theme.colors.background },
  map: { flex: 1 },
}));
