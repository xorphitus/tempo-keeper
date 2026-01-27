interface BeatIndicatorProps {
  currentBeat: number;
  currentMeasure: number;
  beatsPerMeasure: number;
  playEveryNMeasures: number;
  isPlaying: boolean;
}

const BeatIndicator = ({
  currentBeat,
  currentMeasure,
  beatsPerMeasure,
  playEveryNMeasures,
  isPlaying,
}: BeatIndicatorProps) => {
  const isSoundingMeasure = currentMeasure % playEveryNMeasures === 1;

  return (
    <div className="beat-indicator">
      <div className="measure-info">
        <div className="measure-number">
          <span className="label">Measure</span>
          <span className={`value ${isSoundingMeasure ? 'sounding' : 'silent'}`}>
            {isPlaying ? currentMeasure : '-'}
          </span>
          {isPlaying && (
            <span className="measure-status">{isSoundingMeasure ? '(Playing)' : '(Silent)'}</span>
          )}
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
              } ${isActive && isPlaying && isSoundingMeasure ? 'sounding' : ''}`}
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
