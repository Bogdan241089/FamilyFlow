import { getLevel, calculatePoints } from '../gamificationService';

describe('gamificationService', () => {
  describe('getLevel', () => {
    test('returns level 1 for 0 points', () => {
      const level = getLevel(0);
      expect(level.level).toBe(1);
      expect(level.name).toBe('Новичок');
    });

    test('returns level 2 for 100 points', () => {
      const level = getLevel(100);
      expect(level.level).toBe(2);
    });

    test('returns level 10 for 10000+ points', () => {
      const level = getLevel(15000);
      expect(level.level).toBe(10);
      expect(level.name).toBe('Легенда');
    });
  });

  describe('calculatePoints', () => {
    test('calculates points for high priority task', () => {
      const task = { priority: 'high' };
      const points = calculatePoints(task);
      expect(points).toBe(30);
    });

    test('calculates points for medium priority task', () => {
      const task = { priority: 'medium' };
      const points = calculatePoints(task);
      expect(points).toBe(20);
    });

    test('calculates points for low priority task', () => {
      const task = { priority: 'low' };
      const points = calculatePoints(task);
      expect(points).toBe(10);
    });

    test('defaults to 10 points for unknown priority', () => {
      const task = { priority: 'unknown' };
      const points = calculatePoints(task);
      expect(points).toBe(10);
    });
  });
});
