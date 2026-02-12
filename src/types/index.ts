// ─── Station & Schedule ─────────────────────────────────────

export interface StationSchedule {
  firstTrain: string; // "HH:MM" format
  lastTrain: string;
  intervalMinutes: number;
}

export interface Station {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  district: string;
  side: "avrupa" | "asya";
  order: number;
  transfers: string[];
  schedule: {
    toHalkali: StationSchedule | null;
    toGebze: StationSchedule | null;
    shortToHalkali?: StationSchedule | null;
    shortToGebze?: StationSchedule | null;
  };
}

// ─── Direction & Route ──────────────────────────────────────

export type Direction = "toHalkali" | "toGebze";
export type TrainRouteType = "full" | "short";

// ─── Next Train Info ────────────────────────────────────────

export interface NextTrainInfo {
  direction: Direction;
  directionLabel: string;
  remainingMs: number;
  remainingMinutes: number;
  remainingSeconds: number;
  nextTrainTime: string;
  isServiceOver: boolean;
  isBeforeService: boolean;
  firstTrain: string;
  lastTrain: string;
  routeType: TrainRouteType;
  destination: string;
}

export interface UpcomingTrain {
  time: string;
  minutesFromNow: number;
  routeType: TrainRouteType;
  destination: string;
}

// ─── Section List ───────────────────────────────────────────

export interface StationSection {
  title: string;
  data: Station[];
  type?: "favorites" | "avrupa" | "asya";
}

// ─── Live Train Tracking ────────────────────────────────────

export interface TravelOffset {
  stationId: string;
  stationName: string;
  order: number;
  minutesFromOrigin: number;
}

export interface ActiveTrain {
  trainId: string;
  routeType: TrainRouteType;
  direction: Direction;
  departureTime: string;
  /** Order index of the station the train just passed */
  currentStationIndex: number;
  /** Order index of the next station ahead */
  nextStationIndex: number;
  /** 0.0–1.0 progress between currentStation and nextStation */
  progress: number;
  currentStationId: string;
  nextStationId: string;
  /** Interpolated GPS position */
  latitude: number;
  longitude: number;
}

// ─── Departure Planner ─────────────────────────────────────

export type BufferTime = 0 | 3 | 5 | 10;

export interface NearbyStationInfo {
  station: Station;
  distanceMeters: number;
  walkingDurationSeconds: number | null;
  walkingDurationText: string | null;
}

export interface CatchableTrain {
  train: UpcomingTrain;
  leaveByTime: string;
  leaveByMinutesFromNow: number;
  arrivalAtStationTime: string;
  bufferMinutes: number;
  isRecommended: boolean;
}

export interface StationDeparturePlan {
  stationInfo: NearbyStationInfo;
  catchableTrains: CatchableTrain[];
  hasTrains: boolean;
}
