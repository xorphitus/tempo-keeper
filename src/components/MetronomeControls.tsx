import { ChangeEvent, useEffect, useState } from 'react';

const COUNT_IN_OPTIONS = [0, 1, 2, 3, 4] as const;
const PLAY_EVERY_N_OPTIONS = Array.from({ length: 16 }, (_, i) => i + 1);

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
  countInMeasures: number;
  setCountInMeasures: (n: number) => void;
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
  countInMeasures,
  setCountInMeasures,
  isPlaying,
  onStart,
  onStop,
}: MetronomeControlsProps) => {
  const [bpmDisplay, setBpmDisplay] = useState(String(bpm));

  useEffect(() => {
    setBpmDisplay(String(bpm));
  }, [bpm]);

  const commonTimeSignatures: TimeSignature[] = [
    { label: '4/4', value: 4 },
    { label: '3/4', value: 3 },
    { label: '6/8', value: 6 },
    { label: '5/4', value: 5 },
    { label: '7/8', value: 7 },
    { label: '2/4', value: 2 },
  ];

  const handleBpmDisplayChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBpmDisplay(e.target.value);
  };

  const handleBpmBlur = () => {
    const value = parseInt(bpmDisplay, 10);
    if (!isNaN(value)) {
      setBpm(Math.max(40, Math.min(240, value)));
    } else {
      setBpmDisplay(String(bpm));
    }
  };

  const handleBpmRangeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setBpm(Math.max(40, Math.min(240, value)));
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
            min="40"
            max="240"
            value={bpm}
            onChange={handleBpmRangeChange}
            disabled={isPlaying}
          />
          <input
            type="number"
            min="40"
            max="240"
            value={bpmDisplay}
            onChange={handleBpmDisplayChange}
            onBlur={handleBpmBlur}
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
          <select
            id="play-every-n"
            value={playEveryNMeasures}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setPlayEveryNMeasures(parseInt(e.target.value, 10))
            }
            disabled={isPlaying}
          >
            {PLAY_EVERY_N_OPTIONS.map(n => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span className="help-text">
            {playEveryNMeasures === 1
              ? 'Playing every measure'
              : `Playing 1 out of every ${playEveryNMeasures} measures`}
          </span>
        </div>
      </div>

      <div className="control-group">
        <label htmlFor="count-in">Count-In Measures</label>
        <div className="n-measures-control">
          <select
            id="count-in"
            value={countInMeasures}
            onChange={(e: ChangeEvent<HTMLSelectElement>) =>
              setCountInMeasures(parseInt(e.target.value, 10))
            }
            disabled={isPlaying}
          >
            {COUNT_IN_OPTIONS.map(n => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <span className="help-text">
            {countInMeasures === 0
              ? 'No count-in'
              : `${countInMeasures} measure${countInMeasures > 1 ? 's' : ''} count-in before playing`}
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
