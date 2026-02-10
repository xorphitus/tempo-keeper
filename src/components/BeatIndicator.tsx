import { isSoundingMeasure } from '../domain/metronome';

interface BeatIndicatorProps {
  currentBeat: number;
  currentMeasure: number;
  beatsPerMeasure: number;
  playEveryNMeasures: number;
  isPlaying: boolean;
  isCountingIn: boolean;
}

const BeatIndicator = ({
  currentBeat,
  currentMeasure,
  beatsPerMeasure,
  playEveryNMeasures,
  isPlaying,
  isCountingIn,
}: BeatIndicatorProps) => {
  const isSounding = isSoundingMeasure(currentMeasure, playEveryNMeasures);

  const measureLabel = isCountingIn ? 'Count-in' : 'Measure';
  const valueClass = isCountingIn ? 'counting-in' : isSounding ? 'sounding' : 'silent';
  const statusText = isCountingIn ? '(Count-in)' : isSounding ? '(Playing)' : '(Silent)';

  return (
    <div className="beat-indicator">
      <div className="measure-info">
        <div className="measure-number">
          <span className="label">{measureLabel}</span>
          <span className={`value ${valueClass}`}>{isPlaying ? currentMeasure : '-'}</span>
          {isPlaying && <span className="measure-status">{statusText}</span>}
        </div>
      </div>

      <div className="beats-display">
        {Array.from({ length: beatsPerMeasure }, (_, i) => {
          const beatNumber = i + 1;
          const isActive = currentBeat === beatNumber;
          const isFirstBeat = beatNumber === 1;

          return (
            <div
              key={beatNumber}
              className={`beat ${isActive && isPlaying ? 'active' : ''} ${
                isFirstBeat ? 'first-beat' : ''
              } ${isActive && isPlaying && isSounding && !isCountingIn ? 'sounding' : ''} ${
                isActive && isPlaying && isCountingIn ? 'counting-in' : ''
              }`}
            >
              <div className="beat-circle"></div>
              <span className="beat-number">{beatNumber}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BeatIndicator;
