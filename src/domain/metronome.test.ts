import { describe, it, expect } from 'vitest';
import {
  validateBpm,
  validateBeatsPerMeasure,
  validatePlayEveryNMeasures,
  validateCountInMeasures,
  isSoundingMeasure,
  isCountInPhase,
  calculateBeatState,
  calculateCountInBeatState,
  isFirstBeatOfMeasure,
  calculateSecondsPerBeat,
  BPM_MIN,
  BPM_MAX,
  BEATS_PER_MEASURE_MIN,
  BEATS_PER_MEASURE_MAX,
  PLAY_EVERY_N_MIN,
  PLAY_EVERY_N_MAX,
  COUNT_IN_MEASURES_MIN,
  COUNT_IN_MEASURES_MAX,
} from './metronome';

describe('validateBpm', () => {
  it('returns floored value for valid BPM', () => {
    expect(validateBpm(120)).toBe(120);
    expect(validateBpm(120.7)).toBe(120);
    expect(validateBpm(60.5)).toBe(60);
  });

  it('returns null for BPM below minimum', () => {
    expect(validateBpm(39)).toBeNull();
    expect(validateBpm(0)).toBeNull();
    expect(validateBpm(-10)).toBeNull();
  });

  it('returns null for BPM above maximum', () => {
    expect(validateBpm(241)).toBeNull();
    expect(validateBpm(300)).toBeNull();
  });

  it('accepts boundary values', () => {
    expect(validateBpm(BPM_MIN)).toBe(BPM_MIN);
    expect(validateBpm(BPM_MAX)).toBe(BPM_MAX);
  });

  it('returns null for NaN', () => {
    expect(validateBpm(NaN)).toBeNull();
  });

  it('returns null for Infinity', () => {
    expect(validateBpm(Infinity)).toBeNull();
    expect(validateBpm(-Infinity)).toBeNull();
  });
});

describe('validateBeatsPerMeasure', () => {
  it('returns floored value for valid beats per measure', () => {
    expect(validateBeatsPerMeasure(4)).toBe(4);
    expect(validateBeatsPerMeasure(3.9)).toBe(3);
  });

  it('returns null for values below minimum', () => {
    expect(validateBeatsPerMeasure(0)).toBeNull();
    expect(validateBeatsPerMeasure(-1)).toBeNull();
  });

  it('returns null for values above maximum', () => {
    expect(validateBeatsPerMeasure(17)).toBeNull();
    expect(validateBeatsPerMeasure(100)).toBeNull();
  });

  it('accepts boundary values', () => {
    expect(validateBeatsPerMeasure(BEATS_PER_MEASURE_MIN)).toBe(BEATS_PER_MEASURE_MIN);
    expect(validateBeatsPerMeasure(BEATS_PER_MEASURE_MAX)).toBe(BEATS_PER_MEASURE_MAX);
  });

  it('returns null for NaN', () => {
    expect(validateBeatsPerMeasure(NaN)).toBeNull();
  });
});

describe('validatePlayEveryNMeasures', () => {
  it('returns floored value for valid play every N', () => {
    expect(validatePlayEveryNMeasures(4)).toBe(4);
    expect(validatePlayEveryNMeasures(8.5)).toBe(8);
  });

  it('returns null for values below minimum', () => {
    expect(validatePlayEveryNMeasures(0)).toBeNull();
    expect(validatePlayEveryNMeasures(-1)).toBeNull();
  });

  it('returns null for values above maximum', () => {
    expect(validatePlayEveryNMeasures(33)).toBeNull();
    expect(validatePlayEveryNMeasures(100)).toBeNull();
  });

  it('accepts boundary values', () => {
    expect(validatePlayEveryNMeasures(PLAY_EVERY_N_MIN)).toBe(PLAY_EVERY_N_MIN);
    expect(validatePlayEveryNMeasures(PLAY_EVERY_N_MAX)).toBe(PLAY_EVERY_N_MAX);
  });

  it('returns null for NaN', () => {
    expect(validatePlayEveryNMeasures(NaN)).toBeNull();
  });
});

describe('isSoundingMeasure', () => {
  describe('when playEveryN is 1 (normal metronome)', () => {
    it('returns true for all measures', () => {
      expect(isSoundingMeasure(1, 1)).toBe(true);
      expect(isSoundingMeasure(2, 1)).toBe(true);
      expect(isSoundingMeasure(100, 1)).toBe(true);
    });
  });

  describe('when playEveryN is 2', () => {
    it('returns true for odd measures', () => {
      expect(isSoundingMeasure(1, 2)).toBe(true);
      expect(isSoundingMeasure(3, 2)).toBe(true);
      expect(isSoundingMeasure(5, 2)).toBe(true);
    });

    it('returns false for even measures', () => {
      expect(isSoundingMeasure(2, 2)).toBe(false);
      expect(isSoundingMeasure(4, 2)).toBe(false);
      expect(isSoundingMeasure(6, 2)).toBe(false);
    });
  });

  describe('when playEveryN is 4', () => {
    it('returns true for measures 1, 5, 9, etc.', () => {
      expect(isSoundingMeasure(1, 4)).toBe(true);
      expect(isSoundingMeasure(5, 4)).toBe(true);
      expect(isSoundingMeasure(9, 4)).toBe(true);
      expect(isSoundingMeasure(13, 4)).toBe(true);
    });

    it('returns false for measures 2, 3, 4, 6, 7, 8, etc.', () => {
      expect(isSoundingMeasure(2, 4)).toBe(false);
      expect(isSoundingMeasure(3, 4)).toBe(false);
      expect(isSoundingMeasure(4, 4)).toBe(false);
      expect(isSoundingMeasure(6, 4)).toBe(false);
      expect(isSoundingMeasure(7, 4)).toBe(false);
      expect(isSoundingMeasure(8, 4)).toBe(false);
    });
  });

  describe('with large playEveryN value', () => {
    it('returns true only for measure 1 in each cycle', () => {
      const playEveryN = 8;
      expect(isSoundingMeasure(1, playEveryN)).toBe(true);
      expect(isSoundingMeasure(9, playEveryN)).toBe(true);
      expect(isSoundingMeasure(17, playEveryN)).toBe(true);

      // All others in the cycle should be silent
      for (let m = 2; m <= 8; m++) {
        expect(isSoundingMeasure(m, playEveryN)).toBe(false);
      }
    });
  });
});

describe('calculateBeatState', () => {
  describe('with 4 beats per measure', () => {
    const beatsPerMeasure = 4;

    it('calculates first beat of first measure', () => {
      expect(calculateBeatState(0, beatsPerMeasure)).toEqual({ beat: 1, measure: 1 });
    });

    it('calculates subsequent beats in first measure', () => {
      expect(calculateBeatState(1, beatsPerMeasure)).toEqual({ beat: 2, measure: 1 });
      expect(calculateBeatState(2, beatsPerMeasure)).toEqual({ beat: 3, measure: 1 });
      expect(calculateBeatState(3, beatsPerMeasure)).toEqual({ beat: 4, measure: 1 });
    });

    it('wraps to next measure', () => {
      expect(calculateBeatState(4, beatsPerMeasure)).toEqual({ beat: 1, measure: 2 });
      expect(calculateBeatState(5, beatsPerMeasure)).toEqual({ beat: 2, measure: 2 });
    });

    it('handles multiple measures', () => {
      expect(calculateBeatState(8, beatsPerMeasure)).toEqual({ beat: 1, measure: 3 });
      expect(calculateBeatState(15, beatsPerMeasure)).toEqual({ beat: 4, measure: 4 });
      expect(calculateBeatState(16, beatsPerMeasure)).toEqual({ beat: 1, measure: 5 });
    });
  });

  describe('with 3 beats per measure (waltz time)', () => {
    const beatsPerMeasure = 3;

    it('cycles through 3 beats correctly', () => {
      expect(calculateBeatState(0, beatsPerMeasure)).toEqual({ beat: 1, measure: 1 });
      expect(calculateBeatState(1, beatsPerMeasure)).toEqual({ beat: 2, measure: 1 });
      expect(calculateBeatState(2, beatsPerMeasure)).toEqual({ beat: 3, measure: 1 });
      expect(calculateBeatState(3, beatsPerMeasure)).toEqual({ beat: 1, measure: 2 });
      expect(calculateBeatState(6, beatsPerMeasure)).toEqual({ beat: 1, measure: 3 });
    });
  });

  describe('with 1 beat per measure', () => {
    const beatsPerMeasure = 1;

    it('increments measure on every beat', () => {
      expect(calculateBeatState(0, beatsPerMeasure)).toEqual({ beat: 1, measure: 1 });
      expect(calculateBeatState(1, beatsPerMeasure)).toEqual({ beat: 1, measure: 2 });
      expect(calculateBeatState(2, beatsPerMeasure)).toEqual({ beat: 1, measure: 3 });
    });
  });
});

describe('isFirstBeatOfMeasure', () => {
  it('returns true for first beat (beatCount 0)', () => {
    expect(isFirstBeatOfMeasure(0, 4)).toBe(true);
    expect(isFirstBeatOfMeasure(0, 3)).toBe(true);
  });

  it('returns false for other beats in measure', () => {
    expect(isFirstBeatOfMeasure(1, 4)).toBe(false);
    expect(isFirstBeatOfMeasure(2, 4)).toBe(false);
    expect(isFirstBeatOfMeasure(3, 4)).toBe(false);
  });

  it('returns true at measure boundaries', () => {
    expect(isFirstBeatOfMeasure(4, 4)).toBe(true); // Start of measure 2
    expect(isFirstBeatOfMeasure(8, 4)).toBe(true); // Start of measure 3
    expect(isFirstBeatOfMeasure(3, 3)).toBe(true); // Start of measure 2 in 3/4
    expect(isFirstBeatOfMeasure(6, 3)).toBe(true); // Start of measure 3 in 3/4
  });
});

describe('calculateSecondsPerBeat', () => {
  it('calculates correct interval for common tempos', () => {
    expect(calculateSecondsPerBeat(60)).toBe(1); // 60 BPM = 1 second per beat
    expect(calculateSecondsPerBeat(120)).toBe(0.5); // 120 BPM = 0.5 seconds per beat
    expect(calculateSecondsPerBeat(240)).toBe(0.25); // 240 BPM = 0.25 seconds per beat
  });

  it('calculates correct interval for non-standard tempos', () => {
    expect(calculateSecondsPerBeat(90)).toBeCloseTo(0.6667, 3);
    expect(calculateSecondsPerBeat(80)).toBe(0.75);
    expect(calculateSecondsPerBeat(100)).toBe(0.6);
  });
});

describe('validateCountInMeasures', () => {
  it('returns floored value for valid count-in measures', () => {
    expect(validateCountInMeasures(0)).toBe(0);
    expect(validateCountInMeasures(2)).toBe(2);
    expect(validateCountInMeasures(3.9)).toBe(3);
  });

  it('returns null for values below minimum', () => {
    expect(validateCountInMeasures(-1)).toBeNull();
    expect(validateCountInMeasures(-10)).toBeNull();
  });

  it('returns null for values above maximum', () => {
    expect(validateCountInMeasures(5)).toBeNull();
    expect(validateCountInMeasures(100)).toBeNull();
  });

  it('accepts boundary values', () => {
    expect(validateCountInMeasures(COUNT_IN_MEASURES_MIN)).toBe(COUNT_IN_MEASURES_MIN);
    expect(validateCountInMeasures(COUNT_IN_MEASURES_MAX)).toBe(COUNT_IN_MEASURES_MAX);
  });

  it('returns null for NaN', () => {
    expect(validateCountInMeasures(NaN)).toBeNull();
  });
});

describe('isCountInPhase', () => {
  describe('when countInMeasures is 0', () => {
    it('always returns false', () => {
      expect(isCountInPhase(0, 0, 4)).toBe(false);
      expect(isCountInPhase(1, 0, 4)).toBe(false);
      expect(isCountInPhase(100, 0, 4)).toBe(false);
    });
  });

  describe('when countInMeasures is 1 with 4 beats per measure', () => {
    it('returns true for beats 0-3', () => {
      expect(isCountInPhase(0, 1, 4)).toBe(true);
      expect(isCountInPhase(1, 1, 4)).toBe(true);
      expect(isCountInPhase(2, 1, 4)).toBe(true);
      expect(isCountInPhase(3, 1, 4)).toBe(true);
    });

    it('returns false from beat 4 onward', () => {
      expect(isCountInPhase(4, 1, 4)).toBe(false);
      expect(isCountInPhase(5, 1, 4)).toBe(false);
      expect(isCountInPhase(100, 1, 4)).toBe(false);
    });
  });

  describe('when countInMeasures is 2 with 3 beats per measure', () => {
    it('returns true for beats 0-5', () => {
      for (let i = 0; i < 6; i++) {
        expect(isCountInPhase(i, 2, 3)).toBe(true);
      }
    });

    it('returns false from beat 6 onward', () => {
      expect(isCountInPhase(6, 2, 3)).toBe(false);
      expect(isCountInPhase(7, 2, 3)).toBe(false);
    });
  });

  describe('when countInMeasures is 4 with 4 beats per measure', () => {
    it('returns true for beats 0-15', () => {
      for (let i = 0; i < 16; i++) {
        expect(isCountInPhase(i, 4, 4)).toBe(true);
      }
    });

    it('returns false from beat 16 onward', () => {
      expect(isCountInPhase(16, 4, 4)).toBe(false);
    });
  });
});

describe('calculateCountInBeatState', () => {
  describe('with 4 beats per measure', () => {
    it('calculates beat/measure within count-in', () => {
      expect(calculateCountInBeatState(0, 4)).toEqual({ beat: 1, measure: 1 });
      expect(calculateCountInBeatState(1, 4)).toEqual({ beat: 2, measure: 1 });
      expect(calculateCountInBeatState(2, 4)).toEqual({ beat: 3, measure: 1 });
      expect(calculateCountInBeatState(3, 4)).toEqual({ beat: 4, measure: 1 });
      expect(calculateCountInBeatState(4, 4)).toEqual({ beat: 1, measure: 2 });
      expect(calculateCountInBeatState(7, 4)).toEqual({ beat: 4, measure: 2 });
    });
  });

  describe('with 3 beats per measure', () => {
    it('calculates beat/measure within count-in', () => {
      expect(calculateCountInBeatState(0, 3)).toEqual({ beat: 1, measure: 1 });
      expect(calculateCountInBeatState(2, 3)).toEqual({ beat: 3, measure: 1 });
      expect(calculateCountInBeatState(3, 3)).toEqual({ beat: 1, measure: 2 });
      expect(calculateCountInBeatState(5, 3)).toEqual({ beat: 3, measure: 2 });
    });
  });
});
