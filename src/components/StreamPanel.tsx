import { useState, useEffect } from 'react';
import { useStream, type StreamMode } from '../hooks/useStream';
import { subscribe } from '../utils/streamBus';
import { TpsInput } from './TpsInput';
import { ModeSelector } from './ModeSelector';
import { StreamControls } from './StreamControls';
import { StreamOutput } from './StreamOutput';
import { StatsBar } from './StatsBar';

interface Props {
  label?: string;
}

export function StreamPanel({ label }: Props) {
  const [tps, setTps] = useState(50);
  const [mode, setMode] = useState<StreamMode>('text');
  const [jitter, setJitter] = useState(false);
  const { state, start, pause, resume, stop } = useStream();

  const isBusy = state.status === 'streaming' || state.status === 'paused';

  useEffect(() => {
    const unsub = subscribe(action => {
      if (action === 'togglePause') {
        if (state.status === 'streaming') pause();
        else if (state.status === 'paused') resume();
      }
    });
    return unsub;
  }, [state.status, pause, resume]);

  return (
    <div className="stream-panel">
      {label && <h3 className="panel-label">{label}</h3>}
      <div className="panel-controls">
        <TpsInput value={tps} onChange={setTps} disabled={isBusy} />
        <ModeSelector mode={mode} onChange={setMode} disabled={isBusy} />
        <StreamControls
          status={state.status}
          onStart={() => start(tps, mode, jitter)}
          onPause={pause}
          onResume={resume}
          onStop={stop}
        />
      </div>
      <StreamOutput
        text={state.accumulatedText}
        status={state.status}
        mode={mode}
        language={state.language}
      />
      <StatsBar
        state={state}
        targetTps={tps}
        jitter={jitter}
        onToggleJitter={() => setJitter(j => !j)}
      />
    </div>
  );
}
