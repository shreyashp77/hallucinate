import { useState } from 'react';

const PRESETS = [10, 50, 100, 500, 1000];

interface Props {
  value: number;
  onChange: (v: number) => void;
  disabled: boolean;
}

export function TpsInput({ value, onChange, disabled }: Props) {
  const [raw, setRaw] = useState(String(value));

  const handleChange = (v: string) => {
    setRaw(v);
    const n = parseInt(v, 10);
    if (!isNaN(n) && n > 0) onChange(n);
  };

  const handleBlur = () => {
    const n = parseInt(raw, 10);
    if (isNaN(n) || n < 1) {
      setRaw(String(value));
    } else {
      setRaw(String(n));
    }
  };

  return (
    <div className="tps-input">
      <label>TPS</label>
      <input
        type="number"
        min={1}
        max={10000}
        value={raw}
        onChange={e => handleChange(e.target.value)}
        onBlur={handleBlur}
        disabled={disabled}
      />
      <div className="presets">
        {PRESETS.map(p => (
          <button
            key={p}
            className={`preset-btn ${value === p ? 'active' : ''}`}
            onClick={() => { setRaw(String(p)); onChange(p); }}
            disabled={disabled}
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
