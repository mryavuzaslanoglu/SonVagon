import { parseTimeToMinutes, minutesToTimeString } from '../timeUtils';

describe('parseTimeToMinutes', () => {
  test('00:00 = 0', () => {
    expect(parseTimeToMinutes('00:00')).toBe(0);
  });

  test('06:00 = 360', () => {
    expect(parseTimeToMinutes('06:00')).toBe(360);
  });

  test('23:30 = 1410', () => {
    expect(parseTimeToMinutes('23:30')).toBe(1410);
  });

  test('12:00 = 720', () => {
    expect(parseTimeToMinutes('12:00')).toBe(720);
  });

  test('00:30 = 30', () => {
    expect(parseTimeToMinutes('00:30')).toBe(30);
  });

  test('23:59 = 1439', () => {
    expect(parseTimeToMinutes('23:59')).toBe(1439);
  });
});

describe('minutesToTimeString', () => {
  test('roundtrip correctness', () => {
    const cases = ['00:00', '06:00', '12:30', '23:59', '00:01'];
    for (const time of cases) {
      expect(minutesToTimeString(parseTimeToMinutes(time))).toBe(time);
    }
  });

  test('handles midnight wrap (1440 -> 00:00)', () => {
    expect(minutesToTimeString(1440)).toBe('00:00');
  });

  test('handles values > 1440 (next day wrap)', () => {
    expect(minutesToTimeString(1470)).toBe('00:30');
  });

  test('handles negative values', () => {
    expect(minutesToTimeString(-30)).toBe('23:30');
  });

  test('0 = 00:00', () => {
    expect(minutesToTimeString(0)).toBe('00:00');
  });

  test('720 = 12:00', () => {
    expect(minutesToTimeString(720)).toBe('12:00');
  });
});
