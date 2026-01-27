import PropTypes from 'prop-types';

const BeatIndicator = ({
  currentBeat,
  currentMeasure,
  beatsPerMeasure,
  playEveryNMeasures,
  isPlaying,
}) => {
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

BeatIndicator.propTypes = {
  currentBeat: PropTypes.number.isRequired,
  currentMeasure: PropTypes.number.isRequired,
  beatsPerMeasure: PropTypes.number.isRequired,
  playEveryNMeasures: PropTypes.number.isRequired,
  isPlaying: PropTypes.bool.isRequired,
};

export default BeatIndicator;
