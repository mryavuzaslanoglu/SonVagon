import React, { memo } from 'react';
import { View, Text, TouchableOpacity, Linking, Platform } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Ionicons } from '@expo/vector-icons';
import { LocationError } from '../hooks/useUserLocation';

interface Props {
  onRetry: () => void;
  errorType: LocationError;
}

const ERROR_CONFIG: Record<LocationError, {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  buttonText: string;
  opensSettings: boolean;
}> = {
  permission_denied: {
    icon: 'location-outline',
    title: 'Konum izni gerekli',
    description: 'En yakın istasyonu bulmak için konum izni vermeniz gerekiyor.',
    buttonText: 'İzin Ver',
    opensSettings: false,
  },
  services_disabled: {
    icon: 'navigate-outline',
    title: 'Konum servisleri kapalı',
    description: 'Lütfen cihazınızın konum servislerini ayarlardan açın.',
    buttonText: 'Ayarları Aç',
    opensSettings: true,
  },
  location_failed: {
    icon: 'warning-outline',
    title: 'Konum alınamadı',
    description: 'Konumunuz alınamadı. Lütfen tekrar deneyin.',
    buttonText: 'Tekrar Dene',
    opensSettings: false,
  },
};

function openDeviceSettings() {
  if (Platform.OS === 'ios') {
    Linking.openURL('app-settings:');
  } else {
    Linking.openSettings();
  }
}

export const LocationPermissionPrompt = memo(function LocationPermissionPrompt({
  onRetry,
  errorType,
}: Props) {
  const config = ERROR_CONFIG[errorType];

  const handlePress = () => {
    if (config.opensSettings) {
      openDeviceSettings();
    } else {
      onRetry();
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons
        name={config.icon}
        size={48}
        color={styles.icon.color}
      />
      <Text style={styles.title}>{config.title}</Text>
      <Text style={styles.description}>{config.description}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Text style={styles.buttonText}>{config.buttonText}</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create((theme) => ({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xxl,
    gap: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  icon: {
    color: theme.colors.textMuted,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    textAlign: 'center',
  },
  description: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  button: {
    marginTop: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  buttonText: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.semibold,
    color: theme.colors.white,
  },
}));
