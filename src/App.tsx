import './App.css';
import useMetronome from './hooks/useMetronome';
import MetronomeControls from './components/MetronomeControls';
import BeatIndicator from './components/BeatIndicator';

function App() {
  const {
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
  } = useMetronome();

  return (
    <div className="app">
      <header className="app-header">
        <h1>Tempo Keeper</h1>
      </header>

      <main className="app-main">
        <BeatIndicator
          currentBeat={currentBeat}
          currentMeasure={currentMeasure}
          beatsPerMeasure={beatsPerMeasure}
          playEveryNMeasures={playEveryNMeasures}
          isPlaying={isPlaying}
        />

        <MetronomeControls
          bpm={bpm}
          setBpm={setBpm}
          beatsPerMeasure={beatsPerMeasure}
          setBeatsPerMeasure={setBeatsPerMeasure}
          playEveryNMeasures={playEveryNMeasures}
          setPlayEveryNMeasures={setPlayEveryNMeasures}
          isPlaying={isPlaying}
          onStart={start}
          onStop={stop}
        />

        <div className="training-info">
          <h2>How to Use</h2>
          <ol>
            <li>Set your desired tempo (BPM) and time signature</li>
            <li>
              Configure &quot;Play Every N Measures&quot; - the metronome will only sound on measure
              1, N+1, 2N+1, etc.
            </li>
            <li>Press Start and practice keeping tempo during silent measures</li>
            <li>Verify your internal timing when the metronome sounds again</li>
          </ol>
        </div>
      </main>
    </div>
  );
}

export default App;
