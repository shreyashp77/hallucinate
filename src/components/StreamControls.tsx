import type { StreamStatus } from '../hooks/useStream';

interface Props {
  status: StreamStatus;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
}

export function StreamControls({ status, onStart, onPause, onResume, onStop }: Props) {
  const isIdle = status === 'idle';
  const isStreaming = status === 'streaming';
  const isPaused = status === 'paused';
  const isDone = status === 'done';

  return (
    <div className="stream-controls">
      {(isIdle || isDone) && (
        <button className="ctrl-btn primary" onClick={onStart}>
          Start
        </button>
      )}
      {isStreaming && (
        <button className="ctrl-btn" onClick={onPause}>
          Pause
        </button>
      )}
      {isPaused && (
        <button className="ctrl-btn primary" onClick={onResume}>
          Resume
        </button>
      )}
      {(isStreaming || isPaused) && (
        <button className="ctrl-btn danger" onClick={onStop}>
          Stop
        </button>
      )}
    </div>
  );
}
