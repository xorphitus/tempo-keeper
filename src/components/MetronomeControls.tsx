import { ChangeEvent } from 'react';

interface TimeSignature {
  label: string;
  value: number;
}

interface MetronomeControlsProps {
  bpm: number;
  setBpm: (bpm: number) => void;
  beatsPerMeasure: number;
  setBeatsPerMeasure: (beats: number) => void;
  playEveryNMeasures: number;
  setPlayEveryNMeasures: (n: number) => void;
  isPlaying: boolean;
  onStart: () => void;
  onStop: () => void;
}

const MetronomeControls = ({
  bpm,
  setBpm,
  beatsPerMeasure,
  setBeatsPerMeasure,
  playEveryNMeasures,
  setPlayEveryNMeasures,
  isPlaying,
  onStart,
  onStop,
}: MetronomeControlsProps) => {
  const commonTimeSignatures: TimeSignature[] = [
    { label: '4/4', value: 4 },
    { label: '3/4', value: 3 },
    { label: '6/8', value: 6 },
    { label: '5/4', value: 5 },
    { label: '7/8', value: 7 },
    { label: '2/4', value: 2 },
  ];

  const handleBpmChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setBpm(Math.max(30, Math.min(300, value)));
    }
  };

  const handlePlayEveryNChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      setPlayEveryNMeasures(value);
    }
  };

  return (
    <div className="metronome-controls">
      <div className="control-group">
        <label htmlFor="bpm">Tempo (BPM)</label>
        <div className="bpm-control">
          <input
            id="bpm"
            type="range"
            min="30"
            max="300"
            value={bpm}
            onChange={handleBpmChange}
            disabled={isPlaying}
          />
          <input
            type="number"
            min="30"
            max="300"
            value={bpm}
            onChange={handleBpmChange}
            disabled={isPlaying}
            className="bpm-number"
          />
        </div>
      </div>

      <div className="control-group">
        <label htmlFor="time-signature">Time Signature</label>
        <select
          id="time-signature"
          value={beatsPerMeasure}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setBeatsPerMeasure(parseInt(e.target.value, 10))
          }
          disabled={isPlaying}
        >
          {commonTimeSignatures.map(sig => (
            <option key={sig.value} value={sig.value}>
              {sig.label}
            </option>
          ))}
        </select>
      </div>

      <div className="control-group">
        <label htmlFor="play-every-n">Play Every N Measures</label>
        <div className="n-measures-control">
          <input
            id="play-every-n"
            type="number"
            min="1"
            max="16"
            value={playEveryNMeasures}
            onChange={handlePlayEveryNChange}
            disabled={isPlaying}
          />
          <span className="help-text">
            {playEveryNMeasures === 1
              ? 'Playing every measure'
              : `Playing 1 out of every ${playEveryNMeasures} measures`}
          </span>
        </div>
      </div>

      <div className="control-group">
        <button onClick={isPlaying ? onStop : onStart} className="play-button">
          {isPlaying ? 'Stop' : 'Start'}
        </button>
      </div>
    </div>
  );
};

export default MetronomeControls;
