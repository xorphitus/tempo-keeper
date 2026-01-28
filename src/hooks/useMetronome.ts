import { useState, useEffect, useRef, useCallback } from 'react';
import {
  validateBpm,
  validateBeatsPerMeasure,
  validatePlayEveryNMeasures,
  isSoundingMeasure,
  isFirstBeatOfMeasure,
  calculateSecondsPerBeat,
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

  // Schedule notes ahead of time for precise timing
  useEffect(() => {
    scheduleNoteRef.current = () => {
      const secondsPerBeat = calculateSecondsPerBeat(bpm);
      const audioContext = audioContextRef.current;

      if (!audioContext) return;

      while (nextNoteTimeRef.current < audioContext.currentTime + 0.1) {
        const currentBeatInMeasure = beatCountRef.current % beatsPerMeasure;
        const isFirstBeat = isFirstBeatOfMeasure(beatCountRef.current, beatsPerMeasure);

        // Determine if we should play sound on this measure
        const shouldPlayThisMeasure = isSoundingMeasure(
          measureCountRef.current,
          playEveryNMeasures
        );

        if (shouldPlayThisMeasure) {
          playClick(nextNoteTimeRef.current, isFirstBeat);
        }

        // Update UI state
        setCurrentBeat(currentBeatInMeasure + 1);
        setCurrentMeasure(measureCountRef.current);

        // Move to next beat
        nextNoteTimeRef.current += secondsPerBeat;
        beatCountRef.current++;

        // Check if we've completed a measure
        if (isFirstBeatOfMeasure(beatCountRef.current, beatsPerMeasure)) {
          measureCountRef.current++;
        }
      }

      timerIdRef.current = window.setTimeout(scheduleNoteRef.current, 25);
    };
  }, [bpm, beatsPerMeasure, playEveryNMeasures, playClick]);

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
    start,
    stop,
  };
};

export default useMetronome;
