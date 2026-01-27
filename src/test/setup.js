import '@testing-library/jest-dom';

// Mock Web Audio API for tests
class MockAudioContext {
  constructor() {
    this.currentTime = 0;
    this.state = 'running';
  }

  createOscillator() {
    return {
      frequency: { value: 0 },
      connect: () => {},
      start: () => {},
      stop: () => {},
    };
  }

  createGain() {
    return {
      gain: {
        value: 0,
        setValueAtTime: () => {},
        exponentialRampToValueAtTime: () => {},
      },
      connect: () => {},
    };
  }

  get destination() {
    return {};
  }

  resume() {
    return Promise.resolve();
  }

  close() {
    return Promise.resolve();
  }
}

// Mock AudioContext globally
global.AudioContext = MockAudioContext;
global.webkitAudioContext = MockAudioContext;
