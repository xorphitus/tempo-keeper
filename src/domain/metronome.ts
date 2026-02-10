/**
 * Pure domain functions for metronome logic.
 * These functions are framework-agnostic and can be easily unit tested.
 */

// Validation constants
export const BPM_MIN = 40;
export const BPM_MAX = 240;
export const BEATS_PER_MEASURE_MIN = 1;
export const BEATS_PER_MEASURE_MAX = 16;
export const PLAY_EVERY_N_MIN = 1;
export const PLAY_EVERY_N_MAX = 32;
export const COUNT_IN_MEASURES_MIN = 0;
export const COUNT_IN_MEASURES_MAX = 4;

/**
 * Validation result type.
 * Returns the validated value if valid, null otherwise.
 */
export type ValidationResult = number | null;

/**
 * Validates and normalizes a BPM value.
 * @param value - The BPM value to validate
 * @returns The floored BPM if valid (40-240), null otherwise
 */
export const validateBpm = (value: number): ValidationResult => {
  if (isNaN(value) || value < BPM_MIN || value > BPM_MAX) {
    return null;
  }
  return Math.floor(value);
};

/**
 * Validates and normalizes beats per measure value.
 * @param value - The beats per measure value to validate
 * @returns The floored value if valid (1-16), null otherwise
 */
export const validateBeatsPerMeasure = (value: number): ValidationResult => {
  if (isNaN(value) || value < BEATS_PER_MEASURE_MIN || value > BEATS_PER_MEASURE_MAX) {
    return null;
  }
  return Math.floor(value);
};

/**
 * Validates and normalizes play every N measures value.
 * @param value - The play every N value to validate
 * @returns The floored value if valid (1-32), null otherwise
 */
export const validatePlayEveryNMeasures = (value: number): ValidationResult => {
  if (isNaN(value) || value < PLAY_EVERY_N_MIN || value > PLAY_EVERY_N_MAX) {
    return null;
  }
  return Math.floor(value);
};

/**
 * Determines if a measure should produce sound based on the training interval.
 * When playEveryN is 1, all measures play sound.
 * When playEveryN is N > 1, only measures where measure % N === 1 play sound.
 *
 * @param measure - The current measure number (1-indexed)
 * @param playEveryN - Play sound every N measures
 * @returns true if the measure should produce sound
 */
export const isSoundingMeasure = (measure: number, playEveryN: number): boolean => {
  return playEveryN === 1 || measure % playEveryN === 1;
};

/**
 * Beat progression state
 */
export interface BeatState {
  readonly beat: number; // 1-indexed beat within measure
  readonly measure: number; // 1-indexed measure number
}

/**
 * Calculates the next beat state from the current beat count.
 * This is used internally by the scheduler.
 *
 * @param beatCount - The total beat count (0-indexed, increments each beat)
 * @param beatsPerMeasure - Number of beats per measure
 * @returns The beat state with 1-indexed beat and measure
 */
export const calculateBeatState = (beatCount: number, beatsPerMeasure: number): BeatState => {
  const beatInMeasure = beatCount % beatsPerMeasure;
  const measure = Math.floor(beatCount / beatsPerMeasure) + 1;

  return {
    beat: beatInMeasure + 1, // Convert to 1-indexed
    measure,
  };
};

/**
 * Determines if the current beat is the first beat of a measure.
 *
 * @param beatCount - The total beat count (0-indexed)
 * @param beatsPerMeasure - Number of beats per measure
 * @returns true if this is the first beat of a measure
 */
export const isFirstBeatOfMeasure = (beatCount: number, beatsPerMeasure: number): boolean => {
  return beatCount % beatsPerMeasure === 0;
};

/**
 * Validates and normalizes count-in measures value.
 * @param value - The count-in measures value to validate
 * @returns The floored value if valid (0-4), null otherwise
 */
export const validateCountInMeasures = (value: number): ValidationResult => {
  if (isNaN(value) || value < COUNT_IN_MEASURES_MIN || value > COUNT_IN_MEASURES_MAX) {
    return null;
  }
  return Math.floor(value);
};

/**
 * Determines if the current beat is within the count-in phase.
 *
 * @param beatCount - The total beat count from the start (0-indexed)
 * @param countInMeasures - Number of count-in measures (0-4)
 * @param beatsPerMeasure - Number of beats per measure
 * @returns true if still in the count-in phase
 */
export const isCountInPhase = (
  beatCount: number,
  countInMeasures: number,
  beatsPerMeasure: number
): boolean => {
  return countInMeasures > 0 && beatCount < countInMeasures * beatsPerMeasure;
};

/**
 * Calculates the beat state within the count-in phase.
 * Returns 1-indexed beat and measure within the count-in.
 *
 * @param beatCount - The total beat count from the start (0-indexed)
 * @param beatsPerMeasure - Number of beats per measure
 * @returns The beat state with 1-indexed beat and measure within count-in
 */
export const calculateCountInBeatState = (
  beatCount: number,
  beatsPerMeasure: number
): BeatState => {
  return calculateBeatState(beatCount, beatsPerMeasure);
};

/**
 * Calculates the time interval between beats in seconds.
 *
 * @param bpm - Beats per minute
 * @returns Seconds per beat
 */
export const calculateSecondsPerBeat = (bpm: number): number => {
  return 60.0 / bpm;
};
