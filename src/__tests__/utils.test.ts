import { describe, it, expect } from 'vitest';
import { clamp01, smoothstep, lerp, damp } from '../lib/utils';

describe('clamp01', () => {
  it('clamps below 0 to 0', () => expect(clamp01(-1)).toBe(0));
  it('clamps above 1 to 1', () => expect(clamp01(2)).toBe(1));
  it('passes through mid value', () => expect(clamp01(0.5)).toBe(0.5));
});

describe('smoothstep', () => {
  it('returns 0 at edge0', () => expect(smoothstep(0, 1, 0)).toBe(0));
  it('returns 1 at edge1', () => expect(smoothstep(0, 1, 1)).toBe(1));
  it('returns ~0.5 at midpoint', () => expect(smoothstep(0, 1, 0.5)).toBeCloseTo(0.5));
  it('clamps below edge0', () => expect(smoothstep(0, 1, -0.5)).toBe(0));
  it('clamps above edge1', () => expect(smoothstep(0, 1, 1.5)).toBe(1));
});

describe('lerp', () => {
  it('returns a at t=0', () => expect(lerp(0, 10, 0)).toBe(0));
  it('returns b at t=1', () => expect(lerp(0, 10, 1)).toBe(10));
  it('interpolates at t=0.5', () => expect(lerp(0, 10, 0.5)).toBe(5));
});

describe('damp', () => {
  it('moves current toward target', () => {
    const result = damp(0, 10, 0.1, 0.016);
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(10);
  });
});
