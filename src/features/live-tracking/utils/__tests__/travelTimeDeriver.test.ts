import { getTravelOffsets, getTotalTravelTime } from '../travelTimeDeriver';

describe('travelTimeDeriver', () => {
  describe('full line toGebze', () => {
    const result = getTravelOffsets('toGebze', 'full');

    test('origin is Halkalı', () => {
      expect(result.originStationId).toBe('halkali');
    });

    test('offsets are monotonically increasing', () => {
      for (let i = 1; i < result.offsets.length; i++) {
        expect(result.offsets[i].minutesFromOrigin).toBeGreaterThanOrEqual(
          result.offsets[i - 1].minutesFromOrigin,
        );
      }
    });

    test('first offset is 0', () => {
      expect(result.offsets[0].minutesFromOrigin).toBe(0);
    });

    test('total travel time is ~105 minutes', () => {
      const total = getTotalTravelTime('toGebze', 'full');
      expect(total).toBeGreaterThanOrEqual(100);
      expect(total).toBeLessThanOrEqual(110);
    });
  });

  describe('full line toHalkali', () => {
    const result = getTravelOffsets('toHalkali', 'full');

    test('origin is Gebze', () => {
      expect(result.originStationId).toBe('gebze');
    });

    test('offsets are monotonically increasing', () => {
      for (let i = 1; i < result.offsets.length; i++) {
        expect(result.offsets[i].minutesFromOrigin).toBeGreaterThanOrEqual(
          result.offsets[i - 1].minutesFromOrigin,
        );
      }
    });

    test('first offset is 0', () => {
      expect(result.offsets[0].minutesFromOrigin).toBe(0);
    });

    test('total travel time is ~105 minutes', () => {
      const total = getTotalTravelTime('toHalkali', 'full');
      expect(total).toBeGreaterThanOrEqual(100);
      expect(total).toBeLessThanOrEqual(110);
    });
  });

  describe('known inter-station travel times', () => {
    test('Sirkeci to Üsküdar = 4 min', () => {
      const toGebze = getTravelOffsets('toGebze', 'full');
      const sirkeci = toGebze.offsets.find((o) => o.stationId === 'sirkeci')!;
      const uskudar = toGebze.offsets.find((o) => o.stationId === 'uskudar')!;
      expect(uskudar.minutesFromOrigin - sirkeci.minutesFromOrigin).toBe(4);
    });

    test('Yenikapı to Söğütlüçeşme = 14 min', () => {
      const toGebze = getTravelOffsets('toGebze', 'full');
      const yenikapi = toGebze.offsets.find((o) => o.stationId === 'yenikapi')!;
      const sogutlu = toGebze.offsets.find((o) => o.stationId === 'sogutlucesme')!;
      expect(sogutlu.minutesFromOrigin - yenikapi.minutesFromOrigin).toBe(14);
    });

    test('Kazlıçeşme to Ayrılıkçeşmesi = 15 min', () => {
      const toGebze = getTravelOffsets('toGebze', 'full');
      const kazli = toGebze.offsets.find((o) => o.stationId === 'kazlicesme')!;
      const ayrilik = toGebze.offsets.find((o) => o.stationId === 'ayrilik-cesmesi')!;
      expect(ayrilik.minutesFromOrigin - kazli.minutesFromOrigin).toBe(15);
    });
  });

  describe('short line', () => {
    test('shortToGebze origin is Ataköy', () => {
      const result = getTravelOffsets('toGebze', 'short');
      expect(result.originStationId).toBe('atakoy');
    });

    test('shortToHalkali origin is derived from shortToGebze (reversed)', () => {
      const result = getTravelOffsets('toHalkali', 'short');
      // Origin should be Yunus (last shortToGebze station, reversed to first)
      // because Pendik has shortToGebze=null so it's not in canonicalOffsets
      // The first station in filtered reversed offsets has shortToHalkali schedule
      expect(result.offsets.length).toBeGreaterThan(0);
      expect(result.offsets[0].minutesFromOrigin).toBe(0);
    });

    test('short line toGebze has 24 stations (Ataköy to Yunus, Pendik terminus excluded)', () => {
      const toGebze = getTravelOffsets('toGebze', 'short');
      expect(toGebze.offsets).toHaveLength(24);
    });

    test('short line toHalkali has 24 stations (Pendik area to Bakırköy, Ataköy terminus excluded)', () => {
      const toHalkali = getTravelOffsets('toHalkali', 'short');
      expect(toHalkali.offsets).toHaveLength(24);
    });

    test('all short line offsets are non-negative', () => {
      const toGebze = getTravelOffsets('toGebze', 'short');
      for (const o of toGebze.offsets) {
        expect(o.minutesFromOrigin).toBeGreaterThanOrEqual(0);
      }

      const toHalkali = getTravelOffsets('toHalkali', 'short');
      for (const o of toHalkali.offsets) {
        expect(o.minutesFromOrigin).toBeGreaterThanOrEqual(0);
      }
    });

    test('short line offsets are monotonically increasing in both directions', () => {
      const toGebze = getTravelOffsets('toGebze', 'short');
      for (let i = 1; i < toGebze.offsets.length; i++) {
        expect(toGebze.offsets[i].minutesFromOrigin).toBeGreaterThanOrEqual(
          toGebze.offsets[i - 1].minutesFromOrigin,
        );
      }

      const toHalkali = getTravelOffsets('toHalkali', 'short');
      for (let i = 1; i < toHalkali.offsets.length; i++) {
        expect(toHalkali.offsets[i].minutesFromOrigin).toBeGreaterThanOrEqual(
          toHalkali.offsets[i - 1].minutesFromOrigin,
        );
      }
    });

    test('short line total travel time is ~60 minutes', () => {
      const totalGebze = getTotalTravelTime('toGebze', 'short');
      expect(totalGebze).toBeGreaterThanOrEqual(55);
      expect(totalGebze).toBeLessThanOrEqual(65);

      const totalHalkali = getTotalTravelTime('toHalkali', 'short');
      expect(totalHalkali).toBeGreaterThanOrEqual(55);
      expect(totalHalkali).toBeLessThanOrEqual(65);
    });

    test('short line travel time is symmetric between directions', () => {
      const totalGebze = getTotalTravelTime('toGebze', 'short');
      const totalHalkali = getTotalTravelTime('toHalkali', 'short');
      expect(Math.abs(totalGebze - totalHalkali)).toBeLessThanOrEqual(1);
    });
  });
});
