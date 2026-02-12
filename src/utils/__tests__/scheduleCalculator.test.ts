import { calculateNextTrain, getUpcomingTrains, getAllDepartures } from '../scheduleCalculator';
import { stationMap } from '../../data/stations';

function makeDate(hours: number, minutes: number, seconds: number = 0): Date {
  const d = new Date(2025, 0, 15); // arbitrary Wednesday
  d.setHours(hours, minutes, seconds, 0);
  return d;
}

describe('calculateNextTrain', () => {
  const yenikapi = stationMap.get('yenikapi')!;
  const halkali = stationMap.get('halkali')!;
  const gebze = stationMap.get('gebze')!;

  test('before service → isBeforeService=true, returns firstTrain', () => {
    const now = makeDate(5, 30); // 05:30 - after midnight threshold but before first train
    const result = calculateNextTrain(yenikapi, 'toGebze', now);
    expect(result.isBeforeService).toBe(true);
    expect(result.isServiceOver).toBe(false);
    expect(result.nextTrainTime).toBe('06:00');
  });

  test('during service → countdown > 0, nextTrainTime defined', () => {
    const now = makeDate(12, 0); // 12:00 - mid-day
    const result = calculateNextTrain(yenikapi, 'toGebze', now);
    expect(result.isBeforeService).toBe(false);
    expect(result.isServiceOver).toBe(false);
    expect(result.remainingMs).toBeGreaterThan(0);
    expect(result.nextTrainTime).toBeDefined();
    expect(result.nextTrainTime).not.toBe('');
  });

  test('after service → isServiceOver=true', () => {
    const now = makeDate(23, 45); // 23:45 - after toGebze last train at Yenikapi (23:30)
    const result = calculateNextTrain(yenikapi, 'toGebze', now);
    // Full line last train at 23:30, short line last train at 22:08
    // At 23:45 both should be over
    expect(result.isServiceOver).toBe(true);
  });

  test('terminus station → isServiceOver', () => {
    const now = makeDate(12, 0);
    const result = calculateNextTrain(halkali, 'toHalkali', now);
    expect(result.isServiceOver).toBe(true);
  });

  test('Gebze terminus for toGebze → isServiceOver', () => {
    const now = makeDate(12, 0);
    const result = calculateNextTrain(gebze, 'toGebze', now);
    expect(result.isServiceOver).toBe(true);
  });

  test('direction label is correct', () => {
    const now = makeDate(12, 0);
    const toHalkali = calculateNextTrain(yenikapi, 'toHalkali', now);
    expect(toHalkali.directionLabel).toBe('Halkalı');

    const toGebze = calculateNextTrain(yenikapi, 'toGebze', now);
    expect(toGebze.directionLabel).toBe('Gebze');
  });
});

describe('getUpcomingTrains', () => {
  const yenikapi = stationMap.get('yenikapi')!;
  const halkali = stationMap.get('halkali')!;

  test('returns correct count of trains', () => {
    const now = makeDate(12, 0);
    const trains = getUpcomingTrains(yenikapi, 'toGebze', now, 4);
    expect(trains.length).toBeLessThanOrEqual(4);
    expect(trains.length).toBeGreaterThan(0);
  });

  test('trains are sorted by minutesFromNow', () => {
    const now = makeDate(12, 0);
    const trains = getUpcomingTrains(yenikapi, 'toGebze', now, 6);
    for (let i = 1; i < trains.length; i++) {
      expect(trains[i].minutesFromNow).toBeGreaterThanOrEqual(
        trains[i - 1].minutesFromNow,
      );
    }
  });

  test('includes both route types for mid-route stations', () => {
    const now = makeDate(12, 0); // During both full and short line service
    const trains = getUpcomingTrains(yenikapi, 'toGebze', now, 8);
    const routeTypes = new Set(trains.map((t) => t.routeType));
    expect(routeTypes.has('full')).toBe(true);
    expect(routeTypes.has('short')).toBe(true);
  });

  test('terminus station returns empty array', () => {
    const now = makeDate(12, 0);
    const trains = getUpcomingTrains(halkali, 'toHalkali', now, 4);
    expect(trains).toHaveLength(0);
  });

  test('after service returns empty array', () => {
    const now = makeDate(23, 50);
    const trains = getUpcomingTrains(yenikapi, 'toGebze', now, 4);
    expect(trains).toHaveLength(0);
  });
});

describe('getAllDepartures', () => {
  const yenikapi = stationMap.get('yenikapi')!;
  const halkali = stationMap.get('halkali')!;
  const gebze = stationMap.get('gebze')!;
  const mustafaKemal = stationMap.get('mustafa-kemal')!;

  test('returns sections grouped by hour', () => {
    const sections = getAllDepartures(yenikapi, 'toGebze');
    expect(sections.length).toBeGreaterThan(0);
    // Each section title should be "HH:00" format
    for (const section of sections) {
      expect(section.title).toMatch(/^\d{2}:00$/);
      expect(section.data.length).toBeGreaterThan(0);
    }
  });

  test('sections are in chronological order', () => {
    const sections = getAllDepartures(yenikapi, 'toGebze');
    for (let i = 1; i < sections.length; i++) {
      const prevHour = parseInt(sections[i - 1].title.split(':')[0], 10);
      const currHour = parseInt(sections[i].title.split(':')[0], 10);
      // Allow wrap from 23 -> 0
      if (prevHour !== 23 || currHour !== 0) {
        expect(currHour).toBeGreaterThanOrEqual(prevHour);
      }
    }
  });

  test('entries within a section are sorted by timeMinutes', () => {
    const sections = getAllDepartures(yenikapi, 'toGebze');
    for (const section of sections) {
      for (let i = 1; i < section.data.length; i++) {
        expect(section.data[i].timeMinutes).toBeGreaterThanOrEqual(
          section.data[i - 1].timeMinutes,
        );
      }
    }
  });

  test('includes both full and short route types for mid-route station', () => {
    const sections = getAllDepartures(yenikapi, 'toGebze');
    const allEntries = sections.flatMap((s) => s.data);
    const routeTypes = new Set(allEntries.map((e) => e.routeType));
    expect(routeTypes.has('full')).toBe(true);
    expect(routeTypes.has('short')).toBe(true);
  });

  test('only full route for stations outside short line range', () => {
    // mustafa-kemal has no short line schedules
    const sections = getAllDepartures(mustafaKemal, 'toGebze');
    const allEntries = sections.flatMap((s) => s.data);
    const routeTypes = new Set(allEntries.map((e) => e.routeType));
    expect(routeTypes.has('full')).toBe(true);
    expect(routeTypes.has('short')).toBe(false);
  });

  test('terminus station returns empty sections', () => {
    const sections = getAllDepartures(halkali, 'toHalkali');
    expect(sections).toHaveLength(0);
  });

  test('Gebze terminus toGebze returns empty', () => {
    const sections = getAllDepartures(gebze, 'toGebze');
    expect(sections).toHaveLength(0);
  });

  test('every entry has a valid time string', () => {
    const sections = getAllDepartures(yenikapi, 'toHalkali');
    for (const section of sections) {
      for (const entry of section.data) {
        expect(entry.time).toMatch(/^\d{2}:\d{2}$/);
        expect(entry.destination).toBeTruthy();
      }
    }
  });

  test('short toHalkali entries after 21:00 have Zeytinburnu destination', () => {
    const sections = getAllDepartures(yenikapi, 'toHalkali');
    const lateShort = sections
      .flatMap((s) => s.data)
      .filter(
        (e) =>
          e.routeType === 'short' &&
          (e.timeMinutes % 1440) >= 21 * 60,
      );
    for (const entry of lateShort) {
      expect(entry.destination).toBe('Zeytinburnu');
    }
  });

  test('total departure count is reasonable', () => {
    const sections = getAllDepartures(yenikapi, 'toGebze');
    const total = sections.reduce((sum, s) => sum + s.data.length, 0);
    // Yenikapi toGebze: full line ~17h/15min ≈ 69, short line ~16h/15min ≈ 65 → ~134
    expect(total).toBeGreaterThan(50);
    expect(total).toBeLessThan(300);
  });

  test('midnight crossover: station with lastTrain past midnight', () => {
    // mustafa-kemal toHalkali: firstTrain 06:22, lastTrain 00:35
    const sections = getAllDepartures(mustafaKemal, 'toHalkali');
    const allEntries = sections.flatMap((s) => s.data);
    // Should have entries in hour 0 (00:xx)
    const midnightEntries = allEntries.filter(
      (e) => (e.timeMinutes % 1440) < 60,
    );
    expect(midnightEntries.length).toBeGreaterThan(0);
    // Last entry should be at or before 00:35
    const lastMidnight = midnightEntries[midnightEntries.length - 1];
    expect(lastMidnight.timeMinutes % 1440).toBeLessThanOrEqual(35);
  });
});
