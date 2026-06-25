import type { StreamState } from '../hooks/useStream';

interface Props {
  state: StreamState;
  targetTps: number;
  jitter: boolean;
  onToggleJitter: () => void;
}

export function StatsBar({ state, targetTps, jitter, onToggleJitter }: Props) {
  const { status, currentIndex, totalTokens, elapsedMs, actualTps } = state;
  const active = status === 'streaming' || status === 'paused' || status === 'done';

  if (!active) return null;

  const elapsed = (elapsedMs / 1000).toFixed(1);
  const pct = totalTokens > 0 ? Math.round((currentIndex / totalTokens) * 100) : 0;
  const barW = `${Math.min(pct, 100)}%`;

  return (
    <div className="stats-bar">
      <div className="stats-row">
        <span className="stat">
          Tokens: <strong>{currentIndex}</strong> / {totalTokens}
        </span>
        <span className="stat">
          Elapsed: <strong>{elapsed}s</strong>
        </span>
        <span className="stat">
          Actual TPS: <strong>{actualTps}</strong>
          {status === 'streaming' && actualTps < targetTps * 0.9 && (
            <span className="stat-warn"> (target: {targetTps})</span>
          )}
        </span>
        <label className="jitter-toggle">
          <input type="checkbox" checked={jitter} onChange={onToggleJitter} />
          Jitter
        </label>
      </div>
      <div className="progress-track">
        <div className="progress-fill" style={{ width: barW }} />
      </div>
    </div>
  );
}
