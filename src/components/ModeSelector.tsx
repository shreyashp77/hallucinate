import type { StreamMode } from '../hooks/useStream';

interface Props {
  mode: StreamMode;
  onChange: (m: StreamMode) => void;
  disabled: boolean;
}

export function ModeSelector({ mode, onChange, disabled }: Props) {
  return (
    <div className="mode-selector">
      <button
        className={`mode-btn ${mode === 'text' ? 'active' : ''}`}
        onClick={() => onChange('text')}
        disabled={disabled}
      >
        Plain Text
      </button>
      <button
        className={`mode-btn ${mode === 'code' ? 'active' : ''}`}
        onClick={() => onChange('code')}
        disabled={disabled}
      >
        Code
      </button>
    </div>
  );
}
