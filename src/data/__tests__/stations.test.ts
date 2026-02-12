import { stations, stationMap } from '../stations';

describe('stations data integrity', () => {
  test('contains exactly 43 stations', () => {
    expect(stations).toHaveLength(43);
  });

  test('orders 0-42 with no gaps or duplicates', () => {
    const orders = stations.map((s) => s.order).sort((a, b) => a - b);
    expect(orders).toEqual(Array.from({ length: 43 }, (_, i) => i));
  });

  test('all station IDs are unique', () => {
    const ids = stations.map((s) => s.id);
    expect(new Set(ids).size).toBe(43);
  });

  test('stationMap has all 43 entries', () => {
    expect(stationMap.size).toBe(43);
  });

  test('Halkalı is terminus for toHalkali (null schedule)', () => {
    const halkali = stationMap.get('halkali')!;
    expect(halkali.schedule.toHalkali).toBeNull();
    expect(halkali.schedule.toGebze).not.toBeNull();
  });

  test('Gebze is terminus for toGebze (null schedule)', () => {
    const gebze = stationMap.get('gebze')!;
    expect(gebze.schedule.toGebze).toBeNull();
    expect(gebze.schedule.toHalkali).not.toBeNull();
  });

  test('all schedule times match HH:MM format', () => {
    const timeRegex = /^\d{2}:\d{2}$/;
    for (const station of stations) {
      const { toHalkali, toGebze, shortToHalkali, shortToGebze } = station.schedule;
      for (const sched of [toHalkali, toGebze, shortToHalkali, shortToGebze]) {
        if (sched) {
          expect(sched.firstTrain).toMatch(timeRegex);
          expect(sched.lastTrain).toMatch(timeRegex);
          expect(sched.weekendLastTrain).toMatch(timeRegex);
          expect(sched.intervalMinutes).toBeGreaterThan(0);
        }
      }
    }
  });

  test('all line intervals are 15 minutes', () => {
    for (const station of stations) {
      const { toHalkali, toGebze, shortToHalkali, shortToGebze } = station.schedule;
      if (toHalkali) expect(toHalkali.intervalMinutes).toBe(15);
      if (toGebze) expect(toGebze.intervalMinutes).toBe(15);
      if (shortToHalkali) expect(shortToHalkali.intervalMinutes).toBe(15);
      if (shortToGebze) expect(shortToGebze.intervalMinutes).toBe(15);
    }
  });

  test('spot-check firstTrain/lastTrain values against official data', () => {
    const halkali = stationMap.get('halkali')!;
    expect(halkali.schedule.toGebze!.firstTrain).toBe('05:58');
    expect(halkali.schedule.toGebze!.lastTrain).toBe('22:58');

    const gebze = stationMap.get('gebze')!;
    expect(gebze.schedule.toHalkali!.firstTrain).toBe('06:05');
    expect(gebze.schedule.toHalkali!.lastTrain).toBe('22:50');

    const yenikapi = stationMap.get('yenikapi')!;
    expect(yenikapi.schedule.toGebze!.firstTrain).toBe('06:00');
    expect(yenikapi.schedule.toGebze!.lastTrain).toBe('23:30');
    expect(yenikapi.schedule.toHalkali!.firstTrain).toBe('06:06');
    expect(yenikapi.schedule.toHalkali!.lastTrain).toBe('00:06');
  });

  test('weekendLastTrain present for all full-line schedules', () => {
    for (const station of stations) {
      const { toHalkali, toGebze } = station.schedule;
      if (toHalkali) {
        expect(toHalkali.weekendLastTrain).toBeDefined();
        expect(toHalkali.weekendLastTrain).toMatch(/^\d{2}:\d{2}$/);
      }
      if (toGebze) {
        expect(toGebze.weekendLastTrain).toBeDefined();
        expect(toGebze.weekendLastTrain).toMatch(/^\d{2}:\d{2}$/);
      }
    }
  });

  test('spot-check weekendLastTrain values', () => {
    const halkali = stationMap.get('halkali')!;
    expect(halkali.schedule.toGebze!.weekendLastTrain).toBe('01:28');

    const gebze = stationMap.get('gebze')!;
    expect(gebze.schedule.toHalkali!.weekendLastTrain).toBe('01:20');

    const darica = stationMap.get('darica')!;
    expect(darica.schedule.toGebze!.weekendLastTrain).toBe('03:13');

    const mk = stationMap.get('mustafa-kemal')!;
    expect(mk.schedule.toHalkali!.weekendLastTrain).toBe('03:05');
  });

  test('short line terminus stations have null short schedules', () => {
    const atakoy = stationMap.get('atakoy')!;
    expect(atakoy.schedule.shortToHalkali).toBeNull();
    expect(atakoy.schedule.shortToGebze).not.toBeNull();

    const pendik = stationMap.get('pendik')!;
    expect(pendik.schedule.shortToGebze).toBeNull();
    expect(pendik.schedule.shortToHalkali).not.toBeNull();
  });

  test('stations outside short line zone have no short schedule keys', () => {
    const halkali = stationMap.get('halkali')!;
    expect(halkali.schedule.shortToHalkali).toBeUndefined();
    expect(halkali.schedule.shortToGebze).toBeUndefined();

    const gebze = stationMap.get('gebze')!;
    expect(gebze.schedule.shortToHalkali).toBeUndefined();
    expect(gebze.schedule.shortToGebze).toBeUndefined();
  });

  test('side grouping: orders 0-13 are avrupa, 14-42 are asya', () => {
    for (const station of stations) {
      if (station.order <= 13) {
        expect(station.side).toBe('avrupa');
      } else {
        expect(station.side).toBe('asya');
      }
    }
  });
});
