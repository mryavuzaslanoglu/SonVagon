import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Ionicons } from '@expo/vector-icons';
import { useDeparturePlanner } from '../hooks/useDeparturePlanner';
import { DirectionToggle } from './DirectionToggle';
import { BufferTimeSelector } from './BufferTimeSelector';
import { StationDepartureCard } from './StationDepartureCard';
import { LocationPermissionPrompt } from './LocationPermissionPrompt';

export function DeparturePlannerContent() {
  const {
    plans,
    direction,
    setDirection,
    bufferMinutes,
    setBufferMinutes,
    loading,
    locationLoading,
    walkingLoading,
    error,
    refresh,
    isFarAway,
  } = useDeparturePlanner();

  if (error) {
    return (
      <LocationPermissionPrompt
        errorType={error}
        onRetry={refresh}
      />
    );
  }

  if (locationLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={styles.spinner.color} />
        <Text style={styles.loadingText}>Konumunuz alınıyor...</Text>
      </View>
    );
  }

  const hasAnyTrains = plans.some((p) => p.hasTrains);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={refresh} />
      }
    >
      <DirectionToggle
        direction={direction}
        onDirectionChange={setDirection}
      />

      <BufferTimeSelector value={bufferMinutes} onChange={setBufferMinutes} />

      {isFarAway && (
        <View style={styles.warningBanner}>
          <Ionicons name="information-circle-outline" size={18} color={styles.warningIcon.color} />
          <Text style={styles.warningText}>
            Marmaray hattına uzaksınız. Süreler tahminidir.
          </Text>
        </View>
      )}

      {walkingLoading && plans.length === 0 ? (
        <View style={styles.skeletonContainer}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.skeletonCard}>
              <View style={styles.skeletonLine} />
              <View style={styles.skeletonLineShort} />
            </View>
          ))}
        </View>
      ) : hasAnyTrains ? (
        <View style={styles.cardList}>
          {plans.map((plan) => (
            <StationDepartureCard
              key={plan.stationInfo.station.id}
              plan={plan}
            />
          ))}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="time-outline" size={48} color={styles.emptyIcon.color} />
          <Text style={styles.emptyTitle}>
            Yakalayabileceğiniz tren kalmadı
          </Text>
          <Text style={styles.emptyDescription}>
            Sefer saatleri dışında olabilirsiniz veya yakın zamanda tren bulunmuyor.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.lg,
    gap: theme.spacing.lg,
    paddingBottom: theme.spacing.xxxl,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  spinner: {
    color: theme.colors.primary,
  },
  loadingText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.gebzeBadgeLight,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  warningIcon: {
    color: theme.colors.accent,
  },
  warningText: {
    flex: 1,
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
  },
  cardList: {
    gap: theme.spacing.md,
  },
  skeletonContainer: {
    gap: theme.spacing.md,
  },
  skeletonCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xl,
    gap: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  skeletonLine: {
    height: 16,
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.borderRadius.sm,
    width: '70%',
  },
  skeletonLineShort: {
    height: 12,
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.borderRadius.sm,
    width: '40%',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxxl,
    gap: theme.spacing.md,
  },
  emptyIcon: {
    color: theme.colors.textMuted,
  },
  emptyTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    textAlign: 'center',
  },
  emptyDescription: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: theme.spacing.lg,
  },
}));
