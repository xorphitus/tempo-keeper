import { useState, useEffect, useRef, useCallback } from 'react';

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
  const [bpm, setBpm] = useState(120);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [currentMeasure, setCurrentMeasure] = useState(1);
  const [playEveryNMeasures, setPlayEveryNMeasures] = useState(1);

  const audioContextRef = useRef<AudioContext | null>(null);
  const nextNoteTimeRef = useRef(0);
  const timerIdRef = useRef<number | null>(null);
  const beatCountRef = useRef(0);
  const measureCountRef = useRef(1);

  // Initialize Web Audio API
  useEffect(() => {
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioContextRef.current = new AudioContextClass();
    }
    return () => {
      if (audioContextRef.current) {
        void audioContextRef.current.close();
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
  const scheduleNote = useCallback(() => {
    const secondsPerBeat = 60.0 / bpm;
    const audioContext = audioContextRef.current;

    if (!audioContext) return;

    while (nextNoteTimeRef.current < audioContext.currentTime + 0.1) {
      const currentBeatInMeasure = beatCountRef.current % beatsPerMeasure;
      const isFirstBeatOfMeasure = currentBeatInMeasure === 0;

      // Determine if we should play sound on this measure
      const shouldPlayThisMeasure = measureCountRef.current % playEveryNMeasures === 1;

      if (shouldPlayThisMeasure) {
        playClick(nextNoteTimeRef.current, isFirstBeatOfMeasure);
      }

      // Update UI state
      setCurrentBeat(currentBeatInMeasure + 1);
      setCurrentMeasure(measureCountRef.current);

      // Move to next beat
      nextNoteTimeRef.current += secondsPerBeat;
      beatCountRef.current++;

      // Check if we've completed a measure
      if (beatCountRef.current % beatsPerMeasure === 0) {
        measureCountRef.current++;
      }
    }

    timerIdRef.current = window.setTimeout(scheduleNote, 25);
  }, [bpm, beatsPerMeasure, playEveryNMeasures, playClick]);

  // Start metronome
  const start = useCallback(() => {
    if (isPlaying) return;

    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    if (audioContext.state === 'suspended') {
      void audioContext.resume();
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
