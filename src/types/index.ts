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
  side: 'avrupa' | 'asya';
  order: number;
  transfers: string[];
  schedule: {
    toHalkali: StationSchedule | null;
    toGebze: StationSchedule | null;
  };
}

export type Direction = 'toHalkali' | 'toGebze';
export type TrainRouteType = 'full' | 'short';

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

export interface CountdownDisplayProps {
  minutes: number;
  seconds: number;
  isServiceOver: boolean;
  isBeforeService: boolean;
  nextTrainTime?: string;
}

export interface StationSection {
  title: string;
  data: Station[];
  type?: 'favorites' | 'avrupa' | 'asya';
}
