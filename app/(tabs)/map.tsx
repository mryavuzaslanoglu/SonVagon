import React, { useCallback, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { MapLightStyle, MapDarkStyle } from '../../src/constants/theme';
import { useColors, useIsDark } from '../../src/contexts/ThemeContext';
import { stations, marmarayPolyline } from '../../src/data/stations';
import { SCHEDULE_CONFIG } from '../../src/data/scheduleConfig';
import { useCurrentTime } from '../../src/hooks/useCurrentTime';
import { getStationCountdowns } from '../../src/utils/scheduleCalculator';
import { StationMarker } from '../../src/components/StationMarker';

export default function MapScreen() {
  const colors = useColors();
  const isDark = useIsDark();
  const router = useRouter();
  const now = useCurrentTime();
  const mapRef = useRef<MapView>(null);

  const handleCalloutPress = useCallback(
    (stationId: string) => {
      router.push({ pathname: '/station/[id]', params: { id: stationId } });
    },
    [router]
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
