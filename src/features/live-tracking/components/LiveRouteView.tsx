import React, { useMemo, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Direction, TravelOffset, TrainRouteType } from '@/types';
import { useActiveTrainsByDirection } from '../hooks/useActiveTrains';
import { getTravelOffsets } from '../utils/travelTimeDeriver';

interface Props {
  direction: Direction;
  highlightStationId?: string;
}

const ITEM_WIDTH = 56;
const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_HORIZONTAL_PADDING = 16;
const CONTENT_WIDTH = SCREEN_WIDTH - CARD_HORIZONTAL_PADDING * 2;
const TRACK_Y = 40;
const TRAIN_DOT_SIZE = 12;

function StationItem({
  stop,
  isHighlighted,
  isHalkali,
  isTop,
}: {
  stop: TravelOffset;
  isHighlighted: boolean;
  isHalkali: boolean;
  isTop: boolean;
}) {
  return (
    <View style={styles.stationItem}>
      {isTop && (
        <Text
          style={[
            styles.stationLabel,
            isHighlighted && styles.stationLabelHighlighted(isHalkali),
          ]}
          numberOfLines={2}
        >
          {stop.stationName}
        </Text>
      )}

      <View
        style={[
          styles.stationDot(isHalkali),
          isHighlighted && styles.stationDotHighlighted(isHalkali),
        ]}
      />

      {!isTop && (
        <Text
          style={[
            styles.stationLabel,
            isHighlighted && styles.stationLabelHighlighted(isHalkali),
          ]}
          numberOfLines={2}
        >
          {stop.stationName}
        </Text>
      )}
    </View>
  );
}

const MemoizedStationItem = React.memo(StationItem);

export function LiveRouteView({ direction, highlightStationId }: Props) {
  const trains = useActiveTrainsByDirection(direction);
  const scrollRef = useRef<ScrollView>(null);

  const routeStations = useMemo(() => {
    const fullOffsets = getTravelOffsets(direction, 'full');
    return fullOffsets.offsets;
  }, [direction]);

  // Map stationId → index in routeStations for positioning trains
  const stationIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    routeStations.forEach((s, i) => {
      map.set(s.stationId, i);
    });
    return map;
  }, [routeStations]);

  const highlightIndex = useMemo(() => {
    if (!highlightStationId) return -1;
    return routeStations.findIndex((s) => s.stationId === highlightStationId);
  }, [routeStations, highlightStationId]);

  const sidePadding = (CONTENT_WIDTH - ITEM_WIDTH) / 2;
  const totalContentWidth = routeStations.length * ITEM_WIDTH + sidePadding * 2;

  useEffect(() => {
    if (highlightIndex >= 0 && scrollRef.current) {
      const timer = setTimeout(() => {
        // sidePadding + i * ITEM_WIDTH + ITEM_WIDTH/2 = center of station i
        // to center in viewport: scrollX = sidePadding + i * ITEM_WIDTH + ITEM_WIDTH/2 - CONTENT_WIDTH/2
        // since sidePadding = (CONTENT_WIDTH - ITEM_WIDTH) / 2, this simplifies to i * ITEM_WIDTH
        scrollRef.current?.scrollTo({
          x: Math.max(0, highlightIndex * ITEM_WIDTH),
          animated: false,
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [highlightIndex, sidePadding]);

  if (routeStations.length === 0) return null;

  const isHalkali = direction === 'toHalkali';
  const dirLabel = isHalkali ? '← Halkalı' : 'Gebze →';
  const trainCount = trains.length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.dirBadge(isHalkali)}>
          <Text style={styles.dirText(isHalkali)}>{dirLabel}</Text>
        </View>
        <View style={styles.trainCountBadge}>
          <View style={styles.trainCountDot(isHalkali)} />
          <Text style={styles.trainCountText}>
            {trainCount} aktif tren
          </Text>
        </View>
      </View>

      <View style={styles.listWrapper}>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <View style={{ width: totalContentWidth, height: 90 }}>
            {/* Track line */}
            <View
              style={[
                styles.trackLine(isHalkali),
                {
                  left: sidePadding + ITEM_WIDTH / 2,
                  right: sidePadding + ITEM_WIDTH / 2,
                },
              ]}
            />

            {/* Station items */}
            <View style={styles.stationsRow(sidePadding)}>
              {routeStations.map((stop, index) => (
                <MemoizedStationItem
                  key={stop.stationId}
                  stop={stop}
                  isHighlighted={stop.stationId === highlightStationId}
                  isHalkali={isHalkali}
                  isTop={index % 2 === 0}
                />
              ))}
            </View>

            {/* Train dots overlay */}
            {trains.map((train) => {
              const fromIdx = stationIndexMap.get(train.currentStationId);
              const toIdx = stationIndexMap.get(train.nextStationId);
              if (fromIdx === undefined || toIdx === undefined) return null;

              const stationProgress = fromIdx + train.progress * (toIdx - fromIdx);
              const x =
                sidePadding +
                stationProgress * ITEM_WIDTH +
                ITEM_WIDTH / 2;

              return (
                <View
                  key={train.trainId}
                  style={[
                    styles.trainDot(isHalkali, train.routeType),
                    {
                      left: x - TRAIN_DOT_SIZE / 2,
                      top: TRACK_Y - TRAIN_DOT_SIZE / 2 + 1,
                    },
                  ]}
                />
              );
            })}
          </View>
        </ScrollView>
      </View>

      {trainCount === 0 && (
        <Text style={styles.emptyText}>Şu an aktif tren yok</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    borderRadius: theme.borderRadius.xl,
    padding: CARD_HORIZONTAL_PADDING,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.card,
    marginBottom: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  dirBadge: (isHalkali: boolean) => ({
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    backgroundColor: isHalkali
      ? theme.colors.halkaliBadgeLight
      : theme.colors.gebzeBadgeLight,
  }),
  dirText: (isHalkali: boolean) => ({
    fontSize: 13,
    fontWeight: '700' as const,
    color: isHalkali ? theme.colors.halkaliBadge : theme.colors.gebzeBadge,
  }),
  trainCountBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trainCountDot: (isHalkali: boolean) => ({
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: isHalkali ? theme.colors.halkaliBadge : theme.colors.gebzeBadge,
  }),
  trainCountText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  listWrapper: {
    height: 90,
  },
  trackLine: (isHalkali: boolean) => ({
    position: 'absolute' as const,
    top: TRACK_Y,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: isHalkali
      ? theme.colors.halkaliBadge + '25'
      : theme.colors.gebzeBadge + '25',
  }),
  stationsRow: (paddingLeft: number) => ({
    flexDirection: 'row' as const,
    marginLeft: paddingLeft,
    height: 90,
  }),
  stationItem: {
    width: ITEM_WIDTH,
    alignItems: 'center',
    justifyContent: 'center',
    height: 90,
  },
  stationDot: (isHalkali: boolean) => ({
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: isHalkali ? theme.colors.halkaliBadge : theme.colors.gebzeBadge,
    backgroundColor: theme.colors.surface,
    zIndex: 1,
  }),
  stationDotHighlighted: (isHalkali: boolean) => ({
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    backgroundColor: isHalkali ? theme.colors.halkaliBadge : theme.colors.gebzeBadge,
  }),
  stationLabel: {
    fontSize: 8,
    fontWeight: '500',
    color: theme.colors.textMuted,
    textAlign: 'center',
    width: ITEM_WIDTH - 2,
    lineHeight: 11,
    paddingVertical: 2,
  },
  stationLabelHighlighted: (isHalkali: boolean) => ({
    fontWeight: '800' as const,
    color: isHalkali ? theme.colors.halkaliBadge : theme.colors.gebzeBadge,
    fontSize: 9,
  }),
  trainDot: (isHalkali: boolean, routeType: TrainRouteType) => ({
    position: 'absolute' as const,
    width: TRAIN_DOT_SIZE,
    height: TRAIN_DOT_SIZE,
    borderRadius: TRAIN_DOT_SIZE / 2,
    backgroundColor: routeType === 'full'
      ? (isHalkali ? theme.colors.halkaliBadge : theme.colors.gebzeBadge)
      : theme.colors.shortRoute,
    borderWidth: 2,
    borderColor: theme.colors.surface,
    zIndex: 10,
  }),
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm,
  },
}));
