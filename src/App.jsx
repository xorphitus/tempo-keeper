import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [tempo, setTempo] = useState(120);
  const [timeSignature, setTimeSignature] = useState(4);
  const [measures, setMeasures] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [currentMeasure, setCurrentMeasure] = useState(1);

  const intervalRef = useRef(null);
  const audioContextRef = useRef(null);

  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  };

  const playClick = (isAccent = false) => {
    initAudioContext();
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = isAccent ? 800 : 400;
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  };

  /**
   * Determines whether a sound should play based on the measures pattern
   * @param {number} measures - The N value for the pattern (play 1 measure, mute N-1 measures)
   * @param {number} currentMeasure - The current measure number (1-indexed)
   * @returns {boolean} - True if sound should play, false otherwise
   */
  const shouldPlay = (measures, currentMeasure) => {
    // When measures=1, always play
    // When measures=N, play only when currentMeasure % N === 1
    // This means: play on measures 1, N+1, 2N+1, 3N+1, etc.
    return currentMeasure % measures === 1;
  };

  const startMetronome = () => {
    const beatInterval = 60000 / tempo;
    let measureCounter = currentMeasure;

    intervalRef.current = setInterval(() => {
      setCurrentBeat(prevBeat => {
        const nextBeat = (prevBeat + 1) % timeSignature;

        // Update measure when we complete a full measure
        if (prevBeat === timeSignature - 1) {
          measureCounter++;
          setCurrentMeasure(measureCounter);
        }

        // Check if sound should play based on the measures pattern
        if (shouldPlay(measures, measureCounter)) {
          playClick(prevBeat === timeSignature - 1);
        }

        return nextBeat;
      });
    }, beatInterval);
  };

  const stopMetronome = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setCurrentBeat(0);
    setCurrentMeasure(1);
  };

  const toggleMetronome = () => {
    if (isPlaying) {
      stopMetronome();
    } else {
      startMetronome();
    }
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    if (isPlaying) {
      stopMetronome();
      startMetronome();
    }
  }, [tempo]);

  useEffect(() => {
    // Stop metronome and reset measure when time signature or measures change
    stopMetronome();
    setIsPlaying(false);
    setCurrentMeasure(1);
  }, [timeSignature, measures]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const renderBeats = () => {
    return Array.from({ length: timeSignature }, (_, index) => (
      <div
        key={index}
        className={`beat ${index === currentBeat && isPlaying ? 'active' : ''} ${index === 0 ? 'accent' : ''}`}
      >
        {index + 1}
      </div>
    ));
  };

  return (
    <div className="app">
      <h1>Tempo Keeper</h1>

      <div className="controls">
        <div className="control-group">
          <label htmlFor="tempo">Tempo (BPM)</label>
          <input
            type="range"
            id="tempo"
            min="40"
            max="208"
            value={tempo}
            onChange={e => setTempo(parseInt(e.target.value))}
          />
          <span className="value-display">{tempo}</span>
        </div>

        <div className="control-group">
          <label htmlFor="time-signature">Time Signature</label>
          <select
            id="time-signature"
            value={timeSignature}
            onChange={e => setTimeSignature(parseInt(e.target.value))}
          >
            <option value={2}>2/4</option>
            <option value={3}>3/4</option>
            <option value={4}>4/4</option>
            <option value={5}>5/4</option>
            <option value={6}>6/8</option>
            <option value={7}>7/8</option>
          </select>
        </div>

        <div className="control-group">
          <label htmlFor="measures">Measures</label>
          <input
            type="number"
            id="measures"
            min="1"
            value={measures}
            onChange={e => {
              const value = parseInt(e.target.value);
              if (value > 0) {
                setMeasures(value);
              }
            }}
          />
          <span className="value-display">{measures}</span>
        </div>

        <div className="control-group">
          <button className={`play-stop ${isPlaying ? 'playing' : ''}`} onClick={toggleMetronome}>
            {isPlaying ? 'Stop' : 'Play'}
          </button>
        </div>
      </div>

      <div className="beat-indicator">
        <div className="beats">{renderBeats()}</div>
      </div>
    </div>
  );
}

export default App;
