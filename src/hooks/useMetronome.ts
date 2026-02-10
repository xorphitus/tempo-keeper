import { useState, useEffect, useRef, useCallback } from 'react';
import {
  validateBpm,
  validateBeatsPerMeasure,
  validatePlayEveryNMeasures,
  validateCountInMeasures,
  isSoundingMeasure,
  isCountInPhase,
  isFirstBeatOfMeasure,
  calculateSecondsPerBeat,
  calculateCountInBeatState,
} from '../domain/metronome';

interface UseMetronomeReturn {
  isPlaying: boolean;
  bpm: number;
  setBpm: (bpm: number) => void;
  beatsPerMeasure: number;
  setBeatsPerMeasure: (beats: number) => void;
  currentBeat: number;
  currentMeasure: number;
  playEveryNMeasures: number;
  setPlayEveryNMeasures: (n: number) => void;
  countInMeasures: number;
  setCountInMeasures: (n: number) => void;
  isCountingIn: boolean;
  start: () => void;
  stop: () => void;
}

const useMetronome = (): UseMetronomeReturn => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [bpm, setBpmInternal] = useState(120);
  const [beatsPerMeasure, setBeatsPerMeasureInternal] = useState(4);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [currentMeasure, setCurrentMeasure] = useState(1);
  const [playEveryNMeasures, setPlayEveryNMeasuresInternal] = useState(1);
  const [countInMeasures, setCountInMeasuresInternal] = useState(0);
  const [isCountingIn, setIsCountingIn] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef(0);
  const timerIdRef = useRef<number | null>(null);
  const beatCountRef = useRef(0);
  const measureCountRef = useRef(1);
  const scheduleNoteRef = useRef<() => void>(() => {});

  // Validated setter for BPM (40-240 range)
  const setBpm = useCallback((value: number) => {
    const validated = validateBpm(value);
    if (validated !== null) {
      setBpmInternal(validated);
    }
  }, []);

  // Validated setter for beats per measure (1-16 range)
  const setBeatsPerMeasure = useCallback((value: number) => {
    const validated = validateBeatsPerMeasure(value);
    if (validated !== null) {
      setBeatsPerMeasureInternal(validated);
    }
  }, []);

  // Validated setter for play every N measures (1-32 range)
  const setPlayEveryNMeasures = useCallback((value: number) => {
    const validated = validatePlayEveryNMeasures(value);
    if (validated !== null) {
      setPlayEveryNMeasuresInternal(validated);
    }
  }, []);

  // Validated setter for count-in measures (0-4 range)
  const setCountInMeasures = useCallback((value: number) => {
    const validated = validateCountInMeasures(value);
    if (validated !== null) {
      setCountInMeasuresInternal(validated);
    }
  }, []);

  // Initialize Web Audio API with error handling
  useEffect(() => {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioContextRef.current = new AudioContextClass();
      } else {
        console.error('Web Audio API is not supported in this browser');
      }
    } catch (error) {
      console.error('Failed to initialize AudioContext:', error);
    }
    return () => {
      if (audioContextRef.current) {
        void audioContextRef.current.close().catch(error => {
          console.error('Failed to close AudioContext:', error);
        });
      }
    };
  }, []);

  // Play a click sound
  const playClick = useCallback((time: number, isFirstBeatOfMeasure: boolean) => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Higher pitch for first beat of measure, lower for others
    oscillator.frequency.value = isFirstBeatOfMeasure ? 1000 : 800;

    gainNode.gain.setValueAtTime(0.3, time);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.1);

    oscillator.start(time);
    oscillator.stop(time + 0.1);
  }, []);

  // Play a count-in click sound (distinct triangle waveform)
  const playCountInClick = useCallback((time: number, isFirstBeat: boolean) => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'triangle';
    oscillator.frequency.value = isFirstBeat ? 1200 : 1000;

    gainNode.gain.setValueAtTime(0.3, time);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.1);

    oscillator.start(time);
    oscillator.stop(time + 0.1);
  }, []);

  // Schedule notes ahead of time for precise timing
  useEffect(() => {
    scheduleNoteRef.current = () => {
      const secondsPerBeat = calculateSecondsPerBeat(bpm);
      const audioContext = audioContextRef.current;
      const totalCountInBeats = countInMeasures * beatsPerMeasure;

      if (!audioContext) return;

      while (nextNoteTimeRef.current < audioContext.currentTime + 0.1) {
        const inCountIn = isCountInPhase(beatCountRef.current, countInMeasures, beatsPerMeasure);

        if (inCountIn) {
          // Count-in phase
          const countInState = calculateCountInBeatState(beatCountRef.current, beatsPerMeasure);
          const isFirstBeat = countInState.beat === 1;

          playCountInClick(nextNoteTimeRef.current, isFirstBeat);

          setCurrentBeat(countInState.beat);
          setCurrentMeasure(countInState.measure);
          setIsCountingIn(true);
        } else {
          // Normal playback phase
          const effectiveBeatCount = beatCountRef.current - totalCountInBeats;
          const currentBeatInMeasure = effectiveBeatCount % beatsPerMeasure;
          const isFirstBeat = isFirstBeatOfMeasure(effectiveBeatCount, beatsPerMeasure);

          // Update measure counter on first beat after count-in, or at measure boundaries
          if (effectiveBeatCount === 0) {
            measureCountRef.current = 1;
          }

          const shouldPlayThisMeasure = isSoundingMeasure(
            measureCountRef.current,
            playEveryNMeasures
          );

          if (shouldPlayThisMeasure) {
            playClick(nextNoteTimeRef.current, isFirstBeat);
          }

          setCurrentBeat(currentBeatInMeasure + 1);
          setCurrentMeasure(measureCountRef.current);
          setIsCountingIn(false);
        }

        // Move to next beat
        nextNoteTimeRef.current += secondsPerBeat;
        beatCountRef.current++;

        // Check if we've completed a measure (for normal playback measure tracking)
        if (!isCountInPhase(beatCountRef.current, countInMeasures, beatsPerMeasure)) {
          const effectiveBeatCount = beatCountRef.current - totalCountInBeats;
          if (effectiveBeatCount > 0 && isFirstBeatOfMeasure(effectiveBeatCount, beatsPerMeasure)) {
            measureCountRef.current++;
          }
        }
      }

      timerIdRef.current = window.setTimeout(scheduleNoteRef.current, 25);
    };
  }, [bpm, beatsPerMeasure, playEveryNMeasures, countInMeasures, playClick, playCountInClick]);

  const scheduleNote = useCallback(() => {
    scheduleNoteRef.current();
  }, []);

  // Start metronome
  const start = useCallback(() => {
    if (isPlaying) return;

    const audioContext = audioContextRef.current;
    if (!audioContext) {
      console.error('AudioContext is not initialized');
      return;
    }

    // Resume AudioContext if suspended (browser autoplay policy)
    if (audioContext.state === 'suspended') {
      void audioContext.resume().catch(error => {
        console.error('Failed to resume AudioContext:', error);
      });
    }

    beatCountRef.current = 0;
    measureCountRef.current = 1;
    nextNoteTimeRef.current = audioContext.currentTime;
    setCurrentBeat(1);
    setCurrentMeasure(1);
    setIsPlaying(true);
  }, [isPlaying]);

  // Stop metronome
  const stop = useCallback(() => {
    setIsPlaying(false);
    setIsCountingIn(false);
    if (timerIdRef.current !== null) {
      clearTimeout(timerIdRef.current);
      timerIdRef.current = null;
    }
    setCurrentBeat(0);
    setCurrentMeasure(1);
    beatCountRef.current = 0;
    measureCountRef.current = 1;
  }, []);

  // Schedule notes when playing
  useEffect(() => {
    if (isPlaying) {
      scheduleNote();
    } else if (timerIdRef.current !== null) {
      clearTimeout(timerIdRef.current);
      timerIdRef.current = null;
    }

    return () => {
      if (timerIdRef.current !== null) {
        clearTimeout(timerIdRef.current);
      }
    };
  }, [isPlaying, scheduleNote]);

  return {
    isPlaying,
    bpm,
    setBpm,
    beatsPerMeasure,
    setBeatsPerMeasure,
    currentBeat,
    currentMeasure,
    playEveryNMeasures,
    setPlayEveryNMeasures,
    countInMeasures,
    setCountInMeasures,
    isCountingIn,
    start,
    stop,
  };
};

export default useMetronome;
