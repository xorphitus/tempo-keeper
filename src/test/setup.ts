import '@testing-library/jest-dom';

interface MockOscillator {
  frequency: { value: number };
  connect: () => void;
  start: () => void;
  stop: () => void;
}

interface MockGainNode {
  gain: {
    value: number;
    setValueAtTime: () => void;
    exponentialRampToValueAtTime: () => void;
  };
  connect: () => void;
}

// Mock Web Audio API for tests
class MockAudioContext {
  currentTime = 0;
  state = 'running';

  createOscillator(): MockOscillator {
    return {
      frequency: { value: 0 },
      connect: () => {},
      start: () => {},
      stop: () => {},
    };
  }

  createGain(): MockGainNode {
    return {
      gain: {
        value: 0,
        setValueAtTime: () => {},
        exponentialRampToValueAtTime: () => {},
      },
      connect: () => {},
    };
  }

  get destination(): object {
    return {};
  }

  resume(): Promise<void> {
    return Promise.resolve();
  }

  close(): Promise<void> {
    return Promise.resolve();
  }
}

// Mock AudioContext globally
globalThis.AudioContext = MockAudioContext as unknown as typeof AudioContext;
(globalThis as typeof globalThis & { webkitAudioContext: typeof AudioContext }).webkitAudioContext =
  MockAudioContext as unknown as typeof AudioContext;
