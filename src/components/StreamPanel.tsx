import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { useStream, type StreamMode, type StreamStatus, type ContentInput } from '../hooks/useStream';
import { subscribe } from '../utils/streamBus';
import { TpsInput } from './TpsInput';
import { ModeSelector } from './ModeSelector';
import { StreamControls } from './StreamControls';
import { StreamOutput } from './StreamOutput';
import { StatsBar } from './StatsBar';

export interface StreamPanelHandle {
  start: (tps: number, mode: StreamMode, jitter: boolean, presetContent?: ContentInput) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  getStatus: () => StreamStatus;
  getTps: () => number;
}

interface Props {
  label?: string;
  showControls?: boolean;
  onStatusChange?: (status: StreamStatus) => void;
  mode?: StreamMode;
}

export const StreamPanel = forwardRef<StreamPanelHandle, Props>(({
  label,
  showControls = true,
  onStatusChange,
  mode: externalMode,
}, ref) => {
  const [tps, setTps] = useState(50);
  const [internalMode, setInternalMode] = useState<StreamMode>('text');
  const mode = externalMode ?? internalMode;
  const [jitter, setJitter] = useState(false);
  const { state, start, pause, resume, stop } = useStream();

  const isBusy = state.status === 'streaming' || state.status === 'paused';

  useImperativeHandle(ref, () => ({
    start: (t, m, j, pc) => start(t, m, j, pc),
    pause,
    resume,
    stop,
    getStatus: () => state.status,
    getTps: () => tps,
  }), [start, pause, resume, stop, state.status, tps]);

  useEffect(() => {
    onStatusChange?.(state.status);
  }, [state.status, onStatusChange]);

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
      {showControls && (
        <div className="panel-controls">
          <TpsInput value={tps} onChange={setTps} disabled={isBusy} />
          <ModeSelector mode={mode} onChange={setInternalMode} disabled={isBusy} />
          <StreamControls
            status={state.status}
            onStart={() => start(tps, mode, jitter)}
            onPause={pause}
            onResume={resume}
            onStop={stop}
          />
        </div>
      )}
      {!showControls && (
        <div className="panel-controls">
          <TpsInput value={tps} onChange={setTps} disabled={isBusy} />
        </div>
      )}
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
});
