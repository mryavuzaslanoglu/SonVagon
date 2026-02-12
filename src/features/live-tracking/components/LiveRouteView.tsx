import React, { useMemo, useRef, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Dimensions } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Direction, TravelOffset } from '@/types';
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

// Track is vertically centered in the listWrapper.
// "Top" labels sit above the track, "bottom" labels sit below.
const TRACK_Y = 40; // vertical center of track line within listWrapper
const LABEL_HEIGHT = 28;

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
      {/* Label above track */}
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

      {/* Dot on track */}
      <View
        style={[
          styles.stationDot(isHalkali),
          isHighlighted && styles.stationDotHighlighted(isHalkali),
        ]}
      />

      {/* Label below track */}
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
  const listRef = useRef<FlatList>(null);

  const routeStations = useMemo(() => {
    const fullOffsets = getTravelOffsets(direction, 'full');
    return fullOffsets.offsets;
  }, [direction]);

  const highlightIndex = useMemo(() => {
    if (!highlightStationId) return -1;
    return routeStations.findIndex((s) => s.stationId === highlightStationId);
  }, [routeStations, highlightStationId]);

  useEffect(() => {
    if (highlightIndex >= 0 && listRef.current) {
      const timer = setTimeout(() => {
        listRef.current?.scrollToIndex({
          index: highlightIndex,
          viewPosition: 0.5,
          animated: false,
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [highlightIndex]);

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: ITEM_WIDTH,
      offset: ITEM_WIDTH * index,
      index,
    }),
    [],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: TravelOffset; index: number }) => (
      <MemoizedStationItem
        stop={item}
        isHighlighted={item.stationId === highlightStationId}
        isHalkali={direction === 'toHalkali'}
        isTop={index % 2 === 0}
      />
    ),
    [highlightStationId, direction],
  );

  const keyExtractor = useCallback((item: TravelOffset) => item.stationId, []);

  if (routeStations.length === 0) return null;

  const isHalkali = direction === 'toHalkali';
  const dirLabel = isHalkali ? '← Halkalı' : 'Gebze →';
  const trainCount = trains.length;
  const sidePadding = (CONTENT_WIDTH - ITEM_WIDTH) / 2;

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
        <View style={styles.trackLine(isHalkali)} />

        <FlatList
          ref={listRef}
          horizontal
          data={routeStations}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: sidePadding }}
          onScrollToIndexFailed={(info) => {
            listRef.current?.scrollToOffset({
              offset: info.averageItemLength * info.index,
              animated: false,
            });
          }}
        />
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
    position: 'relative',
    height: 90,
  },
  trackLine: (isHalkali: boolean) => ({
    position: 'absolute' as const,
    top: TRACK_Y,
    left: CARD_HORIZONTAL_PADDING,
    right: CARD_HORIZONTAL_PADDING,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: isHalkali
      ? theme.colors.halkaliBadge + '25'
      : theme.colors.gebzeBadge + '25',
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
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
    color: theme.colors.textMuted,
    marginTop: theme.spacing.sm,
  },
}));
