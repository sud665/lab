import { describe, it, expect, vi, afterEach } from 'vitest';
import { formatTime, formatMoney, calculateMoney, getCurrentTime, getTodayDateString } from './time';

describe('formatTime', () => {
  it('0초를 00:00:00으로 표시', () => {
    expect(formatTime(0)).toBe('00:00:00');
  });

  it('초만 있는 경우 (45초)', () => {
    expect(formatTime(45)).toBe('00:00:45');
  });

  it('분+초 (5분 30초 = 330초)', () => {
    expect(formatTime(330)).toBe('00:05:30');
  });

  it('시+분+초 (1시간 23분 45초 = 5025초)', () => {
    expect(formatTime(5025)).toBe('01:23:45');
  });

  it('정각 (1시간 = 3600초)', () => {
    expect(formatTime(3600)).toBe('01:00:00');
  });

  it('큰 값 (10시간)', () => {
    expect(formatTime(36000)).toBe('10:00:00');
  });
});

describe('formatMoney', () => {
  it('0원', () => {
    expect(formatMoney(0)).toBe('₩0');
  });

  it('소액 (500원)', () => {
    expect(formatMoney(500)).toBe('₩500');
  });

  it('천 단위 구분자 (1,000원)', () => {
    expect(formatMoney(1000)).toBe('₩1,000');
  });

  it('큰 금액 (1,234,567원)', () => {
    expect(formatMoney(1234567)).toBe('₩1,234,567');
  });
});

describe('calculateMoney', () => {
  it('0초 → 0원', () => {
    expect(calculateMoney(0, 20000)).toBe(0);
  });

  it('1시간(3600초) × 시급 20,000원 → 20,000원', () => {
    expect(calculateMoney(3600, 20000)).toBe(20000);
  });

  it('30분(1800초) × 시급 20,000원 → 10,000원', () => {
    expect(calculateMoney(1800, 20000)).toBe(10000);
  });

  it('소수점 내림 (100초 × 20,000원)', () => {
    // 100/3600 * 20000 = 555.555... → 555
    expect(calculateMoney(100, 20000)).toBe(555);
  });

  it('다른 시급 (3600초 × 50,000원)', () => {
    expect(calculateMoney(3600, 50000)).toBe(50000);
  });
});

describe('getCurrentTime', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('자정 → "00:00"', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1, 0, 0));
    expect(getCurrentTime()).toBe('00:00');
  });

  it('오전 9시 5분 → "09:05" (zero-pad)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1, 9, 5));
    expect(getCurrentTime()).toBe('09:05');
  });

  it('오후 11시 59분 → "23:59"', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 1, 23, 59));
    expect(getCurrentTime()).toBe('23:59');
  });
});

describe('getTodayDateString', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('"2026-02-08" 형식 반환', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 1, 8));
    expect(getTodayDateString()).toBe('2026-02-08');
  });

  it('월/일 zero-pad (2026-01-05)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 5));
    expect(getTodayDateString()).toBe('2026-01-05');
  });

  it('12월 31일', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 11, 31));
    expect(getTodayDateString()).toBe('2026-12-31');
  });
});
