# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SonVagon is a React Native (Expo 55) mobile app for real-time Marmaray train tracking in Istanbul. It shows station schedules, live train positions, favorites, and an interactive map. All UI strings are in Turkish.

## Development Commands

```bash
npx expo start          # Start Expo dev server
npx expo run:ios        # Run on iOS
npx expo run:android    # Run on Android
npx expo start --web    # Start web version
```

EAS Build profiles are configured in `eas.json` (development/preview/production).

There are no tests or linting scripts configured.

## Architecture

### Routing (Expo Router - file-based)

- `app/_layout.tsx` — Root layout: error boundary, theme init, starts global time tick
- `app/(tabs)/` — Bottom tabs: Stations (`index.tsx`), Favorites (`favorites.tsx`), Map (`map.tsx`)
- `app/station/[id].tsx` — Station detail screen (dynamic route)

### Path Aliases

`@/*` maps to `src/*` (configured in tsconfig.json and babel.config.js).

### State Management (Zustand + MMKV)

Three stores in `src/stores/`:
- **useTimeStore** — Global 1-second tick. Exposes `useNow` (per-second) and `useMinuteKey` (per-minute) selectors to control re-render granularity
- **useFavoritesStore** — Persisted array of favorite station IDs
- **useThemeStore** — Persisted light/dark preference, syncs with Unistyles

All persistence uses MMKV (synchronous) via the adapter in `src/shared/utils/storage.ts`.

### Theme System (react-native-unistyles)

- Config: `src/config/unistyles.ts`
- Tokens: `src/theme/` (colors, spacing, fonts, shadows, map styles)
- Components use `StyleSheet.create((theme) => ...)` from unistyles
- Light and dark themes with adaptive switching

### Data Layer

- `src/data/stations.ts` — 43 Marmaray stations with coordinates, schedules, and district info. Exports `stationMap` (Map<string, Station>) and `marmarayPolyline` (route coordinates)
- `src/data/scheduleConfig.ts` — Line intervals, destinations, time ranges for full line (15-min intervals) and short line Ataköy–Pendik (8-min intervals)
- `src/types/index.ts` — All TypeScript interfaces (Station, StationSchedule, ActiveTrain, etc.)

### Schedule Calculation

`src/utils/scheduleCalculator.ts` computes next trains and upcoming departures. Handles both full and short line routes, midnight crossover, and service hours.

### Live Train Tracking

`src/features/live-tracking/` — Calculates real-time train positions by:
1. `travelTimeDeriver.ts` — Precomputes travel time offsets between stations (cached at import)
2. `trainPositionCalculator.ts` — Enumerates active departures, finds which segment each train is on, interpolates GPS coordinates between station endpoints

### Key Conventions

- **Direction colors:** Halkalı = blue (#007AFF), Gebze = orange (#FF9500)
- **Route types:** Full line = green (#34C759), Short line = purple (#AF52DE)
- **Side grouping:** Stations are grouped as Avrupa Yakası / Anadolu Yakası by `side` field
- **Station ordering:** `order` field (0–42, west to east, Halkalı to Gebze)
- **Performance:** Components use `React.memo`, `useMemo` for filtered data, map markers use `tracksViewChanges={false}`
- **Re-render control:** Station list uses `useMinuteKey` (60s updates), map/live view uses `useNow` (1s updates)

### Feature Module Pattern

`src/features/` organizes domain logic into feature folders with `components/`, `hooks/`, `utils/`, and barrel `index.ts` exports. Currently: `live-tracking/` and `stations/`.
