interface Props {
  enabled: boolean;
  onChange: (v: boolean) => void;
}

export function CompareToggle({ enabled, onChange }: Props) {
  return (
    <button
      className={`compare-toggle ${enabled ? 'active' : ''}`}
      onClick={() => onChange(!enabled)}
    >
      [{enabled ? 'single' : 'split'}]
    </button>
  );
}
